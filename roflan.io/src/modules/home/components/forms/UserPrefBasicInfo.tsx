import React, { FC, useCallback } from 'react';
import Accordion from '@components/molecules/accordion/Accordion.tsx';
import { Localization } from '@core/constants/localization.ts';
import { Box, Text } from 'native-base';
import { preferencesCommonStyles } from '@src/modules/home/components/forms/common.styles.ts';
import Clipboard from '@react-native-clipboard/clipboard';
import NativeMainModule from '@tm/NativeMainModule.ts';
import { useThrottle } from '@core/hooks/useThrottle.ts';

type userPrefBasicInfoProps = {
    phone: string;
    username: string;
    user_hash: string;
};

const { CodeBox } = preferencesCommonStyles;

export const UserPrefBasicInfo: FC<userPrefBasicInfoProps> = ({ user_hash, username, phone }) => {
  const { isThrottle, manageThrottle } = useThrottle();

  const handleCopyText = useCallback(async (v: string) => {
    if (isThrottle.current) {
      return;
    }
    manageThrottle(3000);
    Clipboard.setString(`${v}`);
    await NativeMainModule.showToastNotification('Roflan', Localization.info.copied);
  }, [isThrottle, manageThrottle]);

  return (
    <Box w="750px" maxH="500px" mb="12">
      <Accordion title={Localization.components.accordions.basicInfo}>
        <Box maxW="750px" pb="12" pt="8">
          <Text fontSize="22" color="white">Username: </Text>
          <CodeBox>
            <Text onPress={() => handleCopyText(username)} color="white" selectable>
              {username}
            </Text>
          </CodeBox>
        </Box>
        <Box maxW="750px" pb="8">
        <Text fontSize="22" color="white">User Identifier: </Text>
          <CodeBox>
            <Text onPress={() => handleCopyText(user_hash)} color="white" selectable>
              {user_hash}
            </Text>
          </CodeBox>
        </Box>
        <Box maxW="750px" pb="8">
        <Text fontSize="22" color="white">Phone: </Text>
          <CodeBox>
            <Text onPress={() => handleCopyText(phone)} color="white" selectable>
              {phone}
            </Text>
          </CodeBox>
        </Box>
      </Accordion>
    </Box>
  );
};
