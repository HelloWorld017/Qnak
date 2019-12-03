class ErrorDialog {
	constructor(App) {
		this.App = App;
	}
	
	show(key) {
		iziToast.error({
			theme: 'dark',
			title: this.App.i18n.t(key),
			message: this.App.i18n.t(`${key}-desc`),
			position: 'topCenter',
			timeout: 3000
		});
	}
}

export default ErrorDialog;
