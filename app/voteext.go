package app

import (
	"encoding/hex"
	"strconv"
	"strings"

	"github.com/btcsuite/btcd/btcec"
	abci "github.com/cometbft/cometbft/abci/types"
	sdk "github.com/cosmos/cosmos-sdk/types"

	"github.com/Fairblock/fairyring/app/keysharer"
	keysharetypes "github.com/Fairblock/fairyring/x/keyshare/types"
)

// extendVoteHandler produces one per-height keyshare in a compact VE payload.
func (app *App) extendVoteHandler() sdk.ExtendVoteHandler {
	return func(ctx sdk.Context, req *abci.RequestExtendVote) (*abci.ResponseExtendVote, error) {
		cfg, err := keysharer.LoadConfig(DefaultNodeHome) // or wherever you put keysharer.yaml
		if err != nil || !cfg.Enabled {
			return &abci.ResponseExtendVote{}, nil
		}

		if cfg.ValidatorAccount == "" || cfg.AppSecp256k1PrivHex == "" {
			// misconfigured → emit empty VE
			return &abci.ResponseExtendVote{}, nil
		}

		// Load state
		activePK, ok := app.KeyshareKeeper.GetActivePubkey(ctx)
		if !ok {
			return &abci.ResponseExtendVote{}, nil
		}
		var qpk keysharetypes.QueuedPubkey
		if q, has := app.KeyshareKeeper.GetQueuedPubkey(ctx); has {
			qpk = q
		}

		// Find our validator’s encrypted shares by ValidatorAccount (no cons addr needed)
		var mat keysharer.ShareMaterial
		mat.ActiveExpiry = activePK.Expiry
		mat.QueuedExpiry = qpk.Expiry

		for i, ek := range activePK.EncryptedKeyshares {
			if ek.Validator == cfg.ValidatorAccount {
				priv, err := getAppSecpPrivKeyFromHex(cfg.AppSecp256k1PrivHex)
				if err != nil {
					return &abci.ResponseExtendVote{}, nil
				}
				b, derr := keysharer.DecryptECIES(priv, ek.Data)
				if derr != nil {
					return &abci.ResponseExtendVote{}, nil
				}
				mat.ActiveShare = b
				mat.Index = uint32(i + 1)
				break
			}
		}
		if qpk.PublicKey != "" {
			for i, ek := range qpk.EncryptedKeyshares {
				if ek.Validator == cfg.ValidatorAccount {
					priv, err := getAppSecpPrivKeyFromHex(cfg.AppSecp256k1PrivHex)
					if err != nil {
						return &abci.ResponseExtendVote{}, nil
					}
					if b, derr := keysharer.DecryptECIES(priv, ek.Data); derr == nil {
						mat.QueuedShare = b
						if mat.Index == 0 {
							mat.Index = uint32(i + 1)
						}
					}
					break
				}
			}
		}
		if mat.Index == 0 || len(mat.ActiveShare) == 0 {
			return &abci.ResponseExtendVote{}, nil
		}

		heightFor := uint64(ctx.BlockHeight() + 1)

		scalar, idx, err := keysharer.SelectShare(mat, heightFor)
		if err != nil {
			return &abci.ResponseExtendVote{}, nil
		}

		extracted, err := keysharer.ExtractFromShare(scalar, idx, []byte(strconv.FormatUint(heightFor, 10)))
		if err != nil {
			return &abci.ResponseExtendVote{}, nil
		}

		ext, err := keysharer.MakeVE(heightFor, idx, extracted)
		if err != nil {
			return &abci.ResponseExtendVote{}, nil
		}
		return &abci.ResponseExtendVote{VoteExtension: ext}, nil
	}
}

// VerifyVoteExtension: cheap checks (size/shape). Crypto is done in PreBlocker.
func (app *App) verifyVoteExtensionHandler() sdk.VerifyVoteExtensionHandler {
	return func(ctx sdk.Context, req *abci.RequestVerifyVoteExtension) (*abci.ResponseVerifyVoteExtension, error) {
		// quick shape check
		var ve keysharetypes.KeyshareVE
		if err := keysharetypes.ModuleCdc.Unmarshal(req.VoteExtension, &ve); err != nil {
			return &abci.ResponseVerifyVoteExtension{Status: abci.ResponseVerifyVoteExtension_REJECT}, nil
		}
		if ve.KeyshareIndex < 1 || len(ve.Share) == 0 {
			return &abci.ResponseVerifyVoteExtension{Status: abci.ResponseVerifyVoteExtension_REJECT}, nil
		}

		// cache for preblocker
		H := uint64(req.Height) // verify runs for height h (the block being decided)
		consHex := hex.EncodeToString(req.ValidatorAddress)
		if app.veCache[H] == nil {
			app.veCache[H] = make(map[string][]byte)
		}
		app.veCache[H][consHex] = req.VoteExtension

		return &abci.ResponseVerifyVoteExtension{Status: abci.ResponseVerifyVoteExtension_ACCEPT}, nil
	}
}

// PreBlocker: consumes VEs from last commit (H-1), validates, stores, aggregates per-height
func (app *App) preBlocker() sdk.PreBlocker {
	return func(ctx sdk.Context, req *abci.RequestFinalizeBlock) (*sdk.ResponsePreBlock, error) {
		H := uint64(req.Height)

		// consAddr(hex) → validator bech32
		valset := app.KeyshareKeeper.GetAllValidatorSet(ctx)
		byCons := make(map[string]string, len(valset))
		for _, v := range valset {
			byCons[v.ConsAddr] = v.Validator
		}

		ves := app.veCache[H] // may be nil

		for _, vi := range req.DecidedLastCommit.Votes {
			consHex := hex.EncodeToString(vi.Validator.Address)
			payload := ves[consHex]
			if len(payload) == 0 {
				continue
			}
			var ve keysharetypes.KeyshareVE
			if err := keysharetypes.ModuleCdc.Unmarshal(payload, &ve); err != nil {
				continue
			}
			if ve.HeightFor != H || ve.KeyshareIndex < 1 || len(ve.Share) == 0 {
				continue
			}
			valAcct, ok := byCons[consHex]
			if !ok {
				continue
			}
			// reuse your keeper logic that already compiles
			if err := app.KeyshareKeeper.HandlePerBlockShare(ctx, valAcct, H, ve.KeyshareIndex, ve.Share); err != nil {
				ctx.Logger().Error("preblock: VE rejected", "err", err, "validator", valAcct, "height", H)
				continue
			}
		}

		// cleanup small cache to avoid leaks (keep only H and H+1 to be safe)
		for hh := range app.veCache {
			if hh+1 < H {
				delete(app.veCache, hh)
			}
		}

		return &sdk.ResponsePreBlock{}, nil
	}
}

func getAppSecpPrivKeyFromHex(hexStr string) (*btcec.PrivateKey, error) {
	bz, err := hex.DecodeString(strings.TrimSpace(hexStr))
	if err != nil {
		return nil, err
	}
	priv, _ := btcec.PrivKeyFromBytes(btcec.S256(), bz)
	return priv, nil
}
