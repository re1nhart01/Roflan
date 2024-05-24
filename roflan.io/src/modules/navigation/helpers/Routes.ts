export enum Routes {
    WelcomeScreen = 'Welcome',
    SignInScreen = 'SignIn',
    SignUpScreen = 'SignUp',
    VerifyScreen = 'VerifyScreen',
    HomeScreen = 'Home',
    UserProfile = 'User Profile',
    ChatScreen = 'Chat',
    CreateChatScreen = "Create Chat",
}

export type RootStackParams = {
    [Routes.WelcomeScreen]: undefined;
    [Routes.SignInScreen]: undefined;
    [Routes.SignUpScreen]: undefined;
    [Routes.VerifyScreen]: {
        phone: string;
    }
    [Routes.HomeScreen]: undefined;
    [Routes.ChatScreen]: { topicId: string };
    [Routes.UserProfile]: undefined;
    [Routes.CreateChatScreen]: undefined;
}

export const DrawerBarRoutes = [] as const;
