# Installing Fairyring

This section notes the minimum and recommended requirements for running the FairyRing Application

## Hardware Requirements

- **Minimal**
  - 4 GB RAM
  - 500 GB HDD
  - 1.4 GHz CPU
- **Recommended**
  - 8 GB RAM
  - 2 TB HDD
  - 2.0 GHz x2 CPU

---

## Operating System

- Linux/Windows/MacOS(x86)
- **Recommended**
  - Linux(x86_64)

---

## Installation Steps

>
>Prerequisite: go1.21+ required. [ref](https://golang.org/doc/install)

FairyRing could be installed by two ways - downloading binary from releases page or build from source.

### Download from releases page

- Download from release required binary

- Check sha256 hash sum

- Place fairyringd into /usr/local/sbin

```shell
sudo mv fairyringd /usr/local/sbin/fairyringd
```

---

### Building from source

>
>Optional requirement: git. [ref](https://github.com/git/git) and GNU make. [ref](https://www.gnu.org/software/make/manual/html_node/index.html)

- Clone git repository

```shell
git clone https://github.com/FairBlock/fairyring
```

- Checkout release tag

```shell
cd fairyring
git fetch --tags
git checkout [vX.X.X]
```

- Install

```shell
go mod tidy
make install
```

---

### Install system.d service file

```shell
nano /etc/systemd/system/fairyringd.service
```

Please following contents(working dir may be changed as needed)

```systemd
[Unit]
Description=Fairyring node
After=network.target

[Service]
Type=simple
User=ubuntu
WorkingDirectory=/home/ubuntu
ExecStart=/usr/local/sbin/fairyringd start
Restart=on-failure
RestartSec=10
LimitNOFILE=40960

[Install]
WantedBy=multi-user.target
```

Reload unit files in systemd

```shell
sudo systemctl daemon-reload
```
