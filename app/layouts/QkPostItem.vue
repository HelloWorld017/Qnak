<template>
	<router-link class="QkPostItem" :to="`/post/${post.postId}`">
		<div class="QkPostItem__status">
			<div class="QkPostItem__statusItem StatusItem">
				<icon-upvote class="StatusItem__icon" />
				<span class="StatusItem__figure">{{post.upvote}}</span>
			</div>

			<div class="QkPostItem__statusItem StatusItem">
				<icon-downvote class="StatusItem__icon" />
				<span class="StatusItem__figure">{{post.downvote}}</span>
			</div>
			<div class="QkPostItem__statusItem StatusItem">
				<icon-answer class="StatusItem__icon" />
				<span class="StatusItem__figure">{{post.answers.length}}</span>
			</div>
		</div>

		<div class="QkPostItem__content">
			<h3 class="QkPostItem__title">
				{{post.title}}
			</h3>

			<div class="QkPostItem__content">
				{{excerpt}}
			</div>

			<div class="QkPostItem__tags">
				<qk-tag v-for="tag in post.tags" :key="tag" alternative>
					{{tag}}
				</qk-tag>
			</div>
		</div>

		<div class="QkPostItem__meta">
			<time class="QkPostItem__time" :datetime="time">{{timeText}}</time>
			<span class="QkPostItem__author">
				<template v-if="post.anonymous">
					{{post.authorName}}
				</template>
				<template v-else>
					{{$t('post-item-anonymous')}}
				</template>
			</span>
		</div>
	</router-link>
</template>

<i18n>
{
	"ko": {
		"post-item-anonymous": "익명"
	},

	"en": {
		"post-item-anonymous": "Anonymous"
	}
}
</i18n>

<style lang="less" scoped>
	.QkPostItem {
		display: flex;
		margin-bottom: 50px;
		color: var(--grey-800);
		font-family: var(--main-font);
		text-decoration: none;

		&__status {
			display: flex;
			align-items: center;
			margin-right: 20px;
		}

		&__statusItem {
			margin: 0 5px;
		}

		&__content {
			flex: 1;
			margin-right: 20px;
		}

		&__title {
			margin: 0;
			margin-bottom: .3rem;
		}

		&__meta {
			display: flex;
			flex-direction: column;
			align-items: flex-end;
		}

		&__time {
			font-size: 1.2rem;
		}

		&__author {
			font-size: .9rem;
		}

		&__tags {
			margin-top: 10px;
		}
	}

	.StatusItem {
		display: flex;
		flex-direction: column;
		align-items: center;

		&__icon {
			width: 2rem;
			height: 3rem;
		}
	}
</style>

<script>
	import moment from "moment";

	import IconAnswer from "../images/IconAnswer.svg?inline";
	import IconUpvote from "../images/IconUpvote.svg?inline";
	import IconDownvote from "../images/IconDownvote.svg?inline";
	import QkTag from "../components/QkTag.vue";

	export default {
		props: {
			post: {
				required: true
			}
		},

		computed: {
			excerpt() {
				if(this.post.excerpt.length < 256)
					return this.post.excerpt;

				return this.post.excerpt.slice(0, 256) + "...";
			},

			time() {
				return new Date(this.post.date).toUTCString();
			},

			timeText() {
				const current = moment();
				const date = moment(this.post.date);

				if(!current.isSame(date, 'week')) {
					return date.format('LL');
				}

				if(!current.isSame(date, 'day')) {
					return date.format('dddd');
				}

				return date.format('LT');
			}
		},

		components: {
			IconAnswer,
			IconDownvote,
			IconUpvote,
			QkTag
		}
	};
</script>
