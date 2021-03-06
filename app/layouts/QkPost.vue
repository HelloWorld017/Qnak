<template>
	<section class="QkPost" v-if="item">
		<div class="QkPost__main">
			<qk-vote :post-id="item.postId"/>
			<div class="QkPost__content">
				<h2 class="QkPost__title" v-if="item.title">{{item.title}}</h2>
				<div class="QkPost__metadata">
					<time :datetime="time">{{timeText}}</time>
					<span>
						<router-link :to="`/archive/user:${friendlyUid}`" v-if="!item.anonymous">
							{{item.authorName}}
						</router-link>
						<template v-else>
							{{$t('post-anonymous')}}
						</template>
					</span>
				</div>
				<div class="QkPost__body" v-html="item.content"/>

				<div class="QkPost__tags">
					<qk-tag v-for="tag in item.tags" :key="tag" alternative>
						{{tag}}
					</qk-tag>
				</div>
			</div>
		</div>

		<h3>{{$t('post-comments')}}</h3>
		<qk-comments :post-id="item.postId" class="QkPost__comments" />
	</section>
	<div v-else>
		<intersect @enter="loadItem">
			<qk-loading class="QkPostLoading" />
		</intersect>
	</div>
</template>

<i18n>
{
	"ko": {
		"post-anonymous": "익명",
		"post-comments": "댓글"
	},

	"en": {
		"post-anonymous": "Anonymous",
		"post-comments": "Comments"
	}
}
</i18n>

<style lang="less" scoped>
	.QkPost {
		display: flex;
		flex-direction: column;

		background: var(--grey-050);
		margin: 1rem 1.5rem;
		padding: 1.5rem 2rem;
		font-family: var(--main-font);

		&__main {
			display: flex;
			align-items: flex-start;
		}

		&__content {
			margin-left: 2rem;
		}

		&__title {
			margin: 0;
		}

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
	}
</style>

<script>
	import moment from "moment";

	import Intersect from "vue-intersect";
	import QkComments from "./QkComments.vue";
	import QkLoading from "./QkLoading.vue";
	import QkTag from "../components/QkTag.vue";
	import QkVote from "../components/QkVote.vue";

	export default {
		data() {
			return {
				lazyloadPost: null,
				user: null
			};
		},

		props: {
			post: {
				type: Object
			},

			lazyloadId: {
				type: String
			},

			lazyload: {
				type: Boolean
			}
		},

		computed: {
			time() {
				return new Date(this.item.date).toUTCString();
			},

			timeText() {
				return moment(this.item.date).from(moment());
			},

			item() {
				if(this.post) return this.post;
				if(this.lazyloadPost) return this.lazyloadPost;
			},

			friendlyUid() {
				return this.item.author.replace('#', ':');
			}
		},

		methods: {
			async loadItem() {
				if(!this.lazyload) return;
				const { post } = await this.$api(`/post/${this.lazyloadId}`);
				this.lazyloadPost = post;
			}
		},

		components: {
			Intersect,
			QkComments,
			QkLoading,
			QkTag,
			QkVote
		}
	};
</script>
