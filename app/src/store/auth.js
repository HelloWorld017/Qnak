import App from "../../index";

import iziToast from "izitoast";

export default {
	namespaced: true,

	state: {
		username: null
	},

	mutations: {
		setUser(state, username) {
			state.username = username;
		}
	},

	getters: {
		authState(state) {
			return !!state.username;
		}
	},

	actions: {
		async finalize({ commit }, { code, state }) {
			const result = await App.request.api('/user/auth/finalize', 'post', {
				code, state
			});

			if(!result.ok) {
				iziToast.error({
					theme: 'dark',
					title: App.i18n.t('login-failed'),
					message: App.i18n.t('login-failed-desc'),
					position: 'topCenter',
					timeout: 3000
				});

				return;
			}

			localStorage.setItem('qnakToken', result.token);
			commit('setUser', result.username);

			App.router.replace('/');
		}
	}
};
