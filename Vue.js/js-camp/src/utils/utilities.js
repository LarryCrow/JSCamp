export * from './utilities.js';

const axios = require('axios');

/**
 * Helping function to create params string for GET query
 * 
 * @param {Object} params Object is used for construction
 * @return {URLSearchParams} Object with ready url params 
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
 * Check string using regex and prevent XSS attacks
 * 
 * @param {String} str String for checking 
 * @return {String} String withous <script> tags
 */
export function preventXSS(str) {
  var text = document.createTextNode(str);
  var p = document.createElement('p');
  p.appendChild(text);
  return p.innerHTML;
}


/**
 * 
 * @param {Object} param0 Object of the form {method: '', url: '', body: {}}
 */
export function doAxiosRequest({method, url, body}) {
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
  return axios(options);
}

/**
 * Gets token from localStorage
 * @returns {String} token User's token
 */
export function getToken() {
  const token = window.localStorage.getItem('token');
  return token;
}
