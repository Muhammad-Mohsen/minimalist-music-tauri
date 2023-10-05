// wraps navigator.mediaSession
// https://developer.mozilla.org/en-US/docs/Web/API/MediaSession
// https://web.dev/media-session/
var Session = (() => {

	const SELF = EventBus.target.SESSION;

	const state = {
		PLAYING: 'playing',
		PAUSED: 'paused'
	}

	EventBus.subscribe((event) => {
		if (event.target == SELF) return;

		when(event.type)
			.is(EventBus.type.PLAY_TRACK, () => update())
			.is(EventBus.type.RESTORE_STATE, async () => update())
			.is(EventBus.type.PLAY, () => setState(state.PLAYING))
			.is(EventBus.type.PAUSE, () => setState(state.PAUSED));
	});

	async function update() {
		const path = State.get(State.key.TRACK);
		const src = Native.FS.pathToSrc(path);
		const metadata = await Metadata.fromSrc(src);

		// https://web.dev/media-session/
		navigator.mediaSession.metadata = new MediaMetadata({
			title: metadata.title,
			artist: metadata.artist || '',
			album: metadata.album,
			artwork: []
		});
	}

	function setState(state) {
		navigator.mediaSession.playbackState = state;
	}

	const actions = [
		['play', () => EventBus.dispatch({ type: EventBus.type.PLAY, target: SELF })],
		['pause', () => EventBus.dispatch({ type: EventBus.type.PAUSE, target: SELF })],
		['previoustrack', () => EventBus.dispatch({ type: EventBus.type.PLAY_PREV, target: SELF })],
		['nexttrack', () => EventBus.dispatch({ type: EventBus.type.PLAY_NEXT, target: SELF })],

		['seekbackward', (details) => { /* ... */ }],
		['seekforward', (details) => { /* ... */ }],
		['seekto', (details) => { /* ... */ }],

		['stop', () => { /* ... */ }],
	];

	for (const [action, handler] of actions) {
		try {
			navigator.mediaSession.setActionHandler(action, handler);

		} catch (error) { console.log(`The media session action "${action}" is not supported yet.`); }
	}

})();
