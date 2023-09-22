// TODO
// https://www.npmjs.com/package/jsmediatags (NO chapter support)
// https://www.npmjs.com/package/node-id3 (supports chapters -- IDv3-only)

// actually
// https://github.com/Borewit/music-metadata-browser (supports chapters!)

import * as musicMetadata from 'music-metadata-browser';


export const Metadata = (() => {

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
