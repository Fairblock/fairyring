package obi

import (
	"encoding/hex"
	"testing"

	"github.com/stretchr/testify/require"
)

type ID uint8

type Inner struct {
	A ID    `obi:"a"`
	B uint8 `obi:"b"`
}

type SimpleData struct {
	X uint8 `obi:"x"`
	Y uint8 `obi:"y"`
}

type ExampleData struct {
	Symbol string  `obi:"symbol"`
	Px     uint64  `obi:"px"`
	In     Inner   `obi:"in"`
	Arr    []int16 `obi:"arr"`
}

type InvalidStruct struct {
	IsBool bool
}

func TestEncodeBytes(t *testing.T) {
	expectedBytes, _ := hex.DecodeString("000000034254430000000000002328010200000002000a000b")
	require.Equal(t, MustEncode(ExampleData{
		Symbol: "BTC",
		Px:     9000,
		In: Inner{
			A: 1,
			B: 2,
		},
		Arr: []int16{10, 11},
	}), expectedBytes)
}
func TestEncodeBytesMulti(t *testing.T) {
	expectedBytes, _ := hex.DecodeString("0102000000034254430000000000002328010200000002000a000b")
	require.Equal(t, MustEncode(SimpleData{X: 1, Y: 2}, ExampleData{
		Symbol: "BTC",
		Px:     9000,
		In: Inner{
			A: 1,
			B: 2,
		},
		Arr: []int16{10, 11},
	}), expectedBytes)
}

func TestEncodeStructFail(t *testing.T) {
	invalid := InvalidStruct{
		IsBool: true,
	}
	require.PanicsWithError(t, "obi: unsupported value type: bool", func() { MustEncode(invalid) })
}

// Uint8
func TestEncodeBytesUint8(t *testing.T) {
	num := uint8(123)
	require.Equal(t, []byte{num}, MustEncode(num))
}

func TestEncodeBytesAliasUint8(t *testing.T) {
	type ID uint8
	num := uint8(123)
	id := ID(num)
	require.Equal(t, []byte{num}, MustEncode(id))
}

// Uint16
func TestEncodeBytesUint16(t *testing.T) {
	expectedBytes, _ := hex.DecodeString("007b")
	num := uint16(123)
	require.Equal(t, expectedBytes, MustEncode(num))
}

func TestEncodeBytesAliasUint16(t *testing.T) {
	type ID uint16
	expectedBytes, _ := hex.DecodeString("007b")
	num := uint16(123)
	id := ID(num)
	require.Equal(t, expectedBytes, MustEncode(id))
}

// Uint32
func TestEncodeBytesUint32(t *testing.T) {
	expectedBytes, _ := hex.DecodeString("0000007b")
	num := uint32(123)
	require.Equal(t, expectedBytes, MustEncode(num))
}

func TestEncodeBytesAliasUint32(t *testing.T) {
	type ID uint32
	expectedBytes, _ := hex.DecodeString("0000007b")
	num := uint32(123)
	id := ID(num)
	require.Equal(t, expectedBytes, MustEncode(id))
}

// Uint64
func TestEncodeBytesUint64(t *testing.T) {
	expectedBytes, _ := hex.DecodeString("000000000000007b")
	num := uint64(123)
	require.Equal(t, expectedBytes, MustEncode(num))
}

func TestEncodeBytesAliasUint64(t *testing.T) {
	type ID uint64
	expectedBytes, _ := hex.DecodeString("000000000000007b")
	num := uint64(123)
	id := ID(num)
	require.Equal(t, expectedBytes, MustEncode(id))
}

// Int8
func TestEncodeBytesInt8(t *testing.T) {
	expectedBytes, _ := hex.DecodeString("85")
	num := int8(-123)
	require.Equal(t, expectedBytes, MustEncode(num))
}

func TestEncodeBytesAliasInt8(t *testing.T) {
	type ID int8
	expectedBytes, _ := hex.DecodeString("85")
	num := int8(-123)
	id := ID(num)
	require.Equal(t, expectedBytes, MustEncode(id))
}

// Int16
func TestEncodeBytesInt16(t *testing.T) {
	expectedBytes, _ := hex.DecodeString("ff85")
	num := int16(-123)
	require.Equal(t, expectedBytes, MustEncode(num))
}

func TestEncodeBytesAliasInt16(t *testing.T) {
	type ID int16
	expectedBytes, _ := hex.DecodeString("ff85")
	num := int16(-123)
	id := ID(num)
	require.Equal(t, expectedBytes, MustEncode(id))
}

// Int32
func TestEncodeBytesInt32(t *testing.T) {
	expectedBytes, _ := hex.DecodeString("ffffff85")
	num := int32(-123)
	require.Equal(t, expectedBytes, MustEncode(num))
}

func TestEncodeBytesAliasInt32(t *testing.T) {
	type ID int32
	expectedBytes, _ := hex.DecodeString("ffffff85")
	num := int32(-123)
	id := ID(num)
	require.Equal(t, expectedBytes, MustEncode(id))
}

// Int64
func TestEncodeBytesInt64(t *testing.T) {
	expectedBytes, _ := hex.DecodeString("ffffffffffffff85")
	num := int64(-123)
	require.Equal(t, expectedBytes, MustEncode(num))
}

func TestEncodeBytesAliasInt64(t *testing.T) {
	type ID int64
	expectedBytes, _ := hex.DecodeString("ffffffffffffff85")
	num := int32(-123)
	id := ID(num)
	require.Equal(t, expectedBytes, MustEncode(id))
}

func TestEncodeString(t *testing.T) {
	testString := "hello alice and bob"
	expectedBytes, _ := hex.DecodeString("0000001368656c6c6f20616c69636520616e6420626f62")
	require.Equal(t, []byte(expectedBytes), MustEncode(testString))
}

func TestEncodeSlice(t *testing.T) {
	testSlice := []int32{1, 2, 3, 4, 5, 6}
	expectedBytes, _ := hex.DecodeString("00000006000000010000000200000003000000040000000500000006")
	require.Equal(t, expectedBytes, MustEncode(testSlice))
}

func TestEncodeSliceFail(t *testing.T) {
	testSlice := []bool{true, false, true, true}
	require.PanicsWithError(t, "obi: unsupported value type: bool", func() { MustEncode(testSlice) })
}

func TestEncodeByteArray(t *testing.T) {
	testByteArray, _ := hex.DecodeString("010203040506")
	expectedBytes, _ := hex.DecodeString("00000006010203040506")
	require.Equal(t, expectedBytes, MustEncode(testByteArray))
}

func TestEncodeNotSupported(t *testing.T) {
	notSupportBool := true
	byteArray, err := Encode(notSupportBool)
	require.EqualError(t, err, "obi: unsupported value type: bool")
	require.Nil(t, byteArray)
}

func TestEncodeNotSupport(t *testing.T) {
	notSupportBool := true
	require.PanicsWithError(t, "obi: unsupported value type: bool", func() { MustEncode(notSupportBool) })
}
