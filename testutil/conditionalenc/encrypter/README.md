# IBE Tx Encrypter

An executable for encrypting plain text using DistributedIBE encryption with given ID & public key

## Build:

```bash
go build
go install
```

Now you can run the `encrypter` in terminal with 

```
encrypter <ID> <Public Key in Hex> <Plain Text>
```

If you get this error `encrypter: command not found`, Run the following command

```bash
export PATH=$PATH:$(go env GOPATH)/bin
```

or you can run the executable by `./encrypter` after `go build`

## Usage: 

`./encrypter <ID> <Public Key in Hex> <Plain Text>`

## Example:

### To Encrypt a plaintext

`./encrypter Random_IBE_ID 84dbb7681181e69db71a99e9427344a4478a8b2911f3c6ef36a1891b2e6b4fcfee5c6942ca42502eafe6fc7ec782f60d "Hello World"`


### To Encrypt a plaintext & Decrypt it

`./encrypter Random_IBE_ID 84dbb7681181e69db71a99e9427344a4478a8b2911f3c6ef36a1891b2e6b4fcfee5c6942ca42502eafe6fc7ec782f60d "Hello World" b45ee7403c8b3f4dfbdbada34a7c060a818b97ba66865663967f3ba912d4438430b43aacb5db1ea62168bac6171d148d0f6bb3389321dc69bf1420ce03cbceb3e4cff764252f9b1dd476f09f4ff958b6d06a149aec3d5c567afd1f05a1417dc8`