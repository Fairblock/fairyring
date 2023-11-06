package main

import (
	"bytes"
	"encoding/hex"
	"fmt"
	enc "github.com/FairBlock/DistributedIBE/encryption"
	"os"
//	transfertypes "github.com/cosmos/ibc-go/v7/modules/apps/transfer/types"
	bls "github.com/drand/kyber-bls12381"
)

const EXPECTING_ARG_NUM = 4

func main() {
	if len(os.Args) < EXPECTING_ARG_NUM {
		panic(fmt.Sprintf("\nExpecting %d arguments, got %d arguments. Usage: ./encrypter <ID> <publickey> <plaintext> <optional: privatekey>\n", EXPECTING_ARG_NUM, len(os.Args)))
	}

	suite := bls.NewBLS12381Suite()
	publicKeyByte, err := hex.DecodeString(os.Args[2])
	if err != nil {
		panic(fmt.Sprintf("\nError decoding public key: %s\n", err.Error()))
	}

	publicKeyPoint := suite.G1().Point()
	err = publicKeyPoint.UnmarshalBinary(publicKeyByte)
	if err != nil {
		panic(fmt.Sprintf("\nError unmarshalling public key: %s\n", err.Error()))
	}
plain := []byte{10,8,116,114,97,110,115,102,101,114,18,9,99,104,97,110,110,101,108,45,49,26,10,10,3,102,114,116,18,3,53,48,48,34,44,102,97,105,114,121,49,112,54,99,97,53,55,99,117,53,117,56,57,113,122,102,53,56,107,114,120,103,120,97,101,122,112,52,119,109,57,118,117,55,108,117,114,51,99,42,63,111,115,109,111,49,52,104,106,50,116,97,118,113,56,102,112,101,115,100,119,120,120,99,117,52,52,114,116,121,51,104,104,57,48,118,104,117,106,114,118,99,109,115,116,108,52,122,114,51,116,120,109,102,118,119,57,115,113,50,114,57,103,57,50,13,8,128,200,175,160,37,16,128,208,219,195,244,2,56,240,154,248,173,224,143,192,202,23,66,143,3,123,34,119,97,115,109,34,58,123,34,99,111,110,116,114,97,99,116,34,58,34,111,115,109,111,49,52,104,106,50,116,97,118,113,56,102,112,101,115,100,119,120,120,99,117,52,52,114,116,121,51,104,104,57,48,118,104,117,106,114,118,99,109,115,116,108,52,122,114,51,116,120,109,102,118,119,57,115,113,50,114,57,103,57,34,44,32,34,109,115,103,34,58,123,34,115,119,97,112,95,119,105,116,104,95,97,99,116,105,111,110,34,58,123,34,115,119,97,112,95,109,115,103,34,58,123,34,116,111,107,101,110,95,111,117,116,95,109,105,110,95,97,109,111,117,110,116,34,58,34,49,48,34,44,34,112,97,116,104,34,58,91,123,34,112,111,111,108,95,105,100,34,58,34,49,34,44,34,116,111,107,101,110,95,111,117,116,95,100,101,110,111,109,34,58,34,117,111,115,109,111,34,125,93,125,44,34,97,102,116,101,114,95,115,119,97,112,95,97,99,116,105,111,110,34,58,123,34,105,98,99,95,116,114,97,110,115,102,101,114,34,58,123,34,114,101,99,101,105,118,101,114,34,58,34,102,97,105,114,121,49,112,54,99,97,53,55,99,117,53,117,56,57,113,122,102,53,56,107,114,120,103,120,97,101,122,112,52,119,109,57,118,117,55,108,117,114,51,99,34,44,34,99,104,97,110,110,101,108,34,58,34,99,104,97,110,110,101,108,45,48,34,125,125,44,34,108,111,99,97,108,95,102,97,108,108,98,97,99,107,95,97,100,100,114,101,115,115,34,58,34,111,115,109,111,49,50,115,109,120,50,119,100,108,121,116,116,118,121,122,118,122,103,53,52,121,50,118,110,113,119,113,50,113,106,97,116,101,117,102,55,116,104,106,34,125,125,125,125}

	var destCipherData bytes.Buffer
	var plainTextBuffer bytes.Buffer
	_, err = plainTextBuffer.WriteString(string(plain))
	if err != nil {
		panic(fmt.Sprintf("\nError writing plaintext string to buffer: %s\n", err.Error()))
	}

	err = enc.Encrypt(publicKeyPoint, []byte(os.Args[1]), &destCipherData, &plainTextBuffer)
	if err != nil {
		panic(fmt.Sprintf("\nError encrypting: %s\n", err.Error()))
	}

	hexCipher := hex.EncodeToString(destCipherData.Bytes())

	fmt.Println(hexCipher)

	if len(os.Args) == EXPECTING_ARG_NUM+1 {
		privateKeyByte, err := hex.DecodeString(os.Args[4])
		if err != nil {
			panic(fmt.Sprintf("\nError decoding private key: %s\n", err.Error()))
		}

		privateKeyPoint := suite.G2().Point()
		err = privateKeyPoint.UnmarshalBinary(privateKeyByte)
		if err != nil {
			panic(fmt.Sprintf("\nError unmarshalling private key: %s\n", err.Error()))
		}

		cipherBytes, err := hex.DecodeString(hexCipher)
		if err != nil {
			panic(fmt.Sprintf("\nError decoding cipher from hex to bytes: %s\n", err.Error()))
		}

		var destPlainText bytes.Buffer
		var cipherBuffer bytes.Buffer
		_, err = cipherBuffer.Write(cipherBytes)
		if err != nil {
			panic(fmt.Sprintf("\nError writing plaintext string to buffer: %s\n", err.Error()))
		}

		err = enc.Decrypt(publicKeyPoint, privateKeyPoint, &destPlainText, &cipherBuffer)
		if err != nil {
			panic(fmt.Sprintf("\nError decrypting: %s\n", err.Error()))
		}

		fmt.Printf("\nDecrypt Cipher Successfully:\n%s\n", destPlainText.String())
	}
}
