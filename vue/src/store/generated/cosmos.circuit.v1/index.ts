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
				Account: {},
				Accounts: {},
				DisabledList: {},
				
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
				getAccount: (state) => (params = { params: {}}) => {
					if (!(<any> params).query) {
						(<any> params).query=null
					}
			return state.Account[JSON.stringify(params)] ?? {}
		},
				getAccounts: (state) => (params = { params: {}}) => {
					if (!(<any> params).query) {
						(<any> params).query=null
					}
			return state.Accounts[JSON.stringify(params)] ?? {}
		},
				getDisabledList: (state) => (params = { params: {}}) => {
					if (!(<any> params).query) {
						(<any> params).query=null
					}
			return state.DisabledList[JSON.stringify(params)] ?? {}
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
			console.log('Vuex module: cosmos.circuit.v1 initialized!')
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
		
		
		
		 		
		
		
		async QueryAccount({ commit, rootGetters, getters }, { options: { subscribe, all} = { subscribe:false, all:false}, params, query=null }) {
			try {
				const key = params ?? {};
				const client = initClient(rootGetters);
				let value= (await client.CosmosCircuitV1.query.queryAccount( key.address)).data
				
					
				commit('QUERY', { query: 'Account', key: { params: {...key}, query}, value })
				if (subscribe) commit('SUBSCRIBE', { action: 'QueryAccount', payload: { options: { all }, params: {...key},query }})
				return getters['getAccount']( { params: {...key}, query}) ?? {}
			} catch (e) {
				throw new Error('QueryClient:QueryAccount API Node Unavailable. Could not perform query: ' + e.message)
				
			}
		},
		
		
		
		
		 		
		
		
		async QueryAccounts({ commit, rootGetters, getters }, { options: { subscribe, all} = { subscribe:false, all:false}, params, query=null }) {
			try {
				const key = params ?? {};
				const client = initClient(rootGetters);
				let value= (await client.CosmosCircuitV1.query.queryAccounts(query ?? undefined)).data
				
					
				while (all && (<any> value).pagination && (<any> value).pagination.next_key!=null) {
					let next_values=(await client.CosmosCircuitV1.query.queryAccounts({...query ?? {}, 'pagination.key':(<any> value).pagination.next_key} as any)).data
					value = mergeResults(value, next_values);
				}
				commit('QUERY', { query: 'Accounts', key: { params: {...key}, query}, value })
				if (subscribe) commit('SUBSCRIBE', { action: 'QueryAccounts', payload: { options: { all }, params: {...key},query }})
				return getters['getAccounts']( { params: {...key}, query}) ?? {}
			} catch (e) {
				throw new Error('QueryClient:QueryAccounts API Node Unavailable. Could not perform query: ' + e.message)
				
			}
		},
		
		
		
		
		 		
		
		
		async QueryDisabledList({ commit, rootGetters, getters }, { options: { subscribe, all} = { subscribe:false, all:false}, params, query=null }) {
			try {
				const key = params ?? {};
				const client = initClient(rootGetters);
				let value= (await client.CosmosCircuitV1.query.queryDisabledList()).data
				
					
				commit('QUERY', { query: 'DisabledList', key: { params: {...key}, query}, value })
				if (subscribe) commit('SUBSCRIBE', { action: 'QueryDisabledList', payload: { options: { all }, params: {...key},query }})
				return getters['getDisabledList']( { params: {...key}, query}) ?? {}
			} catch (e) {
				throw new Error('QueryClient:QueryDisabledList API Node Unavailable. Could not perform query: ' + e.message)
				
			}
		},
		
		
		async sendMsgTripCircuitBreakerResponse({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosCircuitV1.tx.sendMsgTripCircuitBreakerResponse({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgTripCircuitBreakerResponse:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:MsgTripCircuitBreakerResponse:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendQueryAccountRequest({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosCircuitV1.tx.sendQueryAccountRequest({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryAccountRequest:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QueryAccountRequest:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendMsgAuthorizeCircuitBreaker({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosCircuitV1.tx.sendMsgAuthorizeCircuitBreaker({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgAuthorizeCircuitBreaker:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:MsgAuthorizeCircuitBreaker:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendMsgAuthorizeCircuitBreakerResponse({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosCircuitV1.tx.sendMsgAuthorizeCircuitBreakerResponse({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgAuthorizeCircuitBreakerResponse:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:MsgAuthorizeCircuitBreakerResponse:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendGenesisState({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosCircuitV1.tx.sendGenesisState({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:GenesisState:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:GenesisState:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendAccountsResponse({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosCircuitV1.tx.sendAccountsResponse({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:AccountsResponse:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:AccountsResponse:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendQueryDisabledListRequest({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosCircuitV1.tx.sendQueryDisabledListRequest({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryDisabledListRequest:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QueryDisabledListRequest:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendMsgResetCircuitBreaker({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosCircuitV1.tx.sendMsgResetCircuitBreaker({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgResetCircuitBreaker:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:MsgResetCircuitBreaker:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendMsgResetCircuitBreakerResponse({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosCircuitV1.tx.sendMsgResetCircuitBreakerResponse({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgResetCircuitBreakerResponse:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:MsgResetCircuitBreakerResponse:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendAccountResponse({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosCircuitV1.tx.sendAccountResponse({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:AccountResponse:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:AccountResponse:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendDisabledListResponse({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosCircuitV1.tx.sendDisabledListResponse({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:DisabledListResponse:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:DisabledListResponse:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendPermissions({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosCircuitV1.tx.sendPermissions({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:Permissions:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:Permissions:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendGenesisAccountPermissions({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosCircuitV1.tx.sendGenesisAccountPermissions({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:GenesisAccountPermissions:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:GenesisAccountPermissions:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendQueryAccountsRequest({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosCircuitV1.tx.sendQueryAccountsRequest({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryAccountsRequest:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QueryAccountsRequest:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendMsgTripCircuitBreaker({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosCircuitV1.tx.sendMsgTripCircuitBreaker({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgTripCircuitBreaker:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:MsgTripCircuitBreaker:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		
		async MsgTripCircuitBreakerResponse({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosCircuitV1.tx.msgTripCircuitBreakerResponse({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgTripCircuitBreakerResponse:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:MsgTripCircuitBreakerResponse:Create Could not create message: ' + e.message)
				}
			}
		},
		async QueryAccountRequest({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosCircuitV1.tx.queryAccountRequest({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryAccountRequest:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QueryAccountRequest:Create Could not create message: ' + e.message)
				}
			}
		},
		async MsgAuthorizeCircuitBreaker({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosCircuitV1.tx.msgAuthorizeCircuitBreaker({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgAuthorizeCircuitBreaker:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:MsgAuthorizeCircuitBreaker:Create Could not create message: ' + e.message)
				}
			}
		},
		async MsgAuthorizeCircuitBreakerResponse({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosCircuitV1.tx.msgAuthorizeCircuitBreakerResponse({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgAuthorizeCircuitBreakerResponse:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:MsgAuthorizeCircuitBreakerResponse:Create Could not create message: ' + e.message)
				}
			}
		},
		async GenesisState({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosCircuitV1.tx.genesisState({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:GenesisState:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:GenesisState:Create Could not create message: ' + e.message)
				}
			}
		},
		async AccountsResponse({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosCircuitV1.tx.accountsResponse({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:AccountsResponse:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:AccountsResponse:Create Could not create message: ' + e.message)
				}
			}
		},
		async QueryDisabledListRequest({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosCircuitV1.tx.queryDisabledListRequest({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryDisabledListRequest:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QueryDisabledListRequest:Create Could not create message: ' + e.message)
				}
			}
		},
		async MsgResetCircuitBreaker({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosCircuitV1.tx.msgResetCircuitBreaker({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgResetCircuitBreaker:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:MsgResetCircuitBreaker:Create Could not create message: ' + e.message)
				}
			}
		},
		async MsgResetCircuitBreakerResponse({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosCircuitV1.tx.msgResetCircuitBreakerResponse({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgResetCircuitBreakerResponse:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:MsgResetCircuitBreakerResponse:Create Could not create message: ' + e.message)
				}
			}
		},
		async AccountResponse({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosCircuitV1.tx.accountResponse({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:AccountResponse:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:AccountResponse:Create Could not create message: ' + e.message)
				}
			}
		},
		async DisabledListResponse({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosCircuitV1.tx.disabledListResponse({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:DisabledListResponse:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:DisabledListResponse:Create Could not create message: ' + e.message)
				}
			}
		},
		async Permissions({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosCircuitV1.tx.permissions({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:Permissions:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:Permissions:Create Could not create message: ' + e.message)
				}
			}
		},
		async GenesisAccountPermissions({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosCircuitV1.tx.genesisAccountPermissions({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:GenesisAccountPermissions:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:GenesisAccountPermissions:Create Could not create message: ' + e.message)
				}
			}
		},
		async QueryAccountsRequest({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosCircuitV1.tx.queryAccountsRequest({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryAccountsRequest:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QueryAccountsRequest:Create Could not create message: ' + e.message)
				}
			}
		},
		async MsgTripCircuitBreaker({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosCircuitV1.tx.msgTripCircuitBreaker({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgTripCircuitBreaker:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:MsgTripCircuitBreaker:Create Could not create message: ' + e.message)
				}
			}
		},
		
	}
}