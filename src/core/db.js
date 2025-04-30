function DB(name, version) {

	let storeIndex = 0;
	const stores = [];

	function objectStore(name, options) {
		stores.push({ name, options });
		storeIndex++;

		return this;
	}

	function withIndex(indexName, propName, options) {
		stores[storeIndex].indices
			? stores[storeIndex].indices.push({ indexName, propName, options })
			: stores[storeIndex].indices = [{ indexName, propName, options }];

		return this;
	}

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

		db.update = (store, obj) => {}

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
