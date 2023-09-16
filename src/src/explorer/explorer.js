// TODO
const Explorer = (function() {

	const PATH_SEPARATOR = '\\';

	const cache = new Map();

	async function listFiles() {
		const current = State.get(State.key.CURRENT_DIR);
		let files = cache.get(current);

		if (!files) {
			files = await FS.listFiles(current);
			cache.set(current, files);
		}

		return files;
	}

	async function setRootDir() {
		const root = await FS.openRootDirDialog();
		if (!root) return;

		State.set(State.key.ROOT_DIR, root);
		goto(root);
	}

	function goto(dir) {
		State.set(State.key.CURRENT_DIR, dir);

		BreadcrumbBar.update();
		update();
	}

	async function update() {
		const files = await listFiles();

		const current = document.querySelector('explorer.current');
		const outward = document.querySelector('explorer.out');
		const inward = document.querySelector('explorer.in');

		const previousDir = current.getAttribute('data-dir');
		const currentDir = State.get(State.key.CURRENT_DIR);
		const toInward = currentDir.length > previousDir.length;

		const other = toInward ? inward : outward;
		const otherOther = toInward ? outward : inward;

		// this is the actual important bit, everything else is just for the transition animation!
		other.innerHTML = '';
		files.forEach(f => other.insertAdjacentHTML('beforeend', createItem(f)));
		other.setAttribute('data-dir', currentDir);

		current.className = toInward ? 'out' : 'in';
		other.className = 'current';
		otherOther.className = toInward ? 'in' : 'out';
	}

	function createItem(file) {
		const icon = FS.isDir(file) ? 'folder' : 'music_note'
		return `<button path="${file.path}" ondblclick="Explorer.onItemClick(this);"><i class="material-symbols-outlined">${icon}</i>${file.name}</button>`;
	}

	function onItemClick(target) {
		const path = target.getAttribute('path');

		if (isDir(target)) {
			State.set(State.key.CURRENT_DIR, path);
			BreadcrumbBar.update();
			update();

		} else {
			select(target);
			Player.load(target.getAttribute('path'), true);
		}
	}

	function select(target) {
		document.querySelector('explorer .selected')?.classList?.remove('selected'); // deselect previous (if any)
		target.classList.add('selected');
	}

	function isAtRoot() {
		return State.get(State.key.CURRENT_DIR).length <= State.get(State.key.ROOT_DIR).length;
	}
	function isDir(target) {
		return target.querySelector('i').innerHTML == 'folder';
	}

	return {
		PATH_SEPARATOR,

		goto,
		setRootDir,
		isAtRoot,

		update,
		onItemClick
	}

})();
