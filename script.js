import { getAllCars } from "./cars-service.js";
import { showErrorModal, checkXSS } from "./utilities.js";

let tablePageCount = 0;
let currentPage = 0;
let selectedRow;

/**
 * Displaying modal window with message.
 *
 * @param {string} message Message for displaying.
 */
function showErrorMessage(message) {
  const messageBlock = document.createElement('div');
  const messageText = document.createElement('p');
  const messageButton = document.createElement('button');

  messageBlock.className = 'error_container';
  messageButton.className = 'button';
  messageButton.innerHTML = 'Ок';
  messageText.innerHTML = message || '';

  messageBlock.appendChild(messageText);
  messageBlock.appendChild(messageButton);

  const errorBlock = document.querySelector('[data-layout="backdrop"]');

  errorBlock.classList.toggle('backdrop');

  document.body.appendChild(messageBlock);

  const timer = setTimeout(() => {
    errorBlock.classList.toggle('backdrop');
    document.body.removeChild(messageBlock);
  }, 10000);

  messageButton.addEventListener('click', () => {
    clearTimeout(timer);
    errorBlock.classList.toggle('backdrop');
    document.body.removeChild(messageBlock);
  });
}

/**
 * Helping function for replacement displaying text into paginator's page.
 *
 * @param {string} prev Value for previous page.
 * @param {string} cur Value for current page.
 * @param {string} next Value for next page.
 */
function changePaginationItems(prev, cur, next) {
  const pages = document.querySelector('.paginator').children;

  for (let i = 0; i < 3; i++) {
    pages[i + 1].classList.remove('hidden');
  }
  pages[1].innerText = prev;
  pages[2].innerText = cur;
  pages[3].innerText = next;

  pages[2].classList.add('selected-paginator-item');
}

/**
 * Changes text when switching buttons or hide depending on the number of pages.
 */
function changePaginatorPages() {
  const parent = document.querySelector('.paginator');

  if (tablePageCount !== 0) {
    parent.firstElementChild.classList.remove('disabled-paginator-items');
    parent.lastElementChild.classList.remove('disabled-paginator-items');
    if (tablePageCount === 1) {
      changePaginationItems('...', currentPage, '...');
    } else if (currentPage === 1) {
      changePaginationItems('...', currentPage, currentPage + 1);
    } else if (currentPage === tablePageCount) {
      changePaginationItems(currentPage - 1, currentPage, '...');
    } else {
      changePaginationItems(currentPage - 1, currentPage, currentPage + 1);
    }
  } else {
    for (let i = 0; i < parent.children.length; i++) {
      if (i === 0 || i === parent.children.length - 1) {
        parent.children[i].classList.add('disabled-paginator-items');
      } else {
        parent.children[i].classList.add('hidden');
      }
    }
  }
}

/**
 * Create table's row using car object.
 *
 * @param {Object} car Object with car's data.
 * @returns {HTMLTableRowElement} Table row filling data.
 */
function getTableRow(car) {
  const tdArray = [];

  for (let i = 0; i < 7; i++) {
    tdArray.push(document.createElement('td'));
  }
  tdArray[0].innerText = checkXSS(car.make.name);
  tdArray[1].innerText = checkXSS(car.car_model.name);
  tdArray[2].innerText = checkXSS(car.body_type.name);
  tdArray[3].innerText = car.year;
  tdArray[4].innerText = car.mileage;
  tdArray[5].innerText = moment(car.created_at,"YYYY-MM-DD HH:mm:ss").format("DD.MM.YYYY");
  tdArray[6].innerText = moment(car.updated_at, "YYYY-MM-DD HH:mm:ss").format("DD.MM.YYYY");

  const tr = document.createElement('tr');

  tr.setAttribute('data-car-id', car.id);
  for (let i = 0; i < 7; i++) {
    tr.appendChild(tdArray[i]);
  }

  return tr;
}

/**
 * Creates table rows with cars and add their into table.
 *
 * @param {Array} rows Data from server with cars.
 */
function fillTable(rows) {
  const table = document.querySelector('.cars');
  const tbody = table.tBodies[0];

  while (tbody.firstChild) {
    tbody.removeChild(tbody.firstChild);
  }

  if (rows.results && rows.results.length !== 0) {
    tablePageCount = rows.pagination.total_pages;
    currentPage = rows.pagination.current_page;
    rows.results.forEach(row => {
      tbody.appendChild(getTableRow(row));
    });
  } else {
    tablePageCount = 0;
    currentPage = 0;
    showErrorModal('No results. Please, change filters values');
  }
  changePaginatorPages();
}

/**
 * Call function for getting cars from the server.
 *
 * @param {string} pageNumber Number of needed page.
 */
function getCars(pageNumber) {
  const table = document.querySelector('.cars');
  const param = {
    'pageNumber': Number.isFinite(pageNumber) ? pageNumber : undefined,
    'keyword': document.querySelector('.searching-input').value,
    'sortField': table.dataset.sortName,
    'orderType': table.dataset.sortOrder
  }

  getAllCars(param).then(
    result => {
      fillTable(JSON.parse(result));
    },
    error => {
      console.log(error);
    },
  );
}

/**
 * Call function for saving cars after adding or edit.
 */
function addCar() {
  document.location.href = `create.html`;
}

// /**
//  * Show or hide sidebar.
//  */
// function changeSideBarState() {
//   const sidebar = document.querySelector('.form-wrapper-sidebar');

//   sidebar.classList.toggle('inactive-filters');
// }

/**
 * Switch page in paginator.
 *
 * @param {MouseEvent} event Event received by clicking on the paginator.
 */
function switchPage(event) {
  if (tablePageCount === 0) {
    return;
  }

  const target = event.target.nodeName === 'I' ? event.target.parentElement : event.target;
  let page;

  if (!target.previousElementSibling) {
    // to first
    if (currentPage !== 1) page = 1;
    else return;
  } else if (!target.nextElementSibling) {
    // to last
    if (currentPage !== tablePageCount) page = tablePageCount;
    else return;
  } else {
    page = parseInt(target.innerText, 10);
    if (page === currentPage || !page) return;
  }
  getCars(page);
}

function selectCar(event) {
  if (selectedRow) {
    selectedRow.classList.remove('selected-row');
    if (selectedRow.dataset['carId'] !== event.target.parentElement.dataset['carId']) {
      selectedRow = event.target.parentElement;
      selectedRow.classList.add('selected-row');
    } else {
      selectedRow = null;
    }
  } else {
    selectedRow = event.target.parentElement;
    selectedRow.classList.add('selected-row');
  }
}

function moveCarToEdit() {
  const carID = selectedRow.dataset['carId'];
  document.location.href = `create.html?car=${carID}`;
}

function sortCars(event) {
  console.log(event);
  if (event.target.nodeName !== 'P') {
    return;
  }
  const th = event.target.parentElement.parentElement;
  event.target.classList.toggle('selected-sort');
  const field = th.dataset['name'];
  const order = event.target.classList[0] === 'sort-ascending' ? 'asc' : 'desc';
  const table = document.querySelector('.cars');
  table.dataset.sortName = field;
  table.dataset.sortOrder = order;
  getAllCars({'sortField': field, 'orderType': order}).then(
    result => {
      fillTable(JSON.parse(result));
    },
    error => {
      console.log('error');
    }
  );
}

function initEventListeners() {
  const saveBtn = document.querySelector('.add');
  saveBtn.addEventListener('click', addCar);

  const searchingBtn = document.querySelector('.searching-button');
  searchingBtn.addEventListener('click', getCars);

  // const sidebarBtn = document.querySelector('.sidebar-state-button');
  // sidebarBtn.addEventListener('click', changeSideBarState);

  const paginator = document.querySelector('.paginator');
  paginator.addEventListener('click', switchPage);

  const tableCarBody = document.querySelector('.cars tbody');
  tableCarBody.addEventListener('click', selectCar);

  const editBtn = document.querySelector('.edit');
  editBtn.addEventListener('click', moveCarToEdit);

  const tableCarHead = document.querySelector('.cars thead');
  tableCarHead.addEventListener('click', sortCars);
}

initEventListeners();

changePaginatorPages();
