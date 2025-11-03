package keeper

import (
	"encoding/hex"
	"strconv"

	"cosmossdk.io/math"
	distIBE "github.com/FairBlock/DistributedIBE"
	"github.com/Fairblock/fairyring/x/keyshare/types"
	sdk "github.com/cosmos/cosmos-sdk/types"
	"github.com/drand/kyber"
	bls "github.com/drand/kyber-bls12381"
	"github.com/drand/kyber/pairing"
)

// HandlePerBlockShare validates, stores, and maybe-aggregates a per-height share.
// validator is the registered validator account address (the same string you store in ValidatorSet.Validator).
func (k Keeper) HandlePerBlockShare(
	ctx sdk.Context,
	validator string,
	height uint64,
	keyshareIndex uint32,
	shareBytes []byte, // raw G2 bytes (192)
) error {
	// Duplicate guard: one share per (validator,height)
	if _, found := k.GetKeyshare(ctx, validator, height); found {
		return types.ErrInvalidShare.Wrapf("duplicate keyshare for height %d from %s", height, validator)
	}

	suite := bls.NewBLS12381Suite()

	// Decide active vs queued commitments at boundary
	activePK, hasActive := k.GetActivePubkey(ctx)
	if !hasActive {
		return types.ErrPubkeyNotFound
	}
	commitments, hasCommit := k.GetActiveCommitments(ctx)
	if height >= activePK.Expiry {
		if queuedCommits, ok := k.GetQueuedCommitments(ctx); ok {
			k.Logger().Info("preblock: height crosses epoch boundary, using queued commitments for verification",
				"height_for", height,
				"active_expiry", activePK.Expiry)
			commitments = queuedCommits
		}
	}

	if !hasCommit || len(commitments.Commitments) == 0 {
		return types.ErrCommitmentsNotFound
	}
	if uint64(keyshareIndex) == 0 || uint64(keyshareIndex) > uint64(len(commitments.Commitments)) {
		return types.ErrInvalidKeyshareIndex
	}

	// Unmarshal commitment and incoming share
	cmtHex := commitments.Commitments[keyshareIndex-1]
	cmtBytes, err := hex.DecodeString(cmtHex)
	if err != nil {
		return types.ErrDecodingKeyshare.Wrap(err.Error())
	}

	cmt := suite.G1().Point()
	if err := cmt.UnmarshalBinary(cmtBytes); err != nil {
		return types.ErrUnmarshallingKeyshare.Wrap(err.Error())
	}
	sharePt := suite.G2().Point()
	if err := sharePt.UnmarshalBinary(shareBytes); err != nil {
		return types.ErrUnmarshallingKeyshare.Wrap(err.Error())
	}
	extracted := distIBE.ExtractedKey{SK: sharePt, Index: keyshareIndex}

	// Qid(id) where id = height as string
	hG2, ok := suite.G2().Point().(kyber.HashablePoint)
	if !ok {
		return types.ErrUnableToVerifyShare
	}

	ibeID := strconv.FormatUint(height, 10)
	Qid := hG2.Hash([]byte(ibeID))

	newCommitment := distIBE.Commitment{
		SP:    cmt,
		Index: keyshareIndex,
	}

	if !distIBE.VerifyShare(suite, newCommitment, extracted, Qid) {
		return types.ErrInvalidShare
	}

	// Persist (store hex to keep state schema stable)
	shareHex := hex.EncodeToString(shareBytes)
	k.SetKeyshare(ctx, types.Keyshare{
		Validator:           validator,
		BlockHeight:         height,
		Keyshare:            shareHex,
		KeyshareIndex:       uint64(keyshareIndex),
		ReceivedTimestamp:   uint64(ctx.BlockTime().Unix()),
		ReceivedBlockHeight: uint64(ctx.BlockHeight()),
	})

	// Update "last submitted height" marker
	k.SetLastSubmittedHeight(ctx, validator, strconv.FormatInt(ctx.BlockHeight(), 10))

	// --- aggregation threshold (same as msg path) ---
	expectedThreshold := math.LegacyNewDecFromInt(
		math.NewInt(types.KeyAggregationThresholdNumerator)).Quo(
		math.LegacyNewDecFromInt(math.NewInt(types.KeyAggregationThresholdDenominator))).MulInt64(
		int64(activePK.NumberOfValidators)).Ceil().TruncateInt64()

	// collect all shares present for this height
	valset := k.GetAllValidatorSet(ctx)
	var listOfShares []distIBE.ExtractedKey
	var listOfCommitment []distIBE.Commitment

	for _, vs := range valset {
		if ks, ok := k.GetKeyshare(ctx, vs.Validator, height); ok {
			// parse stored share & corresponding commitment into the proper structs
			keyshare, commitment, err := parseKeyshareCommitmentForHeight(suite, ks.Keyshare, commitments.Commitments[ks.KeyshareIndex-1], uint32(ks.KeyshareIndex), ibeID)
			if err != nil {
				k.Logger().Error("preblock: failed to parse stored keyshare/commitment", "err", err, "validator", vs.Validator, "height", height)
				continue
			}
			listOfShares = append(listOfShares, *keyshare)
			listOfCommitment = append(listOfCommitment, *commitment)
		}
	}

	if int64(len(listOfShares)) < expectedThreshold {
		// not enough shares yet; done for now
		return nil
	}

	// --- aggregate SK and persist decryption key (mirror msg path) ---
	SK, _ := distIBE.AggregateSK(suite, listOfShares, listOfCommitment, []byte(ibeID))
	skBytes, err := SK.MarshalBinary()
	if err != nil {
		return err
	}
	skHex := hex.EncodeToString(skBytes)

	k.SetDecryptionKey(ctx, types.DecryptionKey{
		Height: height,
		Data:   skHex,
	})
	k.SetDecryptionKeyLength(ctx, k.GetDecryptionKeyLength(ctx)+1)

	return nil
}

// helper that mirrors msg_send_keyshare.go parsing+verification logic
func parseKeyshareCommitmentForHeight(
	suite pairing.Suite,
	keyshareHex string,
	commitmentHex string,
	keyshareIndex uint32,
	ibeID string,
) (*distIBE.ExtractedKey, *distIBE.Commitment, error) {

	shareBytes, err := hex.DecodeString(keyshareHex)
	if err != nil {
		return nil, nil, types.ErrDecodingKeyshare.Wrap(err.Error())
	}
	sharePt := suite.G2().Point()
	if err := sharePt.UnmarshalBinary(shareBytes); err != nil {
		return nil, nil, types.ErrUnmarshallingKeyshare.Wrap(err.Error())
	}
	extracted := distIBE.ExtractedKey{SK: sharePt, Index: keyshareIndex}

	cmtBytes, err := hex.DecodeString(commitmentHex)
	if err != nil {
		return nil, nil, types.ErrDecodingCommitment.Wrap(err.Error())
	}
	sp := suite.G1().Point()
	if err := sp.UnmarshalBinary(cmtBytes); err != nil {
		return nil, nil, types.ErrUnmarshallingCommitment.Wrap(err.Error())
	}
	hG2, ok := suite.G2().Point().(kyber.HashablePoint)
	if !ok {
		return nil, nil, types.ErrUnableToVerifyShare
	}
	Qid := hG2.Hash([]byte(ibeID))
	comm := distIBE.Commitment{
		SP:    sp,
		Index: keyshareIndex,
	}

	if !distIBE.VerifyShare(suite, comm, extracted, Qid) {
		return nil, nil, types.ErrInvalidShare
	}
	return &extracted, &comm, nil
}
