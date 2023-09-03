export interface CustomHttpResponse<T> {
    code: number,
    status_code: string;
    message: string;
    data: T;
}