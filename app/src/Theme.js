class Theme {
	constructor(theme) {
		const defaultTheme = {
			'main-font': '"Noto Sans CJK KR", sans-serif',
			'theme-color': '#f4516f',
			'grey-100': '#fafafa',
			'lang': 'ko'
		};

		this.theme = Object.assign(defaultTheme, theme);
	}

	apply(App) {
		const meta = document.querySelector('meta[name="theme-color"]');
		meta.setAttribute('content', this.theme['main-color']);

		const root = document.documentElement;
		Object.keys(this.theme).forEach(theme => {
			root.style.setProperty(`--${theme}`, this.theme[theme]);
		});

		App.i18n.locale = this.theme['lang'];
	}

	static async load() {
		return new Theme({

		});
	}
}

export default Theme;
