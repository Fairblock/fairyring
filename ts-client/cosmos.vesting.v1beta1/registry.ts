import { GeneratedType } from "@cosmjs/proto-signing";
import { Period } from "./types/../../../../../pkg/mod/github.com/!fairblock/cosmos-sdk@v0.50.8-fairyring-2/proto/cosmos/vesting/v1beta1/vesting";
import { PeriodicVestingAccount } from "./types/../../../../../pkg/mod/github.com/!fairblock/cosmos-sdk@v0.50.8-fairyring-2/proto/cosmos/vesting/v1beta1/vesting";
import { ContinuousVestingAccount } from "./types/../../../../../pkg/mod/github.com/!fairblock/cosmos-sdk@v0.50.8-fairyring-2/proto/cosmos/vesting/v1beta1/vesting";
import { PermanentLockedAccount } from "./types/../../../../../pkg/mod/github.com/!fairblock/cosmos-sdk@v0.50.8-fairyring-2/proto/cosmos/vesting/v1beta1/vesting";
import { DelayedVestingAccount } from "./types/../../../../../pkg/mod/github.com/!fairblock/cosmos-sdk@v0.50.8-fairyring-2/proto/cosmos/vesting/v1beta1/vesting";
import { MsgCreateVestingAccount } from "./types/../../../../../pkg/mod/github.com/!fairblock/cosmos-sdk@v0.50.8-fairyring-2/proto/cosmos/vesting/v1beta1/tx";
import { MsgCreateVestingAccountResponse } from "./types/../../../../../pkg/mod/github.com/!fairblock/cosmos-sdk@v0.50.8-fairyring-2/proto/cosmos/vesting/v1beta1/tx";
import { MsgCreatePermanentLockedAccount } from "./types/../../../../../pkg/mod/github.com/!fairblock/cosmos-sdk@v0.50.8-fairyring-2/proto/cosmos/vesting/v1beta1/tx";
import { MsgCreatePermanentLockedAccountResponse } from "./types/../../../../../pkg/mod/github.com/!fairblock/cosmos-sdk@v0.50.8-fairyring-2/proto/cosmos/vesting/v1beta1/tx";
import { MsgCreatePeriodicVestingAccount } from "./types/../../../../../pkg/mod/github.com/!fairblock/cosmos-sdk@v0.50.8-fairyring-2/proto/cosmos/vesting/v1beta1/tx";
import { MsgCreatePeriodicVestingAccountResponse } from "./types/../../../../../pkg/mod/github.com/!fairblock/cosmos-sdk@v0.50.8-fairyring-2/proto/cosmos/vesting/v1beta1/tx";
import { BaseVestingAccount } from "./types/../../../../../pkg/mod/github.com/!fairblock/cosmos-sdk@v0.50.8-fairyring-2/proto/cosmos/vesting/v1beta1/vesting";

const msgTypes: Array<[string, GeneratedType]>  = [
    ["/cosmos.vesting.v1beta1.Period", Period],
    ["/cosmos.vesting.v1beta1.PeriodicVestingAccount", PeriodicVestingAccount],
    ["/cosmos.vesting.v1beta1.ContinuousVestingAccount", ContinuousVestingAccount],
    ["/cosmos.vesting.v1beta1.PermanentLockedAccount", PermanentLockedAccount],
    ["/cosmos.vesting.v1beta1.DelayedVestingAccount", DelayedVestingAccount],
    ["/cosmos.vesting.v1beta1.MsgCreateVestingAccount", MsgCreateVestingAccount],
    ["/cosmos.vesting.v1beta1.MsgCreateVestingAccountResponse", MsgCreateVestingAccountResponse],
    ["/cosmos.vesting.v1beta1.MsgCreatePermanentLockedAccount", MsgCreatePermanentLockedAccount],
    ["/cosmos.vesting.v1beta1.MsgCreatePermanentLockedAccountResponse", MsgCreatePermanentLockedAccountResponse],
    ["/cosmos.vesting.v1beta1.MsgCreatePeriodicVestingAccount", MsgCreatePeriodicVestingAccount],
    ["/cosmos.vesting.v1beta1.MsgCreatePeriodicVestingAccountResponse", MsgCreatePeriodicVestingAccountResponse],
    ["/cosmos.vesting.v1beta1.BaseVestingAccount", BaseVestingAccount],
    
];

export { msgTypes }