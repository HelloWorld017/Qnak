<template>
	<div class="QkWriteAnswer">
		<h2 class="QkWriteAnswer__title">{{$t('write-answer')}}</h2>

		<qk-editor class="QkWriteAnswer__editor" ref="editor" editable />

		<div class="QkWriteAnswer__row">
			<qk-checkbox v-model="anonymous">
				{{$t('write-anonymous')}}
			</qk-checkbox>
		</div>

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

		&__editor {
			margin-bottom: 1rem;
		}
	}
</style>

<i18n>
{
	"ko": {
		"write-answer": "답변 작성",
		"write-submit": "작성",
		"write-anonymous": "익명"
	},

	"en": {
		"write-answer": "Write an Answer",
		"write-submit": "Write",
		"write-anonymous": "Anonymous"
	}
}
</i18n>

<script>
	import QkButton from "../components/QkButton.vue";
	import QkCheckbox from "../components/QkCheckbox.vue";
	import QkEditor from "../layouts/QkEditor.vue";

	export default {
		data() {
			return {
				anonymous: false
			};
		},

		props: {
			postId: {
				type: String,
				required: true
			}
		},

		components: {
			QkButton,
			QkCheckbox,
			QkEditor
		},

		methods: {
			async uploadPost() {
				const result = await this.$api(`/post/${this.postId}/answer`, 'post', {
					content: this.$refs.editor.getContent(),
					anonymous: this.anonymous
				});

				if(!result.ok) {
					this.$app.error.show('write-failed');
					return;
				}

				this.$refs.editor.clear();
				this.$emit('write', result.id);
			}
		}
	};
</script>
