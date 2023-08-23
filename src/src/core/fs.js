const FS = (function () {

	async function listFiles(dir) {
		const files = await T.fs.readDir(dir);

		return files
			.filter(f => !isHidden(f))
			.filter(f => isDir(f) || isAudio(f));
	}
	function isAudio(file) {
		return file.name.match(/\.(mp3|ogg|aac|flac|wav|m4a|m4b)$/) !== null;
	}
	function isHidden(file) {
		return file.name.startsWith('.');
	}
	function isDir(file) {
		return file.children;
	}

	return {
		listFiles,
		isAudio,
		isHidden,
		isDir
	}

})();
