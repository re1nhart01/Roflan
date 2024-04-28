package paginator

type Response struct {
	StatusCode int    `json:"statusCode"`
	Message    string `json:"message"`
}

type ObjectPaginator struct {
	TotalPages int              `json:"total_pages"`
	Page       int              `json:"page"`
	Limit      int              `json:"limit"`
	SortedBy   string           `json:"sorted_by"`
	Data       []map[string]any `json:"data"`
	*Response
}

type ConfigPaginator struct {
	WithTotalPages bool
	WithPage       bool
	WithLimit      bool
	WithSort       bool
	WithWhere      bool
}
