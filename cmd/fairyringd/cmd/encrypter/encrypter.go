package encrypter

import (
	"bytes"
	"context"
	"encoding/hex"
	"errors"
	"fmt"

	enc "github.com/FairBlock/DistributedIBE/encryption"
	"github.com/Fairblock/fairyring/x/keyshare/types"
	"github.com/cosmos/cosmos-sdk/client"
	bls "github.com/drand/kyber-bls12381"
	"github.com/spf13/cobra"
)

func EncryptCmd() *cobra.Command {
	return &cobra.Command{
		Use:   "encrypt [target-height / id] [plaintext]",
		Short: "Encrypt a given text with current public key",
		Args:  cobra.ExactArgs(2),
		RunE: func(cmd *cobra.Command, args []string) error {
			clientCtx, err := client.GetClientTxContext(cmd)
			if err != nil {
				return err
			}

			queryClient := types.NewQueryClient(clientCtx)

			res, err := queryClient.PubKey(context.Background(), &types.QueryPubKeyRequest{})
			if err != nil {
				return err
			}

			if len(res.ActivePubKey.PublicKey) == 0 {
				return errors.New("active public key not found")
			}

			suite := bls.NewBLS12381Suite()
			publicKeyByte, err := hex.DecodeString(res.ActivePubKey.PublicKey)
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
			_, err = plainTextBuffer.WriteString(args[1])
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
