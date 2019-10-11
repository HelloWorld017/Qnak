<template>
	<aside class="QkSidebar">
		<qnak-branding class="QkSidebar__logo"></qnak-branding>

		<div class="QkSidebar__boards">

		</div>

		<div class="QkSidebar__footer">
		</div>
	</aside>
</template>

<style lang="less" scoped>
	.QkSidebar {
		width: 30vw;
		max-width: 300px;
		height: 100%;
		background: var(--grey-100);

		&__logo {
			fill: var(--theme-color);
			width: 100%;
			padding: 0 40px;
			margin: 20px 0;
			box-sizing: border-box;
		}
	}
</style>

<script>
	import QnakBranding from "../images/QnakBranding.svg?inline";

	export default {
		components: {
			QnakBranding
		}
	};
</script>
