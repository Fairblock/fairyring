package keeper

import (
	"context"
	"fmt"

	sdk "github.com/cosmos/cosmos-sdk/types"
)

// GetValidatorConsensusPower returns the validator's current consensus power
// from the staking module. The slashing keeper expects consensus power, not a
// percentage or a fixed constant.
func (k Keeper) GetValidatorConsensusPower(ctx context.Context, validator string) (int64, error) {
	accAddr, err := sdk.AccAddressFromBech32(validator)
	if err != nil {
		return 0, fmt.Errorf("invalid validator account address %q: %w", validator, err)
	}

	stakingValidator, err := k.stakingKeeper.GetValidator(ctx, sdk.ValAddress(accAddr))
	if err != nil {
		return 0, fmt.Errorf("staking validator %q not found: %w", validator, err)
	}

	return stakingValidator.ConsensusPower(sdk.DefaultPowerReduction), nil
}
