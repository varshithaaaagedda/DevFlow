import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const AUTH_TOKEN_KEY = 'devflow_auth_token';
const USER_SESSION_KEY = 'devflow_user_session';
const APP_SETTINGS_KEY = 'devflow_app_settings';

export class StorageService {
  static async setSecureItem(key: string, value: string): Promise<void> {
    try {
      if (Platform.OS === 'web') {
        await AsyncStorage.setItem(key, value);
      } else {
        await SecureStore.setItemAsync(key, value);
      }
    } catch (e) {
      console.warn('StorageService setSecureItem fallback to AsyncStorage:', e);
      await AsyncStorage.setItem(key, value);
    }
  }

  static async getSecureItem(key: string): Promise<string | null> {
    try {
      if (Platform.OS === 'web') {
        return await AsyncStorage.getItem(key);
      }
      return await SecureStore.getItemAsync(key);
    } catch (e) {
      console.warn('StorageService getSecureItem fallback to AsyncStorage:', e);
      return await AsyncStorage.getItem(key);
    }
  }

  static async deleteSecureItem(key: string): Promise<void> {
    try {
      if (Platform.OS === 'web') {
        await AsyncStorage.removeItem(key);
      } else {
        await SecureStore.deleteItemAsync(key);
      }
    } catch (e) {
      await AsyncStorage.removeItem(key);
    }
  }

  static async saveAuthToken(token: string): Promise<void> {
    await this.setSecureItem(AUTH_TOKEN_KEY, token);
  }

  static async getAuthToken(): Promise<string | null> {
    return await this.getSecureItem(AUTH_TOKEN_KEY);
  }

  static async clearSession(): Promise<void> {
    await this.deleteSecureItem(AUTH_TOKEN_KEY);
    await AsyncStorage.removeItem(USER_SESSION_KEY);
  }

  static async saveSettings(settings: any): Promise<void> {
    await AsyncStorage.setItem(APP_SETTINGS_KEY, JSON.stringify(settings));
  }

  static async getSettings(): Promise<any | null> {
    const data = await AsyncStorage.getItem(APP_SETTINGS_KEY);
    return data ? JSON.parse(data) : null;
  }
}
