FROM --platform=$BUILDPLATFORM golang:1.21-bullseye AS build-env

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
# FROM gcr.io/distroless/base
# FROM ubuntu:20.04
#
# Read here why UID 10001: https://github.com/hexops/dockerfile/blob/main/README.md#do-not-use-a-uid-below-10000
ARG UID=10001
ARG USER_NAME=fairyring

EXPOSE 26656 26657 1317 9090

# Creates a user with $UID and $GID=$UID
RUN groupadd -g ${UID} ${USER_NAME} && \
    useradd -m ${USER_NAME} \
    --uid ${UID} \
    --gid ${UID} \
    -s /sbin/nologin

# # Run simd by default, omit entrypoint to ease using container with simcli
# #CMD ["fairyringd"]
# #STOPSIGNAL SGTERM
# WORKDIR /root
WORKDIR /app-data
RUN chown -R ${USER_NAME}:${USER_NAME} /app-data

# COPY setup.sh /usr/bin/setup.sh
# RUN ["chmod", "+x", "/usr/bin/setup.sh"]

# Copy over binaries from the build-env
# COPY --from=build-env /src/app/fairyring/build/fairyringd /usr/bin/fairyringd
RUN cp /src/app/fairyring/build/fairyringd /usr/bin/fairyringd
#
USER ${USER_NAME}
CMD ["/usr/bin/fairyringd", "version"]
