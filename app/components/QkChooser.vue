<template>
	<div class="QkChooser">
		<select class="QkChooser__input" v-model="_value">
			<slot></slot>
		</select>

		<icon-dropdown class="QkChooser__decorator" />
	</div>
</template>

<style lang="less" scoped>
	.QkChooser {
		background: var(--grey-200);
		box-sizing: border-box;
		display: inline-block;
		padding: 5px;
		position: relative;
		border-radius: 5px;

		&__input {
			appearance: none;
			background: var(--grey-200);
			border: none;
			box-sizing: border-box;
			font-family: var(--main-font);
			font-size: 1rem;
			padding: 5px 20px;
			padding-right: 40px;
			color: var(--theme-color);
			outline: none;
		}

		&__decorator {
			position: absolute;
			width: 1rem;
			top: 50%;
			right: 20px;
			transform: translate(0, -50%);
			pointer-events: none;
			
			* {
				fill: var(--theme-color);
			}
		}
	}
</style>

<script>
	import IconDropdown from "../images/IconDropdown.svg?inline";
	
	export default {
		model: {
			prop: 'value',
			event: 'change'
		},

		props: {
			value: {
				type: String,
				required: true
			}
		},

		computed: {
			_value: {
				get() {
					return this.value;
				},

				set(value) {
					this.$emit('change', value);
				}
			}
		},
		
		components: {
			IconDropdown
		}
	};
</script>
