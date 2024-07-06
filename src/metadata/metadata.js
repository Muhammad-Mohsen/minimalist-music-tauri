importScripts('music-metadata-browser.js', '../core/db.js', 'metadata-store.js');

const musicMetadata = require_lib4();

var Metadata = (() => {
	async function fromSrc(url) {

		let metadata = await MetadataStore.get(url);
		if (metadata) return metadata;

		metadata = await musicMetadata.fetchFromUrl(url, { skipPostHeaders: true });
		const art = metadata.common.picture?.[0];

		metadata = {
			src: url,
			title: metadata.common.title,
			album: metadata.common.album,
			artist: metadata.common.artist,
			duration: metadata.format.duration,
			artwork: art ? `data:${art.format};base64,${art.data.toString('base64')}` : undefined
		}

		MetadataStore.set(metadata);
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