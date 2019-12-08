<template>
	<span class="QkTag" :class="{'QkTag--alternative': alternative}">
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
		padding: .2rem .4rem;
		border-radius: 5px;

		&__remove {
			cursor: pointer;
			color: var(--grey-400);
		}

		&--alternative {
			background: var(--grey-250);
			color: var(--grey-700);
			font-weight: 600;
		}

		&:first-child {
			margin-left: 0;
		}

		&:last-child {
			margin-right: 0;
		}
	}
</style>

<script>
	export default {
		props: {
			removable: Boolean,
			alternative: Boolean
		},

		methods: {
			remove() {
				this.$emit('remove');
			}
		}
	};
</script>
