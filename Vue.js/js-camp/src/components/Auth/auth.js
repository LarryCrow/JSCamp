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
			notificationModal: {
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

/**
 * Authorizes user and saves token
 */
async function signIn() {
	try {
		const res = await logIn({ 'email': this.login, 'password': this.pass });
		if (res.token) {
			window.localStorage.setItem('token', res.token);
			this.setToken({ token: res.token });
			this.notificationModal = { isShow: true, message: 'You are logged in' };
		}
	} catch (ex) {
		this.errorModal = { isShow: true, message: ex };
	}
}
