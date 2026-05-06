package keeper_test

import (
	"testing"

	"github.com/Fairblock/fairyring/x/zkp/types"
	sdk "github.com/cosmos/cosmos-sdk/types"
)

func FuzzProofDataDeserialization(f *testing.F) {
	seeds := [][]byte{
		{},
		{0},
		{1, 2, 3},
		make([]byte, 32),
		make([]byte, 256),
	}
	for _, s := range seeds {
		f.Add(s)
	}

	f.Fuzz(func(t *testing.T, raw []byte) {
		if len(raw) > 4096 {
			raw = raw[:4096]
		}

		k, ctx := newZkpKeeperForGRPCTest(t)
		goCtx := sdk.WrapSDKContext(ctx)

		_, _ = k.VerifyWithdrawRangeProof(goCtx, &types.QueryVerifyWithdrawRangeProofRequest{ProofData: raw})
		_, _ = k.VerifyTransferRangeProof(goCtx, &types.QueryVerifyTransferRangeProofRequest{ProofData: raw})
		_, _ = k.VerifyValidityProof(goCtx, &types.QueryVerifyValidityProofRequest{ProofData: raw})
		_, _ = k.VerifyEqualityProof(goCtx, &types.QueryVerifyEqualityProofRequest{ProofData: raw})
		_, _ = k.VerifyTransferProofs(goCtx, &types.QueryVerifyTransferProofsRequest{
			EqualityProofData: raw,
			RangeProofData:    raw,
			ValidityProofData: raw,
			SenderPubkey:      raw,
			RecipientPubkey:   raw,
			CurrentBalanceCommitment: raw,
			CurrentBalanceHandle:     raw,
		})
		_, _ = k.VerifyWithdrawProofs(goCtx, &types.QueryVerifyWithdrawProofsRequest{
			EqualityProofData:    raw,
			RangeProofData:       raw,
			UserPubkey:           raw,
			CiphertextCommitment: raw,
			CiphertextHandle:     raw,
			ExpectedNonce:        0,
		})
	})
}
