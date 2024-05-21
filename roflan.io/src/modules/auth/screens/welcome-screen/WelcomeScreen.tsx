import React, { FC } from 'react';
import { welcomeScreenStyle } from '@src/modules/auth/screens/welcome-screen/welcomeScreen.style.ts';
import { useWelcomeState } from '@src/modules/auth/screens/welcome-screen/welcome.state.ts';

import { ImageBackground, StyleSheet } from 'react-native';
import { Box, Button, Text, VStack } from 'native-base';
import { SVGIcon } from '@components/atoms/icon/Icon.tsx';
import { Localization } from '@core/constants/localization.ts';

const { Wrapper } = welcomeScreenStyle;

export const WelcomeScreen: FC = () => {
  const { goToTermsOfUse, goToSignIn } = useWelcomeState();
  const a = 5;
  return (
    <Wrapper>
      <Box flex={1} bg="darkBlue.900" justifyContent="center" alignItems="center">
        <ImageBackground
          style={styles.image}
        >
          <VStack space={6} alignItems="center">
            <Text color="white" fontSize="3xl">
              {Localization.onboarding.welcome}
            </Text>
            <SVGIcon Img={require('@assets/svg/welcomeIllstratino.svg')} type="welcomeIllustration" />
            <Text color="white" fontSize={18}>
              {Localization.onboarding.text}
            </Text>
            <Button opacity={0.5} onPress={goToSignIn} style={styles.button}>
              {Localization.onboarding.goBtn}
            </Button>
            <Text onPress={goToTermsOfUse} style={styles.terms}>Terms & Privacy Policy</Text>
          </VStack>
        </ImageBackground>
      </Box>
    </Wrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  illustrationPlaceholder: {
    width: 150,
    height: 150,
    backgroundColor: 'lightgray',
    borderRadius: 75,
    marginBottom: 20,
  },
  text: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
    marginHorizontal: 20,
  },
  button: {
    backgroundColor: '#007bff',
    borderRadius: 25,
    paddingLeft: 20,
    paddingRight: 20,
    paddingVertical: 14,
  },
  terms: {
    color: 'white',
    fontSize: 14,
    marginTop: 10,
    textDecorationLine: 'underline',
  },
});
