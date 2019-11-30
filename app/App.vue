<template>
	<div id="App" class="App">
		<qk-sidebar></qk-sidebar>

		<transition name="Fade" mode="out-in">
			<keep-alive>
				<router-view class="App__router"></router-view>
			</keep-alive>
		</transition>
	</div>
</template>

<i18n locale="ko" src="./i18n/ko.json"/>
<i18n locale="en" src="./i18n/en.json"/>

<style lang="less" scoped>
	#App {
		display: flex;
		width: 100vw;
		height: 100vh;
		border-top: solid 10px var(--theme-color);
		box-sizing: border-box;
	}
</style>

<style lang="less">
	html, body {
		margin: 0;
		padding: 0;
	}
</style>

<script>
	import QkSidebar from "./layouts/QkSidebar.vue";

	export default {
		components: {
			QkSidebar
		}
	};
</script>
