import React from 'react';
import type { SafeAreaViewProps } from 'react-native-safe-area-context';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { Edge } from 'react-native-safe-area-context/src/SafeArea.types';
import styled from 'styled-components/native';
import { Box, theme } from 'native-base';

type ScreenProps = {
    horizontalPadding?: number;
    verticalPadding?: number;
    showsVerticalScrollIndicator?: boolean;
    overrideEdges?: ReadonlyArray<Edge>;
};

type SafeAreaViewScreenProps = SafeAreaViewProps & ScreenProps;

export const Screen = ({
  children,
  horizontalPadding,
  verticalPadding,
  overrideEdges,
  ...props
}: SafeAreaViewScreenProps) => (
  <Wrapper
    edges={overrideEdges || ['right', 'left']}
    horizontalPadding={horizontalPadding}
    verticalPadding={verticalPadding}
    {...props}
  >
    <Box flex={1} bg="darkBlue.900" justifyContent="center" alignItems="center">
      {children}
    </Box>
  </Wrapper>
);

const Wrapper = styled(SafeAreaView)<{
    height?: number;
    horizontalPadding?: number;
    verticalPadding?: number;
}>`
    width: 100%;
    height: 100%;
    flex: 1;
    background-color: ${theme.colors.dark['900']};
`;
