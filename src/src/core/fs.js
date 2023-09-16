const FS = (() => {

	const PATH_SEPARATOR = '\\';

	async function openRootDirDialog() {
		const root = await T.dialog.open({
			directory: true,
			multiple: false,
			defaultPath: await T.path.audioDir()
		});

		if (root == null) return; // user cancelled the selection
		if (Array.isArray(root)) return; // user selected multiple directories

		return root;
	}

	async function listFiles(dir) {
		const files = await T.fs.readDir(dir);

		return files
			.filter(f => !isHidden(f)) // doesn't work on windows X)
			.filter(f => isDir(f) || isAudio(f)) // get directories and audio files
			.sort((a, b) => { // and sort them
				if (!isDir(a) && isDir(b)) return 1;
				else if (isDir(a) && !isDir(b)) return -11;
				else return 0;
			});
	}

	async function audioDir() {
		return await T.path.audioDir();
	}

	function isAudio(file) { return file.name.match(/\.(mp3|ogg|aac|flac|wav|m4a|m4b)$/) !== null; }
	function isHidden(file) { return file.name.startsWith('.'); }
	function isDir(file) { return file.children; }

	return {
		PATH_SEPARATOR,

		openRootDirDialog,
		listFiles,

		isAudio,
		isHidden,
		isDir
	}

})();
