import { EventBus } from "../core/event-bus";
import { Native } from "../core/native";
import { State } from "../core/state";
import { when } from "../core/util";

export const Explorer = (function() {

	const SELF = EventBus.target.EXPLORER;

	const cache = new Map();

	// EVENT BUS
	EventBus.subscribe((event) => {
		if (event.target == SELF) return;

		when(event.type)
			.is(EventBus.type.DIR_CHANGE, () => update());
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
		return `<button path="${file.path}" ondblclick="Explorer.onItemClick(this);"><i class="material-symbols-outlined">${icon}</i>${file.name}</button>`;
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
			EventBus.dispatch({ target: EventBus.target.EXPLORER, type: EventBus.type.PLAY_ITEM });
		}
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
	function isAtRoot() {
		return State.get(State.key.CURRENT_DIR).length <= State.get(State.key.ROOT_DIR).length;
	}
	function isDir(target) {
		return target.querySelector('i').innerHTML == 'folder';
	}

	return {
		goto,
		isAtRoot,

		setRootDir,
		onItemClick
	}

})();
