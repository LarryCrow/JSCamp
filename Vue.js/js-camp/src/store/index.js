import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		token: ''
	},
	getters: {
		getToken(state) {
			return state.token;
		}
	},
	mutations: {
		changeToken(state, payload) {
				state.token = payload.token;
		}
	},
	actions: {
		setToken(context, payload){
			if (payload.token) {
				context.commit('changeToken', payload);
				window.localStorage.setItem('token', payload.token);
			}
		}
	}
});

export default store