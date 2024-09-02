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
				Connection: {},
				Connections: {},
				ClientConnections: {},
				ConnectionClientState: {},
				ConnectionConsensusState: {},
				ConnectionParams: {},
				
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
				getConnection: (state) => (params = { params: {}}) => {
					if (!(<any> params).query) {
						(<any> params).query=null
					}
			return state.Connection[JSON.stringify(params)] ?? {}
		},
				getConnections: (state) => (params = { params: {}}) => {
					if (!(<any> params).query) {
						(<any> params).query=null
					}
			return state.Connections[JSON.stringify(params)] ?? {}
		},
				getClientConnections: (state) => (params = { params: {}}) => {
					if (!(<any> params).query) {
						(<any> params).query=null
					}
			return state.ClientConnections[JSON.stringify(params)] ?? {}
		},
				getConnectionClientState: (state) => (params = { params: {}}) => {
					if (!(<any> params).query) {
						(<any> params).query=null
					}
			return state.ConnectionClientState[JSON.stringify(params)] ?? {}
		},
				getConnectionConsensusState: (state) => (params = { params: {}}) => {
					if (!(<any> params).query) {
						(<any> params).query=null
					}
			return state.ConnectionConsensusState[JSON.stringify(params)] ?? {}
		},
				getConnectionParams: (state) => (params = { params: {}}) => {
					if (!(<any> params).query) {
						(<any> params).query=null
					}
			return state.ConnectionParams[JSON.stringify(params)] ?? {}
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
			console.log('Vuex module: ibc.core.connection.v1 initialized!')
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
		
		
		
		 		
		
		
		async QueryConnection({ commit, rootGetters, getters }, { options: { subscribe, all} = { subscribe:false, all:false}, params, query=null }) {
			try {
				const key = params ?? {};
				const client = initClient(rootGetters);
				let value= (await client.IbcCoreConnectionV1.query.queryConnection( key.connection_id)).data
				
					
				commit('QUERY', { query: 'Connection', key: { params: {...key}, query}, value })
				if (subscribe) commit('SUBSCRIBE', { action: 'QueryConnection', payload: { options: { all }, params: {...key},query }})
				return getters['getConnection']( { params: {...key}, query}) ?? {}
			} catch (e) {
				throw new Error('QueryClient:QueryConnection API Node Unavailable. Could not perform query: ' + e.message)
				
			}
		},
		
		
		
		
		 		
		
		
		async QueryConnections({ commit, rootGetters, getters }, { options: { subscribe, all} = { subscribe:false, all:false}, params, query=null }) {
			try {
				const key = params ?? {};
				const client = initClient(rootGetters);
				let value= (await client.IbcCoreConnectionV1.query.queryConnections(query ?? undefined)).data
				
					
				while (all && (<any> value).pagination && (<any> value).pagination.next_key!=null) {
					let next_values=(await client.IbcCoreConnectionV1.query.queryConnections({...query ?? {}, 'pagination.key':(<any> value).pagination.next_key} as any)).data
					value = mergeResults(value, next_values);
				}
				commit('QUERY', { query: 'Connections', key: { params: {...key}, query}, value })
				if (subscribe) commit('SUBSCRIBE', { action: 'QueryConnections', payload: { options: { all }, params: {...key},query }})
				return getters['getConnections']( { params: {...key}, query}) ?? {}
			} catch (e) {
				throw new Error('QueryClient:QueryConnections API Node Unavailable. Could not perform query: ' + e.message)
				
			}
		},
		
		
		
		
		 		
		
		
		async QueryClientConnections({ commit, rootGetters, getters }, { options: { subscribe, all} = { subscribe:false, all:false}, params, query=null }) {
			try {
				const key = params ?? {};
				const client = initClient(rootGetters);
				let value= (await client.IbcCoreConnectionV1.query.queryClientConnections( key.client_id)).data
				
					
				commit('QUERY', { query: 'ClientConnections', key: { params: {...key}, query}, value })
				if (subscribe) commit('SUBSCRIBE', { action: 'QueryClientConnections', payload: { options: { all }, params: {...key},query }})
				return getters['getClientConnections']( { params: {...key}, query}) ?? {}
			} catch (e) {
				throw new Error('QueryClient:QueryClientConnections API Node Unavailable. Could not perform query: ' + e.message)
				
			}
		},
		
		
		
		
		 		
		
		
		async QueryConnectionClientState({ commit, rootGetters, getters }, { options: { subscribe, all} = { subscribe:false, all:false}, params, query=null }) {
			try {
				const key = params ?? {};
				const client = initClient(rootGetters);
				let value= (await client.IbcCoreConnectionV1.query.queryConnectionClientState( key.connection_id)).data
				
					
				commit('QUERY', { query: 'ConnectionClientState', key: { params: {...key}, query}, value })
				if (subscribe) commit('SUBSCRIBE', { action: 'QueryConnectionClientState', payload: { options: { all }, params: {...key},query }})
				return getters['getConnectionClientState']( { params: {...key}, query}) ?? {}
			} catch (e) {
				throw new Error('QueryClient:QueryConnectionClientState API Node Unavailable. Could not perform query: ' + e.message)
				
			}
		},
		
		
		
		
		 		
		
		
		async QueryConnectionConsensusState({ commit, rootGetters, getters }, { options: { subscribe, all} = { subscribe:false, all:false}, params, query=null }) {
			try {
				const key = params ?? {};
				const client = initClient(rootGetters);
				let value= (await client.IbcCoreConnectionV1.query.queryConnectionConsensusState( key.connection_id,  key.revision_number,  key.revision_height)).data
				
					
				commit('QUERY', { query: 'ConnectionConsensusState', key: { params: {...key}, query}, value })
				if (subscribe) commit('SUBSCRIBE', { action: 'QueryConnectionConsensusState', payload: { options: { all }, params: {...key},query }})
				return getters['getConnectionConsensusState']( { params: {...key}, query}) ?? {}
			} catch (e) {
				throw new Error('QueryClient:QueryConnectionConsensusState API Node Unavailable. Could not perform query: ' + e.message)
				
			}
		},
		
		
		
		
		 		
		
		
		async QueryConnectionParams({ commit, rootGetters, getters }, { options: { subscribe, all} = { subscribe:false, all:false}, params, query=null }) {
			try {
				const key = params ?? {};
				const client = initClient(rootGetters);
				let value= (await client.IbcCoreConnectionV1.query.queryConnectionParams()).data
				
					
				commit('QUERY', { query: 'ConnectionParams', key: { params: {...key}, query}, value })
				if (subscribe) commit('SUBSCRIBE', { action: 'QueryConnectionParams', payload: { options: { all }, params: {...key},query }})
				return getters['getConnectionParams']( { params: {...key}, query}) ?? {}
			} catch (e) {
				throw new Error('QueryClient:QueryConnectionParams API Node Unavailable. Could not perform query: ' + e.message)
				
			}
		},
		
		
		async sendMsgConnectionOpenInitResponse({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.IbcCoreConnectionV1.tx.sendMsgConnectionOpenInitResponse({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgConnectionOpenInitResponse:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:MsgConnectionOpenInitResponse:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendMsgConnectionOpenTry({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.IbcCoreConnectionV1.tx.sendMsgConnectionOpenTry({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgConnectionOpenTry:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:MsgConnectionOpenTry:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendMsgConnectionOpenTryResponse({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.IbcCoreConnectionV1.tx.sendMsgConnectionOpenTryResponse({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgConnectionOpenTryResponse:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:MsgConnectionOpenTryResponse:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendMsgConnectionOpenConfirmResponse({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.IbcCoreConnectionV1.tx.sendMsgConnectionOpenConfirmResponse({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgConnectionOpenConfirmResponse:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:MsgConnectionOpenConfirmResponse:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendMsgUpdateParams({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.IbcCoreConnectionV1.tx.sendMsgUpdateParams({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgUpdateParams:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:MsgUpdateParams:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendConnectionEnd({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.IbcCoreConnectionV1.tx.sendConnectionEnd({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:ConnectionEnd:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:ConnectionEnd:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendQueryConnectionRequest({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.IbcCoreConnectionV1.tx.sendQueryConnectionRequest({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryConnectionRequest:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QueryConnectionRequest:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendQueryConnectionConsensusStateRequest({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.IbcCoreConnectionV1.tx.sendQueryConnectionConsensusStateRequest({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryConnectionConsensusStateRequest:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QueryConnectionConsensusStateRequest:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendVersion({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.IbcCoreConnectionV1.tx.sendVersion({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:Version:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:Version:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendQueryClientConnectionsResponse({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.IbcCoreConnectionV1.tx.sendQueryClientConnectionsResponse({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryClientConnectionsResponse:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QueryClientConnectionsResponse:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendQueryConnectionParamsResponse({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.IbcCoreConnectionV1.tx.sendQueryConnectionParamsResponse({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryConnectionParamsResponse:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QueryConnectionParamsResponse:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendMsgUpdateParamsResponse({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.IbcCoreConnectionV1.tx.sendMsgUpdateParamsResponse({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgUpdateParamsResponse:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:MsgUpdateParamsResponse:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendQueryConnectionClientStateResponse({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.IbcCoreConnectionV1.tx.sendQueryConnectionClientStateResponse({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryConnectionClientStateResponse:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QueryConnectionClientStateResponse:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendGenesisState({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.IbcCoreConnectionV1.tx.sendGenesisState({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:GenesisState:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:GenesisState:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendConnectionPaths({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.IbcCoreConnectionV1.tx.sendConnectionPaths({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:ConnectionPaths:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:ConnectionPaths:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendQueryConnectionConsensusStateResponse({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.IbcCoreConnectionV1.tx.sendQueryConnectionConsensusStateResponse({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryConnectionConsensusStateResponse:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QueryConnectionConsensusStateResponse:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendQueryConnectionResponse({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.IbcCoreConnectionV1.tx.sendQueryConnectionResponse({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryConnectionResponse:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QueryConnectionResponse:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendMsgConnectionOpenAck({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.IbcCoreConnectionV1.tx.sendMsgConnectionOpenAck({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgConnectionOpenAck:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:MsgConnectionOpenAck:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendParams({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.IbcCoreConnectionV1.tx.sendParams({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:Params:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:Params:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendQueryClientConnectionsRequest({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.IbcCoreConnectionV1.tx.sendQueryClientConnectionsRequest({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryClientConnectionsRequest:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QueryClientConnectionsRequest:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendMsgConnectionOpenConfirm({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.IbcCoreConnectionV1.tx.sendMsgConnectionOpenConfirm({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgConnectionOpenConfirm:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:MsgConnectionOpenConfirm:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendQueryConnectionsRequest({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.IbcCoreConnectionV1.tx.sendQueryConnectionsRequest({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryConnectionsRequest:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QueryConnectionsRequest:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendQueryConnectionClientStateRequest({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.IbcCoreConnectionV1.tx.sendQueryConnectionClientStateRequest({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryConnectionClientStateRequest:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QueryConnectionClientStateRequest:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendIdentifiedConnection({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.IbcCoreConnectionV1.tx.sendIdentifiedConnection({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:IdentifiedConnection:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:IdentifiedConnection:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendClientPaths({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.IbcCoreConnectionV1.tx.sendClientPaths({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:ClientPaths:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:ClientPaths:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendMsgConnectionOpenInit({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.IbcCoreConnectionV1.tx.sendMsgConnectionOpenInit({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgConnectionOpenInit:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:MsgConnectionOpenInit:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendMsgConnectionOpenAckResponse({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.IbcCoreConnectionV1.tx.sendMsgConnectionOpenAckResponse({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgConnectionOpenAckResponse:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:MsgConnectionOpenAckResponse:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendQueryConnectionsResponse({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.IbcCoreConnectionV1.tx.sendQueryConnectionsResponse({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryConnectionsResponse:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QueryConnectionsResponse:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendQueryConnectionParamsRequest({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.IbcCoreConnectionV1.tx.sendQueryConnectionParamsRequest({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryConnectionParamsRequest:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QueryConnectionParamsRequest:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendCounterparty({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.IbcCoreConnectionV1.tx.sendCounterparty({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:Counterparty:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:Counterparty:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		
		async MsgConnectionOpenInitResponse({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.IbcCoreConnectionV1.tx.msgConnectionOpenInitResponse({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgConnectionOpenInitResponse:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:MsgConnectionOpenInitResponse:Create Could not create message: ' + e.message)
				}
			}
		},
		async MsgConnectionOpenTry({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.IbcCoreConnectionV1.tx.msgConnectionOpenTry({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgConnectionOpenTry:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:MsgConnectionOpenTry:Create Could not create message: ' + e.message)
				}
			}
		},
		async MsgConnectionOpenTryResponse({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.IbcCoreConnectionV1.tx.msgConnectionOpenTryResponse({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgConnectionOpenTryResponse:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:MsgConnectionOpenTryResponse:Create Could not create message: ' + e.message)
				}
			}
		},
		async MsgConnectionOpenConfirmResponse({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.IbcCoreConnectionV1.tx.msgConnectionOpenConfirmResponse({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgConnectionOpenConfirmResponse:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:MsgConnectionOpenConfirmResponse:Create Could not create message: ' + e.message)
				}
			}
		},
		async MsgUpdateParams({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.IbcCoreConnectionV1.tx.msgUpdateParams({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgUpdateParams:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:MsgUpdateParams:Create Could not create message: ' + e.message)
				}
			}
		},
		async ConnectionEnd({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.IbcCoreConnectionV1.tx.connectionEnd({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:ConnectionEnd:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:ConnectionEnd:Create Could not create message: ' + e.message)
				}
			}
		},
		async QueryConnectionRequest({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.IbcCoreConnectionV1.tx.queryConnectionRequest({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryConnectionRequest:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QueryConnectionRequest:Create Could not create message: ' + e.message)
				}
			}
		},
		async QueryConnectionConsensusStateRequest({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.IbcCoreConnectionV1.tx.queryConnectionConsensusStateRequest({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryConnectionConsensusStateRequest:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QueryConnectionConsensusStateRequest:Create Could not create message: ' + e.message)
				}
			}
		},
		async Version({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.IbcCoreConnectionV1.tx.version({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:Version:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:Version:Create Could not create message: ' + e.message)
				}
			}
		},
		async QueryClientConnectionsResponse({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.IbcCoreConnectionV1.tx.queryClientConnectionsResponse({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryClientConnectionsResponse:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QueryClientConnectionsResponse:Create Could not create message: ' + e.message)
				}
			}
		},
		async QueryConnectionParamsResponse({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.IbcCoreConnectionV1.tx.queryConnectionParamsResponse({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryConnectionParamsResponse:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QueryConnectionParamsResponse:Create Could not create message: ' + e.message)
				}
			}
		},
		async MsgUpdateParamsResponse({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.IbcCoreConnectionV1.tx.msgUpdateParamsResponse({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgUpdateParamsResponse:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:MsgUpdateParamsResponse:Create Could not create message: ' + e.message)
				}
			}
		},
		async QueryConnectionClientStateResponse({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.IbcCoreConnectionV1.tx.queryConnectionClientStateResponse({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryConnectionClientStateResponse:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QueryConnectionClientStateResponse:Create Could not create message: ' + e.message)
				}
			}
		},
		async GenesisState({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.IbcCoreConnectionV1.tx.genesisState({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:GenesisState:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:GenesisState:Create Could not create message: ' + e.message)
				}
			}
		},
		async ConnectionPaths({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.IbcCoreConnectionV1.tx.connectionPaths({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:ConnectionPaths:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:ConnectionPaths:Create Could not create message: ' + e.message)
				}
			}
		},
		async QueryConnectionConsensusStateResponse({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.IbcCoreConnectionV1.tx.queryConnectionConsensusStateResponse({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryConnectionConsensusStateResponse:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QueryConnectionConsensusStateResponse:Create Could not create message: ' + e.message)
				}
			}
		},
		async QueryConnectionResponse({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.IbcCoreConnectionV1.tx.queryConnectionResponse({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryConnectionResponse:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QueryConnectionResponse:Create Could not create message: ' + e.message)
				}
			}
		},
		async MsgConnectionOpenAck({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.IbcCoreConnectionV1.tx.msgConnectionOpenAck({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgConnectionOpenAck:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:MsgConnectionOpenAck:Create Could not create message: ' + e.message)
				}
			}
		},
		async Params({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.IbcCoreConnectionV1.tx.params({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:Params:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:Params:Create Could not create message: ' + e.message)
				}
			}
		},
		async QueryClientConnectionsRequest({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.IbcCoreConnectionV1.tx.queryClientConnectionsRequest({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryClientConnectionsRequest:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QueryClientConnectionsRequest:Create Could not create message: ' + e.message)
				}
			}
		},
		async MsgConnectionOpenConfirm({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.IbcCoreConnectionV1.tx.msgConnectionOpenConfirm({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgConnectionOpenConfirm:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:MsgConnectionOpenConfirm:Create Could not create message: ' + e.message)
				}
			}
		},
		async QueryConnectionsRequest({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.IbcCoreConnectionV1.tx.queryConnectionsRequest({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryConnectionsRequest:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QueryConnectionsRequest:Create Could not create message: ' + e.message)
				}
			}
		},
		async QueryConnectionClientStateRequest({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.IbcCoreConnectionV1.tx.queryConnectionClientStateRequest({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryConnectionClientStateRequest:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QueryConnectionClientStateRequest:Create Could not create message: ' + e.message)
				}
			}
		},
		async IdentifiedConnection({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.IbcCoreConnectionV1.tx.identifiedConnection({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:IdentifiedConnection:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:IdentifiedConnection:Create Could not create message: ' + e.message)
				}
			}
		},
		async ClientPaths({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.IbcCoreConnectionV1.tx.clientPaths({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:ClientPaths:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:ClientPaths:Create Could not create message: ' + e.message)
				}
			}
		},
		async MsgConnectionOpenInit({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.IbcCoreConnectionV1.tx.msgConnectionOpenInit({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgConnectionOpenInit:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:MsgConnectionOpenInit:Create Could not create message: ' + e.message)
				}
			}
		},
		async MsgConnectionOpenAckResponse({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.IbcCoreConnectionV1.tx.msgConnectionOpenAckResponse({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgConnectionOpenAckResponse:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:MsgConnectionOpenAckResponse:Create Could not create message: ' + e.message)
				}
			}
		},
		async QueryConnectionsResponse({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.IbcCoreConnectionV1.tx.queryConnectionsResponse({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryConnectionsResponse:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QueryConnectionsResponse:Create Could not create message: ' + e.message)
				}
			}
		},
		async QueryConnectionParamsRequest({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.IbcCoreConnectionV1.tx.queryConnectionParamsRequest({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryConnectionParamsRequest:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QueryConnectionParamsRequest:Create Could not create message: ' + e.message)
				}
			}
		},
		async Counterparty({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.IbcCoreConnectionV1.tx.counterparty({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:Counterparty:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:Counterparty:Create Could not create message: ' + e.message)
				}
			}
		},
		
	}
}