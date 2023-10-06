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

		// sleep for 250ms to allow the track to play before hogging the file?
		await new Promise(resolve => setTimeout(resolve, 250));

		metadata = await musicMetadata.fetchFromUrl(url);
		const visualization = await Visualizer.fromSrc(url);

		// TODO chapters - doesn't work unfortunately!
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

		// resolve pending promises, and clear them
		inflight[url]?.forEach(r => r(metadata));
		delete inflight[url];

		return metadata;
	}

	return {
		fromSrc
	}

})();
