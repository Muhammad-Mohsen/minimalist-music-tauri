const musicMetadata = require_lib4();

var Metadata = (() => {

	async function fromBuffer(buffer) {
		const metadata = await musicMetadata.parseBuffer(buffer);
		return metadata;
	}

	async function fromSrc(url) {

		let metadata = await MetadataStore.get(url);
		if (metadata) return metadata;

		document.querySelector('#play-pause').classList.add('loading'); // OUCH!!

		// sleep for 250ms to allow the track to play before hogging the file?
		await new Promise(resolve => setTimeout(resolve, 250));

		metadata = await musicMetadata.fetchFromUrl(url);
		const visualization = await Visualizer.fromSrc(url);
		// TODO chapters
		// TODO pic

		metadata = {
			src: url,
			title: metadata.common.title,
			album: metadata.common.album,
			artist: metadata.common.artist,
			duration: metadata.format.duration,
			visualization: visualization
		}

		MetadataStore.set(metadata);

		return metadata;
	}

	return {
		fromBuffer,
		fromSrc
	}

})();
