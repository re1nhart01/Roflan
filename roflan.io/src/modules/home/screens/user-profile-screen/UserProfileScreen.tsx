import React, { FC } from 'react';
import { Localization } from '@core/constants/localization.ts';
import { Box, Image, ScrollView, Text } from 'native-base';
import { userProfileScreenStyle } from '@src/modules/home/screens/user-profile-screen/userProfileScreen.style.ts';
import { UserPrefBasicInfo } from '@src/modules/home/components/forms/UserPrefBasicInfo.tsx';
import { UserPrefNameInfo } from '@src/modules/home/components/forms/UserPrefNameInfo.tsx';
import { UserPrefLocationInfo } from '@src/modules/home/components/forms/UserPrefLocationInfo.tsx';
import { UserPrefEducationInfo } from '@src/modules/home/components/forms/UserPrefEducationInfo.tsx';
import { useUserProfileState } from '@src/modules/home/screens/user-profile-screen/userProfile.state.ts';
import { defaultTo } from 'ramda';

const { ButtonStyle, Wrapper } = userProfileScreenStyle;

export const UserProfileScreen: FC = () => {
  const { updateUserField, userData } = useUserProfileState();
  console.log(userData);
  const phone = defaultTo('', userData?.phone);
  const user_hash = defaultTo('', userData?.user_hash);
  const username = defaultTo('', userData?.username);
  const lastName = defaultTo('', userData?.last_name);
  const firstName = defaultTo('', userData?.first_name);
  const patronymic = defaultTo('', userData?.patronymic);
  const details = defaultTo('', userData?.details);
  const city = defaultTo('', userData?.city);
  const country = defaultTo('', userData?.country);
  const sex = defaultTo('', userData?.sex);
  const role = defaultTo(1, userData?.role);
  const university = defaultTo('', userData?.university);

  return (
    <Wrapper>
      <Box flex={1} bg="darkBlue.900" pt="16" alignItems="center">
        <Text fontWeight="bold" textAlign="center" color="white" fontSize={48} mb="8">
          {Localization.components.userProfileEdit}
        </Text>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Box flex={1} alignItems="center">
            <Box mb="8" borderWidth="4" borderColor="rgba(255,255,255,0.5)" borderRadius="full" width="200px" height="200px" justifyContent="center" alignItems="center">
              <Image tintColor="rgba(255,255,255,0.5)" maxW="150px" maxH="150px" resizeMode="cover" source={require('@assets/png/use.png')} alt="use.png" />
            </Box>
            <UserPrefBasicInfo phone={phone} user_hash={user_hash} username={username} />
            <UserPrefNameInfo last_name={lastName} first_name={firstName} details={details} sex={sex} patronymic={patronymic} onSubmission={updateUserField} />
            <UserPrefLocationInfo city={city} country={country} onSubmission={updateUserField} />
            <UserPrefEducationInfo onSubmission={updateUserField} role={role} university={university} />
          </Box>
        </ScrollView>
      </Box>
    </Wrapper>
  );
};
