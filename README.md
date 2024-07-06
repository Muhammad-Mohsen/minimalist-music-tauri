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

#### Metadata Library Comparison
jsmediatags is at least twice as slow as music metadata browser

to test
// #1
```
musicMetadata
	.fetchFromUrl("https://asset.localhost/D%3A%5CMusic%20%2B%20Audiobooks%5CMISC%5CBOOKS%5CAd%20Astra%5C01%20-%20Intro%20%2B%20Lady%20Be%20Good.mp3")
	.then(res => console.log(res))
```
// #2
```
jsmediatags.Config.setDisallowedXhrHeaders(['If-Modified-Since', 'Range'])
jsmediatags.read("https://asset.localhost/D%3A%5CMusic%20%2B%20Audiobooks%5CMISC%5CBOOKS%5CAd%20Astra%5C01%20-%20Intro%20%2B%20Lady%20Be%20Good.mp3", {
	onSuccess: function(tag) { console.log(tag); },
	onError: function(error) { console.log(error); }
});
```
