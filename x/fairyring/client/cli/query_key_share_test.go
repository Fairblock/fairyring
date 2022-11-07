package cli_test

import (
	"fmt"
	"strconv"
	"testing"

	"github.com/cosmos/cosmos-sdk/client/flags"
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

func networkWithKeyShareObjects(t *testing.T, n int) (*network.Network, []types.KeyShare) {
	t.Helper()
	cfg := network.DefaultConfig()
	state := types.GenesisState{}
	require.NoError(t, cfg.Codec.UnmarshalJSON(cfg.GenesisState[types.ModuleName], &state))

	for i := 0; i < n; i++ {
		keyShare := types.KeyShare{
			Validator:   strconv.Itoa(i),
			BlockHeight: uint64(i),
		}
		nullify.Fill(&keyShare)
		state.KeyShareList = append(state.KeyShareList, keyShare)
	}
	buf, err := cfg.Codec.MarshalJSON(&state)
	require.NoError(t, err)
	cfg.GenesisState[types.ModuleName] = buf
	return network.New(t, cfg), state.KeyShareList
}

func TestShowKeyShare(t *testing.T) {
	net, objs := networkWithKeyShareObjects(t, 2)

	ctx := net.Validators[0].ClientCtx
	common := []string{
		fmt.Sprintf("--%s=json", tmcli.OutputFlag),
	}
	for _, tc := range []struct {
		desc          string
		idValidator   string
		idBlockHeight uint64

		args []string
		err  error
		obj  types.KeyShare
	}{
		{
			desc:          "found",
			idValidator:   objs[0].Validator,
			idBlockHeight: objs[0].BlockHeight,

			args: common,
			obj:  objs[0],
		},
		{
			desc:          "not found",
			idValidator:   strconv.Itoa(100000),
			idBlockHeight: 100000,

			args: common,
			err:  status.Error(codes.NotFound, "not found"),
		},
	} {
		t.Run(tc.desc, func(t *testing.T) {
			args := []string{
				tc.idValidator,
				strconv.Itoa(int(tc.idBlockHeight)),
			}
			args = append(args, tc.args...)
			out, err := clitestutil.ExecTestCLICmd(ctx, cli.CmdShowKeyShare(), args)
			if tc.err != nil {
				stat, ok := status.FromError(tc.err)
				require.True(t, ok)
				require.ErrorIs(t, stat.Err(), tc.err)
			} else {
				require.NoError(t, err)
				var resp types.QueryGetKeyShareResponse
				require.NoError(t, net.Config.Codec.UnmarshalJSON(out.Bytes(), &resp))
				require.NotNil(t, resp.KeyShare)
				require.Equal(t,
					nullify.Fill(&tc.obj),
					nullify.Fill(&resp.KeyShare),
				)
			}
		})
	}
}

func TestListKeyShare(t *testing.T) {
	net, objs := networkWithKeyShareObjects(t, 5)

	ctx := net.Validators[0].ClientCtx
	request := func(next []byte, offset, limit uint64, total bool) []string {
		args := []string{
			fmt.Sprintf("--%s=json", tmcli.OutputFlag),
		}
		if next == nil {
			args = append(args, fmt.Sprintf("--%s=%d", flags.FlagOffset, offset))
		} else {
			args = append(args, fmt.Sprintf("--%s=%s", flags.FlagPageKey, next))
		}
		args = append(args, fmt.Sprintf("--%s=%d", flags.FlagLimit, limit))
		if total {
			args = append(args, fmt.Sprintf("--%s", flags.FlagCountTotal))
		}
		return args
	}
	t.Run("ByOffset", func(t *testing.T) {
		step := 2
		for i := 0; i < len(objs); i += step {
			args := request(nil, uint64(i), uint64(step), false)
			out, err := clitestutil.ExecTestCLICmd(ctx, cli.CmdListKeyShare(), args)
			require.NoError(t, err)
			var resp types.QueryAllKeyShareResponse
			require.NoError(t, net.Config.Codec.UnmarshalJSON(out.Bytes(), &resp))
			require.LessOrEqual(t, len(resp.KeyShare), step)
			require.Subset(t,
				nullify.Fill(objs),
				nullify.Fill(resp.KeyShare),
			)
		}
	})
	t.Run("ByKey", func(t *testing.T) {
		step := 2
		var next []byte
		for i := 0; i < len(objs); i += step {
			args := request(next, 0, uint64(step), false)
			out, err := clitestutil.ExecTestCLICmd(ctx, cli.CmdListKeyShare(), args)
			require.NoError(t, err)
			var resp types.QueryAllKeyShareResponse
			require.NoError(t, net.Config.Codec.UnmarshalJSON(out.Bytes(), &resp))
			require.LessOrEqual(t, len(resp.KeyShare), step)
			require.Subset(t,
				nullify.Fill(objs),
				nullify.Fill(resp.KeyShare),
			)
			next = resp.Pagination.NextKey
		}
	})
	t.Run("Total", func(t *testing.T) {
		args := request(nil, 0, uint64(len(objs)), true)
		out, err := clitestutil.ExecTestCLICmd(ctx, cli.CmdListKeyShare(), args)
		require.NoError(t, err)
		var resp types.QueryAllKeyShareResponse
		require.NoError(t, net.Config.Codec.UnmarshalJSON(out.Bytes(), &resp))
		require.NoError(t, err)
		require.Equal(t, len(objs), int(resp.Pagination.Total))
		require.ElementsMatch(t,
			nullify.Fill(objs),
			nullify.Fill(resp.KeyShare),
		)
	})
}
