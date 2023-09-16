const Toolbar = (() => {

	const Mode = {
		BREADCRUMB: 1,
		PLAYLIST: 2, // TODO
		SEARCH: 3
	}

	const container = document.querySelector('#toolbar');

	const breadcrumbs = container.querySelector('#breadcrumbs');
	const upButton = container.querySelector('#up');

	let currentDir;

	function populateCrums(dir) {
		currentDir = dir;

		// split the dir

		// create the crumbs & append them
	}
	function createCrumb(segment, isLast = false) {
		return ``;
	}

	function up() {

	}

	function toggleSearch(force) {

	}

	function addSelectedToQueue() {

	}
	function playSelected() {

	}

	return {
		Mode: Mode,

		populateCrums: populateCrums,
		up: up,

		toggleSearch: toggleSearch,

		addSelectedToQueue: addSelectedToQueue,
		playSelected: playSelected
	}

})();