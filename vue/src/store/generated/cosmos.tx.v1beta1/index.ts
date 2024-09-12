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
				Simulate: {},
				GetTx: {},
				BroadcastTx: {},
				GetTxsEvent: {},
				GetBlockWithTxs: {},
				TxDecode: {},
				TxEncode: {},
				TxEncodeAmino: {},
				TxDecodeAmino: {},
				
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
				getSimulate: (state) => (params = { params: {}}) => {
					if (!(<any> params).query) {
						(<any> params).query=null
					}
			return state.Simulate[JSON.stringify(params)] ?? {}
		},
				getGetTx: (state) => (params = { params: {}}) => {
					if (!(<any> params).query) {
						(<any> params).query=null
					}
			return state.GetTx[JSON.stringify(params)] ?? {}
		},
				getBroadcastTx: (state) => (params = { params: {}}) => {
					if (!(<any> params).query) {
						(<any> params).query=null
					}
			return state.BroadcastTx[JSON.stringify(params)] ?? {}
		},
				getGetTxsEvent: (state) => (params = { params: {}}) => {
					if (!(<any> params).query) {
						(<any> params).query=null
					}
			return state.GetTxsEvent[JSON.stringify(params)] ?? {}
		},
				getGetBlockWithTxs: (state) => (params = { params: {}}) => {
					if (!(<any> params).query) {
						(<any> params).query=null
					}
			return state.GetBlockWithTxs[JSON.stringify(params)] ?? {}
		},
				getTxDecode: (state) => (params = { params: {}}) => {
					if (!(<any> params).query) {
						(<any> params).query=null
					}
			return state.TxDecode[JSON.stringify(params)] ?? {}
		},
				getTxEncode: (state) => (params = { params: {}}) => {
					if (!(<any> params).query) {
						(<any> params).query=null
					}
			return state.TxEncode[JSON.stringify(params)] ?? {}
		},
				getTxEncodeAmino: (state) => (params = { params: {}}) => {
					if (!(<any> params).query) {
						(<any> params).query=null
					}
			return state.TxEncodeAmino[JSON.stringify(params)] ?? {}
		},
				getTxDecodeAmino: (state) => (params = { params: {}}) => {
					if (!(<any> params).query) {
						(<any> params).query=null
					}
			return state.TxDecodeAmino[JSON.stringify(params)] ?? {}
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
			console.log('Vuex module: cosmos.tx.v1beta1 initialized!')
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
		
		
		
		 		
		
		
		async ServiceSimulate({ commit, rootGetters, getters }, { options: { subscribe, all} = { subscribe:false, all:false}, params, query=null }) {
			try {
				const key = params ?? {};
				const client = initClient(rootGetters);
				let value= (await client.CosmosTxV1Beta1.query.serviceSimulate({...key})).data
				
					
				commit('QUERY', { query: 'Simulate', key: { params: {...key}, query}, value })
				if (subscribe) commit('SUBSCRIBE', { action: 'ServiceSimulate', payload: { options: { all }, params: {...key},query }})
				return getters['getSimulate']( { params: {...key}, query}) ?? {}
			} catch (e) {
				throw new Error('QueryClient:ServiceSimulate API Node Unavailable. Could not perform query: ' + e.message)
				
			}
		},
		
		
		
		
		 		
		
		
		async ServiceGetTx({ commit, rootGetters, getters }, { options: { subscribe, all} = { subscribe:false, all:false}, params, query=null }) {
			try {
				const key = params ?? {};
				const client = initClient(rootGetters);
				let value= (await client.CosmosTxV1Beta1.query.serviceGetTx( key.hash)).data
				
					
				commit('QUERY', { query: 'GetTx', key: { params: {...key}, query}, value })
				if (subscribe) commit('SUBSCRIBE', { action: 'ServiceGetTx', payload: { options: { all }, params: {...key},query }})
				return getters['getGetTx']( { params: {...key}, query}) ?? {}
			} catch (e) {
				throw new Error('QueryClient:ServiceGetTx API Node Unavailable. Could not perform query: ' + e.message)
				
			}
		},
		
		
		
		
		 		
		
		
		async ServiceBroadcastTx({ commit, rootGetters, getters }, { options: { subscribe, all} = { subscribe:false, all:false}, params, query=null }) {
			try {
				const key = params ?? {};
				const client = initClient(rootGetters);
				let value= (await client.CosmosTxV1Beta1.query.serviceBroadcastTx({...key})).data
				
					
				commit('QUERY', { query: 'BroadcastTx', key: { params: {...key}, query}, value })
				if (subscribe) commit('SUBSCRIBE', { action: 'ServiceBroadcastTx', payload: { options: { all }, params: {...key},query }})
				return getters['getBroadcastTx']( { params: {...key}, query}) ?? {}
			} catch (e) {
				throw new Error('QueryClient:ServiceBroadcastTx API Node Unavailable. Could not perform query: ' + e.message)
				
			}
		},
		
		
		
		
		 		
		
		
		async ServiceGetTxsEvent({ commit, rootGetters, getters }, { options: { subscribe, all} = { subscribe:false, all:false}, params, query=null }) {
			try {
				const key = params ?? {};
				const client = initClient(rootGetters);
				let value= (await client.CosmosTxV1Beta1.query.serviceGetTxsEvent(query ?? undefined)).data
				
					
				while (all && (<any> value).pagination && (<any> value).pagination.next_key!=null) {
					let next_values=(await client.CosmosTxV1Beta1.query.serviceGetTxsEvent({...query ?? {}, 'pagination.key':(<any> value).pagination.next_key} as any)).data
					value = mergeResults(value, next_values);
				}
				commit('QUERY', { query: 'GetTxsEvent', key: { params: {...key}, query}, value })
				if (subscribe) commit('SUBSCRIBE', { action: 'ServiceGetTxsEvent', payload: { options: { all }, params: {...key},query }})
				return getters['getGetTxsEvent']( { params: {...key}, query}) ?? {}
			} catch (e) {
				throw new Error('QueryClient:ServiceGetTxsEvent API Node Unavailable. Could not perform query: ' + e.message)
				
			}
		},
		
		
		
		
		 		
		
		
		async ServiceGetBlockWithTxs({ commit, rootGetters, getters }, { options: { subscribe, all} = { subscribe:false, all:false}, params, query=null }) {
			try {
				const key = params ?? {};
				const client = initClient(rootGetters);
				let value= (await client.CosmosTxV1Beta1.query.serviceGetBlockWithTxs( key.height, query ?? undefined)).data
				
					
				while (all && (<any> value).pagination && (<any> value).pagination.next_key!=null) {
					let next_values=(await client.CosmosTxV1Beta1.query.serviceGetBlockWithTxs( key.height, {...query ?? {}, 'pagination.key':(<any> value).pagination.next_key} as any)).data
					value = mergeResults(value, next_values);
				}
				commit('QUERY', { query: 'GetBlockWithTxs', key: { params: {...key}, query}, value })
				if (subscribe) commit('SUBSCRIBE', { action: 'ServiceGetBlockWithTxs', payload: { options: { all }, params: {...key},query }})
				return getters['getGetBlockWithTxs']( { params: {...key}, query}) ?? {}
			} catch (e) {
				throw new Error('QueryClient:ServiceGetBlockWithTxs API Node Unavailable. Could not perform query: ' + e.message)
				
			}
		},
		
		
		
		
		 		
		
		
		async ServiceTxDecode({ commit, rootGetters, getters }, { options: { subscribe, all} = { subscribe:false, all:false}, params, query=null }) {
			try {
				const key = params ?? {};
				const client = initClient(rootGetters);
				let value= (await client.CosmosTxV1Beta1.query.serviceTxDecode({...key})).data
				
					
				commit('QUERY', { query: 'TxDecode', key: { params: {...key}, query}, value })
				if (subscribe) commit('SUBSCRIBE', { action: 'ServiceTxDecode', payload: { options: { all }, params: {...key},query }})
				return getters['getTxDecode']( { params: {...key}, query}) ?? {}
			} catch (e) {
				throw new Error('QueryClient:ServiceTxDecode API Node Unavailable. Could not perform query: ' + e.message)
				
			}
		},
		
		
		
		
		 		
		
		
		async ServiceTxEncode({ commit, rootGetters, getters }, { options: { subscribe, all} = { subscribe:false, all:false}, params, query=null }) {
			try {
				const key = params ?? {};
				const client = initClient(rootGetters);
				let value= (await client.CosmosTxV1Beta1.query.serviceTxEncode({...key})).data
				
					
				commit('QUERY', { query: 'TxEncode', key: { params: {...key}, query}, value })
				if (subscribe) commit('SUBSCRIBE', { action: 'ServiceTxEncode', payload: { options: { all }, params: {...key},query }})
				return getters['getTxEncode']( { params: {...key}, query}) ?? {}
			} catch (e) {
				throw new Error('QueryClient:ServiceTxEncode API Node Unavailable. Could not perform query: ' + e.message)
				
			}
		},
		
		
		
		
		 		
		
		
		async ServiceTxEncodeAmino({ commit, rootGetters, getters }, { options: { subscribe, all} = { subscribe:false, all:false}, params, query=null }) {
			try {
				const key = params ?? {};
				const client = initClient(rootGetters);
				let value= (await client.CosmosTxV1Beta1.query.serviceTxEncodeAmino({...key})).data
				
					
				commit('QUERY', { query: 'TxEncodeAmino', key: { params: {...key}, query}, value })
				if (subscribe) commit('SUBSCRIBE', { action: 'ServiceTxEncodeAmino', payload: { options: { all }, params: {...key},query }})
				return getters['getTxEncodeAmino']( { params: {...key}, query}) ?? {}
			} catch (e) {
				throw new Error('QueryClient:ServiceTxEncodeAmino API Node Unavailable. Could not perform query: ' + e.message)
				
			}
		},
		
		
		
		
		 		
		
		
		async ServiceTxDecodeAmino({ commit, rootGetters, getters }, { options: { subscribe, all} = { subscribe:false, all:false}, params, query=null }) {
			try {
				const key = params ?? {};
				const client = initClient(rootGetters);
				let value= (await client.CosmosTxV1Beta1.query.serviceTxDecodeAmino({...key})).data
				
					
				commit('QUERY', { query: 'TxDecodeAmino', key: { params: {...key}, query}, value })
				if (subscribe) commit('SUBSCRIBE', { action: 'ServiceTxDecodeAmino', payload: { options: { all }, params: {...key},query }})
				return getters['getTxDecodeAmino']( { params: {...key}, query}) ?? {}
			} catch (e) {
				throw new Error('QueryClient:ServiceTxDecodeAmino API Node Unavailable. Could not perform query: ' + e.message)
				
			}
		},
		
		
		async sendFee({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosTxV1Beta1.tx.sendFee({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:Fee:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:Fee:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendTxDecodeAminoResponse({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosTxV1Beta1.tx.sendTxDecodeAminoResponse({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:TxDecodeAminoResponse:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:TxDecodeAminoResponse:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendModeInfo({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosTxV1Beta1.tx.sendModeInfo({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:ModeInfo:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:ModeInfo:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendTip({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosTxV1Beta1.tx.sendTip({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:Tip:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:Tip:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendGetTxResponse({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosTxV1Beta1.tx.sendGetTxResponse({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:GetTxResponse:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:GetTxResponse:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendGetTxsEventRequest({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosTxV1Beta1.tx.sendGetTxsEventRequest({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:GetTxsEventRequest:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:GetTxsEventRequest:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendTxEncodeAminoResponse({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosTxV1Beta1.tx.sendTxEncodeAminoResponse({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:TxEncodeAminoResponse:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:TxEncodeAminoResponse:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendModeInfo_Multi({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosTxV1Beta1.tx.sendModeInfo_Multi({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:ModeInfo_Multi:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:ModeInfo_Multi:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendGetBlockWithTxsResponse({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosTxV1Beta1.tx.sendGetBlockWithTxsResponse({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:GetBlockWithTxsResponse:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:GetBlockWithTxsResponse:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendTxEncodeResponse({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosTxV1Beta1.tx.sendTxEncodeResponse({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:TxEncodeResponse:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:TxEncodeResponse:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendTx({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosTxV1Beta1.tx.sendTx({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:Tx:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:Tx:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendSignDoc({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosTxV1Beta1.tx.sendSignDoc({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:SignDoc:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:SignDoc:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendSignerInfo({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosTxV1Beta1.tx.sendSignerInfo({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:SignerInfo:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:SignerInfo:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendBroadcastTxRequest({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosTxV1Beta1.tx.sendBroadcastTxRequest({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:BroadcastTxRequest:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:BroadcastTxRequest:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendGetBlockWithTxsRequest({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosTxV1Beta1.tx.sendGetBlockWithTxsRequest({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:GetBlockWithTxsRequest:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:GetBlockWithTxsRequest:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendSignDocDirectAux({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosTxV1Beta1.tx.sendSignDocDirectAux({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:SignDocDirectAux:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:SignDocDirectAux:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendTxDecodeRequest({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosTxV1Beta1.tx.sendTxDecodeRequest({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:TxDecodeRequest:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:TxDecodeRequest:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendTxEncodeAminoRequest({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosTxV1Beta1.tx.sendTxEncodeAminoRequest({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:TxEncodeAminoRequest:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:TxEncodeAminoRequest:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendAuthInfo({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosTxV1Beta1.tx.sendAuthInfo({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:AuthInfo:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:AuthInfo:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendModeInfo_Single({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosTxV1Beta1.tx.sendModeInfo_Single({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:ModeInfo_Single:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:ModeInfo_Single:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendTxEncodeRequest({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosTxV1Beta1.tx.sendTxEncodeRequest({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:TxEncodeRequest:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:TxEncodeRequest:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendAuxSignerData({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosTxV1Beta1.tx.sendAuxSignerData({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:AuxSignerData:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:AuxSignerData:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendTxDecodeResponse({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosTxV1Beta1.tx.sendTxDecodeResponse({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:TxDecodeResponse:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:TxDecodeResponse:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendTxRaw({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosTxV1Beta1.tx.sendTxRaw({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:TxRaw:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:TxRaw:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendSimulateRequest({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosTxV1Beta1.tx.sendSimulateRequest({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:SimulateRequest:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:SimulateRequest:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendSimulateResponse({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosTxV1Beta1.tx.sendSimulateResponse({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:SimulateResponse:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:SimulateResponse:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendGetTxRequest({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosTxV1Beta1.tx.sendGetTxRequest({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:GetTxRequest:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:GetTxRequest:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendTxDecodeAminoRequest({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosTxV1Beta1.tx.sendTxDecodeAminoRequest({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:TxDecodeAminoRequest:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:TxDecodeAminoRequest:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendTxBody({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosTxV1Beta1.tx.sendTxBody({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:TxBody:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:TxBody:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendGetTxsEventResponse({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosTxV1Beta1.tx.sendGetTxsEventResponse({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:GetTxsEventResponse:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:GetTxsEventResponse:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendBroadcastTxResponse({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosTxV1Beta1.tx.sendBroadcastTxResponse({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:BroadcastTxResponse:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:BroadcastTxResponse:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		
		async Fee({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosTxV1Beta1.tx.fee({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:Fee:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:Fee:Create Could not create message: ' + e.message)
				}
			}
		},
		async TxDecodeAminoResponse({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosTxV1Beta1.tx.txDecodeAminoResponse({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:TxDecodeAminoResponse:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:TxDecodeAminoResponse:Create Could not create message: ' + e.message)
				}
			}
		},
		async ModeInfo({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosTxV1Beta1.tx.modeInfo({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:ModeInfo:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:ModeInfo:Create Could not create message: ' + e.message)
				}
			}
		},
		async Tip({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosTxV1Beta1.tx.tip({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:Tip:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:Tip:Create Could not create message: ' + e.message)
				}
			}
		},
		async GetTxResponse({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosTxV1Beta1.tx.getTxResponse({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:GetTxResponse:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:GetTxResponse:Create Could not create message: ' + e.message)
				}
			}
		},
		async GetTxsEventRequest({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosTxV1Beta1.tx.getTxsEventRequest({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:GetTxsEventRequest:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:GetTxsEventRequest:Create Could not create message: ' + e.message)
				}
			}
		},
		async TxEncodeAminoResponse({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosTxV1Beta1.tx.txEncodeAminoResponse({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:TxEncodeAminoResponse:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:TxEncodeAminoResponse:Create Could not create message: ' + e.message)
				}
			}
		},
		async ModeInfo_Multi({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosTxV1Beta1.tx.modeInfoMulti({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:ModeInfo_Multi:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:ModeInfo_Multi:Create Could not create message: ' + e.message)
				}
			}
		},
		async GetBlockWithTxsResponse({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosTxV1Beta1.tx.getBlockWithTxsResponse({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:GetBlockWithTxsResponse:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:GetBlockWithTxsResponse:Create Could not create message: ' + e.message)
				}
			}
		},
		async TxEncodeResponse({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosTxV1Beta1.tx.txEncodeResponse({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:TxEncodeResponse:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:TxEncodeResponse:Create Could not create message: ' + e.message)
				}
			}
		},
		async Tx({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosTxV1Beta1.tx.tx({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:Tx:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:Tx:Create Could not create message: ' + e.message)
				}
			}
		},
		async SignDoc({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosTxV1Beta1.tx.signDoc({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:SignDoc:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:SignDoc:Create Could not create message: ' + e.message)
				}
			}
		},
		async SignerInfo({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosTxV1Beta1.tx.signerInfo({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:SignerInfo:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:SignerInfo:Create Could not create message: ' + e.message)
				}
			}
		},
		async BroadcastTxRequest({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosTxV1Beta1.tx.broadcastTxRequest({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:BroadcastTxRequest:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:BroadcastTxRequest:Create Could not create message: ' + e.message)
				}
			}
		},
		async GetBlockWithTxsRequest({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosTxV1Beta1.tx.getBlockWithTxsRequest({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:GetBlockWithTxsRequest:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:GetBlockWithTxsRequest:Create Could not create message: ' + e.message)
				}
			}
		},
		async SignDocDirectAux({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosTxV1Beta1.tx.signDocDirectAux({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:SignDocDirectAux:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:SignDocDirectAux:Create Could not create message: ' + e.message)
				}
			}
		},
		async TxDecodeRequest({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosTxV1Beta1.tx.txDecodeRequest({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:TxDecodeRequest:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:TxDecodeRequest:Create Could not create message: ' + e.message)
				}
			}
		},
		async TxEncodeAminoRequest({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosTxV1Beta1.tx.txEncodeAminoRequest({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:TxEncodeAminoRequest:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:TxEncodeAminoRequest:Create Could not create message: ' + e.message)
				}
			}
		},
		async AuthInfo({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosTxV1Beta1.tx.authInfo({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:AuthInfo:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:AuthInfo:Create Could not create message: ' + e.message)
				}
			}
		},
		async ModeInfo_Single({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosTxV1Beta1.tx.modeInfoSingle({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:ModeInfo_Single:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:ModeInfo_Single:Create Could not create message: ' + e.message)
				}
			}
		},
		async TxEncodeRequest({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosTxV1Beta1.tx.txEncodeRequest({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:TxEncodeRequest:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:TxEncodeRequest:Create Could not create message: ' + e.message)
				}
			}
		},
		async AuxSignerData({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosTxV1Beta1.tx.auxSignerData({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:AuxSignerData:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:AuxSignerData:Create Could not create message: ' + e.message)
				}
			}
		},
		async TxDecodeResponse({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosTxV1Beta1.tx.txDecodeResponse({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:TxDecodeResponse:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:TxDecodeResponse:Create Could not create message: ' + e.message)
				}
			}
		},
		async TxRaw({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosTxV1Beta1.tx.txRaw({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:TxRaw:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:TxRaw:Create Could not create message: ' + e.message)
				}
			}
		},
		async SimulateRequest({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosTxV1Beta1.tx.simulateRequest({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:SimulateRequest:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:SimulateRequest:Create Could not create message: ' + e.message)
				}
			}
		},
		async SimulateResponse({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosTxV1Beta1.tx.simulateResponse({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:SimulateResponse:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:SimulateResponse:Create Could not create message: ' + e.message)
				}
			}
		},
		async GetTxRequest({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosTxV1Beta1.tx.getTxRequest({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:GetTxRequest:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:GetTxRequest:Create Could not create message: ' + e.message)
				}
			}
		},
		async TxDecodeAminoRequest({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosTxV1Beta1.tx.txDecodeAminoRequest({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:TxDecodeAminoRequest:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:TxDecodeAminoRequest:Create Could not create message: ' + e.message)
				}
			}
		},
		async TxBody({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosTxV1Beta1.tx.txBody({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:TxBody:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:TxBody:Create Could not create message: ' + e.message)
				}
			}
		},
		async GetTxsEventResponse({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosTxV1Beta1.tx.getTxsEventResponse({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:GetTxsEventResponse:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:GetTxsEventResponse:Create Could not create message: ' + e.message)
				}
			}
		},
		async BroadcastTxResponse({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosTxV1Beta1.tx.broadcastTxResponse({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:BroadcastTxResponse:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:BroadcastTxResponse:Create Could not create message: ' + e.message)
				}
			}
		},
		
	}
}