<template>
	<main class="Write" id="Write">
		<qk-header />

		<form class="QkContainer">
			<h1 class="Write__title">{{$t('write')}}</h1>
			
			<label class="Write__row">
				<qk-chooser class="Write__input" v-model="board">
					<option value="" disabled hidden>{{$t('write-board')}}</option>
					<option v-for="board in userBoards" :value="board.boardId" :key="board.boardId">
						{{board.title}}
					</option>
				</qk-chooser>
			</label>
			
			<label class="Write__row">
				<qk-input :placeholder="$t('write-title')"/>
			</label>
		</form>
	</main>
</template>

<i18n>
{
	"ko": {
		"write": "질문하기",
		"write-board": "게시판",
		"write-title": "제목"
	},
	
	"en": {
		"write": "New Question",
		"write-board": "Board",
		"write-title": "Title"
	}
}
</i18n>

<style lang="less" scoped>
	#Write {
		flex: 1;
	}
	
	.Write {
		&__title {
			margin-top: 0;
			margin-left: 2rem;
			font-family: var(--main-font);
		}
		
		&__row {
			display: flex;
			align-items: center;
			margin-left: 2rem;
			margin-bottom: 1rem;
		}
		
		&__label {
			font-family: var(--main-font);
			font-size: 1.2rem;
			font-weight: 500;
			margin-right: 10px;
		}
	}
</style>

<script>
	import QkChooser from "../components/QkChooser.vue";
	import QkHeader from "../layouts/QkHeader.vue";
	import QkInput from "../components/QkInput.vue";
	
	export default {
		data() {
			return {
				board: ''
			};
		},
		
		computed: {
			userBoards() {
				return this.$store.state.auth.userBoards;
			}
		},
		
		components: {
			QkChooser,
			QkHeader,
			QkInput
		}
	};
</script>
