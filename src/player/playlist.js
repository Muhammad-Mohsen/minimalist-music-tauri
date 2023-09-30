Playlist = (() => {

	const repeat = {
		NO: 0,
		YES: 1,
		YES_ONE: 2,
	}

	let repeatMode = repeat.NO;
	let shuffle = false;

	let index = 0;
	let tracks = [];

	function set(paths) {
		tracks = paths;
	}
	function contains(track) {

	}

	function getNext(onComplete) {
		if (!tracks.length) return;

		if (repeatMode == repeat.YES_ONE) return tracks[index];
		else if (repeatMode == repeat.YES) index = (index + 1) % tracks.length;
		else if (repeatMode == repeat.NO) {
			index = (index + 1) % tracks.length;
			if (index == 0 && onComplete) return;
		}

		if (shuffle) index = Math.floor(Math.random() * tracks.length);

		return tracks[index];
	}
	function getPrev() {
		if (!tracks.length) return;

		if (shuffle) index = Math.floor(Math.random() * tracks.length);
		else if (index > 0) index--;
		else index = tracks.length - 1;

		return tracks[index];
	}

	function toggleShuffle() {
		shuffle = !shuffle;
	}
	function toggleRepeat() {
		repeatMode = (repeatMode + 1) % 3;
	}

	return {
		repeat,

		toggleShuffle,
		toggleRepeat,

		set,
		contains,

		getNext,
		getPrev,
	}

})();
