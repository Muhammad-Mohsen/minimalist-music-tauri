var Native = (() => {

	const appWindow = window.__TAURI__.window.appWindow;
	const path = window.__TAURI__.path;
	const fs = window.__TAURI__.fs;
	const dialog = window.__TAURI__.dialog;
	const convertFileSrc = window.__TAURI__.tauri.convertFileSrc;

	// FS
	const PATH_SEPARATOR = '\\';

	async function openRootDirDialog() {
		const root = await dialog.open({
			directory: true,
			multiple: false,
			defaultPath: await path.audioDir()
		});

		if (root == null) return; // user cancelled the selection
		if (Array.isArray(root)) return; // user selected multiple directories

		return root;
	}

	async function listFiles(dir) {
		const files = await fs.readDir(dir);

		return files
			.filter(f => !isHidden(f)) // doesn't work on windows X)
			.filter(f => isDir(f) || isAudio(f)) // get directories and audio files
			.sort((a, b) => { // and sort them
				if (!isDir(a) && isDir(b)) return 1;
				else if (isDir(a) && !isDir(b)) return -11;
				else return 0;
			});
	}

	function pathToSrc(path) {
		return convertFileSrc(path);
	}

	async function audioDir() {
		return await path.audioDir();
	}

	function isAudio(file) { return file.name.match(/\.(mp3|ogg|aac|flac|wav|m4a|m4b)$/) !== null; }
	function isHidden(file) { return file.name.startsWith('.'); }
	function isDir(file) { return file.children; }

	// APP WINDOW
	function closeWindow() {
		appWindow.close();
	}
	function minimizeWindow() {
		appWindow.minimize();
	}
	function resizeWindow(windowSize) {
		appWindow.setSize(windowSize);
	}
	async function windowSize() {
		return await appWindow.outerSize();
	}

	return {
		FS: {
			PATH_SEPARATOR,

			openRootDirDialog,
			listFiles,
			pathToSrc,
			audioDir,

			isAudio,
			isHidden,
			isDir,
		},

		Window: {
			close: closeWindow,
			minimize: minimizeWindow,
			resize: resizeWindow,
			size: windowSize,
		}
	}

})();
