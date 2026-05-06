// Package transcriptgold loads Merlin Fiat–Shamir golden vectors for cross-checking
// the Go verifier against the Rust prover (same fixtures, same transcript order).
package transcriptgold

import (
	_ "embed"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"strings"
)

//go:embed transcript_vectors.json
var transcriptVectorsJSON []byte

// TranscriptVectors contains prover-exported challenge vectors.
type TranscriptVectors struct {
	Equality EqualityFixture
	Range    RangeFixture
	Validity ValidityFixture
}

type EqualityFixture struct {
	C string `json:"c"`
	W string `json:"w"`
}

type RangeFixture struct {
	Y string   `json:"y"`
	Z string   `json:"z"`
	X string   `json:"x"`
	W string   `json:"w"`
	D string   `json:"d"`
	U []string `json:"u"`
}

type ValidityFixture struct {
	T string `json:"t"`
	C string `json:"c"`
	W string `json:"w"`
}

type vectorsFile struct {
	Equality EqualityFixture `json:"equality_transfer_fixture"`
	Range    RangeFixture    `json:"range_batched_single64_fixture"`
	Validity ValidityFixture `json:"validity_batched_2handles_fixture"`
}

// LoadTranscriptVectors parses the embedded golden vector file.
func LoadTranscriptVectors() (TranscriptVectors, error) {
	var raw vectorsFile
	if err := json.Unmarshal(transcriptVectorsJSON, &raw); err != nil {
		return TranscriptVectors{}, fmt.Errorf("transcriptgold: json: %w", err)
	}
	return TranscriptVectors{
		Equality: raw.Equality,
		Range:    raw.Range,
		Validity: raw.Validity,
	}, nil
}

// ParseHex32 decodes a 64-character hex string into a little-endian canonical scalar encoding.
func ParseHex32(s string) ([32]byte, error) {
	var out [32]byte
	s = strings.TrimSpace(strings.ToLower(s))
	if len(s) != 64 {
		return out, fmt.Errorf("transcriptgold: want 64 hex chars, got %d", len(s))
	}
	b, err := hex.DecodeString(s)
	if err != nil {
		return out, fmt.Errorf("transcriptgold: hex: %w", err)
	}
	copy(out[:], b)
	return out, nil
}
