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
				GetNodeInfo: {},
				GetSyncing: {},
				GetLatestBlock: {},
				GetBlockByHeight: {},
				GetLatestValidatorSet: {},
				GetValidatorSetByHeight: {},
				ABCIQuery: {},
				
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
				getGetNodeInfo: (state) => (params = { params: {}}) => {
					if (!(<any> params).query) {
						(<any> params).query=null
					}
			return state.GetNodeInfo[JSON.stringify(params)] ?? {}
		},
				getGetSyncing: (state) => (params = { params: {}}) => {
					if (!(<any> params).query) {
						(<any> params).query=null
					}
			return state.GetSyncing[JSON.stringify(params)] ?? {}
		},
				getGetLatestBlock: (state) => (params = { params: {}}) => {
					if (!(<any> params).query) {
						(<any> params).query=null
					}
			return state.GetLatestBlock[JSON.stringify(params)] ?? {}
		},
				getGetBlockByHeight: (state) => (params = { params: {}}) => {
					if (!(<any> params).query) {
						(<any> params).query=null
					}
			return state.GetBlockByHeight[JSON.stringify(params)] ?? {}
		},
				getGetLatestValidatorSet: (state) => (params = { params: {}}) => {
					if (!(<any> params).query) {
						(<any> params).query=null
					}
			return state.GetLatestValidatorSet[JSON.stringify(params)] ?? {}
		},
				getGetValidatorSetByHeight: (state) => (params = { params: {}}) => {
					if (!(<any> params).query) {
						(<any> params).query=null
					}
			return state.GetValidatorSetByHeight[JSON.stringify(params)] ?? {}
		},
				getABCIQuery: (state) => (params = { params: {}}) => {
					if (!(<any> params).query) {
						(<any> params).query=null
					}
			return state.ABCIQuery[JSON.stringify(params)] ?? {}
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
			console.log('Vuex module: cosmos.base.tendermint.v1beta1 initialized!')
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
		
		
		
		 		
		
		
		async ServiceGetNodeInfo({ commit, rootGetters, getters }, { options: { subscribe, all} = { subscribe:false, all:false}, params, query=null }) {
			try {
				const key = params ?? {};
				const client = initClient(rootGetters);
				let value= (await client.CosmosBaseTendermintV1Beta1.query.serviceGetNodeInfo()).data
				
					
				commit('QUERY', { query: 'GetNodeInfo', key: { params: {...key}, query}, value })
				if (subscribe) commit('SUBSCRIBE', { action: 'ServiceGetNodeInfo', payload: { options: { all }, params: {...key},query }})
				return getters['getGetNodeInfo']( { params: {...key}, query}) ?? {}
			} catch (e) {
				throw new Error('QueryClient:ServiceGetNodeInfo API Node Unavailable. Could not perform query: ' + e.message)
				
			}
		},
		
		
		
		
		 		
		
		
		async ServiceGetSyncing({ commit, rootGetters, getters }, { options: { subscribe, all} = { subscribe:false, all:false}, params, query=null }) {
			try {
				const key = params ?? {};
				const client = initClient(rootGetters);
				let value= (await client.CosmosBaseTendermintV1Beta1.query.serviceGetSyncing()).data
				
					
				commit('QUERY', { query: 'GetSyncing', key: { params: {...key}, query}, value })
				if (subscribe) commit('SUBSCRIBE', { action: 'ServiceGetSyncing', payload: { options: { all }, params: {...key},query }})
				return getters['getGetSyncing']( { params: {...key}, query}) ?? {}
			} catch (e) {
				throw new Error('QueryClient:ServiceGetSyncing API Node Unavailable. Could not perform query: ' + e.message)
				
			}
		},
		
		
		
		
		 		
		
		
		async ServiceGetLatestBlock({ commit, rootGetters, getters }, { options: { subscribe, all} = { subscribe:false, all:false}, params, query=null }) {
			try {
				const key = params ?? {};
				const client = initClient(rootGetters);
				let value= (await client.CosmosBaseTendermintV1Beta1.query.serviceGetLatestBlock()).data
				
					
				commit('QUERY', { query: 'GetLatestBlock', key: { params: {...key}, query}, value })
				if (subscribe) commit('SUBSCRIBE', { action: 'ServiceGetLatestBlock', payload: { options: { all }, params: {...key},query }})
				return getters['getGetLatestBlock']( { params: {...key}, query}) ?? {}
			} catch (e) {
				throw new Error('QueryClient:ServiceGetLatestBlock API Node Unavailable. Could not perform query: ' + e.message)
				
			}
		},
		
		
		
		
		 		
		
		
		async ServiceGetBlockByHeight({ commit, rootGetters, getters }, { options: { subscribe, all} = { subscribe:false, all:false}, params, query=null }) {
			try {
				const key = params ?? {};
				const client = initClient(rootGetters);
				let value= (await client.CosmosBaseTendermintV1Beta1.query.serviceGetBlockByHeight( key.height)).data
				
					
				commit('QUERY', { query: 'GetBlockByHeight', key: { params: {...key}, query}, value })
				if (subscribe) commit('SUBSCRIBE', { action: 'ServiceGetBlockByHeight', payload: { options: { all }, params: {...key},query }})
				return getters['getGetBlockByHeight']( { params: {...key}, query}) ?? {}
			} catch (e) {
				throw new Error('QueryClient:ServiceGetBlockByHeight API Node Unavailable. Could not perform query: ' + e.message)
				
			}
		},
		
		
		
		
		 		
		
		
		async ServiceGetLatestValidatorSet({ commit, rootGetters, getters }, { options: { subscribe, all} = { subscribe:false, all:false}, params, query=null }) {
			try {
				const key = params ?? {};
				const client = initClient(rootGetters);
				let value= (await client.CosmosBaseTendermintV1Beta1.query.serviceGetLatestValidatorSet(query ?? undefined)).data
				
					
				while (all && (<any> value).pagination && (<any> value).pagination.next_key!=null) {
					let next_values=(await client.CosmosBaseTendermintV1Beta1.query.serviceGetLatestValidatorSet({...query ?? {}, 'pagination.key':(<any> value).pagination.next_key} as any)).data
					value = mergeResults(value, next_values);
				}
				commit('QUERY', { query: 'GetLatestValidatorSet', key: { params: {...key}, query}, value })
				if (subscribe) commit('SUBSCRIBE', { action: 'ServiceGetLatestValidatorSet', payload: { options: { all }, params: {...key},query }})
				return getters['getGetLatestValidatorSet']( { params: {...key}, query}) ?? {}
			} catch (e) {
				throw new Error('QueryClient:ServiceGetLatestValidatorSet API Node Unavailable. Could not perform query: ' + e.message)
				
			}
		},
		
		
		
		
		 		
		
		
		async ServiceGetValidatorSetByHeight({ commit, rootGetters, getters }, { options: { subscribe, all} = { subscribe:false, all:false}, params, query=null }) {
			try {
				const key = params ?? {};
				const client = initClient(rootGetters);
				let value= (await client.CosmosBaseTendermintV1Beta1.query.serviceGetValidatorSetByHeight( key.height, query ?? undefined)).data
				
					
				while (all && (<any> value).pagination && (<any> value).pagination.next_key!=null) {
					let next_values=(await client.CosmosBaseTendermintV1Beta1.query.serviceGetValidatorSetByHeight( key.height, {...query ?? {}, 'pagination.key':(<any> value).pagination.next_key} as any)).data
					value = mergeResults(value, next_values);
				}
				commit('QUERY', { query: 'GetValidatorSetByHeight', key: { params: {...key}, query}, value })
				if (subscribe) commit('SUBSCRIBE', { action: 'ServiceGetValidatorSetByHeight', payload: { options: { all }, params: {...key},query }})
				return getters['getGetValidatorSetByHeight']( { params: {...key}, query}) ?? {}
			} catch (e) {
				throw new Error('QueryClient:ServiceGetValidatorSetByHeight API Node Unavailable. Could not perform query: ' + e.message)
				
			}
		},
		
		
		
		
		 		
		
		
		async ServiceABCIQuery({ commit, rootGetters, getters }, { options: { subscribe, all} = { subscribe:false, all:false}, params, query=null }) {
			try {
				const key = params ?? {};
				const client = initClient(rootGetters);
				let value= (await client.CosmosBaseTendermintV1Beta1.query.serviceAbciquery(query ?? undefined)).data
				
					
				while (all && (<any> value).pagination && (<any> value).pagination.next_key!=null) {
					let next_values=(await client.CosmosBaseTendermintV1Beta1.query.serviceAbciquery({...query ?? {}, 'pagination.key':(<any> value).pagination.next_key} as any)).data
					value = mergeResults(value, next_values);
				}
				commit('QUERY', { query: 'ABCIQuery', key: { params: {...key}, query}, value })
				if (subscribe) commit('SUBSCRIBE', { action: 'ServiceABCIQuery', payload: { options: { all }, params: {...key},query }})
				return getters['getABCIQuery']( { params: {...key}, query}) ?? {}
			} catch (e) {
				throw new Error('QueryClient:ServiceABCIQuery API Node Unavailable. Could not perform query: ' + e.message)
				
			}
		},
		
		
		async sendProofOp({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosBaseTendermintV1Beta1.tx.sendProofOp({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:ProofOp:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:ProofOp:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendProofOps({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosBaseTendermintV1Beta1.tx.sendProofOps({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:ProofOps:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:ProofOps:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendGetLatestValidatorSetRequest({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosBaseTendermintV1Beta1.tx.sendGetLatestValidatorSetRequest({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:GetLatestValidatorSetRequest:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:GetLatestValidatorSetRequest:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendGetLatestValidatorSetResponse({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosBaseTendermintV1Beta1.tx.sendGetLatestValidatorSetResponse({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:GetLatestValidatorSetResponse:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:GetLatestValidatorSetResponse:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendGetBlockByHeightResponse({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosBaseTendermintV1Beta1.tx.sendGetBlockByHeightResponse({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:GetBlockByHeightResponse:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:GetBlockByHeightResponse:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendGetSyncingResponse({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosBaseTendermintV1Beta1.tx.sendGetSyncingResponse({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:GetSyncingResponse:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:GetSyncingResponse:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendModule({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosBaseTendermintV1Beta1.tx.sendModule({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:Module:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:Module:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendABCIQueryRequest({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosBaseTendermintV1Beta1.tx.sendABCIQueryRequest({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:ABCIQueryRequest:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:ABCIQueryRequest:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendGetLatestBlockResponse({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosBaseTendermintV1Beta1.tx.sendGetLatestBlockResponse({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:GetLatestBlockResponse:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:GetLatestBlockResponse:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendGetNodeInfoResponse({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosBaseTendermintV1Beta1.tx.sendGetNodeInfoResponse({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:GetNodeInfoResponse:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:GetNodeInfoResponse:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendVersionInfo({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosBaseTendermintV1Beta1.tx.sendVersionInfo({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:VersionInfo:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:VersionInfo:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendBlock({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosBaseTendermintV1Beta1.tx.sendBlock({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:Block:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:Block:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendGetValidatorSetByHeightResponse({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosBaseTendermintV1Beta1.tx.sendGetValidatorSetByHeightResponse({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:GetValidatorSetByHeightResponse:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:GetValidatorSetByHeightResponse:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendValidator({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosBaseTendermintV1Beta1.tx.sendValidator({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:Validator:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:Validator:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendGetBlockByHeightRequest({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosBaseTendermintV1Beta1.tx.sendGetBlockByHeightRequest({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:GetBlockByHeightRequest:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:GetBlockByHeightRequest:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendGetSyncingRequest({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosBaseTendermintV1Beta1.tx.sendGetSyncingRequest({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:GetSyncingRequest:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:GetSyncingRequest:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendGetNodeInfoRequest({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosBaseTendermintV1Beta1.tx.sendGetNodeInfoRequest({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:GetNodeInfoRequest:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:GetNodeInfoRequest:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendABCIQueryResponse({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosBaseTendermintV1Beta1.tx.sendABCIQueryResponse({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:ABCIQueryResponse:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:ABCIQueryResponse:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendHeader({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosBaseTendermintV1Beta1.tx.sendHeader({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:Header:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:Header:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendGetValidatorSetByHeightRequest({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosBaseTendermintV1Beta1.tx.sendGetValidatorSetByHeightRequest({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:GetValidatorSetByHeightRequest:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:GetValidatorSetByHeightRequest:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendGetLatestBlockRequest({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosBaseTendermintV1Beta1.tx.sendGetLatestBlockRequest({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:GetLatestBlockRequest:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:GetLatestBlockRequest:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		
		async ProofOp({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosBaseTendermintV1Beta1.tx.proofOp({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:ProofOp:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:ProofOp:Create Could not create message: ' + e.message)
				}
			}
		},
		async ProofOps({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosBaseTendermintV1Beta1.tx.proofOps({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:ProofOps:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:ProofOps:Create Could not create message: ' + e.message)
				}
			}
		},
		async GetLatestValidatorSetRequest({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosBaseTendermintV1Beta1.tx.getLatestValidatorSetRequest({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:GetLatestValidatorSetRequest:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:GetLatestValidatorSetRequest:Create Could not create message: ' + e.message)
				}
			}
		},
		async GetLatestValidatorSetResponse({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosBaseTendermintV1Beta1.tx.getLatestValidatorSetResponse({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:GetLatestValidatorSetResponse:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:GetLatestValidatorSetResponse:Create Could not create message: ' + e.message)
				}
			}
		},
		async GetBlockByHeightResponse({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosBaseTendermintV1Beta1.tx.getBlockByHeightResponse({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:GetBlockByHeightResponse:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:GetBlockByHeightResponse:Create Could not create message: ' + e.message)
				}
			}
		},
		async GetSyncingResponse({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosBaseTendermintV1Beta1.tx.getSyncingResponse({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:GetSyncingResponse:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:GetSyncingResponse:Create Could not create message: ' + e.message)
				}
			}
		},
		async Module({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosBaseTendermintV1Beta1.tx.module({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:Module:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:Module:Create Could not create message: ' + e.message)
				}
			}
		},
		async ABCIQueryRequest({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosBaseTendermintV1Beta1.tx.abciqueryRequest({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:ABCIQueryRequest:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:ABCIQueryRequest:Create Could not create message: ' + e.message)
				}
			}
		},
		async GetLatestBlockResponse({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosBaseTendermintV1Beta1.tx.getLatestBlockResponse({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:GetLatestBlockResponse:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:GetLatestBlockResponse:Create Could not create message: ' + e.message)
				}
			}
		},
		async GetNodeInfoResponse({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosBaseTendermintV1Beta1.tx.getNodeInfoResponse({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:GetNodeInfoResponse:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:GetNodeInfoResponse:Create Could not create message: ' + e.message)
				}
			}
		},
		async VersionInfo({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosBaseTendermintV1Beta1.tx.versionInfo({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:VersionInfo:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:VersionInfo:Create Could not create message: ' + e.message)
				}
			}
		},
		async Block({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosBaseTendermintV1Beta1.tx.block({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:Block:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:Block:Create Could not create message: ' + e.message)
				}
			}
		},
		async GetValidatorSetByHeightResponse({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosBaseTendermintV1Beta1.tx.getValidatorSetByHeightResponse({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:GetValidatorSetByHeightResponse:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:GetValidatorSetByHeightResponse:Create Could not create message: ' + e.message)
				}
			}
		},
		async Validator({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosBaseTendermintV1Beta1.tx.validator({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:Validator:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:Validator:Create Could not create message: ' + e.message)
				}
			}
		},
		async GetBlockByHeightRequest({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosBaseTendermintV1Beta1.tx.getBlockByHeightRequest({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:GetBlockByHeightRequest:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:GetBlockByHeightRequest:Create Could not create message: ' + e.message)
				}
			}
		},
		async GetSyncingRequest({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosBaseTendermintV1Beta1.tx.getSyncingRequest({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:GetSyncingRequest:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:GetSyncingRequest:Create Could not create message: ' + e.message)
				}
			}
		},
		async GetNodeInfoRequest({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosBaseTendermintV1Beta1.tx.getNodeInfoRequest({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:GetNodeInfoRequest:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:GetNodeInfoRequest:Create Could not create message: ' + e.message)
				}
			}
		},
		async ABCIQueryResponse({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosBaseTendermintV1Beta1.tx.abciqueryResponse({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:ABCIQueryResponse:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:ABCIQueryResponse:Create Could not create message: ' + e.message)
				}
			}
		},
		async Header({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosBaseTendermintV1Beta1.tx.header({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:Header:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:Header:Create Could not create message: ' + e.message)
				}
			}
		},
		async GetValidatorSetByHeightRequest({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosBaseTendermintV1Beta1.tx.getValidatorSetByHeightRequest({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:GetValidatorSetByHeightRequest:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:GetValidatorSetByHeightRequest:Create Could not create message: ' + e.message)
				}
			}
		},
		async GetLatestBlockRequest({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosBaseTendermintV1Beta1.tx.getLatestBlockRequest({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:GetLatestBlockRequest:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:GetLatestBlockRequest:Create Could not create message: ' + e.message)
				}
			}
		},
		
	}
}