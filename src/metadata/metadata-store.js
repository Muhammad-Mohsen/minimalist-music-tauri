var MetadataStore = (function () {

	let db;

	async function getDB() {
		db = db || await DB2('metadataDB', 1)
			.objectStore('files', { keyPath: 'src' })
			.open();

		return db;
	}

	async function get(src) {
		db = await getDB();

		try {
			const metadata = await db.select('files', src);
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
