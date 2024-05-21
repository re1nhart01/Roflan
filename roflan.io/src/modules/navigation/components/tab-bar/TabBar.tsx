import { Box, Center, CircleIcon, HStack, Icon, Pressable, Text } from 'native-base';
import React, { useMemo } from 'react';

export const TabBar = () => {
  const [selected, setSelected] = React.useState(1);

  const IconF = useMemo(() => {
    return <CircleIcon name={selected === 0 ? 'home' : 'home-outline'} />;
  }, [selected]);

  return (
    <Box flex={1} bg="white" width="100%" alignSelf="center" maxH="65px">
      <HStack bg="primary.50" alignItems="center" shadow={6}>
        <Pressable py="3" flex={1}>
          <Center>
            <Icon mb="1" as={IconF} color="white" size="sm" />
            <Text color="black" fontSize="12">
              Home
            </Text>
          </Center>
        </Pressable>
        <Pressable py="2" flex={1} onPress={() => setSelected(1)}>
          <Center>
            <Icon mb="1" as={IconF} color="white" size="sm" />
            <Text color="black" fontSize="12">
              Search
            </Text>
          </Center>
        </Pressable>
        <Pressable py="2" flex={1} onPress={() => setSelected(2)}>
          <Center>
            <Icon mb="1" as={IconF} color="white" size="sm" />
            <Text color="black" fontSize="12">
              Cart
            </Text>
          </Center>
        </Pressable>
        <Pressable py="2" flex={1} onPress={() => setSelected(3)}>
          <Center>
            <Icon mb="1" as={IconF} color="white" size="sm" />
            <Text color="black" fontSize="12">
              Account
            </Text>
          </Center>
        </Pressable>
      </HStack>
    </Box>
  );
};
