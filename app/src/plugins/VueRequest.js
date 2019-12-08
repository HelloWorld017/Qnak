import axios from 'axios';

class VueRequest {
	constructor() {
		this.default = axios.create({
			withCredentials: true,
			baseURL: 'http://localhost:8081/',
			validateStatus() {
				return true;
			}
		});

		this.api = this.request.bind(this);
	}

	async request(url, method = 'get', body = null, options = null) {
		const configuration = {
			url,
			method,
			headers: {}
		};

		configuration.headers['Qnak-Authorization'] = localStorage.getItem('qnakToken');

		if(body) {
			configuration.data = body;
		}
		
		if(options) {
			Object.assign(configuration, options);
		}

		const {data} = await this.default(configuration);
		return data;
	}

	static install(Vue, options) {
		Object.defineProperty(Vue.prototype, '$api', {
			get() {
				return this.$root.$options.request.api;
			}
		});
	}
}

export default VueRequest;
