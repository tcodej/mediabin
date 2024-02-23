export const apiURL = import.meta.env.VITE_API_URL;

const getResult = async (endpoint, postData) => {
	let data = {
		method: 'GET'
	};

	if (postData) {
		let formData = new FormData();
		data.method = 'POST';

		for (const [key, value] of Object.entries(postData)) {
			formData.append(key, value);
		}

		data.body = formData;
	}

	try {
		const response = await fetch(`${apiURL}${endpoint}`, data);
		const result = await response.json();
		result.ok = response.ok;
		return result;

	} catch(err) {
		console.log(err);
		return {
			ok: false,
			error: 'Server exception'
		}
	}
}

export const getMedia = async () => {
	return getResult(`feed/media`);
};

export const getRelease = async (id) => {
	return getResult(`feed/release?id=${id}`);
};

export const getDiscogsRelease = async (release_id) => {
	return getResult(`discogs/releases/${release_id}`);
};

export const importDiscogsRelease = async (release_id) => {
	return getResult(`discogs/import/${release_id}`);
};

export const getCollections = async () => {
	return getResult(`feed/collections`);
};

export const getCollection = async (collection_id) => {
	return getResult(`feed/collection/${collection_id}`);
};

export const clearCache = async () => {
	return getResult('clearcache');
};
