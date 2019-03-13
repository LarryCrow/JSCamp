import { logIn } from '@/api/user-service.js';
import { mapActions } from 'vuex';


export default {
	name: 'Auth',
	data() {
		return {
			errorModal: {
				isShow: false,
				message: ''
			},
			login: '',
			pass: ''
		}
	},
	methods: {
		signIn: signIn,
		...mapActions(['setToken'])
	}
}

async function signIn() {
	try {
		const res = await logIn({ 'email': this.login, 'password': this.pass });
		if (res.token) {
			window.localStorage.setItem('token', res.token);
			this.setToken({ token: res.token });
		}
	} catch (ex) {
		// this.errorModal = { isShow: true, message: ex };
		console.log(ex);
	}
}
