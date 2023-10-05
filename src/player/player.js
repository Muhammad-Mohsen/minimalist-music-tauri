var Player = (() => {

	const SELF = EventBus.target.PLAYER;
	const SEEK_JUMP = 60; // 1 minute
	const SEEKING_ATTR = 'seeking';

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

	let tickerTimeout;

	const audio = new Audio();

	EventBus.subscribe(async(event) => {
		if (event.target == SELF) return;

		when(event.type)
			.is(EventBus.type.PLAY_TRACK, async () => {
				const path = State.get(State.key.TRACK);
				load(path, true);
				Playlist.set(await Explorer.listTracks());
			})
			.is(EventBus.type.RESTORE_STATE, async () => {
				const path = State.get(State.key.TRACK);
				Playlist.set(await Explorer.listTracks());

				const currentTime = parseInt(State.get(State.key.SEEK));
				await load(path, false);
				audio.currentTime = currentTime;
				seek(currentTime);

				onVolumeChange(parseFloat(State.get(State.key.VOLUME)));
			})
			.is(EventBus.type.PLAY, () => playPause(true, 'suppress'))
			.is(EventBus.type.PAUSE, () => playPause(false, 'suppress'))
			.is(EventBus.type.PLAY_NEXT, () => playNext(false))
			.is(EventBus.type.PLAY_PREV, () => playPrev())
	});

	audio.onended = function () {
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

		Visualizer.hide();

		title();

		let metadata = await Metadata.fromSrc(src);
		albumArtist(metadata.album, metadata.artist);
		seek(0, metadata.duration);

		Visualizer.render(metadata.visualization);
	}

	function playPause(force, suppress) {
		force != undefined
			? (force ? audio.play() : audio.pause())
			: (audio.paused ? audio.play() : audio.pause());

		ui.playPause.classList.toggle('pause', !audio.paused);
		ticker();

		if (!suppress) EventBus.dispatch({ type: force ? EventBus.type.PLAY : EventBus.type.PAUSE, target: SELF });
	}
	function playNext(onComplete) {
		const path = Playlist.getNext(onComplete);
		if (!path) return;

		State.set(State.key.TRACK, path);
		EventBus.dispatch({ type: EventBus.type.PLAY_TRACK, target: SELF });
		load(path, true);
	}
	function playPrev() {
		const path = Playlist.getPrev(true);
		if (!path) return;

		State.set(State.key.TRACK, path);
		load(path, true);
		EventBus.dispatch({ type: EventBus.type.PLAY_TRACK, target: SELF });
	}
	function ff() { seek(audio.currentTime + SEEK_JUMP); }
	function rw() { seek(audio.currentTime - SEEK_JUMP); }

	function onVolumeChange(restoredVal) {
		const val = restoredVal ?? ui.volume.value;

		if (restoredVal != undefined) ui.volume.value = val; // update the vol if restored
		else State.set(State.key.VOLUME, val); // update the state otherwise

		audio.volume = val;
		updateRange(ui.volume);
		if (val) audio.muted = false;
	}
	function toggleMute() {
		audio.muted = !audio.muted;
		ui.volumeIcon.innerHTML = audio.muted ? 'volume_off' : 'volume_up';
	}

	function shuffle(shuffle) {

	}
	function repeat(mode) {

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

		State.set(State.key.SEEK, position);
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

	function title(title) {
		ui.title.innerHTML = title || readablePath(State.get(State.key.TRACK));
		ui.title.setAttribute('title', ui.title.textContent);
	}
	function albumArtist(album, artist) {
		album = album || readablePath(State.get(State.key.CURRENT_DIR)); // default to current dir for no-album-in-metadata case

		ui.albumArtist.innerHTML = `<strong>${album}</strong> ${artist ? '| ' + artist : ''}`;
		ui.albumArtist.setAttribute('title', ui.albumArtist.textContent);
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
