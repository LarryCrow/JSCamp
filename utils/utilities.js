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

  const styleBlock = document.createElement('style');
  styleBlock.innerText = `
    @keyframes show{
      0%{
        opacity: 0;
      }
      
      100% {
        opacity: 1;
      }
    }

    @keyframes close{
      0%{
        opacity: 1;
      }
      100%{
        opacity: 0;
      }
    }

    .notif-block {
      width: 12%;
      min-width: 200px;
      background: rgb(130, 84, 255);
      height: 300px;
      display:flex; 
      flex-direction: column; 
      justify-content: space-around; 
      position: fixed; 
      bottom: 5vh; 
      right: 2vw;
      opacity:0; 
      transition: 1s; 
      animation: show 1s 1; 
      animation-fill-mode: forwards;                           
    }

    .notif-block-closed {
      animation: close 1s 1;
      animation-fill-mode: forwards;
      transition: 1s;
      opacity: 1;
    }

    .notif-message {
      padding: 1em;
      color: white;
    }

    .notif-btn-close {
      width: 35%;
      background: inherit;
      border: 1.5px solid white;
      padding: 0.25em 0.75em;
      min-width: 100px;
      cursor: pointer;
      align-self: center;
      outline: 0px;
      color: white;
    }
  `;

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
    setTimeout(() => document.body.removeChild(notificationBlock), 1000);
  }, 5000);

  button.addEventListener('click', (event) => {
    if (closeTimer) {
      clearTimeout(closeTimer);
    }
    notificationBlock.classList.add('notif-block-closed');
    setTimeout(() => document.body.removeChild(notificationBlock), 1000);
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

/**
 * Get param from cookie by name
 * 
 * @param {String} name Name of param which value we need
 */
export function getCookie(name) {
  const matches = document.cookie.match(new RegExp(
    "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
  ));
  return matches ? decodeURIComponent(matches[1]) : undefined;
}