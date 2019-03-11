import { getCars, deleteCar } from "../services/cars-service-fetch.js";
import { showErrorModal, checkXSS, getToken } from "../utils/utilities.js";

let TOKEN;

/**
 * Table state
 */
const TABLEDATA = {
  'currentPage': 0,
  'tablePageCount': 0,
  'selectedRow': null,
  'keyword': ''
}

/**
 * Params of sort
 */
const SORTING = {
  'sortedBtn': null,
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
function fillPaginatorItems(prev, cur, next) {
  const pages = document.querySelector('.paginator-list').children;

  // Don't change button for passing to first or last page
  for (let i = 0; i < 3; i++) {
    pages[i + 1].classList.remove('hidden');
  }
  pages[1].innerText = prev;
  pages[2].innerText = cur;
  pages[3].innerText = next;

  if (!Number.isFinite(prev)) {
    pages[1].classList.add('paginator-item-not-page')
  } else {
    pages[1].classList.remove('paginator-item-not-page');
  }
  if (!Number.isFinite(next)) {
    pages[3].classList.add('paginator-item-not-page')
  } else {
    pages[3].classList.remove('paginator-item-not-page');
  }
  pages[2].classList.add('selected-paginator-item');
}

/**
 * Changes text when switching buttons or hide depending on the number of pages.
 */
function changePaginatorItems() {
  const parent = document.querySelector('.paginator-list');

  if (TABLEDATA.tablePageCount !== 0) {
    parent.firstElementChild.classList.remove('disabled-button');
    parent.lastElementChild.classList.remove('disabled-button');
    if (TABLEDATA.tablePageCount === 1) {
      fillPaginatorItems('...', TABLEDATA.currentPage, '...');
    } else if (TABLEDATA.currentPage === 1) {
      fillPaginatorItems('...', TABLEDATA.currentPage, TABLEDATA.currentPage + 1);
    } else if (TABLEDATA.currentPage === TABLEDATA.tablePageCount) {
      fillPaginatorItems(TABLEDATA.currentPage - 1, TABLEDATA.currentPage, '...');
    } else {
      fillPaginatorItems(TABLEDATA.currentPage - 1, TABLEDATA.currentPage, TABLEDATA.currentPage + 1);
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
 * Creates table rows with cars and add their into table. Update toolbar and storage properties.
 *
 * @param {Array} rows Data from server with cars.
 */
function fillTable(rows) {
  const table = document.querySelector('.cars');
  const tbody = table.tBodies[0];

  while (tbody.firstChild) {
    tbody.removeChild(tbody.firstChild);
  }

  rows.results.forEach(row => {
    tbody.appendChild(getTableRow(row));
  });

  TABLEDATA.tablePageCount = rows.pagination.total_pages;
  TABLEDATA.currentPage = rows.pagination.current_page;
  
  TABLEDATA.selectedRow = null;
  const toolbarBtns = document.querySelectorAll(".icons:not(.add)");
  for (let btn of toolbarBtns) {
    btn.classList.add('disabled-button');
  }

  changePaginatorItems();
}

/**
 * Call function for getting cars from the server.
 *
 * @param {string} pageNumber Number of needed page.
 * @return {Boolean} True - if data were got, false - if not
 */
async function searchCars({pageNumber, keyword, sortField, orderType}) {
  const isOk = (x) => x || x === '';
  const param = {
    'page': isOk(pageNumber) ? pageNumber : (TABLEDATA.currentPage ? TABLEDATA.currentPage : ''),
    'keyword': isOk(keyword) ? keyword : (TABLEDATA.keyword ? TABLEDATA.keyword : ''),
    'order_by': isOk(sortField) ? sortField : (SORTING.sortField ? SORTING.sortField : ''),
    'sort_order': isOk(orderType) ? orderType : (SORTING.orderType ? SORTING.orderType : '')
  }

  try {
    const cars = await getCars(param);
    if (cars.results && cars.results.length > 0) {
      TABLEDATA.keyword = keyword ? keyword : TABLEDATA.keyword;
      fillTable(cars);
      return true;
    }
    throw new Error('No results. Please, change filters values');
  } catch (ex) {
    showErrorModal(ex);
    return false;
  } 
}

/**
 * Switch page in paginator.
 *
 * @param {MouseEvent} event Event received by clicking on the paginator.
 */
function switchPage(event) {
  if (TABLEDATA.tablePageCount === 0) {
    return;
  }

  const target = event.target.nodeName === 'I' ? event.target.parentElement : event.target;
  let page;

  if (!target.previousElementSibling) {
    // to first
    if (TABLEDATA.currentPage !== 1) page = 1; 
    else return;

  } else if (!target.nextElementSibling) {
    // to last
    if (TABLEDATA.currentPage !== TABLEDATA.tablePageCount) page = TABLEDATA.tablePageCount;
    else return;

  } else {
    page = parseInt(target.innerText, 10);
    if (page === TABLEDATA.currentPage || !page) return;
  }
  
  searchCars({'pageNumber':page});
}

/**
 * Select or unselect table's row. Change toolbar state.
 * 
 * @param {MouseEvent} event Event received by clicking on the table row
 */
function selectCar(event) {
  const toolbarBtns = document.querySelectorAll(".icons:not(.add)");
  if (TABLEDATA.selectedRow) {
    TABLEDATA.selectedRow.classList.remove('selected-row');
    if (TABLEDATA.selectedRow.dataset['carId'] !== event.target.parentElement.dataset['carId']) {
      TABLEDATA.selectedRow = event.target.parentElement;
      TABLEDATA.selectedRow.classList.add('selected-row');
      for (let btn of toolbarBtns) {
        btn.classList.remove('disabled-button');
      }
    } else {
      TABLEDATA.selectedRow = null;
      for (let btn of toolbarBtns) {
        btn.classList.add('disabled-button');
      }
    }
  } else {
    TABLEDATA.selectedRow = event.target.parentElement;
    TABLEDATA.selectedRow.classList.add('selected-row');
    for (let btn of toolbarBtns) {
      btn.classList.remove('disabled-button');
    }
  }
}


/**
 * Delete selected row and update table.
 */
async function deleteRow() {
  if (TABLEDATA.selectedRow) {
    try {
      const res = await deleteCar(TABLEDATA.selectedRow.dataset['carId']);
      searchCars(TABLEDATA.currentPage);
    } catch (ex) {
      showErrorModal(ex);
    }
  }
}


/**
 * Open edit window
 */
function passToEditCar() {
  const carID = TABLEDATA.selectedRow.dataset['carId'];
  if (carID !== '') {
    document.location.href = `../form-page/form.html?car=${carID}`;
  }
}

/**
 * Sort table depending on field and order. Call update table method.
 * 
 * @param {MouseEvent} event Event received by clicking on the sort button
 */
async function sortCars(event) {
  if (event.target.nodeName !== 'I' || document.querySelector('.cars').tBodies[0].children.length === 0) {
    return;
  }
  const th = event.target.parentElement.parentElement.parentElement;

  const params = {
    'pageNumber': '' 
  }
  if (SORTING.sortedBtn !== event.target) {
    params.sortField = th.dataset['name'];
    params.orderType = event.target.dataset['order'];
  } else {
    params.sortField = '';
    params.orderType = '';
  }
  
  try {
    const isTableUpdated = await searchCars(params);
    if (isTableUpdated) {

      if (!SORTING.sortedBtn || SORTING.sortedBtn !== event.target) {
        if (SORTING.sortedBtn) {
          SORTING.sortedBtn.classList.remove('selected-sort');
        }
        SORTING.sortedBtn = event.target;
        SORTING.sortedBtn.classList.add('selected-sort');
      } else {
        SORTING.sortedBtn.classList.remove('selected-sort');
        SORTING.sortedBtn = null;
      }

      SORTING.sortField = params.sortField;
      SORTING.orderType = params.orderType;
    }
  } catch (ex) {
    showErrorModal(ex);
  }
}


/**
 * Initialize event listeners
 */
function initEventListeners() {
  const saveBtn = document.querySelector('.add');
  saveBtn.addEventListener('click', () => {
    document.location.href = `../form-page/form.html`
  });

  const searchingBtn = document.querySelector('.searching-button');
  searchingBtn.addEventListener('click', () => {
    searchCars(
      {'pageNumber': '',
      'keyword': document.querySelector('.searching-input').value
      });
    });

  const paginator = document.querySelector('.paginator-list');
  paginator.addEventListener('click', switchPage);

  const tableCarBody = document.querySelector('.cars tbody');
  tableCarBody.addEventListener('click', selectCar);

  const editBtn = document.querySelector('.edit');
  editBtn.addEventListener('click', passToEditCar);

  const deleteBtn = document.querySelector('.delete');
  deleteBtn.addEventListener('click', deleteRow);

  const sortButtons = document.querySelectorAll('.btn-sort');
  for (let btn of sortButtons) {
    btn.addEventListener('click', sortCars);
  }
}

TOKEN = getToken();
initEventListeners();
changePaginatorItems();