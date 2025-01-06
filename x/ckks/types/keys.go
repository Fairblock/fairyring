package types

const (
	// ModuleName defines the module name
	ModuleName = "ckks"

	// StoreKey defines the primary module store key
	StoreKey = ModuleName

	// MemStoreKey defines the in-memory store key
	MemStoreKey = "mem_ckks"
)

const (

	SendRKGRound2EventType= "send-rkg-round2"
	RKR1Combined = "rk-r1-combined"
	ShamirSharesSubmitted = "shamir-shares-submitted"
	ShamirShares = "shamir-shares"


)

var (
	ParamsKey = []byte("p_ckks")
)

func KeyPrefix(p string) []byte {
	return []byte(p)
}
