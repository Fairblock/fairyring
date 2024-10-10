package shares

import (
	"encoding/hex"
	distIBE "github.com/FairBlock/DistributedIBE"
	bls "github.com/drand/kyber-bls12381"
)

func DeriveShare(hexShare string, shareIndex uint32, id string) (string, error) {
	shareByte, err := hex.DecodeString(hexShare)
	if err != nil {
		return "", err
	}

	share := bls.NewKyberScalar()
	err = share.UnmarshalBinary(shareByte)
	if err != nil {
		return "", err
	}

	s := bls.NewBLS12381Suite()
	extractedKey := distIBE.Extract(s, share, shareIndex, []byte(id))

	extractedBinary, err := extractedKey.SK.MarshalBinary()
	if err != nil {
		return "", err
	}
	extractedKeyHex := hex.EncodeToString(extractedBinary)

	// commitmentPoint := s.G1().Point().Mul(share, s.G1().Point().Base())
	//commitmentBinary, err := commitmentPoint.MarshalBinary()
	//if err != nil {
	//	return "", err
	//}
	// commitmentHex := hex.EncodeToString(commitmentBinary)

	return extractedKeyHex, nil
}
