import { Box, Center, CircleIcon, DeleteIcon, HStack, Icon, Pressable, Text } from 'native-base';
import React, { useCallback, useMemo } from 'react';
import { useStoreActions } from '@core/store/store.ts';
import { Alert } from 'react-native';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParams, Routes } from '@src/modules/navigation/helpers/Routes.ts';

export const TabBar = () => {
  const navigation = useNavigation<NavigationProp<RootStackParams>>();
  const [selected, setSelected] = React.useState(1);
  const {
    auth: { logout },
  } = useStoreActions((state) => state);

  const IconF = useMemo(() => {
    return <CircleIcon />;
  }, []);

  const IconDelete = useMemo(() => {
    return <DeleteIcon />;
  }, []);

  const goToUserProfile = useCallback(() => {
    navigation.navigate(Routes.UserProfile);
  }, [navigation]);

  const goToHome = useCallback(() => {
    navigation.navigate(Routes.HomeScreen);
  }, [navigation]);

  const goToCreateChat = useCallback(() => {
    navigation.navigate(Routes.CreateChatScreen);
  }, [navigation]);

  const handleLogout = useCallback(() => {
    Alert.alert('Warning', 'You sure you want to log out?', [
      {
        text: 'Yes',
        onPress: () => {
          logout().then();
        },
        style: 'destructive',
      },
      {
        text: 'No',
        style: 'cancel',
      },
    ]);
  }, []);

  return (
    <Box flex={1} bg="darkBlue.800" width="100%" alignSelf="center" maxH="65px">
      <HStack bg="darkBlue.800" alignItems="center" shadow={6}>
        <Pressable py="3" flex={1} onPress={() => { setSelected(1); goToHome(); }}>
          <Center>
            <Icon mb="1" as={IconF} color="white" size="sm" />
            <Text color="white" fontSize="12">
              Home
            </Text>
          </Center>
        </Pressable>
        <Pressable py="2" flex={1} onPress={() => { setSelected(1); goToUserProfile(); }}>
          <Center>
            <Icon mb="1" as={IconF} color="white" size="sm" />
            <Text color="white" fontSize="12">
              User Profile
            </Text>
          </Center>
        </Pressable>
        <Pressable py="2" flex={1} onPress={() => { setSelected(1); goToCreateChat(); }}>
          <Center>
            <Icon mb="1" as={IconF} color="white" size="sm" />
            <Text color="white" fontSize="12">
              Create Chat
            </Text>
          </Center>
        </Pressable>
        <Pressable py="2" flex={1} onPress={handleLogout}>
          <Center>
            <Icon mb="1" as={IconDelete} color="white" size="sm" />
            <Text color="white" fontSize="12">
              Log Out
            </Text>
          </Center>
        </Pressable>
      </HStack>
    </Box>
  );
};
