import styled from 'styled-components/native';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import { DEVICE_HEIGHT } from '@core/constants/defaults.ts';

export const roflanDrawerStyle = {
  DrawerWrapper: styled(DrawerContentScrollView)`
        padding: 0;
        width: 100%;
        height: ${DEVICE_HEIGHT}px;
    `,
  OuterBox: styled.View`
        flex: 1;
        flex-direction: column;
        justify-content: space-between;
        align-items: stretch;
        height: ${DEVICE_HEIGHT}px;
    `,
};
