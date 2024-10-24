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
	"github.com/stretchr/testify/require"
)

func TestRequestPrivateIdentity(t *testing.T) {
	// Initialize the keeper, context, and other dependencies
	k, ctx := keepertest.PepKeeper(t)
	goCtx := sdk.WrapSDKContext(ctx)
	srv := keeper.NewMsgServerImpl(k)

	creator := "fairy1m9l358xunhhwds0568za49mzhvuxx9uxdra8sq"

	// Test case when ReqId already exists
	reqID := types.RequestId{
		Creator: creator,
		ReqId:   "test_req_id_1",
	}
	k.SetRequestId(ctx, reqID)

	msg := &types.MsgRequestPrivateIdentity{
		Creator: creator,
		ReqId:   "test_req_id_1",
	}

	_, err := srv.RequestPrivateIdentity(goCtx, msg)
	require.Error(t, err)
	require.Equal(t, types.ErrReqIDAlreadyExists, err)

	// Test case when IsSourceChain is true
	k.SetParams(ctx, types.Params{IsSourceChain: true})

	msg = &types.MsgRequestPrivateIdentity{
		Creator: creator,
		ReqId:   "test_req_id_2",
	}

	resp, err := srv.RequestPrivateIdentity(goCtx, msg)
	require.NoError(t, err)
	require.NotNil(t, resp)
	require.Equal(t, "fairy1m9l358xunhhwds0568za49mzhvuxx9uxdra8sq/test_req_id_2", resp.ReqId)

	// Ensure the private request is stored
	req, found := k.GetPrivateRequest(ctx, "fairy1m9l358xunhhwds0568za49mzhvuxx9uxdra8sq/test_req_id_2")
	require.True(t, found)
	require.Equal(t, "fairy1m9l358xunhhwds0568za49mzhvuxx9uxdra8sq/test_req_id_2", req.ReqId)
}

func TestOnAcknowledgementRequestPrivateKeysharePacket(t *testing.T) {
	// Initialize the keeper, context, and other dependencies
	k, ctx := keepertest.PepKeeper(t)

	creator := "fairy1m9l358xunhhwds0568za49mzhvuxx9uxdra8sq"

	packet := channeltypes.Packet{}
	packetData := kstypes.RequestPrivateDecryptionKeyPacketData{
		Requester: creator,
		RequestId: "test_request_id_1",
	}
	ack := channeltypes.Acknowledgement{
		Response: &channeltypes.Acknowledgement_Result{
			Result: []byte(`{"pubkey":"test_pubkey"}`),
		},
	}

	// Test case when ReqId already exists
	privReq := types.PrivateRequest{
		Creator:               creator,
		ReqId:                 "test_request_id_1",
		Pubkey:                "",
		PrivateDecryptionKeys: make([]*commontypes.PrivateDecryptionKey, 0),
	}

	k.SetPrivateRequest(ctx, privReq)

	// Test success case for OnAcknowledgementRequestPrivateKeysharePacket
	err := k.OnAcknowledgementRequestPrivateDecryptionKeyPacket(ctx, packet, packetData, ack)
	require.NoError(t, err)

	// Ensure the private request is updated
	entry, found := k.GetPrivateRequest(ctx, "test_request_id_1")
	require.True(t, found)
	require.Equal(t, "test_pubkey", entry.Pubkey)

	// Test case when entry does not exist
	invalidPacketData := kstypes.RequestPrivateDecryptionKeyPacketData{
		Requester: creator,
		RequestId: "invalid_request_id",
	}

	err = k.OnAcknowledgementRequestPrivateDecryptionKeyPacket(ctx, packet, invalidPacketData, ack)
	require.Error(t, err)
	require.Equal(t, "entry does not exists", err.Error())

	// Test error case for unmarshalling acknowledgment
	invalidAck := channeltypes.Acknowledgement{
		Response: &channeltypes.Acknowledgement_Result{
			Result: []byte("invalid_json"),
		},
	}

	err = k.OnAcknowledgementRequestPrivateDecryptionKeyPacket(ctx, packet, packetData, invalidAck)
	require.Error(t, err)
	require.Equal(t, "cannot unmarshal acknowledgment", err.Error())

	// Test when Acknowledgement_Error is returned
	errorAck := channeltypes.Acknowledgement{
		Response: &channeltypes.Acknowledgement_Error{
			Error: "test_error",
		},
	}

	err = k.OnAcknowledgementRequestPrivateDecryptionKeyPacket(ctx, packet, packetData, errorAck)
	require.NoError(t, err)
}
