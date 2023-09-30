Player = (() => {

	const SELF = EventBus.target.PLAYER;
	const SEEK_JUMP = 60; // 1 minute
	const SEEKING_ATTR = 'seeking';

	const audio = new Audio();

	let tickerTimeout;

	const ui = {
		title: document.querySelector('#title'),
		albumArtist: document.querySelector('#album-artist'),
		seek: document.querySelector('#seek'),
		position: document.querySelector('#current-position'),
		duration: document.querySelector('#duration'),
		volume: document.querySelector('#volume-level'),
		volumeIcon: document.querySelector('#volume-icon'),
		shuffle: document.querySelector('#volume-icon'),
		repeat: document.querySelector('#volume-icon'),
		playPause: document.querySelector('#play-pause'),
	};

	EventBus.subscribe((event) => {
		if (event.target == SELF) return;

		when(event.type)
			.is(EventBus.type.PLAY_ITEM, async () => {
				const path = State.get(State.key.TRACK);
				Playlist.set(Explorer.listTracks());
				load(path, true);
			});
	});

	audio.onended = function (event) {
		playNext(true);
	}

	audio.onloadeddata = function () {
		ui.playPause.classList.remove('loading');
		playPause(audio.autoplay);
	}

	async function load(path, auto) {
		const src = Native.FS.pathToSrc(path);

		audio.pause();
		seek(0);
		audio.src = src;
		audio.autoplay = auto;

		let metadata = await MetadataStore.get(path);
		if (metadata) {
			title(metadata.title);
			albumArtist(metadata.album, metadata.artist);
			seek(0, metadata.duration);

			Visualizer.fromData(metadata.visualization);

			// TODO chapters
			// TODO pic
		}

		if (!metadata) {
			ui.playPause.classList.add('loading');

			setTimeout(async () => {
				metadata = await Metadata.fromSrc(src);
				title(metadata.common.title);
				albumArtist(metadata.common.album, metadata.common.artist);
				seek(0, metadata.format.duration);

				const buffer = await getBuffer(src)
				const visualization = await Visualizer.fromBuffer(buffer);

				MetadataStore.set({
					path: path,
					title: metadata.common.title,
					album: metadata.common.album,
					artist: metadata.common.artist,
					duration: metadata.format.duration,
					visualization: visualization
				});

			}, 250);
		}

	}

	function playPause(force) {
		force != undefined
			? (force ? audio.play() : audio.pause())
			: (audio.paused ? audio.play() : audio.pause());

		ui.playPause.classList.toggle('pause', !audio.paused);
		ticker();
	}

	function playNext(onComplete) {
		const path = Playlist.getNext(onComplete);
		if (!path) return;

		State.set(State.key.TRACK, path);
		EventBus.dispatch({ type: EventBus.type.PLAY_ITEM, target: SELF });
		load(path, true);
	}
	function playPrev() {
		const path = Playlist.getPrev(true);
		if (!path) return;

		State.set(State.key.TRACK, path);
		load(path, true);
		EventBus.dispatch({ type: EventBus.type.PLAY_ITEM, target: SELF });
	}

	// not used
	function ff() { seek(audio.currentTime + SEEK_JUMP); }
	function rw() { seek(audio.currentTime - SEEK_JUMP); }

	function title(title) {
		ui.title.innerHTML = title || readablePath(State.get(State.key.TRACK));
		ui.title.setAttribute('title', title);
	}
	function albumArtist(album, artist) {
		album = album || readablePath(State.get(State.key.CURRENT_DIR)); // default to current dir for no-album-in-metadata case

		ui.albumArtist.innerHTML = `<strong>${album}</strong> ${ artist ? '| ' + artist : ''}`;
		ui.albumArtist.setAttribute('title', `${album} | ${artist}`);
	}

	function seek(position, duration) {
		if (duration) {
			ui.seek.max = duration;
			ui.duration.innerHTML = readableTime(duration);
		}
		ui.position.innerHTML = readableTime(position);

		ui.seek.value = position;
		updateRange(ui.seek);
		Visualizer.setProgress(position / ui.seek.max);
	}
	function onSeekMouseDown() {
		ui.seek.setAttribute(SEEKING_ATTR, true);
		audio.muted = true; // mute the thing while seeking so that it doesn't squeak
	}
	function onSeekChange() { // user-initiated event
		const value = ui.seek.value;
		audio.currentTime = value;
		seek(value);
	}
	function onSeekMouseUp() {
		ui.seek.removeAttribute(SEEKING_ATTR);
		audio.muted = false;
	}

	function ticker() {
		clearTimeout(tickerTimeout);
		tickerTimeout = setTimeout(() => {
			if (audio.paused) return;

			if (!ui.seek.hasAttribute(SEEKING_ATTR)) seek(audio.currentTime);
			ticker(audio);

		}, 1000);
	}

	function onVolumeChange() {
		const value = ui.volume.value;

		audio.volume = value;
		updateRange(ui.volume);
		if (value) audio.muted = false;
	}
	function toggleMute() {
		audio.muted = !audio.muted;
		ui.volumeIcon.innerHTML = audio.muted ? 'volume_off' : 'volume_up';
	}

	function shuffle(shuffle) {

	}
	function repeat(mode) {

	}

	function readableTime(seconds) {
		const ss = parseInt(seconds % 60).toString().padStart(2, '0');
		const mm = parseInt((seconds / 60) % 60).toString().padStart(2, '0');
		const hh = parseInt((seconds / 60 / 60)).toString().padStart(2, '0');

		const hhMax = parseInt((ui.seek.max / 60 / 60)).toString().padStart(2, '0');

		return hhMax == '00' ? `${mm}:${ss}` : `${hh}:${mm}:${ss}`;
	}
	function readablePath(path) {
		return path.split(Native.FS.PATH_SEPARATOR).pop();
	}

	function updateRange(target) {
		const parse = target.max <= 1 ? parseFloat : parseInt;
		const pos = parse(target.value) / parse(target.max) * 100;
		target.style.background = `linear-gradient(to right, var(--prime-d) 0%, var(--prime-d) ${pos}%, var(--prime-l) ${pos}%, var(--prime-l) 100%)`;
	}

	async function getBuffer(url) {
		return await fetch(url)
  			.then((response) => response.arrayBuffer());
	}

	return {
		load,
		playPause,
		playNext,
		playPrev,

		seek,
		ff,
		rw,

		onSeekMouseDown,
		onSeekChange,
		onSeekMouseUp,
		onVolumeChange,
		toggleMute,
	}

})();
