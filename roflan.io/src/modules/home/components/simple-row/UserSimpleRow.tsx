import React, { FC } from 'react';
import { Avatar, Badge, Box, Circle, HStack, Pressable, Spacer, Text, VStack } from 'native-base';
import { UserModelMe } from '@type/models.ts';

type simpleUserRowProps = {
    index: number;
    onPress: () => void;
    isActive: boolean;
} & UserModelMe;

export const SimpleUserRow: FC<simpleUserRowProps> = ({ university, onPress, isActive, username, first_name, last_name, patronymic, role }) => {
  return (
    <Pressable bg={!isActive ? '#0f172a' : '#7ca7eb'} p="4" rounded="lg" shadow={1} mb="2" onPress={onPress}>
      <HStack alignItems="center" space={3}>
        <Box position="relative">
          <Avatar
            source={require('@assets/png/use.png')}
            size="md"
          />
          <Circle size="3" bg="green.500" position="absolute" bottom="0" right="0" borderWidth="2" borderColor="#0f172a" />
        </Box>
        <VStack flex={1}>
          <Text color="white" fontSize="md" bold>
            { username }
          </Text>
          <Text color="white" fontSize="md" bold>
            { first_name }
            {' '}
            { patronymic }
            {' '}
            { last_name }
          </Text>
          <Text color="white" fontSize="md" bold>
            { role === 1 ? 'Graduate' : 'Student' }
            {' '}
            { university }
          </Text>
        </VStack>
        <Spacer />
      </HStack>
    </Pressable>
  );
};
