package random

import (
	"encoding/hex"
	"math/rand"
	"time"
)

// RandHex returns a random hexadecimal string of length n.
func RandHex(n int) string {
	src := rand.New(rand.NewSource(time.Now().UnixNano()))
	b := make([]byte, (n+1)/2)

	if _, err := src.Read(b); err != nil {
		panic(err)
	}

	return hex.EncodeToString(b)[:n]
}
