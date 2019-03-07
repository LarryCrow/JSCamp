export * from './utilities.js';


/**
 * Create modal window with backdrop and display it. Delete DOM element after closing.
 * 
 * @param {String} message Message for displaying 
 */
export function showErrorModal(message = 'An unexpected error occured, sorry') {
  const backdrop = document.createElement('article');
  const messageBlock = document.createElement('div');
  const messageText = document.createElement('p');
  const button = document.createElement('button');

  backdrop.classList.add('error-backdrop');
  messageBlock.classList.add('error-message-block');
  messageText.classList.add('error-message-text');
  button.classList.add('error-button-close');

  messageText.innerText = message;
  button.innerText = "Ok";

  const styles = includeCSS('../utils/errorModal.css');

  backdrop.addEventListener('click', (event) => {
    if (event.target.nodeName === 'BUTTON' || event.target.nodeName === 'ARTICLE') {
      document.body.removeChild(backdrop);
      document.head.removeChild(styles);
    }
  });

  messageBlock.appendChild(messageText);
  messageBlock.appendChild(button);
  backdrop.appendChild(messageBlock);
  document.body.appendChild(backdrop);
}

/**
 * Create notification modal and display it with message. Delete DOM element after closing.
 * @param {String} message 
 */
export function showNotification(message = 'Notification') {
  const notificationBlock = document.createElement('div');
  const messageText = document.createElement('p');
  const button = document.createElement('button');

  notificationBlock.classList.add('notif-block');
  messageText.classList.add('notif-message');
  button.classList.add('notif-btn-close');

  const style = includeCSS('../utils/notificationModal.css');

  messageText.innerText = message;
  button.innerText = "Ok";

  notificationBlock.appendChild(messageText);
  notificationBlock.appendChild(button);
  document.head.appendChild(styleBlock);
  document.body.appendChild(notificationBlock);

  /**
   * I added setTimeout during closing because class 'notif-block-closed' use animation with duration 1 second.
   * So, I need to wait until animation will end and delete element after that.
   */
  const closeTimer = setTimeout(() => {
    notificationBlock.classList.add('notif-block-closed');
    setTimeout(() => {
      document.body.removeChild(notificationBlock)
      document.head.removeChild(style);
    }, 1000);
  }, 5000);

  button.addEventListener('click', (event) => {
    if (closeTimer) {
      clearTimeout(closeTimer);
    }
    notificationBlock.classList.add('notif-block-closed');
    setTimeout(() => {
      document.body.removeChild(notificationBlock)
      document.head.removeChild(style);
    }, 1000);
  });
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