package keysharer

import (
	"encoding/base64"
	"encoding/hex"
	"fmt"
	"os"
	"path/filepath"
	"strings"

	distIBE "github.com/FairBlock/DistributedIBE"
	keysharetypes "github.com/Fairblock/fairyring/x/keyshare/types"
	"github.com/btcsuite/btcd/btcec"
	bls "github.com/drand/kyber-bls12381"
	"gopkg.in/yaml.v3"
)

type Config struct {
	Enabled                    bool   `yaml:"enabled"`
	ValidatorAccount           string `yaml:"validator_account"`      // bech32 account string used in EncryptedKeyshares[].Validator
	AppSecp256k1PrivHex        string `yaml:"app_secp256k1_priv_hex"` // hex of the app key
	InvalidSharePauseThreshold uint64 `yaml:"invalid_share_pause_threshold"`
}

type ShareMaterial struct {
	// decrypted validator shares for active/queued (G2 scalar)
	ActiveShare []byte
	QueuedShare []byte
	// expiries
	ActiveExpiry uint64
	QueuedExpiry uint64
	// index in DKG (1..N)
	Index uint32
}

func LoadConfig(home string) (Config, error) {
	path := filepath.Join(home, "keysharer.yaml")
	bz, err := os.ReadFile(path)
	if err != nil {
		return Config{}, err
	}
	var cfg Config
	if err := yaml.Unmarshal(bz, &cfg); err != nil {
		return Config{}, err
	}
	return cfg, nil
}

// Decrypts a base64 or hex-encoded ECIES(sec256k1) ciphertext with the provided secp256k1 private key.
func DecryptECIES(priv *btcec.PrivateKey, cipher string) ([]byte, error) {
	// try base64 first (chain stores often use base64)
	if dec, err := base64.StdEncoding.DecodeString(cipher); err == nil {
		return btcec.Decrypt(priv, dec)
	}
	// fallback: hex
	dec, err := hex.DecodeString(strings.TrimSpace(cipher))
	if err != nil {
		return nil, err
	}
	return btcec.Decrypt(priv, dec)
}

// ExtractFromShare derives the per-ID extracted key bytes from the validator share (scalar bytes) and index.
func ExtractFromShare(shareScalar []byte, index uint32, id []byte) ([]byte, error) {
	s := bls.NewBLS12381Suite()
	ky := s.G2().Scalar()
	if err := ky.UnmarshalBinary(shareScalar); err != nil {
		return nil, err
	}
	ex := distIBE.Extract(s, ky, index, id)
	return ex.SK.MarshalBinary()
}

// Choose which share to use for height h+1 (active unless we cross expiry)
func SelectShare(mat ShareMaterial, heightPlusOne uint64) ([]byte, uint32, error) {
	if heightPlusOne < mat.ActiveExpiry {
		if len(mat.ActiveShare) == 0 {
			return nil, 0, fmt.Errorf("missing active share")
		}
		return mat.ActiveShare, mat.Index, nil
	}
	// after (or at) expiry → queued
	if len(mat.QueuedShare) == 0 {
		return nil, 0, fmt.Errorf("missing queued share at expiry boundary")
	}
	return mat.QueuedShare, mat.Index, nil
}

// Marshal VE protobuf
func MakeVE(heightFor uint64, idx uint32, extracted []byte) ([]byte, error) {
	msg := &keysharetypes.KeyshareVE{
		HeightFor:     heightFor,
		KeyshareIndex: idx,
		Share:         extracted,
	}
	return keysharetypes.ModuleCdc.Marshal(msg) // uses gogo codec
}
