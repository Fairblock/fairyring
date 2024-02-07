import { Client, registry, MissingWalletError } from 'fairyring-client-ts'

import { AggregatedKeyShare } from "fairyring-client-ts/fairyring.keyshare/types"
import { AuthorizedAddress } from "fairyring-client-ts/fairyring.keyshare/types"
import { Commitments } from "fairyring-client-ts/fairyring.keyshare/types"
import { GeneralKeyShare } from "fairyring-client-ts/fairyring.keyshare/types"
import { KeyShare } from "fairyring-client-ts/fairyring.keyshare/types"
import { KeysharePacketData } from "fairyring-client-ts/fairyring.keyshare/types"
import { NoData } from "fairyring-client-ts/fairyring.keyshare/types"
import { RequestAggrKeysharePacketData } from "fairyring-client-ts/fairyring.keyshare/types"
import { RequestAggrKeysharePacketAck } from "fairyring-client-ts/fairyring.keyshare/types"
import { GetAggrKeysharePacketData } from "fairyring-client-ts/fairyring.keyshare/types"
import { GetAggrKeysharePacketAck } from "fairyring-client-ts/fairyring.keyshare/types"
import { AggrKeyshareDataPacketData } from "fairyring-client-ts/fairyring.keyshare/types"
import { AggrKeyshareDataPacketAck } from "fairyring-client-ts/fairyring.keyshare/types"
import { Params } from "fairyring-client-ts/fairyring.keyshare/types"
import { ActivePubKey } from "fairyring-client-ts/fairyring.keyshare/types"
import { QueuedPubKey } from "fairyring-client-ts/fairyring.keyshare/types"
import { RequestAggrKeyshareMsg } from "fairyring-client-ts/fairyring.keyshare/types"
import { KeyShareRequest } from "fairyring-client-ts/fairyring.keyshare/types"
import { IBCInfo } from "fairyring-client-ts/fairyring.keyshare/types"
import { CounterPartyIBCInfo } from "fairyring-client-ts/fairyring.keyshare/types"
import { ValidatorSet } from "fairyring-client-ts/fairyring.keyshare/types"


export { AggregatedKeyShare, AuthorizedAddress, Commitments, GeneralKeyShare, KeyShare, KeysharePacketData, NoData, RequestAggrKeysharePacketData, RequestAggrKeysharePacketAck, GetAggrKeysharePacketData, GetAggrKeysharePacketAck, AggrKeyshareDataPacketData, AggrKeyshareDataPacketAck, Params, ActivePubKey, QueuedPubKey, RequestAggrKeyshareMsg, KeyShareRequest, IBCInfo, CounterPartyIBCInfo, ValidatorSet };

function initClient(vuexGetters) {
	return new Client(vuexGetters['common/env/getEnv'], vuexGetters['common/wallet/signer'])
}

function mergeResults(value, next_values) {
	for (let prop of Object.keys(next_values)) {
		if (Array.isArray(next_values[prop])) {
			value[prop]=[...value[prop], ...next_values[prop]]
		}else{
			value[prop]=next_values[prop]
		}
	}
	return value
}

type Field = {
	name: string;
	type: unknown;
}
function getStructure(template) {
	let structure: {fields: Field[]} = { fields: [] }
	for (const [key, value] of Object.entries(template)) {
		let field = { name: key, type: typeof value }
		structure.fields.push(field)
	}
	return structure
}
const getDefaultState = () => {
	return {
				Commitments: {},
				Params: {},
				ValidatorSet: {},
				ValidatorSetAll: {},
				KeyShare: {},
				KeyShareAll: {},
				AggregatedKeyShare: {},
				AggregatedKeyShareAll: {},
				PubKey: {},
				AuthorizedAddress: {},
				AuthorizedAddressAll: {},
				GeneralKeyShare: {},
				GeneralKeyShareAll: {},
				
				_Structure: {
						AggregatedKeyShare: getStructure(AggregatedKeyShare.fromPartial({})),
						AuthorizedAddress: getStructure(AuthorizedAddress.fromPartial({})),
						Commitments: getStructure(Commitments.fromPartial({})),
						GeneralKeyShare: getStructure(GeneralKeyShare.fromPartial({})),
						KeyShare: getStructure(KeyShare.fromPartial({})),
						KeysharePacketData: getStructure(KeysharePacketData.fromPartial({})),
						NoData: getStructure(NoData.fromPartial({})),
						RequestAggrKeysharePacketData: getStructure(RequestAggrKeysharePacketData.fromPartial({})),
						RequestAggrKeysharePacketAck: getStructure(RequestAggrKeysharePacketAck.fromPartial({})),
						GetAggrKeysharePacketData: getStructure(GetAggrKeysharePacketData.fromPartial({})),
						GetAggrKeysharePacketAck: getStructure(GetAggrKeysharePacketAck.fromPartial({})),
						AggrKeyshareDataPacketData: getStructure(AggrKeyshareDataPacketData.fromPartial({})),
						AggrKeyshareDataPacketAck: getStructure(AggrKeyshareDataPacketAck.fromPartial({})),
						Params: getStructure(Params.fromPartial({})),
						ActivePubKey: getStructure(ActivePubKey.fromPartial({})),
						QueuedPubKey: getStructure(QueuedPubKey.fromPartial({})),
						RequestAggrKeyshareMsg: getStructure(RequestAggrKeyshareMsg.fromPartial({})),
						KeyShareRequest: getStructure(KeyShareRequest.fromPartial({})),
						IBCInfo: getStructure(IBCInfo.fromPartial({})),
						CounterPartyIBCInfo: getStructure(CounterPartyIBCInfo.fromPartial({})),
						ValidatorSet: getStructure(ValidatorSet.fromPartial({})),
						
		},
		_Registry: registry,
		_Subscriptions: new Set(),
	}
}

// initial state
const state = getDefaultState()

export default {
	namespaced: true,
	state,
	mutations: {
		RESET_STATE(state) {
			Object.assign(state, getDefaultState())
		},
		QUERY(state, { query, key, value }) {
			state[query][JSON.stringify(key)] = value
		},
		SUBSCRIBE(state, subscription) {
			state._Subscriptions.add(JSON.stringify(subscription))
		},
		UNSUBSCRIBE(state, subscription) {
			state._Subscriptions.delete(JSON.stringify(subscription))
		}
	},
	getters: {
				getCommitments: (state) => (params = { params: {}}) => {
					if (!(<any> params).query) {
						(<any> params).query=null
					}
			return state.Commitments[JSON.stringify(params)] ?? {}
		},
				getParams: (state) => (params = { params: {}}) => {
					if (!(<any> params).query) {
						(<any> params).query=null
					}
			return state.Params[JSON.stringify(params)] ?? {}
		},
				getValidatorSet: (state) => (params = { params: {}}) => {
					if (!(<any> params).query) {
						(<any> params).query=null
					}
			return state.ValidatorSet[JSON.stringify(params)] ?? {}
		},
				getValidatorSetAll: (state) => (params = { params: {}}) => {
					if (!(<any> params).query) {
						(<any> params).query=null
					}
			return state.ValidatorSetAll[JSON.stringify(params)] ?? {}
		},
				getKeyShare: (state) => (params = { params: {}}) => {
					if (!(<any> params).query) {
						(<any> params).query=null
					}
			return state.KeyShare[JSON.stringify(params)] ?? {}
		},
				getKeyShareAll: (state) => (params = { params: {}}) => {
					if (!(<any> params).query) {
						(<any> params).query=null
					}
			return state.KeyShareAll[JSON.stringify(params)] ?? {}
		},
				getAggregatedKeyShare: (state) => (params = { params: {}}) => {
					if (!(<any> params).query) {
						(<any> params).query=null
					}
			return state.AggregatedKeyShare[JSON.stringify(params)] ?? {}
		},
				getAggregatedKeyShareAll: (state) => (params = { params: {}}) => {
					if (!(<any> params).query) {
						(<any> params).query=null
					}
			return state.AggregatedKeyShareAll[JSON.stringify(params)] ?? {}
		},
				getPubKey: (state) => (params = { params: {}}) => {
					if (!(<any> params).query) {
						(<any> params).query=null
					}
			return state.PubKey[JSON.stringify(params)] ?? {}
		},
				getAuthorizedAddress: (state) => (params = { params: {}}) => {
					if (!(<any> params).query) {
						(<any> params).query=null
					}
			return state.AuthorizedAddress[JSON.stringify(params)] ?? {}
		},
				getAuthorizedAddressAll: (state) => (params = { params: {}}) => {
					if (!(<any> params).query) {
						(<any> params).query=null
					}
			return state.AuthorizedAddressAll[JSON.stringify(params)] ?? {}
		},
				getGeneralKeyShare: (state) => (params = { params: {}}) => {
					if (!(<any> params).query) {
						(<any> params).query=null
					}
			return state.GeneralKeyShare[JSON.stringify(params)] ?? {}
		},
				getGeneralKeyShareAll: (state) => (params = { params: {}}) => {
					if (!(<any> params).query) {
						(<any> params).query=null
					}
			return state.GeneralKeyShareAll[JSON.stringify(params)] ?? {}
		},
				
		getTypeStructure: (state) => (type) => {
			return state._Structure[type].fields
		},
		getRegistry: (state) => {
			return state._Registry
		}
	},
	actions: {
		init({ dispatch, rootGetters }) {
			console.log('Vuex module: fairyring.keyshare initialized!')
			if (rootGetters['common/env/client']) {
				rootGetters['common/env/client'].on('newblock', () => {
					dispatch('StoreUpdate')
				})
			}
		},
		resetState({ commit }) {
			commit('RESET_STATE')
		},
		unsubscribe({ commit }, subscription) {
			commit('UNSUBSCRIBE', subscription)
		},
		async StoreUpdate({ state, dispatch }) {
			state._Subscriptions.forEach(async (subscription) => {
				try {
					const sub=JSON.parse(subscription)
					await dispatch(sub.action, sub.payload)
				}catch(e) {
					throw new Error('Subscriptions: ' + e.message)
				}
			})
		},
		
		
		
		 		
		
		
		async QueryCommitments({ commit, rootGetters, getters }, { options: { subscribe, all} = { subscribe:false, all:false}, params, query=null }) {
			try {
				const key = params ?? {};
				const client = initClient(rootGetters);
				let value= (await client.FairyringKeyshare.query.queryCommitments()).data
				
					
				commit('QUERY', { query: 'Commitments', key: { params: {...key}, query}, value })
				if (subscribe) commit('SUBSCRIBE', { action: 'QueryCommitments', payload: { options: { all }, params: {...key},query }})
				return getters['getCommitments']( { params: {...key}, query}) ?? {}
			} catch (e) {
				throw new Error('QueryClient:QueryCommitments API Node Unavailable. Could not perform query: ' + e.message)
				
			}
		},
		
		
		
		
		 		
		
		
		async QueryParams({ commit, rootGetters, getters }, { options: { subscribe, all} = { subscribe:false, all:false}, params, query=null }) {
			try {
				const key = params ?? {};
				const client = initClient(rootGetters);
				let value= (await client.FairyringKeyshare.query.queryParams()).data
				
					
				commit('QUERY', { query: 'Params', key: { params: {...key}, query}, value })
				if (subscribe) commit('SUBSCRIBE', { action: 'QueryParams', payload: { options: { all }, params: {...key},query }})
				return getters['getParams']( { params: {...key}, query}) ?? {}
			} catch (e) {
				throw new Error('QueryClient:QueryParams API Node Unavailable. Could not perform query: ' + e.message)
				
			}
		},
		
		
		
		
		 		
		
		
		async QueryValidatorSet({ commit, rootGetters, getters }, { options: { subscribe, all} = { subscribe:false, all:false}, params, query=null }) {
			try {
				const key = params ?? {};
				const client = initClient(rootGetters);
				let value= (await client.FairyringKeyshare.query.queryValidatorSet( key.index)).data
				
					
				commit('QUERY', { query: 'ValidatorSet', key: { params: {...key}, query}, value })
				if (subscribe) commit('SUBSCRIBE', { action: 'QueryValidatorSet', payload: { options: { all }, params: {...key},query }})
				return getters['getValidatorSet']( { params: {...key}, query}) ?? {}
			} catch (e) {
				throw new Error('QueryClient:QueryValidatorSet API Node Unavailable. Could not perform query: ' + e.message)
				
			}
		},
		
		
		
		
		 		
		
		
		async QueryValidatorSetAll({ commit, rootGetters, getters }, { options: { subscribe, all} = { subscribe:false, all:false}, params, query=null }) {
			try {
				const key = params ?? {};
				const client = initClient(rootGetters);
				let value= (await client.FairyringKeyshare.query.queryValidatorSetAll(query ?? undefined)).data
				
					
				while (all && (<any> value).pagination && (<any> value).pagination.next_key!=null) {
					let next_values=(await client.FairyringKeyshare.query.queryValidatorSetAll({...query ?? {}, 'pagination.key':(<any> value).pagination.next_key} as any)).data
					value = mergeResults(value, next_values);
				}
				commit('QUERY', { query: 'ValidatorSetAll', key: { params: {...key}, query}, value })
				if (subscribe) commit('SUBSCRIBE', { action: 'QueryValidatorSetAll', payload: { options: { all }, params: {...key},query }})
				return getters['getValidatorSetAll']( { params: {...key}, query}) ?? {}
			} catch (e) {
				throw new Error('QueryClient:QueryValidatorSetAll API Node Unavailable. Could not perform query: ' + e.message)
				
			}
		},
		
		
		
		
		 		
		
		
		async QueryKeyShare({ commit, rootGetters, getters }, { options: { subscribe, all} = { subscribe:false, all:false}, params, query=null }) {
			try {
				const key = params ?? {};
				const client = initClient(rootGetters);
				let value= (await client.FairyringKeyshare.query.queryKeyShare( key.validator,  key.blockHeight)).data
				
					
				commit('QUERY', { query: 'KeyShare', key: { params: {...key}, query}, value })
				if (subscribe) commit('SUBSCRIBE', { action: 'QueryKeyShare', payload: { options: { all }, params: {...key},query }})
				return getters['getKeyShare']( { params: {...key}, query}) ?? {}
			} catch (e) {
				throw new Error('QueryClient:QueryKeyShare API Node Unavailable. Could not perform query: ' + e.message)
				
			}
		},
		
		
		
		
		 		
		
		
		async QueryKeyShareAll({ commit, rootGetters, getters }, { options: { subscribe, all} = { subscribe:false, all:false}, params, query=null }) {
			try {
				const key = params ?? {};
				const client = initClient(rootGetters);
				let value= (await client.FairyringKeyshare.query.queryKeyShareAll(query ?? undefined)).data
				
					
				while (all && (<any> value).pagination && (<any> value).pagination.next_key!=null) {
					let next_values=(await client.FairyringKeyshare.query.queryKeyShareAll({...query ?? {}, 'pagination.key':(<any> value).pagination.next_key} as any)).data
					value = mergeResults(value, next_values);
				}
				commit('QUERY', { query: 'KeyShareAll', key: { params: {...key}, query}, value })
				if (subscribe) commit('SUBSCRIBE', { action: 'QueryKeyShareAll', payload: { options: { all }, params: {...key},query }})
				return getters['getKeyShareAll']( { params: {...key}, query}) ?? {}
			} catch (e) {
				throw new Error('QueryClient:QueryKeyShareAll API Node Unavailable. Could not perform query: ' + e.message)
				
			}
		},
		
		
		
		
		 		
		
		
		async QueryAggregatedKeyShare({ commit, rootGetters, getters }, { options: { subscribe, all} = { subscribe:false, all:false}, params, query=null }) {
			try {
				const key = params ?? {};
				const client = initClient(rootGetters);
				let value= (await client.FairyringKeyshare.query.queryAggregatedKeyShare( key.height)).data
				
					
				commit('QUERY', { query: 'AggregatedKeyShare', key: { params: {...key}, query}, value })
				if (subscribe) commit('SUBSCRIBE', { action: 'QueryAggregatedKeyShare', payload: { options: { all }, params: {...key},query }})
				return getters['getAggregatedKeyShare']( { params: {...key}, query}) ?? {}
			} catch (e) {
				throw new Error('QueryClient:QueryAggregatedKeyShare API Node Unavailable. Could not perform query: ' + e.message)
				
			}
		},
		
		
		
		
		 		
		
		
		async QueryAggregatedKeyShareAll({ commit, rootGetters, getters }, { options: { subscribe, all} = { subscribe:false, all:false}, params, query=null }) {
			try {
				const key = params ?? {};
				const client = initClient(rootGetters);
				let value= (await client.FairyringKeyshare.query.queryAggregatedKeyShareAll(query ?? undefined)).data
				
					
				while (all && (<any> value).pagination && (<any> value).pagination.next_key!=null) {
					let next_values=(await client.FairyringKeyshare.query.queryAggregatedKeyShareAll({...query ?? {}, 'pagination.key':(<any> value).pagination.next_key} as any)).data
					value = mergeResults(value, next_values);
				}
				commit('QUERY', { query: 'AggregatedKeyShareAll', key: { params: {...key}, query}, value })
				if (subscribe) commit('SUBSCRIBE', { action: 'QueryAggregatedKeyShareAll', payload: { options: { all }, params: {...key},query }})
				return getters['getAggregatedKeyShareAll']( { params: {...key}, query}) ?? {}
			} catch (e) {
				throw new Error('QueryClient:QueryAggregatedKeyShareAll API Node Unavailable. Could not perform query: ' + e.message)
				
			}
		},
		
		
		
		
		 		
		
		
		async QueryPubKey({ commit, rootGetters, getters }, { options: { subscribe, all} = { subscribe:false, all:false}, params, query=null }) {
			try {
				const key = params ?? {};
				const client = initClient(rootGetters);
				let value= (await client.FairyringKeyshare.query.queryPubKey()).data
				
					
				commit('QUERY', { query: 'PubKey', key: { params: {...key}, query}, value })
				if (subscribe) commit('SUBSCRIBE', { action: 'QueryPubKey', payload: { options: { all }, params: {...key},query }})
				return getters['getPubKey']( { params: {...key}, query}) ?? {}
			} catch (e) {
				throw new Error('QueryClient:QueryPubKey API Node Unavailable. Could not perform query: ' + e.message)
				
			}
		},
		
		
		
		
		 		
		
		
		async QueryAuthorizedAddress({ commit, rootGetters, getters }, { options: { subscribe, all} = { subscribe:false, all:false}, params, query=null }) {
			try {
				const key = params ?? {};
				const client = initClient(rootGetters);
				let value= (await client.FairyringKeyshare.query.queryAuthorizedAddress( key.target)).data
				
					
				commit('QUERY', { query: 'AuthorizedAddress', key: { params: {...key}, query}, value })
				if (subscribe) commit('SUBSCRIBE', { action: 'QueryAuthorizedAddress', payload: { options: { all }, params: {...key},query }})
				return getters['getAuthorizedAddress']( { params: {...key}, query}) ?? {}
			} catch (e) {
				throw new Error('QueryClient:QueryAuthorizedAddress API Node Unavailable. Could not perform query: ' + e.message)
				
			}
		},
		
		
		
		
		 		
		
		
		async QueryAuthorizedAddressAll({ commit, rootGetters, getters }, { options: { subscribe, all} = { subscribe:false, all:false}, params, query=null }) {
			try {
				const key = params ?? {};
				const client = initClient(rootGetters);
				let value= (await client.FairyringKeyshare.query.queryAuthorizedAddressAll(query ?? undefined)).data
				
					
				while (all && (<any> value).pagination && (<any> value).pagination.next_key!=null) {
					let next_values=(await client.FairyringKeyshare.query.queryAuthorizedAddressAll({...query ?? {}, 'pagination.key':(<any> value).pagination.next_key} as any)).data
					value = mergeResults(value, next_values);
				}
				commit('QUERY', { query: 'AuthorizedAddressAll', key: { params: {...key}, query}, value })
				if (subscribe) commit('SUBSCRIBE', { action: 'QueryAuthorizedAddressAll', payload: { options: { all }, params: {...key},query }})
				return getters['getAuthorizedAddressAll']( { params: {...key}, query}) ?? {}
			} catch (e) {
				throw new Error('QueryClient:QueryAuthorizedAddressAll API Node Unavailable. Could not perform query: ' + e.message)
				
			}
		},
		
		
		
		
		 		
		
		
		async QueryGeneralKeyShare({ commit, rootGetters, getters }, { options: { subscribe, all} = { subscribe:false, all:false}, params, query=null }) {
			try {
				const key = params ?? {};
				const client = initClient(rootGetters);
				let value= (await client.FairyringKeyshare.query.queryGeneralKeyShare( key.validator,  key.idType,  key.idValue)).data
				
					
				commit('QUERY', { query: 'GeneralKeyShare', key: { params: {...key}, query}, value })
				if (subscribe) commit('SUBSCRIBE', { action: 'QueryGeneralKeyShare', payload: { options: { all }, params: {...key},query }})
				return getters['getGeneralKeyShare']( { params: {...key}, query}) ?? {}
			} catch (e) {
				throw new Error('QueryClient:QueryGeneralKeyShare API Node Unavailable. Could not perform query: ' + e.message)
				
			}
		},
		
		
		
		
		 		
		
		
		async QueryGeneralKeyShareAll({ commit, rootGetters, getters }, { options: { subscribe, all} = { subscribe:false, all:false}, params, query=null }) {
			try {
				const key = params ?? {};
				const client = initClient(rootGetters);
				let value= (await client.FairyringKeyshare.query.queryGeneralKeyShareAll(query ?? undefined)).data
				
					
				while (all && (<any> value).pagination && (<any> value).pagination.next_key!=null) {
					let next_values=(await client.FairyringKeyshare.query.queryGeneralKeyShareAll({...query ?? {}, 'pagination.key':(<any> value).pagination.next_key} as any)).data
					value = mergeResults(value, next_values);
				}
				commit('QUERY', { query: 'GeneralKeyShareAll', key: { params: {...key}, query}, value })
				if (subscribe) commit('SUBSCRIBE', { action: 'QueryGeneralKeyShareAll', payload: { options: { all }, params: {...key},query }})
				return getters['getGeneralKeyShareAll']( { params: {...key}, query}) ?? {}
			} catch (e) {
				throw new Error('QueryClient:QueryGeneralKeyShareAll API Node Unavailable. Could not perform query: ' + e.message)
				
			}
		},
		
		
		async sendMsgSendKeyshare({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.FairyringKeyshare.tx.sendMsgSendKeyshare({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgSendKeyshare:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:MsgSendKeyshare:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendMsgRegisterValidator({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.FairyringKeyshare.tx.sendMsgRegisterValidator({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgRegisterValidator:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:MsgRegisterValidator:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendMsgDeleteAuthorizedAddress({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.FairyringKeyshare.tx.sendMsgDeleteAuthorizedAddress({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgDeleteAuthorizedAddress:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:MsgDeleteAuthorizedAddress:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendMsgCreateLatestPubKey({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.FairyringKeyshare.tx.sendMsgCreateLatestPubKey({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgCreateLatestPubKey:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:MsgCreateLatestPubKey:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendMsgCreateAuthorizedAddress({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.FairyringKeyshare.tx.sendMsgCreateAuthorizedAddress({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgCreateAuthorizedAddress:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:MsgCreateAuthorizedAddress:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendMsgUpdateAuthorizedAddress({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.FairyringKeyshare.tx.sendMsgUpdateAuthorizedAddress({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgUpdateAuthorizedAddress:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:MsgUpdateAuthorizedAddress:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendMsgCreateGeneralKeyShare({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.FairyringKeyshare.tx.sendMsgCreateGeneralKeyShare({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgCreateGeneralKeyShare:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:MsgCreateGeneralKeyShare:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		
		async MsgSendKeyshare({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.FairyringKeyshare.tx.msgSendKeyshare({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgSendKeyshare:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:MsgSendKeyshare:Create Could not create message: ' + e.message)
				}
			}
		},
		async MsgRegisterValidator({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.FairyringKeyshare.tx.msgRegisterValidator({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgRegisterValidator:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:MsgRegisterValidator:Create Could not create message: ' + e.message)
				}
			}
		},
		async MsgDeleteAuthorizedAddress({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.FairyringKeyshare.tx.msgDeleteAuthorizedAddress({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgDeleteAuthorizedAddress:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:MsgDeleteAuthorizedAddress:Create Could not create message: ' + e.message)
				}
			}
		},
		async MsgCreateLatestPubKey({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.FairyringKeyshare.tx.msgCreateLatestPubKey({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgCreateLatestPubKey:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:MsgCreateLatestPubKey:Create Could not create message: ' + e.message)
				}
			}
		},
		async MsgCreateAuthorizedAddress({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.FairyringKeyshare.tx.msgCreateAuthorizedAddress({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgCreateAuthorizedAddress:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:MsgCreateAuthorizedAddress:Create Could not create message: ' + e.message)
				}
			}
		},
		async MsgUpdateAuthorizedAddress({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.FairyringKeyshare.tx.msgUpdateAuthorizedAddress({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgUpdateAuthorizedAddress:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:MsgUpdateAuthorizedAddress:Create Could not create message: ' + e.message)
				}
			}
		},
		async MsgCreateGeneralKeyShare({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.FairyringKeyshare.tx.msgCreateGeneralKeyShare({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgCreateGeneralKeyShare:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:MsgCreateGeneralKeyShare:Create Could not create message: ' + e.message)
				}
			}
		},
		
	}
}