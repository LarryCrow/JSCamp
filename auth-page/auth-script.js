import { logIn } from '../services/cars-service-xhr.js';

async function signIn() {
    event.preventDefault();
    const form = document.querySelector('.auth-form');
    const formData = new FormData(form);

    try {
        const res = await logIn(formData);
        if (res.token) {
            window.localStorage.setItem('token', res.token);
            history.back();
            document.location.href = '../table-page/table.html';
        }
    } catch (ex) {
        showErrorModal(ex);
    }
}

function initEventListeners() {
    const btnSignIn = document.querySelector('.sign-in');
    btnSignIn.addEventListener('click', signIn);
}

initEventListeners();