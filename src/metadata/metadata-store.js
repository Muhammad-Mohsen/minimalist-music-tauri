var MetadataStore = (function () {

	let db;

	async function getDB() {
		db = db || await DB('metadataDB', 1)
			.objectStore('files', { keyPath: 'src' })
			.open();

		return db;
	}

	async function get(src) {
		try {
			const metadata = await (await getDB()).select('files', src);
			return metadata;

		} catch (error) {
			// not found!
		}
	}

	async function set(metadata) {
		(await getDB()).insert('files', metadata);
	}

	return {
		get,
		set
	}

})();
