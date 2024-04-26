import {QuickRestRequest, RestRequest, BackendResponse} from "@/types/rest";

const get = async (request:QuickRestRequest) => {
    const rr:RestRequest = {...request, method: "GET"};
    return Call(rr);
}

const post = async (request:QuickRestRequest) => {
    const rr:RestRequest = {...request, method: "POST"};
    return Call(rr);
}

const put = async (request:QuickRestRequest) => {
    const rr:RestRequest = {...request, method: "PUT"};
    return Call(rr);
}

const patch = async (request:QuickRestRequest) => {
    const rr:RestRequest = {...request, method: "PATCH"};
    return Call(rr);
}

const del = async (request:QuickRestRequest) => {
    const rr:RestRequest = {...request, method: "DELETE"};
    return Call(rr);
}

const Call = async (restRequest:RestRequest) => {
    const baseURL = import.meta.env.VITE_BE_URL;
    const basicToken = import.meta.env.VITE_BE_BASIC_KEY;

    try {
        const response = await fetch(baseURL + restRequest.endpoint, {
            method: restRequest.method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': (restRequest.useBearer && restRequest.bearerToken && restRequest.bearerToken.length > 0) ? `Bearer ${restRequest.bearerToken}` : `Basic ${basicToken}`,
                ...restRequest.headers,
            },
            body: typeof restRequest.body == "undefined" ? null: typeof restRequest.body == "string" ? restRequest.body : JSON.stringify(restRequest.body),        
        });
    
        const bodyResp:BackendResponse = await response.json();    
        return bodyResp;
    } catch (error) {
        return null;
    }
}

export {get, post, put, patch, del, Call};

export type {RestRequest, BackendResponse};