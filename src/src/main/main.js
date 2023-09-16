const MainWindow = (() => {

	let windowSize;
	let accordionAnimation = null;

	const height = {
		COLLAPSED: 188, // value needs to be changed in tauri.conf as well
		EXPANDED: 700,
	}

	function close() {
		T.appWindow.close();
	}

	function minimize() {
		T.appWindow.minimize();
	}

	function expandCollapse() {
		const from = window.outerHeight;
		const to = window.outerHeight == height.COLLAPSED ? height.EXPANDED : height.COLLAPSED;

		// animation
		clearInterval(accordionAnimation); // clear the previous animation (if any)
		accordionAnimation = easeIO(from, to, 300, (val) => {
			windowSize.height = Math.floor(val);
			T.appWindow.setSize(windowSize);
		});

		State.set(State.key.EXPANDED, to == height.EXPANDED);
	}

	async function loaded() {
		windowSize = await T.appWindow.outerSize();

		await State.restore();
		BreadcrumbBar.update();
		Explorer.update();
	}

	return {
		close,
		minimize,
		expandCollapse,

		loaded,
	}

})();

window.MainWindow = MainWindow;