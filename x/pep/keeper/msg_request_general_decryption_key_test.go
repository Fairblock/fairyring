package keeper_test

import (
	"testing"

	keepertest "github.com/Fairblock/fairyring/testutil/keeper"
	kstypes "github.com/Fairblock/fairyring/x/keyshare/types"
	"github.com/Fairblock/fairyring/x/pep/keeper"
	"github.com/Fairblock/fairyring/x/pep/types"
	sdk "github.com/cosmos/cosmos-sdk/types"
	channeltypes "github.com/cosmos/ibc-go/v8/modules/core/04-channel/types"
	"github.com/stretchr/testify/require"
)

func TestGetGeneralKeyshare(t *testing.T) {
	// Initialize the keeper, context, and other dependencies
	k, ctx := keepertest.PepKeeper(t)
	goCtx := sdk.WrapSDKContext(ctx)
	srv := keeper.NewMsgServerImpl(k)

	creator := "fairy1m9l358xunhhwds0568za49mzhvuxx9uxdra8sq"

	// Test case when entry is not found
	msg := &types.MsgRequestGeneralDecryptionKey{
		Creator:  creator,
		Identity: "invalid_req_id",
	}

	_, err := srv.RequestGeneralDecryptionKey(goCtx, msg)
	require.Error(t, err)
	require.Equal(t, "request not found", err.Error())

	// Test case when creator is unauthorized
	entry := types.IdentityExecutionEntry{
		Creator:  "authorized_creator",
		Identity: "test_identity",
	}

	k.SetEntry(ctx, entry)

	msg = &types.MsgRequestGeneralDecryptionKey{
		Creator:  "unauthorized_creator",
		Identity: "test_req_id",
	}

	_, err = srv.RequestGeneralDecryptionKey(goCtx, msg)
	require.Error(t, err)
	require.Equal(t, "unauthorized request. only creator can make this request", err.Error())

	// Test case when IsSourceChain is true
	k.SetParams(ctx, types.Params{IsSourceChain: true})

	msg = &types.MsgRequestGeneralDecryptionKey{
		Creator:  "authorized_creator",
		Identity: "test_req_id",
	}

	_, err = srv.RequestGeneralDecryptionKey(goCtx, msg)
	require.NoError(t, err)

	// Ensure the correct request is stored
	req, found := k.GetSignalQueueEntry(ctx, "test_req_id")
	require.True(t, found)
	require.NotNil(t, req)
	require.Equal(t, "test_identity", req.Identity)
}

func TestOnAcknowledgementGetDecryptionKeyPacket(t *testing.T) {
	// Initialize the keeper, context, and other dependencies
	k, ctx := keepertest.PepKeeper(t)

	packet := channeltypes.Packet{}
	packetData := kstypes.GetDecryptionKeyPacketData{
		Identity: "test_identity",
	}
	ack := channeltypes.Acknowledgement{
		Response: &channeltypes.Acknowledgement_Result{
			Result: []byte(`{}`),
		},
	}

	// Test success case for OnAcknowledgementGetDecryptionKeyPacket
	err := k.OnAcknowledgementGetDecryptionKeyPacket(ctx, packet, packetData, ack)
	require.NoError(t, err)

	// Test error case for unmarshalling acknowledgment
	invalidAck := channeltypes.Acknowledgement{
		Response: &channeltypes.Acknowledgement_Result{
			Result: []byte("invalid_json"),
		},
	}

	err = k.OnAcknowledgementGetDecryptionKeyPacket(ctx, packet, packetData, invalidAck)
	require.Error(t, err)
	require.Equal(t, "cannot unmarshal acknowledgment", err.Error())

	// Test when Acknowledgement_Error is returned
	errorAck := channeltypes.Acknowledgement{
		Response: &channeltypes.Acknowledgement_Error{
			Error: "test_error",
		},
	}

	err = k.OnAcknowledgementGetDecryptionKeyPacket(ctx, packet, packetData, errorAck)
	require.NoError(t, err)
}
