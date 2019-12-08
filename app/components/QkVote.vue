<template>
	<div class="QkVote">
		<a class="QkVote__item" :class="{'QkVote__item--active': voted === 'upvote'}" @click="upvote">
			<icon-upvote class="QkVote__icon" />
			{{upvoteCount}}
		</a>
		
		<a class="QkVote__item" :class="{'QkVote__item--active': voted === 'downvote'} "@click="downvote">
			{{downvoteCount}}
			<icon-downvote class="QkVote__icon" />
		</a>
	</div>
</template>

<style lang="less" scoped>
	.QkVote {
		margin-top: .8rem;
		
		&__item {
			cursor: pointer;
			display: flex;
			flex-direction: column;
			align-items: center;
			color: var(--theme-400);
			font-family: var(--main-font);
			font-size: .8rem;
			
			&:first-child {
				margin-bottom: .8rem;
			}
		}
	}
</style>

<style lang="less">
	.QkVote__item {
		& > .QkVote__icon * {
			fill: var(--theme-400);
			transition: all .4s ease;
		}

		&--active > .QkVote__icon * {
			fill: var(--theme-200);
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
				voted: false,
				upvoteCount: 0,
				downvoteCount: 0
			};
		},
		
		methods: {
			async vote(voteType) {
				const result = await this.$api(`/post/${this.postId}/vote?voteType=${voteType}`, 'post');
				await this.refreshVote(result);
			},
			
			async upvote() {
				await this.vote('upvote');
			},
			
			async downvote() {
				await this.vote('downvote');
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
