var MetadataStore = (function () {

	let db;

	async function getDB() {
		db = db || await DB2('metadataDB', 1)
			.objectStore('files', { keyPath: 'path' })
			.open();

		return db;
	}

	async function get(path) {
		db = await getDB();

		try {
			const metadata = await db.select('files', path);
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
