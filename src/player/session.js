// wraps navigator.mediaSession
// https://developer.mozilla.org/en-US/docs/Web/API/MediaSession
// https://web.dev/media-session/
var Session = (() => {

	const SELF = EventBus.target.SESSION;

	EventBus.subscribe((event) => {
		if (event.target == SELF) return;

	});

})();
