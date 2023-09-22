// import { Buffer } from "buffer";
// import { process } from "process";

import { EventBus } from "../core/event-bus";
import { Native } from "../core/native";
import { State } from "../core/state";
import { easeIO } from "../core/util";
import { Explorer } from "../explorer/explorer";
import { Player } from "../player/player";
import { BreadcrumbBar } from "../toolbar/breadcrumb-bar";

export const MainWindow = (() => {

	const SELF = EventBus.target.MAIN;

	let windowSize;
	let accordionAnimation = null;

	const height = {
		COLLAPSED: 188, // value needs to be changed in tauri.conf as well
		EXPANDED: 700,
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

	async function loaded() {
		windowSize = await Native.Window.size();

		await State.restore();
		EventBus.dispatch({ target: SELF, type: EventBus.type.DIR_CHANGE })
	}

	return {
		close,
		minimize,
		expandCollapse,

		loaded,
	}

})();

window.MainWindow = MainWindow;
window.Explorer = Explorer;
window.BreadcrumbBar = BreadcrumbBar;
window.Player = Player;