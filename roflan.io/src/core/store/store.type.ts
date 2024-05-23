import { IAppStore } from '@core/store/storages/app/app.store.type';
import { IAuthStore } from '@core/store/storages/auth/auth.store.type.ts';
import { IUserStore } from '@core/store/storages/user/user.store.type.ts';
import { ChatsModel } from '@core/store/storages/chat/chat.store.types.ts';

export interface StoreModel {
    app: IAppStore;
    auth: IAuthStore;
    user: IUserStore;
    chats: ChatsModel;
}
