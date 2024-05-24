export interface UserRegisterModel {
    username: string;
    password: string;
    first_name: string;
    last_name: string;
    patronymic: string;
    role: number;
    phone: string;
    sex: string;
}

export interface UserModelMe {
    'active': boolean;
    'birthday': string;
    'city': string;
    'country': string;
    'created_at': string;
    'deleted_at': string | null;
    'details': string;
    'disabled_notifications': boolean;
    'first_name': string;
    'id': number;
    'lang': string;
    'last_name': string;
    'password'?: string;
    'patronymic': string;
    'phone': string;
    'private_mode': boolean;
    'role': number;
    'sex': string;
    'theme': string;
    'university': string;
    'updated_at': string;
    'user_hash': string;
    'user_hash_id': string;
    'username': string;
}
