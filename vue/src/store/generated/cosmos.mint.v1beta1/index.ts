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
				Inflation: {},
				AnnualProvisions: {},
				
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
				getInflation: (state) => (params = { params: {}}) => {
					if (!(<any> params).query) {
						(<any> params).query=null
					}
			return state.Inflation[JSON.stringify(params)] ?? {}
		},
				getAnnualProvisions: (state) => (params = { params: {}}) => {
					if (!(<any> params).query) {
						(<any> params).query=null
					}
			return state.AnnualProvisions[JSON.stringify(params)] ?? {}
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
			console.log('Vuex module: cosmos.mint.v1beta1 initialized!')
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
				let value= (await client.CosmosMintV1Beta1.query.queryParams()).data
				
					
				commit('QUERY', { query: 'Params', key: { params: {...key}, query}, value })
				if (subscribe) commit('SUBSCRIBE', { action: 'QueryParams', payload: { options: { all }, params: {...key},query }})
				return getters['getParams']( { params: {...key}, query}) ?? {}
			} catch (e) {
				throw new Error('QueryClient:QueryParams API Node Unavailable. Could not perform query: ' + e.message)
				
			}
		},
		
		
		
		
		 		
		
		
		async QueryInflation({ commit, rootGetters, getters }, { options: { subscribe, all} = { subscribe:false, all:false}, params, query=null }) {
			try {
				const key = params ?? {};
				const client = initClient(rootGetters);
				let value= (await client.CosmosMintV1Beta1.query.queryInflation()).data
				
					
				commit('QUERY', { query: 'Inflation', key: { params: {...key}, query}, value })
				if (subscribe) commit('SUBSCRIBE', { action: 'QueryInflation', payload: { options: { all }, params: {...key},query }})
				return getters['getInflation']( { params: {...key}, query}) ?? {}
			} catch (e) {
				throw new Error('QueryClient:QueryInflation API Node Unavailable. Could not perform query: ' + e.message)
				
			}
		},
		
		
		
		
		 		
		
		
		async QueryAnnualProvisions({ commit, rootGetters, getters }, { options: { subscribe, all} = { subscribe:false, all:false}, params, query=null }) {
			try {
				const key = params ?? {};
				const client = initClient(rootGetters);
				let value= (await client.CosmosMintV1Beta1.query.queryAnnualProvisions()).data
				
					
				commit('QUERY', { query: 'AnnualProvisions', key: { params: {...key}, query}, value })
				if (subscribe) commit('SUBSCRIBE', { action: 'QueryAnnualProvisions', payload: { options: { all }, params: {...key},query }})
				return getters['getAnnualProvisions']( { params: {...key}, query}) ?? {}
			} catch (e) {
				throw new Error('QueryClient:QueryAnnualProvisions API Node Unavailable. Could not perform query: ' + e.message)
				
			}
		},
		
		
		async sendQueryParamsResponse({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosMintV1Beta1.tx.sendQueryParamsResponse({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryParamsResponse:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QueryParamsResponse:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendQueryAnnualProvisionsResponse({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosMintV1Beta1.tx.sendQueryAnnualProvisionsResponse({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryAnnualProvisionsResponse:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QueryAnnualProvisionsResponse:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendMsgUpdateParams({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosMintV1Beta1.tx.sendMsgUpdateParams({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgUpdateParams:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:MsgUpdateParams:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendMsgUpdateParamsResponse({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosMintV1Beta1.tx.sendMsgUpdateParamsResponse({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgUpdateParamsResponse:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:MsgUpdateParamsResponse:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendQueryInflationRequest({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosMintV1Beta1.tx.sendQueryInflationRequest({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryInflationRequest:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QueryInflationRequest:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendQueryAnnualProvisionsRequest({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosMintV1Beta1.tx.sendQueryAnnualProvisionsRequest({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryAnnualProvisionsRequest:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QueryAnnualProvisionsRequest:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendParams({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosMintV1Beta1.tx.sendParams({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:Params:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:Params:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendGenesisState({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosMintV1Beta1.tx.sendGenesisState({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:GenesisState:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:GenesisState:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendQueryParamsRequest({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosMintV1Beta1.tx.sendQueryParamsRequest({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryParamsRequest:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QueryParamsRequest:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendQueryInflationResponse({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosMintV1Beta1.tx.sendQueryInflationResponse({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryInflationResponse:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QueryInflationResponse:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendMinter({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosMintV1Beta1.tx.sendMinter({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:Minter:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:Minter:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		
		async QueryParamsResponse({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosMintV1Beta1.tx.queryParamsResponse({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryParamsResponse:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QueryParamsResponse:Create Could not create message: ' + e.message)
				}
			}
		},
		async QueryAnnualProvisionsResponse({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosMintV1Beta1.tx.queryAnnualProvisionsResponse({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryAnnualProvisionsResponse:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QueryAnnualProvisionsResponse:Create Could not create message: ' + e.message)
				}
			}
		},
		async MsgUpdateParams({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosMintV1Beta1.tx.msgUpdateParams({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgUpdateParams:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:MsgUpdateParams:Create Could not create message: ' + e.message)
				}
			}
		},
		async MsgUpdateParamsResponse({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosMintV1Beta1.tx.msgUpdateParamsResponse({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgUpdateParamsResponse:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:MsgUpdateParamsResponse:Create Could not create message: ' + e.message)
				}
			}
		},
		async QueryInflationRequest({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosMintV1Beta1.tx.queryInflationRequest({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryInflationRequest:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QueryInflationRequest:Create Could not create message: ' + e.message)
				}
			}
		},
		async QueryAnnualProvisionsRequest({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosMintV1Beta1.tx.queryAnnualProvisionsRequest({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryAnnualProvisionsRequest:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QueryAnnualProvisionsRequest:Create Could not create message: ' + e.message)
				}
			}
		},
		async Params({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosMintV1Beta1.tx.params({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:Params:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:Params:Create Could not create message: ' + e.message)
				}
			}
		},
		async GenesisState({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosMintV1Beta1.tx.genesisState({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:GenesisState:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:GenesisState:Create Could not create message: ' + e.message)
				}
			}
		},
		async QueryParamsRequest({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosMintV1Beta1.tx.queryParamsRequest({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryParamsRequest:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QueryParamsRequest:Create Could not create message: ' + e.message)
				}
			}
		},
		async QueryInflationResponse({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosMintV1Beta1.tx.queryInflationResponse({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryInflationResponse:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QueryInflationResponse:Create Could not create message: ' + e.message)
				}
			}
		},
		async Minter({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosMintV1Beta1.tx.minter({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:Minter:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:Minter:Create Could not create message: ' + e.message)
				}
			}
		},
		
	}
}