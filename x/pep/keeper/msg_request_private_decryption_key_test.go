package keeper_test

import (
	"testing"

	keepertest "github.com/Fairblock/fairyring/testutil/keeper"
	commontypes "github.com/Fairblock/fairyring/x/common/types"
	kstypes "github.com/Fairblock/fairyring/x/keyshare/types"
	"github.com/Fairblock/fairyring/x/pep/keeper"
	"github.com/Fairblock/fairyring/x/pep/types"
	sdk "github.com/cosmos/cosmos-sdk/types"
	channeltypes "github.com/cosmos/ibc-go/v8/modules/core/04-channel/types"
	"github.com/stretchr/testify/mock"
	"github.com/stretchr/testify/require"
)

func TestGetPrivateKeyshares(t *testing.T) {
	// Initialize the keeper, context, and other dependencies
	k, ctx := keepertest.PepKeeper(t)
	goCtx := sdk.WrapSDKContext(ctx)
	srv := keeper.NewMsgServerImpl(k)

	creator := "cosmos1nm0rrq86ucezaf8uj35pq9fpwr5r82cl8sc7p5"
	requester := sdk.AccAddress(creator)

	price := sdk.NewInt64Coin("ufairy", 0)
	params := types.Params{
		PrivateDecryptionKeyPrice: &price,
		IsSourceChain:             true,
	}
	k.SetParams(ctx, params)

	// Test case when entry and pubkey are not found
	msg := &types.MsgRequestPrivateDecryptionKey{
		Creator:    creator,
		Identity:   "test_req_id_1",
		SecpPubkey: "test_pubkey",
	}

	_, err := srv.RequestPrivateDecryptionKey(goCtx, msg)
	require.Error(t, err)
	require.Equal(t, "entry and pubkey not found", err.Error())

	// Set a mock active pubkey and test the entry creation
	k.SetActivePubkey(ctx, commontypes.ActivePublicKey{
		PublicKey: "mock_pubkey",
	})

	_, err = srv.RequestPrivateDecryptionKey(goCtx, msg)
	require.NoError(t, err)

	// Ensure the private request is stored
	entry, found := k.GetPrivateRequest(ctx, "test_req_id_1")
	require.True(t, found)
	require.Equal(t, "test_req_id_1", entry.Identity)

	// Mock the bank keeper for the SendCoinsFromAccountToModule call
	mockBankKeeper := new(MockBankKeeper)
	mockBankKeeper.On("SendCoinsFromAccountToModule", ctx, requester, types.ModuleName, sdk.NewCoins(*params.PrivateDecryptionKeyPrice)).
		Return(nil).Once()

	_, err = srv.RequestPrivateDecryptionKey(goCtx, msg)
	require.NoError(t, err)
}

func TestOnAcknowledgementGetPrivateKeysharePacket(t *testing.T) {
	// Initialize the keeper, context, and other dependencies
	k, ctx := keepertest.PepKeeper(t)

	packet := channeltypes.Packet{}
	packetData := kstypes.GetPrivateDecryptionKeyPacketData{
		Identity:   "test_identity",
		Requester:  "test_creator",
		SecpPubkey: "test_pubkey",
	}
	ack := channeltypes.Acknowledgement{
		Response: &channeltypes.Acknowledgement_Result{
			Result: []byte(`{}`),
		},
	}

	// Test success case for OnAcknowledgementGetPrivateKeysharePacket
	err := k.OnAcknowledgementGetPrivateDecryptionKeyPacket(ctx, packet, packetData, ack)
	require.NoError(t, err)

	// Test error case for unmarshalling acknowledgment
	invalidAck := channeltypes.Acknowledgement{
		Response: &channeltypes.Acknowledgement_Result{
			Result: []byte("invalid_json"),
		},
	}

	err = k.OnAcknowledgementGetPrivateDecryptionKeyPacket(ctx, packet, packetData, invalidAck)
	require.Error(t, err)
	require.Equal(t, "cannot unmarshal acknowledgment", err.Error())

	// Test when Acknowledgement_Error is returned
	errorAck := channeltypes.Acknowledgement{
		Response: &channeltypes.Acknowledgement_Error{
			Error: "test_error",
		},
	}

	err = k.OnAcknowledgementGetPrivateDecryptionKeyPacket(ctx, packet, packetData, errorAck)
	require.NoError(t, err)
}

// MockBankKeeper is a mock implementation of the bank keeper for testing purposes
type MockBankKeeper struct {
	mock.Mock
}

func (m *MockBankKeeper) SendCoinsFromAccountToModule(ctx sdk.Context, fromAddr sdk.AccAddress, moduleName string, amt sdk.Coins) error {
	args := m.Called(ctx, fromAddr, moduleName, amt)
	return args.Error(0)
}
