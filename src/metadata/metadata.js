importScripts('music-metadata-browser.js', '../core/db.js', 'metadata-store.js');

const musicMetadata = require_lib4();

var Metadata = (() => {
	const inflight = {}; // inflight requests

	async function fromSrc(url) {

		let metadata = await MetadataStore.get(url);
		if (metadata) return metadata;

		document.querySelector('#play-pause').classList.add('loading'); // OUCH!!

		// if there's already a metadata request inflight, promise that we'd return it later
		if (url in inflight) return new Promise((resolve) => inflight[url].push(resolve));
		inflight[url] = [];

		metadata = await musicMetadata.fetchFromUrl(url);

		// TODO chapters - doesn't work unfortunately!
		// TODO pic

		metadata = {
			src: url,
			title: metadata.common.title,
			album: metadata.common.album,
			artist: metadata.common.artist,
			duration: metadata.format.duration,
		}

		MetadataStore.set(metadata);

		// resolve pending promises, and clear them
		inflight[url]?.forEach(r => r(metadata));
		delete inflight[url];

		return metadata;
	}

	return {
		fromSrc
	}

})();

// handle the message
onmessage = async (event) => {
	const metadata = await Metadata.fromSrc(event.data);
	postMessage(JSON.stringify(metadata));
}