export * from './utilities.js';


/**
 * Creating modal window with backdrop and displaying it. Deleting DOM element after closing.
 * 
 * @param {String} message Message for displaying 
 */
export function showErrorModal(message = 'An unexpected error occured, sorry') {
    const backdrop = document.createElement('article');
    const messageBlock = document.createElement('div');
    const messageText = document.createElement('p');
    const button = document.createElement('button');
    
    backdrop.style.cssText = `width: 100%; height: 100vh; position: absolute; top: 0; 
                              left: 0; background: rgba(100, 100, 100, 0.5); z-index: 5;`;
    messageBlock.style.cssText = `width: 15%;  min-width: 350px; height: 140px; border: 1px solid black; background: white;
                                  margin: 35vh auto 0 auto; display:flex; flex-direction: column; justify-content: space-around`;
    messageText.style.cssText = 'padding: 1em';
    button.style.cssText = `width: 40%; background: inherit; border: 1.5px solid palevioletred; padding: 0.25em 0.75em;
                            min-width: 100px; cursor: pointer; align-self: center; outline: 0px;`;

    messageText.innerText = message;
    button.innerText = "Ok";

    backdrop.addEventListener('click', (event) => {
        if (event.target.nodeName === 'BUTTON' || event.target.nodeName === 'ARTICLE') {
            document.body.removeChild(backdrop);
        }
    });

    messageBlock.appendChild(messageText);
    messageBlock.appendChild(button);
    backdrop.appendChild(messageBlock);
    document.body.appendChild(backdrop);
}

/**
 * Helping function to create params string for GET query
 * 
 * @param {Object} params Object is used for construction
 * @return {URLSearchParams} Object with ready url params 
 */
export function createURLParams(params) {
    const urlParams = new URLSearchParams();
    for (let p in params) {
      if (params.hasOwnProperty(p) && params[p] && params[p] !== '') {
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
export function checkXSS(str) {
    const regex = /<script>\S*<\/script>/
    const newString = str.replace(regex, "");
    return newString.replace(/\s+/g, ' ').trim()
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