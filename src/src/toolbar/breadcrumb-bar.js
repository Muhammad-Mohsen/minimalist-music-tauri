const BreadcrumbBar = (function () {

	const container = document.querySelector('breadcrumb-bar');
	const crumbs = container.querySelector('crumb-list');

	function update() {
		const current = State.currentDir();

		crumbs.innerHTML = '';
		current.split(Explorer.PATH_SEPARATOR).reduce((acc, curr) => {
			if (!curr) return acc;

			const pathSegment = acc ? acc + Explorer.PATH_SEPARATOR + curr : curr;

			crumbs.insertAdjacentHTML('beforeend', crumb(pathSegment));

			return pathSegment;

		}, '');
	}

	function up() {
		const current = State.currentDir();

		const segments = current.split(Explorer.PATH_SEPARATOR);
		segments.pop(); // TODO check base dir
		const dir = segments.join(Explorer.PATH_SEPARATOR);
		State.setCurrentDir(dir);


		update();
		Explorer.update();
	}

	function crumb(path) {
		const label = path.split(Explorer.PATH_SEPARATOR).pop();
		return `<button data-path="${path}">${label}</button>`;
	}

	return {
		update,
		up
	}

})();