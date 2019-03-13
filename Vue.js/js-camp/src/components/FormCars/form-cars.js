import { getCar, getMakerModels, addCar, getMakes, getBodyTypes, editCar } from '@/api/cars-service.js';
import { preventXSS } from "@/utils/utilities.js";

export default {
	name: 'FormCars',
	data() {
		return {
			form: {
				make_id: null,
				car_model_id: null,
				body_type_id: null,
				year: null,
				mileage: null,
				description: ''
			},
			makers: [],
			make_models: [],
			bodies: [],
			car_id: null,
			errorModal: {
				isShow: false,
				message: ''
			},
			notificationModal: {
				isShow: false,
				message: ''
			}
		}
	},
	created: async function () {
		const data = await Promise.all([getMakes(), getBodyTypes()]);
		this.makers = data[0].results;
		this.bodies = data[1].results;
		getSelectedCar.apply(this);
	},
	watch: {
		'form.make_id': async function (make_id) {
			console.log(make_id);
			console.log('123');
			if (make_id !== null) {
				const models = await getMakerModels(make_id);
				this.make_models = models.results;
			} else {
				this.make_models = [];
			}
		}
	},
	methods: {
		saveCar: saveCar
	}
}

/**
 * Get car which was selected in the table
 */
async function getSelectedCar() {
	const car_id_str = document.URL.substr(document.URL.lastIndexOf('/') + 1);
	try {
		const car_id = parseInt(car_id_str, 10);
		if (isFinite(car_id)) {
			this.car_id = car_id;
			const car = await getCar(car_id);
			const models = await getMakerModels(car.make_id);
			this.make_models = models.results;
			for (let x in this.form) {
				this.form[x] = car[x];
			}
		}
	} catch (ex) {
		// showErrorModal(ex);
	}
}


async function saveCar() {
	try {
		if (this.car_id === null) {
			let addedCar = await addCar(this.form);
			if (addedCar.make_id) {
				this.notificationModal = { isShow: true, message: 'Car has been added' };
			}
		} else {
			const editedCar = await editCar(this.form, this.car_id);
			if (editedCar.make_id) {
				this.notificationModal = { isShow: true, message: 'Car has been updated' };
			}
		}
	} catch (ex) {
		this.errorModal = { isShow: true, message: ex };
	}
}