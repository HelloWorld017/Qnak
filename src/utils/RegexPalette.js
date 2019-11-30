const RegexPalette = {
	postId: /^[0-9]+$/,
	illegalFileName: /[^a-zA-Z0-9가-힣 ]/g,
	illegalFileExtension: /[^a-zA-Z0-9]/g,
	illegalFriendlyUidBase: /[^a-zA-Z가-힣]/g
};

module.exports = RegexPalette;
