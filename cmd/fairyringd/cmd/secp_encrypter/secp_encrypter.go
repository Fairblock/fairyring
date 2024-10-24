package secp_encrypter

import (
	"encoding/base64"
	"encoding/hex"
	"fmt"
	"os"

	"github.com/btcsuite/btcd/btcec"
	"github.com/spf13/cobra"
)

func SecpEncrypterCmd() *cobra.Command {
	var pubkeyBase64 string
	var keyshare string

	var rootCmd = &cobra.Command{
		Use:   "secp-encrypter",
		Short: "A CLI tool to take two strings as input and output them",
		Run: func(cmd *cobra.Command, args []string) {

			// Decode the base64 public key
			pubkeyBytes, err := base64.StdEncoding.DecodeString(pubkeyBase64)
			if err != nil {
				fmt.Println(err)
				os.Exit(1)
			}

			// Load the secp256k1 public key
			pubkey, err := btcec.ParsePubKey(pubkeyBytes, btcec.S256())
			if err != nil {
				fmt.Println(err)
				os.Exit(1)
			}

			ciphertext, err := btcec.Encrypt(pubkey, []byte(keyshare))
			if err != nil {
				fmt.Println(err)
				os.Exit(1)
			}

			// Encode ciphertext as hex for easy handling
			fmt.Println(hex.EncodeToString(ciphertext))
		},
	}

	// Flags for input
	rootCmd.Flags().StringVarP(&pubkeyBase64, "pubkey64", "p", "", "pubkey to encrypt keyshare")
	rootCmd.Flags().StringVarP(&keyshare, "keyshare", "k", "", "keyshare in hex")

	// Mark the flags as required
	rootCmd.MarkFlagRequired("pubkey64")
	rootCmd.MarkFlagRequired("keyshare")

	return rootCmd
}
