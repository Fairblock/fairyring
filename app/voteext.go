package app

import (
	"encoding/hex"
	"encoding/json"
	"strconv"
	"strings"

	"github.com/btcsuite/btcd/btcec"
	abci "github.com/cometbft/cometbft/abci/types"
	sdk "github.com/cosmos/cosmos-sdk/types"

	"github.com/Fairblock/fairyring/app/keysharer"
	keysharetypes "github.com/Fairblock/fairyring/x/keyshare/types"
)

// extendVoteHandler produces one per-height keyshare in a compact VE payload.
func (app *App) extendVoteHandler(cfg keysharer.Config) sdk.ExtendVoteHandler {
	return func(ctx sdk.Context, req *abci.RequestExtendVote) (*abci.ResponseExtendVote, error) {
		app.Logger().Info("KeyshareVE/ExtendVote: begin", "height", req.Height)

		if !cfg.Enabled {
			app.Logger().Info("KeyshareVE/ExtendVote: disabled via config")
			return &abci.ResponseExtendVote{}, nil
		}
		if cfg.ValidatorAccount == "" || cfg.AppSecp256k1PrivHex == "" {
			app.Logger().Error("KeyshareVE/ExtendVote: missing validator_account/app_secp256k1_priv_hex")
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

		// Find validator’s encrypted shares by ValidatorAccount
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

		app.Logger().Info("KeyshareVE/ExtendVote: picked share",
			"height", req.Height, "keyshare_index", mat.Index, "share_len", len(mat.ActiveShare))

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

		app.Logger().Info("KeyshareVE/ExtendVote: emit", "height", req.Height, "bytes", len(ext))

		return &abci.ResponseExtendVote{VoteExtension: ext}, nil
	}
}

// VerifyVoteExtension: cheap checks (size/shape). Crypto is done in PreBlocker.
func (app *App) verifyVoteExtensionHandler() sdk.VerifyVoteExtensionHandler {
	return func(ctx sdk.Context, req *abci.RequestVerifyVoteExtension) (*abci.ResponseVerifyVoteExtension, error) {
		consHex := hex.EncodeToString(req.ValidatorAddress)
		app.Logger().Info("KeyshareVE/Verify: begin",
			"height", req.Height, "from_cons", consHex, "len", len(req.VoteExtension))

		// Empty extension is always accepted.
		if len(req.VoteExtension) == 0 {
			app.Logger().Info("KeyshareVE/Verify: empty extension -> ACCEPT",
				"height", req.Height, "from_cons", consHex)
			return &abci.ResponseVerifyVoteExtension{Status: abci.ResponseVerifyVoteExtension_ACCEPT}, nil
		}

		// Quick shape check only; full processing happens in the PreBlocker
		var ve keysharetypes.KeyshareVE
		if err := keysharetypes.ModuleCdc.Unmarshal(req.VoteExtension, &ve); err != nil {
			app.Logger().Error("KeyshareVE/Verify: unmarshal failed -> ACCEPT but payload ignored",
				"err", err, "from_cons", consHex, "len", len(req.VoteExtension))
			return &abci.ResponseVerifyVoteExtension{Status: abci.ResponseVerifyVoteExtension_ACCEPT}, nil
		}

		app.Logger().Info("KeyshareVE/Verify: parsed",
			"height", req.Height, "height_for", ve.HeightFor, "idx", ve.KeyshareIndex,
			"share_len", len(ve.Share),
		)

		// Basic sanity checks – we only reject obviously malformed payloads.
		if ve.KeyshareIndex < 1 || len(ve.Share) == 0 {
			app.Logger().Info("KeyshareVE/Verify: malformed payload -> REJECT",
				"height", req.Height, "from_cons", consHex,
				"idx", ve.KeyshareIndex, "share_len", len(ve.Share))
			return &abci.ResponseVerifyVoteExtension{Status: abci.ResponseVerifyVoteExtension_REJECT}, nil
		}

		// Do NOT mutate application state here. We also deliberately avoid caching;
		// we will rely on the canonical vote extensions provided in the last commit
		// (req.DecidedLastCommit) inside the PreBlocker, which is replay-safe.
		return &abci.ResponseVerifyVoteExtension{Status: abci.ResponseVerifyVoteExtension_ACCEPT}, nil
	}
}

// PreBlocker: consumes the injected VE tx at index 0, reads the
// ExtendedCommitInfo.Votes[*].VoteExtension, and forwards valid keyshares
// into the KeyshareKeeper.
func (app *App) preBlocker() sdk.PreBlocker {
	return func(ctx sdk.Context, req *abci.RequestFinalizeBlock) (*sdk.ResponsePreBlock, error) {
		H := uint64(req.Height)
		ctx.Logger().Info("KeyshareVE/PreBlock: begin",
			"height", H, "num_txs", len(req.Txs))

		if len(req.Txs) == 0 {
			// No injected tx; nothing to do.
			return &sdk.ResponsePreBlock{}, nil
		}

		// Decode injected tx from tx[0]
		var injected keyshareInjectedTx
		if err := json.Unmarshal(req.Txs[0], &injected); err != nil {
			// If this fails, we don't want to halt the chain; just log and skip VE logic.
			ctx.Logger().Error("KeyshareVE/PreBlock: failed to decode injected VE tx",
				"err", err)
			return &sdk.ResponsePreBlock{}, nil
		}

		ec := injected.ExtendedCommitInfo

		// consAddr(hex) → validator bech32
		valset := app.KeyshareKeeper.GetAllValidatorSet(ctx)
		byCons := make(map[string]string, len(valset))
		for _, v := range valset {
			byCons[v.ConsAddr] = v.Validator
		}

		for _, ev := range ec.Votes {
			consHex := hex.EncodeToString(ev.Validator.Address)
			payload := ev.VoteExtension
			if len(payload) == 0 {
				ctx.Logger().Info("KeyshareVE/PreBlock: empty VE", "from_cons", consHex)
				continue
			}

			var ve keysharetypes.KeyshareVE
			if err := keysharetypes.ModuleCdc.Unmarshal(payload, &ve); err != nil {
				ctx.Logger().Error("KeyshareVE/PreBlock: decode failed",
					"err", err, "from_cons", consHex)
				continue
			}

			ctx.Logger().Info("KeyshareVE/PreBlock: decoded",
				"height_for", ve.HeightFor, "idx", ve.KeyshareIndex, "share_len", len(ve.Share))

			// basic sanity
			if ve.HeightFor != H || ve.KeyshareIndex < 1 || len(ve.Share) == 0 {
				continue
			}

			valAcct, ok := byCons[consHex]
			if !ok {
				ctx.Logger().Info("KeyshareVE/PreBlock: validator not in keyshare set",
					"from_cons", consHex)
				continue
			}

			ctx.Logger().Info("KeyshareVE/PreBlock: vote",
				"from_cons", consHex, "val", valAcct, "payload_len", len(payload))

			if err := app.KeyshareKeeper.HandlePerBlockShare(ctx, valAcct, H, ve.KeyshareIndex, ve.Share); err != nil {
				ctx.Logger().Error("KeyshareVE/PreBlock: keeper rejected VE",
					"err", err, "validator", valAcct, "height", H)
				continue
			}

			ctx.Logger().Info("KeyshareVE/PreBlock: keeper accepted share",
				"val", valAcct, "height_for", ve.HeightFor, "idx", ve.KeyshareIndex)
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
