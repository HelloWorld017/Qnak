<template>
	<div class="QkVote" :class="{'QkVote--disabled': voted}">
		<a class="QkVote__item" @click="upvote">
			<icon-upvote />
			{{upvoteCount}}
		</a>
		
		<a class="QkVote__item" @click="downvote">
			{{downvoteCount}}
			<icon-downvote/>
		</a>
	</div>
</template>

<style lang="less" scoped>
	.QkVote {
		margin-top: 2rem;
		&__item {
			display: flex;
			flex-direction: column;
			align-items: center;
			font-family: var(--main-font);
		}
	}
</style>

<script>
	import IconDownvote from "../images/IconDownvote.svg?inline";
	import IconUpvote from "../images/IconUpvote.svg?inline";
	
	export default {
		props: {
			postId: {
				type: String,
				required: true
			}
		},
		
		data() {
			return {
				voted: true,
				upvoteCount: 0,
				downvoteCount: 0
			};
		},
		
		methods: {
			async upvote() {
				const result = await this.$api(`/post/${this.postId}/vote?voteType=upvote`);
				await this.refreshVote(result);
			},
			
			async downvote() {
				const result = await this.$api(`/post/${this.postId}/vote?voteType=downvote`);
				await this.refreshVote(result);
			},
			
			async refreshVote(voteStatus) {
				if(!voteStatus)
					voteStatus = await this.$api(`/post/${this.postId}/vote`);
				
				if(!voteStatus.ok) return;
				
				this.voted = voteStatus.voted;
				this.upvoteCount = voteStatus.upvote;
				this.downvoteCount = voteStatus.downvote;
			}
		},
		
		async mounted() {
			await this.refreshVote();
		},
		
		components: {
			IconDownvote,
			IconUpvote
		}
	};
</script>
