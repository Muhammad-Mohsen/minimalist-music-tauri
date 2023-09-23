import { EventBus } from "../core/event-bus";
import { Native } from "../core/native";
import { State } from "../core/state";
import { when } from "../core/util";
import { Metadata } from "../core/metadata.js";
import { Visualizer } from "./visualizer.js";

export const Player = (() => {

	const SELF = EventBus.target.PLAYER;
	const SEEK_JUMP = 60; // 1 minute
	const SEEKING_ATTR = 'seeking';

	debugger;
	const audio = new Audio();

	let ticker;

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
				const src = Native.FS.pathToSrc(path);

				load(src, true);

				// UI
				const metadata = await Metadata.fromSrc(src);
				title(metadata.common.title);
				albumArtist(metadata.common.album, metadata.common.artist);
				seek(0, metadata.format.duration);

				const visualizerBuffer = await getBuffer(src);
				Visualizer.generate(visualizerBuffer);
			});
	});

	audio.onended = function (event) {
		// TODO play next
	}

	function onSeek(target) {
		audio.currentTime = target.value;
		// UI.seek(audio.currentTime);
	}

	async function load(src, auto) {
		audio.pause();
		seek(0);
		audio.src = src;
		audio.autoplay = auto;

		playPause(!auto);
	}

	function playPause() {
		audio.paused ? audio.play() : audio.pause();

		ui.playPause.classList.toggle('pause', !audio.paused);
		seekTickTock();
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
	}
	function onSeekMouseUp() {
		ui.seek.removeAttribute(SEEKING_ATTR);

		const value = ui.seek.value;
		audio.currentTime = value;
		seek(value);
	}

	function seekTickTock() {
		clearTimeout(ticker);
		ticker = setTimeout(() => {
			if (audio.paused) return;

			if (!ui.seek.hasAttribute(SEEKING_ATTR)) seek(audio.currentTime);
			seekTickTock(audio);

		}, 1000);
	}

	function onVolumeChange() {
		const value = ui.volume.value;

		audio.volume = value;

		updateRange(ui.volume);

		if (value == 0) ui.volumeIcon.innerHTML = 'volume_mute';
		else if (value < 0.5) ui.volumeIcon.innerHTML = 'volume_down';
		else ui.volumeIcon.innerHTML = 'volume_up';
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

		seek,
		ff,
		rw,

		onSeekMouseDown,
		onSeekMouseUp,
		onVolumeChange
	}

})();
