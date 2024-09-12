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
				Channel: {},
				Channels: {},
				ConnectionChannels: {},
				ChannelClientState: {},
				ChannelConsensusState: {},
				PacketCommitment: {},
				PacketCommitments: {},
				PacketReceipt: {},
				PacketAcknowledgement: {},
				PacketAcknowledgements: {},
				UnreceivedPackets: {},
				UnreceivedAcks: {},
				NextSequenceReceive: {},
				NextSequenceSend: {},
				UpgradeError: {},
				Upgrade: {},
				ChannelParams: {},
				
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
				getChannel: (state) => (params = { params: {}}) => {
					if (!(<any> params).query) {
						(<any> params).query=null
					}
			return state.Channel[JSON.stringify(params)] ?? {}
		},
				getChannels: (state) => (params = { params: {}}) => {
					if (!(<any> params).query) {
						(<any> params).query=null
					}
			return state.Channels[JSON.stringify(params)] ?? {}
		},
				getConnectionChannels: (state) => (params = { params: {}}) => {
					if (!(<any> params).query) {
						(<any> params).query=null
					}
			return state.ConnectionChannels[JSON.stringify(params)] ?? {}
		},
				getChannelClientState: (state) => (params = { params: {}}) => {
					if (!(<any> params).query) {
						(<any> params).query=null
					}
			return state.ChannelClientState[JSON.stringify(params)] ?? {}
		},
				getChannelConsensusState: (state) => (params = { params: {}}) => {
					if (!(<any> params).query) {
						(<any> params).query=null
					}
			return state.ChannelConsensusState[JSON.stringify(params)] ?? {}
		},
				getPacketCommitment: (state) => (params = { params: {}}) => {
					if (!(<any> params).query) {
						(<any> params).query=null
					}
			return state.PacketCommitment[JSON.stringify(params)] ?? {}
		},
				getPacketCommitments: (state) => (params = { params: {}}) => {
					if (!(<any> params).query) {
						(<any> params).query=null
					}
			return state.PacketCommitments[JSON.stringify(params)] ?? {}
		},
				getPacketReceipt: (state) => (params = { params: {}}) => {
					if (!(<any> params).query) {
						(<any> params).query=null
					}
			return state.PacketReceipt[JSON.stringify(params)] ?? {}
		},
				getPacketAcknowledgement: (state) => (params = { params: {}}) => {
					if (!(<any> params).query) {
						(<any> params).query=null
					}
			return state.PacketAcknowledgement[JSON.stringify(params)] ?? {}
		},
				getPacketAcknowledgements: (state) => (params = { params: {}}) => {
					if (!(<any> params).query) {
						(<any> params).query=null
					}
			return state.PacketAcknowledgements[JSON.stringify(params)] ?? {}
		},
				getUnreceivedPackets: (state) => (params = { params: {}}) => {
					if (!(<any> params).query) {
						(<any> params).query=null
					}
			return state.UnreceivedPackets[JSON.stringify(params)] ?? {}
		},
				getUnreceivedAcks: (state) => (params = { params: {}}) => {
					if (!(<any> params).query) {
						(<any> params).query=null
					}
			return state.UnreceivedAcks[JSON.stringify(params)] ?? {}
		},
				getNextSequenceReceive: (state) => (params = { params: {}}) => {
					if (!(<any> params).query) {
						(<any> params).query=null
					}
			return state.NextSequenceReceive[JSON.stringify(params)] ?? {}
		},
				getNextSequenceSend: (state) => (params = { params: {}}) => {
					if (!(<any> params).query) {
						(<any> params).query=null
					}
			return state.NextSequenceSend[JSON.stringify(params)] ?? {}
		},
				getUpgradeError: (state) => (params = { params: {}}) => {
					if (!(<any> params).query) {
						(<any> params).query=null
					}
			return state.UpgradeError[JSON.stringify(params)] ?? {}
		},
				getUpgrade: (state) => (params = { params: {}}) => {
					if (!(<any> params).query) {
						(<any> params).query=null
					}
			return state.Upgrade[JSON.stringify(params)] ?? {}
		},
				getChannelParams: (state) => (params = { params: {}}) => {
					if (!(<any> params).query) {
						(<any> params).query=null
					}
			return state.ChannelParams[JSON.stringify(params)] ?? {}
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
			console.log('Vuex module: ibc.core.channel.v1 initialized!')
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
		
		
		
		 		
		
		
		async QueryChannel({ commit, rootGetters, getters }, { options: { subscribe, all} = { subscribe:false, all:false}, params, query=null }) {
			try {
				const key = params ?? {};
				const client = initClient(rootGetters);
				let value= (await client.IbcCoreChannelV1.query.queryChannel( key.channel_id,  key.port_id)).data
				
					
				commit('QUERY', { query: 'Channel', key: { params: {...key}, query}, value })
				if (subscribe) commit('SUBSCRIBE', { action: 'QueryChannel', payload: { options: { all }, params: {...key},query }})
				return getters['getChannel']( { params: {...key}, query}) ?? {}
			} catch (e) {
				throw new Error('QueryClient:QueryChannel API Node Unavailable. Could not perform query: ' + e.message)
				
			}
		},
		
		
		
		
		 		
		
		
		async QueryChannels({ commit, rootGetters, getters }, { options: { subscribe, all} = { subscribe:false, all:false}, params, query=null }) {
			try {
				const key = params ?? {};
				const client = initClient(rootGetters);
				let value= (await client.IbcCoreChannelV1.query.queryChannels(query ?? undefined)).data
				
					
				while (all && (<any> value).pagination && (<any> value).pagination.next_key!=null) {
					let next_values=(await client.IbcCoreChannelV1.query.queryChannels({...query ?? {}, 'pagination.key':(<any> value).pagination.next_key} as any)).data
					value = mergeResults(value, next_values);
				}
				commit('QUERY', { query: 'Channels', key: { params: {...key}, query}, value })
				if (subscribe) commit('SUBSCRIBE', { action: 'QueryChannels', payload: { options: { all }, params: {...key},query }})
				return getters['getChannels']( { params: {...key}, query}) ?? {}
			} catch (e) {
				throw new Error('QueryClient:QueryChannels API Node Unavailable. Could not perform query: ' + e.message)
				
			}
		},
		
		
		
		
		 		
		
		
		async QueryConnectionChannels({ commit, rootGetters, getters }, { options: { subscribe, all} = { subscribe:false, all:false}, params, query=null }) {
			try {
				const key = params ?? {};
				const client = initClient(rootGetters);
				let value= (await client.IbcCoreChannelV1.query.queryConnectionChannels( key.connection, query ?? undefined)).data
				
					
				while (all && (<any> value).pagination && (<any> value).pagination.next_key!=null) {
					let next_values=(await client.IbcCoreChannelV1.query.queryConnectionChannels( key.connection, {...query ?? {}, 'pagination.key':(<any> value).pagination.next_key} as any)).data
					value = mergeResults(value, next_values);
				}
				commit('QUERY', { query: 'ConnectionChannels', key: { params: {...key}, query}, value })
				if (subscribe) commit('SUBSCRIBE', { action: 'QueryConnectionChannels', payload: { options: { all }, params: {...key},query }})
				return getters['getConnectionChannels']( { params: {...key}, query}) ?? {}
			} catch (e) {
				throw new Error('QueryClient:QueryConnectionChannels API Node Unavailable. Could not perform query: ' + e.message)
				
			}
		},
		
		
		
		
		 		
		
		
		async QueryChannelClientState({ commit, rootGetters, getters }, { options: { subscribe, all} = { subscribe:false, all:false}, params, query=null }) {
			try {
				const key = params ?? {};
				const client = initClient(rootGetters);
				let value= (await client.IbcCoreChannelV1.query.queryChannelClientState( key.channel_id,  key.port_id)).data
				
					
				commit('QUERY', { query: 'ChannelClientState', key: { params: {...key}, query}, value })
				if (subscribe) commit('SUBSCRIBE', { action: 'QueryChannelClientState', payload: { options: { all }, params: {...key},query }})
				return getters['getChannelClientState']( { params: {...key}, query}) ?? {}
			} catch (e) {
				throw new Error('QueryClient:QueryChannelClientState API Node Unavailable. Could not perform query: ' + e.message)
				
			}
		},
		
		
		
		
		 		
		
		
		async QueryChannelConsensusState({ commit, rootGetters, getters }, { options: { subscribe, all} = { subscribe:false, all:false}, params, query=null }) {
			try {
				const key = params ?? {};
				const client = initClient(rootGetters);
				let value= (await client.IbcCoreChannelV1.query.queryChannelConsensusState( key.channel_id,  key.port_id,  key.revision_number,  key.revision_height)).data
				
					
				commit('QUERY', { query: 'ChannelConsensusState', key: { params: {...key}, query}, value })
				if (subscribe) commit('SUBSCRIBE', { action: 'QueryChannelConsensusState', payload: { options: { all }, params: {...key},query }})
				return getters['getChannelConsensusState']( { params: {...key}, query}) ?? {}
			} catch (e) {
				throw new Error('QueryClient:QueryChannelConsensusState API Node Unavailable. Could not perform query: ' + e.message)
				
			}
		},
		
		
		
		
		 		
		
		
		async QueryPacketCommitment({ commit, rootGetters, getters }, { options: { subscribe, all} = { subscribe:false, all:false}, params, query=null }) {
			try {
				const key = params ?? {};
				const client = initClient(rootGetters);
				let value= (await client.IbcCoreChannelV1.query.queryPacketCommitment( key.channel_id,  key.port_id,  key.sequence)).data
				
					
				commit('QUERY', { query: 'PacketCommitment', key: { params: {...key}, query}, value })
				if (subscribe) commit('SUBSCRIBE', { action: 'QueryPacketCommitment', payload: { options: { all }, params: {...key},query }})
				return getters['getPacketCommitment']( { params: {...key}, query}) ?? {}
			} catch (e) {
				throw new Error('QueryClient:QueryPacketCommitment API Node Unavailable. Could not perform query: ' + e.message)
				
			}
		},
		
		
		
		
		 		
		
		
		async QueryPacketCommitments({ commit, rootGetters, getters }, { options: { subscribe, all} = { subscribe:false, all:false}, params, query=null }) {
			try {
				const key = params ?? {};
				const client = initClient(rootGetters);
				let value= (await client.IbcCoreChannelV1.query.queryPacketCommitments( key.channel_id,  key.port_id, query ?? undefined)).data
				
					
				while (all && (<any> value).pagination && (<any> value).pagination.next_key!=null) {
					let next_values=(await client.IbcCoreChannelV1.query.queryPacketCommitments( key.channel_id,  key.port_id, {...query ?? {}, 'pagination.key':(<any> value).pagination.next_key} as any)).data
					value = mergeResults(value, next_values);
				}
				commit('QUERY', { query: 'PacketCommitments', key: { params: {...key}, query}, value })
				if (subscribe) commit('SUBSCRIBE', { action: 'QueryPacketCommitments', payload: { options: { all }, params: {...key},query }})
				return getters['getPacketCommitments']( { params: {...key}, query}) ?? {}
			} catch (e) {
				throw new Error('QueryClient:QueryPacketCommitments API Node Unavailable. Could not perform query: ' + e.message)
				
			}
		},
		
		
		
		
		 		
		
		
		async QueryPacketReceipt({ commit, rootGetters, getters }, { options: { subscribe, all} = { subscribe:false, all:false}, params, query=null }) {
			try {
				const key = params ?? {};
				const client = initClient(rootGetters);
				let value= (await client.IbcCoreChannelV1.query.queryPacketReceipt( key.channel_id,  key.port_id,  key.sequence)).data
				
					
				commit('QUERY', { query: 'PacketReceipt', key: { params: {...key}, query}, value })
				if (subscribe) commit('SUBSCRIBE', { action: 'QueryPacketReceipt', payload: { options: { all }, params: {...key},query }})
				return getters['getPacketReceipt']( { params: {...key}, query}) ?? {}
			} catch (e) {
				throw new Error('QueryClient:QueryPacketReceipt API Node Unavailable. Could not perform query: ' + e.message)
				
			}
		},
		
		
		
		
		 		
		
		
		async QueryPacketAcknowledgement({ commit, rootGetters, getters }, { options: { subscribe, all} = { subscribe:false, all:false}, params, query=null }) {
			try {
				const key = params ?? {};
				const client = initClient(rootGetters);
				let value= (await client.IbcCoreChannelV1.query.queryPacketAcknowledgement( key.channel_id,  key.port_id,  key.sequence)).data
				
					
				commit('QUERY', { query: 'PacketAcknowledgement', key: { params: {...key}, query}, value })
				if (subscribe) commit('SUBSCRIBE', { action: 'QueryPacketAcknowledgement', payload: { options: { all }, params: {...key},query }})
				return getters['getPacketAcknowledgement']( { params: {...key}, query}) ?? {}
			} catch (e) {
				throw new Error('QueryClient:QueryPacketAcknowledgement API Node Unavailable. Could not perform query: ' + e.message)
				
			}
		},
		
		
		
		
		 		
		
		
		async QueryPacketAcknowledgements({ commit, rootGetters, getters }, { options: { subscribe, all} = { subscribe:false, all:false}, params, query=null }) {
			try {
				const key = params ?? {};
				const client = initClient(rootGetters);
				let value= (await client.IbcCoreChannelV1.query.queryPacketAcknowledgements( key.channel_id,  key.port_id, query ?? undefined)).data
				
					
				while (all && (<any> value).pagination && (<any> value).pagination.next_key!=null) {
					let next_values=(await client.IbcCoreChannelV1.query.queryPacketAcknowledgements( key.channel_id,  key.port_id, {...query ?? {}, 'pagination.key':(<any> value).pagination.next_key} as any)).data
					value = mergeResults(value, next_values);
				}
				commit('QUERY', { query: 'PacketAcknowledgements', key: { params: {...key}, query}, value })
				if (subscribe) commit('SUBSCRIBE', { action: 'QueryPacketAcknowledgements', payload: { options: { all }, params: {...key},query }})
				return getters['getPacketAcknowledgements']( { params: {...key}, query}) ?? {}
			} catch (e) {
				throw new Error('QueryClient:QueryPacketAcknowledgements API Node Unavailable. Could not perform query: ' + e.message)
				
			}
		},
		
		
		
		
		 		
		
		
		async QueryUnreceivedPackets({ commit, rootGetters, getters }, { options: { subscribe, all} = { subscribe:false, all:false}, params, query=null }) {
			try {
				const key = params ?? {};
				const client = initClient(rootGetters);
				let value= (await client.IbcCoreChannelV1.query.queryUnreceivedPackets( key.channel_id,  key.port_id,  key.packet_commitment_sequences)).data
				
					
				commit('QUERY', { query: 'UnreceivedPackets', key: { params: {...key}, query}, value })
				if (subscribe) commit('SUBSCRIBE', { action: 'QueryUnreceivedPackets', payload: { options: { all }, params: {...key},query }})
				return getters['getUnreceivedPackets']( { params: {...key}, query}) ?? {}
			} catch (e) {
				throw new Error('QueryClient:QueryUnreceivedPackets API Node Unavailable. Could not perform query: ' + e.message)
				
			}
		},
		
		
		
		
		 		
		
		
		async QueryUnreceivedAcks({ commit, rootGetters, getters }, { options: { subscribe, all} = { subscribe:false, all:false}, params, query=null }) {
			try {
				const key = params ?? {};
				const client = initClient(rootGetters);
				let value= (await client.IbcCoreChannelV1.query.queryUnreceivedAcks( key.channel_id,  key.port_id,  key.packet_ack_sequences)).data
				
					
				commit('QUERY', { query: 'UnreceivedAcks', key: { params: {...key}, query}, value })
				if (subscribe) commit('SUBSCRIBE', { action: 'QueryUnreceivedAcks', payload: { options: { all }, params: {...key},query }})
				return getters['getUnreceivedAcks']( { params: {...key}, query}) ?? {}
			} catch (e) {
				throw new Error('QueryClient:QueryUnreceivedAcks API Node Unavailable. Could not perform query: ' + e.message)
				
			}
		},
		
		
		
		
		 		
		
		
		async QueryNextSequenceReceive({ commit, rootGetters, getters }, { options: { subscribe, all} = { subscribe:false, all:false}, params, query=null }) {
			try {
				const key = params ?? {};
				const client = initClient(rootGetters);
				let value= (await client.IbcCoreChannelV1.query.queryNextSequenceReceive( key.channel_id,  key.port_id)).data
				
					
				commit('QUERY', { query: 'NextSequenceReceive', key: { params: {...key}, query}, value })
				if (subscribe) commit('SUBSCRIBE', { action: 'QueryNextSequenceReceive', payload: { options: { all }, params: {...key},query }})
				return getters['getNextSequenceReceive']( { params: {...key}, query}) ?? {}
			} catch (e) {
				throw new Error('QueryClient:QueryNextSequenceReceive API Node Unavailable. Could not perform query: ' + e.message)
				
			}
		},
		
		
		
		
		 		
		
		
		async QueryNextSequenceSend({ commit, rootGetters, getters }, { options: { subscribe, all} = { subscribe:false, all:false}, params, query=null }) {
			try {
				const key = params ?? {};
				const client = initClient(rootGetters);
				let value= (await client.IbcCoreChannelV1.query.queryNextSequenceSend( key.channel_id,  key.port_id)).data
				
					
				commit('QUERY', { query: 'NextSequenceSend', key: { params: {...key}, query}, value })
				if (subscribe) commit('SUBSCRIBE', { action: 'QueryNextSequenceSend', payload: { options: { all }, params: {...key},query }})
				return getters['getNextSequenceSend']( { params: {...key}, query}) ?? {}
			} catch (e) {
				throw new Error('QueryClient:QueryNextSequenceSend API Node Unavailable. Could not perform query: ' + e.message)
				
			}
		},
		
		
		
		
		 		
		
		
		async QueryUpgradeError({ commit, rootGetters, getters }, { options: { subscribe, all} = { subscribe:false, all:false}, params, query=null }) {
			try {
				const key = params ?? {};
				const client = initClient(rootGetters);
				let value= (await client.IbcCoreChannelV1.query.queryUpgradeError( key.channel_id,  key.port_id)).data
				
					
				commit('QUERY', { query: 'UpgradeError', key: { params: {...key}, query}, value })
				if (subscribe) commit('SUBSCRIBE', { action: 'QueryUpgradeError', payload: { options: { all }, params: {...key},query }})
				return getters['getUpgradeError']( { params: {...key}, query}) ?? {}
			} catch (e) {
				throw new Error('QueryClient:QueryUpgradeError API Node Unavailable. Could not perform query: ' + e.message)
				
			}
		},
		
		
		
		
		 		
		
		
		async QueryUpgrade({ commit, rootGetters, getters }, { options: { subscribe, all} = { subscribe:false, all:false}, params, query=null }) {
			try {
				const key = params ?? {};
				const client = initClient(rootGetters);
				let value= (await client.IbcCoreChannelV1.query.queryUpgrade( key.channel_id,  key.port_id)).data
				
					
				commit('QUERY', { query: 'Upgrade', key: { params: {...key}, query}, value })
				if (subscribe) commit('SUBSCRIBE', { action: 'QueryUpgrade', payload: { options: { all }, params: {...key},query }})
				return getters['getUpgrade']( { params: {...key}, query}) ?? {}
			} catch (e) {
				throw new Error('QueryClient:QueryUpgrade API Node Unavailable. Could not perform query: ' + e.message)
				
			}
		},
		
		
		
		
		 		
		
		
		async QueryChannelParams({ commit, rootGetters, getters }, { options: { subscribe, all} = { subscribe:false, all:false}, params, query=null }) {
			try {
				const key = params ?? {};
				const client = initClient(rootGetters);
				let value= (await client.IbcCoreChannelV1.query.queryChannelParams()).data
				
					
				commit('QUERY', { query: 'ChannelParams', key: { params: {...key}, query}, value })
				if (subscribe) commit('SUBSCRIBE', { action: 'QueryChannelParams', payload: { options: { all }, params: {...key},query }})
				return getters['getChannelParams']( { params: {...key}, query}) ?? {}
			} catch (e) {
				throw new Error('QueryClient:QueryChannelParams API Node Unavailable. Could not perform query: ' + e.message)
				
			}
		},
		
		
		async sendPacketState({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.IbcCoreChannelV1.tx.sendPacketState({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:PacketState:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:PacketState:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendGenesisState({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.IbcCoreChannelV1.tx.sendGenesisState({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:GenesisState:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:GenesisState:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendMsgTimeoutOnClose({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.IbcCoreChannelV1.tx.sendMsgTimeoutOnClose({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgTimeoutOnClose:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:MsgTimeoutOnClose:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendMsgChannelUpgradeInit({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.IbcCoreChannelV1.tx.sendMsgChannelUpgradeInit({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgChannelUpgradeInit:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:MsgChannelUpgradeInit:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendMsgChannelUpgradeTry({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.IbcCoreChannelV1.tx.sendMsgChannelUpgradeTry({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgChannelUpgradeTry:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:MsgChannelUpgradeTry:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendMsgChannelOpenTryResponse({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.IbcCoreChannelV1.tx.sendMsgChannelOpenTryResponse({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgChannelOpenTryResponse:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:MsgChannelOpenTryResponse:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendMsgChannelUpgradeCancel({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.IbcCoreChannelV1.tx.sendMsgChannelUpgradeCancel({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgChannelUpgradeCancel:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:MsgChannelUpgradeCancel:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendQueryChannelClientStateResponse({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.IbcCoreChannelV1.tx.sendQueryChannelClientStateResponse({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryChannelClientStateResponse:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QueryChannelClientStateResponse:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendQueryChannelsResponse({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.IbcCoreChannelV1.tx.sendQueryChannelsResponse({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryChannelsResponse:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QueryChannelsResponse:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendMsgChannelOpenConfirmResponse({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.IbcCoreChannelV1.tx.sendMsgChannelOpenConfirmResponse({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgChannelOpenConfirmResponse:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:MsgChannelOpenConfirmResponse:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendMsgRecvPacketResponse({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.IbcCoreChannelV1.tx.sendMsgRecvPacketResponse({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgRecvPacketResponse:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:MsgRecvPacketResponse:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendMsgChannelOpenConfirm({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.IbcCoreChannelV1.tx.sendMsgChannelOpenConfirm({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgChannelOpenConfirm:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:MsgChannelOpenConfirm:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendMsgChannelUpgradeAck({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.IbcCoreChannelV1.tx.sendMsgChannelUpgradeAck({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgChannelUpgradeAck:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:MsgChannelUpgradeAck:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendQueryChannelConsensusStateRequest({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.IbcCoreChannelV1.tx.sendQueryChannelConsensusStateRequest({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryChannelConsensusStateRequest:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QueryChannelConsensusStateRequest:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendMsgChannelUpgradeInitResponse({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.IbcCoreChannelV1.tx.sendMsgChannelUpgradeInitResponse({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgChannelUpgradeInitResponse:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:MsgChannelUpgradeInitResponse:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendMsgChannelUpgradeAckResponse({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.IbcCoreChannelV1.tx.sendMsgChannelUpgradeAckResponse({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgChannelUpgradeAckResponse:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:MsgChannelUpgradeAckResponse:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendMsgChannelUpgradeOpenResponse({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.IbcCoreChannelV1.tx.sendMsgChannelUpgradeOpenResponse({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgChannelUpgradeOpenResponse:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:MsgChannelUpgradeOpenResponse:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendMsgPruneAcknowledgementsResponse({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.IbcCoreChannelV1.tx.sendMsgPruneAcknowledgementsResponse({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgPruneAcknowledgementsResponse:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:MsgPruneAcknowledgementsResponse:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendErrorReceipt({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.IbcCoreChannelV1.tx.sendErrorReceipt({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:ErrorReceipt:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:ErrorReceipt:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendMsgChannelOpenInit({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.IbcCoreChannelV1.tx.sendMsgChannelOpenInit({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgChannelOpenInit:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:MsgChannelOpenInit:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendQueryConnectionChannelsResponse({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.IbcCoreChannelV1.tx.sendQueryConnectionChannelsResponse({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryConnectionChannelsResponse:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QueryConnectionChannelsResponse:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendQueryUnreceivedAcksRequest({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.IbcCoreChannelV1.tx.sendQueryUnreceivedAcksRequest({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryUnreceivedAcksRequest:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QueryUnreceivedAcksRequest:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendQueryUpgradeRequest({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.IbcCoreChannelV1.tx.sendQueryUpgradeRequest({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryUpgradeRequest:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QueryUpgradeRequest:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendChannel({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.IbcCoreChannelV1.tx.sendChannel({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:Channel:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:Channel:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendMsgChannelUpgradeConfirmResponse({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.IbcCoreChannelV1.tx.sendMsgChannelUpgradeConfirmResponse({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgChannelUpgradeConfirmResponse:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:MsgChannelUpgradeConfirmResponse:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendMsgChannelUpgradeCancelResponse({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.IbcCoreChannelV1.tx.sendMsgChannelUpgradeCancelResponse({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgChannelUpgradeCancelResponse:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:MsgChannelUpgradeCancelResponse:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendMsgRecvPacket({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.IbcCoreChannelV1.tx.sendMsgRecvPacket({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgRecvPacket:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:MsgRecvPacket:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendMsgChannelUpgradeConfirm({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.IbcCoreChannelV1.tx.sendMsgChannelUpgradeConfirm({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgChannelUpgradeConfirm:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:MsgChannelUpgradeConfirm:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendQueryChannelConsensusStateResponse({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.IbcCoreChannelV1.tx.sendQueryChannelConsensusStateResponse({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryChannelConsensusStateResponse:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QueryChannelConsensusStateResponse:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendQueryChannelParamsRequest({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.IbcCoreChannelV1.tx.sendQueryChannelParamsRequest({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryChannelParamsRequest:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QueryChannelParamsRequest:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendPacketId({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.IbcCoreChannelV1.tx.sendPacketId({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:PacketId:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:PacketId:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendMsgChannelCloseConfirmResponse({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.IbcCoreChannelV1.tx.sendMsgChannelCloseConfirmResponse({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgChannelCloseConfirmResponse:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:MsgChannelCloseConfirmResponse:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendMsgChannelUpgradeTryResponse({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.IbcCoreChannelV1.tx.sendMsgChannelUpgradeTryResponse({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgChannelUpgradeTryResponse:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:MsgChannelUpgradeTryResponse:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendQueryPacketReceiptResponse({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.IbcCoreChannelV1.tx.sendQueryPacketReceiptResponse({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryPacketReceiptResponse:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QueryPacketReceiptResponse:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendMsgAcknowledgement({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.IbcCoreChannelV1.tx.sendMsgAcknowledgement({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgAcknowledgement:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:MsgAcknowledgement:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendQueryPacketAcknowledgementResponse({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.IbcCoreChannelV1.tx.sendQueryPacketAcknowledgementResponse({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryPacketAcknowledgementResponse:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QueryPacketAcknowledgementResponse:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendQueryNextSequenceSendRequest({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.IbcCoreChannelV1.tx.sendQueryNextSequenceSendRequest({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryNextSequenceSendRequest:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QueryNextSequenceSendRequest:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendQueryUpgradeErrorResponse({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.IbcCoreChannelV1.tx.sendQueryUpgradeErrorResponse({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryUpgradeErrorResponse:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QueryUpgradeErrorResponse:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendAcknowledgement({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.IbcCoreChannelV1.tx.sendAcknowledgement({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:Acknowledgement:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:Acknowledgement:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendMsgChannelOpenAckResponse({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.IbcCoreChannelV1.tx.sendMsgChannelOpenAckResponse({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgChannelOpenAckResponse:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:MsgChannelOpenAckResponse:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendMsgChannelUpgradeTimeoutResponse({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.IbcCoreChannelV1.tx.sendMsgChannelUpgradeTimeoutResponse({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgChannelUpgradeTimeoutResponse:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:MsgChannelUpgradeTimeoutResponse:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendPacketSequence({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.IbcCoreChannelV1.tx.sendPacketSequence({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:PacketSequence:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:PacketSequence:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendMsgChannelUpgradeTimeout({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.IbcCoreChannelV1.tx.sendMsgChannelUpgradeTimeout({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgChannelUpgradeTimeout:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:MsgChannelUpgradeTimeout:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendQueryNextSequenceReceiveRequest({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.IbcCoreChannelV1.tx.sendQueryNextSequenceReceiveRequest({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryNextSequenceReceiveRequest:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QueryNextSequenceReceiveRequest:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendQueryNextSequenceReceiveResponse({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.IbcCoreChannelV1.tx.sendQueryNextSequenceReceiveResponse({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryNextSequenceReceiveResponse:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QueryNextSequenceReceiveResponse:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendIdentifiedChannel({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.IbcCoreChannelV1.tx.sendIdentifiedChannel({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:IdentifiedChannel:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:IdentifiedChannel:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendPacket({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.IbcCoreChannelV1.tx.sendPacket({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:Packet:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:Packet:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendMsgTimeoutResponse({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.IbcCoreChannelV1.tx.sendMsgTimeoutResponse({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgTimeoutResponse:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:MsgTimeoutResponse:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendUpgradeFields({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.IbcCoreChannelV1.tx.sendUpgradeFields({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:UpgradeFields:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:UpgradeFields:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendMsgUpdateParams({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.IbcCoreChannelV1.tx.sendMsgUpdateParams({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgUpdateParams:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:MsgUpdateParams:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendQueryPacketCommitmentResponse({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.IbcCoreChannelV1.tx.sendQueryPacketCommitmentResponse({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryPacketCommitmentResponse:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QueryPacketCommitmentResponse:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendQueryPacketCommitmentsResponse({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.IbcCoreChannelV1.tx.sendQueryPacketCommitmentsResponse({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryPacketCommitmentsResponse:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QueryPacketCommitmentsResponse:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendQueryPacketAcknowledgementRequest({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.IbcCoreChannelV1.tx.sendQueryPacketAcknowledgementRequest({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryPacketAcknowledgementRequest:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QueryPacketAcknowledgementRequest:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendMsgTimeoutOnCloseResponse({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.IbcCoreChannelV1.tx.sendMsgTimeoutOnCloseResponse({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgTimeoutOnCloseResponse:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:MsgTimeoutOnCloseResponse:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendUpgrade({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.IbcCoreChannelV1.tx.sendUpgrade({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:Upgrade:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:Upgrade:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendMsgChannelOpenAck({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.IbcCoreChannelV1.tx.sendMsgChannelOpenAck({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgChannelOpenAck:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:MsgChannelOpenAck:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendQueryChannelsRequest({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.IbcCoreChannelV1.tx.sendQueryChannelsRequest({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryChannelsRequest:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QueryChannelsRequest:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendQueryChannelParamsResponse({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.IbcCoreChannelV1.tx.sendQueryChannelParamsResponse({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryChannelParamsResponse:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QueryChannelParamsResponse:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendMsgChannelCloseInitResponse({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.IbcCoreChannelV1.tx.sendMsgChannelCloseInitResponse({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgChannelCloseInitResponse:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:MsgChannelCloseInitResponse:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendQueryChannelRequest({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.IbcCoreChannelV1.tx.sendQueryChannelRequest({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryChannelRequest:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QueryChannelRequest:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendQueryConnectionChannelsRequest({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.IbcCoreChannelV1.tx.sendQueryConnectionChannelsRequest({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryConnectionChannelsRequest:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QueryConnectionChannelsRequest:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendQueryPacketCommitmentsRequest({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.IbcCoreChannelV1.tx.sendQueryPacketCommitmentsRequest({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryPacketCommitmentsRequest:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QueryPacketCommitmentsRequest:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendCounterparty({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.IbcCoreChannelV1.tx.sendCounterparty({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:Counterparty:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:Counterparty:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendParams({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.IbcCoreChannelV1.tx.sendParams({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:Params:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:Params:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendMsgChannelOpenInitResponse({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.IbcCoreChannelV1.tx.sendMsgChannelOpenInitResponse({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgChannelOpenInitResponse:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:MsgChannelOpenInitResponse:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendMsgChannelUpgradeOpen({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.IbcCoreChannelV1.tx.sendMsgChannelUpgradeOpen({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgChannelUpgradeOpen:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:MsgChannelUpgradeOpen:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendQueryPacketReceiptRequest({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.IbcCoreChannelV1.tx.sendQueryPacketReceiptRequest({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryPacketReceiptRequest:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QueryPacketReceiptRequest:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendQueryUnreceivedAcksResponse({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.IbcCoreChannelV1.tx.sendQueryUnreceivedAcksResponse({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryUnreceivedAcksResponse:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QueryUnreceivedAcksResponse:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendMsgAcknowledgementResponse({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.IbcCoreChannelV1.tx.sendMsgAcknowledgementResponse({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgAcknowledgementResponse:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:MsgAcknowledgementResponse:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendMsgChannelCloseInit({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.IbcCoreChannelV1.tx.sendMsgChannelCloseInit({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgChannelCloseInit:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:MsgChannelCloseInit:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendMsgChannelCloseConfirm({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.IbcCoreChannelV1.tx.sendMsgChannelCloseConfirm({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgChannelCloseConfirm:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:MsgChannelCloseConfirm:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendQueryUnreceivedPacketsRequest({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.IbcCoreChannelV1.tx.sendQueryUnreceivedPacketsRequest({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryUnreceivedPacketsRequest:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QueryUnreceivedPacketsRequest:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendQueryUpgradeResponse({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.IbcCoreChannelV1.tx.sendQueryUpgradeResponse({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryUpgradeResponse:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QueryUpgradeResponse:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendMsgUpdateParamsResponse({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.IbcCoreChannelV1.tx.sendMsgUpdateParamsResponse({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgUpdateParamsResponse:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:MsgUpdateParamsResponse:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendMsgTimeout({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.IbcCoreChannelV1.tx.sendMsgTimeout({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgTimeout:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:MsgTimeout:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendQueryPacketAcknowledgementsResponse({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.IbcCoreChannelV1.tx.sendQueryPacketAcknowledgementsResponse({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryPacketAcknowledgementsResponse:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QueryPacketAcknowledgementsResponse:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendMsgChannelOpenTry({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.IbcCoreChannelV1.tx.sendMsgChannelOpenTry({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgChannelOpenTry:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:MsgChannelOpenTry:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendQueryChannelResponse({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.IbcCoreChannelV1.tx.sendQueryChannelResponse({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryChannelResponse:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QueryChannelResponse:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendQueryChannelClientStateRequest({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.IbcCoreChannelV1.tx.sendQueryChannelClientStateRequest({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryChannelClientStateRequest:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QueryChannelClientStateRequest:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendQueryPacketCommitmentRequest({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.IbcCoreChannelV1.tx.sendQueryPacketCommitmentRequest({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryPacketCommitmentRequest:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QueryPacketCommitmentRequest:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendQueryUnreceivedPacketsResponse({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.IbcCoreChannelV1.tx.sendQueryUnreceivedPacketsResponse({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryUnreceivedPacketsResponse:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QueryUnreceivedPacketsResponse:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendQueryUpgradeErrorRequest({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.IbcCoreChannelV1.tx.sendQueryUpgradeErrorRequest({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryUpgradeErrorRequest:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QueryUpgradeErrorRequest:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendTimeout({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.IbcCoreChannelV1.tx.sendTimeout({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:Timeout:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:Timeout:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendMsgPruneAcknowledgements({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.IbcCoreChannelV1.tx.sendMsgPruneAcknowledgements({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgPruneAcknowledgements:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:MsgPruneAcknowledgements:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendQueryPacketAcknowledgementsRequest({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.IbcCoreChannelV1.tx.sendQueryPacketAcknowledgementsRequest({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryPacketAcknowledgementsRequest:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QueryPacketAcknowledgementsRequest:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendQueryNextSequenceSendResponse({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.IbcCoreChannelV1.tx.sendQueryNextSequenceSendResponse({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryNextSequenceSendResponse:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QueryNextSequenceSendResponse:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		
		async PacketState({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.IbcCoreChannelV1.tx.packetState({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:PacketState:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:PacketState:Create Could not create message: ' + e.message)
				}
			}
		},
		async GenesisState({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.IbcCoreChannelV1.tx.genesisState({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:GenesisState:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:GenesisState:Create Could not create message: ' + e.message)
				}
			}
		},
		async MsgTimeoutOnClose({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.IbcCoreChannelV1.tx.msgTimeoutOnClose({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgTimeoutOnClose:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:MsgTimeoutOnClose:Create Could not create message: ' + e.message)
				}
			}
		},
		async MsgChannelUpgradeInit({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.IbcCoreChannelV1.tx.msgChannelUpgradeInit({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgChannelUpgradeInit:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:MsgChannelUpgradeInit:Create Could not create message: ' + e.message)
				}
			}
		},
		async MsgChannelUpgradeTry({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.IbcCoreChannelV1.tx.msgChannelUpgradeTry({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgChannelUpgradeTry:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:MsgChannelUpgradeTry:Create Could not create message: ' + e.message)
				}
			}
		},
		async MsgChannelOpenTryResponse({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.IbcCoreChannelV1.tx.msgChannelOpenTryResponse({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgChannelOpenTryResponse:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:MsgChannelOpenTryResponse:Create Could not create message: ' + e.message)
				}
			}
		},
		async MsgChannelUpgradeCancel({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.IbcCoreChannelV1.tx.msgChannelUpgradeCancel({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgChannelUpgradeCancel:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:MsgChannelUpgradeCancel:Create Could not create message: ' + e.message)
				}
			}
		},
		async QueryChannelClientStateResponse({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.IbcCoreChannelV1.tx.queryChannelClientStateResponse({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryChannelClientStateResponse:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QueryChannelClientStateResponse:Create Could not create message: ' + e.message)
				}
			}
		},
		async QueryChannelsResponse({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.IbcCoreChannelV1.tx.queryChannelsResponse({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryChannelsResponse:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QueryChannelsResponse:Create Could not create message: ' + e.message)
				}
			}
		},
		async MsgChannelOpenConfirmResponse({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.IbcCoreChannelV1.tx.msgChannelOpenConfirmResponse({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgChannelOpenConfirmResponse:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:MsgChannelOpenConfirmResponse:Create Could not create message: ' + e.message)
				}
			}
		},
		async MsgRecvPacketResponse({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.IbcCoreChannelV1.tx.msgRecvPacketResponse({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgRecvPacketResponse:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:MsgRecvPacketResponse:Create Could not create message: ' + e.message)
				}
			}
		},
		async MsgChannelOpenConfirm({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.IbcCoreChannelV1.tx.msgChannelOpenConfirm({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgChannelOpenConfirm:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:MsgChannelOpenConfirm:Create Could not create message: ' + e.message)
				}
			}
		},
		async MsgChannelUpgradeAck({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.IbcCoreChannelV1.tx.msgChannelUpgradeAck({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgChannelUpgradeAck:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:MsgChannelUpgradeAck:Create Could not create message: ' + e.message)
				}
			}
		},
		async QueryChannelConsensusStateRequest({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.IbcCoreChannelV1.tx.queryChannelConsensusStateRequest({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryChannelConsensusStateRequest:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QueryChannelConsensusStateRequest:Create Could not create message: ' + e.message)
				}
			}
		},
		async MsgChannelUpgradeInitResponse({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.IbcCoreChannelV1.tx.msgChannelUpgradeInitResponse({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgChannelUpgradeInitResponse:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:MsgChannelUpgradeInitResponse:Create Could not create message: ' + e.message)
				}
			}
		},
		async MsgChannelUpgradeAckResponse({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.IbcCoreChannelV1.tx.msgChannelUpgradeAckResponse({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgChannelUpgradeAckResponse:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:MsgChannelUpgradeAckResponse:Create Could not create message: ' + e.message)
				}
			}
		},
		async MsgChannelUpgradeOpenResponse({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.IbcCoreChannelV1.tx.msgChannelUpgradeOpenResponse({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgChannelUpgradeOpenResponse:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:MsgChannelUpgradeOpenResponse:Create Could not create message: ' + e.message)
				}
			}
		},
		async MsgPruneAcknowledgementsResponse({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.IbcCoreChannelV1.tx.msgPruneAcknowledgementsResponse({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgPruneAcknowledgementsResponse:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:MsgPruneAcknowledgementsResponse:Create Could not create message: ' + e.message)
				}
			}
		},
		async ErrorReceipt({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.IbcCoreChannelV1.tx.errorReceipt({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:ErrorReceipt:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:ErrorReceipt:Create Could not create message: ' + e.message)
				}
			}
		},
		async MsgChannelOpenInit({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.IbcCoreChannelV1.tx.msgChannelOpenInit({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgChannelOpenInit:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:MsgChannelOpenInit:Create Could not create message: ' + e.message)
				}
			}
		},
		async QueryConnectionChannelsResponse({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.IbcCoreChannelV1.tx.queryConnectionChannelsResponse({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryConnectionChannelsResponse:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QueryConnectionChannelsResponse:Create Could not create message: ' + e.message)
				}
			}
		},
		async QueryUnreceivedAcksRequest({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.IbcCoreChannelV1.tx.queryUnreceivedAcksRequest({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryUnreceivedAcksRequest:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QueryUnreceivedAcksRequest:Create Could not create message: ' + e.message)
				}
			}
		},
		async QueryUpgradeRequest({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.IbcCoreChannelV1.tx.queryUpgradeRequest({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryUpgradeRequest:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QueryUpgradeRequest:Create Could not create message: ' + e.message)
				}
			}
		},
		async Channel({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.IbcCoreChannelV1.tx.channel({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:Channel:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:Channel:Create Could not create message: ' + e.message)
				}
			}
		},
		async MsgChannelUpgradeConfirmResponse({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.IbcCoreChannelV1.tx.msgChannelUpgradeConfirmResponse({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgChannelUpgradeConfirmResponse:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:MsgChannelUpgradeConfirmResponse:Create Could not create message: ' + e.message)
				}
			}
		},
		async MsgChannelUpgradeCancelResponse({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.IbcCoreChannelV1.tx.msgChannelUpgradeCancelResponse({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgChannelUpgradeCancelResponse:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:MsgChannelUpgradeCancelResponse:Create Could not create message: ' + e.message)
				}
			}
		},
		async MsgRecvPacket({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.IbcCoreChannelV1.tx.msgRecvPacket({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgRecvPacket:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:MsgRecvPacket:Create Could not create message: ' + e.message)
				}
			}
		},
		async MsgChannelUpgradeConfirm({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.IbcCoreChannelV1.tx.msgChannelUpgradeConfirm({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgChannelUpgradeConfirm:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:MsgChannelUpgradeConfirm:Create Could not create message: ' + e.message)
				}
			}
		},
		async QueryChannelConsensusStateResponse({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.IbcCoreChannelV1.tx.queryChannelConsensusStateResponse({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryChannelConsensusStateResponse:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QueryChannelConsensusStateResponse:Create Could not create message: ' + e.message)
				}
			}
		},
		async QueryChannelParamsRequest({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.IbcCoreChannelV1.tx.queryChannelParamsRequest({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryChannelParamsRequest:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QueryChannelParamsRequest:Create Could not create message: ' + e.message)
				}
			}
		},
		async PacketId({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.IbcCoreChannelV1.tx.packetId({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:PacketId:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:PacketId:Create Could not create message: ' + e.message)
				}
			}
		},
		async MsgChannelCloseConfirmResponse({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.IbcCoreChannelV1.tx.msgChannelCloseConfirmResponse({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgChannelCloseConfirmResponse:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:MsgChannelCloseConfirmResponse:Create Could not create message: ' + e.message)
				}
			}
		},
		async MsgChannelUpgradeTryResponse({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.IbcCoreChannelV1.tx.msgChannelUpgradeTryResponse({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgChannelUpgradeTryResponse:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:MsgChannelUpgradeTryResponse:Create Could not create message: ' + e.message)
				}
			}
		},
		async QueryPacketReceiptResponse({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.IbcCoreChannelV1.tx.queryPacketReceiptResponse({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryPacketReceiptResponse:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QueryPacketReceiptResponse:Create Could not create message: ' + e.message)
				}
			}
		},
		async MsgAcknowledgement({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.IbcCoreChannelV1.tx.msgAcknowledgement({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgAcknowledgement:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:MsgAcknowledgement:Create Could not create message: ' + e.message)
				}
			}
		},
		async QueryPacketAcknowledgementResponse({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.IbcCoreChannelV1.tx.queryPacketAcknowledgementResponse({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryPacketAcknowledgementResponse:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QueryPacketAcknowledgementResponse:Create Could not create message: ' + e.message)
				}
			}
		},
		async QueryNextSequenceSendRequest({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.IbcCoreChannelV1.tx.queryNextSequenceSendRequest({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryNextSequenceSendRequest:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QueryNextSequenceSendRequest:Create Could not create message: ' + e.message)
				}
			}
		},
		async QueryUpgradeErrorResponse({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.IbcCoreChannelV1.tx.queryUpgradeErrorResponse({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryUpgradeErrorResponse:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QueryUpgradeErrorResponse:Create Could not create message: ' + e.message)
				}
			}
		},
		async Acknowledgement({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.IbcCoreChannelV1.tx.acknowledgement({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:Acknowledgement:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:Acknowledgement:Create Could not create message: ' + e.message)
				}
			}
		},
		async MsgChannelOpenAckResponse({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.IbcCoreChannelV1.tx.msgChannelOpenAckResponse({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgChannelOpenAckResponse:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:MsgChannelOpenAckResponse:Create Could not create message: ' + e.message)
				}
			}
		},
		async MsgChannelUpgradeTimeoutResponse({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.IbcCoreChannelV1.tx.msgChannelUpgradeTimeoutResponse({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgChannelUpgradeTimeoutResponse:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:MsgChannelUpgradeTimeoutResponse:Create Could not create message: ' + e.message)
				}
			}
		},
		async PacketSequence({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.IbcCoreChannelV1.tx.packetSequence({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:PacketSequence:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:PacketSequence:Create Could not create message: ' + e.message)
				}
			}
		},
		async MsgChannelUpgradeTimeout({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.IbcCoreChannelV1.tx.msgChannelUpgradeTimeout({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgChannelUpgradeTimeout:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:MsgChannelUpgradeTimeout:Create Could not create message: ' + e.message)
				}
			}
		},
		async QueryNextSequenceReceiveRequest({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.IbcCoreChannelV1.tx.queryNextSequenceReceiveRequest({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryNextSequenceReceiveRequest:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QueryNextSequenceReceiveRequest:Create Could not create message: ' + e.message)
				}
			}
		},
		async QueryNextSequenceReceiveResponse({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.IbcCoreChannelV1.tx.queryNextSequenceReceiveResponse({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryNextSequenceReceiveResponse:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QueryNextSequenceReceiveResponse:Create Could not create message: ' + e.message)
				}
			}
		},
		async IdentifiedChannel({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.IbcCoreChannelV1.tx.identifiedChannel({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:IdentifiedChannel:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:IdentifiedChannel:Create Could not create message: ' + e.message)
				}
			}
		},
		async Packet({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.IbcCoreChannelV1.tx.packet({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:Packet:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:Packet:Create Could not create message: ' + e.message)
				}
			}
		},
		async MsgTimeoutResponse({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.IbcCoreChannelV1.tx.msgTimeoutResponse({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgTimeoutResponse:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:MsgTimeoutResponse:Create Could not create message: ' + e.message)
				}
			}
		},
		async UpgradeFields({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.IbcCoreChannelV1.tx.upgradeFields({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:UpgradeFields:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:UpgradeFields:Create Could not create message: ' + e.message)
				}
			}
		},
		async MsgUpdateParams({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.IbcCoreChannelV1.tx.msgUpdateParams({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgUpdateParams:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:MsgUpdateParams:Create Could not create message: ' + e.message)
				}
			}
		},
		async QueryPacketCommitmentResponse({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.IbcCoreChannelV1.tx.queryPacketCommitmentResponse({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryPacketCommitmentResponse:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QueryPacketCommitmentResponse:Create Could not create message: ' + e.message)
				}
			}
		},
		async QueryPacketCommitmentsResponse({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.IbcCoreChannelV1.tx.queryPacketCommitmentsResponse({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryPacketCommitmentsResponse:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QueryPacketCommitmentsResponse:Create Could not create message: ' + e.message)
				}
			}
		},
		async QueryPacketAcknowledgementRequest({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.IbcCoreChannelV1.tx.queryPacketAcknowledgementRequest({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryPacketAcknowledgementRequest:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QueryPacketAcknowledgementRequest:Create Could not create message: ' + e.message)
				}
			}
		},
		async MsgTimeoutOnCloseResponse({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.IbcCoreChannelV1.tx.msgTimeoutOnCloseResponse({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgTimeoutOnCloseResponse:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:MsgTimeoutOnCloseResponse:Create Could not create message: ' + e.message)
				}
			}
		},
		async Upgrade({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.IbcCoreChannelV1.tx.upgrade({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:Upgrade:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:Upgrade:Create Could not create message: ' + e.message)
				}
			}
		},
		async MsgChannelOpenAck({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.IbcCoreChannelV1.tx.msgChannelOpenAck({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgChannelOpenAck:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:MsgChannelOpenAck:Create Could not create message: ' + e.message)
				}
			}
		},
		async QueryChannelsRequest({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.IbcCoreChannelV1.tx.queryChannelsRequest({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryChannelsRequest:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QueryChannelsRequest:Create Could not create message: ' + e.message)
				}
			}
		},
		async QueryChannelParamsResponse({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.IbcCoreChannelV1.tx.queryChannelParamsResponse({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryChannelParamsResponse:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QueryChannelParamsResponse:Create Could not create message: ' + e.message)
				}
			}
		},
		async MsgChannelCloseInitResponse({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.IbcCoreChannelV1.tx.msgChannelCloseInitResponse({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgChannelCloseInitResponse:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:MsgChannelCloseInitResponse:Create Could not create message: ' + e.message)
				}
			}
		},
		async QueryChannelRequest({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.IbcCoreChannelV1.tx.queryChannelRequest({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryChannelRequest:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QueryChannelRequest:Create Could not create message: ' + e.message)
				}
			}
		},
		async QueryConnectionChannelsRequest({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.IbcCoreChannelV1.tx.queryConnectionChannelsRequest({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryConnectionChannelsRequest:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QueryConnectionChannelsRequest:Create Could not create message: ' + e.message)
				}
			}
		},
		async QueryPacketCommitmentsRequest({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.IbcCoreChannelV1.tx.queryPacketCommitmentsRequest({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryPacketCommitmentsRequest:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QueryPacketCommitmentsRequest:Create Could not create message: ' + e.message)
				}
			}
		},
		async Counterparty({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.IbcCoreChannelV1.tx.counterparty({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:Counterparty:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:Counterparty:Create Could not create message: ' + e.message)
				}
			}
		},
		async Params({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.IbcCoreChannelV1.tx.params({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:Params:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:Params:Create Could not create message: ' + e.message)
				}
			}
		},
		async MsgChannelOpenInitResponse({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.IbcCoreChannelV1.tx.msgChannelOpenInitResponse({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgChannelOpenInitResponse:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:MsgChannelOpenInitResponse:Create Could not create message: ' + e.message)
				}
			}
		},
		async MsgChannelUpgradeOpen({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.IbcCoreChannelV1.tx.msgChannelUpgradeOpen({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgChannelUpgradeOpen:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:MsgChannelUpgradeOpen:Create Could not create message: ' + e.message)
				}
			}
		},
		async QueryPacketReceiptRequest({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.IbcCoreChannelV1.tx.queryPacketReceiptRequest({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryPacketReceiptRequest:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QueryPacketReceiptRequest:Create Could not create message: ' + e.message)
				}
			}
		},
		async QueryUnreceivedAcksResponse({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.IbcCoreChannelV1.tx.queryUnreceivedAcksResponse({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryUnreceivedAcksResponse:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QueryUnreceivedAcksResponse:Create Could not create message: ' + e.message)
				}
			}
		},
		async MsgAcknowledgementResponse({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.IbcCoreChannelV1.tx.msgAcknowledgementResponse({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgAcknowledgementResponse:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:MsgAcknowledgementResponse:Create Could not create message: ' + e.message)
				}
			}
		},
		async MsgChannelCloseInit({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.IbcCoreChannelV1.tx.msgChannelCloseInit({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgChannelCloseInit:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:MsgChannelCloseInit:Create Could not create message: ' + e.message)
				}
			}
		},
		async MsgChannelCloseConfirm({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.IbcCoreChannelV1.tx.msgChannelCloseConfirm({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgChannelCloseConfirm:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:MsgChannelCloseConfirm:Create Could not create message: ' + e.message)
				}
			}
		},
		async QueryUnreceivedPacketsRequest({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.IbcCoreChannelV1.tx.queryUnreceivedPacketsRequest({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryUnreceivedPacketsRequest:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QueryUnreceivedPacketsRequest:Create Could not create message: ' + e.message)
				}
			}
		},
		async QueryUpgradeResponse({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.IbcCoreChannelV1.tx.queryUpgradeResponse({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryUpgradeResponse:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QueryUpgradeResponse:Create Could not create message: ' + e.message)
				}
			}
		},
		async MsgUpdateParamsResponse({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.IbcCoreChannelV1.tx.msgUpdateParamsResponse({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgUpdateParamsResponse:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:MsgUpdateParamsResponse:Create Could not create message: ' + e.message)
				}
			}
		},
		async MsgTimeout({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.IbcCoreChannelV1.tx.msgTimeout({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgTimeout:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:MsgTimeout:Create Could not create message: ' + e.message)
				}
			}
		},
		async QueryPacketAcknowledgementsResponse({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.IbcCoreChannelV1.tx.queryPacketAcknowledgementsResponse({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryPacketAcknowledgementsResponse:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QueryPacketAcknowledgementsResponse:Create Could not create message: ' + e.message)
				}
			}
		},
		async MsgChannelOpenTry({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.IbcCoreChannelV1.tx.msgChannelOpenTry({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgChannelOpenTry:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:MsgChannelOpenTry:Create Could not create message: ' + e.message)
				}
			}
		},
		async QueryChannelResponse({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.IbcCoreChannelV1.tx.queryChannelResponse({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryChannelResponse:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QueryChannelResponse:Create Could not create message: ' + e.message)
				}
			}
		},
		async QueryChannelClientStateRequest({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.IbcCoreChannelV1.tx.queryChannelClientStateRequest({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryChannelClientStateRequest:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QueryChannelClientStateRequest:Create Could not create message: ' + e.message)
				}
			}
		},
		async QueryPacketCommitmentRequest({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.IbcCoreChannelV1.tx.queryPacketCommitmentRequest({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryPacketCommitmentRequest:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QueryPacketCommitmentRequest:Create Could not create message: ' + e.message)
				}
			}
		},
		async QueryUnreceivedPacketsResponse({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.IbcCoreChannelV1.tx.queryUnreceivedPacketsResponse({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryUnreceivedPacketsResponse:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QueryUnreceivedPacketsResponse:Create Could not create message: ' + e.message)
				}
			}
		},
		async QueryUpgradeErrorRequest({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.IbcCoreChannelV1.tx.queryUpgradeErrorRequest({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryUpgradeErrorRequest:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QueryUpgradeErrorRequest:Create Could not create message: ' + e.message)
				}
			}
		},
		async Timeout({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.IbcCoreChannelV1.tx.timeout({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:Timeout:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:Timeout:Create Could not create message: ' + e.message)
				}
			}
		},
		async MsgPruneAcknowledgements({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.IbcCoreChannelV1.tx.msgPruneAcknowledgements({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgPruneAcknowledgements:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:MsgPruneAcknowledgements:Create Could not create message: ' + e.message)
				}
			}
		},
		async QueryPacketAcknowledgementsRequest({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.IbcCoreChannelV1.tx.queryPacketAcknowledgementsRequest({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryPacketAcknowledgementsRequest:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QueryPacketAcknowledgementsRequest:Create Could not create message: ' + e.message)
				}
			}
		},
		async QueryNextSequenceSendResponse({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.IbcCoreChannelV1.tx.queryNextSequenceSendResponse({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryNextSequenceSendResponse:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QueryNextSequenceSendResponse:Create Could not create message: ' + e.message)
				}
			}
		},
		
	}
}