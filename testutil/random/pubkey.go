package random

import (
	"encoding/base64"
	"encoding/hex"
	distIBE "github.com/FairBlock/DistributedIBE"
	"github.com/Fairblock/fairyring/testutil/sample"
	"github.com/Fairblock/fairyring/x/keyshare/types"
	dcrdSecp256k1 "github.com/decred/dcrd/dcrec/secp256k1"
	"github.com/drand/kyber"
	bls "github.com/drand/kyber-bls12381"
	"math"
	"math/big"
)

type GeneratedShare struct {
	Share            string
	EncShare         string
	Index            kyber.Scalar
	PrivateKey       *dcrdSecp256k1.PrivateKey
	PK               *dcrdSecp256k1.PublicKey
	ValidatorAddress string
}

type GenerateResult struct {
	GeneratedShare             []*GeneratedShare
	KeyShareEncryptedKeyShares []*types.EncryptedKeyShare
	Commitments                []string
	MasterPublicKey            string
}

func GeneratePubKeyAndShares(totalNumberOfValidator uint32) (*GenerateResult, error) {

	t := int(math.Ceil(float64(totalNumberOfValidator) * (2.0 / 3.0)))

	shares, mpk, _, err := distIBE.GenerateShares(totalNumberOfValidator, uint32(t))
	if err != nil {
		return nil, err
	}

	masterPublicKeyByte, err := mpk.MarshalBinary()
	if err != nil {
		return nil, err
	}

	var result GenerateResult
	result.MasterPublicKey = hex.EncodeToString(masterPublicKeyByte)

	suite := bls.NewBLS12381Suite()
	keyShareCommitments := make([]string, totalNumberOfValidator)
	sharesList := make([]*GeneratedShare, totalNumberOfValidator)

	for _, s := range shares {
		indexByte, _ := hex.DecodeString(s.Index.String())
		indexInt := big.NewInt(0).SetBytes(indexByte).Uint64()

		commitmentPoints := suite.G1().Point().Mul(s.Value, suite.G1().Point().Base())
		commitmentPointsBinary, _ := commitmentPoints.MarshalBinary()

		keyShareCommitments[indexInt-1] = hex.EncodeToString(commitmentPointsBinary)

		randomAddr := sample.AccAddress()
		sb, _ := s.Value.MarshalBinary()
		privKey, err := dcrdSecp256k1.GeneratePrivateKey()
		if err != nil {
			return nil, err
		}

		res, err := dcrdSecp256k1.Encrypt(privKey.PubKey(), sb)
		if err != nil {
			return nil, err
		}

		share := GeneratedShare{
			hex.EncodeToString(sb),
			base64.StdEncoding.EncodeToString(res),
			s.Index,
			privKey,
			privKey.PubKey(),
			randomAddr,
		}

		sharesList[indexInt-1] = &share
	}

	n := len(sharesList)

	encShares := make([]*types.EncryptedKeyShare, n)

	for _, v := range sharesList {
		indexByte, _ := hex.DecodeString(v.Index.String())
		indexInt := big.NewInt(0).SetBytes(indexByte).Uint64()
		encShares[indexInt-1] = &types.EncryptedKeyShare{
			Data:      v.EncShare,
			Validator: v.ValidatorAddress,
		}
	}

	result.GeneratedShare = sharesList
	result.KeyShareEncryptedKeyShares = encShares
	result.Commitments = keyShareCommitments

	return &result, nil
}
