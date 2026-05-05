import { Platform } from 'react-native';

export const API_BASE_URL = Platform.OS === 'android'
  ? process.env.EXPO_PUBLIC_API_BASE_URL_ANDROID
  : process.env.EXPO_PUBLIC_API_BASE_URL_WEB;