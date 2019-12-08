<template>
	<label class="QkInputTag">
		<qk-tag v-for="tag in tagList" :key="tag" removable @remove="remove(tag)">
			{{tag}}
		</qk-tag>
		
		<input class="QkInputTag__input" v-model="tempTagInput" v-if="tagList.length < 16"
			type="text" maxlength="33"
			:placeholder="$t('tags-add')" @keydown="findBackspace" />
	</label>
</template>

<style lang="less" scoped>
	.QkInputTag {
		background: var(--grey-200);
		display: flex;
		flex-wrap: wrap;
		border: none;
		border-radius: 5px;
		padding: 10px 20px;
		
		&__input {
			background: transparent;
			border: none;
			flex: 1;
			outline: none;
			color: var(--grey-800);
			font-family: var(--main-font);
			font-size: .9rem;
		}
	}
</style>

<i18n>
{
	"en": {
		"tags-add": "Add new tag by comma..."
	},
	
	"ko": {
		"tags-add": "쉼표로 새로운 태그 추가..."
	}
}
</i18n>

<script>
	import QkInput from "./QkInput.vue";
	import QkTag from "./QkTag.vue";
	
	export default {
		model: {
			prop: 'value',
			event: 'update'
		},
		
		data() {
			return {
				tempTagInputText: ''
			};
		},
		
		props: {
			value: {
				type: String
			}
		},
		
		computed: {
			tempTagInput: {
				get() {
					return this.tempTagInputText;
				},
				
				set(tagText) {
					if(tagText.includes(',')) {
						const split = tagText.split(',');
						const text = split.pop().trim();
						this.tagList = this.tagList.concat(
							split.map(v => v.trim().toLowerCase())
								.map(v => v.replace(/[^a-z가-힣-]/g, '-'))
								.filter(v => !this.tagList.includes(v))
						);
						this.tempTagInputText = text;
						return;
					}
					
					this.tempTagInputText = tagText;
				}
			},
			
			tagList: {
				get() {
					return this.value.split(',').filter(v => !!v);
				},
				
				set(newList) {
					this.$emit('update', newList.join(','));
				}
			}
		},
		
		methods: {
			findBackspace(e) {
				if(e.key === 'Backspace' && this.tempTagInput === '') {
					this.tagList = this.tagList.slice(0, -1);
				}
			},
			
			remove(tag) {
				this.tagList = this.tagList.filter(v => v !== tag);
			}
		},
		
		components: {
			QkInput,
			QkTag
		}
	};
</script>
