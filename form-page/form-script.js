import { getCar, editCar, getMakerModels, getMakes, getBodyTypes, addCar } from "../services/cars-service-xhr.js";
import { showErrorModal, showNotification, checkXSS } from "../utils/utilities.js";

let CAR_ID;


/**
 * Get car which was selected in the table
 */
async function getSelectedCar() {
  const url = new URL(document.URL);
  const params = url.searchParams;
  CAR_ID = params.get('car');
  if (CAR_ID !== null) {
    try {
      const car = await getCar(CAR_ID);
      await getModels(car.make_id);
      const form = document.querySelector('.form');
      form.elements['make_id'].value = car.make_id;
      form.elements['car_model_id'].value = car.car_model_id;
      form.elements['body_type_id'].value = car.body_type_id;
      form.elements['year'].value = car.year;
      form.elements['mileage'].value = car.mileage;
      form.elements['description'].value = checkXSS(car.description);
    } catch (ex) {
      showErrorModal(ex);
    }
  }
}

/**
 * 
 * @param {Mouse event} event Event recieved by clicking on save button
 */
async function saveCar(event) {
  event.preventDefault();
  const form = document.querySelector('.form');
  const formData = new FormData(form);
  try {
    if (!CAR_ID) {
      let addedCar = await addCar(formData);
      if (addedCar.make_id) {
        showNotification("Car has been added");
      }
    } else {
      const editedCar = await editCar(formData, CAR_ID);
      if (editedCar.make_id) {
        showNotification("Car has been updated");
      }
    }
  } catch (ex) {
    showErrorModal(ex);
  }
}


/**
 * Get data to fill select lists and call method for getting selected car
 */
async function initializeSelectLists() {
  const makesSelect = document.querySelector('[name="make_id"]');
  const bodiesSelect = document.querySelector('[name="body_type_id"]');

  const arr = await Promise.all([getMakes(), getBodyTypes()]);

  for (let i = 0; i < arr[0].results.length; i++) {
    const option = document.createElement('option');
    option.value = arr[0].results[i].id;
    option.innerText = checkXSS(arr[0].results[i].name);
    makesSelect.appendChild(option);
  }

  for (let i = 0; i < arr[1].results.length; i++) {
    const option = document.createElement('option');
    option.value = arr[1].results[i].id;
    option.innerText = checkXSS(arr[1].results[i].name);
    bodiesSelect.appendChild(option);
  }

  getSelectedCar();
}


/**
 * Get models for selected maker
 * 
 * @param {String} make_id 
 */
async function getModels(make_id) {
  const modelsSelect = document.querySelector('[name="car_model_id"]');
  if (!make_id) {
    return;
  }
  try {
    const models_array = await getMakerModels(make_id);
    while(modelsSelect.children.length !== 1) {
      modelsSelect.removeChild(modelsSelect.lastChild);
    }
    for (let i = 0; i < models_array.results.length; i++) {
      const option = document.createElement('option');
      option.value = models_array.results[i].id;
      option.innerText = checkXSS(models_array.results[i].name);
      modelsSelect.appendChild(option);
    }
  } catch (ex) {
    showErrorModal(ex);
  }
}

/**
 * Initialize event listeners
 */
function initEventListener() {
  const form = document.querySelector('.form');
  form.addEventListener('submit', saveCar);

  const makeSelect = document.querySelector('[name="make_id"');
  makeSelect.addEventListener('change', (event) => {
    getModels(event.target.value);
  });

  const inYear = document.querySelector('[name="year"');
  inYear.addEventListener('keyup', (event) => {
    if (event.target.value.length === 4) {
      const year = parseInt(event.target.value);
      if (year < 1900 || year > new Date().getFullYear()) {
        inYear.classList.add('error-date');
      } else {
        inYear.classList.remove('error-date');
      }
    } else if (event.target.value.length > 4) {
      inYear.classList.add('error-date');
    } else {
      inYear.classList.remove('error-date');
    }
  });
  inYear.max = new Date().getFullYear();
  
  const inMileage = document.querySelector('[name="mileage"');
  inMileage.max = Math.pow(2,32) - 1;
}


initEventListener();
initializeSelectLists();