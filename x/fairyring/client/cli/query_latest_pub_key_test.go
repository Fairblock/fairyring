package cli_test

import (
	"fmt"
	"strconv"
	"testing"

	clitestutil "github.com/cosmos/cosmos-sdk/testutil/cli"
	"github.com/stretchr/testify/require"
	tmcli "github.com/tendermint/tendermint/libs/cli"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"

	"fairyring/testutil/network"
	"fairyring/testutil/nullify"
	"fairyring/x/fairyring/client/cli"
	"fairyring/x/fairyring/types"
)

// Prevent strconv unused error
var _ = strconv.IntSize

func networkWithLatestPubKeyObjects(t *testing.T, n int) (*network.Network, types.LatestPubKey) {
	t.Helper()
	cfg := network.DefaultConfig()
	state := types.GenesisState{}
	require.NoError(t, cfg.Codec.UnmarshalJSON(cfg.GenesisState[types.ModuleName], &state))

	for i := 0; i < n; i++ {
		latestPubKey := types.LatestPubKey{
			PublicKey: strconv.Itoa(i),
		}
		nullify.Fill(&latestPubKey)
		state.LatestPubKey = latestPubKey
	}
	buf, err := cfg.Codec.MarshalJSON(&state)
	require.NoError(t, err)
	cfg.GenesisState[types.ModuleName] = buf
	return network.New(t, cfg), state.LatestPubKey
}

func TestShowLatestPubKey(t *testing.T) {
	net, objs := networkWithLatestPubKeyObjects(t, 2)

	ctx := net.Validators[0].ClientCtx
	common := []string{
		fmt.Sprintf("--%s=json", tmcli.OutputFlag),
	}
	for _, tc := range []struct {
		desc   string
		pubKey string

		args []string
		err  error
		obj  types.LatestPubKey
	}{
		{
			desc:   "found",
			pubKey: objs.PublicKey,

			args: common,
			obj:  objs,
		},
		{
			desc:   "not found",
			pubKey: "100000",

			args: common,
			err:  status.Error(codes.NotFound, "not found"),
		},
	} {
		t.Run(tc.desc, func(t *testing.T) {
			args := []string{
				tc.pubKey,
			}
			args = append(args, tc.args...)
			out, err := clitestutil.ExecTestCLICmd(ctx, cli.CmdShowLatestPubKey(), args)
			if tc.err != nil {
				stat, ok := status.FromError(tc.err)
				require.True(t, ok)
				require.ErrorIs(t, stat.Err(), tc.err)
			} else {
				require.NoError(t, err)
				var resp types.QueryLatestPubKeyResponse
				require.NoError(t, net.Config.Codec.UnmarshalJSON(out.Bytes(), &resp))
				require.NotNil(t, resp.LatestPubKey)
				require.Equal(t,
					nullify.Fill(&tc.obj),
					nullify.Fill(&resp.LatestPubKey),
				)
			}
		})
	}
}
