import React, { FC } from 'react';
import { Avatar, Badge, Box, Circle, HStack, Pressable, Spacer, Text, VStack } from 'native-base';
import { ChatTopicType } from '@core/store/storages/chat/chat.store.types.ts';
import { getExactDate, getTimeTextByDate } from '@src/modules/chat/helpers/functions.ts';

type userRowProps = {
  index: number;
  onPress: () => void;
  myUserHash: string;
} & ChatTopicType;

export const UserRow: FC<userRowProps> = ({ onPress, myUserHash, name, is_single, users, ...props }) => {
  const userNotMe = users.find((el) => el.user_hash !== myUserHash);
  const chatName = is_single ? `${userNotMe?.first_name} ${userNotMe?.patronymic} ${userNotMe?.last_name}` : name;
  const lastMessageText = props.lastMessage ? props.lastMessage.body : 'No messages yet';
  const lastMessageData = props.lastMessage ? getTimeTextByDate(new Date(props.lastMessage.created_at)) : '';
  return (
    <Pressable maxW="100%" mb="2" bg="#0f172a" p="4" rounded="lg" shadow={1} onPress={onPress}>
      <HStack alignItems="center" space={3}>
        <Box position="relative">
          <Avatar
            source={require('@assets/png/use.png')}
            size="md"
          />
          <Circle size="3" bg="green.500" position="absolute" bottom="0" right="0" borderWidth="2" borderColor="#0f172a" />
        </Box>
        <VStack>
          <HStack justifyContent="space-between">
            <Text color="white" fontSize="sm" bold>
              {chatName}
            </Text>

          </HStack>
          <Text color="gray.300" fontSize="sm">
            {lastMessageText}
          </Text>
        </VStack>
        <Spacer />
        <VStack justifyContent="space-between" alignItems="center">
          <Text color="gray.400" fontSize="sm">
            {lastMessageData}
          </Text>
        </VStack>
      </HStack>
    </Pressable>
  );
};
