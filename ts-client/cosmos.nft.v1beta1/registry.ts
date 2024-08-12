import { GeneratedType } from "@cosmjs/proto-signing";
import { QueryBalanceRequest } from "./types/cosmos/nft/v1beta1/query";
import { QueryClassRequest } from "./types/cosmos/nft/v1beta1/query";
import { Entry } from "./types/cosmos/nft/v1beta1/genesis";
import { QueryNFTResponse } from "./types/cosmos/nft/v1beta1/query";
import { QuerySupplyResponse } from "./types/cosmos/nft/v1beta1/query";
import { QueryNFTRequest } from "./types/cosmos/nft/v1beta1/query";
import { EventSend } from "./types/cosmos/nft/v1beta1/event";
import { QueryOwnerResponse } from "./types/cosmos/nft/v1beta1/query";
import { QueryNFTsResponse } from "./types/cosmos/nft/v1beta1/query";
import { QueryClassResponse } from "./types/cosmos/nft/v1beta1/query";
import { EventMint } from "./types/cosmos/nft/v1beta1/event";
import { NFT } from "./types/cosmos/nft/v1beta1/nft";
import { QueryNFTsRequest } from "./types/cosmos/nft/v1beta1/query";
import { QueryClassesRequest } from "./types/cosmos/nft/v1beta1/query";
import { Class } from "./types/cosmos/nft/v1beta1/nft";
import { QueryOwnerRequest } from "./types/cosmos/nft/v1beta1/query";
import { QueryClassesResponse } from "./types/cosmos/nft/v1beta1/query";
import { EventBurn } from "./types/cosmos/nft/v1beta1/event";
import { GenesisState } from "./types/cosmos/nft/v1beta1/genesis";
import { QuerySupplyRequest } from "./types/cosmos/nft/v1beta1/query";
import { MsgSendResponse } from "./types/cosmos/nft/v1beta1/tx";
import { QueryBalanceResponse } from "./types/cosmos/nft/v1beta1/query";
import { MsgSend } from "./types/cosmos/nft/v1beta1/tx";

const msgTypes: Array<[string, GeneratedType]>  = [
    ["/cosmos.nft.v1beta1.QueryBalanceRequest", QueryBalanceRequest],
    ["/cosmos.nft.v1beta1.QueryClassRequest", QueryClassRequest],
    ["/cosmos.nft.v1beta1.Entry", Entry],
    ["/cosmos.nft.v1beta1.QueryNFTResponse", QueryNFTResponse],
    ["/cosmos.nft.v1beta1.QuerySupplyResponse", QuerySupplyResponse],
    ["/cosmos.nft.v1beta1.QueryNFTRequest", QueryNFTRequest],
    ["/cosmos.nft.v1beta1.EventSend", EventSend],
    ["/cosmos.nft.v1beta1.QueryOwnerResponse", QueryOwnerResponse],
    ["/cosmos.nft.v1beta1.QueryNFTsResponse", QueryNFTsResponse],
    ["/cosmos.nft.v1beta1.QueryClassResponse", QueryClassResponse],
    ["/cosmos.nft.v1beta1.EventMint", EventMint],
    ["/cosmos.nft.v1beta1.NFT", NFT],
    ["/cosmos.nft.v1beta1.QueryNFTsRequest", QueryNFTsRequest],
    ["/cosmos.nft.v1beta1.QueryClassesRequest", QueryClassesRequest],
    ["/cosmos.nft.v1beta1.Class", Class],
    ["/cosmos.nft.v1beta1.QueryOwnerRequest", QueryOwnerRequest],
    ["/cosmos.nft.v1beta1.QueryClassesResponse", QueryClassesResponse],
    ["/cosmos.nft.v1beta1.EventBurn", EventBurn],
    ["/cosmos.nft.v1beta1.GenesisState", GenesisState],
    ["/cosmos.nft.v1beta1.QuerySupplyRequest", QuerySupplyRequest],
    ["/cosmos.nft.v1beta1.MsgSendResponse", MsgSendResponse],
    ["/cosmos.nft.v1beta1.QueryBalanceResponse", QueryBalanceResponse],
    ["/cosmos.nft.v1beta1.MsgSend", MsgSend],
    
];

export { msgTypes }