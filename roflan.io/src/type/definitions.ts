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
