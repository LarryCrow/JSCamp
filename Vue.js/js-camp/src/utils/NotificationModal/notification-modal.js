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
	/**
	 * Sets timer for 5 seconds and close modal after that
	 */
	created: function(){
		this.closeTimer = setTimeout(() => {
			this.isClosing = true;
			setTimeout(() => {
				this.$emit('close');
			}, 1000);
		}, 5000);
	},
	methods: {
		/**
		 * Close modal after click at the button
		 */
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