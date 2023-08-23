var MainWindow = (function () {

	let windowSize;
	let accordionAnimation = null;

	const height = {
		COLLAPSED: 188,
		EXPANDED: 600,
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

		State.setExpanded(to == height.EXPANDED);
	}

	async function loaded() {
		windowSize = await T.appWindow.outerSize();

		await State.restore();
		BreadcrumbBar.update();
	}

	return {
		close,
		minimize,
		expandCollapse,

		loaded,
	}

})();
