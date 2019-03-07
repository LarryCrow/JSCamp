import {logIn} from "../services/cars-service-xhr.js";

async function signIn() {
    event.preventDefault();
    const form = document.querySelector('.auth-form');
    const formData = new FormData(form);

    try {
        const res = await logIn(formData);
        document.cookie = `token=${res.token};path=/`;
        document.location.href = "../form-page/form.html";
    } catch (ex) {
        showErrorModal(ex);
    }
}

function initEventListeners() {
    const btnSignIn = document.querySelector('.sign-in');
    btnSignIn.addEventListener('click', signIn);
}

initEventListeners();