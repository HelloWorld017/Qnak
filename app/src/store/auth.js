import App from "../../index";

import ProfileImage from "../../images/ProfileImage.png";
import iziToast from "izitoast";
import path from "path";

export default {
	namespaced: true,

	state: {
		user: null,
		userBoards: {}
	},

	mutations: {
		reset(state) {
			state.user = null;
		},
		
		setUser(state, user) {
			state.user = user;
		},
		
		setUserBoards(state, userBoards) {
			state.userBoards = userBoards;
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
				return commit('reset');
			}
			
			commit('setUser', result.authedAs);
			
			if(result.authedAs.boards) {
				const userBoards = await Promise.all(result.authedAs.boards.map(async boardId => {
					return (await App.request.api(`/board/${boardId}`)).board;
				}));
				
				commit('setUserBoards', userBoards);
			}
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
