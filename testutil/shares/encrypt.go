package shares

import (
	"encoding/base64"
	"encoding/hex"

	"github.com/btcsuite/btcd/btcec"
)

// EncryptWithPublicKey encrypts data using an RSA public key.
func EncryptWithPublicKey(data string, pubkeyBase64 string) (string, error) {
	// Decode the base64 public key
	pubkeyBytes, err := base64.StdEncoding.DecodeString(pubkeyBase64)
	if err != nil {
		return "", err
	}

	// Load the secp256k1 public key
	pubkey, err := btcec.ParsePubKey(pubkeyBytes, btcec.S256())
	if err != nil {
		return "", err
	}

	ciphertext, err := btcec.Encrypt(pubkey, []byte(data))
	if err != nil {
		return "", err
	}

	// Encode ciphertext as hex for easy handling
	return hex.EncodeToString(ciphertext), nil
}
