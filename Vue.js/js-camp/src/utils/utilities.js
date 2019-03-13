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
 * Do request with specified params
 * 
 * @param {String} reqMethod 
 * @param {String} url 
 * @param {Number} successfulStatus 
 * @param {Function} resolve 
 * @param {Function} reject 
 * @param {Object} json
 */
export function doXhrRequest(reqMethod, url, successfulStatus, resolve, reject, json) {
  const xhr = new XMLHttpRequest();

  xhr.onload = xhr.onerror = function () {
    if (xhr.status === successfulStatus) {
      resolve(xhr.response);
    } else {
      reject(xhr);
    }
  };

  xhr.open(reqMethod, url);
  if (reqMethod === 'POST' || reqMethod === 'PUT') {
    xhr.setRequestHeader("Content-Type", "application/json");
  }
  xhr.send(json);
}

/**
 * An auxiliary function that connects a CSS file for a modal window that calls it
 * 
 * @param {String} file Path to file
 */
function includeCSS(file){
  const style = document.createElement('link');
  style.href = file;
  style.rel = 'stylesheet';
  document.head.appendChild(style);

  return style;
}

export function doAxiosRequest({method, url, json}) {
  const options = {
    'method': method,
    'url': url,
		'headers': {
      'Content-type': 'application/json',
      'Authorization': `Bearer${getToken()}`
    }
  }
  if (json) {
    options['data'] = json;
  }
  return axios(options);
}

export function getToken() {
  const token = window.localStorage.getItem('token');
  return token;
}
