// TODO
const Explorer = (function() {

	const PATH_SEPARATOR = '\\';

	const cache = new Map();
	const container = document.querySelector('explorer');

	async function listFiles() {
		const current = State.currentDir();
		let files = cache.get(current);

		if (!files) {
			files = await FS.listFiles(current);
			cache.set(current, files);
		}

		return files;
	}

	function goto(dir) {
		State.setCurrentDir(dir);

		BreadcrumbBar.update();
		update();
	}

	async function update() {
		const files = await listFiles();

		container.innerHTML = '';
		for (const f of files) container.insertAdjacentHTML('beforeend', createItem(f));
	}

	function createItem(file) {
		return `<file><i class="material-symbols-outlined">close</i>${file.name}</file>`;
	}

	return {
		PATH_SEPARATOR,

		goto,
		update
	}

})();
