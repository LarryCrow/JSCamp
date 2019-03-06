export * from './cars-service-xhr.js';
import { checkXSS } from './utilities.js';

const baseURL = 'https://backend-jscamp.saritasa-hosting.com';

/**
 * Get all cars from server with needed page and keyword.
 *
 * @param {Object} params Parameters for GET query: { page, keyword, order_by, sort_order }
 * @returns {Object} Returns object { results: [], pagination: {}} with found cars and info about their amount,
 *                    also total pages for displaying.
 */
export function getAllCars(params) {
  const url = new URL(`/api/cars?${createURLParams(params)}`, baseURL);
  return new Promise((res, rej) => {
    const xhr = new XMLHttpRequest();

    xhr.onload = xhr.onerror = function() {
      if (this.status === 200) {
        res(this.response);
      } else {
        rej(this.status);
      }
    };

    xhr.open('GET', url, true);
    xhr.send();
  })
  .then( response => {
    return JSON.parse(response);
  })
  .catch( error => {
    if (error === 503) {
      return getAllCars(params)
    } else {
      throw new Error('Page doesn\'t exist.');
    }
  });
}

/**
 * Helping function to create params string for GET query
 * @param {Object} params Object is used for construction
 * @return {String} string view ' ' or '?a=parA' or '?a=parA&b=parB....'
 */
function createURLParams(params) {
  const urlParams = new URLSearchParams();
  for (let p in params) {
    if (params.hasOwnProperty(p) && params[p] && params[p] !== '') {
      urlParams.append(p, params[p]);
    }
  }
  return urlParams;
}

/**
 * Add car.
 *
 * @param {Form} form Form with data for saving.
 * @returns {Promise} Return object with saved car.
 */
export function addCar(formData) {
  const url = new URL('/api/cars', baseURL);
  return new Promise((res, rej) => {
    const xhr = new XMLHttpRequest();

    const object = {};
    formData.forEach( (value, key) => {
        if (key !== 'description') {
          object[key] = parseInt(value);
        } else {
          object[key] = checkXSS(value);
        }
    });
    const json = JSON.stringify(object);

    xhr.onload = xhr.onerror = function() {
      if (this.status === 200) {
        res(this.response);
      } else {
        rej(this);
      }
    };

    xhr.open('POST', url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(json);
  })
  .then( response => {
    return JSON.parse(response);
  })
  .catch( error => {
    if (error.status === 503) {
      return addCar(formData)
    } else {
      throw new Error('Page doesn\'t exist.');
    }
  });
}


/**
 * Edit car.
 *
 * @param {Form} form Form with data for saving.
 * @returns {Promise} Return object with edited car.
 */
export function editCar(formData, id) {
  const url = new URL(`/api/cars/${id}`, baseURL);
  return new Promise((res, rej) => {
    const xhr = new XMLHttpRequest();

    const object = {};
    formData.forEach( (value, key) => {
        if (key !== 'description') {
          object[key] = parseInt(value);
        } else {
          object[key] = checkXSS(value);
        }
    });
    const json = JSON.stringify(object);

    xhr.onload = xhr.onerror = function() {
      if (this.status === 200) {
        res(this.response);
      } else {
        rej(this);
      }
    };

    xhr.open('PUT', url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(json);
  })
  .then( response => {
    return JSON.parse(response);
  })
  .catch( error => {
    if (error.status === 503) {
      return editCar(formData, id);
    } else {
      throw new Error('Some error');
    }
  });
}

export function deleteCar(id) {
  const url = new URL(`/api/cars/${id}`, baseURL);
  return new Promise((res, rej) => {
    const xhr = new XMLHttpRequest();

    xhr.onload = xhr.onerror = function() {
      if (this.status === 204) {
        res(this.response);
      } else {
        rej(this.status);
      }
    };

    xhr.open('DELETE', url, true);
    xhr.send();
  })
  .then( response => {
    return 'Successful';
  })
  .catch( error => {
    if (error.status === 503) {
      return deleteCar(id)
    } else {
      throw new Error('Some error');
    }
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
  return new Promise((res, rej) => {
    const xhr = new XMLHttpRequest();

    xhr.onload = xhr.onerror = function() {
      if (this.status === 200) {
        res(this.response);
      } else {
        rej(this);
      }
    }

    xhr.open('GET', url, true);
    xhr.send();
  })
  .then( response => {
    return JSON.parse(response);
  })
  .catch( error => {
    if (error.status === 503) {
      return getCar(car_id);
    } else {
      throw new Error('Some error');
    }
  });
}

export function getMakes() {
  const url = new URL(`/api/dictionaries/makes`, baseURL);
  return new Promise((res, rej) => {
    const xhr = new XMLHttpRequest();

    xhr.onload = xhr.onerror = function() {
      if (this.status === 200) {
        res(this.response);
      } else {
        rej(this);
      }
    }

    xhr.open('GET', url, true);
    xhr.send();
  })
  .then( response => {
    return JSON.parse(response);
  })
  .catch( error => {
    if (error.status === 503) {
      return getMakes();
    } else {
      throw new Error('Some error');
    }
  });
}

export function getMakeModels(makes_id){
  const url = new URL(`/api/dictionaries/makes/${makes_id}/models`, baseURL);
  return new Promise((res, rej) => {
    const xhr = new XMLHttpRequest();

    xhr.onload = xhr.onerror = function() {
      if (this.status === 200) {
        res(this.response);
      } else {
        rej(this);
      }
    }

    xhr.open('GET', url, true);
    xhr.send();
  })
  .then( response => {
    return JSON.parse(response);
  })
  .catch( error => {
    if (error.status === 503) {
      return getMakeModels(makes_id);
    } else {
      throw new Error('Some error ?');
    }
  });
}

export function getBodyTypes() {
  const url = new URL(`/api/dictionaries/body-types`, baseURL);
  return new Promise((res, rej) => {
    const xhr = new XMLHttpRequest();

    xhr.onload = xhr.onerror = function() {
      if (this.status === 200) {
        res(this.response);
      } else {
        rej(this);
      }
    }

    xhr.open('GET', url, true);
    xhr.send();
  })
  .then( response => {
    return JSON.parse(response);
  })
  .catch( error => {
    if (error.status === 503) {
      return getBodyTypes();
    } else {
      throw new Error('Some error');
    }
  });
}
