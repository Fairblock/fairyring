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
				IncentivizedPackets: {},
				IncentivizedPacket: {},
				IncentivizedPacketsForChannel: {},
				TotalRecvFees: {},
				TotalAckFees: {},
				TotalTimeoutFees: {},
				Payee: {},
				CounterpartyPayee: {},
				FeeEnabledChannels: {},
				FeeEnabledChannel: {},
				
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
				getIncentivizedPackets: (state) => (params = { params: {}}) => {
					if (!(<any> params).query) {
						(<any> params).query=null
					}
			return state.IncentivizedPackets[JSON.stringify(params)] ?? {}
		},
				getIncentivizedPacket: (state) => (params = { params: {}}) => {
					if (!(<any> params).query) {
						(<any> params).query=null
					}
			return state.IncentivizedPacket[JSON.stringify(params)] ?? {}
		},
				getIncentivizedPacketsForChannel: (state) => (params = { params: {}}) => {
					if (!(<any> params).query) {
						(<any> params).query=null
					}
			return state.IncentivizedPacketsForChannel[JSON.stringify(params)] ?? {}
		},
				getTotalRecvFees: (state) => (params = { params: {}}) => {
					if (!(<any> params).query) {
						(<any> params).query=null
					}
			return state.TotalRecvFees[JSON.stringify(params)] ?? {}
		},
				getTotalAckFees: (state) => (params = { params: {}}) => {
					if (!(<any> params).query) {
						(<any> params).query=null
					}
			return state.TotalAckFees[JSON.stringify(params)] ?? {}
		},
				getTotalTimeoutFees: (state) => (params = { params: {}}) => {
					if (!(<any> params).query) {
						(<any> params).query=null
					}
			return state.TotalTimeoutFees[JSON.stringify(params)] ?? {}
		},
				getPayee: (state) => (params = { params: {}}) => {
					if (!(<any> params).query) {
						(<any> params).query=null
					}
			return state.Payee[JSON.stringify(params)] ?? {}
		},
				getCounterpartyPayee: (state) => (params = { params: {}}) => {
					if (!(<any> params).query) {
						(<any> params).query=null
					}
			return state.CounterpartyPayee[JSON.stringify(params)] ?? {}
		},
				getFeeEnabledChannels: (state) => (params = { params: {}}) => {
					if (!(<any> params).query) {
						(<any> params).query=null
					}
			return state.FeeEnabledChannels[JSON.stringify(params)] ?? {}
		},
				getFeeEnabledChannel: (state) => (params = { params: {}}) => {
					if (!(<any> params).query) {
						(<any> params).query=null
					}
			return state.FeeEnabledChannel[JSON.stringify(params)] ?? {}
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
			console.log('Vuex module: ibc.applications.fee.v1 initialized!')
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
		
		
		
		 		
		
		
		async QueryIncentivizedPackets({ commit, rootGetters, getters }, { options: { subscribe, all} = { subscribe:false, all:false}, params, query=null }) {
			try {
				const key = params ?? {};
				const client = initClient(rootGetters);
				let value= (await client.IbcApplicationsFeeV1.query.queryIncentivizedPackets(query ?? undefined)).data
				
					
				while (all && (<any> value).pagination && (<any> value).pagination.next_key!=null) {
					let next_values=(await client.IbcApplicationsFeeV1.query.queryIncentivizedPackets({...query ?? {}, 'pagination.key':(<any> value).pagination.next_key} as any)).data
					value = mergeResults(value, next_values);
				}
				commit('QUERY', { query: 'IncentivizedPackets', key: { params: {...key}, query}, value })
				if (subscribe) commit('SUBSCRIBE', { action: 'QueryIncentivizedPackets', payload: { options: { all }, params: {...key},query }})
				return getters['getIncentivizedPackets']( { params: {...key}, query}) ?? {}
			} catch (e) {
				throw new Error('QueryClient:QueryIncentivizedPackets API Node Unavailable. Could not perform query: ' + e.message)
				
			}
		},
		
		
		
		
		 		
		
		
		async QueryIncentivizedPacket({ commit, rootGetters, getters }, { options: { subscribe, all} = { subscribe:false, all:false}, params, query=null }) {
			try {
				const key = params ?? {};
				const client = initClient(rootGetters);
				let value= (await client.IbcApplicationsFeeV1.query.queryIncentivizedPacket( key.packet_id.channel_id,  key.packet_id.port_id,  key.packet_id.sequence)).data
				
					
				commit('QUERY', { query: 'IncentivizedPacket', key: { params: {...key}, query}, value })
				if (subscribe) commit('SUBSCRIBE', { action: 'QueryIncentivizedPacket', payload: { options: { all }, params: {...key},query }})
				return getters['getIncentivizedPacket']( { params: {...key}, query}) ?? {}
			} catch (e) {
				throw new Error('QueryClient:QueryIncentivizedPacket API Node Unavailable. Could not perform query: ' + e.message)
				
			}
		},
		
		
		
		
		 		
		
		
		async QueryIncentivizedPacketsForChannel({ commit, rootGetters, getters }, { options: { subscribe, all} = { subscribe:false, all:false}, params, query=null }) {
			try {
				const key = params ?? {};
				const client = initClient(rootGetters);
				let value= (await client.IbcApplicationsFeeV1.query.queryIncentivizedPacketsForChannel( key.channel_id,  key.port_id, query ?? undefined)).data
				
					
				while (all && (<any> value).pagination && (<any> value).pagination.next_key!=null) {
					let next_values=(await client.IbcApplicationsFeeV1.query.queryIncentivizedPacketsForChannel( key.channel_id,  key.port_id, {...query ?? {}, 'pagination.key':(<any> value).pagination.next_key} as any)).data
					value = mergeResults(value, next_values);
				}
				commit('QUERY', { query: 'IncentivizedPacketsForChannel', key: { params: {...key}, query}, value })
				if (subscribe) commit('SUBSCRIBE', { action: 'QueryIncentivizedPacketsForChannel', payload: { options: { all }, params: {...key},query }})
				return getters['getIncentivizedPacketsForChannel']( { params: {...key}, query}) ?? {}
			} catch (e) {
				throw new Error('QueryClient:QueryIncentivizedPacketsForChannel API Node Unavailable. Could not perform query: ' + e.message)
				
			}
		},
		
		
		
		
		 		
		
		
		async QueryTotalRecvFees({ commit, rootGetters, getters }, { options: { subscribe, all} = { subscribe:false, all:false}, params, query=null }) {
			try {
				const key = params ?? {};
				const client = initClient(rootGetters);
				let value= (await client.IbcApplicationsFeeV1.query.queryTotalRecvFees( key.packet_id.channel_id,  key.packet_id.port_id,  key.packet_id.sequence)).data
				
					
				commit('QUERY', { query: 'TotalRecvFees', key: { params: {...key}, query}, value })
				if (subscribe) commit('SUBSCRIBE', { action: 'QueryTotalRecvFees', payload: { options: { all }, params: {...key},query }})
				return getters['getTotalRecvFees']( { params: {...key}, query}) ?? {}
			} catch (e) {
				throw new Error('QueryClient:QueryTotalRecvFees API Node Unavailable. Could not perform query: ' + e.message)
				
			}
		},
		
		
		
		
		 		
		
		
		async QueryTotalAckFees({ commit, rootGetters, getters }, { options: { subscribe, all} = { subscribe:false, all:false}, params, query=null }) {
			try {
				const key = params ?? {};
				const client = initClient(rootGetters);
				let value= (await client.IbcApplicationsFeeV1.query.queryTotalAckFees( key.packet_id.channel_id,  key.packet_id.port_id,  key.packet_id.sequence)).data
				
					
				commit('QUERY', { query: 'TotalAckFees', key: { params: {...key}, query}, value })
				if (subscribe) commit('SUBSCRIBE', { action: 'QueryTotalAckFees', payload: { options: { all }, params: {...key},query }})
				return getters['getTotalAckFees']( { params: {...key}, query}) ?? {}
			} catch (e) {
				throw new Error('QueryClient:QueryTotalAckFees API Node Unavailable. Could not perform query: ' + e.message)
				
			}
		},
		
		
		
		
		 		
		
		
		async QueryTotalTimeoutFees({ commit, rootGetters, getters }, { options: { subscribe, all} = { subscribe:false, all:false}, params, query=null }) {
			try {
				const key = params ?? {};
				const client = initClient(rootGetters);
				let value= (await client.IbcApplicationsFeeV1.query.queryTotalTimeoutFees( key.packet_id.channel_id,  key.packet_id.port_id,  key.packet_id.sequence)).data
				
					
				commit('QUERY', { query: 'TotalTimeoutFees', key: { params: {...key}, query}, value })
				if (subscribe) commit('SUBSCRIBE', { action: 'QueryTotalTimeoutFees', payload: { options: { all }, params: {...key},query }})
				return getters['getTotalTimeoutFees']( { params: {...key}, query}) ?? {}
			} catch (e) {
				throw new Error('QueryClient:QueryTotalTimeoutFees API Node Unavailable. Could not perform query: ' + e.message)
				
			}
		},
		
		
		
		
		 		
		
		
		async QueryPayee({ commit, rootGetters, getters }, { options: { subscribe, all} = { subscribe:false, all:false}, params, query=null }) {
			try {
				const key = params ?? {};
				const client = initClient(rootGetters);
				let value= (await client.IbcApplicationsFeeV1.query.queryPayee( key.channel_id,  key.relayer)).data
				
					
				commit('QUERY', { query: 'Payee', key: { params: {...key}, query}, value })
				if (subscribe) commit('SUBSCRIBE', { action: 'QueryPayee', payload: { options: { all }, params: {...key},query }})
				return getters['getPayee']( { params: {...key}, query}) ?? {}
			} catch (e) {
				throw new Error('QueryClient:QueryPayee API Node Unavailable. Could not perform query: ' + e.message)
				
			}
		},
		
		
		
		
		 		
		
		
		async QueryCounterpartyPayee({ commit, rootGetters, getters }, { options: { subscribe, all} = { subscribe:false, all:false}, params, query=null }) {
			try {
				const key = params ?? {};
				const client = initClient(rootGetters);
				let value= (await client.IbcApplicationsFeeV1.query.queryCounterpartyPayee( key.channel_id,  key.relayer)).data
				
					
				commit('QUERY', { query: 'CounterpartyPayee', key: { params: {...key}, query}, value })
				if (subscribe) commit('SUBSCRIBE', { action: 'QueryCounterpartyPayee', payload: { options: { all }, params: {...key},query }})
				return getters['getCounterpartyPayee']( { params: {...key}, query}) ?? {}
			} catch (e) {
				throw new Error('QueryClient:QueryCounterpartyPayee API Node Unavailable. Could not perform query: ' + e.message)
				
			}
		},
		
		
		
		
		 		
		
		
		async QueryFeeEnabledChannels({ commit, rootGetters, getters }, { options: { subscribe, all} = { subscribe:false, all:false}, params, query=null }) {
			try {
				const key = params ?? {};
				const client = initClient(rootGetters);
				let value= (await client.IbcApplicationsFeeV1.query.queryFeeEnabledChannels(query ?? undefined)).data
				
					
				while (all && (<any> value).pagination && (<any> value).pagination.next_key!=null) {
					let next_values=(await client.IbcApplicationsFeeV1.query.queryFeeEnabledChannels({...query ?? {}, 'pagination.key':(<any> value).pagination.next_key} as any)).data
					value = mergeResults(value, next_values);
				}
				commit('QUERY', { query: 'FeeEnabledChannels', key: { params: {...key}, query}, value })
				if (subscribe) commit('SUBSCRIBE', { action: 'QueryFeeEnabledChannels', payload: { options: { all }, params: {...key},query }})
				return getters['getFeeEnabledChannels']( { params: {...key}, query}) ?? {}
			} catch (e) {
				throw new Error('QueryClient:QueryFeeEnabledChannels API Node Unavailable. Could not perform query: ' + e.message)
				
			}
		},
		
		
		
		
		 		
		
		
		async QueryFeeEnabledChannel({ commit, rootGetters, getters }, { options: { subscribe, all} = { subscribe:false, all:false}, params, query=null }) {
			try {
				const key = params ?? {};
				const client = initClient(rootGetters);
				let value= (await client.IbcApplicationsFeeV1.query.queryFeeEnabledChannel( key.channel_id,  key.port_id)).data
				
					
				commit('QUERY', { query: 'FeeEnabledChannel', key: { params: {...key}, query}, value })
				if (subscribe) commit('SUBSCRIBE', { action: 'QueryFeeEnabledChannel', payload: { options: { all }, params: {...key},query }})
				return getters['getFeeEnabledChannel']( { params: {...key}, query}) ?? {}
			} catch (e) {
				throw new Error('QueryClient:QueryFeeEnabledChannel API Node Unavailable. Could not perform query: ' + e.message)
				
			}
		},
		
		
		async sendQueryFeeEnabledChannelRequest({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.IbcApplicationsFeeV1.tx.sendQueryFeeEnabledChannelRequest({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryFeeEnabledChannelRequest:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QueryFeeEnabledChannelRequest:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendRegisteredCounterpartyPayee({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.IbcApplicationsFeeV1.tx.sendRegisteredCounterpartyPayee({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:RegisteredCounterpartyPayee:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:RegisteredCounterpartyPayee:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendMsgPayPacketFee({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.IbcApplicationsFeeV1.tx.sendMsgPayPacketFee({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgPayPacketFee:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:MsgPayPacketFee:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendMsgPayPacketFeeResponse({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.IbcApplicationsFeeV1.tx.sendMsgPayPacketFeeResponse({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgPayPacketFeeResponse:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:MsgPayPacketFeeResponse:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendMsgPayPacketFeeAsyncResponse({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.IbcApplicationsFeeV1.tx.sendMsgPayPacketFeeAsyncResponse({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgPayPacketFeeAsyncResponse:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:MsgPayPacketFeeAsyncResponse:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendQueryIncentivizedPacketsForChannelRequest({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.IbcApplicationsFeeV1.tx.sendQueryIncentivizedPacketsForChannelRequest({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryIncentivizedPacketsForChannelRequest:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QueryIncentivizedPacketsForChannelRequest:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendQueryPayeeRequest({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.IbcApplicationsFeeV1.tx.sendQueryPayeeRequest({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryPayeeRequest:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QueryPayeeRequest:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendFeeEnabledChannel({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.IbcApplicationsFeeV1.tx.sendFeeEnabledChannel({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:FeeEnabledChannel:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:FeeEnabledChannel:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendMetadata({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.IbcApplicationsFeeV1.tx.sendMetadata({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:Metadata:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:Metadata:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendMsgRegisterPayeeResponse({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.IbcApplicationsFeeV1.tx.sendMsgRegisterPayeeResponse({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgRegisterPayeeResponse:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:MsgRegisterPayeeResponse:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendMsgRegisterCounterpartyPayee({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.IbcApplicationsFeeV1.tx.sendMsgRegisterCounterpartyPayee({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgRegisterCounterpartyPayee:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:MsgRegisterCounterpartyPayee:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendQueryIncentivizedPacketsForChannelResponse({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.IbcApplicationsFeeV1.tx.sendQueryIncentivizedPacketsForChannelResponse({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryIncentivizedPacketsForChannelResponse:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QueryIncentivizedPacketsForChannelResponse:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendQueryTotalRecvFeesResponse({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.IbcApplicationsFeeV1.tx.sendQueryTotalRecvFeesResponse({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryTotalRecvFeesResponse:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QueryTotalRecvFeesResponse:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendQueryCounterpartyPayeeRequest({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.IbcApplicationsFeeV1.tx.sendQueryCounterpartyPayeeRequest({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryCounterpartyPayeeRequest:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QueryCounterpartyPayeeRequest:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendIncentivizedAcknowledgement({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.IbcApplicationsFeeV1.tx.sendIncentivizedAcknowledgement({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:IncentivizedAcknowledgement:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:IncentivizedAcknowledgement:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendMsgRegisterPayee({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.IbcApplicationsFeeV1.tx.sendMsgRegisterPayee({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgRegisterPayee:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:MsgRegisterPayee:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendQueryTotalTimeoutFeesRequest({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.IbcApplicationsFeeV1.tx.sendQueryTotalTimeoutFeesRequest({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryTotalTimeoutFeesRequest:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QueryTotalTimeoutFeesRequest:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendQueryTotalTimeoutFeesResponse({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.IbcApplicationsFeeV1.tx.sendQueryTotalTimeoutFeesResponse({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryTotalTimeoutFeesResponse:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QueryTotalTimeoutFeesResponse:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendQueryFeeEnabledChannelsRequest({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.IbcApplicationsFeeV1.tx.sendQueryFeeEnabledChannelsRequest({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryFeeEnabledChannelsRequest:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QueryFeeEnabledChannelsRequest:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendPacketFee({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.IbcApplicationsFeeV1.tx.sendPacketFee({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:PacketFee:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:PacketFee:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendRegisteredPayee({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.IbcApplicationsFeeV1.tx.sendRegisteredPayee({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:RegisteredPayee:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:RegisteredPayee:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendQueryIncentivizedPacketsResponse({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.IbcApplicationsFeeV1.tx.sendQueryIncentivizedPacketsResponse({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryIncentivizedPacketsResponse:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QueryIncentivizedPacketsResponse:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendQueryPayeeResponse({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.IbcApplicationsFeeV1.tx.sendQueryPayeeResponse({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryPayeeResponse:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QueryPayeeResponse:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendFee({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.IbcApplicationsFeeV1.tx.sendFee({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:Fee:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:Fee:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendForwardRelayerAddress({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.IbcApplicationsFeeV1.tx.sendForwardRelayerAddress({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:ForwardRelayerAddress:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:ForwardRelayerAddress:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendMsgPayPacketFeeAsync({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.IbcApplicationsFeeV1.tx.sendMsgPayPacketFeeAsync({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgPayPacketFeeAsync:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:MsgPayPacketFeeAsync:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendQueryIncentivizedPacketResponse({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.IbcApplicationsFeeV1.tx.sendQueryIncentivizedPacketResponse({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryIncentivizedPacketResponse:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QueryIncentivizedPacketResponse:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendQueryTotalAckFeesRequest({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.IbcApplicationsFeeV1.tx.sendQueryTotalAckFeesRequest({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryTotalAckFeesRequest:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QueryTotalAckFeesRequest:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendIdentifiedPacketFees({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.IbcApplicationsFeeV1.tx.sendIdentifiedPacketFees({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:IdentifiedPacketFees:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:IdentifiedPacketFees:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendMsgRegisterCounterpartyPayeeResponse({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.IbcApplicationsFeeV1.tx.sendMsgRegisterCounterpartyPayeeResponse({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgRegisterCounterpartyPayeeResponse:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:MsgRegisterCounterpartyPayeeResponse:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendQueryIncentivizedPacketsRequest({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.IbcApplicationsFeeV1.tx.sendQueryIncentivizedPacketsRequest({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryIncentivizedPacketsRequest:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QueryIncentivizedPacketsRequest:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendQueryIncentivizedPacketRequest({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.IbcApplicationsFeeV1.tx.sendQueryIncentivizedPacketRequest({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryIncentivizedPacketRequest:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QueryIncentivizedPacketRequest:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendQueryFeeEnabledChannelsResponse({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.IbcApplicationsFeeV1.tx.sendQueryFeeEnabledChannelsResponse({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryFeeEnabledChannelsResponse:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QueryFeeEnabledChannelsResponse:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendPacketFees({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.IbcApplicationsFeeV1.tx.sendPacketFees({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:PacketFees:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:PacketFees:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendGenesisState({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.IbcApplicationsFeeV1.tx.sendGenesisState({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:GenesisState:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:GenesisState:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendQueryTotalRecvFeesRequest({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.IbcApplicationsFeeV1.tx.sendQueryTotalRecvFeesRequest({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryTotalRecvFeesRequest:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QueryTotalRecvFeesRequest:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendQueryTotalAckFeesResponse({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.IbcApplicationsFeeV1.tx.sendQueryTotalAckFeesResponse({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryTotalAckFeesResponse:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QueryTotalAckFeesResponse:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendQueryCounterpartyPayeeResponse({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.IbcApplicationsFeeV1.tx.sendQueryCounterpartyPayeeResponse({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryCounterpartyPayeeResponse:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QueryCounterpartyPayeeResponse:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendQueryFeeEnabledChannelResponse({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.IbcApplicationsFeeV1.tx.sendQueryFeeEnabledChannelResponse({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryFeeEnabledChannelResponse:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QueryFeeEnabledChannelResponse:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		
		async QueryFeeEnabledChannelRequest({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.IbcApplicationsFeeV1.tx.queryFeeEnabledChannelRequest({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryFeeEnabledChannelRequest:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QueryFeeEnabledChannelRequest:Create Could not create message: ' + e.message)
				}
			}
		},
		async RegisteredCounterpartyPayee({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.IbcApplicationsFeeV1.tx.registeredCounterpartyPayee({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:RegisteredCounterpartyPayee:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:RegisteredCounterpartyPayee:Create Could not create message: ' + e.message)
				}
			}
		},
		async MsgPayPacketFee({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.IbcApplicationsFeeV1.tx.msgPayPacketFee({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgPayPacketFee:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:MsgPayPacketFee:Create Could not create message: ' + e.message)
				}
			}
		},
		async MsgPayPacketFeeResponse({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.IbcApplicationsFeeV1.tx.msgPayPacketFeeResponse({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgPayPacketFeeResponse:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:MsgPayPacketFeeResponse:Create Could not create message: ' + e.message)
				}
			}
		},
		async MsgPayPacketFeeAsyncResponse({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.IbcApplicationsFeeV1.tx.msgPayPacketFeeAsyncResponse({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgPayPacketFeeAsyncResponse:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:MsgPayPacketFeeAsyncResponse:Create Could not create message: ' + e.message)
				}
			}
		},
		async QueryIncentivizedPacketsForChannelRequest({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.IbcApplicationsFeeV1.tx.queryIncentivizedPacketsForChannelRequest({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryIncentivizedPacketsForChannelRequest:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QueryIncentivizedPacketsForChannelRequest:Create Could not create message: ' + e.message)
				}
			}
		},
		async QueryPayeeRequest({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.IbcApplicationsFeeV1.tx.queryPayeeRequest({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryPayeeRequest:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QueryPayeeRequest:Create Could not create message: ' + e.message)
				}
			}
		},
		async FeeEnabledChannel({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.IbcApplicationsFeeV1.tx.feeEnabledChannel({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:FeeEnabledChannel:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:FeeEnabledChannel:Create Could not create message: ' + e.message)
				}
			}
		},
		async Metadata({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.IbcApplicationsFeeV1.tx.metadata({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:Metadata:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:Metadata:Create Could not create message: ' + e.message)
				}
			}
		},
		async MsgRegisterPayeeResponse({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.IbcApplicationsFeeV1.tx.msgRegisterPayeeResponse({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgRegisterPayeeResponse:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:MsgRegisterPayeeResponse:Create Could not create message: ' + e.message)
				}
			}
		},
		async MsgRegisterCounterpartyPayee({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.IbcApplicationsFeeV1.tx.msgRegisterCounterpartyPayee({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgRegisterCounterpartyPayee:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:MsgRegisterCounterpartyPayee:Create Could not create message: ' + e.message)
				}
			}
		},
		async QueryIncentivizedPacketsForChannelResponse({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.IbcApplicationsFeeV1.tx.queryIncentivizedPacketsForChannelResponse({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryIncentivizedPacketsForChannelResponse:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QueryIncentivizedPacketsForChannelResponse:Create Could not create message: ' + e.message)
				}
			}
		},
		async QueryTotalRecvFeesResponse({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.IbcApplicationsFeeV1.tx.queryTotalRecvFeesResponse({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryTotalRecvFeesResponse:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QueryTotalRecvFeesResponse:Create Could not create message: ' + e.message)
				}
			}
		},
		async QueryCounterpartyPayeeRequest({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.IbcApplicationsFeeV1.tx.queryCounterpartyPayeeRequest({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryCounterpartyPayeeRequest:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QueryCounterpartyPayeeRequest:Create Could not create message: ' + e.message)
				}
			}
		},
		async IncentivizedAcknowledgement({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.IbcApplicationsFeeV1.tx.incentivizedAcknowledgement({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:IncentivizedAcknowledgement:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:IncentivizedAcknowledgement:Create Could not create message: ' + e.message)
				}
			}
		},
		async MsgRegisterPayee({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.IbcApplicationsFeeV1.tx.msgRegisterPayee({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgRegisterPayee:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:MsgRegisterPayee:Create Could not create message: ' + e.message)
				}
			}
		},
		async QueryTotalTimeoutFeesRequest({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.IbcApplicationsFeeV1.tx.queryTotalTimeoutFeesRequest({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryTotalTimeoutFeesRequest:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QueryTotalTimeoutFeesRequest:Create Could not create message: ' + e.message)
				}
			}
		},
		async QueryTotalTimeoutFeesResponse({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.IbcApplicationsFeeV1.tx.queryTotalTimeoutFeesResponse({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryTotalTimeoutFeesResponse:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QueryTotalTimeoutFeesResponse:Create Could not create message: ' + e.message)
				}
			}
		},
		async QueryFeeEnabledChannelsRequest({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.IbcApplicationsFeeV1.tx.queryFeeEnabledChannelsRequest({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryFeeEnabledChannelsRequest:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QueryFeeEnabledChannelsRequest:Create Could not create message: ' + e.message)
				}
			}
		},
		async PacketFee({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.IbcApplicationsFeeV1.tx.packetFee({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:PacketFee:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:PacketFee:Create Could not create message: ' + e.message)
				}
			}
		},
		async RegisteredPayee({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.IbcApplicationsFeeV1.tx.registeredPayee({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:RegisteredPayee:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:RegisteredPayee:Create Could not create message: ' + e.message)
				}
			}
		},
		async QueryIncentivizedPacketsResponse({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.IbcApplicationsFeeV1.tx.queryIncentivizedPacketsResponse({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryIncentivizedPacketsResponse:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QueryIncentivizedPacketsResponse:Create Could not create message: ' + e.message)
				}
			}
		},
		async QueryPayeeResponse({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.IbcApplicationsFeeV1.tx.queryPayeeResponse({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryPayeeResponse:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QueryPayeeResponse:Create Could not create message: ' + e.message)
				}
			}
		},
		async Fee({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.IbcApplicationsFeeV1.tx.fee({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:Fee:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:Fee:Create Could not create message: ' + e.message)
				}
			}
		},
		async ForwardRelayerAddress({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.IbcApplicationsFeeV1.tx.forwardRelayerAddress({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:ForwardRelayerAddress:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:ForwardRelayerAddress:Create Could not create message: ' + e.message)
				}
			}
		},
		async MsgPayPacketFeeAsync({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.IbcApplicationsFeeV1.tx.msgPayPacketFeeAsync({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgPayPacketFeeAsync:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:MsgPayPacketFeeAsync:Create Could not create message: ' + e.message)
				}
			}
		},
		async QueryIncentivizedPacketResponse({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.IbcApplicationsFeeV1.tx.queryIncentivizedPacketResponse({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryIncentivizedPacketResponse:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QueryIncentivizedPacketResponse:Create Could not create message: ' + e.message)
				}
			}
		},
		async QueryTotalAckFeesRequest({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.IbcApplicationsFeeV1.tx.queryTotalAckFeesRequest({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryTotalAckFeesRequest:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QueryTotalAckFeesRequest:Create Could not create message: ' + e.message)
				}
			}
		},
		async IdentifiedPacketFees({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.IbcApplicationsFeeV1.tx.identifiedPacketFees({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:IdentifiedPacketFees:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:IdentifiedPacketFees:Create Could not create message: ' + e.message)
				}
			}
		},
		async MsgRegisterCounterpartyPayeeResponse({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.IbcApplicationsFeeV1.tx.msgRegisterCounterpartyPayeeResponse({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgRegisterCounterpartyPayeeResponse:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:MsgRegisterCounterpartyPayeeResponse:Create Could not create message: ' + e.message)
				}
			}
		},
		async QueryIncentivizedPacketsRequest({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.IbcApplicationsFeeV1.tx.queryIncentivizedPacketsRequest({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryIncentivizedPacketsRequest:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QueryIncentivizedPacketsRequest:Create Could not create message: ' + e.message)
				}
			}
		},
		async QueryIncentivizedPacketRequest({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.IbcApplicationsFeeV1.tx.queryIncentivizedPacketRequest({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryIncentivizedPacketRequest:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QueryIncentivizedPacketRequest:Create Could not create message: ' + e.message)
				}
			}
		},
		async QueryFeeEnabledChannelsResponse({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.IbcApplicationsFeeV1.tx.queryFeeEnabledChannelsResponse({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryFeeEnabledChannelsResponse:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QueryFeeEnabledChannelsResponse:Create Could not create message: ' + e.message)
				}
			}
		},
		async PacketFees({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.IbcApplicationsFeeV1.tx.packetFees({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:PacketFees:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:PacketFees:Create Could not create message: ' + e.message)
				}
			}
		},
		async GenesisState({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.IbcApplicationsFeeV1.tx.genesisState({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:GenesisState:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:GenesisState:Create Could not create message: ' + e.message)
				}
			}
		},
		async QueryTotalRecvFeesRequest({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.IbcApplicationsFeeV1.tx.queryTotalRecvFeesRequest({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryTotalRecvFeesRequest:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QueryTotalRecvFeesRequest:Create Could not create message: ' + e.message)
				}
			}
		},
		async QueryTotalAckFeesResponse({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.IbcApplicationsFeeV1.tx.queryTotalAckFeesResponse({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryTotalAckFeesResponse:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QueryTotalAckFeesResponse:Create Could not create message: ' + e.message)
				}
			}
		},
		async QueryCounterpartyPayeeResponse({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.IbcApplicationsFeeV1.tx.queryCounterpartyPayeeResponse({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryCounterpartyPayeeResponse:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QueryCounterpartyPayeeResponse:Create Could not create message: ' + e.message)
				}
			}
		},
		async QueryFeeEnabledChannelResponse({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.IbcApplicationsFeeV1.tx.queryFeeEnabledChannelResponse({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryFeeEnabledChannelResponse:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QueryFeeEnabledChannelResponse:Create Could not create message: ' + e.message)
				}
			}
		},
		
	}
}