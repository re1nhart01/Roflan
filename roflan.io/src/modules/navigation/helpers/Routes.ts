export enum Routes {
    WelcomeScreen = 'Welcome',
    SignInScreen = 'SignIn',
    SignUpScreen = 'SignUp',
    VerifyScreen = 'VerifyScreen',
    HomeScreen = 'Home',
}

export type RootStackParams = {
    [Routes.WelcomeScreen]: undefined;
    [Routes.SignInScreen]: undefined;
    [Routes.SignUpScreen]: undefined;
    [Routes.VerifyScreen]: {
        phone: string;
    }
    [Routes.HomeScreen]: undefined;
}

export const DrawerBarRoutes = [] as const;
