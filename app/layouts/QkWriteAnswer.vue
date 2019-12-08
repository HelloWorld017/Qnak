<template>
	<div class="QkWriteAnswer">
		<h2 class="QkWriteAnswer__title">{{$t('write-answer')}}</h2>
		
		<qk-editor class="QkWriteAnswer__editor" ref="editor" editable />
		
		<qk-button class="QkWriteAnswer__submit" @click="uploadPost">
			{{$t('write-submit')}}
		</qk-button>
	</div>
</template>

<style lang="less" scoped>
	.QkWriteAnswer {
		font-family: var(--main-font);
		background: var(--grey-050);
		margin: 1rem 1.5rem;
		padding: 1.5rem 2rem;
		
		&__title {
			margin-top: 0;
		}
		
		&__submit {
			margin-top: 1rem;
		}
	}
</style>

<i18n>
{
	"ko": {
		"write-answer": "답변 작성",
		"write-submit": "작성"
	},
	
	"en": {
		"write-answer": "Write an Answer",
		"write-submit": "Write"
	}
}
</i18n>

<script>
	import QkButton from "../components/QkButton.vue";
	import QkEditor from "../layouts/QkEditor.vue";
	
	export default {
		props: {
			postId: {
				type: String,
				required: true
			}
		},
		
		components: {
			QkButton,
			QkEditor
		},
		
		methods: {
			async uploadPost() {
				await this.$api(`/${this.postId}/answer`, 'post', {
					
				});
			}
		}
	};
</script>
