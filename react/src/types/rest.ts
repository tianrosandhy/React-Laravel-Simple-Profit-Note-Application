interface QuickRestRequest {
    endpoint: string,
    useBearer?: boolean,
    bearerToken?: string,
    body?: any,
    headers?: Record<string, string>,    
}

interface RestRequest extends QuickRestRequest{
    method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH",
}

interface BackendResponse {
    type?: "success" | "error",
    message: string,
    data: any,
}

interface BackendPaginationDataResponse {
    current_page: number,
    from: number,
    to: number,
    total: number,
    per_page: number,
    last_page: number,
    prev_page_url: string,
    next_page_url: string,
    data: any,
}

export type {QuickRestRequest, RestRequest, BackendResponse, BackendPaginationDataResponse};