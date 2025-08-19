import axios, { AxiosRequestConfig, Method } from "axios";
import config from "../config/config";
import { SERVICE_NAME } from "../constant/common";

export interface ApiRequestOptions {
    serviceType: SERVICE_NAME;
    endpoint: string;
    method: Method;
    headers: Record<string, unknown>;
    data?: Record<string, any>;
    params?: Record<string, any>;
    timeout?: number;
}

interface ApiResponse<T> {
    response: T;
    statusCode: number;
}

const apiClient = axios.create({
    timeout: 30000, // default time limit 30 sec
});

export const apiRequest = async <T>({
    serviceType,
    endpoint,
    method = "GET",
    headers = {},
    data = {},
    params = {},
    timeout = 30000,
}: ApiRequestOptions): Promise<ApiResponse<T>> => {
    let serviceBaseUrl = "";

    switch (serviceType) {
        case SERVICE_NAME.CAMPAIGN:
            serviceBaseUrl = config.CAMPAIGN_URL;
            break;
        case SERVICE_NAME.EMAIL:
            serviceBaseUrl = config.EMAIL_URL;
            break;
        case SERVICE_NAME.AUTH:
            serviceBaseUrl = config.AUTH_URL!;
            break;
        default:
            throw new Error("Invalid service type");
    }

    const mergeHeaders: Record<string, any> = {
        ...apiClient.defaults.headers,
        ...headers,
    };
    const requestConfig: AxiosRequestConfig = {
        url: `${serviceBaseUrl}/${endpoint}`,
        method: method,
        headers: mergeHeaders,
        timeout,
        data: data ? data : {},
        params: params ? params : {},
    };

    try {
        const response = await apiClient(requestConfig);

        return {
            response: response.data,
            statusCode: response.status,
        };
    } catch (error: any) {
        console.log(
            `API Error from ${JSON.stringify(requestConfig)}`,
            error.response?.data || error.response || error
        );
        if (!error.response) {
            throw error;
        }
        return {
            response: error.response.data,
            statusCode: error.response.status,
        };
    }
};

export interface ThirdPartyApiRequestOptions {
    url: string;
    method: Method;
    headers: Record<string, unknown>;
    data?: Record<string, any>;
    params?: Record<string, any>;
    timeout?: number;
}

export const thirdPartyApiRequest = async <T>({
    url,
    method = "GET",
    headers = {},
    data = {},
    params = {},
    timeout = 30000,
}: ThirdPartyApiRequestOptions): Promise<ApiResponse<T>> => {
    const mergeHeaders: Record<string, any> = {
        ...apiClient.defaults.headers,
        ...headers,
    };
    const requestConfig: AxiosRequestConfig = {
        url: url,
        method: method,
        headers: mergeHeaders,
        timeout,
        data: data ? data : {},
        params: params ? params : {},
    };

    try {
        const response = await apiClient(requestConfig);

        return {
            response: response.data,
            statusCode: response.status,
        };
    } catch (error: any) {
        console.log(
            `API Error from ${JSON.stringify(requestConfig)}`,
            error.response?.data || error.response || error
        );
        if (!error.response) {
            throw error;
        }
        return {
            response: error.response.data,
            statusCode: error.response.status,
        };
    }
};
