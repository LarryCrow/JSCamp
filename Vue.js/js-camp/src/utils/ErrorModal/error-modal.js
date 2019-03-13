export default {
	name: 'error-modal',
	props: {
		message: String
	},
	methods: {
		closeModal: function() {
			this.$emit('close')
		}
	}
}