import { EventBus } from "../core/event-bus";
import { Native } from "../core/native";
import { State } from "../core/state";
import { when } from "../core/util";
import { UI } from "./player-ui";

export const Player = (() => {

	const SELF = EventBus.target.PLAYER;
	const SEEK_JUMP = 60; // 1 minute

	const audio = new Audio();

	EventBus.subscribe((event) => {
		if (event.target == SELF) return;

		when(event.type)
			.is(EventBus.type.PLAY_ITEM, () => {
				const fileSrc = State.get(State.key.TRACK);
				onPlayItem(fileSrc, true);
			});
	});

	audio.onended = function (event) {
		// TODO play next
	}

	function onSeek(target) {
		audio.currentTime = target.value;
		UI.seek(audio.currentTime);
	}

	// volume change listener
	function onVolumeChange(target) {
		audio.volume = target.value;
	}

	async function onPlayItem(fileSrc, auto) {
		const src = Native.FS.pathToSrc(fileSrc);

		audio.pause();
		seek(0);
		audio.src = src;
		audio.autoplay = auto;
	}

	function playPause() {
		audio.paused ? audio.play() : audio.pause();
	}

	function seek(seekTime) {
		audio.currentTime = seekTime;
	}

	// function updateSeek() {
	// 	setTimeout(() => {
	// 		if (audio.paused) return;

	// 		UI.seek(audio.currentTime);
	// 		updateSeek();

	// 	}, 1000);
	// }

	function ff() {
		seek(audio.currentTime + SEEK_JUMP)
	}
	function rw() {
		seek(audio.currentTime - SEEK_JUMP);
	}

	return {
		onPlayItem,
		playPause,

		seek,
		ff,
		rw,

		onSeek,
		onVolumeChange
	}

})();
