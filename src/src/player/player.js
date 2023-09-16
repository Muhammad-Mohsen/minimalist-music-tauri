const Player = (() => {

	const SEEK_JUMP = 60; // 1 minute

	const audio = new Audio();

	audio.onended = function (event) {
		// TODO play next
	}

	function onSeek(target) {
		audio.currentTime = target.value;
		Player.UI.seek(audio.currentTime);
	}

	// volume change listener
	function onVolumeChange(target) {
		audio.volume = target.value;
	}

	async function load(fileSrc, auto) {
		const src = T.convertFileSrc(fileSrc);

		audio.pause();
		seek(0);
		audio.src = src;
		audio.autoplay = auto;

		Player.UI.title(fileSrc.split(Explorer.PATH_SEPARATOR).pop()); // TODO use metadata

		const buffer = await getBuffer(src);
		Visualizer.generate(buffer);

		updateSeek();

		const metadata = await Metadata.parse(buffer);
		console.log(metadata);
	}

	function playPause() {
		audio.paused ? audio.play() : audio.pause();
		Player.UI.playPause(audio.paused);

		updateSeek();
	}

	function seek(seekTime) {
		audio.currentTime = seekTime;
		Player.UI.seek(0, 500); // TODO
	}

	function updateSeek() {
		setTimeout(() => {
			if (audio.paused) return;

			Player.UI.seek(audio.currentTime);
			updateSeek();

		}, 1000);
	}

	function ff() {
		seek(audio.currentTime + SEEK_JUMP)
	}
	function rw() {
		seek(audio.currentTime - SEEK_JUMP);
	}

	async function getBuffer(url) {
		return await fetch(url)
  			.then((response) => response.arrayBuffer());
	}

	return {
		load,
		playPause,

		seek,
		ff,
		rw,

		onSeek,
		onVolumeChange,
	}

})();
