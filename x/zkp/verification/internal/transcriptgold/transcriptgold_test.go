package transcriptgold

import "testing"

func TestLoadTranscriptVectors(t *testing.T) {
	vec, err := LoadTranscriptVectors()
	if err != nil {
		t.Fatal(err)
	}
	for _, h := range []string{
		vec.Equality.C, vec.Equality.W, vec.Range.Y, vec.Validity.T,
		vec.EqualityCase2.C, vec.EqualityCase2.W, vec.RangeCase2.Y, vec.ValidityCase2.T,
	} {
		if _, err := ParseHex32(h); err != nil {
			t.Fatalf("parse %q: %v", h, err)
		}
	}
	if len(vec.Range.U) != 6 {
		t.Fatalf("range u len %d", len(vec.Range.U))
	}
	if len(vec.RangeCase2.U) != 7 {
		t.Fatalf("range case2 u len %d", len(vec.RangeCase2.U))
	}
}

func TestParseHex32RejectsBadLength(t *testing.T) {
	if _, err := ParseHex32("abcd"); err == nil {
		t.Fatal("expected error")
	}
}
