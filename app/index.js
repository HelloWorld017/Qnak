import Archive from "./pages/Archive.vue";
import App from "./App.vue";
import Index from "./pages/Index.vue";
import Theme from "./src/Theme";
import Vue from "vue";
import Vuex from "vuex";
import VueI18n from "vue-i18n";
import VueRequest from "./src/plugins/VueRequest";
import VueRouter from "vue-router";

import storeDescriptor from "./src/store";

Vue.use(Vuex);
Vue.use(VueI18n);
Vue.use(VueRequest);
Vue.use(VueRouter);

const QnakApp = {};

(async () => {
	const i18n = new VueI18n();
	QnakApp.i18n = i18n;

	const request = new VueRequest();
	QnakApp.request = request;

	const router = new VueRouter({
		routes: [
			{ path: '/', component: Index },
			{ path: '/archive/:context', component: Archive }
		],
		mode: 'history'
	});
	QnakApp.router = router;

	const store = new Vuex.Store(storeDescriptor);
	QnakApp.store = store;

	const theme = await Theme.load();
	theme.apply(QnakApp);
	
	QnakApp.theme = theme;

	const vm = new Vue({
		el: '#App',
		store,
		i18n,
		request,
		router,
		render(h) {
			return h(App);
		}
	});
	QnakApp.vm = vm;
})();

export default QnakApp;
