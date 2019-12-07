import iziToast from "izitoast";

class ErrorDialog {
	constructor(App) {
		this.App = App;
	}
	
	show(key, desc) {
		if(!desc) desc = `${key}-desc`;
		
		iziToast.error({
			theme: 'dark',
			title: this.App.i18n.t(key),
			message: this.App.i18n.t(desc),
			position: 'topCenter',
			timeout: 3000
		});
	}
}

export default ErrorDialog;
