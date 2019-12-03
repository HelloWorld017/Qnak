<template>
	<main class="Write" id="Write">
		<qk-header />

		<form class="Write__container QkContainer" @submit.prevent="uploadPost">
			<h1 class="Write__title">{{$t('write')}}</h1>
			
			<label class="Write__row">
				<qk-chooser class="Write__input" v-model="board">
					<option value="" disabled hidden>{{$t('write-board')}}</option>
					<option v-for="board in userBoards" :value="board.boardId" :key="board.boardId">
						{{board.title}}
					</option>
				</qk-chooser>
				
				<qk-checkbox class="Write__input" v-model="anonymous">
					{{$t('write-anonymity')}}
				</qk-checkbox>
			</label>
			
			<label class="Write__row">
				<qk-input class="Write__input Write__input--large" :placeholder="$t('write-title')"/>
			</label>
			
			<qk-editor class="Write__editor" editable />
		</form>
	</main>
</template>

<i18n>
{
	"ko": {
		"write": "질문하기",
		"write-anonymity": "익명",
		"write-board": "게시판",
		"write-title": "제목"
	},
	
	"en": {
		"write": "New Question",
		"write-anonymity": "Anonymity",
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
		display: flex;
		flex-direction: column;
		overflow: auto;
		
		&__container {
			flex: 1;
		}
		
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
		
		&__input {
			margin: 0 5px;
			
			&:first-child {
				margin-left: 0;
			}
			
			&:last-child {
				margin-right: 0;
			}
			
			&--large {
				min-width: 30vw;
			}
		}
		
		&__editor {
			margin: 0 2rem;
			min-height: 30vh;
		}
	}
</style>

<script>
	import QkCheckbox from "../components/QkCheckbox.vue";
	import QkChooser from "../components/QkChooser.vue";
	import QkEditor from "../layouts/QkEditor.vue";
	import QkHeader from "../layouts/QkHeader.vue";
	import QkInput from "../components/QkInput.vue";
	
	export default {
		data() {
			return {
				board: '',
				anonymous: false
			};
		},
		
		computed: {
			userBoards() {
				return this.$store.state.auth.userBoards;
			}
		},
		
		methods: {
			uploadPost() {
				
			}
		},
		
		components: {
			QkCheckbox,
			QkChooser,
			QkEditor,
			QkHeader,
			QkInput
		}
	};
</script>
