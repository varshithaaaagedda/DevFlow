import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { SmartAlert, AlertType, AlertSeverity } from '../types';
import { StorageService } from './StorageService';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export interface NotificationSettings {
  enabled: boolean;
  criticalOnly: boolean;
  buildFailures: boolean;
  prAlerts: boolean;
  hackathonDeadlines: boolean;
}

export const DEFAULT_NOTIFICATION_SETTINGS: NotificationSettings = {
  enabled: true,
  criticalOnly: false,
  buildFailures: true,
  prAlerts: true,
  hackathonDeadlines: true,
};

export type NotificationEventType =
  | 'build_failed'
  | 'pr_merged'
  | 'pr_review_required'
  | 'hackathon_deadline';

export interface EventPayload {
  type: NotificationEventType;
  repository?: string;
  prTitle?: string;
  hackathonName?: string;
  customTitle?: string;
  customBody?: string;
}

class NotificationServiceClass {
  private static instance: NotificationServiceClass;
  private isInitialized = false;
  private onesignalAppId = process.env.EXPO_PUBLIC_ONESIGNAL_APP_ID || 'onesignal_app_devflow_98213';
  private pushToken: string | null = null;

  public static getInstance(): NotificationServiceClass {
    if (!NotificationServiceClass.instance) {
      NotificationServiceClass.instance = new NotificationServiceClass();
    }
    return NotificationServiceClass.instance;
  }

  /**
   * Initialize Expo Notifications & Android Notification Channels
   */
  async initializeNotifications(): Promise<void> {
    if (this.isInitialized) return;

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('devflow_alerts', {
        name: 'DevFlow Smart Alerts',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#00F0FF',
        sound: 'default',
      });

      await Notifications.setNotificationChannelAsync('devflow_critical', {
        name: 'DevFlow Critical Builds',
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 500, 250, 500],
        lightColor: '#EF4444',
        sound: 'default',
      });
    }

    this.configureNotificationHandlers();
    this.isInitialized = true;
    console.log('[NotificationService] Initialized notification channels with OneSignal App ID:', this.onesignalAppId);
  }

  /**
   * Request OS Notification Permissions
   */
  async requestNotificationPermission(): Promise<boolean> {
    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      return finalStatus === 'granted';
    } catch (e) {
      console.warn('Error requesting notification permissions:', e);
      return false;
    }
  }

  /**
   * Get OneSignal / Expo Push Token or Player ID
   */
  async getOneSignalPlayerId(): Promise<string> {
    if (this.pushToken) return this.pushToken;

    try {
      const hasPermission = await this.requestNotificationPermission();
      if (hasPermission) {
        const tokenData = await Notifications.getExpoPushTokenAsync();
        this.pushToken = tokenData.data;
        return this.pushToken;
      }
    } catch (e) {
      console.warn('Fallback push token generated:', e);
    }

    this.pushToken = `player_onesignal_devflow_${Date.now()}`;
    return this.pushToken;
  }

  /**
   * Configure foreground / background notification handlers and deep-link routing
   */
  configureNotificationHandlers(onDeepLink?: (route: string) => void): void {
    Notifications.addNotificationReceivedListener(notification => {
      console.log('[NotificationReceived]', notification.request.content.title);
    });

    Notifications.addNotificationResponseReceivedListener(response => {
      const data = response.notification.request.content.data as any;
      console.log('[NotificationClicked] Data:', data);

      if (onDeepLink && data && data.type) {
        switch (data.type) {
          case 'build_failed':
            onDeepLink('/(tabs)/alerts');
            break;
          case 'pr_merged':
          case 'pr_review_required':
            onDeepLink('/(tabs)/repositories');
            break;
          case 'hackathon_deadline':
            onDeepLink('/(tabs)/hackathons');
            break;
          default:
            onDeepLink('/(tabs)/alerts');
            break;
        }
      }
    });
  }

  /**
   * Build title and body for required notification events
   */
  public formatEventNotification(payload: EventPayload): { title: string; body: string; severity: AlertSeverity } {
    switch (payload.type) {
      case 'build_failed':
        return {
          title: '🚨 Build Failed',
          body: `${payload.repository || 'DevFlow-Mobile'} main branch failed. Tap to view logs.`,
          severity: 'critical',
        };

      case 'pr_merged':
        return {
          title: '✅ Pull Request Merged',
          body: `${payload.prTitle || 'Feature branch'} was merged into ${payload.repository || 'DevFlow-Mobile'}.`,
          severity: 'informational',
        };

      case 'pr_review_required':
        return {
          title: '🟡 Review Required',
          body: `${payload.prTitle || 'RevenueCat service PR'} is waiting for your review.`,
          severity: 'important',
        };

      case 'hackathon_deadline':
        return {
          title: '⏰ Hackathon Deadline',
          body: `${payload.hackathonName || 'RevenueCat Mobile Hackathon'} deadline is approaching.`,
          severity: 'important',
        };

      default:
        return {
          title: payload.customTitle || '🔔 DevFlow Alert',
          body: payload.customBody || 'New GitHub repository update available.',
          severity: 'informational',
        };
    }
  }

  /**
   * Dispatch local test notification or server-side push simulation
   */
  async sendTestNotification(payload: EventPayload, settings?: NotificationSettings): Promise<SmartAlert | null> {
    await this.initializeNotifications();

    const activeSettings = settings || (await this.getSavedNotificationSettings());
    if (!activeSettings.enabled) {
      console.log('[NotificationService] Push notifications currently disabled in settings.');
      return null;
    }

    const formatted = this.formatEventNotification(payload);

    if (activeSettings.criticalOnly && formatted.severity !== 'critical') {
      console.log('[NotificationService] Filtered non-critical notification due to Critical-Only setting.');
      return null;
    }

    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: formatted.title,
          body: formatted.body,
          data: { type: payload.type, repository: payload.repository },
          sound: 'default',
        },
        trigger: null,
      });
    } catch (e) {
      console.warn('Local notification schedule fallback:', e);
    }

    const newAlert: SmartAlert = {
      id: `alert-${Date.now()}`,
      title: formatted.title,
      description: formatted.body,
      repository: payload.repository || 'DevFlow-Mobile',
      timestamp: 'Just now',
      severity: formatted.severity,
      type: payload.type as AlertType,
      read: false,
    };

    return newAlert;
  }

  /**
   * Get / Save User Notification Preferences
   */
  async getSavedNotificationSettings(): Promise<NotificationSettings> {
    const data = await StorageService.getSettings();
    if (data && data.notificationSettings) {
      return data.notificationSettings;
    }
    return DEFAULT_NOTIFICATION_SETTINGS;
  }

  async saveNotificationSettings(settings: NotificationSettings): Promise<void> {
    const existing = (await StorageService.getSettings()) || {};
    await StorageService.saveSettings({
      ...existing,
      notificationSettings: settings,
    });
  }
}

export const notificationService = NotificationServiceClass.getInstance();
