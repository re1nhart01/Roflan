import React, { FC, useCallback } from 'react';
import { useCreateChatScreenState } from '@src/modules/home/screens/create-chat-screen/createChat.state.ts';
import { Box, Text, theme } from 'native-base';
import { AnimatedInput } from '@components/molecules/animated-input/AnimatedInput.tsx';
import { Localization } from '@core/constants/localization.ts';
import { createChatStyle } from '@src/modules/home/screens/create-chat-screen/createChat.style.ts';
import { FlatList, ListRenderItem } from 'react-native';
import { SimpleUserRow } from '@src/modules/home/components/simple-row/UserSimpleRow.tsx';
import { UserModelMe } from '@type/models.ts';
import { DEVICE_WIDTH } from '@core/constants/defaults.ts';
import { defaultTo } from 'ramda';

const { Wrapper, ButtonStyle } = createChatStyle;

export const CreateChat: FC = () => {
  const {
    chatName,
    handleCreateOrGoToChat,
    handleSetIsSingle,
    isSingle,
    onRefreshPress,
    userList,
    selectedUsers,
    handleAddOrRemoveUser,
    handleSetChatName } = useCreateChatScreenState();

  const isSingleColor = isSingle ? theme.colors.primary['100'] : theme.colors.amber['900'];

  const renderItem: ListRenderItem<UserModelMe> = useCallback(({ item, index }) => {
    console.log(selectedUsers.includes(item.user_hash), 'inc');
    return (
      <SimpleUserRow
        {...item}
        index={index}
        isActive={selectedUsers.includes(item.user_hash)}
        onPress={() => handleAddOrRemoveUser(item.user_hash)}
      />
    );
  }, [handleAddOrRemoveUser, selectedUsers]);

  return (
    <Wrapper>
      <Box flex={1} bg="darkBlue.900" pt="8">
        <Box alignItems="center" justifyContent="center">
          <Box maxW="750px" pb="12" pt="8">
            <AnimatedInput
              maxLength={100}
              value={chatName}
              placeholder={Localization.placeholders.chatName}
              setText={handleSetChatName}
            />
            <Box maxW="750px" pt="8">
              <ButtonStyle backgroundColor={isSingleColor} onPress={handleSetIsSingle}>
                <Text color={isSingle ? theme.colors.black : theme.colors.white} fontSize={14}>
                  {isSingle ? Localization.components.isSingle : Localization.components.isNotSingle}
                </Text>
              </ButtonStyle>
            </Box>
            <Box maxW="750px" pt="2">
              <ButtonStyle backgroundColor="#007bff" onPress={handleCreateOrGoToChat}>
                <Text color="white" fontSize={14}>
                  {Localization.components.createChat}
                </Text>
              </ButtonStyle>
            </Box>
          </Box>
        </Box>
        <Box w={`${DEVICE_WIDTH}`} pl="4" pr="4" pb="40">
          <Text fontWeight="bold" textAlign="left" color="white" fontSize={32} mb="2">
            {Localization.components.users}
          </Text>
          <FlatList
            contentContainerStyle={{ paddingBottom: '50%' }}
            data={defaultTo([], userList)}
            renderItem={renderItem}
            keyExtractor={(item) => `${item.id}`}
          />
        </Box>
      </Box>
    </Wrapper>
  );
};
