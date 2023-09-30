/**
 * A constructor for an IndexedDB database.
 *
 * @param {string} name The name of the database.
 * @param {number} version The version of the database.
 */
var DB2 = function (name, version) {

	/**
	 * The index of the current store.
	 *
	 * @private
	 */
	let storeIndex = 0;

	/**
	 * An array of store objects.
	 *
	 * @private
	 */
	const stores = [];

	/**
	 * Creates a new object store.
	 *
	 * @param {string} name The name of the object store.
	 * @param {IDBObjectStoreParameters} options The options for the object store.
	 * @returns {DB2} This instance of DB2.
	 */
	function objectStore(name, options) {
		stores.push({ name, options });
		storeIndex++;

		return this;
	}

	/**
	 * Creates a new index in the current object store.
	 *
	 * @param {string} indexName The name of the index.
	 * @param {string} propName The name of the property to index.
	 * @param {IDBIndexParameters} options The options for the index.
	 * @returns {DB2} This instance of DB2.
	 */
	function withIndex(indexName, propName, options) {
		stores[storeIndex].indices
			? stores[storeIndex].indices.push({ indexName, propName, options })
			: stores[storeIndex].indices = [{ indexName, propName, options }];

		return this;
	}

	/**
	 * Creates/Opens the database.
	 *
	 * @returns {Promise<IDBDatabase>} A promise that resolves to the database object.
	 */
	function open() {
		return new Promise((resolve, reject) => {
			const dbRequest = indexedDB.open(name, version);
			dbRequest.onerror = (event) => reject(event);
			dbRequest.onsuccess = () => resolve(augmentDB(dbRequest.result));

			dbRequest.onupgradeneeded = event => {
				const db = event.target.result;

				stores.forEach(s => {
					const store = db.createObjectStore(s.name, s.options);

					if (!s.indices?.length) return;
					s.indices.forEach(i => store.createIndex(i.name, i.prop, i.options));
				});

				resolve(augmentDB(db));
			};
		});
	}

	function augmentDB(db) {

		db.select = (store, key) => {
			return new Promise((resolve, reject) => {
				const transaction = db.transaction([store]);
				const objectStore = transaction.objectStore(store);

				const request = objectStore.get(key);
				transaction.oncomplete = (event) => resolve(request.result, event);
				transaction.onerror = (event) => reject(event);
			});
		}

		db.selectAll = (store) => {
			return new Promise((resolve, reject) => {
				const objectStore = db.transaction(store).objectStore(store);
				objectStore.getAll().onsuccess = (event) => {
					resolve(event.target.result);
				};
			});
		}

		db.insert = (store, objects) => {
			return new Promise((resolve, reject) => {
				const transaction = db.transaction([store], 'readwrite');
				const objectStore = transaction.objectStore(store);

				if (!Array.isArray(objects)) objects = [objects];
				objects.forEach(o => objectStore.add(o));
				transaction.oncomplete = (event) => resolve(event);
				transaction.onerror = (event) => reject(event);
			});
		}

		db.update = (store, obj) => {
			// clunky select then put
		}

		db.delete = (store, keys) => {
			return new Promise((resolve, reject) => {
				const transaction = db.transaction([store], 'readwrite');
				const objectStore = transaction.objectStore(store);

				if (!Array.isArray(keys)) keys = [keys];
				keys.forEach(k => objectStore.delete(k));
				transaction.oncomplete = (event) => resolve(event);
				transaction.onerror = (event) => reject(event);
			});
		}

		return db;
	}

	return {
		objectStore,
		withIndex,
		open
	}

};
