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
				Params: {},
				Subspaces: {},
				
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
				getParams: (state) => (params = { params: {}}) => {
					if (!(<any> params).query) {
						(<any> params).query=null
					}
			return state.Params[JSON.stringify(params)] ?? {}
		},
				getSubspaces: (state) => (params = { params: {}}) => {
					if (!(<any> params).query) {
						(<any> params).query=null
					}
			return state.Subspaces[JSON.stringify(params)] ?? {}
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
			console.log('Vuex module: cosmos.params.v1beta1 initialized!')
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
				let value= (await client.CosmosParamsV1Beta1.query.queryParams(query ?? undefined)).data
				
					
				while (all && (<any> value).pagination && (<any> value).pagination.next_key!=null) {
					let next_values=(await client.CosmosParamsV1Beta1.query.queryParams({...query ?? {}, 'pagination.key':(<any> value).pagination.next_key} as any)).data
					value = mergeResults(value, next_values);
				}
				commit('QUERY', { query: 'Params', key: { params: {...key}, query}, value })
				if (subscribe) commit('SUBSCRIBE', { action: 'QueryParams', payload: { options: { all }, params: {...key},query }})
				return getters['getParams']( { params: {...key}, query}) ?? {}
			} catch (e) {
				throw new Error('QueryClient:QueryParams API Node Unavailable. Could not perform query: ' + e.message)
				
			}
		},
		
		
		
		
		 		
		
		
		async QuerySubspaces({ commit, rootGetters, getters }, { options: { subscribe, all} = { subscribe:false, all:false}, params, query=null }) {
			try {
				const key = params ?? {};
				const client = initClient(rootGetters);
				let value= (await client.CosmosParamsV1Beta1.query.querySubspaces()).data
				
					
				commit('QUERY', { query: 'Subspaces', key: { params: {...key}, query}, value })
				if (subscribe) commit('SUBSCRIBE', { action: 'QuerySubspaces', payload: { options: { all }, params: {...key},query }})
				return getters['getSubspaces']( { params: {...key}, query}) ?? {}
			} catch (e) {
				throw new Error('QueryClient:QuerySubspaces API Node Unavailable. Could not perform query: ' + e.message)
				
			}
		},
		
		
		async sendSubspace({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosParamsV1Beta1.tx.sendSubspace({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:Subspace:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:Subspace:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendParamChange({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosParamsV1Beta1.tx.sendParamChange({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:ParamChange:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:ParamChange:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendParameterChangeProposal({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosParamsV1Beta1.tx.sendParameterChangeProposal({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:ParameterChangeProposal:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:ParameterChangeProposal:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendQueryParamsRequest({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosParamsV1Beta1.tx.sendQueryParamsRequest({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryParamsRequest:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QueryParamsRequest:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendQueryParamsResponse({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosParamsV1Beta1.tx.sendQueryParamsResponse({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryParamsResponse:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QueryParamsResponse:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendQuerySubspacesRequest({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosParamsV1Beta1.tx.sendQuerySubspacesRequest({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QuerySubspacesRequest:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QuerySubspacesRequest:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendQuerySubspacesResponse({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosParamsV1Beta1.tx.sendQuerySubspacesResponse({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QuerySubspacesResponse:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QuerySubspacesResponse:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		
		async Subspace({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosParamsV1Beta1.tx.subspace({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:Subspace:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:Subspace:Create Could not create message: ' + e.message)
				}
			}
		},
		async ParamChange({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosParamsV1Beta1.tx.paramChange({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:ParamChange:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:ParamChange:Create Could not create message: ' + e.message)
				}
			}
		},
		async ParameterChangeProposal({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosParamsV1Beta1.tx.parameterChangeProposal({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:ParameterChangeProposal:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:ParameterChangeProposal:Create Could not create message: ' + e.message)
				}
			}
		},
		async QueryParamsRequest({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosParamsV1Beta1.tx.queryParamsRequest({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryParamsRequest:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QueryParamsRequest:Create Could not create message: ' + e.message)
				}
			}
		},
		async QueryParamsResponse({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosParamsV1Beta1.tx.queryParamsResponse({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryParamsResponse:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QueryParamsResponse:Create Could not create message: ' + e.message)
				}
			}
		},
		async QuerySubspacesRequest({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosParamsV1Beta1.tx.querySubspacesRequest({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QuerySubspacesRequest:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QuerySubspacesRequest:Create Could not create message: ' + e.message)
				}
			}
		},
		async QuerySubspacesResponse({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosParamsV1Beta1.tx.querySubspacesResponse({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QuerySubspacesResponse:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QuerySubspacesResponse:Create Could not create message: ' + e.message)
				}
			}
		},
		
	}
}