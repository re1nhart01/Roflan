import React from 'react';
import { AddIcon, Box, Icon, IconButton, InfoIcon, VStack } from 'native-base';

const AvatarPicker = () => {
  return (
    <VStack alignItems="center" justifyContent="center">
      <Box position="relative" alignItems="center" justifyContent="center" width={100} height={100} bg="gray.700" borderRadius="full">
        <Icon as={<InfoIcon />} name="person" size="4xl" color="white" />
        <IconButton
          icon={<Icon as={<AddIcon />} name="add" size="lg" color="white" />}
          position="absolute"
          bottom={-2}
          right={-2}
          borderRadius="full"
          bg="blue.500"
          _pressed={{
            bg: 'blue.700',
          }}
          onPress={() => {
            // Add your action here
            console.log('Add Avatar');
          }}
        />
      </Box>
    </VStack>
  );
};

export default AvatarPicker;
