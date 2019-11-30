<template>
	<div class="QkHeaderUser">
		<button class="QkHeaderUser__button" @click="loginOrOpen">
			<template v-if="authState">
				
			</template>
			<template v-else>
				로그인
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

<script>
	import IconArrowRight from "../images/IconArrowRight.svg?inline";
	
	export default {
		components: {
			IconArrowRight
		},
		
		components: {
			authState() {
				return this.$store.state.auth.getters.authState
			}
		}
		methods: {
			loginOrOpen() {
				if(!this.authState)
			}
		}
	};
</script>
