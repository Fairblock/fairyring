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
				ContractInfo: {},
				ContractHistory: {},
				ContractsByCode: {},
				AllContractState: {},
				RawContractState: {},
				SmartContractState: {},
				Code: {},
				Codes: {},
				PinnedCodes: {},
				Params: {},
				ContractsByCreator: {},
				BuildAddress: {},
				
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
				getContractInfo: (state) => (params = { params: {}}) => {
					if (!(<any> params).query) {
						(<any> params).query=null
					}
			return state.ContractInfo[JSON.stringify(params)] ?? {}
		},
				getContractHistory: (state) => (params = { params: {}}) => {
					if (!(<any> params).query) {
						(<any> params).query=null
					}
			return state.ContractHistory[JSON.stringify(params)] ?? {}
		},
				getContractsByCode: (state) => (params = { params: {}}) => {
					if (!(<any> params).query) {
						(<any> params).query=null
					}
			return state.ContractsByCode[JSON.stringify(params)] ?? {}
		},
				getAllContractState: (state) => (params = { params: {}}) => {
					if (!(<any> params).query) {
						(<any> params).query=null
					}
			return state.AllContractState[JSON.stringify(params)] ?? {}
		},
				getRawContractState: (state) => (params = { params: {}}) => {
					if (!(<any> params).query) {
						(<any> params).query=null
					}
			return state.RawContractState[JSON.stringify(params)] ?? {}
		},
				getSmartContractState: (state) => (params = { params: {}}) => {
					if (!(<any> params).query) {
						(<any> params).query=null
					}
			return state.SmartContractState[JSON.stringify(params)] ?? {}
		},
				getCode: (state) => (params = { params: {}}) => {
					if (!(<any> params).query) {
						(<any> params).query=null
					}
			return state.Code[JSON.stringify(params)] ?? {}
		},
				getCodes: (state) => (params = { params: {}}) => {
					if (!(<any> params).query) {
						(<any> params).query=null
					}
			return state.Codes[JSON.stringify(params)] ?? {}
		},
				getPinnedCodes: (state) => (params = { params: {}}) => {
					if (!(<any> params).query) {
						(<any> params).query=null
					}
			return state.PinnedCodes[JSON.stringify(params)] ?? {}
		},
				getParams: (state) => (params = { params: {}}) => {
					if (!(<any> params).query) {
						(<any> params).query=null
					}
			return state.Params[JSON.stringify(params)] ?? {}
		},
				getContractsByCreator: (state) => (params = { params: {}}) => {
					if (!(<any> params).query) {
						(<any> params).query=null
					}
			return state.ContractsByCreator[JSON.stringify(params)] ?? {}
		},
				getBuildAddress: (state) => (params = { params: {}}) => {
					if (!(<any> params).query) {
						(<any> params).query=null
					}
			return state.BuildAddress[JSON.stringify(params)] ?? {}
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
			console.log('Vuex module: cosmwasm.wasm.v1 initialized!')
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
		
		
		
		 		
		
		
		async QueryContractInfo({ commit, rootGetters, getters }, { options: { subscribe, all} = { subscribe:false, all:false}, params, query=null }) {
			try {
				const key = params ?? {};
				const client = initClient(rootGetters);
				let value= (await client.CosmwasmWasmV1.query.queryContractInfo( key.address)).data
				
					
				commit('QUERY', { query: 'ContractInfo', key: { params: {...key}, query}, value })
				if (subscribe) commit('SUBSCRIBE', { action: 'QueryContractInfo', payload: { options: { all }, params: {...key},query }})
				return getters['getContractInfo']( { params: {...key}, query}) ?? {}
			} catch (e) {
				throw new Error('QueryClient:QueryContractInfo API Node Unavailable. Could not perform query: ' + e.message)
				
			}
		},
		
		
		
		
		 		
		
		
		async QueryContractHistory({ commit, rootGetters, getters }, { options: { subscribe, all} = { subscribe:false, all:false}, params, query=null }) {
			try {
				const key = params ?? {};
				const client = initClient(rootGetters);
				let value= (await client.CosmwasmWasmV1.query.queryContractHistory( key.address, query ?? undefined)).data
				
					
				while (all && (<any> value).pagination && (<any> value).pagination.next_key!=null) {
					let next_values=(await client.CosmwasmWasmV1.query.queryContractHistory( key.address, {...query ?? {}, 'pagination.key':(<any> value).pagination.next_key} as any)).data
					value = mergeResults(value, next_values);
				}
				commit('QUERY', { query: 'ContractHistory', key: { params: {...key}, query}, value })
				if (subscribe) commit('SUBSCRIBE', { action: 'QueryContractHistory', payload: { options: { all }, params: {...key},query }})
				return getters['getContractHistory']( { params: {...key}, query}) ?? {}
			} catch (e) {
				throw new Error('QueryClient:QueryContractHistory API Node Unavailable. Could not perform query: ' + e.message)
				
			}
		},
		
		
		
		
		 		
		
		
		async QueryContractsByCode({ commit, rootGetters, getters }, { options: { subscribe, all} = { subscribe:false, all:false}, params, query=null }) {
			try {
				const key = params ?? {};
				const client = initClient(rootGetters);
				let value= (await client.CosmwasmWasmV1.query.queryContractsByCode( key.code_id, query ?? undefined)).data
				
					
				while (all && (<any> value).pagination && (<any> value).pagination.next_key!=null) {
					let next_values=(await client.CosmwasmWasmV1.query.queryContractsByCode( key.code_id, {...query ?? {}, 'pagination.key':(<any> value).pagination.next_key} as any)).data
					value = mergeResults(value, next_values);
				}
				commit('QUERY', { query: 'ContractsByCode', key: { params: {...key}, query}, value })
				if (subscribe) commit('SUBSCRIBE', { action: 'QueryContractsByCode', payload: { options: { all }, params: {...key},query }})
				return getters['getContractsByCode']( { params: {...key}, query}) ?? {}
			} catch (e) {
				throw new Error('QueryClient:QueryContractsByCode API Node Unavailable. Could not perform query: ' + e.message)
				
			}
		},
		
		
		
		
		 		
		
		
		async QueryAllContractState({ commit, rootGetters, getters }, { options: { subscribe, all} = { subscribe:false, all:false}, params, query=null }) {
			try {
				const key = params ?? {};
				const client = initClient(rootGetters);
				let value= (await client.CosmwasmWasmV1.query.queryAllContractState( key.address, query ?? undefined)).data
				
					
				while (all && (<any> value).pagination && (<any> value).pagination.next_key!=null) {
					let next_values=(await client.CosmwasmWasmV1.query.queryAllContractState( key.address, {...query ?? {}, 'pagination.key':(<any> value).pagination.next_key} as any)).data
					value = mergeResults(value, next_values);
				}
				commit('QUERY', { query: 'AllContractState', key: { params: {...key}, query}, value })
				if (subscribe) commit('SUBSCRIBE', { action: 'QueryAllContractState', payload: { options: { all }, params: {...key},query }})
				return getters['getAllContractState']( { params: {...key}, query}) ?? {}
			} catch (e) {
				throw new Error('QueryClient:QueryAllContractState API Node Unavailable. Could not perform query: ' + e.message)
				
			}
		},
		
		
		
		
		 		
		
		
		async QueryRawContractState({ commit, rootGetters, getters }, { options: { subscribe, all} = { subscribe:false, all:false}, params, query=null }) {
			try {
				const key = params ?? {};
				const client = initClient(rootGetters);
				let value= (await client.CosmwasmWasmV1.query.queryRawContractState( key.address,  key.query_data)).data
				
					
				commit('QUERY', { query: 'RawContractState', key: { params: {...key}, query}, value })
				if (subscribe) commit('SUBSCRIBE', { action: 'QueryRawContractState', payload: { options: { all }, params: {...key},query }})
				return getters['getRawContractState']( { params: {...key}, query}) ?? {}
			} catch (e) {
				throw new Error('QueryClient:QueryRawContractState API Node Unavailable. Could not perform query: ' + e.message)
				
			}
		},
		
		
		
		
		 		
		
		
		async QuerySmartContractState({ commit, rootGetters, getters }, { options: { subscribe, all} = { subscribe:false, all:false}, params, query=null }) {
			try {
				const key = params ?? {};
				const client = initClient(rootGetters);
				let value= (await client.CosmwasmWasmV1.query.querySmartContractState( key.address,  key.query_data)).data
				
					
				commit('QUERY', { query: 'SmartContractState', key: { params: {...key}, query}, value })
				if (subscribe) commit('SUBSCRIBE', { action: 'QuerySmartContractState', payload: { options: { all }, params: {...key},query }})
				return getters['getSmartContractState']( { params: {...key}, query}) ?? {}
			} catch (e) {
				throw new Error('QueryClient:QuerySmartContractState API Node Unavailable. Could not perform query: ' + e.message)
				
			}
		},
		
		
		
		
		 		
		
		
		async QueryCode({ commit, rootGetters, getters }, { options: { subscribe, all} = { subscribe:false, all:false}, params, query=null }) {
			try {
				const key = params ?? {};
				const client = initClient(rootGetters);
				let value= (await client.CosmwasmWasmV1.query.queryCode( key.code_id)).data
				
					
				commit('QUERY', { query: 'Code', key: { params: {...key}, query}, value })
				if (subscribe) commit('SUBSCRIBE', { action: 'QueryCode', payload: { options: { all }, params: {...key},query }})
				return getters['getCode']( { params: {...key}, query}) ?? {}
			} catch (e) {
				throw new Error('QueryClient:QueryCode API Node Unavailable. Could not perform query: ' + e.message)
				
			}
		},
		
		
		
		
		 		
		
		
		async QueryCodes({ commit, rootGetters, getters }, { options: { subscribe, all} = { subscribe:false, all:false}, params, query=null }) {
			try {
				const key = params ?? {};
				const client = initClient(rootGetters);
				let value= (await client.CosmwasmWasmV1.query.queryCodes(query ?? undefined)).data
				
					
				while (all && (<any> value).pagination && (<any> value).pagination.next_key!=null) {
					let next_values=(await client.CosmwasmWasmV1.query.queryCodes({...query ?? {}, 'pagination.key':(<any> value).pagination.next_key} as any)).data
					value = mergeResults(value, next_values);
				}
				commit('QUERY', { query: 'Codes', key: { params: {...key}, query}, value })
				if (subscribe) commit('SUBSCRIBE', { action: 'QueryCodes', payload: { options: { all }, params: {...key},query }})
				return getters['getCodes']( { params: {...key}, query}) ?? {}
			} catch (e) {
				throw new Error('QueryClient:QueryCodes API Node Unavailable. Could not perform query: ' + e.message)
				
			}
		},
		
		
		
		
		 		
		
		
		async QueryPinnedCodes({ commit, rootGetters, getters }, { options: { subscribe, all} = { subscribe:false, all:false}, params, query=null }) {
			try {
				const key = params ?? {};
				const client = initClient(rootGetters);
				let value= (await client.CosmwasmWasmV1.query.queryPinnedCodes(query ?? undefined)).data
				
					
				while (all && (<any> value).pagination && (<any> value).pagination.next_key!=null) {
					let next_values=(await client.CosmwasmWasmV1.query.queryPinnedCodes({...query ?? {}, 'pagination.key':(<any> value).pagination.next_key} as any)).data
					value = mergeResults(value, next_values);
				}
				commit('QUERY', { query: 'PinnedCodes', key: { params: {...key}, query}, value })
				if (subscribe) commit('SUBSCRIBE', { action: 'QueryPinnedCodes', payload: { options: { all }, params: {...key},query }})
				return getters['getPinnedCodes']( { params: {...key}, query}) ?? {}
			} catch (e) {
				throw new Error('QueryClient:QueryPinnedCodes API Node Unavailable. Could not perform query: ' + e.message)
				
			}
		},
		
		
		
		
		 		
		
		
		async QueryParams({ commit, rootGetters, getters }, { options: { subscribe, all} = { subscribe:false, all:false}, params, query=null }) {
			try {
				const key = params ?? {};
				const client = initClient(rootGetters);
				let value= (await client.CosmwasmWasmV1.query.queryParams()).data
				
					
				commit('QUERY', { query: 'Params', key: { params: {...key}, query}, value })
				if (subscribe) commit('SUBSCRIBE', { action: 'QueryParams', payload: { options: { all }, params: {...key},query }})
				return getters['getParams']( { params: {...key}, query}) ?? {}
			} catch (e) {
				throw new Error('QueryClient:QueryParams API Node Unavailable. Could not perform query: ' + e.message)
				
			}
		},
		
		
		
		
		 		
		
		
		async QueryContractsByCreator({ commit, rootGetters, getters }, { options: { subscribe, all} = { subscribe:false, all:false}, params, query=null }) {
			try {
				const key = params ?? {};
				const client = initClient(rootGetters);
				let value= (await client.CosmwasmWasmV1.query.queryContractsByCreator( key.creator_address, query ?? undefined)).data
				
					
				while (all && (<any> value).pagination && (<any> value).pagination.next_key!=null) {
					let next_values=(await client.CosmwasmWasmV1.query.queryContractsByCreator( key.creator_address, {...query ?? {}, 'pagination.key':(<any> value).pagination.next_key} as any)).data
					value = mergeResults(value, next_values);
				}
				commit('QUERY', { query: 'ContractsByCreator', key: { params: {...key}, query}, value })
				if (subscribe) commit('SUBSCRIBE', { action: 'QueryContractsByCreator', payload: { options: { all }, params: {...key},query }})
				return getters['getContractsByCreator']( { params: {...key}, query}) ?? {}
			} catch (e) {
				throw new Error('QueryClient:QueryContractsByCreator API Node Unavailable. Could not perform query: ' + e.message)
				
			}
		},
		
		
		
		
		 		
		
		
		async QueryBuildAddress({ commit, rootGetters, getters }, { options: { subscribe, all} = { subscribe:false, all:false}, params, query=null }) {
			try {
				const key = params ?? {};
				const client = initClient(rootGetters);
				let value= (await client.CosmwasmWasmV1.query.queryBuildAddress(query ?? undefined)).data
				
					
				while (all && (<any> value).pagination && (<any> value).pagination.next_key!=null) {
					let next_values=(await client.CosmwasmWasmV1.query.queryBuildAddress({...query ?? {}, 'pagination.key':(<any> value).pagination.next_key} as any)).data
					value = mergeResults(value, next_values);
				}
				commit('QUERY', { query: 'BuildAddress', key: { params: {...key}, query}, value })
				if (subscribe) commit('SUBSCRIBE', { action: 'QueryBuildAddress', payload: { options: { all }, params: {...key},query }})
				return getters['getBuildAddress']( { params: {...key}, query}) ?? {}
			} catch (e) {
				throw new Error('QueryClient:QueryBuildAddress API Node Unavailable. Could not perform query: ' + e.message)
				
			}
		},
		
		
		async sendMsgUpdateParams({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmwasmWasmV1.tx.sendMsgUpdateParams({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgUpdateParams:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:MsgUpdateParams:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendQueryPinnedCodesResponse({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmwasmWasmV1.tx.sendQueryPinnedCodesResponse({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryPinnedCodesResponse:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QueryPinnedCodesResponse:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendMsgUnpinCodes({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmwasmWasmV1.tx.sendMsgUnpinCodes({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgUnpinCodes:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:MsgUnpinCodes:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendMsgIBCCloseChannel({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmwasmWasmV1.tx.sendMsgIBCCloseChannel({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgIBCCloseChannel:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:MsgIBCCloseChannel:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendSequence({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmwasmWasmV1.tx.sendSequence({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:Sequence:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:Sequence:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendContract({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmwasmWasmV1.tx.sendContract({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:Contract:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:Contract:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendCodeInfoResponse({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmwasmWasmV1.tx.sendCodeInfoResponse({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:CodeInfoResponse:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:CodeInfoResponse:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendQuerySmartContractStateRequest({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmwasmWasmV1.tx.sendQuerySmartContractStateRequest({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QuerySmartContractStateRequest:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QuerySmartContractStateRequest:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendMsgIBCSendResponse({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmwasmWasmV1.tx.sendMsgIBCSendResponse({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgIBCSendResponse:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:MsgIBCSendResponse:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendQueryContractHistoryResponse({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmwasmWasmV1.tx.sendQueryContractHistoryResponse({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryContractHistoryResponse:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QueryContractHistoryResponse:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendMsgExecuteContract({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmwasmWasmV1.tx.sendMsgExecuteContract({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgExecuteContract:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:MsgExecuteContract:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendMsgPinCodesResponse({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmwasmWasmV1.tx.sendMsgPinCodesResponse({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgPinCodesResponse:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:MsgPinCodesResponse:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendMsgAddCodeUploadParamsAddressesResponse({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmwasmWasmV1.tx.sendMsgAddCodeUploadParamsAddressesResponse({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgAddCodeUploadParamsAddressesResponse:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:MsgAddCodeUploadParamsAddressesResponse:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendStoreCodeProposal({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmwasmWasmV1.tx.sendStoreCodeProposal({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:StoreCodeProposal:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:StoreCodeProposal:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendQueryPinnedCodesRequest({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmwasmWasmV1.tx.sendQueryPinnedCodesRequest({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryPinnedCodesRequest:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QueryPinnedCodesRequest:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendQueryContractsByCreatorResponse({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmwasmWasmV1.tx.sendQueryContractsByCreatorResponse({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryContractsByCreatorResponse:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QueryContractsByCreatorResponse:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendMsgClearAdmin({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmwasmWasmV1.tx.sendMsgClearAdmin({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgClearAdmin:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:MsgClearAdmin:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendMsgPinCodes({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmwasmWasmV1.tx.sendMsgPinCodes({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgPinCodes:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:MsgPinCodes:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendMsgUpdateContractLabelResponse({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmwasmWasmV1.tx.sendMsgUpdateContractLabelResponse({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgUpdateContractLabelResponse:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:MsgUpdateContractLabelResponse:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendAbsoluteTxPosition({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmwasmWasmV1.tx.sendAbsoluteTxPosition({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:AbsoluteTxPosition:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:AbsoluteTxPosition:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendContractExecutionAuthorization({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmwasmWasmV1.tx.sendContractExecutionAuthorization({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:ContractExecutionAuthorization:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:ContractExecutionAuthorization:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendGenesisState({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmwasmWasmV1.tx.sendGenesisState({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:GenesisState:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:GenesisState:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendMsgStoreAndInstantiateContractResponse({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmwasmWasmV1.tx.sendMsgStoreAndInstantiateContractResponse({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgStoreAndInstantiateContractResponse:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:MsgStoreAndInstantiateContractResponse:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendSudoContractProposal({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmwasmWasmV1.tx.sendSudoContractProposal({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:SudoContractProposal:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:SudoContractProposal:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendQueryAllContractStateResponse({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmwasmWasmV1.tx.sendQueryAllContractStateResponse({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryAllContractStateResponse:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QueryAllContractStateResponse:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendQueryParamsRequest({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmwasmWasmV1.tx.sendQueryParamsRequest({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryParamsRequest:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QueryParamsRequest:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendMsgSudoContract({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmwasmWasmV1.tx.sendMsgSudoContract({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgSudoContract:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:MsgSudoContract:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendMsgStoreAndInstantiateContract({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmwasmWasmV1.tx.sendMsgStoreAndInstantiateContract({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgStoreAndInstantiateContract:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:MsgStoreAndInstantiateContract:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendQueryContractInfoRequest({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmwasmWasmV1.tx.sendQueryContractInfoRequest({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryContractInfoRequest:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QueryContractInfoRequest:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendMsgUpdateAdminResponse({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmwasmWasmV1.tx.sendMsgUpdateAdminResponse({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgUpdateAdminResponse:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:MsgUpdateAdminResponse:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendMsgUnpinCodesResponse({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmwasmWasmV1.tx.sendMsgUnpinCodesResponse({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgUnpinCodesResponse:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:MsgUnpinCodesResponse:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendMsgUpdateInstantiateConfig({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmwasmWasmV1.tx.sendMsgUpdateInstantiateConfig({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgUpdateInstantiateConfig:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:MsgUpdateInstantiateConfig:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendQueryRawContractStateResponse({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmwasmWasmV1.tx.sendQueryRawContractStateResponse({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryRawContractStateResponse:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QueryRawContractStateResponse:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendAccessConfigUpdate({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmwasmWasmV1.tx.sendAccessConfigUpdate({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:AccessConfigUpdate:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:AccessConfigUpdate:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendQueryCodeResponse({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmwasmWasmV1.tx.sendQueryCodeResponse({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryCodeResponse:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QueryCodeResponse:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendMsgUpdateInstantiateConfigResponse({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmwasmWasmV1.tx.sendMsgUpdateInstantiateConfigResponse({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgUpdateInstantiateConfigResponse:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:MsgUpdateInstantiateConfigResponse:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendCodeInfo({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmwasmWasmV1.tx.sendCodeInfo({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:CodeInfo:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:CodeInfo:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendMsgUpdateContractLabel({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmwasmWasmV1.tx.sendMsgUpdateContractLabel({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgUpdateContractLabel:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:MsgUpdateContractLabel:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendCode({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmwasmWasmV1.tx.sendCode({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:Code:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:Code:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendExecuteContractProposal({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmwasmWasmV1.tx.sendExecuteContractProposal({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:ExecuteContractProposal:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:ExecuteContractProposal:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendQueryAllContractStateRequest({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmwasmWasmV1.tx.sendQueryAllContractStateRequest({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryAllContractStateRequest:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QueryAllContractStateRequest:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendQueryCodesRequest({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmwasmWasmV1.tx.sendQueryCodesRequest({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryCodesRequest:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QueryCodesRequest:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendUnpinCodesProposal({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmwasmWasmV1.tx.sendUnpinCodesProposal({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:UnpinCodesProposal:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:UnpinCodesProposal:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendUpdateInstantiateConfigProposal({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmwasmWasmV1.tx.sendUpdateInstantiateConfigProposal({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:UpdateInstantiateConfigProposal:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:UpdateInstantiateConfigProposal:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendStoreAndInstantiateContractProposal({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmwasmWasmV1.tx.sendStoreAndInstantiateContractProposal({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:StoreAndInstantiateContractProposal:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:StoreAndInstantiateContractProposal:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendCombinedLimit({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmwasmWasmV1.tx.sendCombinedLimit({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:CombinedLimit:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:CombinedLimit:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendMsgMigrateContract({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmwasmWasmV1.tx.sendMsgMigrateContract({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgMigrateContract:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:MsgMigrateContract:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendMsgStoreAndMigrateContract({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmwasmWasmV1.tx.sendMsgStoreAndMigrateContract({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgStoreAndMigrateContract:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:MsgStoreAndMigrateContract:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendAccessTypeParam({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmwasmWasmV1.tx.sendAccessTypeParam({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:AccessTypeParam:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:AccessTypeParam:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendQuerySmartContractStateResponse({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmwasmWasmV1.tx.sendQuerySmartContractStateResponse({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QuerySmartContractStateResponse:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QuerySmartContractStateResponse:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendAllowAllMessagesFilter({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmwasmWasmV1.tx.sendAllowAllMessagesFilter({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:AllowAllMessagesFilter:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:AllowAllMessagesFilter:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendQueryContractsByCodeRequest({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmwasmWasmV1.tx.sendQueryContractsByCodeRequest({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryContractsByCodeRequest:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QueryContractsByCodeRequest:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendQueryContractsByCodeResponse({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmwasmWasmV1.tx.sendQueryContractsByCodeResponse({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryContractsByCodeResponse:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QueryContractsByCodeResponse:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendMsgStoreAndMigrateContractResponse({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmwasmWasmV1.tx.sendMsgStoreAndMigrateContractResponse({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgStoreAndMigrateContractResponse:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:MsgStoreAndMigrateContractResponse:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendCodeGrant({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmwasmWasmV1.tx.sendCodeGrant({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:CodeGrant:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:CodeGrant:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendMaxFundsLimit({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmwasmWasmV1.tx.sendMaxFundsLimit({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MaxFundsLimit:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:MaxFundsLimit:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendQueryContractHistoryRequest({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmwasmWasmV1.tx.sendQueryContractHistoryRequest({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryContractHistoryRequest:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QueryContractHistoryRequest:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendQueryRawContractStateRequest({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmwasmWasmV1.tx.sendQueryRawContractStateRequest({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryRawContractStateRequest:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QueryRawContractStateRequest:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendContractInfo({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmwasmWasmV1.tx.sendContractInfo({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:ContractInfo:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:ContractInfo:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendMsgIBCSend({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmwasmWasmV1.tx.sendMsgIBCSend({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgIBCSend:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:MsgIBCSend:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendMsgRemoveCodeUploadParamsAddressesResponse({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmwasmWasmV1.tx.sendMsgRemoveCodeUploadParamsAddressesResponse({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgRemoveCodeUploadParamsAddressesResponse:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:MsgRemoveCodeUploadParamsAddressesResponse:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendContractMigrationAuthorization({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmwasmWasmV1.tx.sendContractMigrationAuthorization({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:ContractMigrationAuthorization:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:ContractMigrationAuthorization:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendStoreCodeAuthorization({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmwasmWasmV1.tx.sendStoreCodeAuthorization({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:StoreCodeAuthorization:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:StoreCodeAuthorization:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendQueryCodeRequest({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmwasmWasmV1.tx.sendQueryCodeRequest({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryCodeRequest:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QueryCodeRequest:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendQueryCodesResponse({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmwasmWasmV1.tx.sendQueryCodesResponse({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryCodesResponse:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QueryCodesResponse:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendMsgInstantiateContract2Response({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmwasmWasmV1.tx.sendMsgInstantiateContract2Response({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgInstantiateContract2Response:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:MsgInstantiateContract2Response:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendMsgMigrateContractResponse({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmwasmWasmV1.tx.sendMsgMigrateContractResponse({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgMigrateContractResponse:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:MsgMigrateContractResponse:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendMsgSudoContractResponse({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmwasmWasmV1.tx.sendMsgSudoContractResponse({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgSudoContractResponse:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:MsgSudoContractResponse:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendContractCodeHistoryEntry({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmwasmWasmV1.tx.sendContractCodeHistoryEntry({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:ContractCodeHistoryEntry:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:ContractCodeHistoryEntry:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendQueryContractsByCreatorRequest({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmwasmWasmV1.tx.sendQueryContractsByCreatorRequest({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryContractsByCreatorRequest:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QueryContractsByCreatorRequest:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendMsgExecuteContractResponse({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmwasmWasmV1.tx.sendMsgExecuteContractResponse({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgExecuteContractResponse:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:MsgExecuteContractResponse:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendContractGrant({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmwasmWasmV1.tx.sendContractGrant({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:ContractGrant:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:ContractGrant:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendClearAdminProposal({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmwasmWasmV1.tx.sendClearAdminProposal({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:ClearAdminProposal:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:ClearAdminProposal:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendMaxCallsLimit({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmwasmWasmV1.tx.sendMaxCallsLimit({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MaxCallsLimit:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:MaxCallsLimit:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendAcceptedMessageKeysFilter({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmwasmWasmV1.tx.sendAcceptedMessageKeysFilter({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:AcceptedMessageKeysFilter:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:AcceptedMessageKeysFilter:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendAcceptedMessagesFilter({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmwasmWasmV1.tx.sendAcceptedMessagesFilter({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:AcceptedMessagesFilter:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:AcceptedMessagesFilter:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendMsgClearAdminResponse({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmwasmWasmV1.tx.sendMsgClearAdminResponse({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgClearAdminResponse:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:MsgClearAdminResponse:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendUpdateAdminProposal({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmwasmWasmV1.tx.sendUpdateAdminProposal({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:UpdateAdminProposal:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:UpdateAdminProposal:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendMsgInstantiateContractResponse({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmwasmWasmV1.tx.sendMsgInstantiateContractResponse({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgInstantiateContractResponse:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:MsgInstantiateContractResponse:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendMsgAddCodeUploadParamsAddresses({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmwasmWasmV1.tx.sendMsgAddCodeUploadParamsAddresses({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgAddCodeUploadParamsAddresses:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:MsgAddCodeUploadParamsAddresses:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendMsgUpdateAdmin({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmwasmWasmV1.tx.sendMsgUpdateAdmin({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgUpdateAdmin:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:MsgUpdateAdmin:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendAccessConfig({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmwasmWasmV1.tx.sendAccessConfig({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:AccessConfig:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:AccessConfig:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendQueryParamsResponse({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmwasmWasmV1.tx.sendQueryParamsResponse({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryParamsResponse:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QueryParamsResponse:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendMsgRemoveCodeUploadParamsAddresses({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmwasmWasmV1.tx.sendMsgRemoveCodeUploadParamsAddresses({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgRemoveCodeUploadParamsAddresses:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:MsgRemoveCodeUploadParamsAddresses:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendParams({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmwasmWasmV1.tx.sendParams({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:Params:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:Params:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendPinCodesProposal({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmwasmWasmV1.tx.sendPinCodesProposal({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:PinCodesProposal:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:PinCodesProposal:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendInstantiateContract2Proposal({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmwasmWasmV1.tx.sendInstantiateContract2Proposal({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:InstantiateContract2Proposal:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:InstantiateContract2Proposal:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendMsgStoreCodeResponse({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmwasmWasmV1.tx.sendMsgStoreCodeResponse({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgStoreCodeResponse:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:MsgStoreCodeResponse:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendQueryContractInfoResponse({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmwasmWasmV1.tx.sendQueryContractInfoResponse({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryContractInfoResponse:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QueryContractInfoResponse:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendQueryBuildAddressRequest({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmwasmWasmV1.tx.sendQueryBuildAddressRequest({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryBuildAddressRequest:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QueryBuildAddressRequest:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendMsgInstantiateContract2({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmwasmWasmV1.tx.sendMsgInstantiateContract2({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgInstantiateContract2:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:MsgInstantiateContract2:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendModel({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmwasmWasmV1.tx.sendModel({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:Model:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:Model:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendMigrateContractProposal({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmwasmWasmV1.tx.sendMigrateContractProposal({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MigrateContractProposal:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:MigrateContractProposal:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendMsgInstantiateContract({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmwasmWasmV1.tx.sendMsgInstantiateContract({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgInstantiateContract:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:MsgInstantiateContract:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendInstantiateContractProposal({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmwasmWasmV1.tx.sendInstantiateContractProposal({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:InstantiateContractProposal:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:InstantiateContractProposal:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendMsgStoreCode({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmwasmWasmV1.tx.sendMsgStoreCode({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgStoreCode:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:MsgStoreCode:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendMsgUpdateParamsResponse({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmwasmWasmV1.tx.sendMsgUpdateParamsResponse({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgUpdateParamsResponse:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:MsgUpdateParamsResponse:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendQueryBuildAddressResponse({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmwasmWasmV1.tx.sendQueryBuildAddressResponse({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryBuildAddressResponse:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QueryBuildAddressResponse:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		
		async MsgUpdateParams({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmwasmWasmV1.tx.msgUpdateParams({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgUpdateParams:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:MsgUpdateParams:Create Could not create message: ' + e.message)
				}
			}
		},
		async QueryPinnedCodesResponse({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmwasmWasmV1.tx.queryPinnedCodesResponse({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryPinnedCodesResponse:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QueryPinnedCodesResponse:Create Could not create message: ' + e.message)
				}
			}
		},
		async MsgUnpinCodes({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmwasmWasmV1.tx.msgUnpinCodes({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgUnpinCodes:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:MsgUnpinCodes:Create Could not create message: ' + e.message)
				}
			}
		},
		async MsgIBCCloseChannel({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmwasmWasmV1.tx.msgIbccloseChannel({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgIBCCloseChannel:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:MsgIBCCloseChannel:Create Could not create message: ' + e.message)
				}
			}
		},
		async Sequence({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmwasmWasmV1.tx.sequence({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:Sequence:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:Sequence:Create Could not create message: ' + e.message)
				}
			}
		},
		async Contract({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmwasmWasmV1.tx.contract({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:Contract:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:Contract:Create Could not create message: ' + e.message)
				}
			}
		},
		async CodeInfoResponse({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmwasmWasmV1.tx.codeInfoResponse({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:CodeInfoResponse:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:CodeInfoResponse:Create Could not create message: ' + e.message)
				}
			}
		},
		async QuerySmartContractStateRequest({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmwasmWasmV1.tx.querySmartContractStateRequest({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QuerySmartContractStateRequest:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QuerySmartContractStateRequest:Create Could not create message: ' + e.message)
				}
			}
		},
		async MsgIBCSendResponse({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmwasmWasmV1.tx.msgIbcsendResponse({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgIBCSendResponse:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:MsgIBCSendResponse:Create Could not create message: ' + e.message)
				}
			}
		},
		async QueryContractHistoryResponse({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmwasmWasmV1.tx.queryContractHistoryResponse({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryContractHistoryResponse:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QueryContractHistoryResponse:Create Could not create message: ' + e.message)
				}
			}
		},
		async MsgExecuteContract({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmwasmWasmV1.tx.msgExecuteContract({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgExecuteContract:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:MsgExecuteContract:Create Could not create message: ' + e.message)
				}
			}
		},
		async MsgPinCodesResponse({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmwasmWasmV1.tx.msgPinCodesResponse({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgPinCodesResponse:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:MsgPinCodesResponse:Create Could not create message: ' + e.message)
				}
			}
		},
		async MsgAddCodeUploadParamsAddressesResponse({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmwasmWasmV1.tx.msgAddCodeUploadParamsAddressesResponse({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgAddCodeUploadParamsAddressesResponse:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:MsgAddCodeUploadParamsAddressesResponse:Create Could not create message: ' + e.message)
				}
			}
		},
		async StoreCodeProposal({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmwasmWasmV1.tx.storeCodeProposal({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:StoreCodeProposal:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:StoreCodeProposal:Create Could not create message: ' + e.message)
				}
			}
		},
		async QueryPinnedCodesRequest({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmwasmWasmV1.tx.queryPinnedCodesRequest({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryPinnedCodesRequest:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QueryPinnedCodesRequest:Create Could not create message: ' + e.message)
				}
			}
		},
		async QueryContractsByCreatorResponse({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmwasmWasmV1.tx.queryContractsByCreatorResponse({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryContractsByCreatorResponse:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QueryContractsByCreatorResponse:Create Could not create message: ' + e.message)
				}
			}
		},
		async MsgClearAdmin({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmwasmWasmV1.tx.msgClearAdmin({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgClearAdmin:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:MsgClearAdmin:Create Could not create message: ' + e.message)
				}
			}
		},
		async MsgPinCodes({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmwasmWasmV1.tx.msgPinCodes({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgPinCodes:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:MsgPinCodes:Create Could not create message: ' + e.message)
				}
			}
		},
		async MsgUpdateContractLabelResponse({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmwasmWasmV1.tx.msgUpdateContractLabelResponse({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgUpdateContractLabelResponse:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:MsgUpdateContractLabelResponse:Create Could not create message: ' + e.message)
				}
			}
		},
		async AbsoluteTxPosition({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmwasmWasmV1.tx.absoluteTxPosition({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:AbsoluteTxPosition:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:AbsoluteTxPosition:Create Could not create message: ' + e.message)
				}
			}
		},
		async ContractExecutionAuthorization({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmwasmWasmV1.tx.contractExecutionAuthorization({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:ContractExecutionAuthorization:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:ContractExecutionAuthorization:Create Could not create message: ' + e.message)
				}
			}
		},
		async GenesisState({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmwasmWasmV1.tx.genesisState({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:GenesisState:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:GenesisState:Create Could not create message: ' + e.message)
				}
			}
		},
		async MsgStoreAndInstantiateContractResponse({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmwasmWasmV1.tx.msgStoreAndInstantiateContractResponse({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgStoreAndInstantiateContractResponse:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:MsgStoreAndInstantiateContractResponse:Create Could not create message: ' + e.message)
				}
			}
		},
		async SudoContractProposal({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmwasmWasmV1.tx.sudoContractProposal({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:SudoContractProposal:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:SudoContractProposal:Create Could not create message: ' + e.message)
				}
			}
		},
		async QueryAllContractStateResponse({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmwasmWasmV1.tx.queryAllContractStateResponse({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryAllContractStateResponse:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QueryAllContractStateResponse:Create Could not create message: ' + e.message)
				}
			}
		},
		async QueryParamsRequest({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmwasmWasmV1.tx.queryParamsRequest({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryParamsRequest:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QueryParamsRequest:Create Could not create message: ' + e.message)
				}
			}
		},
		async MsgSudoContract({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmwasmWasmV1.tx.msgSudoContract({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgSudoContract:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:MsgSudoContract:Create Could not create message: ' + e.message)
				}
			}
		},
		async MsgStoreAndInstantiateContract({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmwasmWasmV1.tx.msgStoreAndInstantiateContract({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgStoreAndInstantiateContract:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:MsgStoreAndInstantiateContract:Create Could not create message: ' + e.message)
				}
			}
		},
		async QueryContractInfoRequest({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmwasmWasmV1.tx.queryContractInfoRequest({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryContractInfoRequest:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QueryContractInfoRequest:Create Could not create message: ' + e.message)
				}
			}
		},
		async MsgUpdateAdminResponse({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmwasmWasmV1.tx.msgUpdateAdminResponse({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgUpdateAdminResponse:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:MsgUpdateAdminResponse:Create Could not create message: ' + e.message)
				}
			}
		},
		async MsgUnpinCodesResponse({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmwasmWasmV1.tx.msgUnpinCodesResponse({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgUnpinCodesResponse:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:MsgUnpinCodesResponse:Create Could not create message: ' + e.message)
				}
			}
		},
		async MsgUpdateInstantiateConfig({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmwasmWasmV1.tx.msgUpdateInstantiateConfig({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgUpdateInstantiateConfig:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:MsgUpdateInstantiateConfig:Create Could not create message: ' + e.message)
				}
			}
		},
		async QueryRawContractStateResponse({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmwasmWasmV1.tx.queryRawContractStateResponse({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryRawContractStateResponse:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QueryRawContractStateResponse:Create Could not create message: ' + e.message)
				}
			}
		},
		async AccessConfigUpdate({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmwasmWasmV1.tx.accessConfigUpdate({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:AccessConfigUpdate:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:AccessConfigUpdate:Create Could not create message: ' + e.message)
				}
			}
		},
		async QueryCodeResponse({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmwasmWasmV1.tx.queryCodeResponse({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryCodeResponse:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QueryCodeResponse:Create Could not create message: ' + e.message)
				}
			}
		},
		async MsgUpdateInstantiateConfigResponse({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmwasmWasmV1.tx.msgUpdateInstantiateConfigResponse({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgUpdateInstantiateConfigResponse:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:MsgUpdateInstantiateConfigResponse:Create Could not create message: ' + e.message)
				}
			}
		},
		async CodeInfo({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmwasmWasmV1.tx.codeInfo({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:CodeInfo:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:CodeInfo:Create Could not create message: ' + e.message)
				}
			}
		},
		async MsgUpdateContractLabel({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmwasmWasmV1.tx.msgUpdateContractLabel({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgUpdateContractLabel:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:MsgUpdateContractLabel:Create Could not create message: ' + e.message)
				}
			}
		},
		async Code({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmwasmWasmV1.tx.code({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:Code:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:Code:Create Could not create message: ' + e.message)
				}
			}
		},
		async ExecuteContractProposal({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmwasmWasmV1.tx.executeContractProposal({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:ExecuteContractProposal:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:ExecuteContractProposal:Create Could not create message: ' + e.message)
				}
			}
		},
		async QueryAllContractStateRequest({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmwasmWasmV1.tx.queryAllContractStateRequest({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryAllContractStateRequest:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QueryAllContractStateRequest:Create Could not create message: ' + e.message)
				}
			}
		},
		async QueryCodesRequest({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmwasmWasmV1.tx.queryCodesRequest({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryCodesRequest:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QueryCodesRequest:Create Could not create message: ' + e.message)
				}
			}
		},
		async UnpinCodesProposal({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmwasmWasmV1.tx.unpinCodesProposal({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:UnpinCodesProposal:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:UnpinCodesProposal:Create Could not create message: ' + e.message)
				}
			}
		},
		async UpdateInstantiateConfigProposal({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmwasmWasmV1.tx.updateInstantiateConfigProposal({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:UpdateInstantiateConfigProposal:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:UpdateInstantiateConfigProposal:Create Could not create message: ' + e.message)
				}
			}
		},
		async StoreAndInstantiateContractProposal({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmwasmWasmV1.tx.storeAndInstantiateContractProposal({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:StoreAndInstantiateContractProposal:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:StoreAndInstantiateContractProposal:Create Could not create message: ' + e.message)
				}
			}
		},
		async CombinedLimit({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmwasmWasmV1.tx.combinedLimit({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:CombinedLimit:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:CombinedLimit:Create Could not create message: ' + e.message)
				}
			}
		},
		async MsgMigrateContract({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmwasmWasmV1.tx.msgMigrateContract({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgMigrateContract:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:MsgMigrateContract:Create Could not create message: ' + e.message)
				}
			}
		},
		async MsgStoreAndMigrateContract({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmwasmWasmV1.tx.msgStoreAndMigrateContract({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgStoreAndMigrateContract:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:MsgStoreAndMigrateContract:Create Could not create message: ' + e.message)
				}
			}
		},
		async AccessTypeParam({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmwasmWasmV1.tx.accessTypeParam({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:AccessTypeParam:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:AccessTypeParam:Create Could not create message: ' + e.message)
				}
			}
		},
		async QuerySmartContractStateResponse({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmwasmWasmV1.tx.querySmartContractStateResponse({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QuerySmartContractStateResponse:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QuerySmartContractStateResponse:Create Could not create message: ' + e.message)
				}
			}
		},
		async AllowAllMessagesFilter({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmwasmWasmV1.tx.allowAllMessagesFilter({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:AllowAllMessagesFilter:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:AllowAllMessagesFilter:Create Could not create message: ' + e.message)
				}
			}
		},
		async QueryContractsByCodeRequest({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmwasmWasmV1.tx.queryContractsByCodeRequest({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryContractsByCodeRequest:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QueryContractsByCodeRequest:Create Could not create message: ' + e.message)
				}
			}
		},
		async QueryContractsByCodeResponse({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmwasmWasmV1.tx.queryContractsByCodeResponse({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryContractsByCodeResponse:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QueryContractsByCodeResponse:Create Could not create message: ' + e.message)
				}
			}
		},
		async MsgStoreAndMigrateContractResponse({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmwasmWasmV1.tx.msgStoreAndMigrateContractResponse({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgStoreAndMigrateContractResponse:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:MsgStoreAndMigrateContractResponse:Create Could not create message: ' + e.message)
				}
			}
		},
		async CodeGrant({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmwasmWasmV1.tx.codeGrant({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:CodeGrant:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:CodeGrant:Create Could not create message: ' + e.message)
				}
			}
		},
		async MaxFundsLimit({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmwasmWasmV1.tx.maxFundsLimit({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MaxFundsLimit:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:MaxFundsLimit:Create Could not create message: ' + e.message)
				}
			}
		},
		async QueryContractHistoryRequest({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmwasmWasmV1.tx.queryContractHistoryRequest({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryContractHistoryRequest:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QueryContractHistoryRequest:Create Could not create message: ' + e.message)
				}
			}
		},
		async QueryRawContractStateRequest({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmwasmWasmV1.tx.queryRawContractStateRequest({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryRawContractStateRequest:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QueryRawContractStateRequest:Create Could not create message: ' + e.message)
				}
			}
		},
		async ContractInfo({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmwasmWasmV1.tx.contractInfo({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:ContractInfo:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:ContractInfo:Create Could not create message: ' + e.message)
				}
			}
		},
		async MsgIBCSend({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmwasmWasmV1.tx.msgIbcsend({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgIBCSend:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:MsgIBCSend:Create Could not create message: ' + e.message)
				}
			}
		},
		async MsgRemoveCodeUploadParamsAddressesResponse({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmwasmWasmV1.tx.msgRemoveCodeUploadParamsAddressesResponse({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgRemoveCodeUploadParamsAddressesResponse:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:MsgRemoveCodeUploadParamsAddressesResponse:Create Could not create message: ' + e.message)
				}
			}
		},
		async ContractMigrationAuthorization({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmwasmWasmV1.tx.contractMigrationAuthorization({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:ContractMigrationAuthorization:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:ContractMigrationAuthorization:Create Could not create message: ' + e.message)
				}
			}
		},
		async StoreCodeAuthorization({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmwasmWasmV1.tx.storeCodeAuthorization({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:StoreCodeAuthorization:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:StoreCodeAuthorization:Create Could not create message: ' + e.message)
				}
			}
		},
		async QueryCodeRequest({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmwasmWasmV1.tx.queryCodeRequest({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryCodeRequest:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QueryCodeRequest:Create Could not create message: ' + e.message)
				}
			}
		},
		async QueryCodesResponse({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmwasmWasmV1.tx.queryCodesResponse({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryCodesResponse:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QueryCodesResponse:Create Could not create message: ' + e.message)
				}
			}
		},
		async MsgInstantiateContract2Response({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmwasmWasmV1.tx.msgInstantiateContract2Response({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgInstantiateContract2Response:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:MsgInstantiateContract2Response:Create Could not create message: ' + e.message)
				}
			}
		},
		async MsgMigrateContractResponse({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmwasmWasmV1.tx.msgMigrateContractResponse({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgMigrateContractResponse:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:MsgMigrateContractResponse:Create Could not create message: ' + e.message)
				}
			}
		},
		async MsgSudoContractResponse({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmwasmWasmV1.tx.msgSudoContractResponse({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgSudoContractResponse:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:MsgSudoContractResponse:Create Could not create message: ' + e.message)
				}
			}
		},
		async ContractCodeHistoryEntry({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmwasmWasmV1.tx.contractCodeHistoryEntry({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:ContractCodeHistoryEntry:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:ContractCodeHistoryEntry:Create Could not create message: ' + e.message)
				}
			}
		},
		async QueryContractsByCreatorRequest({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmwasmWasmV1.tx.queryContractsByCreatorRequest({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryContractsByCreatorRequest:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QueryContractsByCreatorRequest:Create Could not create message: ' + e.message)
				}
			}
		},
		async MsgExecuteContractResponse({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmwasmWasmV1.tx.msgExecuteContractResponse({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgExecuteContractResponse:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:MsgExecuteContractResponse:Create Could not create message: ' + e.message)
				}
			}
		},
		async ContractGrant({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmwasmWasmV1.tx.contractGrant({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:ContractGrant:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:ContractGrant:Create Could not create message: ' + e.message)
				}
			}
		},
		async ClearAdminProposal({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmwasmWasmV1.tx.clearAdminProposal({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:ClearAdminProposal:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:ClearAdminProposal:Create Could not create message: ' + e.message)
				}
			}
		},
		async MaxCallsLimit({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmwasmWasmV1.tx.maxCallsLimit({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MaxCallsLimit:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:MaxCallsLimit:Create Could not create message: ' + e.message)
				}
			}
		},
		async AcceptedMessageKeysFilter({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmwasmWasmV1.tx.acceptedMessageKeysFilter({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:AcceptedMessageKeysFilter:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:AcceptedMessageKeysFilter:Create Could not create message: ' + e.message)
				}
			}
		},
		async AcceptedMessagesFilter({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmwasmWasmV1.tx.acceptedMessagesFilter({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:AcceptedMessagesFilter:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:AcceptedMessagesFilter:Create Could not create message: ' + e.message)
				}
			}
		},
		async MsgClearAdminResponse({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmwasmWasmV1.tx.msgClearAdminResponse({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgClearAdminResponse:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:MsgClearAdminResponse:Create Could not create message: ' + e.message)
				}
			}
		},
		async UpdateAdminProposal({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmwasmWasmV1.tx.updateAdminProposal({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:UpdateAdminProposal:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:UpdateAdminProposal:Create Could not create message: ' + e.message)
				}
			}
		},
		async MsgInstantiateContractResponse({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmwasmWasmV1.tx.msgInstantiateContractResponse({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgInstantiateContractResponse:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:MsgInstantiateContractResponse:Create Could not create message: ' + e.message)
				}
			}
		},
		async MsgAddCodeUploadParamsAddresses({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmwasmWasmV1.tx.msgAddCodeUploadParamsAddresses({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgAddCodeUploadParamsAddresses:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:MsgAddCodeUploadParamsAddresses:Create Could not create message: ' + e.message)
				}
			}
		},
		async MsgUpdateAdmin({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmwasmWasmV1.tx.msgUpdateAdmin({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgUpdateAdmin:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:MsgUpdateAdmin:Create Could not create message: ' + e.message)
				}
			}
		},
		async AccessConfig({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmwasmWasmV1.tx.accessConfig({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:AccessConfig:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:AccessConfig:Create Could not create message: ' + e.message)
				}
			}
		},
		async QueryParamsResponse({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmwasmWasmV1.tx.queryParamsResponse({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryParamsResponse:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QueryParamsResponse:Create Could not create message: ' + e.message)
				}
			}
		},
		async MsgRemoveCodeUploadParamsAddresses({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmwasmWasmV1.tx.msgRemoveCodeUploadParamsAddresses({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgRemoveCodeUploadParamsAddresses:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:MsgRemoveCodeUploadParamsAddresses:Create Could not create message: ' + e.message)
				}
			}
		},
		async Params({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmwasmWasmV1.tx.params({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:Params:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:Params:Create Could not create message: ' + e.message)
				}
			}
		},
		async PinCodesProposal({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmwasmWasmV1.tx.pinCodesProposal({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:PinCodesProposal:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:PinCodesProposal:Create Could not create message: ' + e.message)
				}
			}
		},
		async InstantiateContract2Proposal({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmwasmWasmV1.tx.instantiateContract2Proposal({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:InstantiateContract2Proposal:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:InstantiateContract2Proposal:Create Could not create message: ' + e.message)
				}
			}
		},
		async MsgStoreCodeResponse({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmwasmWasmV1.tx.msgStoreCodeResponse({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgStoreCodeResponse:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:MsgStoreCodeResponse:Create Could not create message: ' + e.message)
				}
			}
		},
		async QueryContractInfoResponse({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmwasmWasmV1.tx.queryContractInfoResponse({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryContractInfoResponse:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QueryContractInfoResponse:Create Could not create message: ' + e.message)
				}
			}
		},
		async QueryBuildAddressRequest({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmwasmWasmV1.tx.queryBuildAddressRequest({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryBuildAddressRequest:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QueryBuildAddressRequest:Create Could not create message: ' + e.message)
				}
			}
		},
		async MsgInstantiateContract2({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmwasmWasmV1.tx.msgInstantiateContract2({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgInstantiateContract2:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:MsgInstantiateContract2:Create Could not create message: ' + e.message)
				}
			}
		},
		async Model({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmwasmWasmV1.tx.model({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:Model:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:Model:Create Could not create message: ' + e.message)
				}
			}
		},
		async MigrateContractProposal({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmwasmWasmV1.tx.migrateContractProposal({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MigrateContractProposal:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:MigrateContractProposal:Create Could not create message: ' + e.message)
				}
			}
		},
		async MsgInstantiateContract({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmwasmWasmV1.tx.msgInstantiateContract({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgInstantiateContract:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:MsgInstantiateContract:Create Could not create message: ' + e.message)
				}
			}
		},
		async InstantiateContractProposal({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmwasmWasmV1.tx.instantiateContractProposal({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:InstantiateContractProposal:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:InstantiateContractProposal:Create Could not create message: ' + e.message)
				}
			}
		},
		async MsgStoreCode({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmwasmWasmV1.tx.msgStoreCode({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgStoreCode:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:MsgStoreCode:Create Could not create message: ' + e.message)
				}
			}
		},
		async MsgUpdateParamsResponse({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmwasmWasmV1.tx.msgUpdateParamsResponse({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgUpdateParamsResponse:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:MsgUpdateParamsResponse:Create Could not create message: ' + e.message)
				}
			}
		},
		async QueryBuildAddressResponse({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmwasmWasmV1.tx.queryBuildAddressResponse({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryBuildAddressResponse:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QueryBuildAddressResponse:Create Could not create message: ' + e.message)
				}
			}
		},
		
	}
}