var State = (function () {

	const holder = document.querySelector('body');

	const setExpanded = (expanded) => holder.setAttribute('state-expanded', expanded);
	const expanded = () => holder.getAttribute('state-expanded') == 'true';

	const setPaused = (paused) => holder.setAttribute('state-paused', paused);
	const paused = () => holder.getAttribute('state-paused') == 'true';

	const setCurrentDir = (currentDir) => holder.setAttribute('state-current-dir', currentDir);
	const currentDir = () =>holder.getAttribute('state-current-dir');

	const setRootDir = (rootDir) => holder.setAttribute('state-root-dir', rootDir);
	const rootDir = () => holder.getAttribute('state-root-dir');

	const restore = async () => {
		const rootDir = Prefs.read(Prefs.key.ROOT_DIR);
		setRootDir(rootDir);

		const currentDir = Prefs.read(Prefs.key.CURRENT_DIR) || await T.path.audioDir();
		setCurrentDir(currentDir);

		setExpanded(false);
		setPaused(true);
	};

	return {
		restore,

		setExpanded,
		expanded,

		setPaused,
		paused,

		setCurrentDir,
		currentDir,

		setRootDir,
		rootDir,
	}

})();

var T = (function () {

	return {
		appWindow: window.__TAURI__.window.appWindow,
		path: window.__TAURI__.path,
		fs: window.__TAURI__.fs,
	}

})();


const XState = {

	currentDirectory: '', // TODO set in DOM
	paused: '', // TOOD set in DOM

	track: {
		exists: false,
		path: '',

		title: '',
		album: '',
		artist: '',
		duration: 0,
		seek: 0,
		// chapters: [],

	},

	playlist: null,

};
