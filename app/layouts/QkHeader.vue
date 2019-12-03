<template>
	<header class="QkHeader">
		<h1 class="QkHeader__title">
			<slot></slot>
		</h1>
		
		<qk-input-search @submit="search" />
		<router-link class="QkHeader__link" :to="`/write/${context}`">
			<icon-write class="QkHeader__icon"/>
		</router-link>
		<qk-notification class="QkHeader__link" />
		<qk-header-user />
	</header>
</template>

<style lang="less" scoped>
	.QkHeader {
		display: flex;
		align-items: center;
		padding: 20px;
		font-family: var(--main-font);
		
		&__title {
			margin: 0;
			flex: 1;
		}
		
		&__link {
			margin: 0 15px;
		}
		
		&__icon {
			width: 2rem;
			height: 2rem;
			vertical-align: middle;
		}
	}
</style>

<script>
	import IconWrite from "../images/IconWrite.svg?inline";
	import QkHeaderUser from "./QkHeaderUser.vue";
	import QkInputSearch from "../components/QkInputSearch.vue";
	import QkNotification from "./QkNotification.vue";
	
	export default {
		props: {
			context: {
				type: String,
				default: ''
			}
		},
		
		methods: {
			search(text) {
				this.$router.push({
					path: `/archive/${this.context}`,
					query: {query: text}
				});
			}
		},
		
		components: {
			IconWrite,
			QkHeaderUser,
			QkInputSearch,
			QkNotification
		}
	};
</script>
