<template>
	<div class="QkAcl">
		{{$t('acl-noperm')}}
	</div>
</template>

<i18n>
{
	"ko": {
		"acl-noperm": "권한이 없습니다!"
	},

	"en": {
		"acl-noperm": "No permission!"
	}
}
</i18n>

<style lang="less" scoped>
.QkAcl {
	height: 30vh;
	display: flex;
	align-items: center;
	justify-content: center;
	text-align: center;
	color: var(--grey-800);
	font-family: var(--main-font);
	font-size: 2rem;
	font-weight: 600;

	background: var(--grey-250);
}
</style>
