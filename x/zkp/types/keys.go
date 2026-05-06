package types

import (
	storetypes "cosmossdk.io/store/types"
)

const (
	ModuleName = "zkp"
	StoreKey   = ModuleName
	MemStoreKey = "mem_zkp"

	GasVerifyEqualityProof      storetypes.Gas = 50_000
	GasVerifyValidityProof      storetypes.Gas = 60_000
	GasVerifyWithdrawRangeProof storetypes.Gas = 80_000
	GasVerifyTransferRangeProof storetypes.Gas = 100_000
	GasRangeProofPerBitU64      storetypes.Gas = 500
	GasRangeProofPerBitU128     storetypes.Gas = 500
	GasVerifyTransferProofs     storetypes.Gas = 250_000
	GasVerifyWithdrawProofs     storetypes.Gas = 150_000
)

var (
	ParamsKey              = []byte("p_zkp")
	TrustedContractPrefix  = []byte("tc/")
)

func KeyPrefix(p string) []byte {
	return []byte(p)
}

