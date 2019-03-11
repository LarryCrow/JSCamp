import { getCars } from '@/api/cars-service-xhr.js';

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
			]
		}
	},
	methods: {
		// addCars: function(carsArr) {this.cars = carsArr},
		searchCars: searchCars
	}
}

async function searchCars() {
	const isOk = (x) => x || x === '';
	// const param = {
	//   'page': isOk(pageNumber) ? pageNumber : (TABLEDATA.currentPage ? TABLEDATA.currentPage : ''),
	//   'keyword': isOk(keyword) ? keyword : (TABLEDATA.keyword ? TABLEDATA.keyword : ''),
	//   'order_by': isOk(sortField) ? sortField : (SORTING.sortField ? SORTING.sortField : ''),
	//   'sort_order': isOk(orderType) ? orderType : (SORTING.orderType ? SORTING.orderType : '')
	// }
	const param = {
		'page': '',
		'keyword': '',
		'order_by': '',
		'sort_order': ''
	}

	try {
		const resultCars = await getCars(param);
		if (resultCars.results && resultCars.results.length > 0) {
		  this.cars = resultCars.results;
			return true;
		}
		throw new Error('No results. Please, change filters values');
	} catch (ex) {
		// showErrorModal(ex);
		console.log(ex);
		return false;
	}
}