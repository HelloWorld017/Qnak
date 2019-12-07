<template>
	<main id="Post" v-if="post">
		<qk-header>
			{{post.board.title}}
		</qk-header>

		<div class="QkContainer">
			<qk-post :post="post" />
			<qk-post v-for="answer in answers" :post="answer" />
		</div>
	</main>
	
	<qk-loading v-else />
</template>

<style lang="less" scoped>
	#Post {
		flex: 1;
	}
</style>

<script>
	import QkHeader from "../layouts/QkHeader.vue";
	import QkLoading from "../layouts/QkLoading.vue";
	import QkPost from "../layouts/QkPost.vue";
	
	export default {
		data() {
			return {
				post: null,
				answers: []
			};
		},
		
		methods: {
			async updatePost() {
				const post = await this.$api(`/post/${this.$route.params.postId}`);
				if(!post.ok) {
					if(post.reason === "no-such-post") {
						this.$router.replace('/404');
						return;
					}
					
					return this.$app.error.show('post-show-failed');
				}
				
				this.post = post.post;
			}
		},
		
		mounted() {
			this.updatePost();
		},
		
		beforeRouteUpdate() {
			this.updatePost();
		},
		
		components: {
			QkHeader,
			QkLoading,
			QkPost
		}
	};
</script>
