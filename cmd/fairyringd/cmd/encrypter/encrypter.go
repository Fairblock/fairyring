package encrypter

import (
	"bytes"
	"context"
	"encoding/hex"
	"errors"
	"fmt"
	sdk "github.com/cosmos/cosmos-sdk/types"
	"strconv"

	enc "github.com/FairBlock/DistributedIBE/encryption"
	"github.com/Fairblock/fairyring/x/pep/types"
	"github.com/cosmos/cosmos-sdk/client"
	govutils "github.com/cosmos/cosmos-sdk/x/gov/client/utils"
	v1 "github.com/cosmos/cosmos-sdk/x/gov/types/v1"
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

func EncryptVoteCmd() *cobra.Command {
	return &cobra.Command{
		Use:   "encrypt-vote [vote-option] [identity] [random-number] [pubkey]",
		Short: "Encrypt a vote with the unique encryption key of the proposal",
		Args:  cobra.ExactArgs(4),
		RunE: func(cmd *cobra.Command, args []string) error {
			clientCtx, err := client.GetClientTxContext(cmd)
			if err != nil {
				return err
			}

			voteOption := args[0]
			identity := args[1]
			randNo := args[2]
			pubkey := args[3]

			// Find out which vote option user chose
			byteVoteOption, err := v1.VoteOptionFromString(govutils.NormalizeVoteOption(voteOption))
			if err != nil {
				return err
			}

			// parse the random number and convert to int
			i, err := strconv.ParseInt(randNo, 10, 64)
			if err != nil {
				return err
			}

			// fetch pubkey if not provided
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

			// populate the structure
			var voteData = v1.DecryptedVoteOption{
				Option:   byteVoteOption,
				RandomNo: i,
			}

			// encrypt the vote structure
			encVote, err := EncryptVote(voteData, pubkey, identity)
			if err != nil {
				return err
			}

			fmt.Println(encVote)
			return nil
		},
	}
}

func EncryptVote(voteOption v1.DecryptedVoteOption, pubKey string, identity string) (string, error) {
	var encryptedDataBytes bytes.Buffer
	var voteDataBuffer bytes.Buffer

	// Marshal the vote structure to bytes
	voteBytes, err := voteOption.Marshal()
	if err != nil {
		return "", err
	}

	// Write into a buffer (since the encrypt function accepts byte-buffers)
	voteDataBuffer.Write(voteBytes)

	// decode hex pubkey and convert to bytes
	publicKeyByte, err := hex.DecodeString(pubKey)
	if err != nil {
		return "", err
	}

	// create the publickeypoint from the public key bytes
	suite := bls.NewBLS12381Suite()
	publicKeyPoint := suite.G1().Point()
	if err := publicKeyPoint.UnmarshalBinary(publicKeyByte); err != nil {
		return "", err
	}

	// encrypt the vote bytes
	if err := enc.Encrypt(publicKeyPoint, []byte(identity), &encryptedDataBytes, &voteDataBuffer); err != nil {
		return "", err
	}

	return hex.EncodeToString(encryptedDataBytes.Bytes()), nil
}

func EncryptBidCmd() *cobra.Command {
	return &cobra.Command{
		Use:   "encrypt-bid [target-height / id] [pubkey] [bid]",
		Short: "Encrypt a given bid with current public key",
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

			// encrypt the vote structure
			encVote, err := EncryptBid(pubkey, args[0], args[2])
			if err != nil {
				return err
			}

			fmt.Println(encVote)
			return nil
		},
	}
}

func EncryptBid(pubKey, identity, bidAmount string) (string, error) {
	_, err := sdk.ParseCoinNormalized(bidAmount)
	if err != nil {
		return "", err
	}

	var encryptedBidBytes bytes.Buffer
	var bidByteBuffer bytes.Buffer

	_, err = bidByteBuffer.WriteString(bidAmount)
	if err != nil {
		return "", err
	}

	// decode hex pubkey and convert to bytes
	publicKeyByte, err := hex.DecodeString(pubKey)
	if err != nil {
		return "", err
	}

	// create the publickeypoint from the public key bytes
	suite := bls.NewBLS12381Suite()
	publicKeyPoint := suite.G1().Point()
	if err := publicKeyPoint.UnmarshalBinary(publicKeyByte); err != nil {
		return "", err
	}

	// encrypt the vote bytes
	if err := enc.Encrypt(publicKeyPoint, []byte(identity), &encryptedBidBytes, &bidByteBuffer); err != nil {
		return "", err
	}

	return hex.EncodeToString(encryptedBidBytes.Bytes()), nil
}
