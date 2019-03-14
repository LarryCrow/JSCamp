export * from './cars-service.js';
import { preventXSS, createURLParams, doAxiosRequest } from '../utils/utilities.js';

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

  return doAxiosRequest({
    'method': 'GET',
    'url': url,
    'callback': () => getCars(params)
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

  return doAxiosRequest({
    'method': 'POST',
    'url': url,
    'body': body,
    'callback': () => addCar(form)
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

  return doAxiosRequest({
    'method': 'PUT',
    'url': url,
    'body': body,
    'callback': () => editCar(form, id)
  });
}

/**
 * Delete car with the specified number
 * 
 * @param {String} id 
 */
export async function deleteCar(id) {
  const url = new URL(`/api/with-auth/cars/${id}`, baseURL);

  return doAxiosRequest({
    'method': 'DELETE',
    'url': url,
    'callback': () => deleteCar(id)
  });
}

/**
 * Get car by id
 * 
 * @param {string} id Car's ID
 * @return {Object} Return car object
 */
export function getCar(id) {
  const url = new URL(`/api/with-auth/cars/${id}`, baseURL);
  return doAxiosRequest({
    'method': 'GET',
    'url': url,
    'callback': () => getCar(id)
  });
}

/**
 * Get makes
 */
export function getMakes() {
  const url = new URL(`/api/dictionaries/makes`, baseURL);
  return doAxiosRequest({
    'method': 'GET',
    'url': url,
    'callback': () => getMakes()
  })
}

/**
 * Get maker models
 * 
 * @param {String} makes_id Make's id for getting data
 */
export function getMakerModels(makes_id) {
  const url = new URL(`/api/dictionaries/makes/${makes_id}/models`, baseURL);
  return doAxiosRequest({
    'method': 'GET',
    'url': url,
    'callback': () => getMakerModels(makes_id)
  });
}


/**
 * Get body types
 */
export function getBodyTypes() {
  const url = new URL(`/api/dictionaries/body-types`, baseURL);
  return doAxiosRequest({
    'method': 'GET',
    'url': url,
    'callback': () => getBodyTypes()
  });
}
