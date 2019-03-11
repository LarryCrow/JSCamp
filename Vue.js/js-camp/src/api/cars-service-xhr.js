export * from './cars-service-xhr.js';
import { preventXSS, createURLParams, doXhrRequest } from '../utils/utilities.js';

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
  const url = new URL(`/api/cars?${urlParams}`, baseURL);
  return new Promise((res, rej) => doXhrRequest('GET', url, 200, res, rej))
    .then(response => {
      return JSON.parse(response);
    })
    .catch(error => {
      if (error.status === 503) {
        return getCars(params)
      }
      throw new Error('Page doesn\'t exist.');
    });
}


/**
 * Add car with data from form.
 *
 * @param {Form} form Form with data for saving.
 * @returns {Object} Return object with saved car.
 */
export function addCar(formData) {
  const url = new URL('/api/cars', baseURL);

  const object = {};
    formData.forEach((value, key) => {
      if (key !== 'description') {
        object[key] = parseInt(value);
      } else {
        object[key] = preventXSS(value);
      }
    });
    const json = JSON.stringify(object);

  return new Promise((res, rej) => doXhrRequest('POST', url, 200, res, rej, json))
    .then(response => {
      return JSON.parse(response);
    })
    .catch(error => {
      if (error.status === 503) {
        return addCar(formData)
      }
      throw new Error('Page doesn\'t exist.');
    });
}


/**
 * Edit car.
 *
 * @param {FormData} form Data from form.
 * @returns {Object} Return object with edited car.
 */
export function editCar(formData, id) {
  const url = new URL(`/api/cars/${id}`, baseURL);

  const object = {};
  formData.forEach((value, key) => {
    if (key !== 'description') {
      object[key] = parseInt(value);
    } else {
      object[key] = preventXSS(value);
    }
  });
  const json = JSON.stringify(object);
  
  return new Promise((res, rej) => doXhrRequest('PUT', url, 200, res, rej, json))
    .then(response => {
      return JSON.parse(response);
    })
    .catch(error => {
      if (error.status === 503) {
        return editCar(formData, id);
      } else
      throw new Error('Some error');

    });
}


/**
 * Delete car with the specified number
 * 
 * @param {String} id 
 */
export function deleteCar(id) {
  const url = new URL(`/api/cars/${id}`, baseURL);
  return new Promise((res, rej) => doXhrRequest('DELETE', url, 204, res, rej))
    .then(response => {
      return 'Successful';
    })
    .catch(error => {
      if (error.status === 503) {
        return deleteCar(id)
      } else
      throw new Error('Some error');
    });
}


/**
 * Get car by id
 * 
 * @param {string} id Car's ID
 * @return {Promise} Return something lol
 */
export function getCar(id) {
  const url = new URL(`/api/cars/${id}`, baseURL);
  return new Promise((res, rej) => doXhrRequest('GET', url, 200, res, rej))
    .then(response => {
      return JSON.parse(response);
    })
    .catch(error => {
      if (error.status === 503) {
        return getCar(id);
      }
      throw new Error('Some error');
    });
}


/**
 * Get makes
 */
export function getMakes() {
  const url = new URL(`/api/dictionaries/makes`, baseURL);
  return new Promise((res, rej) => doXhrRequest('GET', url, 200, res, rej))
    .then(response => {
      return JSON.parse(response);
    })
    .catch(error => {
      if (error.status === 503) {
        return getMakes();
      }
      throw new Error('Some error');
    });
}

/**
 * Get maker models
 * 
 * @param {String} makes_id Make's id for getting data
 */
export function getMakerModels(makes_id) {
  const url = new URL(`/api/dictionaries/makes/${makes_id}/models`, baseURL);
  return new Promise((res, rej) => doXhrRequest('GET', url, 200, res, rej))
    .then(response => {
      return JSON.parse(response);
    })
    .catch(error => {
      if (error.status === 503) {
        return getMakerModels(makes_id);
      }
      throw new Error('Some error ?');
    });
}


/**
 * Get body types
 */
export function getBodyTypes() {
  const url = new URL(`/api/dictionaries/body-types`, baseURL);
  return new Promise((res, rej) => doXhrRequest('GET', url, 200, res, rej))
    .then(response => {
      return JSON.parse(response);
    })
    .catch(error => {
      if (error.status === 503) {
        return getBodyTypes();
      }
      throw new Error('Some error');
    });
}
