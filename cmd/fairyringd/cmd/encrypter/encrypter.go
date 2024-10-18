package encrypter

import (
	"bytes"
	"context"
	"encoding/hex"
	"errors"
	"fmt"

	enc "github.com/FairBlock/DistributedIBE/encryption"
	"github.com/Fairblock/fairyring/x/pep/types"
	"github.com/cosmos/cosmos-sdk/client"
	bls "github.com/drand/kyber-bls12381"
	"github.com/spf13/cobra"
)

func EncryptCmd() *cobra.Command {
	return &cobra.Command{
		Use:   "encrypt [target-height / id] [pubkey] [plaintext]",
		Short: "Encrypt a given text with current public key",
		Args:  cobra.ExactArgs(3),
		RunE: func(cmd *cobra.Command, args []string) error {
			clientCtx, err := client.GetClientTxContext(cmd)
			if err != nil {
				return err
			}

			pubkey := args[1]

			if pubkey == "" {
				queryClient := types.NewQueryClient(clientCtx)

				res, err := queryClient.Pubkey(context.Background(), &types.QueryPubkeyRequest{})
				if err != nil {
					return err
				}

				if len(res.ActivePubkey.PublicKey) == 0 {
					return errors.New("active public key not found")
				}

				pubkey = res.ActivePubkey.PublicKey
			}

			suite := bls.NewBLS12381Suite()
			publicKeyByte, err := hex.DecodeString(pubkey)
			if err != nil {
				panic(fmt.Sprintf("\nError decoding public key: %s\n", err.Error()))
			}

			publicKeyPoint := suite.G1().Point()
			err = publicKeyPoint.UnmarshalBinary(publicKeyByte)
			if err != nil {
				panic(fmt.Sprintf("\nError unmarshalling public key: %s\n", err.Error()))
			}

			var destCipherData bytes.Buffer
			var plainTextBuffer bytes.Buffer
			_, err = plainTextBuffer.WriteString(args[2])
			if err != nil {
				panic(fmt.Sprintf("\nError writing plaintext string to buffer: %s\n", err.Error()))
			}

			err = enc.Encrypt(publicKeyPoint, []byte(args[0]), &destCipherData, &plainTextBuffer)
			if err != nil {
				panic(fmt.Sprintf("\nError encrypting: %s\n", err.Error()))
			}

			hexCipher := hex.EncodeToString(destCipherData.Bytes())

			fmt.Println(hexCipher)
			return nil
		},
	}
}
