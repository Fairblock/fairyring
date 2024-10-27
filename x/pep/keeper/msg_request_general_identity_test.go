package keeper_test

import (
	"errors"
	"testing"
	"time"

	keepertest "github.com/Fairblock/fairyring/testutil/keeper"
	kstypes "github.com/Fairblock/fairyring/x/keyshare/types"
	"github.com/Fairblock/fairyring/x/pep/keeper"
	"github.com/Fairblock/fairyring/x/pep/types"
	sdk "github.com/cosmos/cosmos-sdk/types"
	channeltypes "github.com/cosmos/ibc-go/v8/modules/core/04-channel/types"
	"github.com/stretchr/testify/require"
)

func TestRequestGeneralIdentity(t *testing.T) {
	// Initialize the keeper, context, and other dependencies
	k, ctx := keepertest.PepKeeper(t)
	goCtx := sdk.WrapSDKContext(ctx)
	srv := keeper.NewMsgServerImpl(k)

	creator := "fairy1m9l358xunhhwds0568za49mzhvuxx9uxdra8sq"
	duration := time.Duration(5 * time.Second)
	// Test case when ReqId already exists
	reqID := types.RequestId{
		Creator: creator,
		ReqId:   "test_req_id_1",
	}
	k.SetRequestId(ctx, reqID)

	msg := &types.MsgRequestGeneralIdentity{
		Creator:        creator,
		ReqId:          "test_req_id_1",
		EstimatedDelay: &duration,
	}

	_, err := srv.RequestGeneralIdentity(goCtx, msg)
	require.Error(t, err)
	require.Equal(t, types.ErrReqIDAlreadyExists, err)

	// Test case when EstimatedDelay is nil
	msg.EstimatedDelay = nil
	msg.ReqId = "test_req_id_2"

	_, err = srv.RequestGeneralIdentity(goCtx, msg)
	require.Error(t, err)
	require.Equal(t, errors.New("could not parse estimated delay"), err)

	// Test case when IsSourceChain is true
	k.SetParams(ctx, types.Params{IsSourceChain: true})

	msg.EstimatedDelay = &duration
	msg.ReqId = "test_req_id_3"

	resp, err := srv.RequestGeneralIdentity(goCtx, msg)
	require.NoError(t, err)
	require.NotNil(t, resp)
	require.Equal(t, "fairy1m9l358xunhhwds0568za49mzhvuxx9uxdra8sq/test_req_id_3", resp.Identity)
}

func TestOnAcknowledgementRequestDecryptionKeyPacket(t *testing.T) {
	// Initialize the keeper, context, and other dependencies
	k, ctx := keepertest.PepKeeper(t)

	packet := channeltypes.Packet{}
	packetData := kstypes.RequestDecryptionKeyPacketData{
		Requester: "test_creator",
		Id: &kstypes.RequestDecryptionKeyPacketData_Identity{
			Identity: "test_request_id",
		},
	}
	ack := channeltypes.Acknowledgement{
		Response: &channeltypes.Acknowledgement_Result{
			Result: []byte(`{"identity":"test_identity", "pubkey":"test_pubkey"}`),
		},
	}

	// Test success case for OnAcknowledgementRequestDecryptionKeyPacket
	err := k.OnAcknowledgementRequestDecryptionKeyPacket(ctx, packet, packetData, ack)
	require.NoError(t, err)

	// Ensure entry is created
	entry, found := k.GetEntry(ctx, "test_request_id")
	require.True(t, found)
	require.Equal(t, "test_identity", entry.Identity)
	require.Equal(t, "test_pubkey", entry.Pubkey)

	// Test when entry already exists
	err = k.OnAcknowledgementRequestDecryptionKeyPacket(ctx, packet, packetData, ack)
	require.Error(t, err)
	require.Equal(t, "entry already exists", err.Error())

	// Test error case for unmarshalling acknowledgment
	invalidAck := channeltypes.Acknowledgement{
		Response: &channeltypes.Acknowledgement_Result{
			Result: []byte("invalid_json"),
		},
	}

	err = k.OnAcknowledgementRequestDecryptionKeyPacket(ctx, packet, packetData, invalidAck)
	require.Error(t, err)
	require.Equal(t, "cannot unmarshal acknowledgment", err.Error())

	// Test when Acknowledgement_Error is returned
	errorAck := channeltypes.Acknowledgement{
		Response: &channeltypes.Acknowledgement_Error{
			Error: "test_error",
		},
	}

	err = k.OnAcknowledgementRequestDecryptionKeyPacket(ctx, packet, packetData, errorAck)
	require.NoError(t, err)
}
