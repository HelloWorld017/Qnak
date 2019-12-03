<template>
	<div class="QkHeaderUser">
		<button class="QkHeaderUser__button" @click="loginOrOpen">
			<template v-if="authState">
				<div class="QkHeaderUser__user">
					<img class="QkHeaderUser__profile" :src="profile">
					<div class="QkHeaderUser__description">
						<span class="QkHeaderUser__username">{{user.username}}</span>
						<span class="QkHeaderUser__friendlyUid">@{{user.friendlyUid}}</span>
					</div>
					
					<icon-dropdown />
				</div>
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
		margin-left: 15px;
		height: 100%;
		
		&__button {
			cursor: pointer;
			background: transparent;
			border: none;
			outline: none;
			font-family: var(--main-font);
			font-size: 1.1rem;
		}

		&__icon {
			margin-left: 20px;
		}
		
		&__description {
			margin-left: 10px;
			margin-right: 20px;
			display: flex;
			flex-direction: column;
			align-items: flex-start;
		}
		
		&__username {
			font-weight: 600;
			font-size: 1.2rem;
		}
		
		&__friendlyUid {
			font-size: .8rem;
			color: var(--grey-500);
		}
		
		&__profile {
			width: 60px;
			height: 60px;
			border-radius: 5px;
		}
		
		&__user {
			display: flex;
			align-items: center;
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
	import IconDropdown from "../images/IconDropdown.svg?inline";

	export default {
		computed: {
			authState() {
				return this.$store.getters['auth/authState'];
			},
			
			user() {
				return this.$store.state.auth.user;
			},
			
			profile() {
				return this.$store.getters['auth/profileImage'];
			}
		},

		methods: {
			async loginOrOpen() {
				if(!this.authState) {
					const authStart = await this.$api('/user/auth', 'post');
					if(!authStart.ok) {
						return this.$app.errorDialog.show('auth-start-failed');
					}
					
					if(authStart.url) {
						location.href = authStart.url;
					} else {
						await this.$store.dispatch('auth/init');
					}
				}
			}
		},

		components: {
			IconArrowRight,
			IconDropdown
		}
	};
</script>
