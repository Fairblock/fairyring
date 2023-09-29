package types_test

import (
	"testing"

	"fairyring/x/pricefeed/types"

	"github.com/stretchr/testify/require"
)

func TestUpdateSymbolRequestProposal(t *testing.T) {
	r1 := types.NewSymbolRequest("BTC", 1, 20,1000)
	r2 := types.NewSymbolRequest("ETH", 1, 20,1000)
	p := types.NewUpdateSymbolRequestProposal("test title", "test description", []types.SymbolRequest{r1, r2})

	require.Equal(t, "test title", p.GetTitle())
	require.Equal(t, "test description", p.GetDescription())
	require.Equal(t, types.RouterKey, p.ProposalRoute())
	require.Equal(t, types.UpdateSymbolRequest, p.ProposalType())
	require.NoError(t, p.ValidateBasic())

	p = types.NewUpdateSymbolRequestProposal("test title", "test description", []types.SymbolRequest{})
	require.Error(t, p.ValidateBasic())

	r3 := types.NewSymbolRequest("", 1, 20,1000)
	p = types.NewUpdateSymbolRequestProposal("test title", "test description", []types.SymbolRequest{r3})
	require.Error(t, p.ValidateBasic())

	r4 := types.NewSymbolRequest("BTC", 0, 0,1000)
	p = types.NewUpdateSymbolRequestProposal("test title", "test description", []types.SymbolRequest{r4})
	require.NoError(t, p.ValidateBasic())

	r5 := types.NewSymbolRequest("BTC", 0, 20,1000)
	p = types.NewUpdateSymbolRequestProposal("test title", "test description", []types.SymbolRequest{r5})
	require.Error(t, p.ValidateBasic())

	r6 := types.NewSymbolRequest("BTC", 1, 0,1000)
	p = types.NewUpdateSymbolRequestProposal("test title", "test description", []types.SymbolRequest{r6})
	require.NoError(t, p.ValidateBasic())
}
