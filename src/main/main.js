var MainWindow = (() => {

	const SELF = EventBus.target.MAIN;

	let windowSize;
	let accordionAnimation = null;

	const height = {
		COLLAPSED: 213, // value needs to be changed in tauri.conf as well
		EXPANDED: 725,
	}

	function close() {
		Native.Window.close();
	}

	function minimize() {
		Native.Window.minimize();
	}

	function expandCollapse() {
		const from = window.outerHeight;
		const to = window.outerHeight == height.COLLAPSED ? height.EXPANDED : height.COLLAPSED;

		// animation
		clearInterval(accordionAnimation); // clear the previous animation (if any)
		accordionAnimation = easeIO(from, to, 300, (val) => {
			windowSize.height = Math.floor(val);
			Native.Window.resize(windowSize);
		});

		State.set(State.key.EXPANDED, to == height.EXPANDED);
	}

	function disableContextMenu() {
		document.addEventListener('contextmenu', event => event.preventDefault());
	}

	async function loaded() {
		disableContextMenu();

		windowSize = await Native.Window.size();

		await State.restore();
		EventBus.dispatch({ target: SELF, type: EventBus.type.DIR_CHANGE });
		EventBus.dispatch({ target: SELF, type: EventBus.type.RESTORE_STATE });
	}

	return {
		close,
		minimize,
		expandCollapse,

		loaded,
	}

})();
