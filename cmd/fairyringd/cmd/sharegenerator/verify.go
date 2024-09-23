package sharegenerator

import (
	"encoding/hex"
	"errors"
	"fmt"
	"strconv"

	distIBE "github.com/FairBlock/DistributedIBE"
	"github.com/drand/kyber"
	bls "github.com/drand/kyber-bls12381"
	"github.com/spf13/cobra"
)

var verifyCmd = &cobra.Command{
	Use:                   "verify [share-in-hex] [commitment-in-hex] [index] [id]",
	Short:                 "Verify Share",
	Long:                  `Verify Share with VSS Kyber`,
	DisableFlagsInUseLine: true,
	Args: func(cmd *cobra.Command, args []string) error {
		if len(args) < 3 {
			return errors.New("not enough arguments")
		}
		_, err := hex.DecodeString(args[0])
		if err != nil {
			return fmt.Errorf("invalid key share, expected value in hex, got %v, err: %s", args[0], err.Error())
		}
		_, err = hex.DecodeString(args[1])
		if err != nil {
			return fmt.Errorf("invalid commitment, expected value in hex, got %v", args[1])
		}
		_, err = strconv.ParseUint(args[2], 10, 64)
		if err != nil {
			return fmt.Errorf("invalid index provided, expecting number, got %v", args[2])
		}
		return nil
	},
	Run: func(cmd *cobra.Command, args []string) {
		keyShareBytes, err := hex.DecodeString(args[0])
		if err != nil {
			fmt.Printf("invalid key share, expected value in hex, got %v\n", args[0])
			return
		}
		commitmentBytes, err := hex.DecodeString(args[1])
		if err != nil {
			fmt.Printf("Invalid commitment, expected value in hex, got %v\n", args[1])
			return
		}

		index64, err := strconv.ParseUint(args[2], 10, 32)
		if err != nil {
			fmt.Printf("Invalid index provided, expecting number, got %v", args[2])
			return
		}

		index := uint32(index64)

		suite := bls.NewBLS12381Suite()

		newSharePoint := suite.G2().Point()

		if len(args) >= 4 {
			err = newSharePoint.UnmarshalBinary(keyShareBytes)
			if err != nil {
				fmt.Printf("Unable to unmarshal key share, error: %s\n", err.Error())
				return
			}
		} else {
			parsedShare := bls.NewKyberScalar()
			err = parsedShare.UnmarshalBinary(keyShareBytes)
			if err != nil {
				return
			}

			share := &distIBE.Share{
				Index: bls.NewKyberScalar().SetInt64(int64(index64)),
				Value: parsedShare,
			}
			extracted := distIBE.Extract(suite, share.Value, index, []byte("verifying"))
			newSharePoint = extracted.SK
		}

		newCommitmentPoint := suite.G1().Point()
		err = newCommitmentPoint.UnmarshalBinary(commitmentBytes)
		if err != nil {
			fmt.Printf("Unable to unmarshal commitment, error: %s\n", err.Error())
			return
		}

		newExtractedKey := distIBE.ExtractedKey{
			SK:    newSharePoint,
			Index: index,
		}

		newCommitment := distIBE.Commitment{
			SP:    newCommitmentPoint,
			Index: index,
		}

		hG2, ok := suite.G2().Point().(kyber.HashablePoint)
		if !ok {
			fmt.Printf("Unable to create hashable point\n")
			return
		}

		Qid := hG2.Hash([]byte("verifying"))
		if len(args) >= 4 {
			Qid = hG2.Hash([]byte(args[3]))
		}

		if !distIBE.VerifyShare(suite, newCommitment, newExtractedKey, Qid) {
			fmt.Println("false")
			return
		}

		fmt.Println("true")
	},
}

func init() {
	RootCmd.AddCommand(verifyCmd)
}
