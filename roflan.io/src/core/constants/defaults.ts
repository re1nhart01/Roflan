import { Dimensions, Platform } from 'react-native';

export const isIOS = Platform.OS === 'ios';
export const MAJOR_VERSION_IOS = 12;
export const majorVersionIOS = parseInt(String(Platform.Version), 10);
export const isAlreadyMajorIOS = isIOS && majorVersionIOS > MAJOR_VERSION_IOS;
export const ACTIVE_OPACITY = 0.7;
export const DEFAULT_HORIZONTAL_PADDING_TAB = 16;

export const DEVICE_WIDTH = Dimensions.get('window').width;
export const DEVICE_HEIGHT = Dimensions.get('window').height;
export const SMALL_DEVICE_HEIGHT = 660;
export const SCREEN_HEIGHT = Dimensions.get('screen').height;
export const OPEN_SHEET_HEIGHT = DEVICE_HEIGHT / 5;
export const LANGUAGE_STORAGE_KEY = 'language';
export const STICKY_HEADER_HEIGHT = 106;
export const MAX_NAVIGATION_REF_COUNTER = 20;
export const BACKSPACE = 'Backspace';
export const UKR_PHONE_CODE = '+380';
export const REFRESH_CONTROL_TIMEOUT = 10000;
export const REFRESH_CONTROL_TIMEOUT2 = 4000;

const guidelineBaseWidth = 430;
const guidelineBaseHeight = 932;

export const scale = (size: number) =>
  Math.round((DEVICE_WIDTH / guidelineBaseWidth) * size);

export const verticalScale = (size: number) =>
  Math.round((DEVICE_HEIGHT / guidelineBaseHeight) * size);
export const SUPPORT_PHONE_NUMBER = '0443449000';
// use this variale to set path into your useTranslation t(localization.auth.path.to.your.item)

export const statusCodes = {
  UNPROCESSED_ENTITY: 422,
  NOT_FOUND: 404,
  SERVER_ERROR: 500,
  OK: 200,
};

export const UA_NUMBER_LENGTH = 9;
