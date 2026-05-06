package transcriptgold

import "testing"

func TestLoadTranscriptVectors(t *testing.T) {
	vec, err := LoadTranscriptVectors()
	if err != nil {
		t.Fatal(err)
	}
	for _, h := range []string{vec.Equality.C, vec.Equality.W, vec.Range.Y, vec.Validity.T} {
		if _, err := ParseHex32(h); err != nil {
			t.Fatalf("parse %q: %v", h, err)
		}
	}
	if len(vec.Range.U) != 6 {
		t.Fatalf("range u len %d", len(vec.Range.U))
	}
}

func TestParseHex32RejectsBadLength(t *testing.T) {
	if _, err := ParseHex32("abcd"); err == nil {
		t.Fatal("expected error")
	}
}
