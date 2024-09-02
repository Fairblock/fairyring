import { Client, registry, MissingWalletError } from 'Fairblock-fairyring-client-ts'



export {  };

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
				Allowance: {},
				Allowances: {},
				AllowancesByGranter: {},
				
				_Structure: {
						
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
				getAllowance: (state) => (params = { params: {}}) => {
					if (!(<any> params).query) {
						(<any> params).query=null
					}
			return state.Allowance[JSON.stringify(params)] ?? {}
		},
				getAllowances: (state) => (params = { params: {}}) => {
					if (!(<any> params).query) {
						(<any> params).query=null
					}
			return state.Allowances[JSON.stringify(params)] ?? {}
		},
				getAllowancesByGranter: (state) => (params = { params: {}}) => {
					if (!(<any> params).query) {
						(<any> params).query=null
					}
			return state.AllowancesByGranter[JSON.stringify(params)] ?? {}
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
			console.log('Vuex module: cosmos.feegrant.v1beta1 initialized!')
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
		
		
		
		 		
		
		
		async QueryAllowance({ commit, rootGetters, getters }, { options: { subscribe, all} = { subscribe:false, all:false}, params, query=null }) {
			try {
				const key = params ?? {};
				const client = initClient(rootGetters);
				let value= (await client.CosmosFeegrantV1Beta1.query.queryAllowance( key.granter,  key.grantee)).data
				
					
				commit('QUERY', { query: 'Allowance', key: { params: {...key}, query}, value })
				if (subscribe) commit('SUBSCRIBE', { action: 'QueryAllowance', payload: { options: { all }, params: {...key},query }})
				return getters['getAllowance']( { params: {...key}, query}) ?? {}
			} catch (e) {
				throw new Error('QueryClient:QueryAllowance API Node Unavailable. Could not perform query: ' + e.message)
				
			}
		},
		
		
		
		
		 		
		
		
		async QueryAllowances({ commit, rootGetters, getters }, { options: { subscribe, all} = { subscribe:false, all:false}, params, query=null }) {
			try {
				const key = params ?? {};
				const client = initClient(rootGetters);
				let value= (await client.CosmosFeegrantV1Beta1.query.queryAllowances( key.grantee, query ?? undefined)).data
				
					
				while (all && (<any> value).pagination && (<any> value).pagination.next_key!=null) {
					let next_values=(await client.CosmosFeegrantV1Beta1.query.queryAllowances( key.grantee, {...query ?? {}, 'pagination.key':(<any> value).pagination.next_key} as any)).data
					value = mergeResults(value, next_values);
				}
				commit('QUERY', { query: 'Allowances', key: { params: {...key}, query}, value })
				if (subscribe) commit('SUBSCRIBE', { action: 'QueryAllowances', payload: { options: { all }, params: {...key},query }})
				return getters['getAllowances']( { params: {...key}, query}) ?? {}
			} catch (e) {
				throw new Error('QueryClient:QueryAllowances API Node Unavailable. Could not perform query: ' + e.message)
				
			}
		},
		
		
		
		
		 		
		
		
		async QueryAllowancesByGranter({ commit, rootGetters, getters }, { options: { subscribe, all} = { subscribe:false, all:false}, params, query=null }) {
			try {
				const key = params ?? {};
				const client = initClient(rootGetters);
				let value= (await client.CosmosFeegrantV1Beta1.query.queryAllowancesByGranter( key.granter, query ?? undefined)).data
				
					
				while (all && (<any> value).pagination && (<any> value).pagination.next_key!=null) {
					let next_values=(await client.CosmosFeegrantV1Beta1.query.queryAllowancesByGranter( key.granter, {...query ?? {}, 'pagination.key':(<any> value).pagination.next_key} as any)).data
					value = mergeResults(value, next_values);
				}
				commit('QUERY', { query: 'AllowancesByGranter', key: { params: {...key}, query}, value })
				if (subscribe) commit('SUBSCRIBE', { action: 'QueryAllowancesByGranter', payload: { options: { all }, params: {...key},query }})
				return getters['getAllowancesByGranter']( { params: {...key}, query}) ?? {}
			} catch (e) {
				throw new Error('QueryClient:QueryAllowancesByGranter API Node Unavailable. Could not perform query: ' + e.message)
				
			}
		},
		
		
		async sendQueryAllowanceResponse({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosFeegrantV1Beta1.tx.sendQueryAllowanceResponse({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryAllowanceResponse:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QueryAllowanceResponse:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendMsgRevokeAllowance({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosFeegrantV1Beta1.tx.sendMsgRevokeAllowance({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgRevokeAllowance:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:MsgRevokeAllowance:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendMsgPruneAllowances({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosFeegrantV1Beta1.tx.sendMsgPruneAllowances({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgPruneAllowances:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:MsgPruneAllowances:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendPeriodicAllowance({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosFeegrantV1Beta1.tx.sendPeriodicAllowance({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:PeriodicAllowance:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:PeriodicAllowance:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendQueryAllowancesRequest({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosFeegrantV1Beta1.tx.sendQueryAllowancesRequest({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryAllowancesRequest:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QueryAllowancesRequest:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendQueryAllowancesByGranterRequest({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosFeegrantV1Beta1.tx.sendQueryAllowancesByGranterRequest({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryAllowancesByGranterRequest:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QueryAllowancesByGranterRequest:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendMsgRevokeAllowanceResponse({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosFeegrantV1Beta1.tx.sendMsgRevokeAllowanceResponse({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgRevokeAllowanceResponse:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:MsgRevokeAllowanceResponse:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendMsgGrantAllowance({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosFeegrantV1Beta1.tx.sendMsgGrantAllowance({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgGrantAllowance:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:MsgGrantAllowance:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendQueryAllowanceRequest({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosFeegrantV1Beta1.tx.sendQueryAllowanceRequest({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryAllowanceRequest:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QueryAllowanceRequest:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendQueryAllowancesResponse({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosFeegrantV1Beta1.tx.sendQueryAllowancesResponse({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryAllowancesResponse:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QueryAllowancesResponse:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendBasicAllowance({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosFeegrantV1Beta1.tx.sendBasicAllowance({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:BasicAllowance:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:BasicAllowance:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendAllowedMsgAllowance({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosFeegrantV1Beta1.tx.sendAllowedMsgAllowance({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:AllowedMsgAllowance:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:AllowedMsgAllowance:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendGrant({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosFeegrantV1Beta1.tx.sendGrant({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:Grant:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:Grant:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendMsgGrantAllowanceResponse({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosFeegrantV1Beta1.tx.sendMsgGrantAllowanceResponse({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgGrantAllowanceResponse:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:MsgGrantAllowanceResponse:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendMsgPruneAllowancesResponse({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosFeegrantV1Beta1.tx.sendMsgPruneAllowancesResponse({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgPruneAllowancesResponse:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:MsgPruneAllowancesResponse:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendGenesisState({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosFeegrantV1Beta1.tx.sendGenesisState({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:GenesisState:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:GenesisState:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendQueryAllowancesByGranterResponse({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosFeegrantV1Beta1.tx.sendQueryAllowancesByGranterResponse({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryAllowancesByGranterResponse:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QueryAllowancesByGranterResponse:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		
		async QueryAllowanceResponse({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosFeegrantV1Beta1.tx.queryAllowanceResponse({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryAllowanceResponse:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QueryAllowanceResponse:Create Could not create message: ' + e.message)
				}
			}
		},
		async MsgRevokeAllowance({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosFeegrantV1Beta1.tx.msgRevokeAllowance({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgRevokeAllowance:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:MsgRevokeAllowance:Create Could not create message: ' + e.message)
				}
			}
		},
		async MsgPruneAllowances({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosFeegrantV1Beta1.tx.msgPruneAllowances({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgPruneAllowances:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:MsgPruneAllowances:Create Could not create message: ' + e.message)
				}
			}
		},
		async PeriodicAllowance({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosFeegrantV1Beta1.tx.periodicAllowance({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:PeriodicAllowance:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:PeriodicAllowance:Create Could not create message: ' + e.message)
				}
			}
		},
		async QueryAllowancesRequest({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosFeegrantV1Beta1.tx.queryAllowancesRequest({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryAllowancesRequest:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QueryAllowancesRequest:Create Could not create message: ' + e.message)
				}
			}
		},
		async QueryAllowancesByGranterRequest({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosFeegrantV1Beta1.tx.queryAllowancesByGranterRequest({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryAllowancesByGranterRequest:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QueryAllowancesByGranterRequest:Create Could not create message: ' + e.message)
				}
			}
		},
		async MsgRevokeAllowanceResponse({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosFeegrantV1Beta1.tx.msgRevokeAllowanceResponse({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgRevokeAllowanceResponse:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:MsgRevokeAllowanceResponse:Create Could not create message: ' + e.message)
				}
			}
		},
		async MsgGrantAllowance({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosFeegrantV1Beta1.tx.msgGrantAllowance({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgGrantAllowance:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:MsgGrantAllowance:Create Could not create message: ' + e.message)
				}
			}
		},
		async QueryAllowanceRequest({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosFeegrantV1Beta1.tx.queryAllowanceRequest({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryAllowanceRequest:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QueryAllowanceRequest:Create Could not create message: ' + e.message)
				}
			}
		},
		async QueryAllowancesResponse({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosFeegrantV1Beta1.tx.queryAllowancesResponse({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryAllowancesResponse:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QueryAllowancesResponse:Create Could not create message: ' + e.message)
				}
			}
		},
		async BasicAllowance({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosFeegrantV1Beta1.tx.basicAllowance({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:BasicAllowance:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:BasicAllowance:Create Could not create message: ' + e.message)
				}
			}
		},
		async AllowedMsgAllowance({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosFeegrantV1Beta1.tx.allowedMsgAllowance({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:AllowedMsgAllowance:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:AllowedMsgAllowance:Create Could not create message: ' + e.message)
				}
			}
		},
		async Grant({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosFeegrantV1Beta1.tx.grant({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:Grant:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:Grant:Create Could not create message: ' + e.message)
				}
			}
		},
		async MsgGrantAllowanceResponse({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosFeegrantV1Beta1.tx.msgGrantAllowanceResponse({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgGrantAllowanceResponse:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:MsgGrantAllowanceResponse:Create Could not create message: ' + e.message)
				}
			}
		},
		async MsgPruneAllowancesResponse({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosFeegrantV1Beta1.tx.msgPruneAllowancesResponse({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgPruneAllowancesResponse:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:MsgPruneAllowancesResponse:Create Could not create message: ' + e.message)
				}
			}
		},
		async GenesisState({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosFeegrantV1Beta1.tx.genesisState({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:GenesisState:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:GenesisState:Create Could not create message: ' + e.message)
				}
			}
		},
		async QueryAllowancesByGranterResponse({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosFeegrantV1Beta1.tx.queryAllowancesByGranterResponse({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryAllowancesByGranterResponse:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QueryAllowancesByGranterResponse:Create Could not create message: ' + e.message)
				}
			}
		},
		
	}
}