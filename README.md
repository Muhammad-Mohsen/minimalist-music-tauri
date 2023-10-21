# Minimalist Music
Tauri version of the minimalist music player

## Building
### Prerequisites
Follow the instructions [here](https://tauri.app/v1/guides/getting-started/prerequisites) to install Rust, then run the below command to build the project
```
npx tauri dev
# OR
npm run tauri dev
```

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
- clunky cleaning
+	- metadata loading
- 	- seek restoration
- shuffle/repeat
+ bug: playlist not set on restore
+ bug: handle control clicks when tracks aren't set
- ensure single instance https://github.com/tauri-apps/plugins-workspace/tree/v1/plugins/single-instance

- at some point, use Rust to get the track metadata and sample the audio to fix the perf issues
- 	- https://ffmpeg.org/ffprobe.html
- 	- https://stackoverflow.com/questions/30305953/is-there-an-elegant-way-to-split-a-file-by-chapter-using-ffmpeg
-	- D:\Music + Audiobooks\MISC\BOOKS\Alien Isolation>ffprobe -print_format json -show_chapters "Alien [Isolation].m4b"
- 	- rust-id3 -> https://github.com/polyfloyd/rust-id3
```
## Notes
### Using WebWorkers
I couldn't use webworkers for doing the visualization because they don't have access to the AudioContext API
And since I'm already storing the metadata, it just didn't matter to just move the music-metadata call to a webworker