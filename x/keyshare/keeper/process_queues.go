package keeper

import (
	"errors"
	"fmt"
	"math"
	"strconv"

	common "github.com/Fairblock/fairyring/x/common/types"
	"github.com/Fairblock/fairyring/x/keyshare/types"
	peptypes "github.com/Fairblock/fairyring/x/pep/types"
	sdk "github.com/cosmos/cosmos-sdk/types"
)

func (k Keeper) ProcessPepRequestQueue(ctx sdk.Context) error {
	activePubKey, found := k.GetActivePubKey(ctx)
	if !found {
		return errors.New("active public key not found")
	}

	reqs := k.pepKeeper.GetAllGenEncTxReqQueueEntry(ctx)

	for _, req := range reqs {
		if req.EstimatedDelay == nil {
			k.pepKeeper.RemoveReqQueueEntry(ctx, req.GetRequestId())
			k.Logger().Info("[ProcessPepRequestQueue] Estimated delay has not been set")
			continue
		}
		delay := req.EstimatedDelay
		blockDelay := uint64(math.Ceil(delay.Seconds() / types.AvgBlockTime))
		currentHeight := uint64(ctx.BlockHeight())
		executionHeight := currentHeight + blockDelay
		if executionHeight > activePubKey.Expiry {
			queuedPubKey, found := k.GetQueuedPubKey(ctx)
			if !found {
				k.Logger().Info("[ProcessPepRequestQueue] Queued Pub Key not found")
				k.pepKeeper.RemoveReqQueueEntry(ctx, req.GetRequestId())
				continue
			}
			if executionHeight > queuedPubKey.Expiry {
				k.Logger().Info("[ProcessPepRequestQueue] Estimated delay too long")
				k.pepKeeper.RemoveReqQueueEntry(ctx, req.GetRequestId())
				continue
			}
			activePubKey = types.ActivePubKey(queuedPubKey)
		}

		id := req.GetRequestId()

		var keyshareRequest types.DecryptionKeyRequest

		keyshareRequest.Identity = id
		keyshareRequest.Pubkey = activePubKey.PublicKey

		keyshareRequest.DecryptionKey = ""
		keyshareRequest.RequestId = req.GetRequestId()

		k.SetKeyShareRequest(ctx, keyshareRequest)

		entry := peptypes.IdentityExecutionEntry{
			Creator:   req.Creator,
			RequestId: req.GetRequestId(),
			Identity:  keyshareRequest.Identity,
			Pubkey:    keyshareRequest.Pubkey,
		}

		k.pepKeeper.SetEntry(ctx, entry)
		k.pepKeeper.RemoveReqQueueEntry(ctx, req.GetRequestId())
	}
	return nil
}

func (k Keeper) ProcessPepSignalQueue(ctx sdk.Context) error {
	reqs := k.pepKeeper.GetAllGenEncTxSignalQueueEntry(ctx)
	k.Logger().Info(fmt.Sprintf("PROCESSING PEP SIGNAL QUEUE: %v", reqs))
	for _, req := range reqs {
		if req.Identity != "" {
			keyshareReq, found := k.GetKeyShareRequest(ctx, req.Identity)
			if !found {
				k.pepKeeper.RemoveSignalQueueEntry(ctx, req.GetRequestId())
				continue
			}
			key, _ := k.GetActivePubKey(ctx)
			if keyshareReq.Pubkey != key.PublicKey {
				qKey, found := k.GetQueuedPubKey(ctx)
				if !found {
					k.pepKeeper.RemoveSignalQueueEntry(ctx, req.GetRequestId())
					continue
				}
				if qKey.PublicKey != keyshareReq.Pubkey {
					k.pepKeeper.RemoveSignalQueueEntry(ctx, req.GetRequestId())
					continue
				}
				continue
			}

			if keyshareReq.DecryptionKey == "" {
				ctx.EventManager().EmitEvent(
					sdk.NewEvent(types.StartSendGeneralKeyShareEventType,
						sdk.NewAttribute(types.StartSendGeneralKeyShareEventIdentity, req.Identity),
					),
				)
			}
		}
		k.pepKeeper.RemoveSignalQueueEntry(ctx, req.GetRequestId())
	}
	return nil
}

func (k Keeper) ProcessPrivateRequestQueue(ctx sdk.Context) error {
	activePubKey, found := k.GetActivePubKey(ctx)
	if !found {
		return errors.New("active public key not found")
	}

	reqs := k.pepKeeper.GetAllPrivateReqQueueEntry(ctx)

	for _, req := range reqs {
		id := req.GetRequestId()

		var keyshareRequest types.PrivateDecryptionKeyRequest

		keyshareRequest.Identity = id
		keyshareRequest.Pubkey = activePubKey.PublicKey

		keyshareRequest.PrivateDecryptionKeys = make([]*common.PrivateDecryptionKey, 0)
		keyshareRequest.RequestId = req.GetRequestId()

		k.SetPrivateKeyShareRequest(ctx, keyshareRequest)

		entry, found := k.pepKeeper.GetPrivateRequest(ctx, id)
		if !found {
			return errors.New("entry not found in pep module")
		}
		entry.Pubkey = activePubKey.PublicKey

		k.pepKeeper.SetPrivateRequest(ctx, entry)
		k.pepKeeper.RemovePrivateReqQueueEntry(ctx, req.GetRequestId())
	}
	return nil
}

func (k Keeper) ProcessPrivateSignalQueue(ctx sdk.Context) error {
	reqs := k.pepKeeper.GetAllPrivateSignalQueueEntry(ctx)
	k.Logger().Info(fmt.Sprintf("PROCESSING PEP SIGNAL QUEUE: %v", reqs))

	activePubKey, found := k.GetActivePubKey(ctx)
	if !found {
		return errors.New("active public key not found")
	}

	for _, req := range reqs {
		if req.Identity != "" {
			keyshareReq, found := k.GetPrivateKeyShareRequest(ctx, req.Identity)
			if !found {
				var keyshareRequest types.PrivateDecryptionKeyRequest

				keyshareRequest.Identity = req.Identity
				keyshareRequest.Pubkey = activePubKey.PublicKey

				keyshareRequest.PrivateDecryptionKeys = make([]*common.PrivateDecryptionKey, 0)
				keyshareRequest.RequestId = req.GetRequestId()

				k.SetPrivateKeyShareRequest(ctx, keyshareRequest)

				entry, found := k.pepKeeper.GetPrivateRequest(ctx, req.Identity)
				if !found {
					return errors.New("entry not found in pep module")
				}
				entry.Pubkey = activePubKey.PublicKey

				k.pepKeeper.SetPrivateRequest(ctx, entry)

			}

			if len(keyshareReq.PrivateDecryptionKeys) == 0 {
				ctx.EventManager().EmitEvent(
					sdk.NewEvent(types.StartSendEncryptedKeyShareEventType,
						sdk.NewAttribute(types.StartSendGeneralKeyShareEventIdentity, req.Identity),
						sdk.NewAttribute(types.StartSendEncryptedKeyShareEventRequester, req.Requester),
						sdk.NewAttribute(types.StartSendEncryptedKeyShareEventPubkey, req.SecpPubkey),
					),
				)
			}
		}
		k.pepKeeper.RemoveSignalQueueEntry(ctx, req.GetRequestId())
	}
	return nil
}

func (k Keeper) ProcessGovRequestQueue(ctx sdk.Context) error {
	activePubKey, found := k.GetActivePubKey(ctx)
	if !found {
		return errors.New("active public key not found")
	}

	reqs := k.govKeeper.GetAllReqQueueEntry(ctx)
	for _, req := range reqs {
		delay := req.EstimatedDelay
		blockDelay := uint64(math.Ceil(delay.Seconds() / types.AvgBlockTime))

		currentHeight := uint64(ctx.BlockHeight())
		executionHeight := currentHeight + blockDelay

		if executionHeight > activePubKey.Expiry {
			queuedPubKey, found := k.GetQueuedPubKey(ctx)
			if !found {
				k.govKeeper.RemoveReqQueueEntry(ctx, req.GetProposalId())
				return errors.New("estimated delay too long")
			}
			if executionHeight > queuedPubKey.Expiry {
				k.govKeeper.RemoveReqQueueEntry(ctx, req.GetProposalId())
				return errors.New("estimated delay too long")
			}
			activePubKey = types.ActivePubKey(queuedPubKey)
		}

		reqCountString := k.GetRequestCount(ctx)
		reqCount, _ := strconv.ParseUint(reqCountString, 10, 64)
		reqCount = reqCount + 1

		id := types.IdentityFromRequestCount(reqCount)

		var keyshareRequest types.DecryptionKeyRequest

		keyshareRequest.Identity = id
		keyshareRequest.Pubkey = activePubKey.PublicKey

		keyshareRequest.DecryptionKey = ""
		keyshareRequest.ProposalId = req.GetProposalId()

		k.SetKeyShareRequest(ctx, keyshareRequest)
		k.SetRequestCount(ctx, reqCount)

		pID, _ := strconv.ParseUint(req.GetProposalId(), 10, 64)

		proposal, found := k.govKeeper.GetProposal(ctx, pID)
		if !found {
			return errors.New("proposal not found")
		}

		proposal.Identity = id
		proposal.Pubkey = keyshareRequest.Pubkey

		k.govKeeper.SetProposal(ctx, proposal)

		k.govKeeper.RemoveReqQueueEntry(ctx, req.GetProposalId())
	}
	return nil
}

func (k Keeper) ProcessGovSignalQueue(ctx sdk.Context) error {
	reqs := k.govKeeper.GetAllSignalQueueEntry(ctx)
	for _, req := range reqs {
		if req.Identity != "" {
			keyshareReq, found := k.GetKeyShareRequest(ctx, req.Identity)
			if !found {
				k.govKeeper.RemoveSignalQueueEntry(ctx, req.GetProposalId())
				continue
			}

			key, _ := k.GetActivePubKey(ctx)
			if keyshareReq.Pubkey != key.PublicKey {
				qKey, found := k.GetQueuedPubKey(ctx)
				if !found {
					k.govKeeper.RemoveSignalQueueEntry(ctx, req.GetProposalId())
					continue
				}
				if qKey.PublicKey != keyshareReq.Pubkey {
					k.govKeeper.RemoveSignalQueueEntry(ctx, req.GetProposalId())
					continue
				}
				continue
			}

			if keyshareReq.DecryptionKey == "" {
				ctx.EventManager().EmitEvent(
					sdk.NewEvent(types.StartSendGeneralKeyShareEventType,
						sdk.NewAttribute(types.StartSendGeneralKeyShareEventIdentity, req.Identity),
					),
				)
			}
		}
		k.govKeeper.RemoveSignalQueueEntry(ctx, req.GetProposalId())
	}
	return nil
}
