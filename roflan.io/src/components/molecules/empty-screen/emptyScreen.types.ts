import { ImageSourcePropType } from 'react-native';
import { TIconNames } from '@components/atoms/icon/Icon.tsx';

export type EmptyScreenProps = {
  iconType?: TIconNames;
  text: string;
  marginTop?: number;
  paddingHorizontal?: number;
  inverted?: boolean;
  Img?: ImageSourcePropType;
};
