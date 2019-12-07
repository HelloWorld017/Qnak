<template>
	<div class="QkEditor">
		<editor-menu-bar :editor="editor" v-slot="{ commands, isActive }">
			<div class="QkEditor__menubar Menubar">
				<button class="Menubar__button"
					:class="{'Menubar__button--active': isActive.bold()}"
					@click="commands.bold">
					
					<i class="mdi mdi-format-bold"></i>
				</button>
				
				<button class="Menubar__button"
					:class="{'Menubar__button--active': isActive.italic()}"
					@click="commands.italic">
					
					<i class="mdi mdi-format-italic"></i>
				</button>
				
				<button class="Menubar__button"
					:class="{'Menubar__button--active': isActive.strike()}"
					@click="commands.strike">
					
					<i class="mdi mdi-format-strikethrough"></i>
				</button>
				
				<button class="Menubar__button"
					:class="{'Menubar__button--active': isActive.underline()}"
					@click="commands.underline">
					
					<i class="mdi mdi-format-underline"></i>
				</button>
				
				<button class="Menubar__button"
					:class="{'Menubar__button--active': isActive.code()}"
					@click="commands.code">
					
					<i class="mdi mdi-code-tags"></i>
				</button>
			</div>
		</editor-menu-bar>
		
		<editor-content :editor="editor" class="QkEditor__content"/>
	</div>
</template>

<style lang="less" scoped>
	.QkEditor {
		background: var(--grey-200);
		border-radius: 5px;
		
		&__content {
			padding: 5px 20px;
			font-family: var(--main-font);
			
			::selection {
				background: var(--grey-800);
				color: var(--grey-100);
			}
		}
	}
	
	.Menubar {
		background: var(--grey-250);
		border-radius: 5px 5px 0 0;
		padding: 10px;
		display: flex;
		flex-wrap: wrap;
		
		&__button {
			cursor: pointer;
			background: var(--grey-200);
			border: none;
			border-radius: 2px;
			outline-color: var(--grey-800);
			margin: 0 5px;
			padding: 2px 5px;
			font-size: 1.3rem;
			line-height: 1.3rem;
			transition: all .4s ease;
			
			&:hover {
				background: var(--grey-100);
			}
			
			&--active {
				background: var(--theme-color);
				outline-color: var(--theme-300);
				color: var(--grey-100);
				
				&:hover {
					background: var(--theme-300);
				}
			}
		}
	}
</style>

<style lang="less">
	.QkEditor__content .ProseMirror {
		outline: none;
		
		p.is-empty:first-child::before {
			content: attr(data-empty-text);
			float: left;
			color: #aaa;
			pointer-events: none;
			height: 0;
			font-style: italic;
		}
	}
</style>

<i18n>
{
	"ko": {
		"editor-placeholder": "여기에 입력하세요"
	},
	"en": {
		"editor-placeholder": "Write Here"
	}
}
</i18n>

<script>
	import { Editor, EditorContent, EditorMenuBar } from "tiptap";
	import {
		Bold, Code, Heading, History, Italic,
		Placeholder, Strike, Underline
	} from "tiptap-extensions";
	
	export default {
		data() {
			return {
				editor: new Editor({
					extensions: [
						new Bold(),
						new Code(),
						new Heading({ levels: [1, 2] }),
						new History(),
						new Italic(),
						new Placeholder({
							emptyNodeClass: 'is-empty',
							emptyNodeText: this.$t('editor-placeholder'),
							showOnlyWhenEditable: true
						}),
						new Strike(),
						new Underline()
					],
					content: this.content,
					editable: this.editable
				})
			};
		},
		
		props: {
			content: {
				type: String,
				default: ''
			},
			
			editable: {
				type: Boolean
			}
		},
		
		methods: {
			getContent() {
				return this.editor.getHTML();
			},
			
			getFiles() {
				return [];
			}
		},
		
		beforeDestroy() {
			this.editor.destroy();
		},
		
		components: {
			EditorContent,
			EditorMenuBar
		}
	};
</script>
