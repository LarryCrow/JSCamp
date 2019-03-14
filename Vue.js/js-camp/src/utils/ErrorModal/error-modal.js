export default {
	name: 'error-modal',
	props: {
		message: String
	},
	methods: {
		/**
		 * Close modal windows after the mouse click.
		 */
		closeModal: function() {
			this.$emit('close')
		}
	}
}