export * from './utilities.js';

const axios = require('axios');

/**
 * Helping function to create params string for GET query.
 * 
 * @param {Object} params Object is used for construction URL params.
 * @return {URLSearchParams} An instance of URLSearchParams with ready URL params.
 */
export function createURLParams(params) {
  const urlParams = new URLSearchParams();
  for (let p in params) {
    if (params.hasOwnProperty(p) && (params[p] || params[p] === 0) && params[p] !== '') {
      urlParams.append(p, params[p]);
    }
  }
  return urlParams;
}


/**
 * Check string using regex and prevent XSS attacks.
 * 
 * @param {string} str - String for checking.
 * @return {string} String withous <script> tags.
 */
export function preventXSS(str) {
  var text = document.createTextNode(str);
  var p = document.createElement('p');
  p.appendChild(text);
  return p.innerHTML;
}


/**
 * Wrapper-function for making axios request.
 * 
 * @property {Object} param0
 * @property {string} param0.method - Request method.
 * @property {string} param0.url - Address for request.
 * @property {object} param0.body - Object with data which we want to send to the server.
 * @property {function} param0.callback - Function which should be called after 503 error.
 * @returns {Object} Returns object with data depending on were called a function
 */
export function doAxiosRequest({ method, url, body, callback }) {
  const options = {
    'method': method,
    'url': url,
    'headers': {
      'Content-type': 'application/json',
      'Authorization': `Bearer${getToken()}`
    }
  }
  if (body) {
    options['data'] = body;
  }
  return axios(options)
    .then((response) => {
      return response.data;
    })
    .catch((e) => {
      if (e.response.status === 503) {
        return callback();
      } else if (e.response.status === 401) {
        throw new Error('Unauthorized');
      }
      throw new Error(e.message);
    });
}


/**
 * Gets token from localStorage.
 * 
 * @returns {string} token user's token
 */
export function getToken() {
  const token = window.localStorage.getItem('token');
  return token;
}
