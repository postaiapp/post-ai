const DEFAULT_ITEMS_PER_PAGE = 10;

interface PaginationConfig {
	page?: number;
	items_per_page?: number;
	skipPagination?: boolean;
	offset?: number;
	total_pages?: number;
	total_items?: number;
}

class PaginationUtils {
	private static _config: PaginationConfig = {};

	static config(options: PaginationConfig = {}) {
		this._config = Object.assign({}, options);

		this._config.page = this._config.page || 1;
		this._config.items_per_page = this._config.items_per_page || DEFAULT_ITEMS_PER_PAGE;

		this._config.offset = (this._config.page - 1) * this._config.items_per_page;

		return this;
	}

	static getQueryParams() {
		return this._config.skipPagination
			? {}
			: {
					limit: this.getLimit(),
					offset: this.getOffset(),
					subQuery: false,
				};
	}

	static mount(totalItems) {
		const response: PaginationConfig = {
			items_per_page: this._config.items_per_page,
			total_items: totalItems,
		};

		if (this._config.page === 1) {
			response.total_pages = Math.ceil(totalItems / this._config.items_per_page);
		}

		return this._config.skipPagination ? {} : response;
	}

	static getOffset() {
		return this._config.offset;
	}

	static getPage() {
		return this._config.page;
	}

	static getLimit() {
		return this._config.items_per_page;
	}
}

export default PaginationUtils;
