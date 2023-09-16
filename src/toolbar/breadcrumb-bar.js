const BreadcrumbBar = (() => {

	const container = document.querySelector('breadcrumb-bar');
	const crumbs = container.querySelector('crumb-list');

	function update() {
		const current = State.get(State.key.CURRENT_DIR);

		crumbs.innerHTML = '';
		current.split(Explorer.PATH_SEPARATOR).reduce((acc, curr) => {
			if (!curr) return acc;

			const pathSegment = acc ? acc + Explorer.PATH_SEPARATOR + curr : curr;

			crumbs.insertAdjacentHTML('beforeend', crumb(pathSegment));

			return pathSegment;

		}, '');

		crumbs.scrollTo(crumbs.scrollWidth, 0);
	}

	function up() {
		if (Explorer.isAtRoot()) return; // don't go back beyond the root

		const current = State.get(State.key.CURRENT_DIR);

		const segments = current.split(Explorer.PATH_SEPARATOR);
		segments.pop();
		const dir = segments.join(Explorer.PATH_SEPARATOR);
		State.set(State.key.CURRENT_DIR, dir);

		update();
		Explorer.update();
	}

	function crumb(path) {
		const label = path.split(Explorer.PATH_SEPARATOR).pop();
		return `<button path="${path}" onclick="BreadcrumbBar.onCrumbClick(this)">${label}</button>`;
	}

	function onCrumbClick(target) {
		const dir = target.getAttribute('path');

		State.set(State.key.CURRENT_DIR, dir);
		update();
		Explorer.update();
	}

	return {
		update,
		onCrumbClick,
		up
	}

})();
