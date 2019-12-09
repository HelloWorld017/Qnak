<template>
	<aside class="QkSidebar">
		<router-link to="/">
			<qnak-branding class="QkSidebar__logo"></qnak-branding>
		</router-link>

		<div class="QkSidebar__boards">
			<router-link class="QkSidebar__board" exact-active-class="QkSidebar__board--active"
				:to="`/archive/subject:${board.boardId}`" v-for="board in boards" :key="board.boardId">
				
				<i class="mdi mdi-comment-processing"></i>
				{{board.title}}
			</router-link>
		</div>

		<div class="QkSidebar__footer">
		</div>
	</aside>
</template>

<style lang="less" scoped>
	.QkSidebar {
		width: 30vw;
		max-width: 300px;
		height: 100%;
		background: var(--grey-100);

		&__logo {
			fill: var(--theme-color);
			width: 100%;
			padding: 0 40px;
			margin: 20px 0;
			box-sizing: border-box;
		}
		
		&__boards {
			display: flex;
			flex-direction: column;
		}
		
		&__board {
			display: flex;
			align-items: center;
			border-radius: 15px;
			margin: 10px 30px;
			padding: 10px 20px;
			
			color: var(--grey-800);
			font-size: 1.2rem;
			font-weight: 600;
			font-family: var(--main-font);
			text-decoration: none;
			transition: all .4s ease;
			
			.mdi {
				font-size: 1.3rem;
				margin-right: 5px;
			}
			
			&--active {
				background: var(--theme-color);
				color: var(--grey-100);
			}
		}
	}
</style>

<script>
	import QnakBranding from "../images/QnakBranding.svg?inline";

	export default {
		computed: {
			authState() {
				return this.$store.getter['auth/authState'];
			},
			
			boards() {
				return this.$store.state.auth.user.boards;
			}
		},
		
		components: {
			QnakBranding
		}
	};
</script>
