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
				CurrentPlan: {},
				AppliedPlan: {},
				UpgradedConsensusState: {},
				ModuleVersions: {},
				Authority: {},
				
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
				getCurrentPlan: (state) => (params = { params: {}}) => {
					if (!(<any> params).query) {
						(<any> params).query=null
					}
			return state.CurrentPlan[JSON.stringify(params)] ?? {}
		},
				getAppliedPlan: (state) => (params = { params: {}}) => {
					if (!(<any> params).query) {
						(<any> params).query=null
					}
			return state.AppliedPlan[JSON.stringify(params)] ?? {}
		},
				getUpgradedConsensusState: (state) => (params = { params: {}}) => {
					if (!(<any> params).query) {
						(<any> params).query=null
					}
			return state.UpgradedConsensusState[JSON.stringify(params)] ?? {}
		},
				getModuleVersions: (state) => (params = { params: {}}) => {
					if (!(<any> params).query) {
						(<any> params).query=null
					}
			return state.ModuleVersions[JSON.stringify(params)] ?? {}
		},
				getAuthority: (state) => (params = { params: {}}) => {
					if (!(<any> params).query) {
						(<any> params).query=null
					}
			return state.Authority[JSON.stringify(params)] ?? {}
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
			console.log('Vuex module: cosmos.upgrade.v1beta1 initialized!')
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
		
		
		
		 		
		
		
		async QueryCurrentPlan({ commit, rootGetters, getters }, { options: { subscribe, all} = { subscribe:false, all:false}, params, query=null }) {
			try {
				const key = params ?? {};
				const client = initClient(rootGetters);
				let value= (await client.CosmosUpgradeV1Beta1.query.queryCurrentPlan()).data
				
					
				commit('QUERY', { query: 'CurrentPlan', key: { params: {...key}, query}, value })
				if (subscribe) commit('SUBSCRIBE', { action: 'QueryCurrentPlan', payload: { options: { all }, params: {...key},query }})
				return getters['getCurrentPlan']( { params: {...key}, query}) ?? {}
			} catch (e) {
				throw new Error('QueryClient:QueryCurrentPlan API Node Unavailable. Could not perform query: ' + e.message)
				
			}
		},
		
		
		
		
		 		
		
		
		async QueryAppliedPlan({ commit, rootGetters, getters }, { options: { subscribe, all} = { subscribe:false, all:false}, params, query=null }) {
			try {
				const key = params ?? {};
				const client = initClient(rootGetters);
				let value= (await client.CosmosUpgradeV1Beta1.query.queryAppliedPlan( key.name)).data
				
					
				commit('QUERY', { query: 'AppliedPlan', key: { params: {...key}, query}, value })
				if (subscribe) commit('SUBSCRIBE', { action: 'QueryAppliedPlan', payload: { options: { all }, params: {...key},query }})
				return getters['getAppliedPlan']( { params: {...key}, query}) ?? {}
			} catch (e) {
				throw new Error('QueryClient:QueryAppliedPlan API Node Unavailable. Could not perform query: ' + e.message)
				
			}
		},
		
		
		
		
		 		
		
		
		async QueryUpgradedConsensusState({ commit, rootGetters, getters }, { options: { subscribe, all} = { subscribe:false, all:false}, params, query=null }) {
			try {
				const key = params ?? {};
				const client = initClient(rootGetters);
				let value= (await client.CosmosUpgradeV1Beta1.query.queryUpgradedConsensusState( key.last_height)).data
				
					
				commit('QUERY', { query: 'UpgradedConsensusState', key: { params: {...key}, query}, value })
				if (subscribe) commit('SUBSCRIBE', { action: 'QueryUpgradedConsensusState', payload: { options: { all }, params: {...key},query }})
				return getters['getUpgradedConsensusState']( { params: {...key}, query}) ?? {}
			} catch (e) {
				throw new Error('QueryClient:QueryUpgradedConsensusState API Node Unavailable. Could not perform query: ' + e.message)
				
			}
		},
		
		
		
		
		 		
		
		
		async QueryModuleVersions({ commit, rootGetters, getters }, { options: { subscribe, all} = { subscribe:false, all:false}, params, query=null }) {
			try {
				const key = params ?? {};
				const client = initClient(rootGetters);
				let value= (await client.CosmosUpgradeV1Beta1.query.queryModuleVersions(query ?? undefined)).data
				
					
				while (all && (<any> value).pagination && (<any> value).pagination.next_key!=null) {
					let next_values=(await client.CosmosUpgradeV1Beta1.query.queryModuleVersions({...query ?? {}, 'pagination.key':(<any> value).pagination.next_key} as any)).data
					value = mergeResults(value, next_values);
				}
				commit('QUERY', { query: 'ModuleVersions', key: { params: {...key}, query}, value })
				if (subscribe) commit('SUBSCRIBE', { action: 'QueryModuleVersions', payload: { options: { all }, params: {...key},query }})
				return getters['getModuleVersions']( { params: {...key}, query}) ?? {}
			} catch (e) {
				throw new Error('QueryClient:QueryModuleVersions API Node Unavailable. Could not perform query: ' + e.message)
				
			}
		},
		
		
		
		
		 		
		
		
		async QueryAuthority({ commit, rootGetters, getters }, { options: { subscribe, all} = { subscribe:false, all:false}, params, query=null }) {
			try {
				const key = params ?? {};
				const client = initClient(rootGetters);
				let value= (await client.CosmosUpgradeV1Beta1.query.queryAuthority()).data
				
					
				commit('QUERY', { query: 'Authority', key: { params: {...key}, query}, value })
				if (subscribe) commit('SUBSCRIBE', { action: 'QueryAuthority', payload: { options: { all }, params: {...key},query }})
				return getters['getAuthority']( { params: {...key}, query}) ?? {}
			} catch (e) {
				throw new Error('QueryClient:QueryAuthority API Node Unavailable. Could not perform query: ' + e.message)
				
			}
		},
		
		
		async sendQueryCurrentPlanRequest({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosUpgradeV1Beta1.tx.sendQueryCurrentPlanRequest({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryCurrentPlanRequest:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QueryCurrentPlanRequest:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendQueryCurrentPlanResponse({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosUpgradeV1Beta1.tx.sendQueryCurrentPlanResponse({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryCurrentPlanResponse:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QueryCurrentPlanResponse:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendQueryModuleVersionsRequest({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosUpgradeV1Beta1.tx.sendQueryModuleVersionsRequest({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryModuleVersionsRequest:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QueryModuleVersionsRequest:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendMsgSoftwareUpgradeResponse({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosUpgradeV1Beta1.tx.sendMsgSoftwareUpgradeResponse({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgSoftwareUpgradeResponse:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:MsgSoftwareUpgradeResponse:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendQueryUpgradedConsensusStateResponse({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosUpgradeV1Beta1.tx.sendQueryUpgradedConsensusStateResponse({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryUpgradedConsensusStateResponse:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QueryUpgradedConsensusStateResponse:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendSoftwareUpgradeProposal({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosUpgradeV1Beta1.tx.sendSoftwareUpgradeProposal({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:SoftwareUpgradeProposal:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:SoftwareUpgradeProposal:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendQueryAppliedPlanRequest({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosUpgradeV1Beta1.tx.sendQueryAppliedPlanRequest({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryAppliedPlanRequest:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QueryAppliedPlanRequest:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendQueryUpgradedConsensusStateRequest({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosUpgradeV1Beta1.tx.sendQueryUpgradedConsensusStateRequest({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryUpgradedConsensusStateRequest:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QueryUpgradedConsensusStateRequest:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendQueryAuthorityRequest({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosUpgradeV1Beta1.tx.sendQueryAuthorityRequest({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryAuthorityRequest:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QueryAuthorityRequest:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendPlan({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosUpgradeV1Beta1.tx.sendPlan({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:Plan:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:Plan:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendMsgSoftwareUpgrade({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosUpgradeV1Beta1.tx.sendMsgSoftwareUpgrade({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgSoftwareUpgrade:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:MsgSoftwareUpgrade:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendQueryAppliedPlanResponse({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosUpgradeV1Beta1.tx.sendQueryAppliedPlanResponse({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryAppliedPlanResponse:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QueryAppliedPlanResponse:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendQueryModuleVersionsResponse({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosUpgradeV1Beta1.tx.sendQueryModuleVersionsResponse({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryModuleVersionsResponse:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QueryModuleVersionsResponse:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendQueryAuthorityResponse({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosUpgradeV1Beta1.tx.sendQueryAuthorityResponse({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryAuthorityResponse:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QueryAuthorityResponse:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendCancelSoftwareUpgradeProposal({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosUpgradeV1Beta1.tx.sendCancelSoftwareUpgradeProposal({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:CancelSoftwareUpgradeProposal:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:CancelSoftwareUpgradeProposal:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendMsgCancelUpgrade({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosUpgradeV1Beta1.tx.sendMsgCancelUpgrade({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgCancelUpgrade:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:MsgCancelUpgrade:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendMsgCancelUpgradeResponse({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosUpgradeV1Beta1.tx.sendMsgCancelUpgradeResponse({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgCancelUpgradeResponse:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:MsgCancelUpgradeResponse:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendModuleVersion({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosUpgradeV1Beta1.tx.sendModuleVersion({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:ModuleVersion:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:ModuleVersion:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		
		async QueryCurrentPlanRequest({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosUpgradeV1Beta1.tx.queryCurrentPlanRequest({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryCurrentPlanRequest:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QueryCurrentPlanRequest:Create Could not create message: ' + e.message)
				}
			}
		},
		async QueryCurrentPlanResponse({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosUpgradeV1Beta1.tx.queryCurrentPlanResponse({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryCurrentPlanResponse:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QueryCurrentPlanResponse:Create Could not create message: ' + e.message)
				}
			}
		},
		async QueryModuleVersionsRequest({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosUpgradeV1Beta1.tx.queryModuleVersionsRequest({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryModuleVersionsRequest:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QueryModuleVersionsRequest:Create Could not create message: ' + e.message)
				}
			}
		},
		async MsgSoftwareUpgradeResponse({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosUpgradeV1Beta1.tx.msgSoftwareUpgradeResponse({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgSoftwareUpgradeResponse:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:MsgSoftwareUpgradeResponse:Create Could not create message: ' + e.message)
				}
			}
		},
		async QueryUpgradedConsensusStateResponse({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosUpgradeV1Beta1.tx.queryUpgradedConsensusStateResponse({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryUpgradedConsensusStateResponse:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QueryUpgradedConsensusStateResponse:Create Could not create message: ' + e.message)
				}
			}
		},
		async SoftwareUpgradeProposal({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosUpgradeV1Beta1.tx.softwareUpgradeProposal({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:SoftwareUpgradeProposal:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:SoftwareUpgradeProposal:Create Could not create message: ' + e.message)
				}
			}
		},
		async QueryAppliedPlanRequest({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosUpgradeV1Beta1.tx.queryAppliedPlanRequest({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryAppliedPlanRequest:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QueryAppliedPlanRequest:Create Could not create message: ' + e.message)
				}
			}
		},
		async QueryUpgradedConsensusStateRequest({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosUpgradeV1Beta1.tx.queryUpgradedConsensusStateRequest({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryUpgradedConsensusStateRequest:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QueryUpgradedConsensusStateRequest:Create Could not create message: ' + e.message)
				}
			}
		},
		async QueryAuthorityRequest({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosUpgradeV1Beta1.tx.queryAuthorityRequest({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryAuthorityRequest:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QueryAuthorityRequest:Create Could not create message: ' + e.message)
				}
			}
		},
		async Plan({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosUpgradeV1Beta1.tx.plan({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:Plan:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:Plan:Create Could not create message: ' + e.message)
				}
			}
		},
		async MsgSoftwareUpgrade({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosUpgradeV1Beta1.tx.msgSoftwareUpgrade({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgSoftwareUpgrade:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:MsgSoftwareUpgrade:Create Could not create message: ' + e.message)
				}
			}
		},
		async QueryAppliedPlanResponse({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosUpgradeV1Beta1.tx.queryAppliedPlanResponse({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryAppliedPlanResponse:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QueryAppliedPlanResponse:Create Could not create message: ' + e.message)
				}
			}
		},
		async QueryModuleVersionsResponse({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosUpgradeV1Beta1.tx.queryModuleVersionsResponse({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryModuleVersionsResponse:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QueryModuleVersionsResponse:Create Could not create message: ' + e.message)
				}
			}
		},
		async QueryAuthorityResponse({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosUpgradeV1Beta1.tx.queryAuthorityResponse({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryAuthorityResponse:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QueryAuthorityResponse:Create Could not create message: ' + e.message)
				}
			}
		},
		async CancelSoftwareUpgradeProposal({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosUpgradeV1Beta1.tx.cancelSoftwareUpgradeProposal({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:CancelSoftwareUpgradeProposal:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:CancelSoftwareUpgradeProposal:Create Could not create message: ' + e.message)
				}
			}
		},
		async MsgCancelUpgrade({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosUpgradeV1Beta1.tx.msgCancelUpgrade({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgCancelUpgrade:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:MsgCancelUpgrade:Create Could not create message: ' + e.message)
				}
			}
		},
		async MsgCancelUpgradeResponse({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosUpgradeV1Beta1.tx.msgCancelUpgradeResponse({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgCancelUpgradeResponse:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:MsgCancelUpgradeResponse:Create Could not create message: ' + e.message)
				}
			}
		},
		async ModuleVersion({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosUpgradeV1Beta1.tx.moduleVersion({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:ModuleVersion:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:ModuleVersion:Create Could not create message: ' + e.message)
				}
			}
		},
		
	}
}