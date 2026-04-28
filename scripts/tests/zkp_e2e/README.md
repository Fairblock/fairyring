# ZKP multi-validator CosmWasm e2e

Run from the Fairyring repo after installing `fairyringd`:

```bash
./scripts/tests/zkp_e2e/multi_val_zkp_cw_e2e.sh
```

Useful overrides:

```bash
CW_DEPLOY_SCRIPT=/path/to/fairyport/scripts/deploy_cw.py \
CW_CONTRACT_DIR=/path/to/fairyring-contract/examples/elgamal_evm \
USE_DOCKER_OPTIMIZER=1 \
./scripts/tests/zkp_e2e/multi_val_zkp_cw_e2e.sh
```

To run only the Fairyring ZKP/wasmbinding tester and skip the existing confidential-transfer CW deployment:

```bash
RUN_EXISTING_CW_DEPLOY=0 ./scripts/tests/zkp_e2e/multi_val_zkp_cw_e2e.sh
```

The script creates a fresh four-validator chain, sets `wallet1` as the `x/zkp` authority at genesis, deploys contracts, exercises trusted-contract enforcement, and validates malformed transfer/withdraw proof query handling through a real CosmWasm contract.
