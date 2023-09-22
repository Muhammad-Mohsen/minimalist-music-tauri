import { EventBus } from "../core/event-bus.js";
import { Metadata } from "../core/metadata.js";
import { Native } from "../core/native.js";
import { State } from "../core/state.js";
import { when } from "../core/util.js";
import { Visualizer } from "./visualizer.js";

export const UI = (() => {

	const SELF = EventBus.target.UI;

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

	EventBus.subscribe((event) => {
		if (event.target == SELF) return;

		when(event.type)
			.is(EventBus.type.PLAY_ITEM, async () => {
				const path = State.get(State.key.TRACK);
				const src = Native.FS.pathToSrc(path);

				const metadata = await Metadata.fromSrc(src);
				title(metadata.common.title);
				albumArtist(metadata.common.album, metadata.common.artist);
				seek(0, metadata.format.duration);

				const visualizerBuffer = await getBuffer(src);
				Visualizer.generate(visualizerBuffer);
			});
	});

	function title(title) {
		uiTitle.innerHTML = title || readablePath(State.get(State.key.TRACK));
		uiTitle.setAttribute('title', title);
	}
	function albumArtist(album, artist) {
		album = album || readablePath(State.get(State.key.CURRENT_DIR)); // default to current dir for no-album-in-metadata case

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

		EventBus.dispatch({ type: EventBus.type.VOLUME, target: SELF, data: { volume } });
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

		const hhMax = parseInt((uiSeek.max / 60 / 60)).toString().padStart(2, '0');

		return hhMax == '00' ? `${mm}:${ss}` : `${hh}:${mm}:${ss}`;
	}
	function readablePath(path) {
		return path.split(Native.FS.PATH_SEPARATOR).pop();
	}

	function updateRange(target) {
		const pos = parseInt(target.value) / parseInt(target.max) * 100;
		target.style.background = `linear-gradient(to right, var(--prime-d) 0%, var(--prime-d) ${pos}%, var(--prime-l) ${pos}%, var(--prime-l) 100%)`;
	}

	async function getBuffer(url) {
		return await fetch(url)
  			.then((response) => response.arrayBuffer());
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