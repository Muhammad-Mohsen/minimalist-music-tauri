const Player = (function () {

	const SEEK_JUMP = 60; // 1 minute

	const audio = new Audio();

	audio.onended = function (event) {
		// TODO
	}

	// seekbar change listener

	// volume change listener

	function setSrc(src, auto) {
		audio.src = src;
		audio.autoplay = auto;
	}

	function playPause() {
		audio.paused ? audio.play() : audio.pause();
	}

	function seek(seekTime) {
		audio.currentTime = seekTime;
	}
	function ff() {
		seek(audio.currentTime + SEEK_JUMP)
	}
	function rw() {
		seek(audio.currentTime - SEEK_JUMP);
	}

	return {
		setSrc: setSrc,
		playPause: playPause,

		seek: seek,
		ff: ff,
		rw: rw,
	}

})();
