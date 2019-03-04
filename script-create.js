import { getCar, editCar, getMakeModels, getMakes, getBodyTypes, addCar } from "./cars-service.js";
import { showErrorModal, checkXSS } from "./utilities.js";

let CAR_ID;

function getSelectedCar() {
  const urlString = document.URL;
  const url = new URLSearchParams(urlString.split('?')[1]);
  CAR_ID = url.get('car');
  if (CAR_ID !== null) {
    getCar(CAR_ID).then(
      result => {
        const form = document.querySelector('.form');
        result = JSON.parse(result);
        form.elements['make_id'].value = result.make_id;
        form.elements['car_model_id'].value = getMakeModelsAfterChange(result.make_id);
        form.elements['body_type_id'].value = result.body_type_id;
        form.elements['year'].value = result.year;
        form.elements['mileage'].value = result.mileage;
        form.elements['description'].value = result.description;
      },
      error => {
        console.log(error);
      }
    );
  }
}

function saveCar() {
  const form = document.querySelector('.form');
  const formData = new FormData(form);
  if (!CAR_ID) {
    addCar(formData).then(
      () => {
        console.log('Succesful');
      },
      error => {
        showErrorModal(error);
      }
    );
  } else {
    editCar(formData, CAR_ID).then(
      () => {
        console.log('Succesful');
      },
      error => {
        console.log(error);
      },
    );
  }
}

async function initializeSelectLists() {
  const makesSelect = document.querySelector('[name="make_id"]');
  const bodiesSelect = document.querySelector('[name="body_type_id"]');

  const makes_array = JSON.parse(await getMakes());
  for (let i = 0; i < makes_array.results.length; i++) {
    const option = document.createElement('option');
    option.value = makes_array.results[i].id;
    option.innerText = checkXSS(makes_array.results[i].name);
    makesSelect.appendChild(option);
  }

  const bodies_array = JSON.parse(await getBodyTypes());
  for (let i = 0; i < bodies_array.results.length; i++) {
    const option = document.createElement('option');
    option.value = bodies_array.results[i].id;
    option.innerText = checkXSS(bodies_array.results[i].name);
    bodiesSelect.appendChild(option);
  }

  getSelectedCar();
}

function getMakeModelsAfterChange(make_id) {
  const modelsSelect = document.querySelector('[name="car_model_id"]');
  if (!make_id) return;
  if (make_id.target) make_id = make_id.target.value;
  getMakeModels(make_id).then(
    result => {
      result = JSON.parse(result);
      for (let i = 0; i < result.results.length; i++) {
        const option = document.createElement('option');
        option.value = result.results[i].id;
        option.innerText = checkXSS(result.results[i].name);
        modelsSelect.appendChild(option);
      }
    },
    error => {
      console.log('error');
    }
  )
}

function initEventListener() {
  const editBtn = document.querySelector('.save-button');
  editBtn.addEventListener('click', saveCar);

  const makeSelect = document.querySelector('[name="make_id"');
  makeSelect.addEventListener('change', getMakeModelsAfterChange);
}

initEventListener();
initializeSelectLists();