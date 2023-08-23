// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![greet])
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