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
				ValidatorDistributionInfo: {},
				ValidatorOutstandingRewards: {},
				ValidatorCommission: {},
				ValidatorSlashes: {},
				DelegationRewards: {},
				DelegationTotalRewards: {},
				DelegatorValidators: {},
				DelegatorWithdrawAddress: {},
				CommunityPool: {},
				
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
				getValidatorDistributionInfo: (state) => (params = { params: {}}) => {
					if (!(<any> params).query) {
						(<any> params).query=null
					}
			return state.ValidatorDistributionInfo[JSON.stringify(params)] ?? {}
		},
				getValidatorOutstandingRewards: (state) => (params = { params: {}}) => {
					if (!(<any> params).query) {
						(<any> params).query=null
					}
			return state.ValidatorOutstandingRewards[JSON.stringify(params)] ?? {}
		},
				getValidatorCommission: (state) => (params = { params: {}}) => {
					if (!(<any> params).query) {
						(<any> params).query=null
					}
			return state.ValidatorCommission[JSON.stringify(params)] ?? {}
		},
				getValidatorSlashes: (state) => (params = { params: {}}) => {
					if (!(<any> params).query) {
						(<any> params).query=null
					}
			return state.ValidatorSlashes[JSON.stringify(params)] ?? {}
		},
				getDelegationRewards: (state) => (params = { params: {}}) => {
					if (!(<any> params).query) {
						(<any> params).query=null
					}
			return state.DelegationRewards[JSON.stringify(params)] ?? {}
		},
				getDelegationTotalRewards: (state) => (params = { params: {}}) => {
					if (!(<any> params).query) {
						(<any> params).query=null
					}
			return state.DelegationTotalRewards[JSON.stringify(params)] ?? {}
		},
				getDelegatorValidators: (state) => (params = { params: {}}) => {
					if (!(<any> params).query) {
						(<any> params).query=null
					}
			return state.DelegatorValidators[JSON.stringify(params)] ?? {}
		},
				getDelegatorWithdrawAddress: (state) => (params = { params: {}}) => {
					if (!(<any> params).query) {
						(<any> params).query=null
					}
			return state.DelegatorWithdrawAddress[JSON.stringify(params)] ?? {}
		},
				getCommunityPool: (state) => (params = { params: {}}) => {
					if (!(<any> params).query) {
						(<any> params).query=null
					}
			return state.CommunityPool[JSON.stringify(params)] ?? {}
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
			console.log('Vuex module: cosmos.distribution.v1beta1 initialized!')
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
				let value= (await client.CosmosDistributionV1Beta1.query.queryParams()).data
				
					
				commit('QUERY', { query: 'Params', key: { params: {...key}, query}, value })
				if (subscribe) commit('SUBSCRIBE', { action: 'QueryParams', payload: { options: { all }, params: {...key},query }})
				return getters['getParams']( { params: {...key}, query}) ?? {}
			} catch (e) {
				throw new Error('QueryClient:QueryParams API Node Unavailable. Could not perform query: ' + e.message)
				
			}
		},
		
		
		
		
		 		
		
		
		async QueryValidatorDistributionInfo({ commit, rootGetters, getters }, { options: { subscribe, all} = { subscribe:false, all:false}, params, query=null }) {
			try {
				const key = params ?? {};
				const client = initClient(rootGetters);
				let value= (await client.CosmosDistributionV1Beta1.query.queryValidatorDistributionInfo( key.validator_address)).data
				
					
				commit('QUERY', { query: 'ValidatorDistributionInfo', key: { params: {...key}, query}, value })
				if (subscribe) commit('SUBSCRIBE', { action: 'QueryValidatorDistributionInfo', payload: { options: { all }, params: {...key},query }})
				return getters['getValidatorDistributionInfo']( { params: {...key}, query}) ?? {}
			} catch (e) {
				throw new Error('QueryClient:QueryValidatorDistributionInfo API Node Unavailable. Could not perform query: ' + e.message)
				
			}
		},
		
		
		
		
		 		
		
		
		async QueryValidatorOutstandingRewards({ commit, rootGetters, getters }, { options: { subscribe, all} = { subscribe:false, all:false}, params, query=null }) {
			try {
				const key = params ?? {};
				const client = initClient(rootGetters);
				let value= (await client.CosmosDistributionV1Beta1.query.queryValidatorOutstandingRewards( key.validator_address)).data
				
					
				commit('QUERY', { query: 'ValidatorOutstandingRewards', key: { params: {...key}, query}, value })
				if (subscribe) commit('SUBSCRIBE', { action: 'QueryValidatorOutstandingRewards', payload: { options: { all }, params: {...key},query }})
				return getters['getValidatorOutstandingRewards']( { params: {...key}, query}) ?? {}
			} catch (e) {
				throw new Error('QueryClient:QueryValidatorOutstandingRewards API Node Unavailable. Could not perform query: ' + e.message)
				
			}
		},
		
		
		
		
		 		
		
		
		async QueryValidatorCommission({ commit, rootGetters, getters }, { options: { subscribe, all} = { subscribe:false, all:false}, params, query=null }) {
			try {
				const key = params ?? {};
				const client = initClient(rootGetters);
				let value= (await client.CosmosDistributionV1Beta1.query.queryValidatorCommission( key.validator_address)).data
				
					
				commit('QUERY', { query: 'ValidatorCommission', key: { params: {...key}, query}, value })
				if (subscribe) commit('SUBSCRIBE', { action: 'QueryValidatorCommission', payload: { options: { all }, params: {...key},query }})
				return getters['getValidatorCommission']( { params: {...key}, query}) ?? {}
			} catch (e) {
				throw new Error('QueryClient:QueryValidatorCommission API Node Unavailable. Could not perform query: ' + e.message)
				
			}
		},
		
		
		
		
		 		
		
		
		async QueryValidatorSlashes({ commit, rootGetters, getters }, { options: { subscribe, all} = { subscribe:false, all:false}, params, query=null }) {
			try {
				const key = params ?? {};
				const client = initClient(rootGetters);
				let value= (await client.CosmosDistributionV1Beta1.query.queryValidatorSlashes( key.validator_address, query ?? undefined)).data
				
					
				while (all && (<any> value).pagination && (<any> value).pagination.next_key!=null) {
					let next_values=(await client.CosmosDistributionV1Beta1.query.queryValidatorSlashes( key.validator_address, {...query ?? {}, 'pagination.key':(<any> value).pagination.next_key} as any)).data
					value = mergeResults(value, next_values);
				}
				commit('QUERY', { query: 'ValidatorSlashes', key: { params: {...key}, query}, value })
				if (subscribe) commit('SUBSCRIBE', { action: 'QueryValidatorSlashes', payload: { options: { all }, params: {...key},query }})
				return getters['getValidatorSlashes']( { params: {...key}, query}) ?? {}
			} catch (e) {
				throw new Error('QueryClient:QueryValidatorSlashes API Node Unavailable. Could not perform query: ' + e.message)
				
			}
		},
		
		
		
		
		 		
		
		
		async QueryDelegationRewards({ commit, rootGetters, getters }, { options: { subscribe, all} = { subscribe:false, all:false}, params, query=null }) {
			try {
				const key = params ?? {};
				const client = initClient(rootGetters);
				let value= (await client.CosmosDistributionV1Beta1.query.queryDelegationRewards( key.delegator_address,  key.validator_address)).data
				
					
				commit('QUERY', { query: 'DelegationRewards', key: { params: {...key}, query}, value })
				if (subscribe) commit('SUBSCRIBE', { action: 'QueryDelegationRewards', payload: { options: { all }, params: {...key},query }})
				return getters['getDelegationRewards']( { params: {...key}, query}) ?? {}
			} catch (e) {
				throw new Error('QueryClient:QueryDelegationRewards API Node Unavailable. Could not perform query: ' + e.message)
				
			}
		},
		
		
		
		
		 		
		
		
		async QueryDelegationTotalRewards({ commit, rootGetters, getters }, { options: { subscribe, all} = { subscribe:false, all:false}, params, query=null }) {
			try {
				const key = params ?? {};
				const client = initClient(rootGetters);
				let value= (await client.CosmosDistributionV1Beta1.query.queryDelegationTotalRewards( key.delegator_address)).data
				
					
				commit('QUERY', { query: 'DelegationTotalRewards', key: { params: {...key}, query}, value })
				if (subscribe) commit('SUBSCRIBE', { action: 'QueryDelegationTotalRewards', payload: { options: { all }, params: {...key},query }})
				return getters['getDelegationTotalRewards']( { params: {...key}, query}) ?? {}
			} catch (e) {
				throw new Error('QueryClient:QueryDelegationTotalRewards API Node Unavailable. Could not perform query: ' + e.message)
				
			}
		},
		
		
		
		
		 		
		
		
		async QueryDelegatorValidators({ commit, rootGetters, getters }, { options: { subscribe, all} = { subscribe:false, all:false}, params, query=null }) {
			try {
				const key = params ?? {};
				const client = initClient(rootGetters);
				let value= (await client.CosmosDistributionV1Beta1.query.queryDelegatorValidators( key.delegator_address)).data
				
					
				commit('QUERY', { query: 'DelegatorValidators', key: { params: {...key}, query}, value })
				if (subscribe) commit('SUBSCRIBE', { action: 'QueryDelegatorValidators', payload: { options: { all }, params: {...key},query }})
				return getters['getDelegatorValidators']( { params: {...key}, query}) ?? {}
			} catch (e) {
				throw new Error('QueryClient:QueryDelegatorValidators API Node Unavailable. Could not perform query: ' + e.message)
				
			}
		},
		
		
		
		
		 		
		
		
		async QueryDelegatorWithdrawAddress({ commit, rootGetters, getters }, { options: { subscribe, all} = { subscribe:false, all:false}, params, query=null }) {
			try {
				const key = params ?? {};
				const client = initClient(rootGetters);
				let value= (await client.CosmosDistributionV1Beta1.query.queryDelegatorWithdrawAddress( key.delegator_address)).data
				
					
				commit('QUERY', { query: 'DelegatorWithdrawAddress', key: { params: {...key}, query}, value })
				if (subscribe) commit('SUBSCRIBE', { action: 'QueryDelegatorWithdrawAddress', payload: { options: { all }, params: {...key},query }})
				return getters['getDelegatorWithdrawAddress']( { params: {...key}, query}) ?? {}
			} catch (e) {
				throw new Error('QueryClient:QueryDelegatorWithdrawAddress API Node Unavailable. Could not perform query: ' + e.message)
				
			}
		},
		
		
		
		
		 		
		
		
		async QueryCommunityPool({ commit, rootGetters, getters }, { options: { subscribe, all} = { subscribe:false, all:false}, params, query=null }) {
			try {
				const key = params ?? {};
				const client = initClient(rootGetters);
				let value= (await client.CosmosDistributionV1Beta1.query.queryCommunityPool()).data
				
					
				commit('QUERY', { query: 'CommunityPool', key: { params: {...key}, query}, value })
				if (subscribe) commit('SUBSCRIBE', { action: 'QueryCommunityPool', payload: { options: { all }, params: {...key},query }})
				return getters['getCommunityPool']( { params: {...key}, query}) ?? {}
			} catch (e) {
				throw new Error('QueryClient:QueryCommunityPool API Node Unavailable. Could not perform query: ' + e.message)
				
			}
		},
		
		
		async sendQueryDelegatorValidatorsResponse({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosDistributionV1Beta1.tx.sendQueryDelegatorValidatorsResponse({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryDelegatorValidatorsResponse:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QueryDelegatorValidatorsResponse:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendValidatorSlashEvent({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosDistributionV1Beta1.tx.sendValidatorSlashEvent({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:ValidatorSlashEvent:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:ValidatorSlashEvent:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendCommunityPoolSpendProposalWithDeposit({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosDistributionV1Beta1.tx.sendCommunityPoolSpendProposalWithDeposit({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:CommunityPoolSpendProposalWithDeposit:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:CommunityPoolSpendProposalWithDeposit:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendQueryValidatorDistributionInfoRequest({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosDistributionV1Beta1.tx.sendQueryValidatorDistributionInfoRequest({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryValidatorDistributionInfoRequest:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QueryValidatorDistributionInfoRequest:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendQueryValidatorOutstandingRewardsResponse({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosDistributionV1Beta1.tx.sendQueryValidatorOutstandingRewardsResponse({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryValidatorOutstandingRewardsResponse:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QueryValidatorOutstandingRewardsResponse:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendParams({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosDistributionV1Beta1.tx.sendParams({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:Params:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:Params:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendMsgWithdrawDelegatorRewardResponse({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosDistributionV1Beta1.tx.sendMsgWithdrawDelegatorRewardResponse({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgWithdrawDelegatorRewardResponse:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:MsgWithdrawDelegatorRewardResponse:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendQueryParamsRequest({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosDistributionV1Beta1.tx.sendQueryParamsRequest({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryParamsRequest:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QueryParamsRequest:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendQueryDelegatorValidatorsRequest({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosDistributionV1Beta1.tx.sendQueryDelegatorValidatorsRequest({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryDelegatorValidatorsRequest:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QueryDelegatorValidatorsRequest:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendDelegatorStartingInfoRecord({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosDistributionV1Beta1.tx.sendDelegatorStartingInfoRecord({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:DelegatorStartingInfoRecord:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:DelegatorStartingInfoRecord:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendMsgCommunityPoolSpendResponse({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosDistributionV1Beta1.tx.sendMsgCommunityPoolSpendResponse({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgCommunityPoolSpendResponse:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:MsgCommunityPoolSpendResponse:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendValidatorAccumulatedCommissionRecord({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosDistributionV1Beta1.tx.sendValidatorAccumulatedCommissionRecord({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:ValidatorAccumulatedCommissionRecord:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:ValidatorAccumulatedCommissionRecord:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendValidatorSlashEvents({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosDistributionV1Beta1.tx.sendValidatorSlashEvents({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:ValidatorSlashEvents:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:ValidatorSlashEvents:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendMsgFundCommunityPoolResponse({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosDistributionV1Beta1.tx.sendMsgFundCommunityPoolResponse({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgFundCommunityPoolResponse:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:MsgFundCommunityPoolResponse:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendMsgUpdateParamsResponse({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosDistributionV1Beta1.tx.sendMsgUpdateParamsResponse({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgUpdateParamsResponse:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:MsgUpdateParamsResponse:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendQueryCommunityPoolRequest({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosDistributionV1Beta1.tx.sendQueryCommunityPoolRequest({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryCommunityPoolRequest:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QueryCommunityPoolRequest:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendDelegatorStartingInfo({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosDistributionV1Beta1.tx.sendDelegatorStartingInfo({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:DelegatorStartingInfo:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:DelegatorStartingInfo:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendQueryDelegationRewardsRequest({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosDistributionV1Beta1.tx.sendQueryDelegationRewardsRequest({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryDelegationRewardsRequest:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QueryDelegationRewardsRequest:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendQueryDelegationTotalRewardsRequest({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosDistributionV1Beta1.tx.sendQueryDelegationTotalRewardsRequest({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryDelegationTotalRewardsRequest:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QueryDelegationTotalRewardsRequest:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendQueryDelegatorWithdrawAddressRequest({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosDistributionV1Beta1.tx.sendQueryDelegatorWithdrawAddressRequest({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryDelegatorWithdrawAddressRequest:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QueryDelegatorWithdrawAddressRequest:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendValidatorCurrentRewardsRecord({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosDistributionV1Beta1.tx.sendValidatorCurrentRewardsRecord({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:ValidatorCurrentRewardsRecord:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:ValidatorCurrentRewardsRecord:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendMsgSetWithdrawAddressResponse({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosDistributionV1Beta1.tx.sendMsgSetWithdrawAddressResponse({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgSetWithdrawAddressResponse:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:MsgSetWithdrawAddressResponse:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendQueryValidatorDistributionInfoResponse({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosDistributionV1Beta1.tx.sendQueryValidatorDistributionInfoResponse({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryValidatorDistributionInfoResponse:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QueryValidatorDistributionInfoResponse:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendQueryDelegationRewardsResponse({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosDistributionV1Beta1.tx.sendQueryDelegationRewardsResponse({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryDelegationRewardsResponse:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QueryDelegationRewardsResponse:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendQueryDelegatorWithdrawAddressResponse({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosDistributionV1Beta1.tx.sendQueryDelegatorWithdrawAddressResponse({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryDelegatorWithdrawAddressResponse:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QueryDelegatorWithdrawAddressResponse:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendDelegatorWithdrawInfo({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosDistributionV1Beta1.tx.sendDelegatorWithdrawInfo({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:DelegatorWithdrawInfo:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:DelegatorWithdrawInfo:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendValidatorHistoricalRewards({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosDistributionV1Beta1.tx.sendValidatorHistoricalRewards({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:ValidatorHistoricalRewards:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:ValidatorHistoricalRewards:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendValidatorOutstandingRewards({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosDistributionV1Beta1.tx.sendValidatorOutstandingRewards({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:ValidatorOutstandingRewards:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:ValidatorOutstandingRewards:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendDelegationDelegatorReward({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosDistributionV1Beta1.tx.sendDelegationDelegatorReward({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:DelegationDelegatorReward:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:DelegationDelegatorReward:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendMsgFundCommunityPool({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosDistributionV1Beta1.tx.sendMsgFundCommunityPool({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgFundCommunityPool:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:MsgFundCommunityPool:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendQueryCommunityPoolResponse({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosDistributionV1Beta1.tx.sendQueryCommunityPoolResponse({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryCommunityPoolResponse:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QueryCommunityPoolResponse:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendValidatorSlashEventRecord({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosDistributionV1Beta1.tx.sendValidatorSlashEventRecord({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:ValidatorSlashEventRecord:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:ValidatorSlashEventRecord:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendMsgWithdrawDelegatorReward({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosDistributionV1Beta1.tx.sendMsgWithdrawDelegatorReward({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgWithdrawDelegatorReward:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:MsgWithdrawDelegatorReward:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendQueryParamsResponse({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosDistributionV1Beta1.tx.sendQueryParamsResponse({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryParamsResponse:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QueryParamsResponse:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendQueryValidatorCommissionResponse({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosDistributionV1Beta1.tx.sendQueryValidatorCommissionResponse({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryValidatorCommissionResponse:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QueryValidatorCommissionResponse:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendGenesisState({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosDistributionV1Beta1.tx.sendGenesisState({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:GenesisState:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:GenesisState:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendMsgUpdateParams({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosDistributionV1Beta1.tx.sendMsgUpdateParams({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgUpdateParams:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:MsgUpdateParams:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendMsgDepositValidatorRewardsPoolResponse({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosDistributionV1Beta1.tx.sendMsgDepositValidatorRewardsPoolResponse({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgDepositValidatorRewardsPoolResponse:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:MsgDepositValidatorRewardsPoolResponse:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendMsgSetWithdrawAddress({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosDistributionV1Beta1.tx.sendMsgSetWithdrawAddress({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgSetWithdrawAddress:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:MsgSetWithdrawAddress:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendQueryDelegationTotalRewardsResponse({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosDistributionV1Beta1.tx.sendQueryDelegationTotalRewardsResponse({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryDelegationTotalRewardsResponse:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QueryDelegationTotalRewardsResponse:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendValidatorOutstandingRewardsRecord({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosDistributionV1Beta1.tx.sendValidatorOutstandingRewardsRecord({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:ValidatorOutstandingRewardsRecord:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:ValidatorOutstandingRewardsRecord:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendValidatorCurrentRewards({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosDistributionV1Beta1.tx.sendValidatorCurrentRewards({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:ValidatorCurrentRewards:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:ValidatorCurrentRewards:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendQueryValidatorOutstandingRewardsRequest({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosDistributionV1Beta1.tx.sendQueryValidatorOutstandingRewardsRequest({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryValidatorOutstandingRewardsRequest:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QueryValidatorOutstandingRewardsRequest:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendQueryValidatorSlashesRequest({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosDistributionV1Beta1.tx.sendQueryValidatorSlashesRequest({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryValidatorSlashesRequest:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QueryValidatorSlashesRequest:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendMsgWithdrawValidatorCommission({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosDistributionV1Beta1.tx.sendMsgWithdrawValidatorCommission({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgWithdrawValidatorCommission:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:MsgWithdrawValidatorCommission:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendMsgWithdrawValidatorCommissionResponse({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosDistributionV1Beta1.tx.sendMsgWithdrawValidatorCommissionResponse({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgWithdrawValidatorCommissionResponse:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:MsgWithdrawValidatorCommissionResponse:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendMsgDepositValidatorRewardsPool({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosDistributionV1Beta1.tx.sendMsgDepositValidatorRewardsPool({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgDepositValidatorRewardsPool:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:MsgDepositValidatorRewardsPool:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendFeePool({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosDistributionV1Beta1.tx.sendFeePool({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:FeePool:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:FeePool:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendMsgCommunityPoolSpend({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosDistributionV1Beta1.tx.sendMsgCommunityPoolSpend({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgCommunityPoolSpend:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:MsgCommunityPoolSpend:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendValidatorAccumulatedCommission({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosDistributionV1Beta1.tx.sendValidatorAccumulatedCommission({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:ValidatorAccumulatedCommission:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:ValidatorAccumulatedCommission:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendQueryValidatorCommissionRequest({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosDistributionV1Beta1.tx.sendQueryValidatorCommissionRequest({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryValidatorCommissionRequest:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QueryValidatorCommissionRequest:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendQueryValidatorSlashesResponse({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosDistributionV1Beta1.tx.sendQueryValidatorSlashesResponse({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryValidatorSlashesResponse:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QueryValidatorSlashesResponse:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendValidatorHistoricalRewardsRecord({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosDistributionV1Beta1.tx.sendValidatorHistoricalRewardsRecord({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:ValidatorHistoricalRewardsRecord:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:ValidatorHistoricalRewardsRecord:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendCommunityPoolSpendProposal({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosDistributionV1Beta1.tx.sendCommunityPoolSpendProposal({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:CommunityPoolSpendProposal:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:CommunityPoolSpendProposal:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		
		async QueryDelegatorValidatorsResponse({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosDistributionV1Beta1.tx.queryDelegatorValidatorsResponse({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryDelegatorValidatorsResponse:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QueryDelegatorValidatorsResponse:Create Could not create message: ' + e.message)
				}
			}
		},
		async ValidatorSlashEvent({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosDistributionV1Beta1.tx.validatorSlashEvent({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:ValidatorSlashEvent:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:ValidatorSlashEvent:Create Could not create message: ' + e.message)
				}
			}
		},
		async CommunityPoolSpendProposalWithDeposit({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosDistributionV1Beta1.tx.communityPoolSpendProposalWithDeposit({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:CommunityPoolSpendProposalWithDeposit:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:CommunityPoolSpendProposalWithDeposit:Create Could not create message: ' + e.message)
				}
			}
		},
		async QueryValidatorDistributionInfoRequest({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosDistributionV1Beta1.tx.queryValidatorDistributionInfoRequest({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryValidatorDistributionInfoRequest:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QueryValidatorDistributionInfoRequest:Create Could not create message: ' + e.message)
				}
			}
		},
		async QueryValidatorOutstandingRewardsResponse({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosDistributionV1Beta1.tx.queryValidatorOutstandingRewardsResponse({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryValidatorOutstandingRewardsResponse:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QueryValidatorOutstandingRewardsResponse:Create Could not create message: ' + e.message)
				}
			}
		},
		async Params({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosDistributionV1Beta1.tx.params({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:Params:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:Params:Create Could not create message: ' + e.message)
				}
			}
		},
		async MsgWithdrawDelegatorRewardResponse({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosDistributionV1Beta1.tx.msgWithdrawDelegatorRewardResponse({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgWithdrawDelegatorRewardResponse:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:MsgWithdrawDelegatorRewardResponse:Create Could not create message: ' + e.message)
				}
			}
		},
		async QueryParamsRequest({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosDistributionV1Beta1.tx.queryParamsRequest({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryParamsRequest:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QueryParamsRequest:Create Could not create message: ' + e.message)
				}
			}
		},
		async QueryDelegatorValidatorsRequest({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosDistributionV1Beta1.tx.queryDelegatorValidatorsRequest({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryDelegatorValidatorsRequest:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QueryDelegatorValidatorsRequest:Create Could not create message: ' + e.message)
				}
			}
		},
		async DelegatorStartingInfoRecord({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosDistributionV1Beta1.tx.delegatorStartingInfoRecord({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:DelegatorStartingInfoRecord:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:DelegatorStartingInfoRecord:Create Could not create message: ' + e.message)
				}
			}
		},
		async MsgCommunityPoolSpendResponse({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosDistributionV1Beta1.tx.msgCommunityPoolSpendResponse({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgCommunityPoolSpendResponse:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:MsgCommunityPoolSpendResponse:Create Could not create message: ' + e.message)
				}
			}
		},
		async ValidatorAccumulatedCommissionRecord({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosDistributionV1Beta1.tx.validatorAccumulatedCommissionRecord({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:ValidatorAccumulatedCommissionRecord:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:ValidatorAccumulatedCommissionRecord:Create Could not create message: ' + e.message)
				}
			}
		},
		async ValidatorSlashEvents({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosDistributionV1Beta1.tx.validatorSlashEvents({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:ValidatorSlashEvents:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:ValidatorSlashEvents:Create Could not create message: ' + e.message)
				}
			}
		},
		async MsgFundCommunityPoolResponse({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosDistributionV1Beta1.tx.msgFundCommunityPoolResponse({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgFundCommunityPoolResponse:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:MsgFundCommunityPoolResponse:Create Could not create message: ' + e.message)
				}
			}
		},
		async MsgUpdateParamsResponse({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosDistributionV1Beta1.tx.msgUpdateParamsResponse({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgUpdateParamsResponse:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:MsgUpdateParamsResponse:Create Could not create message: ' + e.message)
				}
			}
		},
		async QueryCommunityPoolRequest({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosDistributionV1Beta1.tx.queryCommunityPoolRequest({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryCommunityPoolRequest:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QueryCommunityPoolRequest:Create Could not create message: ' + e.message)
				}
			}
		},
		async DelegatorStartingInfo({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosDistributionV1Beta1.tx.delegatorStartingInfo({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:DelegatorStartingInfo:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:DelegatorStartingInfo:Create Could not create message: ' + e.message)
				}
			}
		},
		async QueryDelegationRewardsRequest({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosDistributionV1Beta1.tx.queryDelegationRewardsRequest({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryDelegationRewardsRequest:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QueryDelegationRewardsRequest:Create Could not create message: ' + e.message)
				}
			}
		},
		async QueryDelegationTotalRewardsRequest({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosDistributionV1Beta1.tx.queryDelegationTotalRewardsRequest({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryDelegationTotalRewardsRequest:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QueryDelegationTotalRewardsRequest:Create Could not create message: ' + e.message)
				}
			}
		},
		async QueryDelegatorWithdrawAddressRequest({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosDistributionV1Beta1.tx.queryDelegatorWithdrawAddressRequest({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryDelegatorWithdrawAddressRequest:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QueryDelegatorWithdrawAddressRequest:Create Could not create message: ' + e.message)
				}
			}
		},
		async ValidatorCurrentRewardsRecord({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosDistributionV1Beta1.tx.validatorCurrentRewardsRecord({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:ValidatorCurrentRewardsRecord:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:ValidatorCurrentRewardsRecord:Create Could not create message: ' + e.message)
				}
			}
		},
		async MsgSetWithdrawAddressResponse({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosDistributionV1Beta1.tx.msgSetWithdrawAddressResponse({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgSetWithdrawAddressResponse:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:MsgSetWithdrawAddressResponse:Create Could not create message: ' + e.message)
				}
			}
		},
		async QueryValidatorDistributionInfoResponse({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosDistributionV1Beta1.tx.queryValidatorDistributionInfoResponse({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryValidatorDistributionInfoResponse:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QueryValidatorDistributionInfoResponse:Create Could not create message: ' + e.message)
				}
			}
		},
		async QueryDelegationRewardsResponse({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosDistributionV1Beta1.tx.queryDelegationRewardsResponse({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryDelegationRewardsResponse:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QueryDelegationRewardsResponse:Create Could not create message: ' + e.message)
				}
			}
		},
		async QueryDelegatorWithdrawAddressResponse({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosDistributionV1Beta1.tx.queryDelegatorWithdrawAddressResponse({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryDelegatorWithdrawAddressResponse:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QueryDelegatorWithdrawAddressResponse:Create Could not create message: ' + e.message)
				}
			}
		},
		async DelegatorWithdrawInfo({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosDistributionV1Beta1.tx.delegatorWithdrawInfo({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:DelegatorWithdrawInfo:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:DelegatorWithdrawInfo:Create Could not create message: ' + e.message)
				}
			}
		},
		async ValidatorHistoricalRewards({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosDistributionV1Beta1.tx.validatorHistoricalRewards({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:ValidatorHistoricalRewards:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:ValidatorHistoricalRewards:Create Could not create message: ' + e.message)
				}
			}
		},
		async ValidatorOutstandingRewards({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosDistributionV1Beta1.tx.validatorOutstandingRewards({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:ValidatorOutstandingRewards:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:ValidatorOutstandingRewards:Create Could not create message: ' + e.message)
				}
			}
		},
		async DelegationDelegatorReward({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosDistributionV1Beta1.tx.delegationDelegatorReward({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:DelegationDelegatorReward:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:DelegationDelegatorReward:Create Could not create message: ' + e.message)
				}
			}
		},
		async MsgFundCommunityPool({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosDistributionV1Beta1.tx.msgFundCommunityPool({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgFundCommunityPool:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:MsgFundCommunityPool:Create Could not create message: ' + e.message)
				}
			}
		},
		async QueryCommunityPoolResponse({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosDistributionV1Beta1.tx.queryCommunityPoolResponse({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryCommunityPoolResponse:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QueryCommunityPoolResponse:Create Could not create message: ' + e.message)
				}
			}
		},
		async ValidatorSlashEventRecord({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosDistributionV1Beta1.tx.validatorSlashEventRecord({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:ValidatorSlashEventRecord:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:ValidatorSlashEventRecord:Create Could not create message: ' + e.message)
				}
			}
		},
		async MsgWithdrawDelegatorReward({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosDistributionV1Beta1.tx.msgWithdrawDelegatorReward({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgWithdrawDelegatorReward:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:MsgWithdrawDelegatorReward:Create Could not create message: ' + e.message)
				}
			}
		},
		async QueryParamsResponse({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosDistributionV1Beta1.tx.queryParamsResponse({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryParamsResponse:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QueryParamsResponse:Create Could not create message: ' + e.message)
				}
			}
		},
		async QueryValidatorCommissionResponse({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosDistributionV1Beta1.tx.queryValidatorCommissionResponse({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryValidatorCommissionResponse:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QueryValidatorCommissionResponse:Create Could not create message: ' + e.message)
				}
			}
		},
		async GenesisState({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosDistributionV1Beta1.tx.genesisState({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:GenesisState:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:GenesisState:Create Could not create message: ' + e.message)
				}
			}
		},
		async MsgUpdateParams({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosDistributionV1Beta1.tx.msgUpdateParams({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgUpdateParams:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:MsgUpdateParams:Create Could not create message: ' + e.message)
				}
			}
		},
		async MsgDepositValidatorRewardsPoolResponse({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosDistributionV1Beta1.tx.msgDepositValidatorRewardsPoolResponse({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgDepositValidatorRewardsPoolResponse:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:MsgDepositValidatorRewardsPoolResponse:Create Could not create message: ' + e.message)
				}
			}
		},
		async MsgSetWithdrawAddress({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosDistributionV1Beta1.tx.msgSetWithdrawAddress({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgSetWithdrawAddress:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:MsgSetWithdrawAddress:Create Could not create message: ' + e.message)
				}
			}
		},
		async QueryDelegationTotalRewardsResponse({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosDistributionV1Beta1.tx.queryDelegationTotalRewardsResponse({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryDelegationTotalRewardsResponse:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QueryDelegationTotalRewardsResponse:Create Could not create message: ' + e.message)
				}
			}
		},
		async ValidatorOutstandingRewardsRecord({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosDistributionV1Beta1.tx.validatorOutstandingRewardsRecord({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:ValidatorOutstandingRewardsRecord:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:ValidatorOutstandingRewardsRecord:Create Could not create message: ' + e.message)
				}
			}
		},
		async ValidatorCurrentRewards({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosDistributionV1Beta1.tx.validatorCurrentRewards({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:ValidatorCurrentRewards:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:ValidatorCurrentRewards:Create Could not create message: ' + e.message)
				}
			}
		},
		async QueryValidatorOutstandingRewardsRequest({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosDistributionV1Beta1.tx.queryValidatorOutstandingRewardsRequest({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryValidatorOutstandingRewardsRequest:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QueryValidatorOutstandingRewardsRequest:Create Could not create message: ' + e.message)
				}
			}
		},
		async QueryValidatorSlashesRequest({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosDistributionV1Beta1.tx.queryValidatorSlashesRequest({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryValidatorSlashesRequest:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QueryValidatorSlashesRequest:Create Could not create message: ' + e.message)
				}
			}
		},
		async MsgWithdrawValidatorCommission({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosDistributionV1Beta1.tx.msgWithdrawValidatorCommission({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgWithdrawValidatorCommission:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:MsgWithdrawValidatorCommission:Create Could not create message: ' + e.message)
				}
			}
		},
		async MsgWithdrawValidatorCommissionResponse({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosDistributionV1Beta1.tx.msgWithdrawValidatorCommissionResponse({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgWithdrawValidatorCommissionResponse:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:MsgWithdrawValidatorCommissionResponse:Create Could not create message: ' + e.message)
				}
			}
		},
		async MsgDepositValidatorRewardsPool({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosDistributionV1Beta1.tx.msgDepositValidatorRewardsPool({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgDepositValidatorRewardsPool:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:MsgDepositValidatorRewardsPool:Create Could not create message: ' + e.message)
				}
			}
		},
		async FeePool({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosDistributionV1Beta1.tx.feePool({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:FeePool:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:FeePool:Create Could not create message: ' + e.message)
				}
			}
		},
		async MsgCommunityPoolSpend({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosDistributionV1Beta1.tx.msgCommunityPoolSpend({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgCommunityPoolSpend:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:MsgCommunityPoolSpend:Create Could not create message: ' + e.message)
				}
			}
		},
		async ValidatorAccumulatedCommission({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosDistributionV1Beta1.tx.validatorAccumulatedCommission({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:ValidatorAccumulatedCommission:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:ValidatorAccumulatedCommission:Create Could not create message: ' + e.message)
				}
			}
		},
		async QueryValidatorCommissionRequest({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosDistributionV1Beta1.tx.queryValidatorCommissionRequest({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryValidatorCommissionRequest:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QueryValidatorCommissionRequest:Create Could not create message: ' + e.message)
				}
			}
		},
		async QueryValidatorSlashesResponse({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosDistributionV1Beta1.tx.queryValidatorSlashesResponse({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryValidatorSlashesResponse:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QueryValidatorSlashesResponse:Create Could not create message: ' + e.message)
				}
			}
		},
		async ValidatorHistoricalRewardsRecord({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosDistributionV1Beta1.tx.validatorHistoricalRewardsRecord({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:ValidatorHistoricalRewardsRecord:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:ValidatorHistoricalRewardsRecord:Create Could not create message: ' + e.message)
				}
			}
		},
		async CommunityPoolSpendProposal({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosDistributionV1Beta1.tx.communityPoolSpendProposal({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:CommunityPoolSpendProposal:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:CommunityPoolSpendProposal:Create Could not create message: ' + e.message)
				}
			}
		},
		
	}
}