package obi

import (
	"encoding/hex"
	"testing"

	"github.com/stretchr/testify/require"
)

// Uint8
func TestDecodeUint8(t *testing.T) {
	var actual uint8
	bz, _ := hex.DecodeString("7b")
	MustDecode(bz, &actual)
	require.Equal(t, uint8(123), actual)
}

func TestDecodeAliasUint8(t *testing.T) {
	type ID uint8
	var actual ID
	bz, _ := hex.DecodeString("7b")
	MustDecode(bz, &actual)
	require.Equal(t, ID(123), actual)
}

func TestDecodeUint8Fail(t *testing.T) {
	var actual uint8
	bz, _ := hex.DecodeString("")
	require.PanicsWithError(t, "obi: out of range", func() { MustDecode(bz, &actual) })
}

// Uint16
func TestDecodeUint16(t *testing.T) {
	var actual uint16
	bz, _ := hex.DecodeString("007b")
	MustDecode(bz, &actual)
	require.Equal(t, uint16(123), actual)
}

func TestDecodeAliasUint16(t *testing.T) {
	type ID uint16
	var actual ID
	bz, _ := hex.DecodeString("007b")
	MustDecode(bz, &actual)
	require.Equal(t, ID(123), actual)
}

func TestDecodeUint16Fail(t *testing.T) {
	var actual uint16
	bz, _ := hex.DecodeString("")
	require.PanicsWithError(t, "obi: out of range", func() { MustDecode(bz, &actual) })
}

// Uint32
func TestDecodeUint32(t *testing.T) {
	var actual uint32
	bz, _ := hex.DecodeString("0000007b")
	MustDecode(bz, &actual)
	require.Equal(t, uint32(123), actual)
}

func TestDecodeAliasUint32(t *testing.T) {
	type ID uint32
	var actual ID
	bz, _ := hex.DecodeString("0000007b")
	MustDecode(bz, &actual)
	require.Equal(t, ID(123), actual)
}

func TestDecodeUint32Fail(t *testing.T) {
	var actual uint32
	bz, _ := hex.DecodeString("")
	require.PanicsWithError(t, "obi: out of range", func() { MustDecode(bz, &actual) })
}

// Uint64
func TestDecodeUint64(t *testing.T) {
	var actual uint64
	bz, _ := hex.DecodeString("000000000000007b")
	MustDecode(bz, &actual)
	require.Equal(t, uint64(123), actual)
}

func TestDecodeAliasUint64(t *testing.T) {
	type ID uint64
	var actual ID
	bz, _ := hex.DecodeString("000000000000007b")
	MustDecode(bz, &actual)
	require.Equal(t, ID(123), actual)
}

func TestDecodeUint64Fail(t *testing.T) {
	var actual uint64
	bz, _ := hex.DecodeString("")
	require.PanicsWithError(t, "obi: out of range", func() { MustDecode(bz, &actual) })
}

// Int8
func TestDecodeInt8(t *testing.T) {
	var actual int8
	bz, _ := hex.DecodeString("85")
	MustDecode(bz, &actual)
	require.Equal(t, int8(-123), actual)
}

func TestDecodeAliasInt8(t *testing.T) {
	type ID int8
	var actual ID
	bz, _ := hex.DecodeString("85")
	MustDecode(bz, &actual)
	require.Equal(t, ID(-123), actual)
}

func TestDecodeInt8Fail(t *testing.T) {
	var actual int8
	bz, _ := hex.DecodeString("")
	require.PanicsWithError(t, "obi: out of range", func() { MustDecode(bz, &actual) })
}

// Int16
func TestDecodeInt16(t *testing.T) {
	var actual int16
	bz, _ := hex.DecodeString("ff85")
	MustDecode(bz, &actual)
	require.Equal(t, int16(-123), actual)
}

func TestDecodeAliasInt16(t *testing.T) {
	type ID int16
	var actual ID
	bz, _ := hex.DecodeString("ff85")
	MustDecode(bz, &actual)
	require.Equal(t, ID(-123), actual)
}

func TestDecodeInt16Fail(t *testing.T) {
	var actual int16
	bz, _ := hex.DecodeString("")
	require.PanicsWithError(t, "obi: out of range", func() { MustDecode(bz, &actual) })
}

// Int32
func TestDecodeInt32(t *testing.T) {
	var actual int32
	bz, _ := hex.DecodeString("ffffff85")
	MustDecode(bz, &actual)
	require.Equal(t, int32(-123), actual)
}

func TestDecodeAliasInt32(t *testing.T) {
	type ID int32
	var actual ID
	bz, _ := hex.DecodeString("ffffff85")
	MustDecode(bz, &actual)
	require.Equal(t, ID(-123), actual)
}

func TestDecodeInt32Fail(t *testing.T) {
	var actual int32
	bz, _ := hex.DecodeString("")
	require.PanicsWithError(t, "obi: out of range", func() { MustDecode(bz, &actual) })
}

// Int64
func TestDecodeInt64(t *testing.T) {
	var actual int64
	bz, _ := hex.DecodeString("ffffffffffffff85")
	MustDecode(bz, &actual)
	require.Equal(t, int64(-123), actual)
}

func TestDecodeAliasInt64(t *testing.T) {
	type ID int64
	var actual ID
	bz, _ := hex.DecodeString("ffffffffffffff85")
	MustDecode(bz, &actual)
	require.Equal(t, ID(-123), actual)
}

func TestDecodeInt64Fail(t *testing.T) {
	var actual int64
	bz, _ := hex.DecodeString("")
	require.PanicsWithError(t, "obi: out of range", func() { MustDecode(bz, &actual) })
}

func TestDecodeString(t *testing.T) {
	var actual string
	bz, _ := hex.DecodeString("0000001368656c6c6f20616c69636520616e6420626f62")
	MustDecode(bz, &actual)
	require.Equal(t, "hello alice and bob", actual)
}

func TestDecodeEmptyStringFail(t *testing.T) {
	var actual string
	bz, _ := hex.DecodeString("")
	require.PanicsWithError(t, "obi: out of range", func() { MustDecode(bz, &actual) })
}

func TestDecodeStringOutOfRangeFail(t *testing.T) {
	var actual string
	bz, _ := hex.DecodeString("00000013")
	require.PanicsWithError(t, "obi: out of range", func() { MustDecode(bz, &actual) })
}

func TestDecodeSlice(t *testing.T) {
	var actual []int32
	bz, _ := hex.DecodeString("00000006000000010000000200000003000000040000000500000006")
	MustDecode(bz, &actual)
	require.Equal(t, []int32{1, 2, 3, 4, 5, 6}, actual)
}

func TestDecodeSliceFail(t *testing.T) {
	var actual []int32
	bz, _ := hex.DecodeString("060000001000000")
	require.PanicsWithError(t, "obi: out of range", func() { MustDecode(bz, &actual) })
}

func TestDecodeSliceOutOfRangeFail(t *testing.T) {
	var actual []int32
	bz, _ := hex.DecodeString("060000")
	require.PanicsWithError(t, "obi: out of range", func() { MustDecode(bz, &actual) })
}

func TestDecodeStruct(t *testing.T) {
	var actual ExampleData
	bz, _ := hex.DecodeString("000000034254430000000000002328010200000002000a000b")
	MustDecode(bz, &actual)
	require.Equal(t,
		ExampleData{
			Symbol: "BTC",
			Px:     9000,
			In: Inner{
				A: 1,
				B: 2,
			},
			Arr: []int16{10, 11},
		},
		actual,
	)
}

func TestDecodeMultipleValues(t *testing.T) {
	var a, b int8
	bz, _ := hex.DecodeString("2021")
	MustDecode(bz, &a, &b)
	require.Equal(t, int8(32), a)
	require.Equal(t, int8(33), b)
}

func TestDecodeStructFail(t *testing.T) {
	var actual ExampleData
	bz, _ := hex.DecodeString("000000061000000")
	require.PanicsWithError(t, "obi: out of range", func() { MustDecode(bz, &actual) })
}

func TestDecodeStructOutOfRangeFail(t *testing.T) {
	var actual []ExampleData
	bz, _ := hex.DecodeString("00000006")
	require.PanicsWithError(t, "obi: out of range", func() { MustDecode(bz, &actual) })
}

func TestDecodeByteArray(t *testing.T) {
	var actual []byte
	bz, _ := hex.DecodeString("00000006010203040506")
	MustDecode(bz, &actual)
	require.Equal(t, []byte{1, 2, 3, 4, 5, 06}, actual)
}

func TestDecodeByteFail(t *testing.T) {
	var actual []byte
	bz, _ := hex.DecodeString("0006")
	require.PanicsWithError(t, "obi: out of range", func() { MustDecode(bz, &actual) })
}

func TestDecodebzOutOfRangeFail(t *testing.T) {
	var actual []byte
	bz, _ := hex.DecodeString("00000006")
	require.PanicsWithError(t, "obi: out of range", func() { MustDecode(bz, &actual) })
}

func TestDecodeIntoNonPointer(t *testing.T) {
	var actual []byte
	bz, _ := hex.DecodeString("000000061234506")
	require.PanicsWithError(t, "obi: decode into non-ptr type", func() { MustDecode(bz, actual) })
}

func TestUnsupportedType(t *testing.T) {
	var actual bool
	bz, _ := hex.DecodeString("060000001234506")
	require.PanicsWithError(t, "obi: unsupported value type: bool", func() { MustDecode(bz, &actual) })
}

func TestNotAllDataConsumed(t *testing.T) {
	var actual []byte
	bz, _ := hex.DecodeString("0000000601020304050607080910")
	require.PanicsWithError(
		t,
		"obi: not all data was consumed while decoding",
		func() { MustDecode(bz, &actual) },
	)
}
