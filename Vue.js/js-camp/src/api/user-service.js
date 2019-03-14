const axios = require('axios');
const baseURL = 'https://backend-jscamp.saritasa-hosting.com';


/**
 * Sends user's data at the server and return object with token
 * @param {Object} obj Object of the form {email, pass}
 * @returns {Object} Object of the form {token}
 */
export async function logIn(obj) {
	const url = new URL(`/api/auth`, baseURL);

	return axios.post(url, obj)
    .then((response) => {
      return response.data;
    })
    .catch((e) => {
      if (e.response.status === 503) {
        return logIn(obj);
      }
      throw new Error(e.message);
    });
}
