export default {
	name: 'custom-paginator',
	props: {
		curPage: null,
		total: null
	},
	computed: {
		curruntPage() {
			return this.curPage;
		},
		totalPages() {
			return this.total;
		},
		paginatorPages() {
			if (this.total === null || this.curPage === null) {
				return;
			}
			let pages = [];
			if (this.total === 1) {
				pages = ['...', 1, '...'];
			} else if (this.curPage === 1) {
				pages = ['...', this.curPage, this.curPage + 1];
			} else if (this.curPage === this.total) {
				pages = [this.curPage - 1, this.curPage, '...'];
			} else {
				pages = [this.curPage - 1, this.curPage, this.curPage + 1];
			}

			return pages;
		}
	},
	methods: {
		switchPage,
	}
}

function switchPage(page) {
	const pageToPass = parseInt(page, 10);
	if (!isFinite(pageToPass) || page === this.curPage) {
		return;
	}

	this.$emit('switch', page);
}