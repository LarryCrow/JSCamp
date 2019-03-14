const baseURL = 'https://backend-jscamp.saritasa-hosting.com';
import { doAxiosRequest } from '../utils/utilities.js';


/**
 * Sends user's data at the server and return object with token
 * @param {Object} obj Object of the form {email, pass}
 * @returns {Object} Object of the form {token}
 */
export async function logIn(obj) {
	const url = new URL(`/api/auth`, baseURL);

	return doAxiosRequest({
    'method': 'POST',
    'url': url,
    'callback': () => logIn(obj)
  });
}
