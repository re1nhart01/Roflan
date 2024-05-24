export interface IUserPreferencesFormTemplate {
    username: string;
    phone: string;
    password: string;
    firstName: string;
    lastName: string;
    patronymic: string;
    role: string;
    sex: string;
    description: string;
}

export interface IUserNamePrefTemplate {
    first_name: string;
    last_name: string;
    patronymic: string;
    details: string;
    sex: string;
}

export interface IUserLocationPrefTemplate {
    city: string;
    country: string;
}

export interface IUserEducationPrefTemplate {
    university: string;
    role: number;
}
