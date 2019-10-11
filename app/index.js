import App from "./App.vue";
import Index from "./pages/Index.vue";
import Login from "./pages/Login.vue";
import Theme from "./src/Theme";
import Vue from "vue";
import VueI18n from "vue-i18n";
import VueRouter from "vue-router";

Vue.use(VueI18n);
Vue.use(VueRouter);

(async () => {
	const router = new VueRouter({
		routes: [
			{ path: '/', component: Index },
			{ path: '/login', component: Login }
		],
		mode: 'history'
	});

	const theme = await Theme.load();
	theme.apply();

	new Vue({
		el: '#App',
		router,
		render(h) {
			return h(App);
		}
	});
})();
