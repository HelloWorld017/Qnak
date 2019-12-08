<template>
	<div id="App" class="App">
		<qk-sidebar></qk-sidebar>

		<transition name="Fade" mode="out-in">
			<router-view class="App__router"></router-view>
		</transition>
	</div>
</template>

<style lang="less" scoped>
	#App {
		display: flex;
		width: 100vw;
		height: 100vh;
		border-top: solid 10px var(--theme-color);
		box-sizing: border-box;
	}

	.App__router {
		background: var(--grey-150);
	}
</style>

<style lang="less">
	html, body {
		margin: 0;
		padding: 0;
	}

	.Fade {
		&-enter-active, &-leave-active {
			transition: all .3s ease;
		}

		&-enter, &-leave-to {
			opacity: 0;
			transform: translateX(-2px);
		}
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
