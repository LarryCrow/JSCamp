/**
 * @typedef {Object} Car
 * @property {string} formData.make_id - Car makers id.
 * @property {stirng} formData.car_model_id - Car models id.
 * @property {string} formData.body_type_id - Body type id.
 * @property {string} formData.year - Productions car year.
 * @property {string} formData.mileage - Car mileage
 * @property {string} formData.description - Car description
 * @property {string} formData.created_at - Date when car was added in database
 * @property {string} formData.updated_at - Date when car was updated in database
 */

export * from './cars-service.js';
import { preventXSS, createURLParams, doAxiosRequest } from '../utils/utilities.js';

const baseURL = 'https://backend-jscamp.saritasa-hosting.com';

/**
 * Get cars from server by params.
 *
 * @param {Object} params Parameters for GET query: { page, keyword, order_by, sort_order }
 * @param {string} params.page - Number of needed page
 * @param {string} params.keyword - phrase for filter
 * @param {string} params.order_by - Field name which will be used to sort
 * @param {string} params.sort_order - 'asc' or 'desc' for ascending or descending sorting
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
 * @param {Car} formData - Car object to send at the server.
 * @returns {Object} Return object with saved car.
 */
export function addCar(formData) {
  const url = new URL('/api/with-auth/cars', baseURL);

  const body = {}
  for (let prop in formData) {
    if (prop !== 'description') {
      body[prop] = parseInt(formData[prop]);
    } else {
      body[prop] = preventXSS(formData[prop]);
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
 * @param {Car} form - Car object to send at the server.
 * @param {string} id - Car's id.
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
 * @param {String} id - Car's id.
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
 * @param {string} id - Car's id.
 * @return {Object} Return car object.
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
 * @returns {Object} Object of the form {results: []}.
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
 * @param {String} makes_id Make's id for getting data.
 * @returns {Object} Object of the form {results: []}.
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
 * @returns {Object} Object of the form {results: []}.
 */
export function getBodyTypes() {
  const url = new URL(`/api/dictionaries/body-types`, baseURL);
  return doAxiosRequest({
    'method': 'GET',
    'url': url,
    'callback': () => getBodyTypes()
  });
}
