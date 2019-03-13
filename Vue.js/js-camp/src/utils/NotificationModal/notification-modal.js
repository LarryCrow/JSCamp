export default {
	name: 'notification-modal',
	props: {
		message: String
	},
	data() {
		return {
			closeTimer: null,
			isClosing: false
		}
	},
	created: function(){
		this.closeTimer = setTimeout(() => {
			this.isClosing = true;
			setTimeout(() => {
				this.$emit('close');
			}, 1000);
		}, 5000);
	},
	methods: {
		closeModal: function() {
			if (this.closeTimer) {
				clearTimeout(this.closeTimer);
			}
			this.isClosing = true;
			setTimeout(() => {
				this.$emit('close');
			}, 1000);
		}
	}
}