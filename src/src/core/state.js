const State = (() => {

	const key = {
		EXPANDED: 'state-expanded',
		CURRENT_DIR: 'state-current-dir',
		ROOT_DIR: 'state-root-dir',

		PAUSED: 'state-paused',
		SEEK: 'state-seek',
		VOLUME: 'state-volume',
		SHUFFLE: 'state-shuffle',
		REPEAT: 'state-repeat',

		TRACK: 'state-track',
		DURATION: 'state-duration',
		ALBUM: 'state-album',
		ARTIST: 'state-artist'
	}

	const holder = document.querySelector('body');

	async function restore() {
		const rootDir = Prefs.read(key.ROOT_DIR);
		if (rootDir) set(key.ROOT_DIR, rootDir, true);

		const currentDir = Prefs.read(key.CURRENT_DIR) || rootDir || await FS.audioDir();
		set(key.CURRENT_DIR, currentDir, true);

		set(key.EXPANDED, false, true);
		set(key.PAUSED, true, true);

		set(key.SEEK, Prefs.read(key.SEEK), true);
		set(key.VOLUME, Prefs.read(key.VOLUME), true);
		set(key.SHUFFLE, Prefs.read(key.SHUFFLE), true);
		set(key.REPEAT, Prefs.read(key.REPEAT), true);

		set(key.TRACK, Prefs.read(key.TRACK), true);
		set(key.DURATION, Prefs.read(key.DURATION), true);
		set(key.ALBUM, Prefs.read(key.ALBUM), true);
		set(key.ARTIST, Prefs.read(key.ARTIST), true);
	}

	function set(key, val, noSave) {
		holder.setAttribute(key, val);
		if (!noSave) Prefs.write(key, val);
	}

	function get(key) {
		return holder.getAttribute(key);
	}

	return {
		key,

		restore,
		set,
		get,
	}

})();
