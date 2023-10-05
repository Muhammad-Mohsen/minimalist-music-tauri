```
npx tauri dev
```
- OR -
```
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
- chapters
- keyboard shortcuts
+ pointer-events with title/album+artist
+ use file name instead of title
+ bug: selected item lost after changing directories
- clunky cleaning
+	- metadata loading
- 	- seek restoration
- shuffle/repeat
+ bug: playlist not set on restore
- bug: handle control clicks when tracks aren't set
```
## Notes
### Using WebWorkers
I couldn't use webworkers for doing the visualization because they don't have access to the AudioContext API
And since I'm already storing the metadata, it just didn't matter to just move the music-metadata call to a webworker