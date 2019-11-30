<template>
	<header class="QkHeader">
		<h1 class="QkHeader__title" v-if="title">
			{{title}}
		</h1>
		
		<qk-input-search :context="context"/>
		<router-link class="QkHeader__link" :to="`/write/${context}`">
			<icon-write class="QkHeader__icon"/>
		</router-link>
		<qk-header-user/>
	</header>
</template>

<style lang="less" scoped>
	.QkHeader {
		display: flex;
		padding: 20px 0;
		font-family: var(--main-font);
		
		&__title {
			
		}
		
		&__icon {
			width: 2rem;
			height: 2rem;
			margin: 0 1rem;
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
			title: {
				type: String
			},
			
			context: {
				type: String,
				default: ''
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
