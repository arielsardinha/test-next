
"use server"
import axios, { AxiosInstance, AxiosResponse } from "axios";

interface ResponseAdpt<T> {
    body: T;
    status: number;
}

export interface RequestAdapt<T> {
    url: string;
    data?: T;
    params?: any;
    headers?: any;
}

export interface GetAllDataSource {
    getAll<T = unknown, D = any>(request: RequestAdapt<D>): Promise<ResponseAdpt<T[]>>;
}

export interface GetDataSource {
    get<T = unknown, D = any>(request: RequestAdapt<D>): Promise<ResponseAdpt<T>>;
}

export interface PostDataSource {
    post<T = unknown, D = any>(request: RequestAdapt<D>): Promise<ResponseAdpt<T>>;
}

export interface PutDataSource {
    put<T = unknown, D = any>(request: RequestAdapt<D>): Promise<ResponseAdpt<T>>;
}

export interface DeleteDataSource {
    delete_<T = unknown, D = any>(request: RequestAdapt<D>): Promise<ResponseAdpt<T>>;
}

export type DataSource = GetAllDataSource & GetDataSource & PostDataSource & PutDataSource & DeleteDataSource;

const axiosInstance: AxiosInstance = axios.create({
    baseURL: 'https://alunos.treinaweb.com.br/tw-todos/api/v1',
});

export async function getAll<T = unknown, D = any>(request: RequestAdapt<D>): Promise<ResponseAdpt<T[]>> {
    const response: AxiosResponse<T[]> = await axiosInstance.get(request.url, {
        params: request.params,
        headers: request.headers,
    });
    return { body: response.data, status: response.status };
}

export async function get<T = unknown, D = any>(request: RequestAdapt<D>): Promise<ResponseAdpt<T>> {
    const response: AxiosResponse<T> = await axiosInstance.get(request.url, {
        params: request.params,
        headers: request.headers,
    });
    return { body: response.data, status: response.status };
}

export async function post<T = unknown, D = any>(request: RequestAdapt<D>): Promise<ResponseAdpt<T>> {
    const response: AxiosResponse<T> = await axiosInstance.post(request.url, request.data, {
        headers: request.headers,
    });
    return { body: response.data, status: response.status };
}

export async function put<T = unknown, D = any>(request: RequestAdapt<D>): Promise<ResponseAdpt<T>> {
    const response: AxiosResponse<T> = await axiosInstance.put(request.url, request.data, {
        headers: request.headers,
    });
    return { body: response.data, status: response.status };
}

export async function delete_<T = unknown, D = any>(request: RequestAdapt<D>): Promise<ResponseAdpt<T>> {
    const response: AxiosResponse<T> = await axiosInstance.delete(request.url, {
        headers: request.headers,
    });
    return { body: response.data, status: response.status };
}