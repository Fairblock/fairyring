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
				Commitments: {},
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
				VerifiableRandomness: {},
				
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
				getCommitments: (state) => (params = { params: {}}) => {
					if (!(<any> params).query) {
						(<any> params).query=null
					}
			return state.Commitments[JSON.stringify(params)] ?? {}
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
				getVerifiableRandomness: (state) => (params = { params: {}}) => {
					if (!(<any> params).query) {
						(<any> params).query=null
					}
			return state.VerifiableRandomness[JSON.stringify(params)] ?? {}
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
		
		
		
		
		 		
		
		
		async QueryVerifiableRandomness({ commit, rootGetters, getters }, { options: { subscribe, all} = { subscribe:false, all:false}, params, query=null }) {
			try {
				const key = params ?? {};
				const client = initClient(rootGetters);
				let value= (await client.FairyringKeyshare.query.queryVerifiableRandomness()).data
				
					
				commit('QUERY', { query: 'VerifiableRandomness', key: { params: {...key}, query}, value })
				if (subscribe) commit('SUBSCRIBE', { action: 'QueryVerifiableRandomness', payload: { options: { all }, params: {...key},query }})
				return getters['getVerifiableRandomness']( { params: {...key}, query}) ?? {}
			} catch (e) {
				throw new Error('QueryClient:QueryVerifiableRandomness API Node Unavailable. Could not perform query: ' + e.message)
				
			}
		},
		
		
		async sendQueryParamsResponse({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.FairyringKeyshare.tx.sendQueryParamsResponse({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryParamsResponse:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QueryParamsResponse:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendQueryAllValidatorSetResponse({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.FairyringKeyshare.tx.sendQueryAllValidatorSetResponse({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryAllValidatorSetResponse:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QueryAllValidatorSetResponse:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendQueryAllGeneralKeyShareRequest({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.FairyringKeyshare.tx.sendQueryAllGeneralKeyShareRequest({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryAllGeneralKeyShareRequest:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QueryAllGeneralKeyShareRequest:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendCurrentKeysPacketData({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.FairyringKeyshare.tx.sendCurrentKeysPacketData({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:CurrentKeysPacketData:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:CurrentKeysPacketData:Send Could not broadcast Tx: '+ e.message)
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
		async sendKeyShare({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.FairyringKeyshare.tx.sendKeyShare({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:KeyShare:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:KeyShare:Send Could not broadcast Tx: '+ e.message)
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
		async sendQueryGetAggregatedKeyShareRequest({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.FairyringKeyshare.tx.sendQueryGetAggregatedKeyShareRequest({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryGetAggregatedKeyShareRequest:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QueryGetAggregatedKeyShareRequest:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendQueryAllAggregatedKeyShareRequest({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.FairyringKeyshare.tx.sendQueryAllAggregatedKeyShareRequest({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryAllAggregatedKeyShareRequest:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QueryAllAggregatedKeyShareRequest:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendGenesisState({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.FairyringKeyshare.tx.sendGenesisState({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:GenesisState:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:GenesisState:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendMsgCreateLatestPubKeyResponse({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.FairyringKeyshare.tx.sendMsgCreateLatestPubKeyResponse({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgCreateLatestPubKeyResponse:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:MsgCreateLatestPubKeyResponse:Send Could not broadcast Tx: '+ e.message)
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
		async sendCounterPartyIBCInfo({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.FairyringKeyshare.tx.sendCounterPartyIBCInfo({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:CounterPartyIBCInfo:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:CounterPartyIBCInfo:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendValidatorEncryptedKeyShare({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.FairyringKeyshare.tx.sendValidatorEncryptedKeyShare({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:ValidatorEncryptedKeyShare:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:ValidatorEncryptedKeyShare:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendGetPrivateKeysharePacketAck({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.FairyringKeyshare.tx.sendGetPrivateKeysharePacketAck({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:GetPrivateKeysharePacketAck:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:GetPrivateKeysharePacketAck:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendGeneralKeyShare({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.FairyringKeyshare.tx.sendGeneralKeyShare({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:GeneralKeyShare:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:GeneralKeyShare:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendQueryAllKeyShareResponse({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.FairyringKeyshare.tx.sendQueryAllKeyShareResponse({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryAllKeyShareResponse:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QueryAllKeyShareResponse:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendGetAggrKeysharePacketAck({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.FairyringKeyshare.tx.sendGetAggrKeysharePacketAck({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:GetAggrKeysharePacketAck:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:GetAggrKeysharePacketAck:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendQueryGetValidatorSetRequest({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.FairyringKeyshare.tx.sendQueryGetValidatorSetRequest({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryGetValidatorSetRequest:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QueryGetValidatorSetRequest:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendValidatorSet({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.FairyringKeyshare.tx.sendValidatorSet({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:ValidatorSet:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:ValidatorSet:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendQueryVerifiableRandomnessResponse({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.FairyringKeyshare.tx.sendQueryVerifiableRandomnessResponse({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryVerifiableRandomnessResponse:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QueryVerifiableRandomnessResponse:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendQueryGetValidatorSetResponse({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.FairyringKeyshare.tx.sendQueryGetValidatorSetResponse({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryGetValidatorSetResponse:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QueryGetValidatorSetResponse:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendRequestAggrKeysharePacketData({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.FairyringKeyshare.tx.sendRequestAggrKeysharePacketData({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:RequestAggrKeysharePacketData:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:RequestAggrKeysharePacketData:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendIBCInfo({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.FairyringKeyshare.tx.sendIBCInfo({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:IBCInfo:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:IBCInfo:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendQueryGetAuthorizedAddressResponse({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.FairyringKeyshare.tx.sendQueryGetAuthorizedAddressResponse({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryGetAuthorizedAddressResponse:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QueryGetAuthorizedAddressResponse:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendRequestPrivateKeysharePacketData({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.FairyringKeyshare.tx.sendRequestPrivateKeysharePacketData({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:RequestPrivateKeysharePacketData:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:RequestPrivateKeysharePacketData:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendMsgUpdateParams({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.FairyringKeyshare.tx.sendMsgUpdateParams({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgUpdateParams:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:MsgUpdateParams:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendMsgUpdateAuthorizedAddressResponse({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.FairyringKeyshare.tx.sendMsgUpdateAuthorizedAddressResponse({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgUpdateAuthorizedAddressResponse:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:MsgUpdateAuthorizedAddressResponse:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendParams({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.FairyringKeyshare.tx.sendParams({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:Params:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:Params:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendQueryAllValidatorSetRequest({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.FairyringKeyshare.tx.sendQueryAllValidatorSetRequest({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryAllValidatorSetRequest:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QueryAllValidatorSetRequest:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendQueryGetGeneralKeyShareRequest({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.FairyringKeyshare.tx.sendQueryGetGeneralKeyShareRequest({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryGetGeneralKeyShareRequest:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QueryGetGeneralKeyShareRequest:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendMsgCreateGeneralKeyShareResponse({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.FairyringKeyshare.tx.sendMsgCreateGeneralKeyShareResponse({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgCreateGeneralKeyShareResponse:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:MsgCreateGeneralKeyShareResponse:Send Could not broadcast Tx: '+ e.message)
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
		async sendPrivateKeyshareRequest({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.FairyringKeyshare.tx.sendPrivateKeyshareRequest({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:PrivateKeyshareRequest:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:PrivateKeyshareRequest:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendQueryVerifiableRandomnessQuery({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.FairyringKeyshare.tx.sendQueryVerifiableRandomnessQuery({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryVerifiableRandomnessQuery:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QueryVerifiableRandomnessQuery:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendQueryAllAggregatedKeyShareResponse({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.FairyringKeyshare.tx.sendQueryAllAggregatedKeyShareResponse({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryAllAggregatedKeyShareResponse:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QueryAllAggregatedKeyShareResponse:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendQueryGetGeneralKeyShareResponse({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.FairyringKeyshare.tx.sendQueryGetGeneralKeyShareResponse({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryGetGeneralKeyShareResponse:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QueryGetGeneralKeyShareResponse:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendEncryptedKeysharesPacketData({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.FairyringKeyshare.tx.sendEncryptedKeysharesPacketData({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:EncryptedKeysharesPacketData:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:EncryptedKeysharesPacketData:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendMsgSendKeyshareResponse({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.FairyringKeyshare.tx.sendMsgSendKeyshareResponse({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgSendKeyshareResponse:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:MsgSendKeyshareResponse:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendMsgDeleteAuthorizedAddressResponse({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.FairyringKeyshare.tx.sendMsgDeleteAuthorizedAddressResponse({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgDeleteAuthorizedAddressResponse:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:MsgDeleteAuthorizedAddressResponse:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendKeyShareRequest({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.FairyringKeyshare.tx.sendKeyShareRequest({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:KeyShareRequest:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:KeyShareRequest:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendMsgRegisterValidatorResponse({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.FairyringKeyshare.tx.sendMsgRegisterValidatorResponse({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgRegisterValidatorResponse:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:MsgRegisterValidatorResponse:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendEncryptedKeyShare({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.FairyringKeyshare.tx.sendEncryptedKeyShare({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:EncryptedKeyShare:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:EncryptedKeyShare:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendActivePubKey({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.FairyringKeyshare.tx.sendActivePubKey({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:ActivePubKey:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:ActivePubKey:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendQueryAllKeyShareRequest({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.FairyringKeyshare.tx.sendQueryAllKeyShareRequest({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryAllKeyShareRequest:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QueryAllKeyShareRequest:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendQueryAllAuthorizedAddressResponse({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.FairyringKeyshare.tx.sendQueryAllAuthorizedAddressResponse({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryAllAuthorizedAddressResponse:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QueryAllAuthorizedAddressResponse:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendCommitments({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.FairyringKeyshare.tx.sendCommitments({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:Commitments:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:Commitments:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendQueryParamsRequest({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.FairyringKeyshare.tx.sendQueryParamsRequest({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryParamsRequest:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QueryParamsRequest:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendQueryGetAggregatedKeyShareResponse({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.FairyringKeyshare.tx.sendQueryGetAggregatedKeyShareResponse({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryGetAggregatedKeyShareResponse:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QueryGetAggregatedKeyShareResponse:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendMsgSubmitEncryptedKeyshareResponse({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.FairyringKeyshare.tx.sendMsgSubmitEncryptedKeyshareResponse({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgSubmitEncryptedKeyshareResponse:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:MsgSubmitEncryptedKeyshareResponse:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendCurrentKeysPacketAck({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.FairyringKeyshare.tx.sendCurrentKeysPacketAck({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:CurrentKeysPacketAck:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:CurrentKeysPacketAck:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendQueuedPubKey({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.FairyringKeyshare.tx.sendQueuedPubKey({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueuedPubKey:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QueuedPubKey:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendQueryAllGeneralKeyShareResponse({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.FairyringKeyshare.tx.sendQueryAllGeneralKeyShareResponse({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryAllGeneralKeyShareResponse:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QueryAllGeneralKeyShareResponse:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendAggrKeyshareDataPacketData({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.FairyringKeyshare.tx.sendAggrKeyshareDataPacketData({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:AggrKeyshareDataPacketData:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:AggrKeyshareDataPacketData:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendAggrKeyshareDataPacketAck({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.FairyringKeyshare.tx.sendAggrKeyshareDataPacketAck({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:AggrKeyshareDataPacketAck:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:AggrKeyshareDataPacketAck:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendQueryAllAuthorizedAddressRequest({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.FairyringKeyshare.tx.sendQueryAllAuthorizedAddressRequest({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryAllAuthorizedAddressRequest:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QueryAllAuthorizedAddressRequest:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendQueryPubKeyResponse({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.FairyringKeyshare.tx.sendQueryPubKeyResponse({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryPubKeyResponse:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QueryPubKeyResponse:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendMsgDeRegisterValidatorResponse({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.FairyringKeyshare.tx.sendMsgDeRegisterValidatorResponse({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgDeRegisterValidatorResponse:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:MsgDeRegisterValidatorResponse:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendGetPrivateKeysharePacketData({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.FairyringKeyshare.tx.sendGetPrivateKeysharePacketData({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:GetPrivateKeysharePacketData:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:GetPrivateKeysharePacketData:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendKeysharePacketData({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.FairyringKeyshare.tx.sendKeysharePacketData({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:KeysharePacketData:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:KeysharePacketData:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendNoData({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.FairyringKeyshare.tx.sendNoData({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:NoData:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:NoData:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendQueryPubKeyRequest({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.FairyringKeyshare.tx.sendQueryPubKeyRequest({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryPubKeyRequest:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QueryPubKeyRequest:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendAuthorizedAddress({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.FairyringKeyshare.tx.sendAuthorizedAddress({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:AuthorizedAddress:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:AuthorizedAddress:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendMsgOverrideLatestPubKey({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.FairyringKeyshare.tx.sendMsgOverrideLatestPubKey({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgOverrideLatestPubKey:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:MsgOverrideLatestPubKey:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendMsgOverrideLatestPubKeyResponse({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.FairyringKeyshare.tx.sendMsgOverrideLatestPubKeyResponse({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgOverrideLatestPubKeyResponse:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:MsgOverrideLatestPubKeyResponse:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendAggregatedKeyShare({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.FairyringKeyshare.tx.sendAggregatedKeyShare({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:AggregatedKeyShare:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:AggregatedKeyShare:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendQueryGetKeyShareRequest({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.FairyringKeyshare.tx.sendQueryGetKeyShareRequest({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryGetKeyShareRequest:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QueryGetKeyShareRequest:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendMsgSubmitEncryptedKeyshare({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.FairyringKeyshare.tx.sendMsgSubmitEncryptedKeyshare({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgSubmitEncryptedKeyshare:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:MsgSubmitEncryptedKeyshare:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendQueryGetKeyShareResponse({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.FairyringKeyshare.tx.sendQueryGetKeyShareResponse({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryGetKeyShareResponse:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QueryGetKeyShareResponse:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendQueryGetAuthorizedAddressRequest({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.FairyringKeyshare.tx.sendQueryGetAuthorizedAddressRequest({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryGetAuthorizedAddressRequest:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QueryGetAuthorizedAddressRequest:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendMsgUpdateParamsResponse({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.FairyringKeyshare.tx.sendMsgUpdateParamsResponse({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgUpdateParamsResponse:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:MsgUpdateParamsResponse:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendGetAggrKeysharePacketData({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.FairyringKeyshare.tx.sendGetAggrKeysharePacketData({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:GetAggrKeysharePacketData:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:GetAggrKeysharePacketData:Send Could not broadcast Tx: '+ e.message)
				}
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
		async sendQueryCommitmentsRequest({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.FairyringKeyshare.tx.sendQueryCommitmentsRequest({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryCommitmentsRequest:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QueryCommitmentsRequest:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendQueryCommitmentsResponse({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.FairyringKeyshare.tx.sendQueryCommitmentsResponse({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryCommitmentsResponse:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QueryCommitmentsResponse:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendRequestPrivateKeysharePacketAck({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.FairyringKeyshare.tx.sendRequestPrivateKeysharePacketAck({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:RequestPrivateKeysharePacketAck:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:RequestPrivateKeysharePacketAck:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendRequestAggrKeysharePacketAck({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.FairyringKeyshare.tx.sendRequestAggrKeysharePacketAck({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:RequestAggrKeysharePacketAck:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:RequestAggrKeysharePacketAck:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendEncryptedKeysharesPacketAck({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.FairyringKeyshare.tx.sendEncryptedKeysharesPacketAck({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:EncryptedKeysharesPacketAck:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:EncryptedKeysharesPacketAck:Send Could not broadcast Tx: '+ e.message)
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
		async sendMsgCreateAuthorizedAddressResponse({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.FairyringKeyshare.tx.sendMsgCreateAuthorizedAddressResponse({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgCreateAuthorizedAddressResponse:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:MsgCreateAuthorizedAddressResponse:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendMsgDeRegisterValidator({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.FairyringKeyshare.tx.sendMsgDeRegisterValidator({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgDeRegisterValidator:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:MsgDeRegisterValidator:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		
		async QueryParamsResponse({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.FairyringKeyshare.tx.queryParamsResponse({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryParamsResponse:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QueryParamsResponse:Create Could not create message: ' + e.message)
				}
			}
		},
		async QueryAllValidatorSetResponse({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.FairyringKeyshare.tx.queryAllValidatorSetResponse({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryAllValidatorSetResponse:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QueryAllValidatorSetResponse:Create Could not create message: ' + e.message)
				}
			}
		},
		async QueryAllGeneralKeyShareRequest({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.FairyringKeyshare.tx.queryAllGeneralKeyShareRequest({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryAllGeneralKeyShareRequest:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QueryAllGeneralKeyShareRequest:Create Could not create message: ' + e.message)
				}
			}
		},
		async CurrentKeysPacketData({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.FairyringKeyshare.tx.currentKeysPacketData({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:CurrentKeysPacketData:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:CurrentKeysPacketData:Create Could not create message: ' + e.message)
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
		async KeyShare({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.FairyringKeyshare.tx.keyShare({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:KeyShare:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:KeyShare:Create Could not create message: ' + e.message)
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
		async QueryGetAggregatedKeyShareRequest({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.FairyringKeyshare.tx.queryGetAggregatedKeyShareRequest({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryGetAggregatedKeyShareRequest:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QueryGetAggregatedKeyShareRequest:Create Could not create message: ' + e.message)
				}
			}
		},
		async QueryAllAggregatedKeyShareRequest({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.FairyringKeyshare.tx.queryAllAggregatedKeyShareRequest({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryAllAggregatedKeyShareRequest:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QueryAllAggregatedKeyShareRequest:Create Could not create message: ' + e.message)
				}
			}
		},
		async GenesisState({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.FairyringKeyshare.tx.genesisState({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:GenesisState:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:GenesisState:Create Could not create message: ' + e.message)
				}
			}
		},
		async MsgCreateLatestPubKeyResponse({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.FairyringKeyshare.tx.msgCreateLatestPubKeyResponse({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgCreateLatestPubKeyResponse:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:MsgCreateLatestPubKeyResponse:Create Could not create message: ' + e.message)
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
		async CounterPartyIBCInfo({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.FairyringKeyshare.tx.counterPartyIbcinfo({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:CounterPartyIBCInfo:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:CounterPartyIBCInfo:Create Could not create message: ' + e.message)
				}
			}
		},
		async ValidatorEncryptedKeyShare({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.FairyringKeyshare.tx.validatorEncryptedKeyShare({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:ValidatorEncryptedKeyShare:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:ValidatorEncryptedKeyShare:Create Could not create message: ' + e.message)
				}
			}
		},
		async GetPrivateKeysharePacketAck({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.FairyringKeyshare.tx.getPrivateKeysharePacketAck({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:GetPrivateKeysharePacketAck:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:GetPrivateKeysharePacketAck:Create Could not create message: ' + e.message)
				}
			}
		},
		async GeneralKeyShare({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.FairyringKeyshare.tx.generalKeyShare({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:GeneralKeyShare:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:GeneralKeyShare:Create Could not create message: ' + e.message)
				}
			}
		},
		async QueryAllKeyShareResponse({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.FairyringKeyshare.tx.queryAllKeyShareResponse({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryAllKeyShareResponse:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QueryAllKeyShareResponse:Create Could not create message: ' + e.message)
				}
			}
		},
		async GetAggrKeysharePacketAck({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.FairyringKeyshare.tx.getAggrKeysharePacketAck({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:GetAggrKeysharePacketAck:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:GetAggrKeysharePacketAck:Create Could not create message: ' + e.message)
				}
			}
		},
		async QueryGetValidatorSetRequest({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.FairyringKeyshare.tx.queryGetValidatorSetRequest({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryGetValidatorSetRequest:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QueryGetValidatorSetRequest:Create Could not create message: ' + e.message)
				}
			}
		},
		async ValidatorSet({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.FairyringKeyshare.tx.validatorSet({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:ValidatorSet:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:ValidatorSet:Create Could not create message: ' + e.message)
				}
			}
		},
		async QueryVerifiableRandomnessResponse({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.FairyringKeyshare.tx.queryVerifiableRandomnessResponse({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryVerifiableRandomnessResponse:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QueryVerifiableRandomnessResponse:Create Could not create message: ' + e.message)
				}
			}
		},
		async QueryGetValidatorSetResponse({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.FairyringKeyshare.tx.queryGetValidatorSetResponse({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryGetValidatorSetResponse:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QueryGetValidatorSetResponse:Create Could not create message: ' + e.message)
				}
			}
		},
		async RequestAggrKeysharePacketData({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.FairyringKeyshare.tx.requestAggrKeysharePacketData({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:RequestAggrKeysharePacketData:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:RequestAggrKeysharePacketData:Create Could not create message: ' + e.message)
				}
			}
		},
		async IBCInfo({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.FairyringKeyshare.tx.ibcinfo({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:IBCInfo:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:IBCInfo:Create Could not create message: ' + e.message)
				}
			}
		},
		async QueryGetAuthorizedAddressResponse({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.FairyringKeyshare.tx.queryGetAuthorizedAddressResponse({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryGetAuthorizedAddressResponse:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QueryGetAuthorizedAddressResponse:Create Could not create message: ' + e.message)
				}
			}
		},
		async RequestPrivateKeysharePacketData({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.FairyringKeyshare.tx.requestPrivateKeysharePacketData({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:RequestPrivateKeysharePacketData:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:RequestPrivateKeysharePacketData:Create Could not create message: ' + e.message)
				}
			}
		},
		async MsgUpdateParams({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.FairyringKeyshare.tx.msgUpdateParams({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgUpdateParams:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:MsgUpdateParams:Create Could not create message: ' + e.message)
				}
			}
		},
		async MsgUpdateAuthorizedAddressResponse({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.FairyringKeyshare.tx.msgUpdateAuthorizedAddressResponse({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgUpdateAuthorizedAddressResponse:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:MsgUpdateAuthorizedAddressResponse:Create Could not create message: ' + e.message)
				}
			}
		},
		async Params({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.FairyringKeyshare.tx.params({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:Params:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:Params:Create Could not create message: ' + e.message)
				}
			}
		},
		async QueryAllValidatorSetRequest({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.FairyringKeyshare.tx.queryAllValidatorSetRequest({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryAllValidatorSetRequest:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QueryAllValidatorSetRequest:Create Could not create message: ' + e.message)
				}
			}
		},
		async QueryGetGeneralKeyShareRequest({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.FairyringKeyshare.tx.queryGetGeneralKeyShareRequest({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryGetGeneralKeyShareRequest:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QueryGetGeneralKeyShareRequest:Create Could not create message: ' + e.message)
				}
			}
		},
		async MsgCreateGeneralKeyShareResponse({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.FairyringKeyshare.tx.msgCreateGeneralKeyShareResponse({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgCreateGeneralKeyShareResponse:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:MsgCreateGeneralKeyShareResponse:Create Could not create message: ' + e.message)
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
		async PrivateKeyshareRequest({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.FairyringKeyshare.tx.privateKeyshareRequest({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:PrivateKeyshareRequest:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:PrivateKeyshareRequest:Create Could not create message: ' + e.message)
				}
			}
		},
		async QueryVerifiableRandomnessQuery({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.FairyringKeyshare.tx.queryVerifiableRandomnessQuery({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryVerifiableRandomnessQuery:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QueryVerifiableRandomnessQuery:Create Could not create message: ' + e.message)
				}
			}
		},
		async QueryAllAggregatedKeyShareResponse({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.FairyringKeyshare.tx.queryAllAggregatedKeyShareResponse({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryAllAggregatedKeyShareResponse:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QueryAllAggregatedKeyShareResponse:Create Could not create message: ' + e.message)
				}
			}
		},
		async QueryGetGeneralKeyShareResponse({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.FairyringKeyshare.tx.queryGetGeneralKeyShareResponse({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryGetGeneralKeyShareResponse:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QueryGetGeneralKeyShareResponse:Create Could not create message: ' + e.message)
				}
			}
		},
		async EncryptedKeysharesPacketData({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.FairyringKeyshare.tx.encryptedKeysharesPacketData({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:EncryptedKeysharesPacketData:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:EncryptedKeysharesPacketData:Create Could not create message: ' + e.message)
				}
			}
		},
		async MsgSendKeyshareResponse({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.FairyringKeyshare.tx.msgSendKeyshareResponse({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgSendKeyshareResponse:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:MsgSendKeyshareResponse:Create Could not create message: ' + e.message)
				}
			}
		},
		async MsgDeleteAuthorizedAddressResponse({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.FairyringKeyshare.tx.msgDeleteAuthorizedAddressResponse({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgDeleteAuthorizedAddressResponse:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:MsgDeleteAuthorizedAddressResponse:Create Could not create message: ' + e.message)
				}
			}
		},
		async KeyShareRequest({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.FairyringKeyshare.tx.keyShareRequest({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:KeyShareRequest:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:KeyShareRequest:Create Could not create message: ' + e.message)
				}
			}
		},
		async MsgRegisterValidatorResponse({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.FairyringKeyshare.tx.msgRegisterValidatorResponse({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgRegisterValidatorResponse:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:MsgRegisterValidatorResponse:Create Could not create message: ' + e.message)
				}
			}
		},
		async EncryptedKeyShare({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.FairyringKeyshare.tx.encryptedKeyShare({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:EncryptedKeyShare:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:EncryptedKeyShare:Create Could not create message: ' + e.message)
				}
			}
		},
		async ActivePubKey({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.FairyringKeyshare.tx.activePubKey({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:ActivePubKey:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:ActivePubKey:Create Could not create message: ' + e.message)
				}
			}
		},
		async QueryAllKeyShareRequest({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.FairyringKeyshare.tx.queryAllKeyShareRequest({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryAllKeyShareRequest:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QueryAllKeyShareRequest:Create Could not create message: ' + e.message)
				}
			}
		},
		async QueryAllAuthorizedAddressResponse({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.FairyringKeyshare.tx.queryAllAuthorizedAddressResponse({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryAllAuthorizedAddressResponse:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QueryAllAuthorizedAddressResponse:Create Could not create message: ' + e.message)
				}
			}
		},
		async Commitments({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.FairyringKeyshare.tx.commitments({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:Commitments:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:Commitments:Create Could not create message: ' + e.message)
				}
			}
		},
		async QueryParamsRequest({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.FairyringKeyshare.tx.queryParamsRequest({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryParamsRequest:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QueryParamsRequest:Create Could not create message: ' + e.message)
				}
			}
		},
		async QueryGetAggregatedKeyShareResponse({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.FairyringKeyshare.tx.queryGetAggregatedKeyShareResponse({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryGetAggregatedKeyShareResponse:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QueryGetAggregatedKeyShareResponse:Create Could not create message: ' + e.message)
				}
			}
		},
		async MsgSubmitEncryptedKeyshareResponse({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.FairyringKeyshare.tx.msgSubmitEncryptedKeyshareResponse({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgSubmitEncryptedKeyshareResponse:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:MsgSubmitEncryptedKeyshareResponse:Create Could not create message: ' + e.message)
				}
			}
		},
		async CurrentKeysPacketAck({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.FairyringKeyshare.tx.currentKeysPacketAck({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:CurrentKeysPacketAck:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:CurrentKeysPacketAck:Create Could not create message: ' + e.message)
				}
			}
		},
		async QueuedPubKey({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.FairyringKeyshare.tx.queuedPubKey({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueuedPubKey:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QueuedPubKey:Create Could not create message: ' + e.message)
				}
			}
		},
		async QueryAllGeneralKeyShareResponse({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.FairyringKeyshare.tx.queryAllGeneralKeyShareResponse({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryAllGeneralKeyShareResponse:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QueryAllGeneralKeyShareResponse:Create Could not create message: ' + e.message)
				}
			}
		},
		async AggrKeyshareDataPacketData({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.FairyringKeyshare.tx.aggrKeyshareDataPacketData({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:AggrKeyshareDataPacketData:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:AggrKeyshareDataPacketData:Create Could not create message: ' + e.message)
				}
			}
		},
		async AggrKeyshareDataPacketAck({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.FairyringKeyshare.tx.aggrKeyshareDataPacketAck({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:AggrKeyshareDataPacketAck:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:AggrKeyshareDataPacketAck:Create Could not create message: ' + e.message)
				}
			}
		},
		async QueryAllAuthorizedAddressRequest({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.FairyringKeyshare.tx.queryAllAuthorizedAddressRequest({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryAllAuthorizedAddressRequest:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QueryAllAuthorizedAddressRequest:Create Could not create message: ' + e.message)
				}
			}
		},
		async QueryPubKeyResponse({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.FairyringKeyshare.tx.queryPubKeyResponse({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryPubKeyResponse:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QueryPubKeyResponse:Create Could not create message: ' + e.message)
				}
			}
		},
		async MsgDeRegisterValidatorResponse({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.FairyringKeyshare.tx.msgDeRegisterValidatorResponse({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgDeRegisterValidatorResponse:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:MsgDeRegisterValidatorResponse:Create Could not create message: ' + e.message)
				}
			}
		},
		async GetPrivateKeysharePacketData({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.FairyringKeyshare.tx.getPrivateKeysharePacketData({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:GetPrivateKeysharePacketData:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:GetPrivateKeysharePacketData:Create Could not create message: ' + e.message)
				}
			}
		},
		async KeysharePacketData({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.FairyringKeyshare.tx.keysharePacketData({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:KeysharePacketData:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:KeysharePacketData:Create Could not create message: ' + e.message)
				}
			}
		},
		async NoData({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.FairyringKeyshare.tx.noData({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:NoData:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:NoData:Create Could not create message: ' + e.message)
				}
			}
		},
		async QueryPubKeyRequest({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.FairyringKeyshare.tx.queryPubKeyRequest({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryPubKeyRequest:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QueryPubKeyRequest:Create Could not create message: ' + e.message)
				}
			}
		},
		async AuthorizedAddress({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.FairyringKeyshare.tx.authorizedAddress({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:AuthorizedAddress:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:AuthorizedAddress:Create Could not create message: ' + e.message)
				}
			}
		},
		async MsgOverrideLatestPubKey({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.FairyringKeyshare.tx.msgOverrideLatestPubKey({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgOverrideLatestPubKey:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:MsgOverrideLatestPubKey:Create Could not create message: ' + e.message)
				}
			}
		},
		async MsgOverrideLatestPubKeyResponse({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.FairyringKeyshare.tx.msgOverrideLatestPubKeyResponse({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgOverrideLatestPubKeyResponse:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:MsgOverrideLatestPubKeyResponse:Create Could not create message: ' + e.message)
				}
			}
		},
		async AggregatedKeyShare({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.FairyringKeyshare.tx.aggregatedKeyShare({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:AggregatedKeyShare:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:AggregatedKeyShare:Create Could not create message: ' + e.message)
				}
			}
		},
		async QueryGetKeyShareRequest({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.FairyringKeyshare.tx.queryGetKeyShareRequest({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryGetKeyShareRequest:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QueryGetKeyShareRequest:Create Could not create message: ' + e.message)
				}
			}
		},
		async MsgSubmitEncryptedKeyshare({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.FairyringKeyshare.tx.msgSubmitEncryptedKeyshare({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgSubmitEncryptedKeyshare:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:MsgSubmitEncryptedKeyshare:Create Could not create message: ' + e.message)
				}
			}
		},
		async QueryGetKeyShareResponse({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.FairyringKeyshare.tx.queryGetKeyShareResponse({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryGetKeyShareResponse:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QueryGetKeyShareResponse:Create Could not create message: ' + e.message)
				}
			}
		},
		async QueryGetAuthorizedAddressRequest({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.FairyringKeyshare.tx.queryGetAuthorizedAddressRequest({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryGetAuthorizedAddressRequest:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QueryGetAuthorizedAddressRequest:Create Could not create message: ' + e.message)
				}
			}
		},
		async MsgUpdateParamsResponse({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.FairyringKeyshare.tx.msgUpdateParamsResponse({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgUpdateParamsResponse:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:MsgUpdateParamsResponse:Create Could not create message: ' + e.message)
				}
			}
		},
		async GetAggrKeysharePacketData({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.FairyringKeyshare.tx.getAggrKeysharePacketData({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:GetAggrKeysharePacketData:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:GetAggrKeysharePacketData:Create Could not create message: ' + e.message)
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
		async QueryCommitmentsRequest({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.FairyringKeyshare.tx.queryCommitmentsRequest({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryCommitmentsRequest:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QueryCommitmentsRequest:Create Could not create message: ' + e.message)
				}
			}
		},
		async QueryCommitmentsResponse({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.FairyringKeyshare.tx.queryCommitmentsResponse({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryCommitmentsResponse:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QueryCommitmentsResponse:Create Could not create message: ' + e.message)
				}
			}
		},
		async RequestPrivateKeysharePacketAck({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.FairyringKeyshare.tx.requestPrivateKeysharePacketAck({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:RequestPrivateKeysharePacketAck:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:RequestPrivateKeysharePacketAck:Create Could not create message: ' + e.message)
				}
			}
		},
		async RequestAggrKeysharePacketAck({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.FairyringKeyshare.tx.requestAggrKeysharePacketAck({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:RequestAggrKeysharePacketAck:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:RequestAggrKeysharePacketAck:Create Could not create message: ' + e.message)
				}
			}
		},
		async EncryptedKeysharesPacketAck({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.FairyringKeyshare.tx.encryptedKeysharesPacketAck({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:EncryptedKeysharesPacketAck:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:EncryptedKeysharesPacketAck:Create Could not create message: ' + e.message)
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
		async MsgCreateAuthorizedAddressResponse({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.FairyringKeyshare.tx.msgCreateAuthorizedAddressResponse({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgCreateAuthorizedAddressResponse:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:MsgCreateAuthorizedAddressResponse:Create Could not create message: ' + e.message)
				}
			}
		},
		async MsgDeRegisterValidator({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.FairyringKeyshare.tx.msgDeRegisterValidator({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgDeRegisterValidator:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:MsgDeRegisterValidator:Create Could not create message: ' + e.message)
				}
			}
		},
		
	}
}