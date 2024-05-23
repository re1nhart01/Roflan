import React from 'react';
import { Avatar, Badge, Box, Circle, HStack, Pressable, Spacer, Text, VStack } from 'native-base';

export const UserRow = () => {
  return (
    <Pressable bg="#0f172a" p="4" rounded="lg" shadow={1}>
      <HStack alignItems="center" space={3}>
        <Box position="relative">
          <Avatar
            source={require('@assets/png/use.png')}
            size="md"
          />
          <Circle size="3" bg="green.500" position="absolute" bottom="0" right="0" borderWidth="2" borderColor="#0f172a" />
        </Box>
        <VStack flex={1}>
          <HStack justifyContent="space-between">
            <Text color="white" fontSize="md" bold>
              Athalia Putri
            </Text>

          </HStack>
          <Text color="gray.300" fontSize="sm">
            Good morning, did you sleep well?
          </Text>
        </VStack>
        <Spacer />
        <VStack justifyContent="space-between" alignItems="center">
          <Text color="gray.400" fontSize="sm">
            Today
          </Text>
          <Badge colorScheme="purple" rounded="full">
            1
          </Badge>
        </VStack>
      </HStack>
    </Pressable>
  );
};
