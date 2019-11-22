const fs = require('fs');
const loggers = require('../loggers');
const path = require('path');
const sanitizeFilename = require('sanitize-filename');

module.exports = async (req, postId, files) => {
	// TODO sanitize files
	const destDir = path.resolve(req.config.post.uploads.dest, postId);
	
	try {
		await fs.promises.mkdir(destDir);
	} catch {}
	
	const finishedFiles = [];
	for (const index in files) {
		const file = files[index];
		
		const originalSplit = file.originalname.split('.');
		const extension = originalSplit.pop();
		
		const sanitizedExtension = extension
			.replce(RegexPalette.illegalFileExtension, '').slice(0, 10);
		
		const sanitizedName = originalSplit.join('.')
			.replace(RegexPalette.illegalFileName, '').slice(0, 45);
		
		const finalFilename = sanitizeFilename(`${index}_${sanitizedName}.${sanitizedExtension}`);
		
		try {
			await fs.promises.rename(file.path, path.resolve(destDir, finalFilename));
			finishedFiles.push(finalFilename);
		} catch {
			try {
				await fs.promises.unlink(file.path);
			} catch {
				loggers.root.error(`Failed to unlink failed file: ${file.path} -> ${finalFilename}`);
			}
		}
	}
	
	return finishedFiles;
};
