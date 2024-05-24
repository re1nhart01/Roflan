import { isEmpty } from 'ramda';
import type { FC } from 'react';
import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type {
  NativeSyntheticEvent,
  TextInput,
  TextInputContentSizeChangeEventData,
} from 'react-native';
import { Keyboard } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Localization } from '@core/constants/localization.ts';
import { Image } from 'native-base';
import { chatInputViewStyles } from './chatInputView.styles';

type chatInputViewProps = {
  keep?: never;
  onSendMessage(value: string, attachments: never[]): void;
};

const {
  Wrapper,
  ChatButtonIcon,
  ButtonView,
  MessageInput,
  ActionsRow,
  Spacer,
} = chatInputViewStyles;

const ChatInputView: FC<chatInputViewProps> = ({ onSendMessage }) => {
  const { bottom } = useSafeAreaInsets();
  const [isActiveKeyboard, setIsActiveKeyboard] = useState(false);
  const keyboardInset = isActiveKeyboard ? 0 : bottom;
  const hitSlop = { top: 30, bottom: 30, left: 30 };
  const { t } = useTranslation();
  const inputRef = useRef<TextInput>(null);
  const [inputHeight, setInputHeight] = useState(48);
  const [inputValue, setInputValue] = useState('');
  const [selectedAttachments, setSelectedAttachments] = useState<never[]>([]);

  const handleSendMessage = useCallback(() => {
    if (isEmpty(inputValue)) return;
    onSendMessage?.(inputValue, selectedAttachments);
    setInputValue('');
    setSelectedAttachments([]);
  }, [inputValue, onSendMessage, selectedAttachments]);

  // const handleAttachFile = useCallback(() => {
  //   Alert.alert("Warning", "NOT IMPLEMENTED!");
  // }, []);

  const onContentSizeChanged = useCallback(
    (e: NativeSyntheticEvent<TextInputContentSizeChangeEventData>) => {
      setInputHeight(e.nativeEvent.contentSize.height);
    },
    [],
  );

  useEffect(() => {
    const subscriptionShow = Keyboard.addListener('keyboardWillShow', () => {
      setIsActiveKeyboard(true);
    });
    const subscriptionHide = Keyboard.addListener('keyboardWillHide', () => {
      setIsActiveKeyboard(false);
    });
    return () => {
      subscriptionShow.remove();
      subscriptionHide.remove();
    };
  }, []);

  return (
    <>
      <Wrapper>
        <ActionsRow>
          <MessageInput
            hitSlop={hitSlop}
            returnKeyType="done"
            ref={inputRef}
            blurOnSubmit
            scrollEnabled
            maxLength={1024}
            textAlign="left"
            textAlignVertical="center"
            value={inputValue}
            onChangeText={setInputValue}
            textBreakStrategy="highQuality"
            style={{ height: inputHeight }}
            multiline
            placeholder={`${Localization.components.text_input_placeholder}`}
            onContentSizeChange={onContentSizeChanged}
          />
          {/* <ButtonView disabled onPress={handleAttachFile}> */}
          {/*  <ChatButtonIcon type="attach" /> */}
          {/* </ButtonView> */}
          <ButtonView onPress={handleSendMessage}>
            <Image maxW="25" maxH="25" source={require('@assets/png/send.png')} alt="send.png" />
          </ButtonView>
        </ActionsRow>
      </Wrapper>
      <Spacer height={keyboardInset} />
    </>
  );
};

export default memo(ChatInputView);
