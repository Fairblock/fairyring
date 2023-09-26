package band_test

import (
	"encoding/hex"
	"testing"

	"github.com/stretchr/testify/require"

	"fairyring/types/band"
)

func TestDecodeResult(t *testing.T) {
	raw, _ := hex.DecodeString("000000020000000342544300000019c2a1913d400000000345544800000001a4cfa59680")
	expected := []band.Response{
		{Symbol: "BTC", ResponseCode: 0, Rate: 28323725000000},
		{Symbol: "ETH", ResponseCode: 0, Rate: 1807370000000},
	}
	actual, err := band.DecodeResult(raw)
	require.NoError(t, err)
	require.Equal(t, expected, actual)
}

func TestDecodeResultFail(t *testing.T) {
	raw, _ := hex.DecodeString("000000020000000342544300000019c2a1913d400000000345544800000001a4cfa5968001")
	_, err := band.DecodeResult(raw)
	require.Error(t, err)
}
