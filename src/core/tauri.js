const T = (() => {

	return {
		appWindow: window.__TAURI__.window.appWindow,
		path: window.__TAURI__.path,
		fs: window.__TAURI__.fs,
		dialog: window.__TAURI__.dialog,
		convertFileSrc: window.__TAURI__.tauri.convertFileSrc
	}

})();
