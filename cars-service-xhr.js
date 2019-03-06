export * from './cars-service-xhr.js';
import { checkXSS } from './utilities.js';

const URL = 'https://backend-jscamp.saritasa-hosting.com';

/**
 * Get all cars from server with defining page and keyword.
 *
 * @param {Object} params Parameters for GET query: { page, keyword, order_by, sort_order }
 * @returns {Object} Returns object { results: [], pagination: {}} with found cars and info about their amount,
 *                    also total pages for displaying.
 */
export function getAllCars(params) {
  const urlParams = createURL(params);
  return new Promise((res, rej) => {
    const xhr = new XMLHttpRequest();

    xhr.onload = xhr.onerror = function() {
      if (this.status === 200) {
        res(this.response);
      } else {
        rej(this.status);
      }
    };

    xhr.open('GET', `${URL}/api/cars${urlParams === '' ? '' : `?${urlParams}`}`, true);
    xhr.send();
  })
  .then( response => {
    return JSON.parse(response);
  })
  .catch( error => {
    if (error === 503) {
      return getAllCars({pageNumber, keyword, sortField, orderType})
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
function createURL(params) {
  let str = [];
  for (let p in params)
    if (params.hasOwnProperty(p) && params[p] && params[p] !== '') {
      str.push(encodeURIComponent(p) + "=" + encodeURIComponent(params[p]));
    }
  return str.join("&");
}

/**
 * Add car.
 *
 * @param {Form} form Form with data for saving.
 * @returns {Promise} Return object with saved car.
 */
export function addCar(formData) {
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

    xhr.open('POST', `${URL}/api/cars`, true);
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

    xhr.open('PUT', `${URL}/api/cars/${id}`, true);
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
  return new Promise((res, rej) => {
    const xhr = new XMLHttpRequest();

    xhr.onload = xhr.onerror = function() {
      if (this.status === 204) {
        res(this.response);
      } else {
        rej(this.status);
      }
    };

    xhr.open('DELETE', `${URL}/api/cars/${id}`, true);
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
 * @param {string} car_id Car's ID
 * @return {Promise} Return something lol
 */
export function getCar(car_id) {
  return new Promise((res, rej) => {
    const xhr = new XMLHttpRequest();

    xhr.onload = xhr.onerror = function() {
      if (this.status === 200) {
        res(this.response);
      } else {
        rej(this);
      }
    }

    xhr.open('GET', `${URL}/api/cars/${car_id}`, true);
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
  return new Promise((res, rej) => {
    const xhr = new XMLHttpRequest();

    xhr.onload = xhr.onerror = function() {
      if (this.status === 200) {
        res(this.response);
      } else {
        rej(this);
      }
    }

    xhr.open('GET', `${URL}/api/dictionaries/makes`, true);
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
  return new Promise((res, rej) => {
    const xhr = new XMLHttpRequest();

    xhr.onload = xhr.onerror = function() {
      if (this.status === 200) {
        res(this.response);
      } else {
        rej(this);
      }
    }

    xhr.open('GET', `${URL}/api/dictionaries/makes/${makes_id}/models`, true);
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
  return new Promise((res, rej) => {
    const xhr = new XMLHttpRequest();

    xhr.onload = xhr.onerror = function() {
      if (this.status === 200) {
        res(this.response);
      } else {
        rej(this);
      }
    }

    xhr.open('GET', `${URL}/api/dictionaries/body-types`, true);
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
