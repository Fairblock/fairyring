import { Client, registry, MissingWalletError } from 'fairyring-client-ts'

import { EncryptedTx } from "fairyring-client-ts/fairyring.fairblock/types"
import { EncryptedTxArray } from "fairyring-client-ts/fairyring.fairblock/types"
import { FairblockExecutedNonce } from "fairyring-client-ts/fairyring.fairblock/types"
import { FairblockNonce } from "fairyring-client-ts/fairyring.fairblock/types"
import { FairblockTx } from "fairyring-client-ts/fairyring.fairblock/types"
import { FairblockPacketData } from "fairyring-client-ts/fairyring.fairblock/types"
import { NoData } from "fairyring-client-ts/fairyring.fairblock/types"
import { CurrentHeightPacketData } from "fairyring-client-ts/fairyring.fairblock/types"
import { CurrentHeightPacketAck } from "fairyring-client-ts/fairyring.fairblock/types"
import { Params } from "fairyring-client-ts/fairyring.fairblock/types"


export { EncryptedTx, EncryptedTxArray, FairblockExecutedNonce, FairblockNonce, FairblockTx, FairblockPacketData, NoData, CurrentHeightPacketData, CurrentHeightPacketAck, Params };

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
				FairblockNonce: {},
				FairblockNonceAll: {},
				FairblockExecutedNonce: {},
				FairblockExecutedNonceAll: {},
				
				_Structure: {
						EncryptedTx: getStructure(EncryptedTx.fromPartial({})),
						EncryptedTxArray: getStructure(EncryptedTxArray.fromPartial({})),
						FairblockExecutedNonce: getStructure(FairblockExecutedNonce.fromPartial({})),
						FairblockNonce: getStructure(FairblockNonce.fromPartial({})),
						FairblockTx: getStructure(FairblockTx.fromPartial({})),
						FairblockPacketData: getStructure(FairblockPacketData.fromPartial({})),
						NoData: getStructure(NoData.fromPartial({})),
						CurrentHeightPacketData: getStructure(CurrentHeightPacketData.fromPartial({})),
						CurrentHeightPacketAck: getStructure(CurrentHeightPacketAck.fromPartial({})),
						Params: getStructure(Params.fromPartial({})),
						
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
				getFairblockNonce: (state) => (params = { params: {}}) => {
					if (!(<any> params).query) {
						(<any> params).query=null
					}
			return state.FairblockNonce[JSON.stringify(params)] ?? {}
		},
				getFairblockNonceAll: (state) => (params = { params: {}}) => {
					if (!(<any> params).query) {
						(<any> params).query=null
					}
			return state.FairblockNonceAll[JSON.stringify(params)] ?? {}
		},
				getFairblockExecutedNonce: (state) => (params = { params: {}}) => {
					if (!(<any> params).query) {
						(<any> params).query=null
					}
			return state.FairblockExecutedNonce[JSON.stringify(params)] ?? {}
		},
				getFairblockExecutedNonceAll: (state) => (params = { params: {}}) => {
					if (!(<any> params).query) {
						(<any> params).query=null
					}
			return state.FairblockExecutedNonceAll[JSON.stringify(params)] ?? {}
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
			console.log('Vuex module: fairyring.fairblock initialized!')
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
				let value= (await client.FairyringFairblock.query.queryParams()).data
				
					
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
				let value= (await client.FairyringFairblock.query.queryEncryptedTx( key.targetHeight,  key.index)).data
				
					
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
				let value= (await client.FairyringFairblock.query.queryEncryptedTxAll(query ?? undefined)).data
				
					
				while (all && (<any> value).pagination && (<any> value).pagination.next_key!=null) {
					let next_values=(await client.FairyringFairblock.query.queryEncryptedTxAll({...query ?? {}, 'pagination.key':(<any> value).pagination.next_key} as any)).data
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
				let value= (await client.FairyringFairblock.query.queryEncryptedTxAllFromHeight( key.targetHeight)).data
				
					
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
				let value= (await client.FairyringFairblock.query.queryLatestHeight()).data
				
					
				commit('QUERY', { query: 'LatestHeight', key: { params: {...key}, query}, value })
				if (subscribe) commit('SUBSCRIBE', { action: 'QueryLatestHeight', payload: { options: { all }, params: {...key},query }})
				return getters['getLatestHeight']( { params: {...key}, query}) ?? {}
			} catch (e) {
				throw new Error('QueryClient:QueryLatestHeight API Node Unavailable. Could not perform query: ' + e.message)
				
			}
		},
		
		
		
		
		 		
		
		
		async QueryFairblockNonce({ commit, rootGetters, getters }, { options: { subscribe, all} = { subscribe:false, all:false}, params, query=null }) {
			try {
				const key = params ?? {};
				const client = initClient(rootGetters);
				let value= (await client.FairyringFairblock.query.queryFairblockNonce( key.address)).data
				
					
				commit('QUERY', { query: 'FairblockNonce', key: { params: {...key}, query}, value })
				if (subscribe) commit('SUBSCRIBE', { action: 'QueryFairblockNonce', payload: { options: { all }, params: {...key},query }})
				return getters['getFairblockNonce']( { params: {...key}, query}) ?? {}
			} catch (e) {
				throw new Error('QueryClient:QueryFairblockNonce API Node Unavailable. Could not perform query: ' + e.message)
				
			}
		},
		
		
		
		
		 		
		
		
		async QueryFairblockNonceAll({ commit, rootGetters, getters }, { options: { subscribe, all} = { subscribe:false, all:false}, params, query=null }) {
			try {
				const key = params ?? {};
				const client = initClient(rootGetters);
				let value= (await client.FairyringFairblock.query.queryFairblockNonceAll(query ?? undefined)).data
				
					
				while (all && (<any> value).pagination && (<any> value).pagination.next_key!=null) {
					let next_values=(await client.FairyringFairblock.query.queryFairblockNonceAll({...query ?? {}, 'pagination.key':(<any> value).pagination.next_key} as any)).data
					value = mergeResults(value, next_values);
				}
				commit('QUERY', { query: 'FairblockNonceAll', key: { params: {...key}, query}, value })
				if (subscribe) commit('SUBSCRIBE', { action: 'QueryFairblockNonceAll', payload: { options: { all }, params: {...key},query }})
				return getters['getFairblockNonceAll']( { params: {...key}, query}) ?? {}
			} catch (e) {
				throw new Error('QueryClient:QueryFairblockNonceAll API Node Unavailable. Could not perform query: ' + e.message)
				
			}
		},
		
		
		
		
		 		
		
		
		async QueryFairblockExecutedNonce({ commit, rootGetters, getters }, { options: { subscribe, all} = { subscribe:false, all:false}, params, query=null }) {
			try {
				const key = params ?? {};
				const client = initClient(rootGetters);
				let value= (await client.FairyringFairblock.query.queryFairblockExecutedNonce( key.address)).data
				
					
				commit('QUERY', { query: 'FairblockExecutedNonce', key: { params: {...key}, query}, value })
				if (subscribe) commit('SUBSCRIBE', { action: 'QueryFairblockExecutedNonce', payload: { options: { all }, params: {...key},query }})
				return getters['getFairblockExecutedNonce']( { params: {...key}, query}) ?? {}
			} catch (e) {
				throw new Error('QueryClient:QueryFairblockExecutedNonce API Node Unavailable. Could not perform query: ' + e.message)
				
			}
		},
		
		
		
		
		 		
		
		
		async QueryFairblockExecutedNonceAll({ commit, rootGetters, getters }, { options: { subscribe, all} = { subscribe:false, all:false}, params, query=null }) {
			try {
				const key = params ?? {};
				const client = initClient(rootGetters);
				let value= (await client.FairyringFairblock.query.queryFairblockExecutedNonceAll(query ?? undefined)).data
				
					
				while (all && (<any> value).pagination && (<any> value).pagination.next_key!=null) {
					let next_values=(await client.FairyringFairblock.query.queryFairblockExecutedNonceAll({...query ?? {}, 'pagination.key':(<any> value).pagination.next_key} as any)).data
					value = mergeResults(value, next_values);
				}
				commit('QUERY', { query: 'FairblockExecutedNonceAll', key: { params: {...key}, query}, value })
				if (subscribe) commit('SUBSCRIBE', { action: 'QueryFairblockExecutedNonceAll', payload: { options: { all }, params: {...key},query }})
				return getters['getFairblockExecutedNonceAll']( { params: {...key}, query}) ?? {}
			} catch (e) {
				throw new Error('QueryClient:QueryFairblockExecutedNonceAll API Node Unavailable. Could not perform query: ' + e.message)
				
			}
		},
		
		
		async sendMsgRegisterHeight({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.FairyringFairblock.tx.sendMsgRegisterHeight({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgRegisterHeight:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:MsgRegisterHeight:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendMsgSubmitEncryptedTx({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.FairyringFairblock.tx.sendMsgSubmitEncryptedTx({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgSubmitEncryptedTx:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:MsgSubmitEncryptedTx:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendMsgSendCurrentHeight({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.FairyringFairblock.tx.sendMsgSendCurrentHeight({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgSendCurrentHeight:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:MsgSendCurrentHeight:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		
		async MsgRegisterHeight({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.FairyringFairblock.tx.msgRegisterHeight({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgRegisterHeight:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:MsgRegisterHeight:Create Could not create message: ' + e.message)
				}
			}
		},
		async MsgSubmitEncryptedTx({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.FairyringFairblock.tx.msgSubmitEncryptedTx({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgSubmitEncryptedTx:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:MsgSubmitEncryptedTx:Create Could not create message: ' + e.message)
				}
			}
		},
		async MsgSendCurrentHeight({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.FairyringFairblock.tx.msgSendCurrentHeight({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgSendCurrentHeight:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:MsgSendCurrentHeight:Create Could not create message: ' + e.message)
				}
			}
		},
		
	}
}