<template>
	<div class="QkComments">
		<div class="QkComment" v-for="comment in comments" :key="comment.commentId">
			<div class="QkComment__metadata">
				<time class="QkComment__date" :datetime="time(comment.date)">{{timeText(comment.date)}}</time>
				<router-link class="QkComment__author" :to="`/archive/user:${comment.author}`">
					{{comment.authorName}}
				</router-link>
			</div>
			
			{{comment.content}}
		</div>
		
		<div class="QkComments__write QkCommentWrite">
			<textarea class="QkCommentWrite__edit" v-model="commentText">
			</textarea>
			<qk-button @click="submitComment">
				{{$t('comment-write')}}
			</qk-button>
		</div>
	</div>
</template>

<style lang="less" scoped>
	.QkComments {
		display: flex;
		flex-direction: column;
		padding-left: 20px;
	}
	
	.QkComment {
		&__metadata {
			color: var(--grey-400);

			* {
				color: var(--grey-400);
				text-decoration: none;
				margin: 0 5px;

				&:first-child {
					margin-left: 0;
				}

				&:last-child {
					margin-right: 0;
				}
			}

			a {
				color: var(--link-400);
			}
		}
		
		margin-bottom: 10px;
	}
	
	.QkCommentWrite {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		
		margin-top: 5px;
		max-width: 368px;
		
		&__edit {
			align-self: stretch;
			border: none;
			background: var(--grey-200);
			color: var(--grey-800);
			border-radius: 5px;
			margin-bottom: 10px;
			padding: 5px 10px;
			outline: none;
			resize: none;
			font-family: var(--main-font);
		}
	}
</style>

<i18n>
{
	"ko": {
		"comment-write": "댓글 작성"
	},
	
	"en": {
		"comment-write": "Write Comment"
	}
}
</i18n>

<script>
	import moment from "moment";
	import QkButton from "../components/QkButton.vue";
	
	export default {
		data() {
			return {
				commentText: '',
				comments: []
			};
		},
		
		props: {
			postId: {
				type: String,
				required: true
			}
		},
		
		methods: {
			async submitComment() {
				const commentResp = await this.$api(`/post/${this.postId}/comment`, 'POST', {
					content: this.commentText
				});
				
				if(!commentResp.ok) {
					this.$app.error.show('comment-write-failed');
					return;
				}
				
				this.commentText = '';
				this.comments.push(commentResp.comment);
			},
			
			time(date) {
				return new Date(date).toUTCString();
			},

			timeText(date) {
				return moment(date).from(moment());
			}
		},
		
		async mounted() {
			const commentsResp = await this.$api(`/post/${this.postId}/comment`);
			if(!commentsResp.ok) {
				this.$app.error.show('comment-show-failed');
				return;
			}
			
			this.comments = commentsResp.comments;
		},
		
		components: {
			QkButton
		}
	};
</script>
