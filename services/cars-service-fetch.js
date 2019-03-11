export * from './cars-service-fetch.js';
import { checkXSS, createURLParams, getToken, doFetchRequest } from '../utils/utilities.js';

const baseURL = 'https://backend-jscamp.saritasa-hosting.com';
const token = getToken();

/**
 * Get cars from server by params.
 *
 * @param {Object} params Parameters for GET query: { page, keyword, order_by, sort_order }
 * @returns {Object} Returns object { results: [], pagination: {}} with found cars and info about their amount,
 *                   also total pages for displaying.
 */
export async function getCars(params) {
	const urlParams = createURLParams(params);
	const url = new URL(`/api/cars?${urlParams}`, baseURL);
	try {
		const response = await doFetchRequest({ reqMethod: 'GET', url: url })
		return response.json();
	} catch (error) {
		if (error.status === 503) {
			getCars(params);
		} else {
			throw new Error('Can\'t load page');
		}
	}
}

/**
 * Add car with data from form.
 *
 * @param {Form} form Form with data for saving.
 * @returns {Object} Return object with saved car.
 */
export async function addCar(formData) {
	const url = new URL('/api/cars', baseURL);

	const object = {};
	formData.forEach((value, key) => {
		if (key !== 'description') {
			object[key] = parseInt(value);
		} else {
			object[key] = checkXSS(value);
		}
	});
	const json = JSON.stringify(object);

	try {
		const response = await doFetchRequest({ reqMethod: 'POST', url: url, json: json })
		return response.json();
	} catch (error) {
		if (error.status === 503) {
			addCar(formData);
		} else {
			throw new Error('Can\'t load page');
		}
	}
}

/**
 * Edit car.
 *
 * @param {FormData} form Data from form.
 * @returns {Object} Return object with edited car.
 */
export async function editCar(formData, id) {
	const url = new URL(`/api/cars/${id}`, baseURL);

	const object = {};
	formData.forEach((value, key) => {
		if (key !== 'description') {
			object[key] = parseInt(value);
		} else {
			object[key] = checkXSS(value);
		}
	});
	const json = JSON.stringify(object);

	try {
		const response = await doFetchRequest({ reqMethod: 'PUT', url: url, json: json })
		return response.json();
	} catch (error) {
		if (error.status === 503) {
			editCar(formData, id);
		} else {
			throw new Error('Can\'t load page');
		}
	}
}

/**
 * Delete car with the specified number
 * 
 * @param {String} id 
 */
export async function deleteCar(id) {
	const url = new URL(`/api/cars/${id}`, baseURL);
	try {
		await doFetchRequest({ reqMethod: 'DELETE', url: url });
		return '';
	} catch (error) {
		if (error.status === 503) {
			deleteCar(id);
		} else {
			throw new Error('Can\'t load page');
		}
	}
}

/**
 * Get car by id
 * 
 * @param {string} id Car's ID
 * @return {Promise} Return something lol
 */
export async function getCar(id) {
	const url = new URL(`/api/cars/${id}`, baseURL);
	try {
		const response = await doFetchRequest({ reqMethod: 'GET', url: url })
		return response.json();
	} catch (error) {
		if (error.status === 503) {
			getCar(id);
		} else {
			throw new Error('Can\'t load page');
		}
	}
}


/**
 * Get makes
 */
export async function getMakes() {
	const url = new URL(`/api/dictionaries/makes`, baseURL);
	try {
		const response = await doFetchRequest({ reqMethod: 'GET', url: url })
		return response.json();
	} catch (error) {
		if (error.status === 503) {
			getMakes();
		} else {
			throw new Error('Can\'t load page');
		}
	}
}

/**
 * Get maker models
 * 
 * @param {String} makes_id Make's id for getting data
 */
export async function getMakerModels(makes_id) {
	const url = new URL(`/api/dictionaries/makes/${makes_id}/models`, baseURL);
	try {
		const response = await doFetchRequest({ reqMethod: 'GET', url: url })
		return response.json();
	} catch (error) {
		if (error.status === 503) {
			getMakerModels(makes_id);
		} else {
			throw new Error('Can\'t load page');
		}
	}
}


/**
 * Get body types
 */
export async function getBodyTypes() {
	const url = new URL(`/api/dictionaries/body-types`, baseURL);
	try {
		const response = await doFetchRequest({ reqMethod: 'GET', url: url })
		return response.json();
	} catch (error) {
		if (error.status === 503) {
			getBodyTypes();
		} else {
			throw new Error('Can\'t load page');
		}
	}
}

export async function logIn(formData) {
	const url = new URL(`/api/auth`, baseURL);

	const object = {};
	formData.forEach((value, key) => {
		object[key] = value;
	});
	const json = JSON.stringify(object);

	try {
		const response = await doFetchRequest({ reqMethod: 'POST', url: url, json: json })
		return response.json();
	} catch (error) {
		if (error.status === 503) {
			logIn(formData);
		} else {
			throw new Error('Can\'t load page');
		}
	}
}
