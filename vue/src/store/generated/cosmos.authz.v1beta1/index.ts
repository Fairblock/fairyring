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
				Grants: {},
				GranterGrants: {},
				GranteeGrants: {},
				
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
				getGrants: (state) => (params = { params: {}}) => {
					if (!(<any> params).query) {
						(<any> params).query=null
					}
			return state.Grants[JSON.stringify(params)] ?? {}
		},
				getGranterGrants: (state) => (params = { params: {}}) => {
					if (!(<any> params).query) {
						(<any> params).query=null
					}
			return state.GranterGrants[JSON.stringify(params)] ?? {}
		},
				getGranteeGrants: (state) => (params = { params: {}}) => {
					if (!(<any> params).query) {
						(<any> params).query=null
					}
			return state.GranteeGrants[JSON.stringify(params)] ?? {}
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
			console.log('Vuex module: cosmos.authz.v1beta1 initialized!')
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
		
		
		
		 		
		
		
		async QueryGrants({ commit, rootGetters, getters }, { options: { subscribe, all} = { subscribe:false, all:false}, params, query=null }) {
			try {
				const key = params ?? {};
				const client = initClient(rootGetters);
				let value= (await client.CosmosAuthzV1Beta1.query.queryGrants(query ?? undefined)).data
				
					
				while (all && (<any> value).pagination && (<any> value).pagination.next_key!=null) {
					let next_values=(await client.CosmosAuthzV1Beta1.query.queryGrants({...query ?? {}, 'pagination.key':(<any> value).pagination.next_key} as any)).data
					value = mergeResults(value, next_values);
				}
				commit('QUERY', { query: 'Grants', key: { params: {...key}, query}, value })
				if (subscribe) commit('SUBSCRIBE', { action: 'QueryGrants', payload: { options: { all }, params: {...key},query }})
				return getters['getGrants']( { params: {...key}, query}) ?? {}
			} catch (e) {
				throw new Error('QueryClient:QueryGrants API Node Unavailable. Could not perform query: ' + e.message)
				
			}
		},
		
		
		
		
		 		
		
		
		async QueryGranterGrants({ commit, rootGetters, getters }, { options: { subscribe, all} = { subscribe:false, all:false}, params, query=null }) {
			try {
				const key = params ?? {};
				const client = initClient(rootGetters);
				let value= (await client.CosmosAuthzV1Beta1.query.queryGranterGrants( key.granter, query ?? undefined)).data
				
					
				while (all && (<any> value).pagination && (<any> value).pagination.next_key!=null) {
					let next_values=(await client.CosmosAuthzV1Beta1.query.queryGranterGrants( key.granter, {...query ?? {}, 'pagination.key':(<any> value).pagination.next_key} as any)).data
					value = mergeResults(value, next_values);
				}
				commit('QUERY', { query: 'GranterGrants', key: { params: {...key}, query}, value })
				if (subscribe) commit('SUBSCRIBE', { action: 'QueryGranterGrants', payload: { options: { all }, params: {...key},query }})
				return getters['getGranterGrants']( { params: {...key}, query}) ?? {}
			} catch (e) {
				throw new Error('QueryClient:QueryGranterGrants API Node Unavailable. Could not perform query: ' + e.message)
				
			}
		},
		
		
		
		
		 		
		
		
		async QueryGranteeGrants({ commit, rootGetters, getters }, { options: { subscribe, all} = { subscribe:false, all:false}, params, query=null }) {
			try {
				const key = params ?? {};
				const client = initClient(rootGetters);
				let value= (await client.CosmosAuthzV1Beta1.query.queryGranteeGrants( key.grantee, query ?? undefined)).data
				
					
				while (all && (<any> value).pagination && (<any> value).pagination.next_key!=null) {
					let next_values=(await client.CosmosAuthzV1Beta1.query.queryGranteeGrants( key.grantee, {...query ?? {}, 'pagination.key':(<any> value).pagination.next_key} as any)).data
					value = mergeResults(value, next_values);
				}
				commit('QUERY', { query: 'GranteeGrants', key: { params: {...key}, query}, value })
				if (subscribe) commit('SUBSCRIBE', { action: 'QueryGranteeGrants', payload: { options: { all }, params: {...key},query }})
				return getters['getGranteeGrants']( { params: {...key}, query}) ?? {}
			} catch (e) {
				throw new Error('QueryClient:QueryGranteeGrants API Node Unavailable. Could not perform query: ' + e.message)
				
			}
		},
		
		
		async sendEventGrant({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosAuthzV1Beta1.tx.sendEventGrant({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:EventGrant:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:EventGrant:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendEventRevoke({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosAuthzV1Beta1.tx.sendEventRevoke({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:EventRevoke:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:EventRevoke:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendQueryGrantsResponse({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosAuthzV1Beta1.tx.sendQueryGrantsResponse({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryGrantsResponse:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QueryGrantsResponse:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendQueryGranterGrantsRequest({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosAuthzV1Beta1.tx.sendQueryGranterGrantsRequest({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryGranterGrantsRequest:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QueryGranterGrantsRequest:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendQueryGranterGrantsResponse({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosAuthzV1Beta1.tx.sendQueryGranterGrantsResponse({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryGranterGrantsResponse:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QueryGranterGrantsResponse:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendMsgRevokeResponse({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosAuthzV1Beta1.tx.sendMsgRevokeResponse({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgRevokeResponse:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:MsgRevokeResponse:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendGenericAuthorization({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosAuthzV1Beta1.tx.sendGenericAuthorization({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:GenericAuthorization:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:GenericAuthorization:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendGrant({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosAuthzV1Beta1.tx.sendGrant({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:Grant:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:Grant:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendGenesisState({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosAuthzV1Beta1.tx.sendGenesisState({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:GenesisState:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:GenesisState:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendGrantAuthorization({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosAuthzV1Beta1.tx.sendGrantAuthorization({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:GrantAuthorization:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:GrantAuthorization:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendMsgExec({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosAuthzV1Beta1.tx.sendMsgExec({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgExec:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:MsgExec:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendMsgExecResponse({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosAuthzV1Beta1.tx.sendMsgExecResponse({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgExecResponse:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:MsgExecResponse:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendMsgRevoke({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosAuthzV1Beta1.tx.sendMsgRevoke({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgRevoke:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:MsgRevoke:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendGrantQueueItem({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosAuthzV1Beta1.tx.sendGrantQueueItem({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:GrantQueueItem:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:GrantQueueItem:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendMsgGrant({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosAuthzV1Beta1.tx.sendMsgGrant({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgGrant:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:MsgGrant:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendMsgGrantResponse({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosAuthzV1Beta1.tx.sendMsgGrantResponse({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgGrantResponse:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:MsgGrantResponse:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendQueryGrantsRequest({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosAuthzV1Beta1.tx.sendQueryGrantsRequest({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryGrantsRequest:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QueryGrantsRequest:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendQueryGranteeGrantsRequest({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosAuthzV1Beta1.tx.sendQueryGranteeGrantsRequest({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryGranteeGrantsRequest:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QueryGranteeGrantsRequest:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendQueryGranteeGrantsResponse({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosAuthzV1Beta1.tx.sendQueryGranteeGrantsResponse({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryGranteeGrantsResponse:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QueryGranteeGrantsResponse:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		
		async EventGrant({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosAuthzV1Beta1.tx.eventGrant({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:EventGrant:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:EventGrant:Create Could not create message: ' + e.message)
				}
			}
		},
		async EventRevoke({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosAuthzV1Beta1.tx.eventRevoke({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:EventRevoke:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:EventRevoke:Create Could not create message: ' + e.message)
				}
			}
		},
		async QueryGrantsResponse({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosAuthzV1Beta1.tx.queryGrantsResponse({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryGrantsResponse:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QueryGrantsResponse:Create Could not create message: ' + e.message)
				}
			}
		},
		async QueryGranterGrantsRequest({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosAuthzV1Beta1.tx.queryGranterGrantsRequest({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryGranterGrantsRequest:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QueryGranterGrantsRequest:Create Could not create message: ' + e.message)
				}
			}
		},
		async QueryGranterGrantsResponse({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosAuthzV1Beta1.tx.queryGranterGrantsResponse({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryGranterGrantsResponse:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QueryGranterGrantsResponse:Create Could not create message: ' + e.message)
				}
			}
		},
		async MsgRevokeResponse({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosAuthzV1Beta1.tx.msgRevokeResponse({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgRevokeResponse:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:MsgRevokeResponse:Create Could not create message: ' + e.message)
				}
			}
		},
		async GenericAuthorization({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosAuthzV1Beta1.tx.genericAuthorization({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:GenericAuthorization:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:GenericAuthorization:Create Could not create message: ' + e.message)
				}
			}
		},
		async Grant({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosAuthzV1Beta1.tx.grant({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:Grant:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:Grant:Create Could not create message: ' + e.message)
				}
			}
		},
		async GenesisState({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosAuthzV1Beta1.tx.genesisState({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:GenesisState:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:GenesisState:Create Could not create message: ' + e.message)
				}
			}
		},
		async GrantAuthorization({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosAuthzV1Beta1.tx.grantAuthorization({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:GrantAuthorization:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:GrantAuthorization:Create Could not create message: ' + e.message)
				}
			}
		},
		async MsgExec({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosAuthzV1Beta1.tx.msgExec({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgExec:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:MsgExec:Create Could not create message: ' + e.message)
				}
			}
		},
		async MsgExecResponse({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosAuthzV1Beta1.tx.msgExecResponse({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgExecResponse:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:MsgExecResponse:Create Could not create message: ' + e.message)
				}
			}
		},
		async MsgRevoke({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosAuthzV1Beta1.tx.msgRevoke({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgRevoke:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:MsgRevoke:Create Could not create message: ' + e.message)
				}
			}
		},
		async GrantQueueItem({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosAuthzV1Beta1.tx.grantQueueItem({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:GrantQueueItem:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:GrantQueueItem:Create Could not create message: ' + e.message)
				}
			}
		},
		async MsgGrant({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosAuthzV1Beta1.tx.msgGrant({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgGrant:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:MsgGrant:Create Could not create message: ' + e.message)
				}
			}
		},
		async MsgGrantResponse({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosAuthzV1Beta1.tx.msgGrantResponse({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgGrantResponse:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:MsgGrantResponse:Create Could not create message: ' + e.message)
				}
			}
		},
		async QueryGrantsRequest({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosAuthzV1Beta1.tx.queryGrantsRequest({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryGrantsRequest:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QueryGrantsRequest:Create Could not create message: ' + e.message)
				}
			}
		},
		async QueryGranteeGrantsRequest({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosAuthzV1Beta1.tx.queryGranteeGrantsRequest({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryGranteeGrantsRequest:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QueryGranteeGrantsRequest:Create Could not create message: ' + e.message)
				}
			}
		},
		async QueryGranteeGrantsResponse({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosAuthzV1Beta1.tx.queryGranteeGrantsResponse({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryGranteeGrantsResponse:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QueryGranteeGrantsResponse:Create Could not create message: ' + e.message)
				}
			}
		},
		
	}
}