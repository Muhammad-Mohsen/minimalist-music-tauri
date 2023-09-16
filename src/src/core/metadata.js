// TODO
// https://www.npmjs.com/package/jsmediatags (NO chapter support)
// https://www.npmjs.com/package/node-id3 (supports chapters -- IDv3-only)

// actually
// https://github.com/Borewit/music-metadata-browser (supports chapters!)

// import * as musicMetadata from "../../../node_modules/music-metadata-browser/lib/index.js";
import * as musicMetadata from 'music-metadata-browser';


const Metadata = (() => {

	async function parse(buffer) {

		const metadata = await musicMetadata.parseBuffer(buffer);
		return metadata;
	}

	return {
		parse: parse,
	}

})();

window.Metadata = Metadata;