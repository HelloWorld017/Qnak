<template>
	<form class="QkInputSearch" @submit.prevent="submit">
		<input class="QkInputSearch__input" type="text" v-model="searchText">
		<button class="QkInputSearch__button">
			<icon-search class="QkInputSearch__icon" />
		</button>
	</form>
</template>

<style lang="less" scoped>
	.QkInputSearch {
		background: var(--theme-color);
		display: flex;
		border-radius: 5px;
		overflow: hidden;
		margin-left: 10px;
		margin-right: 15px;
		box-shadow: 0 2px 20px 0 rgba(0, 0, 0, .3);
		min-width: 16vw;
		
		&__input {
			flex: 1;
			color: var(--grey-100);
			font-family: var(--main-font);
			font-weight: 400;
			border-radius: 5px 0 0 5px;
			background: transparent;
			border: none;
			outline: none;
			padding: 10px 0 10px 15px;
			
			&::selection {
				background: rgba(255, 255, 255, .3);
			}
		}
		
		&__button {
			cursor: pointer;
			display: flex;
			align-items: center;
			
			background: transparent;
			border: none;
			padding: 0 20px;
		}
		
		&__icon {
			width: 1.25rem;
			height: 1.25rem;
		}
	}
</style>

<script>
	import IconSearch from "../images/IconSearch.svg?inline";
	
	export default {
		data() {
			return {
				searchText: ''
			};
		},
		
		methods: {
			submit() {
				this.$emit('submit', this.searchText);
			}
		},
		
		components: {
			IconSearch
		}
	};
</script>
