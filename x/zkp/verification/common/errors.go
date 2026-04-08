package common

import "errors"

var ErrDeserialization = errors.New("deserialization error")
var ErrVectorLengthMismatch = errors.New("vector length mismatch")
var ErrInvalidInput = errors.New("invalid input")

