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
				Config: {},
				Status: {},
				
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
				getConfig: (state) => (params = { params: {}}) => {
					if (!(<any> params).query) {
						(<any> params).query=null
					}
			return state.Config[JSON.stringify(params)] ?? {}
		},
				getStatus: (state) => (params = { params: {}}) => {
					if (!(<any> params).query) {
						(<any> params).query=null
					}
			return state.Status[JSON.stringify(params)] ?? {}
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
			console.log('Vuex module: cosmos.base.node.v1beta1 initialized!')
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
		
		
		
		 		
		
		
		async ServiceConfig({ commit, rootGetters, getters }, { options: { subscribe, all} = { subscribe:false, all:false}, params, query=null }) {
			try {
				const key = params ?? {};
				const client = initClient(rootGetters);
				let value= (await client.CosmosBaseNodeV1Beta1.query.serviceConfig()).data
				
					
				commit('QUERY', { query: 'Config', key: { params: {...key}, query}, value })
				if (subscribe) commit('SUBSCRIBE', { action: 'ServiceConfig', payload: { options: { all }, params: {...key},query }})
				return getters['getConfig']( { params: {...key}, query}) ?? {}
			} catch (e) {
				throw new Error('QueryClient:ServiceConfig API Node Unavailable. Could not perform query: ' + e.message)
				
			}
		},
		
		
		
		
		 		
		
		
		async ServiceStatus({ commit, rootGetters, getters }, { options: { subscribe, all} = { subscribe:false, all:false}, params, query=null }) {
			try {
				const key = params ?? {};
				const client = initClient(rootGetters);
				let value= (await client.CosmosBaseNodeV1Beta1.query.serviceStatus()).data
				
					
				commit('QUERY', { query: 'Status', key: { params: {...key}, query}, value })
				if (subscribe) commit('SUBSCRIBE', { action: 'ServiceStatus', payload: { options: { all }, params: {...key},query }})
				return getters['getStatus']( { params: {...key}, query}) ?? {}
			} catch (e) {
				throw new Error('QueryClient:ServiceStatus API Node Unavailable. Could not perform query: ' + e.message)
				
			}
		},
		
		
		async sendConfigRequest({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosBaseNodeV1Beta1.tx.sendConfigRequest({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:ConfigRequest:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:ConfigRequest:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendConfigResponse({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosBaseNodeV1Beta1.tx.sendConfigResponse({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:ConfigResponse:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:ConfigResponse:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendStatusRequest({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosBaseNodeV1Beta1.tx.sendStatusRequest({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:StatusRequest:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:StatusRequest:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendStatusResponse({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosBaseNodeV1Beta1.tx.sendStatusResponse({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:StatusResponse:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:StatusResponse:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		
		async ConfigRequest({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosBaseNodeV1Beta1.tx.configRequest({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:ConfigRequest:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:ConfigRequest:Create Could not create message: ' + e.message)
				}
			}
		},
		async ConfigResponse({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosBaseNodeV1Beta1.tx.configResponse({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:ConfigResponse:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:ConfigResponse:Create Could not create message: ' + e.message)
				}
			}
		},
		async StatusRequest({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosBaseNodeV1Beta1.tx.statusRequest({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:StatusRequest:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:StatusRequest:Create Could not create message: ' + e.message)
				}
			}
		},
		async StatusResponse({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosBaseNodeV1Beta1.tx.statusResponse({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:StatusResponse:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:StatusResponse:Create Could not create message: ' + e.message)
				}
			}
		},
		
	}
}