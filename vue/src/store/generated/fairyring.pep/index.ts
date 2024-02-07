import { Client, registry, MissingWalletError } from 'fairyring-client-ts'

import { AggregatedKeyShare } from "fairyring-client-ts/fairyring.pep/types"
import { EncryptedTx } from "fairyring-client-ts/fairyring.pep/types"
import { EncryptedTxArray } from "fairyring-client-ts/fairyring.pep/types"
import { PepPacketData } from "fairyring-client-ts/fairyring.pep/types"
import { NoData } from "fairyring-client-ts/fairyring.pep/types"
import { CurrentKeysPacketData } from "fairyring-client-ts/fairyring.pep/types"
import { CurrentKeysPacketAck } from "fairyring-client-ts/fairyring.pep/types"
import { Params } from "fairyring-client-ts/fairyring.pep/types"
import { TrustedCounterParty } from "fairyring-client-ts/fairyring.pep/types"
import { PepNonce } from "fairyring-client-ts/fairyring.pep/types"
import { ActivePubKey } from "fairyring-client-ts/fairyring.pep/types"
import { QueuedPubKey } from "fairyring-client-ts/fairyring.pep/types"


export { AggregatedKeyShare, EncryptedTx, EncryptedTxArray, PepPacketData, NoData, CurrentKeysPacketData, CurrentKeysPacketAck, Params, TrustedCounterParty, PepNonce, ActivePubKey, QueuedPubKey };

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
				Params: {},
				EncryptedTx: {},
				EncryptedTxAll: {},
				EncryptedTxAllFromHeight: {},
				LatestHeight: {},
				PepNonce: {},
				PepNonceAll: {},
				PubKey: {},
				
				_Structure: {
						AggregatedKeyShare: getStructure(AggregatedKeyShare.fromPartial({})),
						EncryptedTx: getStructure(EncryptedTx.fromPartial({})),
						EncryptedTxArray: getStructure(EncryptedTxArray.fromPartial({})),
						PepPacketData: getStructure(PepPacketData.fromPartial({})),
						NoData: getStructure(NoData.fromPartial({})),
						CurrentKeysPacketData: getStructure(CurrentKeysPacketData.fromPartial({})),
						CurrentKeysPacketAck: getStructure(CurrentKeysPacketAck.fromPartial({})),
						Params: getStructure(Params.fromPartial({})),
						TrustedCounterParty: getStructure(TrustedCounterParty.fromPartial({})),
						PepNonce: getStructure(PepNonce.fromPartial({})),
						ActivePubKey: getStructure(ActivePubKey.fromPartial({})),
						QueuedPubKey: getStructure(QueuedPubKey.fromPartial({})),
						
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
				getParams: (state) => (params = { params: {}}) => {
					if (!(<any> params).query) {
						(<any> params).query=null
					}
			return state.Params[JSON.stringify(params)] ?? {}
		},
				getEncryptedTx: (state) => (params = { params: {}}) => {
					if (!(<any> params).query) {
						(<any> params).query=null
					}
			return state.EncryptedTx[JSON.stringify(params)] ?? {}
		},
				getEncryptedTxAll: (state) => (params = { params: {}}) => {
					if (!(<any> params).query) {
						(<any> params).query=null
					}
			return state.EncryptedTxAll[JSON.stringify(params)] ?? {}
		},
				getEncryptedTxAllFromHeight: (state) => (params = { params: {}}) => {
					if (!(<any> params).query) {
						(<any> params).query=null
					}
			return state.EncryptedTxAllFromHeight[JSON.stringify(params)] ?? {}
		},
				getLatestHeight: (state) => (params = { params: {}}) => {
					if (!(<any> params).query) {
						(<any> params).query=null
					}
			return state.LatestHeight[JSON.stringify(params)] ?? {}
		},
				getPepNonce: (state) => (params = { params: {}}) => {
					if (!(<any> params).query) {
						(<any> params).query=null
					}
			return state.PepNonce[JSON.stringify(params)] ?? {}
		},
				getPepNonceAll: (state) => (params = { params: {}}) => {
					if (!(<any> params).query) {
						(<any> params).query=null
					}
			return state.PepNonceAll[JSON.stringify(params)] ?? {}
		},
				getPubKey: (state) => (params = { params: {}}) => {
					if (!(<any> params).query) {
						(<any> params).query=null
					}
			return state.PubKey[JSON.stringify(params)] ?? {}
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
			console.log('Vuex module: fairyring.pep initialized!')
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
		
		
		
		 		
		
		
		async QueryParams({ commit, rootGetters, getters }, { options: { subscribe, all} = { subscribe:false, all:false}, params, query=null }) {
			try {
				const key = params ?? {};
				const client = initClient(rootGetters);
				let value= (await client.FairyringPep.query.queryParams()).data
				
					
				commit('QUERY', { query: 'Params', key: { params: {...key}, query}, value })
				if (subscribe) commit('SUBSCRIBE', { action: 'QueryParams', payload: { options: { all }, params: {...key},query }})
				return getters['getParams']( { params: {...key}, query}) ?? {}
			} catch (e) {
				throw new Error('QueryClient:QueryParams API Node Unavailable. Could not perform query: ' + e.message)
				
			}
		},
		
		
		
		
		 		
		
		
		async QueryEncryptedTx({ commit, rootGetters, getters }, { options: { subscribe, all} = { subscribe:false, all:false}, params, query=null }) {
			try {
				const key = params ?? {};
				const client = initClient(rootGetters);
				let value= (await client.FairyringPep.query.queryEncryptedTx( key.targetHeight,  key.index)).data
				
					
				commit('QUERY', { query: 'EncryptedTx', key: { params: {...key}, query}, value })
				if (subscribe) commit('SUBSCRIBE', { action: 'QueryEncryptedTx', payload: { options: { all }, params: {...key},query }})
				return getters['getEncryptedTx']( { params: {...key}, query}) ?? {}
			} catch (e) {
				throw new Error('QueryClient:QueryEncryptedTx API Node Unavailable. Could not perform query: ' + e.message)
				
			}
		},
		
		
		
		
		 		
		
		
		async QueryEncryptedTxAll({ commit, rootGetters, getters }, { options: { subscribe, all} = { subscribe:false, all:false}, params, query=null }) {
			try {
				const key = params ?? {};
				const client = initClient(rootGetters);
				let value= (await client.FairyringPep.query.queryEncryptedTxAll(query ?? undefined)).data
				
					
				while (all && (<any> value).pagination && (<any> value).pagination.next_key!=null) {
					let next_values=(await client.FairyringPep.query.queryEncryptedTxAll({...query ?? {}, 'pagination.key':(<any> value).pagination.next_key} as any)).data
					value = mergeResults(value, next_values);
				}
				commit('QUERY', { query: 'EncryptedTxAll', key: { params: {...key}, query}, value })
				if (subscribe) commit('SUBSCRIBE', { action: 'QueryEncryptedTxAll', payload: { options: { all }, params: {...key},query }})
				return getters['getEncryptedTxAll']( { params: {...key}, query}) ?? {}
			} catch (e) {
				throw new Error('QueryClient:QueryEncryptedTxAll API Node Unavailable. Could not perform query: ' + e.message)
				
			}
		},
		
		
		
		
		 		
		
		
		async QueryEncryptedTxAllFromHeight({ commit, rootGetters, getters }, { options: { subscribe, all} = { subscribe:false, all:false}, params, query=null }) {
			try {
				const key = params ?? {};
				const client = initClient(rootGetters);
				let value= (await client.FairyringPep.query.queryEncryptedTxAllFromHeight( key.targetHeight)).data
				
					
				commit('QUERY', { query: 'EncryptedTxAllFromHeight', key: { params: {...key}, query}, value })
				if (subscribe) commit('SUBSCRIBE', { action: 'QueryEncryptedTxAllFromHeight', payload: { options: { all }, params: {...key},query }})
				return getters['getEncryptedTxAllFromHeight']( { params: {...key}, query}) ?? {}
			} catch (e) {
				throw new Error('QueryClient:QueryEncryptedTxAllFromHeight API Node Unavailable. Could not perform query: ' + e.message)
				
			}
		},
		
		
		
		
		 		
		
		
		async QueryLatestHeight({ commit, rootGetters, getters }, { options: { subscribe, all} = { subscribe:false, all:false}, params, query=null }) {
			try {
				const key = params ?? {};
				const client = initClient(rootGetters);
				let value= (await client.FairyringPep.query.queryLatestHeight()).data
				
					
				commit('QUERY', { query: 'LatestHeight', key: { params: {...key}, query}, value })
				if (subscribe) commit('SUBSCRIBE', { action: 'QueryLatestHeight', payload: { options: { all }, params: {...key},query }})
				return getters['getLatestHeight']( { params: {...key}, query}) ?? {}
			} catch (e) {
				throw new Error('QueryClient:QueryLatestHeight API Node Unavailable. Could not perform query: ' + e.message)
				
			}
		},
		
		
		
		
		 		
		
		
		async QueryPepNonce({ commit, rootGetters, getters }, { options: { subscribe, all} = { subscribe:false, all:false}, params, query=null }) {
			try {
				const key = params ?? {};
				const client = initClient(rootGetters);
				let value= (await client.FairyringPep.query.queryPepNonce( key.address)).data
				
					
				commit('QUERY', { query: 'PepNonce', key: { params: {...key}, query}, value })
				if (subscribe) commit('SUBSCRIBE', { action: 'QueryPepNonce', payload: { options: { all }, params: {...key},query }})
				return getters['getPepNonce']( { params: {...key}, query}) ?? {}
			} catch (e) {
				throw new Error('QueryClient:QueryPepNonce API Node Unavailable. Could not perform query: ' + e.message)
				
			}
		},
		
		
		
		
		 		
		
		
		async QueryPepNonceAll({ commit, rootGetters, getters }, { options: { subscribe, all} = { subscribe:false, all:false}, params, query=null }) {
			try {
				const key = params ?? {};
				const client = initClient(rootGetters);
				let value= (await client.FairyringPep.query.queryPepNonceAll(query ?? undefined)).data
				
					
				while (all && (<any> value).pagination && (<any> value).pagination.next_key!=null) {
					let next_values=(await client.FairyringPep.query.queryPepNonceAll({...query ?? {}, 'pagination.key':(<any> value).pagination.next_key} as any)).data
					value = mergeResults(value, next_values);
				}
				commit('QUERY', { query: 'PepNonceAll', key: { params: {...key}, query}, value })
				if (subscribe) commit('SUBSCRIBE', { action: 'QueryPepNonceAll', payload: { options: { all }, params: {...key},query }})
				return getters['getPepNonceAll']( { params: {...key}, query}) ?? {}
			} catch (e) {
				throw new Error('QueryClient:QueryPepNonceAll API Node Unavailable. Could not perform query: ' + e.message)
				
			}
		},
		
		
		
		
		 		
		
		
		async QueryPubKey({ commit, rootGetters, getters }, { options: { subscribe, all} = { subscribe:false, all:false}, params, query=null }) {
			try {
				const key = params ?? {};
				const client = initClient(rootGetters);
				let value= (await client.FairyringPep.query.queryPubKey()).data
				
					
				commit('QUERY', { query: 'PubKey', key: { params: {...key}, query}, value })
				if (subscribe) commit('SUBSCRIBE', { action: 'QueryPubKey', payload: { options: { all }, params: {...key},query }})
				return getters['getPubKey']( { params: {...key}, query}) ?? {}
			} catch (e) {
				throw new Error('QueryClient:QueryPubKey API Node Unavailable. Could not perform query: ' + e.message)
				
			}
		},
		
		
		async sendMsgCreateAggregatedKeyShare({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.FairyringPep.tx.sendMsgCreateAggregatedKeyShare({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgCreateAggregatedKeyShare:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:MsgCreateAggregatedKeyShare:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendMsgSubmitEncryptedTx({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.FairyringPep.tx.sendMsgSubmitEncryptedTx({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgSubmitEncryptedTx:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:MsgSubmitEncryptedTx:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		
		async MsgCreateAggregatedKeyShare({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.FairyringPep.tx.msgCreateAggregatedKeyShare({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgCreateAggregatedKeyShare:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:MsgCreateAggregatedKeyShare:Create Could not create message: ' + e.message)
				}
			}
		},
		async MsgSubmitEncryptedTx({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.FairyringPep.tx.msgSubmitEncryptedTx({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgSubmitEncryptedTx:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:MsgSubmitEncryptedTx:Create Could not create message: ' + e.message)
				}
			}
		},
		
	}
}