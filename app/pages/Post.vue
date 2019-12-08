<template>
	<main id="Post" v-if="post">
		<qk-header :context="`subject:${post.board.boardId}`">
			{{post.board.title}}
		</qk-header>

		<div class="QkContainer">
			<qk-post :post="post" />
			<qk-post v-for="answer in post.answers" :key="answer" :lazyloadId="answer" lazyload />
			<qk-write-answer :postId="post.postId" @write="addAnswer" />
		</div>
	</main>

	<qk-loading v-else />
</template>

<style lang="less" scoped>
	#Post {
		overflow: auto;
		flex: 1;
	}
</style>

<script>
	import QkHeader from "../layouts/QkHeader.vue";
	import QkLoading from "../layouts/QkLoading.vue";
	import QkPost from "../layouts/QkPost.vue";
	import QkWriteAnswer from "../layouts/QkWriteAnswer.vue";
	import QnakApp from "../";

	export default {
		data() {
			return {
				post: null
			};
		},

		methods: {
			async updatePost(post = null) {
				if(!post)
					post = await this.$api(`/post/${this.$route.params.postId}`);

				if(!post.ok) {
					if(post.reason === "no-such-post") {
						this.$router.replace('/404');
						return;
					}

					return this.$app.error.show('post-show-failed');
				}

				this.post = post.post;
			},

			addAnswer(answerId) {
				this.post.answers.push(answerId);
			}
		},

		async beforeRouteEnter(to, from, next) {
			const post = await QnakApp.request.api(`/post/${to.params.postId}`);
			if(post.ok)
				document.title = `Qnak - ${post.post.title}`;

			next(vm => {
				vm.post = post.post;
			});
		},

		async beforeRouteUpdate(to, from, next) {
			const post = await QnakApp.request.api(`/post/${to.params.postId}`);
			if(post.ok)
				document.title = `Qnak - ${post.post.title}`;

			vm.post = post.post;
			next();
		},

		mounted() {
			this.$nextTick(() => {
				if(!this.post) this.updatePost();
			});
		},

		components: {
			QkHeader,
			QkLoading,
			QkPost,
			QkWriteAnswer
		}
	};
</script>
