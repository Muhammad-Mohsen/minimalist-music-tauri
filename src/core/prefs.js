const Prefs = (() => {

	function write(key, val) {
		return localStorage.setItem(key, val);
	}
	function read(key) {
		return localStorage.getItem(key);
	}
	function remove(key) {
		return localStorage.removeItem(key);
	}

	return {
		write,
		read,
		remove
	}

})();
