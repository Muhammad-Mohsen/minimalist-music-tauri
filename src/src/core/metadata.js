// TODO
// https://www.npmjs.com/package/jsmediatags (NO chapter support)
// https://www.npmjs.com/package/node-id3 (supports chapters -- IDv3-only)

// actually
// https://github.com/Borewit/music-metadata-browser (supports chapters!)

const Metadata = (function () {

	const musicMetadata = require('music-metadata-browser');

	async function parse(blob, key) {
		const metadata = await musicMetadata.parseBlob(blob);
		return metadata;
	}

	return {
		parse: parse,
	}

})();
