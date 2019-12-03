import auth from "./auth";

export default {
	modules: {
		auth
	},
	
	actions: {
		async init({ dispatch }) {
			await dispatch('auth/init');
		}
	}
};
