const EventBus = (() => {

	const subscribers = []; // a regular ol' array will do

	function subscribe(sub) {
		subscribers.push(sub);
	}

	function dispatch(event) {
		subscribers.forEach(s => s.handleEvent(event));
	}

	return {
		subscribe,
		dispatch
	}

})();
