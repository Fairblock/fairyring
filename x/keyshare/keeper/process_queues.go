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
	activePubkey, found := k.GetActivePubkey(ctx)
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
		if executionHeight > activePubkey.Expiry {
			queuedPubkey, found := k.GetQueuedPubkey(ctx)
			if !found {
				k.Logger().Info("[ProcessPepRequestQueue] Queued Pub Key not found")
				k.pepKeeper.RemoveReqQueueEntry(ctx, req.GetRequestId())
				continue
			}
			if executionHeight > queuedPubkey.Expiry {
				k.Logger().Info("[ProcessPepRequestQueue] Estimated delay too long")
				k.pepKeeper.RemoveReqQueueEntry(ctx, req.GetRequestId())
				continue
			}
			activePubkey = types.ActivePubkey(queuedPubkey)
		}

		id := req.GetRequestId()

		var keyshareRequest types.DecryptionKeyRequest

		keyshareRequest.Identity = id
		keyshareRequest.Pubkey = activePubkey.PublicKey

		keyshareRequest.DecryptionKey = ""
		keyshareRequest.RequestId = req.GetRequestId()

		k.SetDecryptionKeyRequest(ctx, keyshareRequest)

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
			decryptionKeyReq, found := k.GetDecryptionKeyRequest(ctx, req.Identity)
			if !found {
				k.pepKeeper.RemoveSignalQueueEntry(ctx, req.GetRequestId())
				continue
			}
			key, _ := k.GetActivePubkey(ctx)
			if decryptionKeyReq.Pubkey != key.PublicKey {
				qKey, found := k.GetQueuedPubkey(ctx)
				if !found {
					k.pepKeeper.RemoveSignalQueueEntry(ctx, req.GetRequestId())
					continue
				}
				if qKey.PublicKey != decryptionKeyReq.Pubkey {
					k.pepKeeper.RemoveSignalQueueEntry(ctx, req.GetRequestId())
					continue
				}
				continue
			}

			if decryptionKeyReq.DecryptionKey == "" {
				ctx.EventManager().EmitEvent(
					sdk.NewEvent(types.StartSendGeneralKeyshareEventType,
						sdk.NewAttribute(types.StartSendGeneralKeyshareEventIdentity, req.Identity),
					),
				)
			}
		}
		k.pepKeeper.RemoveSignalQueueEntry(ctx, req.GetRequestId())
	}
	return nil
}

func (k Keeper) ProcessPrivateRequestQueue(ctx sdk.Context) error {
	activePubkey, found := k.GetActivePubkey(ctx)
	if !found {
		return errors.New("active public key not found")
	}

	reqs := k.pepKeeper.GetAllPrivateReqQueueEntry(ctx)

	for _, req := range reqs {
		id := req.GetRequestId()

		var keyshareRequest types.PrivateDecryptionKeyRequest

		keyshareRequest.Identity = id
		keyshareRequest.Pubkey = activePubkey.PublicKey

		keyshareRequest.PrivateDecryptionKeys = make([]*common.PrivateDecryptionKey, 0)
		keyshareRequest.RequestId = req.GetRequestId()

		k.SetPrivateDecryptionKeyRequest(ctx, keyshareRequest)

		entry, found := k.pepKeeper.GetPrivateRequest(ctx, id)
		if !found {
			return errors.New("entry not found in pep module")
		}
		entry.Pubkey = activePubkey.PublicKey

		k.pepKeeper.SetPrivateRequest(ctx, entry)
		k.pepKeeper.RemovePrivateReqQueueEntry(ctx, req.GetRequestId())
	}
	return nil
}

func (k Keeper) ProcessPrivateSignalQueue(ctx sdk.Context) error {
	reqs := k.pepKeeper.GetAllPrivateSignalQueueEntry(ctx)
	k.Logger().Info(fmt.Sprintf("PROCESSING PEP SIGNAL QUEUE: %v", reqs))

	activePubkey, found := k.GetActivePubkey(ctx)
	if !found {
		return errors.New("active public key not found")
	}

	for _, req := range reqs {
		if req.Identity != "" {
			privDecryptionKeyReq, found := k.GetPrivateDecryptionKeyRequest(ctx, req.Identity)
			if !found {
				var keyshareRequest types.PrivateDecryptionKeyRequest

				keyshareRequest.Identity = req.Identity
				keyshareRequest.Pubkey = activePubkey.PublicKey

				keyshareRequest.PrivateDecryptionKeys = make([]*common.PrivateDecryptionKey, 0)
				keyshareRequest.RequestId = req.GetRequestId()

				k.SetPrivateDecryptionKeyRequest(ctx, keyshareRequest)

				entry, found := k.pepKeeper.GetPrivateRequest(ctx, req.Identity)
				if !found {
					return errors.New("entry not found in pep module")
				}
				entry.Pubkey = activePubkey.PublicKey

				k.pepKeeper.SetPrivateRequest(ctx, entry)

			}

			if len(privDecryptionKeyReq.PrivateDecryptionKeys) == 0 {
				ctx.EventManager().EmitEvent(
					sdk.NewEvent(types.StartSendEncryptedKeyshareEventType,
						sdk.NewAttribute(types.StartSendGeneralKeyshareEventIdentity, req.Identity),
						sdk.NewAttribute(types.StartSendEncryptedKeyshareEventRequester, req.Requester),
						sdk.NewAttribute(types.StartSendEncryptedKeyshareEventPubkey, req.SecpPubkey),
					),
				)
			}
		}
		k.pepKeeper.RemoveSignalQueueEntry(ctx, req.GetRequestId())
	}
	return nil
}

func (k Keeper) ProcessGovRequestQueue(ctx sdk.Context) error {
	activePubkey, found := k.GetActivePubkey(ctx)
	if !found {
		return errors.New("active public key not found")
	}

	reqs := k.govKeeper.GetAllReqQueueEntry(ctx)
	for _, req := range reqs {
		delay := req.EstimatedDelay
		blockDelay := uint64(math.Ceil(delay.Seconds() / types.AvgBlockTime))

		currentHeight := uint64(ctx.BlockHeight())
		executionHeight := currentHeight + blockDelay

		if executionHeight > activePubkey.Expiry {
			queuedPubkey, found := k.GetQueuedPubkey(ctx)
			if !found {
				k.govKeeper.RemoveReqQueueEntry(ctx, req.GetProposalId())
				return errors.New("estimated delay too long")
			}
			if executionHeight > queuedPubkey.Expiry {
				k.govKeeper.RemoveReqQueueEntry(ctx, req.GetProposalId())
				return errors.New("estimated delay too long")
			}
			activePubkey = types.ActivePubkey(queuedPubkey)
		}

		reqCountString := k.GetRequestCount(ctx)
		reqCount, _ := strconv.ParseUint(reqCountString, 10, 64)
		reqCount = reqCount + 1

		id := types.IdentityFromRequestCount(reqCount)

		var keyshareRequest types.DecryptionKeyRequest

		keyshareRequest.Identity = id
		keyshareRequest.Pubkey = activePubkey.PublicKey

		keyshareRequest.DecryptionKey = ""
		keyshareRequest.ProposalId = req.GetProposalId()

		k.SetDecryptionKeyRequest(ctx, keyshareRequest)
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
			decryptionKeyReq, found := k.GetDecryptionKeyRequest(ctx, req.Identity)
			if !found {
				k.govKeeper.RemoveSignalQueueEntry(ctx, req.GetProposalId())
				continue
			}

			key, _ := k.GetActivePubkey(ctx)
			if decryptionKeyReq.Pubkey != key.PublicKey {
				qKey, found := k.GetQueuedPubkey(ctx)
				if !found {
					k.govKeeper.RemoveSignalQueueEntry(ctx, req.GetProposalId())
					continue
				}
				if qKey.PublicKey != decryptionKeyReq.Pubkey {
					k.govKeeper.RemoveSignalQueueEntry(ctx, req.GetProposalId())
					continue
				}
				continue
			}

			if decryptionKeyReq.DecryptionKey == "" {
				ctx.EventManager().EmitEvent(
					sdk.NewEvent(types.StartSendGeneralKeyshareEventType,
						sdk.NewAttribute(types.StartSendGeneralKeyshareEventIdentity, req.Identity),
					),
				)
			}
		}
		k.govKeeper.RemoveSignalQueueEntry(ctx, req.GetProposalId())
	}
	return nil
}
