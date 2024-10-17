package aggregator

import (
	"context"
	"encoding/hex"
	"encoding/json"
	"errors"
	"fmt"

	distIBE "github.com/FairBlock/DistributedIBE"
	commontypes "github.com/Fairblock/fairyring/x/common/types"
	"github.com/Fairblock/fairyring/x/pep/types"
	"github.com/btcsuite/btcd/btcec"
	"github.com/cosmos/cosmos-sdk/client"
	"github.com/drand/kyber"
	bls "github.com/drand/kyber-bls12381"
	"github.com/drand/kyber/pairing"
	"github.com/spf13/cobra"
)

func AggregateCmd() *cobra.Command {
	return &cobra.Command{
		Use:   "aggregate-keyshares [keyshare-list] [identity] [req-address] [priv-key-hex]",
		Short: "decrypt and aggregate encrypted keyshares with the private key of req-address",
		Args:  cobra.ExactArgs(4),
		RunE: func(cmd *cobra.Command, args []string) error {
			clientCtx, err := client.GetClientTxContext(cmd)
			if err != nil {
				return err
			}

			identity := args[1]

			// check if requester address is blank
			if args[2] == "" {
				return errors.New("requester address cannot be blank")
			}
			reqAddr := args[2]

			// check if private key is provided
			if args[3] == "" {
				// TODO: derive private key from keyring
				return errors.New("private key cannot be blank")
			}
			privKeyHex := args[3]

			var encryptedKeyshares []commontypes.IndexedEncryptedKeyshare

			// check if keyshare list is blank
			if args[0] != "" {
				err := json.Unmarshal([]byte(args[0]), &encryptedKeyshares)
				if err != nil {
					return err
				}
			} else {
				// if blank, fetch keyshares via chain query

				// check if identity is blank
				if identity == "" {
					return errors.New("identity cannot be blank if no keyshares are provided")
				}

				queryClient := types.NewQueryClient(clientCtx)

				res, err := queryClient.PrivateKeyshareReq(
					context.Background(),
					&types.QueryPrivateKeyshareReqRequest{
						ReqId: identity,
					},
				)
				if err != nil {
					return err
				}

				if len(res.EncryptedKeyshares) == 0 {
					return errors.New("no encrypted keyshares found for request")
				}

				found := false

				for _, requester := range res.EncryptedKeyshares {
					if requester.Requester == reqAddr {
						found = true
						for _, val := range requester.PrivateKeyshares {
							encryptedKeyshares = append(encryptedKeyshares, *val)
						}
						break
					}
				}

				if !found {
					return errors.New("no entry found for requester address")
				}
			}

			// Decode the hex-encoded private key.
			pkBytes, err := hex.DecodeString(privKeyHex)
			if err != nil {
				return err
			}

			var decryptedKeyshares []commontypes.IndexedEncryptedKeyshare

			// try to decrypt all the encrypted keyshares with priv key
			for _, encShare := range encryptedKeyshares {
				decShare, err := decryptKeyshare(encShare, pkBytes)
				if err != nil {
					return err
				}
				decryptedKeyshares = append(decryptedKeyshares, decShare)
			}

			aggregatedKeysharePoint, err := aggregateKeyshares(decryptedKeyshares)
			if err != nil {
				return err
			}

			skByte, err := aggregatedKeysharePoint.MarshalBinary()
			if err != nil {
				return err
			}
			skHex := hex.EncodeToString(skByte)

			fmt.Println(skHex)
			return nil
		},
	}
}

func decryptKeyshare(
	encShare commontypes.IndexedEncryptedKeyshare,
	pkBytes []byte,
) (decShare commontypes.IndexedEncryptedKeyshare, err error) {
	privKey, _ := btcec.PrivKeyFromBytes(btcec.S256(), pkBytes)

	// decode hex encrypted keyshare
	ksBytes, err := hex.DecodeString(encShare.EncryptedKeyshareValue)
	if err != nil {
		return commontypes.IndexedEncryptedKeyshare{}, err
	}

	// Try decrypting the message.
	plaintext, err := btcec.Decrypt(privKey, ksBytes)
	if err != nil {
		return commontypes.IndexedEncryptedKeyshare{}, err
	}

	return commontypes.IndexedEncryptedKeyshare{
		EncryptedKeyshareValue: string(plaintext),
		EncryptedKeyshareIndex: encShare.EncryptedKeyshareIndex,
	}, nil
}

func aggregateKeyshares(keyshares []commontypes.IndexedEncryptedKeyshare) (kyber.Point, error) {
	suite := bls.NewBLS12381Suite()
	indexList := []uint32{}

	var shareList []distIBE.ExtractedKey
	for _, share := range keyshares {
		extractedKey, err := parseShare(suite, share)
		if err != nil {
			return nil, err
		}
		shareList = append(shareList, extractedKey)
		indexList = append(indexList, uint32(share.EncryptedKeyshareIndex))
	}

	SkShares := []kyber.Point{}
	for _, r := range shareList {
		processedShare := processSK(suite, r, indexList)
		SkShares = append(SkShares, processedShare.SK)
	}

	SK := aggregate(SkShares...)
	return SK, nil
}

func parseShare(
	suite pairing.Suite,
	keyshare commontypes.IndexedEncryptedKeyshare,
) (distIBE.ExtractedKey, error) {
	newByteKey, err := hex.DecodeString(keyshare.EncryptedKeyshareValue)
	if err != nil {
		return distIBE.ExtractedKey{}, err
	}

	newSharePoint := suite.G2().Point()
	err = newSharePoint.UnmarshalBinary(newByteKey)
	if err != nil {
		return distIBE.ExtractedKey{}, err
	}

	newExtractedKey := distIBE.ExtractedKey{
		SK:    newSharePoint,
		Index: uint32(keyshare.EncryptedKeyshareIndex),
	}

	return newExtractedKey, nil
}

func processSK(suite pairing.Suite, share distIBE.ExtractedKey, S []uint32) distIBE.ExtractedKey {
	lagrangeCoef := distIBE.LagrangeCoefficient(suite, share.Index, S)
	idenityKey := share.SK.Mul(lagrangeCoef, share.SK)
	return distIBE.ExtractedKey{SK: idenityKey, Index: share.Index}
}

func aggregate(keys ...kyber.Point) kyber.Point {
	var sk = keys[0]
	for _, key := range keys {

		if key != sk {
			sk.Add(sk, key)
		}
	}

	return sk
}
