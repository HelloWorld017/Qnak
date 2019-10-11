class Theme {
	constructor(theme) {
		const defaultTheme = {
			'theme-color': '#f4516f',
			'grey-100': '#fafafa'
		};

		this.theme = Object.assign(defaultTheme, theme);
	}

	apply() {
		const meta = document.querySelector('meta[name="theme-color"]');
		meta.setAttribute('content', this.theme['main-color']);

		const root = document.documentElement;
		Object.keys(this.theme).forEach(theme => {
			root.style.setProperty(`--${theme}`, this.theme[theme]);
		});
	}

	static async load() {
		return new Theme({

		});
	}
}

export default Theme;
