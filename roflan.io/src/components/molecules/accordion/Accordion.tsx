import React, { FC, PropsWithChildren, useCallback, useRef, useState } from 'react';
import { Animated } from 'react-native';
import { Box, Pressable, Text } from 'native-base';

type accordionProps = PropsWithChildren<{
    title: string;
}>

const Accordion: FC<accordionProps> = ({ title, children }) => {
  const [expanded, setExpanded] = useState(false);
  const animationController = useRef(new Animated.Value(0)).current;

  const toggleAccordion = useCallback(() => {
    const toValue = expanded ? 0 : 1;
    Animated.timing(animationController, {
      toValue,
      duration: 300,
      useNativeDriver: false,
    }).start();
    setExpanded(!expanded);
  }, [animationController, expanded]);

  const bodyHeight = animationController.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'], // Adjust 100 to the content height you expect
  });

  return (
    <Box borderWidth="1" borderColor="coolGray.300" borderRadius="md" overflow="hidden" maxW="750px">
      <Pressable onPress={toggleAccordion}>
        <Box px="4" py="2">
          <Text color="white" fontSize="md" bold>
            {title}
          </Text>
        </Box>
      </Pressable>
      <Animated.View style={{ height: bodyHeight, overflow: 'hidden', width: '100%' }}>
        <Box px="4" py="2" bg="transparent">
          {children}
        </Box>
      </Animated.View>
    </Box>
  );
};

export default Accordion;
