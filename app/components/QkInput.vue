<template>
	<input class="QkInput" type="text" v-model="inputText"
		:autocomplete="hintOnOff" :autocorrect="hintOnOff"
		:autocapitalize="hintOnOff" :spellcheck="hintTrueFalse"
		:placeholder="placeholder">
</template>

<style lang="less" scoped>
	.QkInput {
		background: var(--grey-200);
		border: none;
		border-radius: 5px;
		padding: 10px 20px;
		color: var(--grey-800);
		font-family: var(--main-font);
		font-size: .9rem;
		outline: none;
	}
</style>

<script>
	export default {
		model: {
			prop: 'value',
			event: 'update'
		},
		
		props: {
			value: {
				type: String,
				default: ''
			},
			
			hint: {
				type: Boolean
			},
			
			placeholder: {
				type: String,
				default: ''
			}
		},
		
		computed: {
			inputText: {
				get() {
					return this.value;
				},
				
				set(value) {
					this.$emit('update', value);
				}
			},
			
			hintOnOff() {
				return this.hint ? 'on' : 'off';
			},
			
			hintTrueFalse() {
				return this.hint ? 'true' : 'false';
			}
		}
	};
</script>
