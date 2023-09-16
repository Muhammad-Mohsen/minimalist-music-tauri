Player.UI = (() => {

	const uiTitle = document.querySelector('#title');
	const uiAlbumArtist = document.querySelector('#album-artist');

	const uiSeek = document.querySelector('#seek');
	const uiPosition = document.querySelector('#current-position');
	const uiDuration = document.querySelector('#duration');

	const uiVolume = document.querySelector('#volume-level');
	const uiVolumeIcon = document.querySelector('#volume-icon');

	const uiShuffle = document.querySelector('#volume-icon');
	const uiRepeat = document.querySelector('#volume-icon');

	const uiPlayPause = document.querySelector('#play-pause');

	function title(title) {
		uiTitle.innerHTML = title;
		uiTitle.setAttribute('title', title);
	}
	function albumArtist(album, artist) {
		uiAlbumArtist.innerHTML = `<strong>${album}</strong> ${ artist ? '| ' + artist : ''}`;
		uiAlbumArtist.setAttribute('title', `${album} | ${artist}`);
	}

	function seek(seek, duration) {
		if (duration) {
			uiSeek.max = duration;
			uiDuration.innerHTML = readableTime(duration);
		}

		uiSeek.value = seek;
		updateRange(uiSeek);

		uiPosition.innerHTML = readableTime(seek);

		Visualizer.setProgress(seek / uiSeek.max);
	}

	// TODO
	function volume(volume) {
		updateRange(uiVolume);

		if (volume == 0) uiVolumeIcon.innerHTML = 'volume_mute';
		else if (volume < 0.5) uiVolumeIcon.innerHTML = 'volume_down';
		else uiVolumeIcon.innerHTML = 'volume_up';
	}

	function playPause(paused) {
		uiPlayPause.innerHTML = paused ? 'play_arrow' : 'pause';
	}
	function shuffle(shuffle) {

	}
	function repeat(mode) {

	}

	function readableTime(seconds) {
		const ss = parseInt(seconds % 60).toString().padStart(2, '0');
		const mm = parseInt((seconds / 60) % 60).toString().padStart(2, '0');
		const hh = parseInt((seconds / 60 / 60)).toString().padStart(2, '0');

		return hh == '00' ? `${mm}:${ss}` : `${hh}:${mm}:${ss}`;
	}

	function updateRange(target) {
		const pos = parseInt(target.value) / parseInt(target.max) * 100;
		target.style.background = `linear-gradient(to right, var(--prime-d) 0%, var(--prime-d) ${pos}%, var(--prime-l) ${pos}%, var(--prime-l) 100%)`;
	}

	return {
		title,
		albumArtist,

		seek,
		volume,

		playPause,
		shuffle,
		repeat,
	}

})();
