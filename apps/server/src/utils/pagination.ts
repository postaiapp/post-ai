const DEFAULT_ITEMS_PER_PAGE = 10;

interface PaginationConfig {
	page: number;
	items_per_page: number;
	offset: number;
	skipPagination?: boolean;
}

interface PaginationResponse {
	items_per_page: number;
	total_items: number;
	total_pages?: number;
}

interface QueryParams {
	limit: number;
	offset: number;
	subQuery: boolean;
}

class PaginationUtils {
	private static _config: PaginationConfig;

	static config(options: Partial<PaginationConfig> = {}): typeof PaginationUtils {
		this._config = Object.assign({}, options) as PaginationConfig;

		this._config.page = this._config.page || 1;
		this._config.items_per_page = this._config.items_per_page || DEFAULT_ITEMS_PER_PAGE;

		this._config.offset = (this._config.page - 1) * this._config.items_per_page;

		return this;
	}

	static getQueryParams(): Partial<QueryParams> {
		return this._config.skipPagination
			? {}
			: {
					limit: this.getLimit(),
					offset: this.getOffset(),
					subQuery: false,
				};
	}

	static mount(totalItems: number): Partial<PaginationResponse> {
		const response: PaginationResponse = {
			items_per_page: this._config.items_per_page,
			total_items: totalItems,
		};

		if (this._config.page === 1) {
			response.total_pages = Math.ceil(totalItems / this._config.items_per_page);
		}

		return this._config.skipPagination ? {} : response;
	}

	static getOffset(): number {
		return this._config.offset;
	}

	static getPage(): number {
		return this._config.page;
	}

	static getLimit(): number {
		return this._config.items_per_page;
	}
}

export default PaginationUtils;
