// https://www.npmjs.com/package/jsmediatags (NO chapter support)
// https://www.npmjs.com/package/node-id3 (supports chapters -- IDv3-only)

// actually
// https://github.com/Borewit/music-metadata-browser (supports chapters!)

// importScripts('music-metadata-browser.js');
const musicMetadata = require_lib4();

var Metadata = (() => {

	async function fromBuffer(buffer) {
		const metadata = await musicMetadata.parseBuffer(buffer);
		return metadata;
	}

	async function fromSrc(url) {
		return await musicMetadata.fetchFromUrl(url);
	}

	return {
		fromBuffer,
		fromSrc
	}

})();

/*
// webworker stuff, don't worry about it
// I tried, unsuccessfully, to move getting the metadata to a background thread, but I didn't notice any improvement

// create a worker
const metadataWorker = new Worker('src/core/metadata/metadata.js');
metadataWorker.postMessage(src);
metadataWorker.onmessage = (event) => {
	const metadata = JSON.parse(event.data);

	title(metadata.common.title);
	albumArtist(metadata.common.album, metadata.common.artist);
	seek(0, metadata.format.duration);

	metadataWorker.terminate();
}

// handle the message from the worker
onmessage = async (event) => {
	const metadata = await Metadata.fromSrc(event.data);
	postMessage(JSON.stringify(metadata));
}

*/