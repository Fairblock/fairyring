FROM --platform=$BUILDPLATFORM golang:1.20-bullseye AS build-env

WORKDIR /src/app/fairyring/DistributedIBE
COPY DistributedIBE/go.mod DistributedIBE/go.sum ./
RUN go mod download
COPY . .

WORKDIR /src/app/fairyring
COPY go.mod go.sum ./
RUN go mod download
COPY . .

# Dockerfile Cross-Compilation Guide
# https://www.docker.com/blog/faster-multi-platform-builds-dockerfile-cross-compilation-guide
ARG TARGETOS TARGETARCH

# install simapp, remove packages
RUN GOOS=$TARGETOS GOARCH=$TARGETARCH make build

# Final image, without build artifacts. `/base` already contains openssl, glibc and all required libs to start an app
FROM gcr.io/distroless/base
FROM ubuntu:20.04

EXPOSE 26656 26657 1317 9090

# Run simd by default, omit entrypoint to ease using container with simcli
#CMD ["fairyringd"]
#STOPSIGNAL SIGTERM
WORKDIR /root

COPY setup.sh /usr/bin/setup.sh
RUN ["chmod", "+x", "/usr/bin/setup.sh"]

# Copy over binaries from the build-env
COPY --from=build-env /src/app/fairyring/build/fairyringd /usr/bin/fairyringd

CMD ["/usr/bin/fairyringd", "version"]