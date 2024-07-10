package sharegenerator

import (
	"encoding/binary"
	"encoding/hex"
	"encoding/json"
	"errors"
	"fmt"
	distIBE "github.com/FairBlock/DistributedIBE"
	"github.com/spf13/cobra"
	"strconv"
)

type Share struct {
	Value string
	Index uint64
}

type GenerateResult struct {
	Shares          []Share
	MasterPublicKey string
	Commitments     []string
}

var generateCmd = &cobra.Command{
	Use:                   "generate [number-of-validator] [threshold]",
	Short:                 "Generate Share",
	DisableFlagsInUseLine: true,
	Args: func(cmd *cobra.Command, args []string) error {
		if len(args) < 2 {
			return errors.New("not enough arguments")
		}
		num, err := strconv.ParseUint(args[0], 10, 32)
		if err != nil {
			return fmt.Errorf("invalid number of validator provided, expecting number, got %v", args[0])
		}
		threshold, err := strconv.ParseUint(args[1], 10, 32)
		if err != nil {
			return fmt.Errorf("invalid threshold provided, expecting number, got %v", args[1])
		}
		if threshold > num {
			return fmt.Errorf("invalid threshold provided, expecting number smaller than total number of validator: %d, got threshold: %d", num, threshold)
		}
		return nil
	},
	Run: func(cmd *cobra.Command, args []string) {
		num, err := strconv.ParseUint(args[0], 10, 32)
		if err != nil {
			fmt.Printf("invalid number of validator provided, expecting number, got %v\n", args[0])
			return
		}
		threshold, err := strconv.ParseUint(args[1], 10, 32)
		if err != nil {
			fmt.Printf("invalid threshold provided, expecting number, got %v\n", args[1])
			return
		}
		shares, mpk, commitments, err := distIBE.GenerateShares(uint32(num), uint32(threshold))
		if err != nil {
			fmt.Printf("error while generating shares: %s\n", err.Error())
			return
		}

		masterPublicKeyByte, err := mpk.MarshalBinary()
		if err != nil {
			fmt.Printf("error while marshaling master public key to binary: %s\n", err.Error())
			return
		}

		var result GenerateResult
		result.MasterPublicKey = hex.EncodeToString(masterPublicKeyByte)

		for i, share := range shares {
			index, err := share.Index.MarshalBinary()
			if err != nil {
				fmt.Printf("error while marshaling [%d] share index to binary: %s\n", i, err.Error())
				return
			}

			value, err := share.Value.MarshalBinary()
			if err != nil {
				fmt.Printf("error while marshaling [%d] share value to binary: %s\n", i, err.Error())
				return
			}

			result.Shares = append(result.Shares, Share{
				Value: hex.EncodeToString(value),
				Index: binary.BigEndian.Uint64(index),
			})
		}

		for i, c := range commitments {
			commitment, err := c.MarshalBinary()
			if err != nil {
				fmt.Printf("error while marshaling [%d] commitment value to binary: %s\n", i, err.Error())
				return
			}
			result.Commitments = append(result.Commitments, hex.EncodeToString(commitment))
		}

		jsonByte, err := json.Marshal(result)
		if err != nil {
			fmt.Printf("error while marshaling result to json: %s\n", err.Error())
			return
		}
		fmt.Println(string(jsonByte))
	},
}

func init() {
	RootCmd.AddCommand(generateCmd)
}
