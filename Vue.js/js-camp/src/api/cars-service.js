export * from './cars-service.js';
import { preventXSS, createURLParams, doAxiosRequest } from '../utils/utilities.js';

const axios = require('axios');
const baseURL = 'https://backend-jscamp.saritasa-hosting.com';

/**
 * Get cars from server by params.
 *
 * @param {Object} params Parameters for GET query: { page, keyword, order_by, sort_order }
 * @returns {Object} Returns object { results: [], pagination: {}} with found cars and info about their amount,
 *                   also total pages for displaying.
 */
export function getCars(params) {
  const urlParams = createURLParams(params);
  const url = new URL(`/api/with-auth/cars?${urlParams}`, baseURL);

  return doAxiosRequest({'method': 'GET', 'url': url})
    .then((response) => {
      return response.data;
    })
    .catch((e) => {
      if (e.response.status === 503) {
        return getCars(params);
      }
      throw new Error(e.message);
    });
}

/**
 * Add car with data from form.
 *
 * @param {Form} form Form with data for saving.
 * @returns {Object} Return object with saved car.
 */
export function addCar(form) {
  const url = new URL('/api/with-auth/cars', baseURL);

  const body = {}
  for (let prop in form) {
    if (prop !== 'description') {
      body[prop] = parseInt(form[prop]);
    } else {
      body[prop] = preventXSS(form[prop]);
    }
  }

  return doAxiosRequest({'method': 'POST', 'url': url, 'json': body})
    .then((response) => {
      return response.data;
    })
    .catch((e) => {
      if (e.response.status === 503) {
        return addCar(form);
      }
      new Error(e.message);
    });
}

/**
 * Edit car.
 *
 * @param {FormData} form Data from form.
 * @returns {Object} Return object with edited car.
 */
export function editCar(form, id) {
  const url = new URL(`/api/with-auth/cars/${id}`, baseURL);

  const body = {}
  for (let prop in form) {
    if (prop !== 'description') {
      body[prop] = parseInt(form[prop]);
    } else {
      body[prop] = preventXSS(form[prop]);
    }
  }

  return doAxiosRequest({'method': 'PUT', 'url': url, 'json': body})
    .then((response) => {
      return response.data;
    })
    .catch((e) => {
      if (e.response.status === 503) {
        return editCar(form, id);
      }
      throw new Error(e.message);
    });
}

/**
 * Delete car with the specified number
 * 
 * @param {String} id 
 */
export async function deleteCar(id) {
  const url = new URL(`/api/with-auth/cars/${id}`, baseURL);
  try {
    await doAxiosRequest({'method': 'DELETE', 'url': url})
    return true;
  } catch (ex) {
    if (ex.response.status === 503) {
      return deleteCar(id);
    }
    throw new Error(ex);
  }
}

/**
 * Get car by id
 * 
 * @param {string} id Car's ID
 * @return {Object} Return car object
 */
export function getCar(id) {
  const url = new URL(`/api/with-auth/cars/${id}`, baseURL);
  return doAxiosRequest({'method': 'GET', 'url': url})
    .then((response) => {
      return response.data;
    })
    .catch((e) => {
      if (e.response.status === 503) {
        return getCar(id);
      }
      throw new Error(e.message);
    });
}

/**
 * Get makes
 */
export function getMakes() {
  const url = new URL(`/api/dictionaries/makes`, baseURL);
  return axios.get(url)
    .then((response) => {
      return response.data;
    })
    .catch((e) => {
      if (e.response.status === 503) {
        return getMakes();
      }
      throw new Error(e.message);
    });
}

/**
 * Get maker models
 * 
 * @param {String} makes_id Make's id for getting data
 */
export function getMakerModels(makes_id) {
  const url = new URL(`/api/dictionaries/makes/${makes_id}/models`, baseURL);
  return axios.get(url)
    .then((response) => {
      return response.data;
    })
    .catch((e) => {
      if (e.response.status === 503) {
        return getMakerModels(makes_id);
      }
      throw new Error(e.message);
    });
}


/**
 * Get body types
 */
export function getBodyTypes() {
  const url = new URL(`/api/dictionaries/body-types`, baseURL);
  return axios.get(url)
    .then((response) => {
      return response.data;
    })
    .catch((e) => {
      if (e.response.status === 503) {
        return getBodyTypes();
      }
      throw new Error(e.message);
    });
}
