import { getCars, deleteCar } from '@/api/cars-service.js';
import { preventXSS } from '@/utils/utilities.js';

export default {
	name: 'TableCars',
	data() {
		return {
			cars: [
				// Elements are recieved from the server
			],
			columns: [
				{ prop: 'make_id', title: 'Brand', style: 'width: 14%' },
				{ prop: 'car_model_id', title: 'Model', style: 'width: 12%' },
				{ prop: 'body_type_id', title: 'Body type', style: 'width: 12%' },
				{ prop: 'year', title: 'Year', style: 'width: 9%' },
				{ prop: 'mileage', title: 'Mileage', style: 'width: 11' },
				{ prop: 'description', title: 'Description', style: 'width: 16%' },
				{ prop: 'created_at', title: 'Created at', style: 'width: 13%' },
				{ prop: 'updated_at', title: 'Updatet at', style: 'width: 13%' }
			],
			selectedCar: { id: '0', row: null },
			pageState: { currentPage: null, totalPages: null, keyword: '', pages: [] },
			sortingState: { sortField: '', orderType: '', sortCol: null },
			tempKeyword: '',
			errorModal: { isShow: false, message: '' }
		}
	},
	created: function () {
		searchCars.apply(this);
	},
	methods: {
		searchCars,
		selectRow,
		setPaginatatorValues,
		switchPage,
		sortCars,
		deleteRow,
		passToEditCar,
		preventXSS,
		/**
		 * Open the form page to add a new car.
		 */
		passToAddCar: function () { this.$router.push('form'); },
	}
}


/**
 * Call function for getting cars from the server.
 *
 * @param {Object} param0 Object of the for {page, keyword, sortField, orderType}
 * @param {string} param0.page - Number of needed page
 * @param {string} param0.keyword - phrase for filter
 * @param {string} param0.order_by - Field name which will be used to sort
 * @param {string} param0.sort_order - 'asc' or 'desc' for ascending or descending sorting
 * @return {Boolean} True - if data were got, false - if not
 */
async function searchCars({
	page = this.pageState.currentPage,
	keyword = this.pageState.keyword,
	sortField = this.sortingState.sortField,
	orderType = this.sortingState.orderType } = {}) {
	const queryParam = {
		'page': page || '',
		'keyword': keyword || '',
		'order_by': sortField || '',
		'sort_order': orderType || ''
	}

	try {
		const resultCars = await getCars(queryParam);
		if (resultCars.results && resultCars.results.length > 0) {
			this.cars = resultCars.results;
			this.pageState.keyword = keyword;
			setPaginatatorValues.apply(this, [resultCars.pagination.current_page, resultCars.pagination.total_pages]);
			return true;
		}
		throw new Error('No results. Please, change filters values');
	} catch (ex) {
		if (ex.message === 'Unauthorized') {
			this.$router.push('auth');
		}
		this.errorModal = { isShow: true, message: ex };
		return false;
	}
}

/**
 * Select or unselect table's row. Change toolbar state.
 * 
 * @param {MouseEvent} event - Event received by clicking on the table row.
 * @param {string} car_id - Car's id.
 */
function selectRow(event, car_id) {
	this.$store.test;
	if (this.selectedCar.row !== null) {
		this.selectedCar.row.classList.remove('selected-car');
		if (this.selectedCar.id === car_id) {
			this.selectedCar = { id: '', row: null }
			return;
		}
	}
	this.selectedCar = { id: car_id, row: event.currentTarget }
	this.selectedCar.row.classList.add('selected-car');
}

/**
 * Changes text when switching buttons or hide depending on the number of pages.
 * @param {string} curPage - A page which user has passed on.
 * @param {string} totalPages - An amount of pages.
 */
function setPaginatatorValues(curPage, totalPages) {
	if (totalPages === 1) {
		this.pageState.pages = ['...', 1, '...'];
	} else if (curPage === 1) {
		this.pageState.pages = ['...', curPage, curPage + 1];
	} else if (curPage === totalPages) {
		this.pageState.pages = [curPage - 1, curPage, '...'];
	} else {
		this.pageState.pages = [curPage - 1, curPage, curPage + 1];
	}
	this.pageState.currentPage = curPage;
	this.pageState.totalPages = totalPages;
}

/**
 * Switch page in paginator.
 *
 * @param {MouseEvent} event - Event received by clicking on the paginator.
 */
function switchPage(event) {
	const target = event.target.nodeName === 'I' ? event.target.parentElement : event.target;
	let page;
	if (!target.previousElementSibling) {
		// to the first page
		if (this.pageState.currentPage !== 1) page = 1;
		else return;

	} else if (!target.nextElementSibling) {
		// to the last page
		if (this.pageState.currentPage !== this.pageState.totalPages) page = this.pageState.totalPages;
		else return;
	} else {
		page = parseInt(target.innerText, 10);
		if (page === this.pageState.currentPage || !page) return;
	}

	searchCars.apply(this, [{ page: page }]);
}

/**
 * Sort table depending on field and order. Call update table method.
 * 
 * @param {MouseEvent} event - Event received by clicking on the sort button.
 * @param {string} fieldName - Field title for sending at the server.
 * @param {string} orderType - Sorting type for sending at the server.
 */
async function sortCars(event, fieldName, orderType) {
	if (this.cars.length === 0) {
		return;
	}

	const params = {
		'page': ''
	}

	if (this.sortingState.sortCol !== event.target) {
		params.sortField = fieldName;
		params.orderType = orderType;
	} else {
		params.sortField = '';
		params.orderType = '';
	}

	try {
		const isTableUpdated = await searchCars.apply(this, [params]);
		if (isTableUpdated) {

			if (!this.sortingState.sortCol || this.sortingState.sortCol !== event.target) {
				if (this.sortingState.sortCol) {
					this.sortingState.sortCol.classList.remove('selected-sort');
				}
				this.sortingState.sortCol = event.target;
				this.sortingState.sortCol.classList.add('selected-sort');
			} else {
				this.sortingState.sortCol.classList.remove('selected-sort');
				this.sortingState.sortCol = null;
			}

			this.sortingState.sortField = params.sortField;
			this.sortingState.orderType = params.orderType;
		}
	} catch (ex) {
		if (ex.message === 'Unauthorized') {
			this.$router.push('auth');
		}
		this.errorModal = { isShow: true, message: ex };
	}
}

/**
 * Delete selected row and update table.
 */
async function deleteRow() {
	if (this.selectedCar.row !== null) {
		try {
			await deleteCar(this.selectedCar.id);
			searchCars.apply(this);
		} catch (ex) {
			if (ex.message === 'Unauthorized') {
				this.$router.push('auth');
			}
			this.errorModal = { isShow: true, message: ex };
		}
	}
}

/**
 * Open the form page to edit.
 */
function passToEditCar() {
	if (this.selectedCar.id) {
		this.$router.push(`form/${this.selectedCar.id}`);
	}
}