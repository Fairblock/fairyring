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
				Balance: {},
				AllBalances: {},
				SpendableBalances: {},
				SpendableBalanceByDenom: {},
				TotalSupply: {},
				SupplyOf: {},
				Params: {},
				DenomMetadata: {},
				DenomMetadataByQueryString: {},
				DenomsMetadata: {},
				DenomOwners: {},
				DenomOwnersByQuery: {},
				SendEnabled: {},
				
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
				getBalance: (state) => (params = { params: {}}) => {
					if (!(<any> params).query) {
						(<any> params).query=null
					}
			return state.Balance[JSON.stringify(params)] ?? {}
		},
				getAllBalances: (state) => (params = { params: {}}) => {
					if (!(<any> params).query) {
						(<any> params).query=null
					}
			return state.AllBalances[JSON.stringify(params)] ?? {}
		},
				getSpendableBalances: (state) => (params = { params: {}}) => {
					if (!(<any> params).query) {
						(<any> params).query=null
					}
			return state.SpendableBalances[JSON.stringify(params)] ?? {}
		},
				getSpendableBalanceByDenom: (state) => (params = { params: {}}) => {
					if (!(<any> params).query) {
						(<any> params).query=null
					}
			return state.SpendableBalanceByDenom[JSON.stringify(params)] ?? {}
		},
				getTotalSupply: (state) => (params = { params: {}}) => {
					if (!(<any> params).query) {
						(<any> params).query=null
					}
			return state.TotalSupply[JSON.stringify(params)] ?? {}
		},
				getSupplyOf: (state) => (params = { params: {}}) => {
					if (!(<any> params).query) {
						(<any> params).query=null
					}
			return state.SupplyOf[JSON.stringify(params)] ?? {}
		},
				getParams: (state) => (params = { params: {}}) => {
					if (!(<any> params).query) {
						(<any> params).query=null
					}
			return state.Params[JSON.stringify(params)] ?? {}
		},
				getDenomMetadata: (state) => (params = { params: {}}) => {
					if (!(<any> params).query) {
						(<any> params).query=null
					}
			return state.DenomMetadata[JSON.stringify(params)] ?? {}
		},
				getDenomMetadataByQueryString: (state) => (params = { params: {}}) => {
					if (!(<any> params).query) {
						(<any> params).query=null
					}
			return state.DenomMetadataByQueryString[JSON.stringify(params)] ?? {}
		},
				getDenomsMetadata: (state) => (params = { params: {}}) => {
					if (!(<any> params).query) {
						(<any> params).query=null
					}
			return state.DenomsMetadata[JSON.stringify(params)] ?? {}
		},
				getDenomOwners: (state) => (params = { params: {}}) => {
					if (!(<any> params).query) {
						(<any> params).query=null
					}
			return state.DenomOwners[JSON.stringify(params)] ?? {}
		},
				getDenomOwnersByQuery: (state) => (params = { params: {}}) => {
					if (!(<any> params).query) {
						(<any> params).query=null
					}
			return state.DenomOwnersByQuery[JSON.stringify(params)] ?? {}
		},
				getSendEnabled: (state) => (params = { params: {}}) => {
					if (!(<any> params).query) {
						(<any> params).query=null
					}
			return state.SendEnabled[JSON.stringify(params)] ?? {}
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
			console.log('Vuex module: cosmos.bank.v1beta1 initialized!')
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
		
		
		
		 		
		
		
		async QueryBalance({ commit, rootGetters, getters }, { options: { subscribe, all} = { subscribe:false, all:false}, params, query=null }) {
			try {
				const key = params ?? {};
				const client = initClient(rootGetters);
				let value= (await client.CosmosBankV1Beta1.query.queryBalance( key.address, query ?? undefined)).data
				
					
				while (all && (<any> value).pagination && (<any> value).pagination.next_key!=null) {
					let next_values=(await client.CosmosBankV1Beta1.query.queryBalance( key.address, {...query ?? {}, 'pagination.key':(<any> value).pagination.next_key} as any)).data
					value = mergeResults(value, next_values);
				}
				commit('QUERY', { query: 'Balance', key: { params: {...key}, query}, value })
				if (subscribe) commit('SUBSCRIBE', { action: 'QueryBalance', payload: { options: { all }, params: {...key},query }})
				return getters['getBalance']( { params: {...key}, query}) ?? {}
			} catch (e) {
				throw new Error('QueryClient:QueryBalance API Node Unavailable. Could not perform query: ' + e.message)
				
			}
		},
		
		
		
		
		 		
		
		
		async QueryAllBalances({ commit, rootGetters, getters }, { options: { subscribe, all} = { subscribe:false, all:false}, params, query=null }) {
			try {
				const key = params ?? {};
				const client = initClient(rootGetters);
				let value= (await client.CosmosBankV1Beta1.query.queryAllBalances( key.address, query ?? undefined)).data
				
					
				while (all && (<any> value).pagination && (<any> value).pagination.next_key!=null) {
					let next_values=(await client.CosmosBankV1Beta1.query.queryAllBalances( key.address, {...query ?? {}, 'pagination.key':(<any> value).pagination.next_key} as any)).data
					value = mergeResults(value, next_values);
				}
				commit('QUERY', { query: 'AllBalances', key: { params: {...key}, query}, value })
				if (subscribe) commit('SUBSCRIBE', { action: 'QueryAllBalances', payload: { options: { all }, params: {...key},query }})
				return getters['getAllBalances']( { params: {...key}, query}) ?? {}
			} catch (e) {
				throw new Error('QueryClient:QueryAllBalances API Node Unavailable. Could not perform query: ' + e.message)
				
			}
		},
		
		
		
		
		 		
		
		
		async QuerySpendableBalances({ commit, rootGetters, getters }, { options: { subscribe, all} = { subscribe:false, all:false}, params, query=null }) {
			try {
				const key = params ?? {};
				const client = initClient(rootGetters);
				let value= (await client.CosmosBankV1Beta1.query.querySpendableBalances( key.address, query ?? undefined)).data
				
					
				while (all && (<any> value).pagination && (<any> value).pagination.next_key!=null) {
					let next_values=(await client.CosmosBankV1Beta1.query.querySpendableBalances( key.address, {...query ?? {}, 'pagination.key':(<any> value).pagination.next_key} as any)).data
					value = mergeResults(value, next_values);
				}
				commit('QUERY', { query: 'SpendableBalances', key: { params: {...key}, query}, value })
				if (subscribe) commit('SUBSCRIBE', { action: 'QuerySpendableBalances', payload: { options: { all }, params: {...key},query }})
				return getters['getSpendableBalances']( { params: {...key}, query}) ?? {}
			} catch (e) {
				throw new Error('QueryClient:QuerySpendableBalances API Node Unavailable. Could not perform query: ' + e.message)
				
			}
		},
		
		
		
		
		 		
		
		
		async QuerySpendableBalanceByDenom({ commit, rootGetters, getters }, { options: { subscribe, all} = { subscribe:false, all:false}, params, query=null }) {
			try {
				const key = params ?? {};
				const client = initClient(rootGetters);
				let value= (await client.CosmosBankV1Beta1.query.querySpendableBalanceByDenom( key.address, query ?? undefined)).data
				
					
				while (all && (<any> value).pagination && (<any> value).pagination.next_key!=null) {
					let next_values=(await client.CosmosBankV1Beta1.query.querySpendableBalanceByDenom( key.address, {...query ?? {}, 'pagination.key':(<any> value).pagination.next_key} as any)).data
					value = mergeResults(value, next_values);
				}
				commit('QUERY', { query: 'SpendableBalanceByDenom', key: { params: {...key}, query}, value })
				if (subscribe) commit('SUBSCRIBE', { action: 'QuerySpendableBalanceByDenom', payload: { options: { all }, params: {...key},query }})
				return getters['getSpendableBalanceByDenom']( { params: {...key}, query}) ?? {}
			} catch (e) {
				throw new Error('QueryClient:QuerySpendableBalanceByDenom API Node Unavailable. Could not perform query: ' + e.message)
				
			}
		},
		
		
		
		
		 		
		
		
		async QueryTotalSupply({ commit, rootGetters, getters }, { options: { subscribe, all} = { subscribe:false, all:false}, params, query=null }) {
			try {
				const key = params ?? {};
				const client = initClient(rootGetters);
				let value= (await client.CosmosBankV1Beta1.query.queryTotalSupply(query ?? undefined)).data
				
					
				while (all && (<any> value).pagination && (<any> value).pagination.next_key!=null) {
					let next_values=(await client.CosmosBankV1Beta1.query.queryTotalSupply({...query ?? {}, 'pagination.key':(<any> value).pagination.next_key} as any)).data
					value = mergeResults(value, next_values);
				}
				commit('QUERY', { query: 'TotalSupply', key: { params: {...key}, query}, value })
				if (subscribe) commit('SUBSCRIBE', { action: 'QueryTotalSupply', payload: { options: { all }, params: {...key},query }})
				return getters['getTotalSupply']( { params: {...key}, query}) ?? {}
			} catch (e) {
				throw new Error('QueryClient:QueryTotalSupply API Node Unavailable. Could not perform query: ' + e.message)
				
			}
		},
		
		
		
		
		 		
		
		
		async QuerySupplyOf({ commit, rootGetters, getters }, { options: { subscribe, all} = { subscribe:false, all:false}, params, query=null }) {
			try {
				const key = params ?? {};
				const client = initClient(rootGetters);
				let value= (await client.CosmosBankV1Beta1.query.querySupplyOf(query ?? undefined)).data
				
					
				while (all && (<any> value).pagination && (<any> value).pagination.next_key!=null) {
					let next_values=(await client.CosmosBankV1Beta1.query.querySupplyOf({...query ?? {}, 'pagination.key':(<any> value).pagination.next_key} as any)).data
					value = mergeResults(value, next_values);
				}
				commit('QUERY', { query: 'SupplyOf', key: { params: {...key}, query}, value })
				if (subscribe) commit('SUBSCRIBE', { action: 'QuerySupplyOf', payload: { options: { all }, params: {...key},query }})
				return getters['getSupplyOf']( { params: {...key}, query}) ?? {}
			} catch (e) {
				throw new Error('QueryClient:QuerySupplyOf API Node Unavailable. Could not perform query: ' + e.message)
				
			}
		},
		
		
		
		
		 		
		
		
		async QueryParams({ commit, rootGetters, getters }, { options: { subscribe, all} = { subscribe:false, all:false}, params, query=null }) {
			try {
				const key = params ?? {};
				const client = initClient(rootGetters);
				let value= (await client.CosmosBankV1Beta1.query.queryParams()).data
				
					
				commit('QUERY', { query: 'Params', key: { params: {...key}, query}, value })
				if (subscribe) commit('SUBSCRIBE', { action: 'QueryParams', payload: { options: { all }, params: {...key},query }})
				return getters['getParams']( { params: {...key}, query}) ?? {}
			} catch (e) {
				throw new Error('QueryClient:QueryParams API Node Unavailable. Could not perform query: ' + e.message)
				
			}
		},
		
		
		
		
		 		
		
		
		async QueryDenomMetadata({ commit, rootGetters, getters }, { options: { subscribe, all} = { subscribe:false, all:false}, params, query=null }) {
			try {
				const key = params ?? {};
				const client = initClient(rootGetters);
				let value= (await client.CosmosBankV1Beta1.query.queryDenomMetadata( key.denom)).data
				
					
				commit('QUERY', { query: 'DenomMetadata', key: { params: {...key}, query}, value })
				if (subscribe) commit('SUBSCRIBE', { action: 'QueryDenomMetadata', payload: { options: { all }, params: {...key},query }})
				return getters['getDenomMetadata']( { params: {...key}, query}) ?? {}
			} catch (e) {
				throw new Error('QueryClient:QueryDenomMetadata API Node Unavailable. Could not perform query: ' + e.message)
				
			}
		},
		
		
		
		
		 		
		
		
		async QueryDenomMetadataByQueryString({ commit, rootGetters, getters }, { options: { subscribe, all} = { subscribe:false, all:false}, params, query=null }) {
			try {
				const key = params ?? {};
				const client = initClient(rootGetters);
				let value= (await client.CosmosBankV1Beta1.query.queryDenomMetadataByQueryString(query ?? undefined)).data
				
					
				while (all && (<any> value).pagination && (<any> value).pagination.next_key!=null) {
					let next_values=(await client.CosmosBankV1Beta1.query.queryDenomMetadataByQueryString({...query ?? {}, 'pagination.key':(<any> value).pagination.next_key} as any)).data
					value = mergeResults(value, next_values);
				}
				commit('QUERY', { query: 'DenomMetadataByQueryString', key: { params: {...key}, query}, value })
				if (subscribe) commit('SUBSCRIBE', { action: 'QueryDenomMetadataByQueryString', payload: { options: { all }, params: {...key},query }})
				return getters['getDenomMetadataByQueryString']( { params: {...key}, query}) ?? {}
			} catch (e) {
				throw new Error('QueryClient:QueryDenomMetadataByQueryString API Node Unavailable. Could not perform query: ' + e.message)
				
			}
		},
		
		
		
		
		 		
		
		
		async QueryDenomsMetadata({ commit, rootGetters, getters }, { options: { subscribe, all} = { subscribe:false, all:false}, params, query=null }) {
			try {
				const key = params ?? {};
				const client = initClient(rootGetters);
				let value= (await client.CosmosBankV1Beta1.query.queryDenomsMetadata(query ?? undefined)).data
				
					
				while (all && (<any> value).pagination && (<any> value).pagination.next_key!=null) {
					let next_values=(await client.CosmosBankV1Beta1.query.queryDenomsMetadata({...query ?? {}, 'pagination.key':(<any> value).pagination.next_key} as any)).data
					value = mergeResults(value, next_values);
				}
				commit('QUERY', { query: 'DenomsMetadata', key: { params: {...key}, query}, value })
				if (subscribe) commit('SUBSCRIBE', { action: 'QueryDenomsMetadata', payload: { options: { all }, params: {...key},query }})
				return getters['getDenomsMetadata']( { params: {...key}, query}) ?? {}
			} catch (e) {
				throw new Error('QueryClient:QueryDenomsMetadata API Node Unavailable. Could not perform query: ' + e.message)
				
			}
		},
		
		
		
		
		 		
		
		
		async QueryDenomOwners({ commit, rootGetters, getters }, { options: { subscribe, all} = { subscribe:false, all:false}, params, query=null }) {
			try {
				const key = params ?? {};
				const client = initClient(rootGetters);
				let value= (await client.CosmosBankV1Beta1.query.queryDenomOwners( key.denom, query ?? undefined)).data
				
					
				while (all && (<any> value).pagination && (<any> value).pagination.next_key!=null) {
					let next_values=(await client.CosmosBankV1Beta1.query.queryDenomOwners( key.denom, {...query ?? {}, 'pagination.key':(<any> value).pagination.next_key} as any)).data
					value = mergeResults(value, next_values);
				}
				commit('QUERY', { query: 'DenomOwners', key: { params: {...key}, query}, value })
				if (subscribe) commit('SUBSCRIBE', { action: 'QueryDenomOwners', payload: { options: { all }, params: {...key},query }})
				return getters['getDenomOwners']( { params: {...key}, query}) ?? {}
			} catch (e) {
				throw new Error('QueryClient:QueryDenomOwners API Node Unavailable. Could not perform query: ' + e.message)
				
			}
		},
		
		
		
		
		 		
		
		
		async QueryDenomOwnersByQuery({ commit, rootGetters, getters }, { options: { subscribe, all} = { subscribe:false, all:false}, params, query=null }) {
			try {
				const key = params ?? {};
				const client = initClient(rootGetters);
				let value= (await client.CosmosBankV1Beta1.query.queryDenomOwnersByQuery(query ?? undefined)).data
				
					
				while (all && (<any> value).pagination && (<any> value).pagination.next_key!=null) {
					let next_values=(await client.CosmosBankV1Beta1.query.queryDenomOwnersByQuery({...query ?? {}, 'pagination.key':(<any> value).pagination.next_key} as any)).data
					value = mergeResults(value, next_values);
				}
				commit('QUERY', { query: 'DenomOwnersByQuery', key: { params: {...key}, query}, value })
				if (subscribe) commit('SUBSCRIBE', { action: 'QueryDenomOwnersByQuery', payload: { options: { all }, params: {...key},query }})
				return getters['getDenomOwnersByQuery']( { params: {...key}, query}) ?? {}
			} catch (e) {
				throw new Error('QueryClient:QueryDenomOwnersByQuery API Node Unavailable. Could not perform query: ' + e.message)
				
			}
		},
		
		
		
		
		 		
		
		
		async QuerySendEnabled({ commit, rootGetters, getters }, { options: { subscribe, all} = { subscribe:false, all:false}, params, query=null }) {
			try {
				const key = params ?? {};
				const client = initClient(rootGetters);
				let value= (await client.CosmosBankV1Beta1.query.querySendEnabled(query ?? undefined)).data
				
					
				while (all && (<any> value).pagination && (<any> value).pagination.next_key!=null) {
					let next_values=(await client.CosmosBankV1Beta1.query.querySendEnabled({...query ?? {}, 'pagination.key':(<any> value).pagination.next_key} as any)).data
					value = mergeResults(value, next_values);
				}
				commit('QUERY', { query: 'SendEnabled', key: { params: {...key}, query}, value })
				if (subscribe) commit('SUBSCRIBE', { action: 'QuerySendEnabled', payload: { options: { all }, params: {...key},query }})
				return getters['getSendEnabled']( { params: {...key}, query}) ?? {}
			} catch (e) {
				throw new Error('QueryClient:QuerySendEnabled API Node Unavailable. Could not perform query: ' + e.message)
				
			}
		},
		
		
		async sendSendEnabled({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosBankV1Beta1.tx.sendSendEnabled({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:SendEnabled:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:SendEnabled:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendQueryDenomMetadataResponse({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosBankV1Beta1.tx.sendQueryDenomMetadataResponse({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryDenomMetadataResponse:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QueryDenomMetadataResponse:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendBalance({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosBankV1Beta1.tx.sendBalance({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:Balance:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:Balance:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendQueryParamsResponse({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosBankV1Beta1.tx.sendQueryParamsResponse({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryParamsResponse:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QueryParamsResponse:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendQueryParamsRequest({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosBankV1Beta1.tx.sendQueryParamsRequest({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryParamsRequest:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QueryParamsRequest:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendQueryDenomsMetadataResponse({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosBankV1Beta1.tx.sendQueryDenomsMetadataResponse({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryDenomsMetadataResponse:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QueryDenomsMetadataResponse:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendQueryBalanceResponse({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosBankV1Beta1.tx.sendQueryBalanceResponse({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryBalanceResponse:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QueryBalanceResponse:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendQuerySupplyOfResponse({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosBankV1Beta1.tx.sendQuerySupplyOfResponse({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QuerySupplyOfResponse:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QuerySupplyOfResponse:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendQueryDenomsMetadataRequest({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosBankV1Beta1.tx.sendQueryDenomsMetadataRequest({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryDenomsMetadataRequest:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QueryDenomsMetadataRequest:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendMetadata({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosBankV1Beta1.tx.sendMetadata({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:Metadata:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:Metadata:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendQueryDenomMetadataByQueryStringResponse({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosBankV1Beta1.tx.sendQueryDenomMetadataByQueryStringResponse({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryDenomMetadataByQueryStringResponse:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QueryDenomMetadataByQueryStringResponse:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendMsgSendResponse({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosBankV1Beta1.tx.sendMsgSendResponse({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgSendResponse:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:MsgSendResponse:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendQuerySpendableBalancesResponse({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosBankV1Beta1.tx.sendQuerySpendableBalancesResponse({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QuerySpendableBalancesResponse:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QuerySpendableBalancesResponse:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendQuerySpendableBalancesRequest({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosBankV1Beta1.tx.sendQuerySpendableBalancesRequest({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QuerySpendableBalancesRequest:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QuerySpendableBalancesRequest:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendQuerySupplyOfRequest({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosBankV1Beta1.tx.sendQuerySupplyOfRequest({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QuerySupplyOfRequest:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QuerySupplyOfRequest:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendQueryDenomMetadataByQueryStringRequest({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosBankV1Beta1.tx.sendQueryDenomMetadataByQueryStringRequest({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryDenomMetadataByQueryStringRequest:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QueryDenomMetadataByQueryStringRequest:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendQuerySendEnabledResponse({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosBankV1Beta1.tx.sendQuerySendEnabledResponse({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QuerySendEnabledResponse:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QuerySendEnabledResponse:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendInput({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosBankV1Beta1.tx.sendInput({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:Input:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:Input:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendSendAuthorization({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosBankV1Beta1.tx.sendSendAuthorization({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:SendAuthorization:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:SendAuthorization:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendMsgMultiSend({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosBankV1Beta1.tx.sendMsgMultiSend({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgMultiSend:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:MsgMultiSend:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendDenomUnit({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosBankV1Beta1.tx.sendDenomUnit({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:DenomUnit:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:DenomUnit:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendQueryDenomOwnersRequest({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosBankV1Beta1.tx.sendQueryDenomOwnersRequest({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryDenomOwnersRequest:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QueryDenomOwnersRequest:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendQueryDenomOwnersByQueryRequest({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosBankV1Beta1.tx.sendQueryDenomOwnersByQueryRequest({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryDenomOwnersByQueryRequest:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QueryDenomOwnersByQueryRequest:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendParams({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosBankV1Beta1.tx.sendParams({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:Params:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:Params:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendQuerySpendableBalanceByDenomResponse({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosBankV1Beta1.tx.sendQuerySpendableBalanceByDenomResponse({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QuerySpendableBalanceByDenomResponse:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QuerySpendableBalanceByDenomResponse:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendQueryAllBalancesResponse({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosBankV1Beta1.tx.sendQueryAllBalancesResponse({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryAllBalancesResponse:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QueryAllBalancesResponse:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendQueryTotalSupplyResponse({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosBankV1Beta1.tx.sendQueryTotalSupplyResponse({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryTotalSupplyResponse:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QueryTotalSupplyResponse:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendQueryDenomOwnersResponse({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosBankV1Beta1.tx.sendQueryDenomOwnersResponse({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryDenomOwnersResponse:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QueryDenomOwnersResponse:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendQueryDenomOwnersByQueryResponse({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosBankV1Beta1.tx.sendQueryDenomOwnersByQueryResponse({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryDenomOwnersByQueryResponse:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QueryDenomOwnersByQueryResponse:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendMsgSetSendEnabledResponse({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosBankV1Beta1.tx.sendMsgSetSendEnabledResponse({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgSetSendEnabledResponse:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:MsgSetSendEnabledResponse:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendGenesisState({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosBankV1Beta1.tx.sendGenesisState({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:GenesisState:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:GenesisState:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendQuerySendEnabledRequest({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosBankV1Beta1.tx.sendQuerySendEnabledRequest({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QuerySendEnabledRequest:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QuerySendEnabledRequest:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendQuerySpendableBalanceByDenomRequest({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosBankV1Beta1.tx.sendQuerySpendableBalanceByDenomRequest({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QuerySpendableBalanceByDenomRequest:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QuerySpendableBalanceByDenomRequest:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendQueryDenomMetadataRequest({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosBankV1Beta1.tx.sendQueryDenomMetadataRequest({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryDenomMetadataRequest:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QueryDenomMetadataRequest:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendDenomOwner({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosBankV1Beta1.tx.sendDenomOwner({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:DenomOwner:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:DenomOwner:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendMsgSend({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosBankV1Beta1.tx.sendMsgSend({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgSend:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:MsgSend:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendMsgMultiSendResponse({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosBankV1Beta1.tx.sendMsgMultiSendResponse({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgMultiSendResponse:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:MsgMultiSendResponse:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendSupply({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosBankV1Beta1.tx.sendSupply({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:Supply:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:Supply:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendMsgUpdateParamsResponse({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosBankV1Beta1.tx.sendMsgUpdateParamsResponse({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgUpdateParamsResponse:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:MsgUpdateParamsResponse:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendQueryTotalSupplyRequest({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosBankV1Beta1.tx.sendQueryTotalSupplyRequest({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryTotalSupplyRequest:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QueryTotalSupplyRequest:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendQueryAllBalancesRequest({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosBankV1Beta1.tx.sendQueryAllBalancesRequest({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryAllBalancesRequest:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QueryAllBalancesRequest:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendMsgUpdateParams({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosBankV1Beta1.tx.sendMsgUpdateParams({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgUpdateParams:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:MsgUpdateParams:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendMsgSetSendEnabled({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosBankV1Beta1.tx.sendMsgSetSendEnabled({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgSetSendEnabled:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:MsgSetSendEnabled:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendOutput({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosBankV1Beta1.tx.sendOutput({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:Output:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:Output:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendQueryBalanceRequest({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosBankV1Beta1.tx.sendQueryBalanceRequest({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryBalanceRequest:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QueryBalanceRequest:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		
		async SendEnabled({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosBankV1Beta1.tx.sendEnabled({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:SendEnabled:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:SendEnabled:Create Could not create message: ' + e.message)
				}
			}
		},
		async QueryDenomMetadataResponse({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosBankV1Beta1.tx.queryDenomMetadataResponse({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryDenomMetadataResponse:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QueryDenomMetadataResponse:Create Could not create message: ' + e.message)
				}
			}
		},
		async Balance({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosBankV1Beta1.tx.balance({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:Balance:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:Balance:Create Could not create message: ' + e.message)
				}
			}
		},
		async QueryParamsResponse({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosBankV1Beta1.tx.queryParamsResponse({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryParamsResponse:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QueryParamsResponse:Create Could not create message: ' + e.message)
				}
			}
		},
		async QueryParamsRequest({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosBankV1Beta1.tx.queryParamsRequest({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryParamsRequest:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QueryParamsRequest:Create Could not create message: ' + e.message)
				}
			}
		},
		async QueryDenomsMetadataResponse({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosBankV1Beta1.tx.queryDenomsMetadataResponse({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryDenomsMetadataResponse:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QueryDenomsMetadataResponse:Create Could not create message: ' + e.message)
				}
			}
		},
		async QueryBalanceResponse({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosBankV1Beta1.tx.queryBalanceResponse({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryBalanceResponse:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QueryBalanceResponse:Create Could not create message: ' + e.message)
				}
			}
		},
		async QuerySupplyOfResponse({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosBankV1Beta1.tx.querySupplyOfResponse({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QuerySupplyOfResponse:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QuerySupplyOfResponse:Create Could not create message: ' + e.message)
				}
			}
		},
		async QueryDenomsMetadataRequest({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosBankV1Beta1.tx.queryDenomsMetadataRequest({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryDenomsMetadataRequest:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QueryDenomsMetadataRequest:Create Could not create message: ' + e.message)
				}
			}
		},
		async Metadata({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosBankV1Beta1.tx.metadata({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:Metadata:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:Metadata:Create Could not create message: ' + e.message)
				}
			}
		},
		async QueryDenomMetadataByQueryStringResponse({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosBankV1Beta1.tx.queryDenomMetadataByQueryStringResponse({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryDenomMetadataByQueryStringResponse:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QueryDenomMetadataByQueryStringResponse:Create Could not create message: ' + e.message)
				}
			}
		},
		async MsgSendResponse({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosBankV1Beta1.tx.msgSendResponse({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgSendResponse:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:MsgSendResponse:Create Could not create message: ' + e.message)
				}
			}
		},
		async QuerySpendableBalancesResponse({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosBankV1Beta1.tx.querySpendableBalancesResponse({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QuerySpendableBalancesResponse:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QuerySpendableBalancesResponse:Create Could not create message: ' + e.message)
				}
			}
		},
		async QuerySpendableBalancesRequest({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosBankV1Beta1.tx.querySpendableBalancesRequest({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QuerySpendableBalancesRequest:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QuerySpendableBalancesRequest:Create Could not create message: ' + e.message)
				}
			}
		},
		async QuerySupplyOfRequest({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosBankV1Beta1.tx.querySupplyOfRequest({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QuerySupplyOfRequest:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QuerySupplyOfRequest:Create Could not create message: ' + e.message)
				}
			}
		},
		async QueryDenomMetadataByQueryStringRequest({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosBankV1Beta1.tx.queryDenomMetadataByQueryStringRequest({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryDenomMetadataByQueryStringRequest:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QueryDenomMetadataByQueryStringRequest:Create Could not create message: ' + e.message)
				}
			}
		},
		async QuerySendEnabledResponse({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosBankV1Beta1.tx.querySendEnabledResponse({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QuerySendEnabledResponse:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QuerySendEnabledResponse:Create Could not create message: ' + e.message)
				}
			}
		},
		async Input({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosBankV1Beta1.tx.input({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:Input:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:Input:Create Could not create message: ' + e.message)
				}
			}
		},
		async SendAuthorization({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosBankV1Beta1.tx.sendAuthorization({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:SendAuthorization:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:SendAuthorization:Create Could not create message: ' + e.message)
				}
			}
		},
		async MsgMultiSend({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosBankV1Beta1.tx.msgMultiSend({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgMultiSend:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:MsgMultiSend:Create Could not create message: ' + e.message)
				}
			}
		},
		async DenomUnit({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosBankV1Beta1.tx.denomUnit({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:DenomUnit:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:DenomUnit:Create Could not create message: ' + e.message)
				}
			}
		},
		async QueryDenomOwnersRequest({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosBankV1Beta1.tx.queryDenomOwnersRequest({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryDenomOwnersRequest:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QueryDenomOwnersRequest:Create Could not create message: ' + e.message)
				}
			}
		},
		async QueryDenomOwnersByQueryRequest({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosBankV1Beta1.tx.queryDenomOwnersByQueryRequest({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryDenomOwnersByQueryRequest:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QueryDenomOwnersByQueryRequest:Create Could not create message: ' + e.message)
				}
			}
		},
		async Params({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosBankV1Beta1.tx.params({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:Params:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:Params:Create Could not create message: ' + e.message)
				}
			}
		},
		async QuerySpendableBalanceByDenomResponse({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosBankV1Beta1.tx.querySpendableBalanceByDenomResponse({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QuerySpendableBalanceByDenomResponse:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QuerySpendableBalanceByDenomResponse:Create Could not create message: ' + e.message)
				}
			}
		},
		async QueryAllBalancesResponse({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosBankV1Beta1.tx.queryAllBalancesResponse({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryAllBalancesResponse:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QueryAllBalancesResponse:Create Could not create message: ' + e.message)
				}
			}
		},
		async QueryTotalSupplyResponse({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosBankV1Beta1.tx.queryTotalSupplyResponse({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryTotalSupplyResponse:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QueryTotalSupplyResponse:Create Could not create message: ' + e.message)
				}
			}
		},
		async QueryDenomOwnersResponse({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosBankV1Beta1.tx.queryDenomOwnersResponse({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryDenomOwnersResponse:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QueryDenomOwnersResponse:Create Could not create message: ' + e.message)
				}
			}
		},
		async QueryDenomOwnersByQueryResponse({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosBankV1Beta1.tx.queryDenomOwnersByQueryResponse({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryDenomOwnersByQueryResponse:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QueryDenomOwnersByQueryResponse:Create Could not create message: ' + e.message)
				}
			}
		},
		async MsgSetSendEnabledResponse({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosBankV1Beta1.tx.msgSetSendEnabledResponse({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgSetSendEnabledResponse:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:MsgSetSendEnabledResponse:Create Could not create message: ' + e.message)
				}
			}
		},
		async GenesisState({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosBankV1Beta1.tx.genesisState({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:GenesisState:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:GenesisState:Create Could not create message: ' + e.message)
				}
			}
		},
		async QuerySendEnabledRequest({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosBankV1Beta1.tx.querySendEnabledRequest({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QuerySendEnabledRequest:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QuerySendEnabledRequest:Create Could not create message: ' + e.message)
				}
			}
		},
		async QuerySpendableBalanceByDenomRequest({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosBankV1Beta1.tx.querySpendableBalanceByDenomRequest({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QuerySpendableBalanceByDenomRequest:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QuerySpendableBalanceByDenomRequest:Create Could not create message: ' + e.message)
				}
			}
		},
		async QueryDenomMetadataRequest({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosBankV1Beta1.tx.queryDenomMetadataRequest({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryDenomMetadataRequest:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QueryDenomMetadataRequest:Create Could not create message: ' + e.message)
				}
			}
		},
		async DenomOwner({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosBankV1Beta1.tx.denomOwner({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:DenomOwner:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:DenomOwner:Create Could not create message: ' + e.message)
				}
			}
		},
		async MsgSend({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosBankV1Beta1.tx.msgSend({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgSend:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:MsgSend:Create Could not create message: ' + e.message)
				}
			}
		},
		async MsgMultiSendResponse({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosBankV1Beta1.tx.msgMultiSendResponse({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgMultiSendResponse:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:MsgMultiSendResponse:Create Could not create message: ' + e.message)
				}
			}
		},
		async Supply({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosBankV1Beta1.tx.supply({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:Supply:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:Supply:Create Could not create message: ' + e.message)
				}
			}
		},
		async MsgUpdateParamsResponse({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosBankV1Beta1.tx.msgUpdateParamsResponse({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgUpdateParamsResponse:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:MsgUpdateParamsResponse:Create Could not create message: ' + e.message)
				}
			}
		},
		async QueryTotalSupplyRequest({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosBankV1Beta1.tx.queryTotalSupplyRequest({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryTotalSupplyRequest:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QueryTotalSupplyRequest:Create Could not create message: ' + e.message)
				}
			}
		},
		async QueryAllBalancesRequest({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosBankV1Beta1.tx.queryAllBalancesRequest({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryAllBalancesRequest:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QueryAllBalancesRequest:Create Could not create message: ' + e.message)
				}
			}
		},
		async MsgUpdateParams({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosBankV1Beta1.tx.msgUpdateParams({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgUpdateParams:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:MsgUpdateParams:Create Could not create message: ' + e.message)
				}
			}
		},
		async MsgSetSendEnabled({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosBankV1Beta1.tx.msgSetSendEnabled({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgSetSendEnabled:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:MsgSetSendEnabled:Create Could not create message: ' + e.message)
				}
			}
		},
		async Output({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosBankV1Beta1.tx.output({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:Output:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:Output:Create Could not create message: ' + e.message)
				}
			}
		},
		async QueryBalanceRequest({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosBankV1Beta1.tx.queryBalanceRequest({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryBalanceRequest:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QueryBalanceRequest:Create Could not create message: ' + e.message)
				}
			}
		},
		
	}
}