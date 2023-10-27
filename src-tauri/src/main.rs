// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::{Manager};

#[derive(Clone, serde::Serialize)]
struct Payload {
	args: Vec<String>,
	cwd: String,
}

fn main() {
	tauri::Builder::default()
		.plugin(tauri_plugin_single_instance::init(|app, argv, cwd| {
        	println!("{}, {argv:?}, {cwd}", app.package_info().name);
        	app.emit_all("single-instance", Payload { args: argv, cwd }).unwrap();
        }))
		.run(tauri::generate_context!())
		.expect("error while running tauri application");
}


/*
expected one of
`label`,
`url`,
`user-agent`,
`userAgent`,
`file-drop-enabled`,
`fileDropEnabled`,
`center`,
`x`, `y`, `width`, `height`,
`min-width`, `minWidth`, `min-height`, `minHeight`,
`max-width`, `maxWidth`, `max-height`, `maxHeight`,
`resizable`, `maximizable`, `minimizable`, `closable`,
`title`, `fullscreen`, `focus`, `transparent`, `maximized`, `visible`,
`decorations`,
`always-on-top`, `alwaysOnTop`,
`content-protected`, `contentProtected`,
`skip-taskbar`, `skipTaskbar`,
`theme`, `title-bar-style`, `titleBarStyle`,
`hidden-title`, `hiddenTitle`,
`accept-first-mouse`, `acceptFirstMouse`,
`tabbing-identifier`, `tabbingIdentifier`,
`additional-browser-args`, `additionalBrowserArgs

*/