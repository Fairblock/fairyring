package keeper

import (
	"errors"
	"fmt"
	"math"
	"strconv"

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
		delay := req.EstimatedDelay
		blockDelay := uint64(math.Ceil(delay.Seconds() / types.AvgBlockTime))
		currentHeight := uint64(ctx.BlockHeight())
		executionHeight := currentHeight + blockDelay
		if executionHeight > activePubKey.Expiry {
			queuedPubKey, found := k.GetQueuedPubKey(ctx)
			if !found {
				k.pepKeeper.RemoveReqQueueEntry(ctx, req.GetRequestId())
				return errors.New("estimated delay too long")
			}
			if executionHeight > queuedPubKey.Expiry {
				k.pepKeeper.RemoveReqQueueEntry(ctx, req.GetRequestId())
				return errors.New("estimated delay too long")
			}
			activePubKey = types.ActivePubKey(queuedPubKey)
		}

		reqCountString := k.GetRequestCount(ctx)
		reqCount, _ := strconv.ParseUint(reqCountString, 10, 64)
		reqCount = reqCount + 1

		id := types.IdentityFromRequestCount(reqCount)

		var keyshareRequest types.KeyShareRequest

		keyshareRequest.Identity = id
		keyshareRequest.Pubkey = activePubKey.PublicKey

		keyshareRequest.AggrKeyshare = ""
		keyshareRequest.RequestId = req.GetRequestId()

		k.SetKeyShareRequest(ctx, keyshareRequest)
		k.SetRequestCount(ctx, reqCount)

		entry := peptypes.GenEncTxExecutionQueue{
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

			if keyshareReq.AggrKeyshare == "" {
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

func (k Keeper) ProcessGovRequestQueue(ctx sdk.Context) error {
	activePubKey, found := k.GetActivePubKey(ctx)
	if !found {
		return errors.New("active public key not found")
	}

	reqs := k.govKeeper.GetAllReqQueueEntry(ctx)
	for _, req := range reqs {
		delay := req.EstimatedDelay
		fmt.Println("\n\n\n\n Delay: ", delay, "\n\n\n\n")
		blockDelay := uint64(math.Ceil(delay.Seconds() / types.AvgBlockTime))
		fmt.Println("\n\n\n\n Block Delay: ", blockDelay, "\n\n\n\n")

		currentHeight := uint64(ctx.BlockHeight())
		executionHeight := currentHeight + blockDelay

		fmt.Println("\n\n\n\n executionHeight: ", executionHeight, "\n\n\n\n")
		fmt.Println("\n\n\n\n pubkey expiry: ", activePubKey.Expiry, "\n\n\n\n")

		if executionHeight > activePubKey.Expiry {
			queuedPubKey, found := k.GetQueuedPubKey(ctx)
			if !found {
				fmt.Println("\n\n\n\nestimated delay too long\n\n\n\n")
				fmt.Println("\n\n\n\n PID: ", req.GetProposalId(), "\n\n\n\n")
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

		var keyshareRequest types.KeyShareRequest

		keyshareRequest.Identity = id
		keyshareRequest.Pubkey = activePubKey.PublicKey

		keyshareRequest.AggrKeyshare = ""
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

		fmt.Println("\n\n\n\nProposal: ", proposal, "\n\n\n\n")

		err := k.govKeeper.SetProposal(ctx, proposal)
		if err != nil {
			fmt.Println("\n\n\n\n Proposal Set Failed: ", err, "\n\n\n\n")
		}
		fmt.Println("\n\n\n\n Proposal Set successfully\n\n\n\n")

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

			if keyshareReq.AggrKeyshare == "" {
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
