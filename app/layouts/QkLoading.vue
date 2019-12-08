<template>
	<div class="QkLoading">
	</div>
</template>

<style lang="less" scoped>
	.QkLoading {
		background: linear-gradient(
			to right, var(--grey-200) 8%,
			var(--grey-250) 18%, var(--grey-200) 33%
		);
		background-size: 100vw 1px;
		height: 30vh;
		
		margin: 0 2rem;
		animation-duration: 3s;
		animation-fill-mode: forwards;
		animation-iteration-count: infinite;
		animation-name: LoadingGradient;
		animation-timing-function: linear;
	}
	
	@keyframes LoadingGradient {
		0% {
			background-position: -30vw 0;
		}
		
		100% {
			background-position: 70vw 0;
		}
	}

</style>
