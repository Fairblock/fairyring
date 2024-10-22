package sharegenerator

import (
	"encoding/hex"
	"encoding/json"
	"errors"
	"fmt"
	"strconv"

	distIBE "github.com/FairBlock/DistributedIBE"
	bls "github.com/drand/kyber-bls12381"
	"github.com/spf13/cobra"
)

type DeriveResult struct {
	Keyshare   string
	Commitment string
}

var deriveCmd = &cobra.Command{
	Use:                   "derive [share-in-hex] [share-index] [ID]",
	Short:                 "Derive Share from a specific ID",
	Long:                  `Derive Share from a specific ID`,
	DisableFlagsInUseLine: true,
	Args: func(cmd *cobra.Command, args []string) error {
		if len(args) < 3 {
			return errors.New("not enough arguments")
		}
		if _, err := strconv.ParseUint(args[1], 10, 64); err != nil {
			return errors.New("invalid share index provided, expecting number")
		}
		return nil
	},
	Run: func(cmd *cobra.Command, args []string) {
		shareByte, err := hex.DecodeString(args[0])
		if err != nil {
			fmt.Println("invalid share provided")
			return
		}

		share := bls.NewKyberScalar()
		err = share.UnmarshalBinary(shareByte)
		if err != nil {
			fmt.Printf("invalid share provided, got error while unmarshaling: %s\n", err.Error())
			return
		}

		shareIndex, err := strconv.ParseUint(args[1], 10, 64)
		if err != nil {
			fmt.Println("invalid share index provided, expecting number")
			return
		}

		s := bls.NewBLS12381Suite()
		extractedKey := distIBE.Extract(s, share, uint32(shareIndex), []byte(args[2]))

		extractedBinary, err := extractedKey.SK.MarshalBinary()
		if err != nil {
			fmt.Printf("Error while marshaling the extracted key: %s\n", err.Error())
			return
		}
		extractedKeyHex := hex.EncodeToString(extractedBinary)

		commitmentPoint := s.G1().Point().Mul(share, s.G1().Point().Base())
		commitmentBinary, err := commitmentPoint.MarshalBinary()
		if err != nil {
			fmt.Printf("Error while marshaling the calculated commitment point: %s\n", err.Error())
			return
		}
		commitmentHex := hex.EncodeToString(commitmentBinary)

		result, err := json.Marshal(DeriveResult{
			Keyshare:   extractedKeyHex,
			Commitment: commitmentHex,
		})
		if err != nil {
			fmt.Printf("Error while marshaling the derive result to json: %s\n", err.Error())
			return
		}

		fmt.Println(string(result))
	},
}

func init() {
	RootCmd.AddCommand(deriveCmd)
}
