<template>
	<button class="QkButton" @click="$emit('click', $event)">
		<slot></slot>
	</button>
</template>

<style lang="less" scoped>
	.QkButton {
		border: none;
		border-radius: 5px;
		padding: 7px 20px;
		transition: all .4s ease;
		
		background: var(--theme-color);
		cursor: pointer;
		color: var(--grey-100);
		font-family: var(--main-font);
		font-size: 1rem;
		font-weight: 500;
		outline: none;
		
		&:hover {
			background: var(--theme-300);
		}
	}
</style>
