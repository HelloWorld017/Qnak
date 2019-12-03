<template>
	<a class="QkNotification">
		<icon-notification class="QkNotification__icon"/>
		
		<div class="QkNotification__badge">
			
		</div>
	</a>
</template>

<style lang="less" scoped>
	.QkNotification {
		&__icon {
			width: 2rem;
			height: 2rem;
			vertical-align: middle;
		}
	}
</style>

<script>
	import IconNotification from "../images/IconNotification.svg?inline";
	
	export default {
		components: {
			IconNotification
		}
	};
</script>
