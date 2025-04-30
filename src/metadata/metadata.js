importScripts('music-metadata-browser.js', '../core/db.js', '../core/event-bus.js', 'metadata-store.js');

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

	function remove(url) {
		MetadataStore.del(url);
	}

	return {
		fromSrc,
		remove,
	}

})();

// handle the message
onmessage = async (event) => {
	if (event.data.type == EventBus.type.METADATA_FETCH) {
		const metadata = await Metadata.fromSrc(event.data.src);
		postMessage(JSON.stringify(metadata));

	} else if (event.data.type == EventBus.type.METADATA_CLEAR) {
		Metadata.remove(event.data.src)
	}
}
