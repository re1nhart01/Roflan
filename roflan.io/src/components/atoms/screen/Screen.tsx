import React from 'react';
import type { SafeAreaViewProps } from 'react-native-safe-area-context';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { Edge } from 'react-native-safe-area-context/src/SafeArea.types';
import styled from 'styled-components/native';
import {theme} from "native-base";

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
    {children}
  </Wrapper>
);

const Wrapper = styled(SafeAreaView)<{
    height?: number;
    horizontalPadding?: number;
    verticalPadding?: number;
}>`
  flex: 1;
  background-color: ${theme.colors.black};
`;
