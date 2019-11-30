<template>
	<div class="QkHeaderUser">
		<button class="QkHeaderUser__button" @click="loginOrOpen">
			<template v-if="authState">

			</template>
			<template v-else>
				{{$t('login')}}
				<icon-arrow-right class="QkHeaderUser__icon"/>
			</template>
		</button>
	</div>
</template>

<style lang="less" scoped>
	.QkHeaderUser {
		&__button {
			background: transparent;
			border: none;
			font-family: var(--main-font);
			font-size: 1.1rem;
			font-weight: 600;
		}

		&__icon {
			margin-left: 20px;
		}
	}
</style>

<i18n>
{
	"ko": {
		"login": "로그인",
		"auth-start-failed": "로그인 실패",
		"auth-start-failed-desc": "로그인 시작에 실패했습니다. 인터넷 연결을 확인하고 다시 시도해주세요."
	},

	"en": {
		"login": "Sign In",
		"auth-start-failed": "Login Failed",
		"auth-start-failed-desc": "Failed to initialize login process. Please check your connection and retry."
	}
}
</i18n>

<script>
	import IconArrowRight from "../images/IconArrowRight.svg?inline";

	export default {
		computed: {
			authState() {
				return this.$store.getters['auth/authState'];
			}
		},

		methods: {
			async loginOrOpen() {
				if(!this.authState) {
					const authStart = await this.$api('/user/auth', 'post');
					if(!authStart.ok) {
						iziToast.error({
							theme: 'dark',
							title: App.i18n.t('auth-start-failed'),
							message: App.i18n.t('auth-start-failed-desc'),
							position: 'topCenter',
							timeout: 3000
						});
					}
				}
			}
		},

		components: {
			IconArrowRight
		}
	};
</script>
