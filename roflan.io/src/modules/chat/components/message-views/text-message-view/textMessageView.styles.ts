import { equals } from 'ramda';
import styled from 'styled-components/native';
import { theme } from 'native-base';
import { SVGIcon } from '@components/atoms/icon/Icon.tsx';
import { UIMessageType } from '@src/modules/chat/helpers/types.ts';

export const textMessageViewStyles = {
  Wrapper: styled.View<{ isMyMessage: boolean }>`
    background-color: transparent;
    width: 100%;
    flex-direction: row;
    justify-content: ${({ isMyMessage }) =>
    (isMyMessage ? 'flex-end' : 'flex-start')};
    padding-left: 16px;
    padding-right: 16px;
  `,
  MessageTile: styled.View`
    flex-direction: column;
  `,
  ContentText: styled.Text`
    font-size: 18px;
    font-weight: 400;
    color: ${theme.colors.black};
    line-height: 20;
    z-index: 8;
    max-width: 220px;
  `,
  InnerContainer: styled.View`
    flex-direction: row;
    justify-content: space-between;
    z-index: 9;
  `,
  MessageContainer: styled.View<{
    isLocal?: boolean;
    isMyMessage: boolean;
    uiMessageType: UIMessageType;
  }>`
    opacity: ${({ isLocal }) => (isLocal ? 0.5 : 1)};
    min-width: 60px;
    max-width: 500px;
    background-color: white;
    justify-content: space-between;
    flex-direction: row;
    flex-wrap: wrap;
    padding: 6px;
    border-radius: 10px;
    ${({ uiMessageType, isMyMessage }) => {
    if (equals(uiMessageType, UIMessageType.first)) {
      return `
           ${
  isMyMessage
    ? 'border-bottom-right-radius'
    : 'border-bottom-left-radius'
}: 0px;
           margin-top: 8px;
           margin-bottom: 3px;
        `;
    } if (equals(uiMessageType, UIMessageType.middle)) {
      return `
           margin-top: 3px;
           margin-bottom: 3px;
           border-radius: 8px;
        `;
    } if (equals(uiMessageType, UIMessageType.end)) {
      return `
          border-radius: 8px;
          margin-top: 3px;
          margin-bottom: 8px;
        `;
    }
    return `
          margin-top: 8px;
          margin-bottom: 8px;
        `;
  }}
  `,
  MessageFang: styled(SVGIcon)<{ isMyMessage: boolean; uiMessageType?: UIMessageType }>`
    position: absolute;
    ${({ isMyMessage }) => (isMyMessage ? 'right' : 'left')}: -5px;
    bottom: 0;
  `,
  DateWrapper: styled.View`
    margin-left: 12px;
    z-index: 8;
    height: auto;
    flex-direction: column;
    justify-content: flex-end;
  `,
  DateText: styled.Text`
    font-size: 12px;
    font-weight: 400;
    color: ${theme.colors.coolGray['400']};
    line-height: 20;
  `,
  NameLabelText: styled.Text`
    font-size: 12px;
    font-weight: 400;
    color: ${theme.colors.primary['300']};
    margin-top: 15px;
    line-height: 12;
    margin-bottom: 8px;
  `,
};
