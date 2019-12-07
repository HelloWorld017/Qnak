import App from "../../index";

import ProfileImage from "../../images/ProfileImage.png";
import iziToast from "izitoast";
import path from "path";

export default {
	namespaced: true,

	state: {
		user: null,
		acl: []
	},

	mutations: {
		reset(state) {
			state.user = null;
			state.acl = [];
		},
		
		setUser(state, user) {
			state.user = user;
		},
		
		setAcl(state, acl) {
			state.acl = acl;
		}
	},

	getters: {
		authState(state) {
			return !!state.user;
		},
		
		profileImage(state) {
			if(!state.user) return null;
			if(state.user.profile) return path.join(`/static/uploads/`, state.user.profile);
			
			return ProfileImage;
		}
	},

	actions: {
		async init({ commit }) {
			const result = await App.request.api('/user/me');
			if(!result.ok)
				return App.errorDialog.show('request-failed');
			
			
			if(!result.authed) {
				commit('reset');
			} else {
				commit('setUser', result.authedAs);
			}
			
			commit('setAcl', result.acl);
		},
		
		async finalize({ commit, dispatch }, { code, state }) {
			const result = await App.request.api('/user/auth/finalize', 'post', {
				code, state
			});

			if(!result.ok)
				return App.errorDialog.show('login-failed');
			
			if(result.token) {
				localStorage.setItem('qnakToken', result.token);
			}
			
			await dispatch('init');

			App.router.replace('/');
		}
	}
};
