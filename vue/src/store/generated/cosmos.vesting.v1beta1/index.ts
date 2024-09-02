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
				
		getTypeStructure: (state) => (type) => {
			return state._Structure[type].fields
		},
		getRegistry: (state) => {
			return state._Registry
		}
	},
	actions: {
		init({ dispatch, rootGetters }) {
			console.log('Vuex module: cosmos.vesting.v1beta1 initialized!')
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
		
		async sendMsgCreateVestingAccountResponse({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosVestingV1Beta1.tx.sendMsgCreateVestingAccountResponse({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgCreateVestingAccountResponse:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:MsgCreateVestingAccountResponse:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendMsgCreatePermanentLockedAccountResponse({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosVestingV1Beta1.tx.sendMsgCreatePermanentLockedAccountResponse({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgCreatePermanentLockedAccountResponse:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:MsgCreatePermanentLockedAccountResponse:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendMsgCreatePeriodicVestingAccount({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosVestingV1Beta1.tx.sendMsgCreatePeriodicVestingAccount({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgCreatePeriodicVestingAccount:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:MsgCreatePeriodicVestingAccount:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendPeriod({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosVestingV1Beta1.tx.sendPeriod({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:Period:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:Period:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendContinuousVestingAccount({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosVestingV1Beta1.tx.sendContinuousVestingAccount({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:ContinuousVestingAccount:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:ContinuousVestingAccount:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendDelayedVestingAccount({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosVestingV1Beta1.tx.sendDelayedVestingAccount({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:DelayedVestingAccount:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:DelayedVestingAccount:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendMsgCreatePeriodicVestingAccountResponse({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosVestingV1Beta1.tx.sendMsgCreatePeriodicVestingAccountResponse({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgCreatePeriodicVestingAccountResponse:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:MsgCreatePeriodicVestingAccountResponse:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendBaseVestingAccount({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosVestingV1Beta1.tx.sendBaseVestingAccount({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:BaseVestingAccount:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:BaseVestingAccount:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendMsgCreateVestingAccount({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosVestingV1Beta1.tx.sendMsgCreateVestingAccount({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgCreateVestingAccount:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:MsgCreateVestingAccount:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendPermanentLockedAccount({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosVestingV1Beta1.tx.sendPermanentLockedAccount({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:PermanentLockedAccount:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:PermanentLockedAccount:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendMsgCreatePermanentLockedAccount({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosVestingV1Beta1.tx.sendMsgCreatePermanentLockedAccount({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgCreatePermanentLockedAccount:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:MsgCreatePermanentLockedAccount:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendPeriodicVestingAccount({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.CosmosVestingV1Beta1.tx.sendPeriodicVestingAccount({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:PeriodicVestingAccount:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:PeriodicVestingAccount:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		
		async MsgCreateVestingAccountResponse({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosVestingV1Beta1.tx.msgCreateVestingAccountResponse({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgCreateVestingAccountResponse:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:MsgCreateVestingAccountResponse:Create Could not create message: ' + e.message)
				}
			}
		},
		async MsgCreatePermanentLockedAccountResponse({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosVestingV1Beta1.tx.msgCreatePermanentLockedAccountResponse({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgCreatePermanentLockedAccountResponse:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:MsgCreatePermanentLockedAccountResponse:Create Could not create message: ' + e.message)
				}
			}
		},
		async MsgCreatePeriodicVestingAccount({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosVestingV1Beta1.tx.msgCreatePeriodicVestingAccount({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgCreatePeriodicVestingAccount:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:MsgCreatePeriodicVestingAccount:Create Could not create message: ' + e.message)
				}
			}
		},
		async Period({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosVestingV1Beta1.tx.period({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:Period:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:Period:Create Could not create message: ' + e.message)
				}
			}
		},
		async ContinuousVestingAccount({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosVestingV1Beta1.tx.continuousVestingAccount({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:ContinuousVestingAccount:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:ContinuousVestingAccount:Create Could not create message: ' + e.message)
				}
			}
		},
		async DelayedVestingAccount({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosVestingV1Beta1.tx.delayedVestingAccount({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:DelayedVestingAccount:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:DelayedVestingAccount:Create Could not create message: ' + e.message)
				}
			}
		},
		async MsgCreatePeriodicVestingAccountResponse({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosVestingV1Beta1.tx.msgCreatePeriodicVestingAccountResponse({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgCreatePeriodicVestingAccountResponse:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:MsgCreatePeriodicVestingAccountResponse:Create Could not create message: ' + e.message)
				}
			}
		},
		async BaseVestingAccount({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosVestingV1Beta1.tx.baseVestingAccount({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:BaseVestingAccount:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:BaseVestingAccount:Create Could not create message: ' + e.message)
				}
			}
		},
		async MsgCreateVestingAccount({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosVestingV1Beta1.tx.msgCreateVestingAccount({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgCreateVestingAccount:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:MsgCreateVestingAccount:Create Could not create message: ' + e.message)
				}
			}
		},
		async PermanentLockedAccount({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosVestingV1Beta1.tx.permanentLockedAccount({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:PermanentLockedAccount:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:PermanentLockedAccount:Create Could not create message: ' + e.message)
				}
			}
		},
		async MsgCreatePermanentLockedAccount({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosVestingV1Beta1.tx.msgCreatePermanentLockedAccount({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgCreatePermanentLockedAccount:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:MsgCreatePermanentLockedAccount:Create Could not create message: ' + e.message)
				}
			}
		},
		async PeriodicVestingAccount({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.CosmosVestingV1Beta1.tx.periodicVestingAccount({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:PeriodicVestingAccount:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:PeriodicVestingAccount:Create Could not create message: ' + e.message)
				}
			}
		},
		
	}
}