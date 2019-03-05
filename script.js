import { getAllCars, deleteCar } from "./cars-service-xhr.js";
import { showErrorModal, checkXSS } from "./utilities.js";


const STORAGE = {
  'pageToMove': 0,
  'currentPage': 0,
  'tablePageCount': 0,
  'selectedRow': null,
  'sortField': '',
  'orderType': ''
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

  if (STORAGE.tablePageCount !== 0) {
    parent.firstElementChild.classList.remove('disabled-button');
    parent.lastElementChild.classList.remove('disabled-button');
    if (STORAGE.tablePageCount === 1) {
      changePaginationItems('...', STORAGE.currentPage, '...');
    } else if (STORAGE.currentPage === 1) {
      changePaginationItems('...', STORAGE.currentPage, STORAGE.currentPage + 1);
    } else if (STORAGE.currentPage === STORAGE.tablePageCount) {
      changePaginationItems(STORAGE.currentPage - 1, STORAGE.currentPage, '...');
    } else {
      changePaginationItems(STORAGE.currentPage - 1, STORAGE.currentPage, STORAGE.currentPage + 1);
    }
  } else {
    for (let i = 0; i < parent.children.length; i++) {
      if (i === 0 || i === parent.children.length - 1) {
        parent.children[i].classList.add('disabled-button');
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

  for (let i = 0; i < 8; i++) {
    tdArray.push(document.createElement('td'));
  }
  tdArray[0].innerText = checkXSS(car.make.name);
  tdArray[1].innerText = checkXSS(car.car_model.name);
  tdArray[2].innerText = checkXSS(car.body_type.name);
  tdArray[3].innerText = car.year;
  tdArray[4].innerText = car.mileage;
  tdArray[5].innerText = checkXSS(car.description);
  tdArray[6].innerText = moment(car.created_at,"YYYY-MM-DD HH:mm:ss").format("DD.MM.YYYY");
  tdArray[7].innerText = moment(car.updated_at, "YYYY-MM-DD HH:mm:ss").format("DD.MM.YYYY");

  tdArray[0].classList.add('td-truncated');
  tdArray[5].classList.add('td-truncated');

  const tr = document.createElement('tr');

  tr.setAttribute('data-car-id', car.id);
  tr.classList.add('tb-row');
  for (let i = 0; i < tdArray.length; i++) {
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
    STORAGE.tablePageCount = rows.pagination.total_pages;
    STORAGE.currentPage = rows.pagination.current_page;
    rows.results.forEach(row => {
      tbody.appendChild(getTableRow(row));
    });
  } else {
    STORAGE.tablePageCount = 0;
    STORAGE.currentPage = 0;
    showErrorModal('No results. Please, change filters values');
  }
  const toolbarBtns = document.querySelectorAll(".icons:not(.add)");
  for (let btn of toolbarBtns) {
    btn.classList.add('disabled-button');
  }
  changePaginatorPages();
}

/**
 * Call function for getting cars from the server.
 *
 * @param {string} pageNumber Number of needed page.
 */
async function searchCars(pageNumber) {
  const table = document.querySelector('.cars');
  const param = {
    'pageNumber': Number.isFinite(pageNumber) ? pageNumber : '',
    'keyword': document.querySelector('.searching-input').value,
    'sortField': STORAGE.sortField,
    'orderType': STORAGE.orderType
  }

  try {
    const cars = await getAllCars(param);
    fillTable(cars);
  } catch (ex) {
    showErrorModal(ex);
  } 
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
  if (STORAGE.tablePageCount === 0) {
    return;
  }

  const target = event.target.nodeName === 'I' ? event.target.parentElement : event.target;
  let page;

  if (!target.previousElementSibling) {
    // to first
    if (STORAGE.currentPage !== 1) page = 1;
    else return;
  } else if (!target.nextElementSibling) {
    // to last
    if (STORAGE.currentPage !== STORAGE.tablePageCount) page = STORAGE.tablePageCount;
    else return;
  } else {
    page = parseInt(target.innerText, 10);
    if (page === STORAGE.currentPage || !page) return;
  }
  searchCars(page);
}

function selectCar(event) {
  const toolbarBtns = document.querySelectorAll(".icons:not(.add)");
  if (STORAGE.STORAGE.selectedRow) {
    STORAGE.selectedRow.classList.remove('selected-row');
    if (STORAGE.selectedRow.dataset['carId'] !== event.target.parentElement.dataset['carId']) {
      STORAGE.selectedRow = event.target.parentElement;
      STORAGE.selectedRow.classList.add('selected-row');
      for (let btn of toolbarBtns) {
        btn.classList.remove('disabled-button');
      }
    } else {
      STORAGE.selectedRow = null;
      for (let btn of toolbarBtns) {
        btn.classList.add('disabled-button');
      }
    }
  } else {
    STORAGE.selectedRow = event.target.parentElement;
    STORAGE.selectedRow.classList.add('selected-row');
    for (let btn of toolbarBtns) {
      btn.classList.remove('disabled-button');
    }
  }
}

async function deleteRow() {
  if (STORAGE.selectedRow) {
    try {
      const res = await deleteCar(STORAGE.selectedRow.dataset['carId']);
      searchCars(STORAGE.currentPage);
    } catch (ex) {
      showErrorModal(ex);
    }
  }
}

function passToEditCar() {
  const carID = STORAGE.selectedRow.dataset['carId'];
  document.location.href = `create.html?car=${carID}`;
}

async function sortCars(event) {
  console.log(event);
  if (event.target.nodeName !== 'P') {
    return;
  }
  const th = event.target.parentElement.parentElement;
  event.target.classList.toggle('selected-sort');

  const table = document.querySelector('.cars');
  STORAGE.sortField = th.dataset['name'];
  STORAGE.orderType = event.target.classList[0] === 'sort-ascending' ? 'asc' : 'desc';

  try {
    searchCars();
  } catch (ex) {
    showErrorModal(cars);
  }
}

function initEventListeners() {
  const saveBtn = document.querySelector('.add');
  saveBtn.addEventListener('click', () => {
    document.location.href = `create.html`;
  });

  const searchingBtn = document.querySelector('.searching-button');
  searchingBtn.addEventListener('click', searchCars);

  // const sidebarBtn = document.querySelector('.sidebar-state-button');
  // sidebarBtn.addEventListener('click', changeSideBarState);

  const paginator = document.querySelector('.paginator');
  paginator.addEventListener('click', switchPage);

  const tableCarBody = document.querySelector('.cars tbody');
  tableCarBody.addEventListener('click', selectCar);

  const editBtn = document.querySelector('.edit');
  editBtn.addEventListener('click', passToEditCar);

  const deleteBtn = document.querySelector('.delete');
  deleteBtn.addEventListener('click', deleteRow);

  const tableCarHead = document.querySelector('.cars thead');
  tableCarHead.addEventListener('click', sortCars);
}

initEventListeners();

changePaginatorPages();
