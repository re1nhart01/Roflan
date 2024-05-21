import React from 'react';
import type { SvgProps } from 'react-native-svg';
import styled from 'styled-components/native';
import { Image } from 'react-native';

import { theme } from 'native-base';
import { ICONS } from './icon.constants';

export type TIconNames = keyof typeof ICONS;

export type IconProps = {
  type: TIconNames;
  Img: ReturnType<typeof require>;
  color?: keyof typeof theme.colors | string;
  size?: number;
};

export const SVGIcon = ({
  Img,
  type,
  size,
  style,
  color = 'lightBlack',
  onPress,
  hitSlop,
}: SvgProps & IconProps) => {
  const { width, height } = Image.resolveAssetSource(Img);
  const iconHeight = size ?? width;
  const iconWidth = size ?? height;
  const currentColor =
    theme.colors[color as keyof typeof theme.colors] ?? color;

  return onPress ? (
    <Wrapper
      onPress={onPress}
      hitSlop={hitSlop}
      activeOpacity={1}
      style={[
        {
          height: iconHeight,
          width: iconWidth,
        },
        style,
      ]}
    >
      <Image
        source={Img}
        style={{
          height: iconHeight,
          width: iconWidth,
          tintColor: color,
        }}
        alt={type}
      />
    </Wrapper>
  ) : (
    <Image
      source={Img}
      style={{
        height: iconHeight,
        width: iconWidth,
        tintColor: color,
      }}
      alt={type}
    />
  );
};

const Wrapper = styled.TouchableOpacity.attrs(({ theme }) => ({
  activeOpacity: theme.opacity.active,
}))`
  display: flex;
  justify-content: center;
  align-items: center;
`;
