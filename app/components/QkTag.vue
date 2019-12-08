<template>
	<span class="QkTag">
		<slot></slot>
		<a class="QkTag__remove" v-if="removable" @click="remove">
			<i class="mdi mdi-close"></i>
		</a>
	</span>
</template>

<style lang="less" scoped>
	.QkTag {
		background: var(--grey-700);
		color: var(--grey-100);
		font-family: var(--main-font);
		font-size: .9rem;
		margin: .3rem;
		padding: 0 .3rem;
		border-radius: 5px;
		
		&__remove {
			cursor: pointer;
			color: var(--grey-400);
		}
	}
</style>

<script>
	export default {
		props: {
			removable: Boolean
		},
		
		methods: {
			remove() {
				this.$emit('remove');
			}
		}
	};
</script>
