# Minimalist Music
Tauri version of the minimalist music player

## Features
Nothing fancy, as the name implies
- Music player with support for MP3, FLAC, WAV, AAC, OGG
- Explorer view with search
- Media session integration
- Keyboard shortcuts
	- <kbd>**`Space`**</kbd>: Play/Pause
	- <kbd>**`0`**</kbd>: Seek to begining
	- <kbd>**`←`**</kbd> / <kbd>**`→`**</kbd>: Seek jump by 10 seconds
	- <kbd>**`CTRL`**</kbd> + <kbd>**`←`**</kbd> / <kbd>**`CTRL`**</kbd> + <kbd>**`→`**</kbd>: Play next/prev

## Develop
### Run Locally
- Install NodeJS
- Install Rust by following the instructions [here](https://tauri.app/v1/guides/getting-started/prerequisites)
- Then, run the commmand `npx tauri dev`

### Build
Run the command `npx tauri build`

### App Icons
Run `npx tauri icon` (with an `app-icon.png` at the root) to generate app icons

### Notes
#### Using WebWorkers
I couldn't use webworkers for doing the visualization because they don't have access to the AudioContext API
And since I'm already storing the metadata, it just didn't matter to just move the music-metadata call to a webworker

## TODO
```diff
+ phase 1
+ 	- select root folder (empty state)
+ 	- bloop the expand button + add buttons to the bottom (root folder + search + collapse)...with bloop animation as well
+ 	- explorer item style
+ 	- explorer item actions
+ player
+ 	- navigator.mediaSession
+ 	- playlist
+ 		- index issue!!
+ 	- handle seek
+ 	- handle volume
+ update seek time + album | artist font
+ update album | artist placeholder to "Hello..."?
+ Restoring state
+ 	- volume level
+ 	- seek position
+ 	- track
+	- dir
+ search
- chapters -- doesn't work :'(
+ keyboard shortcuts
+ pointer-events with title/album+artist
+ use file name instead of title
+ bug: selected item lost after changing directories
- clunky code cleaning
+	- metadata loading
- 	- seek restoration
+ shuffle/repeat
+ bug: playlist not set on restore
+ bug: handle control clicks when tracks aren't set
+ neumorphic design
+ explorer styling during hover
+ window shadow
+ ensure single instance https://github.com/tauri-apps/plugins-workspace/tree/v1/plugins/single-instance

- at some point, use Rust to get the track metadata and sample the audio to fix the perf issues
- 	- https://ffmpeg.org/ffprobe.html
- 	- https://stackoverflow.com/questions/30305953/is-there-an-elegant-way-to-split-a-file-by-chapter-using-ffmpeg
-	- D:\Music + Audiobooks\MISC\BOOKS\Alien Isolation>ffprobe -print_format json -show_chapters "Alien [Isolation].m4b"
- 	- rust-id3 -> https://github.com/polyfloyd/rust-id3
```