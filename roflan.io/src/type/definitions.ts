export type ChatEvents = {

}

export interface EventMessage {
    type: ChatEvents;
    data: string;
}

export type RefreshTokenResponse = {
    access_token: string;
    refresh_token: string;
    expires_in: number;
}

export type BaseRequest<T> = {
    statusCode: number;
    message: string;
    response?: T;
}

export type BasePaginatorResponse<T> = {
    'total_pages': number;
    'page': number;
    'limit': number;
    'sorted_by': string;
    'statusCode': number;
    'message': string;
    data: T[] | null;
}
