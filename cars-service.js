export * from './cars-service.js';

const URL = 'https://backend-jscamp.saritasa-hosting.com';

/**
 * Get all cars from server with defining page and keyword.
 *
 * @param {string} pageNumber Number of a needed page.
 * @param {string} keyword Filter for query on server.
 * @returns {Promise} Returns object { results: [], pagination: {}} with found cars and info about their amount,
 *                    also total pages for displaying.
 */
export function getAllCars({pageNumber, keyword, sortField, orderType}) {
  const queryObject = {
    'page': pageNumber,
    'keyword': keyword,
    'order_by': sortField,
    'sort_order': orderType
  }
  const page = createURL(queryObject);
  return new Promise((res, rej) => {
    const xhr = new XMLHttpRequest();

    xhr.onload = xhr.onerror = function() {
      if (this.status === 200) {
        res(this.response);
      } else {
        rej(this.status);
      }
    };

    xhr.open('GET', `${URL}/api/cars${page === '' ? '' : `?${page}`}`, true);
    xhr.send();
  });
}

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
export function saveCar(formData) {
  return new Promise((res, rej) => {
    const xhr = new XMLHttpRequest();

    const object = {};
    formData.forEach( (value, key) => {
        if (key !== 'description') {
          object[key] = parseInt(value);
        } else {
          object[key] = value;
        }
    });
    const json = JSON.stringify(object);

    xhr.onload = xhr.onerror = function() {
      if (this.status === 200) {
        res(this.response);
      } else {
        rej(this.status);
      }
    };

    xhr.open('POST', `${URL}/api/cars`, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(formData);
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
          object[key] = value;
        }
    });
    const json = JSON.stringify(object);

    xhr.onload = xhr.onerror = function() {
      if (this.status === 200) {
        res(this.response);
      } else {
        rej(this.status);
      }
    };

    xhr.open('PUT', `${URL}/api/cars/${id}`, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(json);
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
        rej(this.status);
      }
    }

    xhr.open('GET', `${URL}/api/cars/${car_id}`, true);
    xhr.send();
  });
}

export function getMakes() {
  return new Promise((res, rej) => {
    const xhr = new XMLHttpRequest();

    xhr.onload = xhr.onerror = function() {
      if (this.status === 200) {
        res(this.response);
      } else {
        rej(this.status);
      }
    }

    xhr.open('GET', `${URL}/api/dictionaries/makes`, true);
    xhr.send();
  });
}

export function getMakeModels(makes_id){
  return new Promise((res, rej) => {
    const xhr = new XMLHttpRequest();

    xhr.onload = xhr.onerror = function() {
      if (this.status === 200) {
        res(this.response);
      } else {
        rej(this.status);
      }
    }

    xhr.open('GET', `${URL}/api/dictionaries/makes/${makes_id}/models`, true);
    xhr.send();
  });
}

export function getBodyTypes() {
  return new Promise((res, rej) => {
    const xhr = new XMLHttpRequest();

    xhr.onload = xhr.onerror = function() {
      if (this.status === 200) {
        res(this.response);
      } else {
        rej(this.status);
      }
    }

    xhr.open('GET', `${URL}/api/dictionaries/body-types`, true);
    xhr.send();
  });
}
