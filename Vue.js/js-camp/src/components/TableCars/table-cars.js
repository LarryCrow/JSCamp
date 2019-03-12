import { getCars, deleteCar } from '@/api/cars-service-xhr.js';

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
			selectedCar: {id: '0', row: null},
			pageState: {currentPage: null, totalPages: null, keyword: '', pages: []},
			sortingState: {sortField: '', orderType: '', sortCol: null},
			tempKeyword: '',
		}
	},
	created: function() {
		searchCars.apply(this);
	},
	methods: {
		searchCars: searchCars,
		selectRow: selectRow,
		setPaginatatorValues: setPaginatatorValues,
		switchPage: switchPage,
		sortCars: sortCars,
		deleteRow: deleteRow
	}
}

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
			setPaginatatorValues.apply(this, [resultCars.pagination]);
			return true;
		}
		throw new Error('No results. Please, change filters values');
	} catch (ex) {
		// showErrorModal(ex);
		console.log(ex);
		return false;
	}
}

function selectRow(event, car) {
	this.$store.test;
	if (this.selectedCar.row !== null) {
		this.selectedCar.row.classList.remove('selected-car');
		if (this.selectedCar.id === car.id) {
			this.selectedCar = {id: '', row: null}
			return;
		}
	}
	this.selectedCar = {id: car.id, row: event.currentTarget}
	this.selectedCar.row.classList.add('selected-car');
}

function setPaginatatorValues(paginator) {
	if (paginator.total_pages === 1) {
		this.pageState.pages = ['...', 1, '...'];
	} else if (paginator.current_page === 1) {
		this.pageState.pages = ['...', paginator.current_page, paginator.current_page + 1];
	} else if (paginator.current_page === paginator.total_pages) {
		this.pageState.pages[paginator.current_page - 1, paginator.current_page, '...'];
	} else {
		this.pageState.pages[paginator.current_page - 1, paginator.current_page, paginator.current_page + 1];
	}
	this.pageState.currentPage = paginator.current_page;
}

function switchPage(event) {
	const target = event.target.nodeName === 'I' ? event.target.parentElement : event.target;
	let page;
	if (!target.previousElementSibling) {
    // to first
    if (this.pageState.currentPage !== 1) page = 1; 
    else return;

  } else if (!target.nextElementSibling) {
    // to last
    if (this.pageState.currentPage !== this.pageState.totalPages) page = this.pageState.totalPages;
    else return;
  } else {
    page = parseInt(target.innerText, 10);
    if (page === this.pageState.currentPage || !page) return;
	}

	searchCars.apply(this, [{page: page}]);
}

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
		// showErrorModal(ex);
		console.log(ex);
  }
}

async function deleteRow() {
	if (this.selectedCar.row !== null) {
		try {
      await deleteCar(this.selectedCar.id);
      searchCars.apply(this);
    } catch (ex) {
			// showErrorModal(ex);
			console.log(ex);
    }
	}
}