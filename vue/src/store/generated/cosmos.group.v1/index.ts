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
				GroupInfo: {},
				GroupPolicyInfo: {},
				GroupMembers: {},
				GroupsByAdmin: {},
				GroupPoliciesByGroup: {},
				GroupPoliciesByAdmin: {},
				Proposal: {},
				ProposalsByGroupPolicy: {},
				VoteByProposalVoter: {},
				VotesByProposal: {},
				VotesByVoter: {},
				GroupsByMember: {},
				TallyResult: {},
				Groups: {},
				
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
				getGroupInfo: (state) => (params = { params: {}}) => {
					if (!(<any> params).query) {
						(<any> params).query=null
					}
			return state.GroupInfo[JSON.stringify(params)] ?? {}
		},
				getGroupPolicyInfo: (state) => (params = { params: {}}) => {
					if (!(<any> params).query) {
						(<any> params).query=null
					}
			return state.GroupPolicyInfo[JSON.stringify(params)] ?? {}
		},
				getGroupMembers: (state) => (params = { params: {}}) => {
					if (!(<any> params).query) {
						(<any> params).query=null
					}
			return state.GroupMembers[JSON.stringify(params)] ?? {}
		},
				getGroupsByAdmin: (state) => (params = { params: {}}) => {
					if (!(<any> params).query) {
						(<any> params).query=null
					}
			return state.GroupsByAdmin[JSON.stringify(params)] ?? {}
		},
				getGroupPoliciesByGroup: (state) => (params = { params: {}}) => {
					if (!(<any> params).query) {
						(<any> params).query=null
					}
			return state.GroupPoliciesByGroup[JSON.stringify(params)] ?? {}
		},
				getGroupPoliciesByAdmin: (state) => (params = { params: {}}) => {
					if (!(<any> params).query) {
						(<any> params).query=null
					}
			return state.GroupPoliciesByAdmin[JSON.stringify(params)] ?? {}
		},
				getProposal: (state) => (params = { params: {}}) => {
					if (!(<any> params).query) {
						(<any> params).query=null
					}
			return state.Proposal[JSON.stringify(params)] ?? {}
		},
				getProposalsByGroupPolicy: (state) => (params = { params: {}}) => {
					if (!(<any> params).query) {
						(<any> params).query=null
					}
			return state.ProposalsByGroupPolicy[JSON.stringify(params)] ?? {}
		},
				getVoteByProposalVoter: (state) => (params = { params: {}}) => {
					if (!(<any> params).query) {
						(<any> params).query=null
					}
			return state.VoteByProposalVoter[JSON.stringify(params)] ?? {}
		},
				getVotesByProposal: (state) => (params = { params: {}}) => {
					if (!(<any> params).query) {
						(<any> params).query=null
					}
			return state.VotesByProposal[JSON.stringify(params)] ?? {}
		},
				getVotesByVoter: (state) => (params = { params: {}}) => {
					if (!(<any> params).query) {
						(<any> params).query=null
					}
			return state.VotesByVoter[JSON.stringify(params)] ?? {}
		},
				getGroupsByMember: (state) => (params = { params: {}}) => {
					if (!(<any> params).query) {
						(<any> params).query=null
					}
			return state.GroupsByMember[JSON.stringify(params)] ?? {}
		},
				getTallyResult: (state) => (params = { params: {}}) => {
					if (!(<any> params).query) {
						(<any> params).query=null
					}
			return state.TallyResult[JSON.stringify(params)] ?? {}
		},
				getGroups: (state) => (params = { params: {}}) => {
					if (!(<any> params).query) {
						(<any> params).query=null
					}
			return state.Groups[JSON.stringify(params)] ?? {}
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
			console.log('Vuex module: cosmos.group.v1 initialized!')
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
		
		
		
		 		
		
		
		async QueryGroupInfo({ commit, rootGetters, getters }, { options: { subscribe, all} = { subscribe:false, all:false}, params, query=null }) {
			try {
				const key = params ?? {};
				const client = initClient(rootGetters);
				let value= (await client.CosmosGroupV1.query.queryGroupInfo( key.group_id)).data
				
					
				commit('QUERY', { query: 'GroupInfo', key: { params: {...key}, query}, value })
				if (subscribe) commit('SUBSCRIBE', { action: 'QueryGroupInfo', payload: { options: { all }, params: {...key},query }})
				return getters['getGroupInfo']( { params: {...key}, query}) ?? {}
			} catch (e) {
				throw new Error('QueryClient:QueryGroupInfo API Node Unavailable. Could not perform query: ' + e.message)
				
			}
		},
		
		
		
		
		 		
		
		
		async QueryGroupPolicyInfo({ commit, rootGetters, getters }, { options: { subscribe, all} = { subscribe:false, all:false}, params, query=null }) {
			try {
				const key = params ?? {};
				const client = initClient(rootGetters);
				let value= (await client.CosmosGroupV1.query.queryGroupPolicyInfo( key.address)).data
				
					
				commit('QUERY', { query: 'GroupPolicyInfo', key: { params: {...key}, query}, value })
				if (subscribe) commit('SUBSCRIBE', { action: 'QueryGroupPolicyInfo', payload: { options: { all }, params: {...key},query }})
				return getters['getGroupPolicyInfo']( { params: {...key}, query}) ?? {}
			} catch (e) {
				throw new Error('QueryClient:QueryGroupPolicyInfo API Node Unavailable. Could not perform query: ' + e.message)
				
			}
		},
		
		
		
		
		 		
		
		
		async QueryGroupMembers({ commit, rootGetters, getters }, { options: { subscribe, all} = { subscribe:false, all:false}, params, query=null }) {
			try {
				const key = params ?? {};
				const client = initClient(rootGetters);
				let value= (await client.CosmosGroupV1.query.queryGroupMembers( key.group_id, query ?? undefined)).data
				
					
				while (all && (<any> value).pagination && (<any> value).pagination.next_key!=null) {
					let next_values=(await client.CosmosGroupV1.query.queryGroupMembers( key.group_id, {...query ?? {}, 'pagination.key':(<any> value).pagination.next_key} as any)).data
					value = mergeResults(value, next_values);
				}
				commit('QUERY', { query: 'GroupMembers', key: { params: {...key}, query}, value })
				if (subscribe) commit('SUBSCRIBE', { action: 'QueryGroupMembers', payload: { options: { all }, params: {...key},query }})
				return getters['getGroupMembers']( { params: {...key}, query}) ?? {}
			} catch (e) {
				throw new Error('QueryClient:QueryGroupMembers API Node Unavailable. Could not perform query: ' + e.message)
				
			}
		},
		
		
		
		
		 		
		
		
		async QueryGroupsByAdmin({ commit, rootGetters, getters }, { options: { subscribe, all} = { subscribe:false, all:false}, params, query=null }) {
			try {
				const key = params ?? {};
				const client = initClient(rootGetters);
				let value= (await client.CosmosGroupV1.query.queryGroupsByAdmin( key.admin, query ?? undefined)).data
				
					
				while (all && (<any> value).pagination && (<any> value).pagination.next_key!=null) {
					let next_values=(await client.CosmosGroupV1.query.queryGroupsByAdmin( key.admin, {...query ?? {}, 'pagination.key':(<any> value).pagination.next_key} as any)).data
					value = mergeResults(value, next_values);
				}
				commit('QUERY', { query: 'GroupsByAdmin', key: { params: {...key}, query}, value })
				if (subscribe) commit('SUBSCRIBE', { action: 'QueryGroupsByAdmin', payload: { options: { all }, params: {...key},query }})
				return getters['getGroupsByAdmin']( { params: {...key}, query}) ?? {}
			} catch (e) {
				throw new Error('QueryClient:QueryGroupsByAdmin API Node Unavailable. Could not perform query: ' + e.message)
				
			}
		},
		
		
		
		
		 		
		
		
		async QueryGroupPoliciesByGroup({ commit, rootGetters, getters }, { options: { subscribe, all} = { subscribe:false, all:false}, params, query=null }) {
			try {
				const key = params ?? {};
				const client = initClient(rootGetters);
				let value= (await client.CosmosGroupV1.query.queryGroupPoliciesByGroup( key.group_id, query ?? undefined)).data
				
					
				while (all && (<any> value).pagination && (<any> value).pagination.next_key!=null) {
					let next_values=(await client.CosmosGroupV1.query.queryGroupPoliciesByGroup( key.group_id, {...query ?? {}, 'pagination.key':(<any> value).pagination.next_key} as any)).data
					value = mergeResults(value, next_values);
				}
				commit('QUERY', { query: 'GroupPoliciesByGroup', key: { params: {...key}, query}, value })
				if (subscribe) commit('SUBSCRIBE', { action: 'QueryGroupPoliciesByGroup', payload: { options: { all }, params: {...key},query }})
				return getters['getGroupPoliciesByGroup']( { params: {...key}, query}) ?? {}
			} catch (e) {
				throw new Error('QueryClient:QueryGroupPoliciesByGroup API Node Unavailable. Could not perform query: ' + e.message)
				
			}
		},
		
		
		
		
		 		
		
		
		async QueryGroupPoliciesByAdmin({ commit, rootGetters, getters }, { options: { subscribe, all} = { subscribe:false, all:false}, params, query=null }) {
			try {
				const key = params ?? {};
				const client = initClient(rootGetters);
				let value= (await client.CosmosGroupV1.query.queryGroupPoliciesByAdmin( key.admin, query ?? undefined)).data
				
					
				while (all && (<any> value).pagination && (<any> value).pagination.next_key!=null) {
					let next_values=(await client.CosmosGroupV1.query.queryGroupPoliciesByAdmin( key.admin, {...query ?? {}, 'pagination.key':(<any> value).pagination.next_key} as any)).data
					value = mergeResults(value, next_values);
				}
				commit('QUERY', { query: 'GroupPoliciesByAdmin', key: { params: {...key}, query}, value })
				if (subscribe) commit('SUBSCRIBE', { action: 'QueryGroupPoliciesByAdmin', payload: { options: { all }, params: {...key},query }})
				return getters['getGroupPoliciesByAdmin']( { params: {...key}, query}) ?? {}
			} catch (e) {
				throw new Error('QueryClient:QueryGroupPoliciesByAdmin API Node Unavailable. Could not perform query: ' + e.message)
				
			}
		},
		
		
		
		
		 		
		
		
		async QueryProposal({ commit, rootGetters, getters }, { options: { subscribe, all} = { subscribe:false, all:false}, params, query=null }) {
			try {
				const key = params ?? {};
				const client = initClient(rootGetters);
				let value= (await client.CosmosGroupV1.query.queryProposal( key.proposal_id)).data
				
					
				commit('QUERY', { query: 'Proposal', key: { params: {...key}, query}, value })
				if (subscribe) commit('SUBSCRIBE', { action: 'QueryProposal', payload: { options: { all }, params: {...key},query }})
				return getters['getProposal']( { params: {...key}, query}) ?? {}
			} catch (e) {
				throw new Error('QueryClient:QueryProposal API Node Unavailable. Could not perform query: ' + e.message)
				
			}
		},
		
		
		
		
		 		
		
		
		async QueryProposalsByGroupPolicy({ commit, rootGetters, getters }, { options: { subscribe, all} = { subscribe:false, all:false}, params, query=null }) {
			try {
				const key = params ?? {};
				const client = initClient(rootGetters);
				let value= (await client.CosmosGroupV1.query.queryProposalsByGroupPolicy( key.address, query ?? undefined)).data
				
					
				while (all && (<any> value).pagination && (<any> value).pagination.next_key!=null) {
					let next_values=(await client.CosmosGroupV1.query.queryProposalsByGroupPolicy( key.address, {...query ?? {}, 'pagination.key':(<any> value).pagination.next_key} as any)).data
					value = mergeResults(value, next_values);
				}
				commit('QUERY', { query: 'ProposalsByGroupPolicy', key: { params: {...key}, query}, value })
				if (subscribe) commit('SUBSCRIBE', { action: 'QueryProposalsByGroupPolicy', payload: { options: { all }, params: {...key},query }})
				return getters['getProposalsByGroupPolicy']( { params: {...key}, query}) ?? {}
			} catch (e) {
				throw new Error('QueryClient:QueryProposalsByGroupPolicy API Node Unavailable. Could not perform query: ' + e.message)
				
			}
		},
		
		
		
		
		 		
		
		
		async QueryVoteByProposalVoter({ commit, rootGetters, getters }, { options: { subscribe, all} = { subscribe:false, all:false}, params, query=null }) {
			try {
				const key = params ?? {};
				const client = initClient(rootGetters);
				let value= (await client.CosmosGroupV1.query.queryVoteByProposalVoter( key.proposal_id,  key.voter)).data
				
					
				commit('QUERY', { query: 'VoteByProposalVoter', key: { params: {...key}, query}, value })
				if (subscribe) commit('SUBSCRIBE', { action: 'QueryVoteByProposalVoter', payload: { options: { all }, params: {...key},query }})
				return getters['getVoteByProposalVoter']( { params: {...key}, query}) ?? {}
			} catch (e) {
				throw new Error('QueryClient:QueryVoteByProposalVoter API Node Unavailable. Could not perform query: ' + e.message)
				
			}
		},
		
		
		
		
		 		
		
		
		async QueryVotesByProposal({ commit, rootGetters, getters }, { options: { subscribe, all} = { subscribe:false, all:false}, params, query=null }) {
			try {
				const key = params ?? {};
				const client = initClient(rootGetters);
				let value= (await client.CosmosGroupV1.query.queryVotesByProposal( key.proposal_id, query ?? undefined)).data
				
					
				while (all && (<any> value).pagination && (<any> value).pagination.next_key!=null) {
					let next_values=(await client.CosmosGroupV1.query.queryVotesByProposal( key.proposal_id, {...query ?? {}, 'pagination.key':(<any> value).pagination.next_key} as any)).data
					value = mergeResults(value, next_values);
				}
				commit('QUERY', { query: 'VotesByProposal', key: { params: {...key}, query}, value })
				if (subscribe) commit('SUBSCRIBE', { action: 'QueryVotesByProposal', payload: { options: { all }, params: {...key},query }})
				return getters['getVotesByProposal']( { params: {...key}, query}) ?? {}
			} catch (e) {
				throw new Error('QueryClient:QueryVotesByProposal API Node Unavailable. Could not perform query: ' + e.message)
				
			}
		},
		
		
		
		
		 		
		
		
		async QueryVotesByVoter({ commit, rootGetters, getters }, { options: { subscribe, all} = { subscribe:false, all:false}, params, query=null }) {
			try {
				const key = params ?? {};
				const client = initClient(rootGetters);
				let value= (await client.CosmosGroupV1.query.queryVotesByVoter( key.voter, query ?? undefined)).data
				
					
				while (all && (<any> value).pagination && (<any> value).pagination.next_key!=null) {
					let next_values=(await client.CosmosGroupV1.query.queryVotesByVoter( key.voter, {...query ?? {}, 'pagination.key':(<any> value).pagination.next_key} as any)).data
					value = mergeResults(value, next_values);
				}
				commit('QUERY', { query: 'VotesByVoter', key: { params: {...key}, query}, value })
				if (subscribe) commit('SUBSCRIBE', { action: 'QueryVotesByVoter', payload: { options: { all }, params: {...key},query }})
				return getters['getVotesByVoter']( { params: {...key}, query}) ?? {}
			} catch (e) {
				throw new Error('QueryClient:QueryVotesByVoter API Node Unavailable. Could not perform query: ' + e.message)
				
			}
		},
		
		
		
		
		 		
		
		
		async QueryGroupsByMember({ commit, rootGetters, getters }, { options: { subscribe, all} = { subscribe:false, all:false}, params, query=null }) {
			try {
				const key = params ?? {};
				const client = initClient(rootGetters);
				let value= (await client.CosmosGroupV1.query.queryGroupsByMember( key.address, query ?? undefined)).data
				
					
				while (all && (<any> value).pagination && (<any> value).pagination.next_key!=null) {
					let next_values=(await client.CosmosGroupV1.query.queryGroupsByMember( key.address, {...query ?? {}, 'pagination.key':(<any> value).pagination.next_key} as any)).data
					value = mergeResults(value, next_values);
				}
				commit('QUERY', { query: 'GroupsByMember', key: { params: {...key}, query}, value })
				if (subscribe) commit('SUBSCRIBE', { action: 'QueryGroupsByMember', payload: { options: { all }, params: {...key},query }})
				return getters['getGroupsByMember']( { params: {...key}, query}) ?? {}
			} catch (e) {
				throw new Error('QueryClient:QueryGroupsByMember API Node Unavailable. Could not perform query: ' + e.message)
				
			}
		},
		
		
		
		
		 		
		
		
		async QueryTallyResult({ commit, rootGetters, getters }, { options: { subscribe, all} = { subscribe:false, all:false}, params, query=null }) {
			try {
				const key = params ?? {};
				const client = initClient(rootGetters);
				let value= (await client.CosmosGroupV1.query.queryTallyResult( key.proposal_id)).data
				
					
				commit('QUERY', { query: 'TallyResult', key: { params: {...key}, query}, value })
				if (subscribe) commit('SUBSCRIBE', { action: 'QueryTallyResult', payload: { options: { all }, params: {...key},query }})
				return getters['getTallyResult']( { params: {...key}, query}) ?? {}
			} catch (e) {
				throw new Error('QueryClient:QueryTallyResult API Node Unavailable. Could not perform query: ' + e.message)
				
			}
		},
		
		
		
		
		 		
		
		
		async QueryGroups({ commit, rootGetters, getters }, { options: { subscribe, all} = { subscribe:false, all:false}, params, query=null }) {
			try {
				const key = params ?? {};
				const client = initClient(rootGetters);
				let value= (await client.CosmosGroupV1.query.queryGroups(query ?? undefined)).data
				
					
				while (all && (<any> value).pagination && (<any> value).pagination.next_key!=null) {
					let next_values=(await client.CosmosGroupV1.query.queryGroups({...query ?? {}, 'pagination.key':(<any> value).pagination.next_key} as any)).data
					value = mergeResults(value, next_values);
				}
				commit('QUERY', { query: 'Groups', key: { params: {...key}, query}, value })
				if (subscribe) commit('SUBSCRIBE', { action: 'QueryGroups', payload: { options: { all }, params: {...key},query }})
				return getters['getGroups']( { params: {...key}, query}) ?? {}
			} catch (e) {
				throw new Error('QueryClient:QueryGroups API Node Unavailable. Could not perform query: ' + e.message)
				
			}
		},
		
		
		async sendVote({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosGroupV1.tx.sendVote({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:Vote:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:Vote:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendMsgUpdateGroupPolicyAdminResponse({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosGroupV1.tx.sendMsgUpdateGroupPolicyAdminResponse({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgUpdateGroupPolicyAdminResponse:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:MsgUpdateGroupPolicyAdminResponse:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendMsgCreateGroupWithPolicyResponse({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosGroupV1.tx.sendMsgCreateGroupWithPolicyResponse({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgCreateGroupWithPolicyResponse:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:MsgCreateGroupWithPolicyResponse:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendQueryGroupMembersRequest({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosGroupV1.tx.sendQueryGroupMembersRequest({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryGroupMembersRequest:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QueryGroupMembersRequest:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendQueryProposalsByGroupPolicyRequest({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosGroupV1.tx.sendQueryProposalsByGroupPolicyRequest({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryProposalsByGroupPolicyRequest:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QueryProposalsByGroupPolicyRequest:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendQueryTallyResultRequest({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosGroupV1.tx.sendQueryTallyResultRequest({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryTallyResultRequest:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QueryTallyResultRequest:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendEventSubmitProposal({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosGroupV1.tx.sendEventSubmitProposal({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:EventSubmitProposal:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:EventSubmitProposal:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendEventWithdrawProposal({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosGroupV1.tx.sendEventWithdrawProposal({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:EventWithdrawProposal:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:EventWithdrawProposal:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendQueryVotesByVoterRequest({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosGroupV1.tx.sendQueryVotesByVoterRequest({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryVotesByVoterRequest:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QueryVotesByVoterRequest:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendMsgCreateGroupResponse({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosGroupV1.tx.sendMsgCreateGroupResponse({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgCreateGroupResponse:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:MsgCreateGroupResponse:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendMsgUpdateGroupMetadataResponse({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosGroupV1.tx.sendMsgUpdateGroupMetadataResponse({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgUpdateGroupMetadataResponse:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:MsgUpdateGroupMetadataResponse:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendMsgSubmitProposalResponse({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosGroupV1.tx.sendMsgSubmitProposalResponse({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgSubmitProposalResponse:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:MsgSubmitProposalResponse:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendQueryGroupsResponse({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosGroupV1.tx.sendQueryGroupsResponse({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryGroupsResponse:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QueryGroupsResponse:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendGroupInfo({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosGroupV1.tx.sendGroupInfo({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:GroupInfo:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:GroupInfo:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendGroupMember({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosGroupV1.tx.sendGroupMember({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:GroupMember:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:GroupMember:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendMsgUpdateGroupMetadata({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosGroupV1.tx.sendMsgUpdateGroupMetadata({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgUpdateGroupMetadata:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:MsgUpdateGroupMetadata:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendMsgUpdateGroupPolicyDecisionPolicyResponse({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosGroupV1.tx.sendMsgUpdateGroupPolicyDecisionPolicyResponse({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgUpdateGroupPolicyDecisionPolicyResponse:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:MsgUpdateGroupPolicyDecisionPolicyResponse:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendMsgUpdateGroupPolicyMetadataResponse({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosGroupV1.tx.sendMsgUpdateGroupPolicyMetadataResponse({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgUpdateGroupPolicyMetadataResponse:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:MsgUpdateGroupPolicyMetadataResponse:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendQueryGroupsByAdminRequest({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosGroupV1.tx.sendQueryGroupsByAdminRequest({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryGroupsByAdminRequest:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QueryGroupsByAdminRequest:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendQueryGroupPoliciesByAdminRequest({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosGroupV1.tx.sendQueryGroupPoliciesByAdminRequest({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryGroupPoliciesByAdminRequest:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QueryGroupPoliciesByAdminRequest:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendQueryVoteByProposalVoterRequest({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosGroupV1.tx.sendQueryVoteByProposalVoterRequest({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryVoteByProposalVoterRequest:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QueryVoteByProposalVoterRequest:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendMsgCreateGroup({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosGroupV1.tx.sendMsgCreateGroup({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgCreateGroup:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:MsgCreateGroup:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendQueryVoteByProposalVoterResponse({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosGroupV1.tx.sendQueryVoteByProposalVoterResponse({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryVoteByProposalVoterResponse:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QueryVoteByProposalVoterResponse:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendDecisionPolicyWindows({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosGroupV1.tx.sendDecisionPolicyWindows({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:DecisionPolicyWindows:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:DecisionPolicyWindows:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendQueryGroupPoliciesByGroupResponse({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosGroupV1.tx.sendQueryGroupPoliciesByGroupResponse({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryGroupPoliciesByGroupResponse:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QueryGroupPoliciesByGroupResponse:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendQueryVotesByProposalRequest({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosGroupV1.tx.sendQueryVotesByProposalRequest({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryVotesByProposalRequest:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QueryVotesByProposalRequest:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendProposal({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosGroupV1.tx.sendProposal({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:Proposal:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:Proposal:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendMember({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosGroupV1.tx.sendMember({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:Member:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:Member:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendEventLeaveGroup({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosGroupV1.tx.sendEventLeaveGroup({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:EventLeaveGroup:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:EventLeaveGroup:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendMsgUpdateGroupMembersResponse({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosGroupV1.tx.sendMsgUpdateGroupMembersResponse({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgUpdateGroupMembersResponse:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:MsgUpdateGroupMembersResponse:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendQueryGroupPolicyInfoResponse({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosGroupV1.tx.sendQueryGroupPolicyInfoResponse({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryGroupPolicyInfoResponse:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QueryGroupPolicyInfoResponse:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendEventUpdateGroup({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosGroupV1.tx.sendEventUpdateGroup({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:EventUpdateGroup:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:EventUpdateGroup:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendEventUpdateGroupPolicy({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosGroupV1.tx.sendEventUpdateGroupPolicy({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:EventUpdateGroupPolicy:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:EventUpdateGroupPolicy:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendPercentageDecisionPolicy({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosGroupV1.tx.sendPercentageDecisionPolicy({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:PercentageDecisionPolicy:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:PercentageDecisionPolicy:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendTallyResult({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosGroupV1.tx.sendTallyResult({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:TallyResult:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:TallyResult:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendQueryTallyResultResponse({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosGroupV1.tx.sendQueryTallyResultResponse({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryTallyResultResponse:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QueryTallyResultResponse:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendEventCreateGroupPolicy({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosGroupV1.tx.sendEventCreateGroupPolicy({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:EventCreateGroupPolicy:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:EventCreateGroupPolicy:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendEventVote({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosGroupV1.tx.sendEventVote({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:EventVote:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:EventVote:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendQueryProposalResponse({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosGroupV1.tx.sendQueryProposalResponse({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryProposalResponse:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QueryProposalResponse:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendGenesisState({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosGroupV1.tx.sendGenesisState({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:GenesisState:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:GenesisState:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendEventExec({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosGroupV1.tx.sendEventExec({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:EventExec:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:EventExec:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendQueryGroupPolicyInfoRequest({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosGroupV1.tx.sendQueryGroupPolicyInfoRequest({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryGroupPolicyInfoRequest:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QueryGroupPolicyInfoRequest:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendEventProposalPruned({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosGroupV1.tx.sendEventProposalPruned({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:EventProposalPruned:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:EventProposalPruned:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendMsgUpdateGroupMembers({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosGroupV1.tx.sendMsgUpdateGroupMembers({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgUpdateGroupMembers:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:MsgUpdateGroupMembers:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendMsgCreateGroupPolicy({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosGroupV1.tx.sendMsgCreateGroupPolicy({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgCreateGroupPolicy:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:MsgCreateGroupPolicy:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendMsgCreateGroupPolicyResponse({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosGroupV1.tx.sendMsgCreateGroupPolicyResponse({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgCreateGroupPolicyResponse:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:MsgCreateGroupPolicyResponse:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendQueryGroupsByMemberRequest({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosGroupV1.tx.sendQueryGroupsByMemberRequest({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryGroupsByMemberRequest:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QueryGroupsByMemberRequest:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendEventCreateGroup({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosGroupV1.tx.sendEventCreateGroup({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:EventCreateGroup:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:EventCreateGroup:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendMemberRequest({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosGroupV1.tx.sendMemberRequest({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MemberRequest:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:MemberRequest:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendMsgSubmitProposal({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosGroupV1.tx.sendMsgSubmitProposal({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgSubmitProposal:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:MsgSubmitProposal:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendQueryGroupInfoResponse({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosGroupV1.tx.sendQueryGroupInfoResponse({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryGroupInfoResponse:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QueryGroupInfoResponse:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendQueryGroupsByAdminResponse({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosGroupV1.tx.sendQueryGroupsByAdminResponse({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryGroupsByAdminResponse:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QueryGroupsByAdminResponse:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendQueryProposalRequest({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosGroupV1.tx.sendQueryProposalRequest({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryProposalRequest:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QueryProposalRequest:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendQueryVotesByVoterResponse({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosGroupV1.tx.sendQueryVotesByVoterResponse({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryVotesByVoterResponse:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QueryVotesByVoterResponse:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendThresholdDecisionPolicy({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosGroupV1.tx.sendThresholdDecisionPolicy({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:ThresholdDecisionPolicy:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:ThresholdDecisionPolicy:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendGroupPolicyInfo({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosGroupV1.tx.sendGroupPolicyInfo({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:GroupPolicyInfo:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:GroupPolicyInfo:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendMsgUpdateGroupPolicyDecisionPolicy({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosGroupV1.tx.sendMsgUpdateGroupPolicyDecisionPolicy({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgUpdateGroupPolicyDecisionPolicy:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:MsgUpdateGroupPolicyDecisionPolicy:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendMsgVote({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosGroupV1.tx.sendMsgVote({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgVote:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:MsgVote:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendMsgLeaveGroup({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosGroupV1.tx.sendMsgLeaveGroup({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgLeaveGroup:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:MsgLeaveGroup:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendQueryVotesByProposalResponse({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosGroupV1.tx.sendQueryVotesByProposalResponse({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryVotesByProposalResponse:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QueryVotesByProposalResponse:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendMsgUpdateGroupAdmin({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosGroupV1.tx.sendMsgUpdateGroupAdmin({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgUpdateGroupAdmin:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:MsgUpdateGroupAdmin:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendMsgWithdrawProposalResponse({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosGroupV1.tx.sendMsgWithdrawProposalResponse({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgWithdrawProposalResponse:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:MsgWithdrawProposalResponse:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendMsgCreateGroupWithPolicy({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosGroupV1.tx.sendMsgCreateGroupWithPolicy({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgCreateGroupWithPolicy:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:MsgCreateGroupWithPolicy:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendMsgUpdateGroupPolicyMetadata({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosGroupV1.tx.sendMsgUpdateGroupPolicyMetadata({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgUpdateGroupPolicyMetadata:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:MsgUpdateGroupPolicyMetadata:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendMsgExecResponse({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosGroupV1.tx.sendMsgExecResponse({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgExecResponse:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:MsgExecResponse:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendMsgLeaveGroupResponse({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosGroupV1.tx.sendMsgLeaveGroupResponse({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgLeaveGroupResponse:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:MsgLeaveGroupResponse:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendQueryGroupMembersResponse({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosGroupV1.tx.sendQueryGroupMembersResponse({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryGroupMembersResponse:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QueryGroupMembersResponse:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendQueryProposalsByGroupPolicyResponse({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosGroupV1.tx.sendQueryProposalsByGroupPolicyResponse({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryProposalsByGroupPolicyResponse:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QueryProposalsByGroupPolicyResponse:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendMsgUpdateGroupAdminResponse({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosGroupV1.tx.sendMsgUpdateGroupAdminResponse({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgUpdateGroupAdminResponse:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:MsgUpdateGroupAdminResponse:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendMsgUpdateGroupPolicyAdmin({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosGroupV1.tx.sendMsgUpdateGroupPolicyAdmin({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgUpdateGroupPolicyAdmin:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:MsgUpdateGroupPolicyAdmin:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendQueryGroupsRequest({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosGroupV1.tx.sendQueryGroupsRequest({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryGroupsRequest:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QueryGroupsRequest:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendMsgExec({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosGroupV1.tx.sendMsgExec({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgExec:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:MsgExec:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendQueryGroupInfoRequest({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosGroupV1.tx.sendQueryGroupInfoRequest({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryGroupInfoRequest:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QueryGroupInfoRequest:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendMsgWithdrawProposal({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosGroupV1.tx.sendMsgWithdrawProposal({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgWithdrawProposal:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:MsgWithdrawProposal:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendQueryGroupPoliciesByGroupRequest({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosGroupV1.tx.sendQueryGroupPoliciesByGroupRequest({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryGroupPoliciesByGroupRequest:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QueryGroupPoliciesByGroupRequest:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendQueryGroupPoliciesByAdminResponse({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosGroupV1.tx.sendQueryGroupPoliciesByAdminResponse({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryGroupPoliciesByAdminResponse:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QueryGroupPoliciesByAdminResponse:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendQueryGroupsByMemberResponse({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosGroupV1.tx.sendQueryGroupsByMemberResponse({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryGroupsByMemberResponse:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QueryGroupsByMemberResponse:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendMsgVoteResponse({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosGroupV1.tx.sendMsgVoteResponse({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgVoteResponse:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:MsgVoteResponse:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		
		async Vote({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosGroupV1.tx.vote({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:Vote:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:Vote:Create Could not create message: ' + e.message)
				}
			}
		},
		async MsgUpdateGroupPolicyAdminResponse({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosGroupV1.tx.msgUpdateGroupPolicyAdminResponse({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgUpdateGroupPolicyAdminResponse:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:MsgUpdateGroupPolicyAdminResponse:Create Could not create message: ' + e.message)
				}
			}
		},
		async MsgCreateGroupWithPolicyResponse({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosGroupV1.tx.msgCreateGroupWithPolicyResponse({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgCreateGroupWithPolicyResponse:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:MsgCreateGroupWithPolicyResponse:Create Could not create message: ' + e.message)
				}
			}
		},
		async QueryGroupMembersRequest({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosGroupV1.tx.queryGroupMembersRequest({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryGroupMembersRequest:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QueryGroupMembersRequest:Create Could not create message: ' + e.message)
				}
			}
		},
		async QueryProposalsByGroupPolicyRequest({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosGroupV1.tx.queryProposalsByGroupPolicyRequest({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryProposalsByGroupPolicyRequest:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QueryProposalsByGroupPolicyRequest:Create Could not create message: ' + e.message)
				}
			}
		},
		async QueryTallyResultRequest({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosGroupV1.tx.queryTallyResultRequest({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryTallyResultRequest:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QueryTallyResultRequest:Create Could not create message: ' + e.message)
				}
			}
		},
		async EventSubmitProposal({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosGroupV1.tx.eventSubmitProposal({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:EventSubmitProposal:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:EventSubmitProposal:Create Could not create message: ' + e.message)
				}
			}
		},
		async EventWithdrawProposal({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosGroupV1.tx.eventWithdrawProposal({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:EventWithdrawProposal:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:EventWithdrawProposal:Create Could not create message: ' + e.message)
				}
			}
		},
		async QueryVotesByVoterRequest({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosGroupV1.tx.queryVotesByVoterRequest({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryVotesByVoterRequest:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QueryVotesByVoterRequest:Create Could not create message: ' + e.message)
				}
			}
		},
		async MsgCreateGroupResponse({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosGroupV1.tx.msgCreateGroupResponse({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgCreateGroupResponse:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:MsgCreateGroupResponse:Create Could not create message: ' + e.message)
				}
			}
		},
		async MsgUpdateGroupMetadataResponse({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosGroupV1.tx.msgUpdateGroupMetadataResponse({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgUpdateGroupMetadataResponse:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:MsgUpdateGroupMetadataResponse:Create Could not create message: ' + e.message)
				}
			}
		},
		async MsgSubmitProposalResponse({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosGroupV1.tx.msgSubmitProposalResponse({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgSubmitProposalResponse:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:MsgSubmitProposalResponse:Create Could not create message: ' + e.message)
				}
			}
		},
		async QueryGroupsResponse({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosGroupV1.tx.queryGroupsResponse({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryGroupsResponse:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QueryGroupsResponse:Create Could not create message: ' + e.message)
				}
			}
		},
		async GroupInfo({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosGroupV1.tx.groupInfo({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:GroupInfo:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:GroupInfo:Create Could not create message: ' + e.message)
				}
			}
		},
		async GroupMember({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosGroupV1.tx.groupMember({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:GroupMember:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:GroupMember:Create Could not create message: ' + e.message)
				}
			}
		},
		async MsgUpdateGroupMetadata({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosGroupV1.tx.msgUpdateGroupMetadata({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgUpdateGroupMetadata:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:MsgUpdateGroupMetadata:Create Could not create message: ' + e.message)
				}
			}
		},
		async MsgUpdateGroupPolicyDecisionPolicyResponse({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosGroupV1.tx.msgUpdateGroupPolicyDecisionPolicyResponse({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgUpdateGroupPolicyDecisionPolicyResponse:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:MsgUpdateGroupPolicyDecisionPolicyResponse:Create Could not create message: ' + e.message)
				}
			}
		},
		async MsgUpdateGroupPolicyMetadataResponse({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosGroupV1.tx.msgUpdateGroupPolicyMetadataResponse({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgUpdateGroupPolicyMetadataResponse:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:MsgUpdateGroupPolicyMetadataResponse:Create Could not create message: ' + e.message)
				}
			}
		},
		async QueryGroupsByAdminRequest({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosGroupV1.tx.queryGroupsByAdminRequest({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryGroupsByAdminRequest:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QueryGroupsByAdminRequest:Create Could not create message: ' + e.message)
				}
			}
		},
		async QueryGroupPoliciesByAdminRequest({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosGroupV1.tx.queryGroupPoliciesByAdminRequest({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryGroupPoliciesByAdminRequest:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QueryGroupPoliciesByAdminRequest:Create Could not create message: ' + e.message)
				}
			}
		},
		async QueryVoteByProposalVoterRequest({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosGroupV1.tx.queryVoteByProposalVoterRequest({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryVoteByProposalVoterRequest:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QueryVoteByProposalVoterRequest:Create Could not create message: ' + e.message)
				}
			}
		},
		async MsgCreateGroup({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosGroupV1.tx.msgCreateGroup({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgCreateGroup:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:MsgCreateGroup:Create Could not create message: ' + e.message)
				}
			}
		},
		async QueryVoteByProposalVoterResponse({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosGroupV1.tx.queryVoteByProposalVoterResponse({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryVoteByProposalVoterResponse:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QueryVoteByProposalVoterResponse:Create Could not create message: ' + e.message)
				}
			}
		},
		async DecisionPolicyWindows({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosGroupV1.tx.decisionPolicyWindows({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:DecisionPolicyWindows:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:DecisionPolicyWindows:Create Could not create message: ' + e.message)
				}
			}
		},
		async QueryGroupPoliciesByGroupResponse({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosGroupV1.tx.queryGroupPoliciesByGroupResponse({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryGroupPoliciesByGroupResponse:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QueryGroupPoliciesByGroupResponse:Create Could not create message: ' + e.message)
				}
			}
		},
		async QueryVotesByProposalRequest({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosGroupV1.tx.queryVotesByProposalRequest({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryVotesByProposalRequest:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QueryVotesByProposalRequest:Create Could not create message: ' + e.message)
				}
			}
		},
		async Proposal({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosGroupV1.tx.proposal({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:Proposal:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:Proposal:Create Could not create message: ' + e.message)
				}
			}
		},
		async Member({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosGroupV1.tx.member({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:Member:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:Member:Create Could not create message: ' + e.message)
				}
			}
		},
		async EventLeaveGroup({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosGroupV1.tx.eventLeaveGroup({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:EventLeaveGroup:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:EventLeaveGroup:Create Could not create message: ' + e.message)
				}
			}
		},
		async MsgUpdateGroupMembersResponse({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosGroupV1.tx.msgUpdateGroupMembersResponse({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgUpdateGroupMembersResponse:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:MsgUpdateGroupMembersResponse:Create Could not create message: ' + e.message)
				}
			}
		},
		async QueryGroupPolicyInfoResponse({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosGroupV1.tx.queryGroupPolicyInfoResponse({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryGroupPolicyInfoResponse:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QueryGroupPolicyInfoResponse:Create Could not create message: ' + e.message)
				}
			}
		},
		async EventUpdateGroup({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosGroupV1.tx.eventUpdateGroup({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:EventUpdateGroup:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:EventUpdateGroup:Create Could not create message: ' + e.message)
				}
			}
		},
		async EventUpdateGroupPolicy({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosGroupV1.tx.eventUpdateGroupPolicy({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:EventUpdateGroupPolicy:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:EventUpdateGroupPolicy:Create Could not create message: ' + e.message)
				}
			}
		},
		async PercentageDecisionPolicy({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosGroupV1.tx.percentageDecisionPolicy({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:PercentageDecisionPolicy:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:PercentageDecisionPolicy:Create Could not create message: ' + e.message)
				}
			}
		},
		async TallyResult({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosGroupV1.tx.tallyResult({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:TallyResult:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:TallyResult:Create Could not create message: ' + e.message)
				}
			}
		},
		async QueryTallyResultResponse({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosGroupV1.tx.queryTallyResultResponse({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryTallyResultResponse:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QueryTallyResultResponse:Create Could not create message: ' + e.message)
				}
			}
		},
		async EventCreateGroupPolicy({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosGroupV1.tx.eventCreateGroupPolicy({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:EventCreateGroupPolicy:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:EventCreateGroupPolicy:Create Could not create message: ' + e.message)
				}
			}
		},
		async EventVote({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosGroupV1.tx.eventVote({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:EventVote:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:EventVote:Create Could not create message: ' + e.message)
				}
			}
		},
		async QueryProposalResponse({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosGroupV1.tx.queryProposalResponse({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryProposalResponse:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QueryProposalResponse:Create Could not create message: ' + e.message)
				}
			}
		},
		async GenesisState({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosGroupV1.tx.genesisState({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:GenesisState:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:GenesisState:Create Could not create message: ' + e.message)
				}
			}
		},
		async EventExec({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosGroupV1.tx.eventExec({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:EventExec:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:EventExec:Create Could not create message: ' + e.message)
				}
			}
		},
		async QueryGroupPolicyInfoRequest({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosGroupV1.tx.queryGroupPolicyInfoRequest({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryGroupPolicyInfoRequest:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QueryGroupPolicyInfoRequest:Create Could not create message: ' + e.message)
				}
			}
		},
		async EventProposalPruned({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosGroupV1.tx.eventProposalPruned({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:EventProposalPruned:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:EventProposalPruned:Create Could not create message: ' + e.message)
				}
			}
		},
		async MsgUpdateGroupMembers({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosGroupV1.tx.msgUpdateGroupMembers({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgUpdateGroupMembers:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:MsgUpdateGroupMembers:Create Could not create message: ' + e.message)
				}
			}
		},
		async MsgCreateGroupPolicy({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosGroupV1.tx.msgCreateGroupPolicy({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgCreateGroupPolicy:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:MsgCreateGroupPolicy:Create Could not create message: ' + e.message)
				}
			}
		},
		async MsgCreateGroupPolicyResponse({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosGroupV1.tx.msgCreateGroupPolicyResponse({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgCreateGroupPolicyResponse:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:MsgCreateGroupPolicyResponse:Create Could not create message: ' + e.message)
				}
			}
		},
		async QueryGroupsByMemberRequest({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosGroupV1.tx.queryGroupsByMemberRequest({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryGroupsByMemberRequest:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QueryGroupsByMemberRequest:Create Could not create message: ' + e.message)
				}
			}
		},
		async EventCreateGroup({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosGroupV1.tx.eventCreateGroup({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:EventCreateGroup:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:EventCreateGroup:Create Could not create message: ' + e.message)
				}
			}
		},
		async MemberRequest({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosGroupV1.tx.memberRequest({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MemberRequest:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:MemberRequest:Create Could not create message: ' + e.message)
				}
			}
		},
		async MsgSubmitProposal({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosGroupV1.tx.msgSubmitProposal({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgSubmitProposal:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:MsgSubmitProposal:Create Could not create message: ' + e.message)
				}
			}
		},
		async QueryGroupInfoResponse({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosGroupV1.tx.queryGroupInfoResponse({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryGroupInfoResponse:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QueryGroupInfoResponse:Create Could not create message: ' + e.message)
				}
			}
		},
		async QueryGroupsByAdminResponse({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosGroupV1.tx.queryGroupsByAdminResponse({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryGroupsByAdminResponse:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QueryGroupsByAdminResponse:Create Could not create message: ' + e.message)
				}
			}
		},
		async QueryProposalRequest({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosGroupV1.tx.queryProposalRequest({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryProposalRequest:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QueryProposalRequest:Create Could not create message: ' + e.message)
				}
			}
		},
		async QueryVotesByVoterResponse({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosGroupV1.tx.queryVotesByVoterResponse({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryVotesByVoterResponse:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QueryVotesByVoterResponse:Create Could not create message: ' + e.message)
				}
			}
		},
		async ThresholdDecisionPolicy({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosGroupV1.tx.thresholdDecisionPolicy({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:ThresholdDecisionPolicy:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:ThresholdDecisionPolicy:Create Could not create message: ' + e.message)
				}
			}
		},
		async GroupPolicyInfo({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosGroupV1.tx.groupPolicyInfo({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:GroupPolicyInfo:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:GroupPolicyInfo:Create Could not create message: ' + e.message)
				}
			}
		},
		async MsgUpdateGroupPolicyDecisionPolicy({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosGroupV1.tx.msgUpdateGroupPolicyDecisionPolicy({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgUpdateGroupPolicyDecisionPolicy:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:MsgUpdateGroupPolicyDecisionPolicy:Create Could not create message: ' + e.message)
				}
			}
		},
		async MsgVote({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosGroupV1.tx.msgVote({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgVote:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:MsgVote:Create Could not create message: ' + e.message)
				}
			}
		},
		async MsgLeaveGroup({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosGroupV1.tx.msgLeaveGroup({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgLeaveGroup:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:MsgLeaveGroup:Create Could not create message: ' + e.message)
				}
			}
		},
		async QueryVotesByProposalResponse({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosGroupV1.tx.queryVotesByProposalResponse({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryVotesByProposalResponse:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QueryVotesByProposalResponse:Create Could not create message: ' + e.message)
				}
			}
		},
		async MsgUpdateGroupAdmin({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosGroupV1.tx.msgUpdateGroupAdmin({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgUpdateGroupAdmin:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:MsgUpdateGroupAdmin:Create Could not create message: ' + e.message)
				}
			}
		},
		async MsgWithdrawProposalResponse({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosGroupV1.tx.msgWithdrawProposalResponse({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgWithdrawProposalResponse:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:MsgWithdrawProposalResponse:Create Could not create message: ' + e.message)
				}
			}
		},
		async MsgCreateGroupWithPolicy({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosGroupV1.tx.msgCreateGroupWithPolicy({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgCreateGroupWithPolicy:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:MsgCreateGroupWithPolicy:Create Could not create message: ' + e.message)
				}
			}
		},
		async MsgUpdateGroupPolicyMetadata({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosGroupV1.tx.msgUpdateGroupPolicyMetadata({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgUpdateGroupPolicyMetadata:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:MsgUpdateGroupPolicyMetadata:Create Could not create message: ' + e.message)
				}
			}
		},
		async MsgExecResponse({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosGroupV1.tx.msgExecResponse({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgExecResponse:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:MsgExecResponse:Create Could not create message: ' + e.message)
				}
			}
		},
		async MsgLeaveGroupResponse({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosGroupV1.tx.msgLeaveGroupResponse({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgLeaveGroupResponse:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:MsgLeaveGroupResponse:Create Could not create message: ' + e.message)
				}
			}
		},
		async QueryGroupMembersResponse({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosGroupV1.tx.queryGroupMembersResponse({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryGroupMembersResponse:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QueryGroupMembersResponse:Create Could not create message: ' + e.message)
				}
			}
		},
		async QueryProposalsByGroupPolicyResponse({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosGroupV1.tx.queryProposalsByGroupPolicyResponse({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryProposalsByGroupPolicyResponse:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QueryProposalsByGroupPolicyResponse:Create Could not create message: ' + e.message)
				}
			}
		},
		async MsgUpdateGroupAdminResponse({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosGroupV1.tx.msgUpdateGroupAdminResponse({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgUpdateGroupAdminResponse:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:MsgUpdateGroupAdminResponse:Create Could not create message: ' + e.message)
				}
			}
		},
		async MsgUpdateGroupPolicyAdmin({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosGroupV1.tx.msgUpdateGroupPolicyAdmin({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgUpdateGroupPolicyAdmin:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:MsgUpdateGroupPolicyAdmin:Create Could not create message: ' + e.message)
				}
			}
		},
		async QueryGroupsRequest({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosGroupV1.tx.queryGroupsRequest({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryGroupsRequest:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QueryGroupsRequest:Create Could not create message: ' + e.message)
				}
			}
		},
		async MsgExec({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosGroupV1.tx.msgExec({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgExec:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:MsgExec:Create Could not create message: ' + e.message)
				}
			}
		},
		async QueryGroupInfoRequest({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosGroupV1.tx.queryGroupInfoRequest({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryGroupInfoRequest:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QueryGroupInfoRequest:Create Could not create message: ' + e.message)
				}
			}
		},
		async MsgWithdrawProposal({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosGroupV1.tx.msgWithdrawProposal({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgWithdrawProposal:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:MsgWithdrawProposal:Create Could not create message: ' + e.message)
				}
			}
		},
		async QueryGroupPoliciesByGroupRequest({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosGroupV1.tx.queryGroupPoliciesByGroupRequest({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryGroupPoliciesByGroupRequest:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QueryGroupPoliciesByGroupRequest:Create Could not create message: ' + e.message)
				}
			}
		},
		async QueryGroupPoliciesByAdminResponse({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosGroupV1.tx.queryGroupPoliciesByAdminResponse({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryGroupPoliciesByAdminResponse:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QueryGroupPoliciesByAdminResponse:Create Could not create message: ' + e.message)
				}
			}
		},
		async QueryGroupsByMemberResponse({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosGroupV1.tx.queryGroupsByMemberResponse({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryGroupsByMemberResponse:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QueryGroupsByMemberResponse:Create Could not create message: ' + e.message)
				}
			}
		},
		async MsgVoteResponse({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosGroupV1.tx.msgVoteResponse({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgVoteResponse:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:MsgVoteResponse:Create Could not create message: ' + e.message)
				}
			}
		},
		
	}
}