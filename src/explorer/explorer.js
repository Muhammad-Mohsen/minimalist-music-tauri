var Explorer = (function() {

	const SELF = EventBus.target.EXPLORER;

	const cache = new Map();

	const searchContainer = document.querySelector('search-bar');
	const searchInput = document.querySelector('search-bar input');

	// EVENT BUS
	EventBus.subscribe((event) => {
		if (event.target == SELF) return;

		when(event.type)
			.is(EventBus.type.DIR_CHANGE, () => update())
			.is(EventBus.type.PLAY_TRACK, () => {
				const path = State.get(State.key.TRACK);
				// const target = document.querySelector(`[path="${path.replace(/\\\\/g, '\\')}"]`); // doesn't work
				const target = document.querySelectorAll('explorer.current button').toArray().find(f => f.getAttribute('path') == path);
				if (target) select(target);
			});
	});

	function goto(dir) {
		State.set(State.key.CURRENT_DIR, dir);
		EventBus.dispatch({ target: SELF, type: EventBus.type.DIR_CHANGE });
		update();
	}

	// UI
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
		const icon = Native.FS.isDir(file) ? 'folder' : 'music_note'
		return `<button path="${file.path}" ondblclick="Explorer.onItemClick(this);"><i class="material-symbols-outlined">${icon}</i><span>${file.name}<span></button>`;
	}

	function select(target) {
		document.querySelector('explorer .selected')?.classList?.remove('selected'); // deselect previous (if any)
		target.classList.add('selected');
	}

	// CLICK HANDLERS
	async function setRootDir() {
		const root = await Native.FS.openRootDirDialog();
		if (!root) return;

		State.set(State.key.ROOT_DIR, root);
		goto(root);
	}
	function onItemClick(target) {
		const path = target.getAttribute('path');

		if (isDir(target)) {
			goto(path);

		} else {
			select(target);
			State.set(State.key.TRACK, target.getAttribute('path'));
			EventBus.dispatch({ target: EventBus.target.EXPLORER, type: EventBus.type.PLAY_TRACK });
		}
	}

	// SEARCH
	function toggleSearchMode(force) {
		searchContainer.classList.toggle('show', force);
		searchInput.value = '';
		search();
	}
	function search() {
		var val = searchInput.value;
		var container = document.querySelector('explorer.current');

		var entries = container.querySelectorAll('button > span').toArray();
		entries.forEach(e => {
			const matches = e.textContent.fuzzyCompare(val);
			e.parentElement.style.display = matches ? '' : 'none';
			if (matches) e.innerHTML = highlightMatches(e, matches);
		});
	}
	function highlightMatches(element, matches) {
		let html = element.textContent;

		for (let i = matches.length - 1; i >= 0; i--) html = html.replaceAt(matches[i], `<b>${html[matches[i]]}</b>`);
		return html;
	}

	// UTILs
	async function listFiles() {
		const current = State.get(State.key.CURRENT_DIR);
		let files = cache.get(current);

		if (!files) {
			files = await Native.FS.listFiles(current);
			cache.set(current, files);
		}

		return files;
	}
	function listTracks() {
		const files = document.querySelectorAll('explorer.current button').toArray();
		return files.filter(f => f.querySelector('i').innerHTML == 'music_note').map(f => f.getAttribute('path'));
	}
	function isAtRoot() {
		return State.get(State.key.CURRENT_DIR).length <= State.get(State.key.ROOT_DIR).length;
	}
	function isDir(target) {
		return target.querySelector('i').innerHTML == 'folder';
	}

	return {
		goto,
		isAtRoot,
		listTracks,

		setRootDir,
		onItemClick,

		toggleSearchMode,
		search,
	}

})();
