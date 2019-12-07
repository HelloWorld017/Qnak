<template>
	<section class="QkPost">
		<qk-vote :postId="post.postId"/>
		<div class="QkPost__content">
			<h1 class="QkPost__title">{{post.title}}</h1>
			<div class="QkPost__body" v-html="post.content"/>
		</div>
		<qk-comments :post="post" class="QkPost__comments" />
	</section>
</template>

<style lang="less" scoped>
	.QkPost {
		display: flex;
		align-items: flex-start;
		
		background: var(--grey-050);
		margin: 1rem 1.5rem;
		padding: 1.5rem 2rem;
		font-family: var(--main-font);
		
		&__content {
			margin-left: 2rem;
		}
		
		&__title {
			margin-top: 0;
		}
	}
</style>

<script>
	import QkComments from "./QkComments.vue";
	import QkVote from "../components/QkVote.vue";
	
	export default {
		props: {
			post: {
				required: true
			}
		},
		
		components: {
			QkComments,
			QkVote
		}
	};
</script>
