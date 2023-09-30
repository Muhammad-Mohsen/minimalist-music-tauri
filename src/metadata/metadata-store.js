
var MetadataStore;
(async function () {

	const db = await DB2('metadataDB', 1)
		.objectStore('files', { keyPath: 'path' })
		.open();

	async function get(path) {
		try {
			const metadata = await db.select('files', path);
			return metadata;

		} catch (error) {
			// not found!
		}
	}

	async function set(metadata) {
		db.insert('files', metadata);
	}

	return {
		get,
		set
	}

})().then(store => MetadataStore = store);
