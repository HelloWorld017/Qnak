<template>
	<label class="QkCheckbox">
		<input class="QkCheckbox__input" type="checkbox" v-model="_checked">
		<div class="QkCheckbox__decorator"></div>
		<div class="QkCheckbox__label">
			<slot></slot>
		</div>
	</label>
</template>

<style lang="less" scoped>
	.QkCheckbox {
		display: inline-flex;
		align-items: center;
		margin-top: 10px;
		margin-bottom: 10px;

		width: 100%;

		&__input {
			display: none;
		}

		&__decorator {
			display: inline-flex;
			position: relative;
			width: 20px;
			height: 20px;
			flex: 0 0 auto;

			background: transparent;
			border: 2px solid var(--theme-color);
			border-radius: 11px 0 11px 11px;

			cursor: pointer;
			transition: background .4s ease;


			&::before {
				content: '';
				display: inline-block;

				position: absolute;
				top: 0;
				left: 0;
				width: 0;
				height: 0;

				opacity: 0;
				transform-origin: bottom left;

				border-right: 2px solid var(--theme-color);
				border-bottom: 2px solid var(--theme-color);
			}
		}

		&__input:checked + &__decorator {
			transition: background .2s .3s ease;
			background: var(--theme-color);

			&::before {
				animation: check .3s ease;
				animation-fill-mode: forwards;
			}
		}

		&__label {
			flex: 1;
			min-width: 0;
			margin-left: 15px;
			font-family: var(--main-font);
			color: var(--grey-600);
		}
	}

	@keyframes check {
		0% {
			transform: translateX(3.5px) translateY(8px) rotate(45deg);
			width: 0;
			height: 0;
			opacity: 0;
		}

		25% {
			opacity: 1;
		}

		50% {
			transform: translateX(3.5px) translateY(8px) rotate(45deg);
			width: 5px;
			height: 0;
			opacity: 1;
		}

		100% {
			transform: translateX(3.5px) translateY(-2px) rotate(45deg);
			width: 5px;
			height: 10px;
			opacity: 1;
		}
	}
</style>

<script>
	export default {
		model: {
			prop: 'checked',
			event: 'change'
		},

		props: {
			checked: Boolean
		},

		computed: {
			_checked: {
				get() {
					return this.checked;
				},

				set(newValue) {
					this.$emit('change', newValue);
				}
			}
		}
	};
</script>
