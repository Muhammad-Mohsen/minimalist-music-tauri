var MetadataWorker = new Worker('metadata/metadata.js');

var Player = (() => {

	const SELF = EventBus.target.PLAYER;
	const SEEK_JUMP = 10; // in seconds
	const VOLUME_JUMP = .1;
	const SEEKING_ATTR = 'seeking';

	let tickerTimeout;

	const ui = {
		title: document.querySelector('#title'),
		albumArtist: document.querySelector('#album-artist'),
		seek: document.querySelector('#seek'),
		position: document.querySelector('#current-position'),
		duration: document.querySelector('#duration'),
		volume: document.querySelector('#volume-level'),
		volumeIcon: document.querySelector('#volume-icon'),
		shuffle: document.querySelector('#shuffle-icon'),
		repeat: document.querySelector('#repeat-icon'),
		playPause: document.querySelector('#play-pause'),
	};

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
				shuffle(State.get(State.key.SHUFFLE));
				repeat(State.get(State.key.REPEAT));

				const currentTime = parseInt(State.get(State.key.SEEK)) || 0;
				await load(path, false);
				audio.currentTime = currentTime;
				seek(currentTime);

				onVolumeChange(parseFloat(State.get(State.key.VOLUME)));
			})
			.is(EventBus.type.PLAY, () => playPause(true, 'suppress'))
			.is(EventBus.type.PAUSE, () => playPause(false, 'suppress'))
			.is(EventBus.type.PLAY_NEXT, () => playNext(false))
			.is(EventBus.type.PLAY_PREV, () => playPrev())
			.is(EventBus.type.FROM_THE_TOP, () => { audio.currentTime = 0; seek(0); })
			.is(EventBus.type.PLAY_PAUSE, () => playPause())
			.is(EventBus.type.FF, () => ff())
			.is(EventBus.type.RW, () => rw())

			.is(EventBus.type.VOLUME_DOWN, () => onVolumeChange(audio.volume - VOLUME_JUMP))
			.is(EventBus.type.VOLUME_UP, () => onVolumeChange(audio.volume + VOLUME_JUMP))
	});

	const audio = new Audio();
	audio.onended = function () {
		playNext(true);
	}
	audio.onloadeddata = function () {
		playPause(audio.autoplay);
	}

	MetadataWorker.addEventListener('message', (event) => {
		const metadata = JSON.parse(event.data);
		albumArtist(metadata.album, metadata.artist);
		seek(audio.currentTime || 0, metadata.duration);
	});

	async function load(path, auto) {
		const src = Native.FS.pathToSrc(path);

		audio.pause();
		seek(0);
		audio.src = src;
		audio.autoplay = auto;

		if (!initialized()) return albumArtist(State.get(State.key.ALBUM));

		title();
		MetadataWorker.postMessage(src);
	}

	function playPause(force, suppress) {
		if (!initialized()) return;

		force != undefined
			? (force ? audio.play() : audio.pause())
			: (audio.paused ? audio.play() : audio.pause());

		ui.playPause.classList.toggle('pause', !audio.paused);
		ticker();

		if (!suppress) EventBus.dispatch({ type: force ? EventBus.type.PLAY : EventBus.type.PAUSE, target: SELF });
	}
	function playNext(onComplete) {
		if (!initialized()) return;

		const path = Playlist.getNext(onComplete);
		if (!path) return;

		State.set(State.key.TRACK, path);
		EventBus.dispatch({ type: EventBus.type.PLAY_TRACK, target: SELF });
		load(path, true);
	}
	function playPrev() {
		if (!initialized()) return;

		const path = Playlist.getPrev(true);
		if (!path) return;

		State.set(State.key.TRACK, path);
		load(path, true);
		EventBus.dispatch({ type: EventBus.type.PLAY_TRACK, target: SELF });
	}
	function ff() {
		audio.currentTime += SEEK_JUMP
		seek(audio.currentTime);
	}
	function rw() {
		audio.currentTime -= SEEK_JUMP
		seek(audio.currentTime);
	}

	function onVolumeChange(restoredVal) {
		const val = (isNaN(restoredVal) || restoredVal == undefined) ? ui.volume.value : restoredVal;

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

	function shuffle(force) {
		const current = Playlist.toggleShuffle(force, force != undefined);
		ui.shuffle.innerHTML = current ? 'shuffle_on' : 'shuffle';

	}
	function repeat(force) {
		const current = Playlist.toggleRepeat(force, force != undefined);
		ui.repeat.innerHTML = when(current)
			.is(0, () => 'repeat')
			.is(1, () => 'repeat_on')
			.is(2, () => 'repeat_one_on')
			.val();
	}

	function seek(position, duration) {
		if (!initialized()) return;

		if (duration) {
			ui.seek.max = duration;
			ui.duration.innerHTML = readableTime(duration);
		}
		ui.position.innerHTML = readableTime(position);

		ui.seek.value = position;
		updateRange(ui.seek);

		State.set(State.key.SEEK, position);
	}
	function onSeekMouseDown() {
		ui.seek.setAttribute(SEEKING_ATTR, true);
		audio.muted = true; // mute the thing while seeking so that it doesn't squeak
	}
	function onSeekChange() { // user-initiated event
		if (!initialized()) return;

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
		ui.title.innerHTML = title || Native.FS.readablePath(State.get(State.key.TRACK));
		ui.title.setAttribute('title', ui.title.textContent);
		Native.Window.title(ui.title.textContent);
	}
	function albumArtist(album, artist) {
		album = album || Native.FS.readablePath(State.get(State.key.CURRENT_DIR)); // default to current dir for no-album-in-metadata case

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

	function updateRange(target) {
		// const parse = target.max <= 1 ? parseFloat : parseInt;
		// const pos = parse(target.value) / parse(target.max) * 100;
		// target.style.background = `linear-gradient(to right, var(--prime-d) 0%, var(--prime-d) ${pos}%, var(--prime-l) ${pos}%, var(--prime-l) 100%)`;
	}

	function initialized() {
		return State.get(State.key.TRACK) != 'null';
	}

	return {
		load,
		playPause,
		playNext,
		playPrev,

		seek,
		ff,
		rw,

		shuffle,
		repeat,

		onSeekMouseDown,
		onSeekChange,
		onSeekMouseUp,
		onVolumeChange,
		toggleMute,
	}

})();
