import { useState, useEffect, useCallback } from 'react';
import { 
  notificationService, 
  NotificationSettings, 
  DEFAULT_NOTIFICATION_SETTINGS, 
  EventPayload 
} from '../services/notificationService';
import { SmartAlert } from '../types';

interface UseNotificationsReturn {
  playerId: string | null;
  hasPermission: boolean;
  settings: NotificationSettings;
  isInitializing: boolean;
  requestPermission: () => Promise<boolean>;
  updateSettings: (newSettings: Partial<NotificationSettings>) => Promise<void>;
  triggerNotification: (payload: EventPayload) => Promise<SmartAlert | null>;
}

export const useNotifications = (): UseNotificationsReturn => {
  const [playerId, setPlayerId] = useState<string | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean>(false);
  const [settings, setSettings] = useState<NotificationSettings>(DEFAULT_NOTIFICATION_SETTINGS);
  const [isInitializing, setIsInitializing] = useState<boolean>(true);

  useEffect(() => {
    const init = async () => {
      setIsInitializing(true);
      await notificationService.initializeNotifications();
      const savedSettings = await notificationService.getSavedNotificationSettings();
      setSettings(savedSettings);

      const id = await notificationService.getOneSignalPlayerId();
      setPlayerId(id);

      const perm = await notificationService.requestNotificationPermission();
      setHasPermission(perm);
      setIsInitializing(false);
    };

    init();
  }, []);

  const requestPermission = async (): Promise<boolean> => {
    const granted = await notificationService.requestNotificationPermission();
    setHasPermission(granted);
    if (granted) {
      const id = await notificationService.getOneSignalPlayerId();
      setPlayerId(id);
    }
    return granted;
  };

  const updateSettings = async (newSettings: Partial<NotificationSettings>): Promise<void> => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    await notificationService.saveNotificationSettings(updated);
  };

  const triggerNotification = async (payload: EventPayload): Promise<SmartAlert | null> => {
    return await notificationService.sendTestNotification(payload, settings);
  };

  return {
    playerId,
    hasPermission,
    settings,
    isInitializing,
    requestPermission,
    updateSettings,
    triggerNotification,
  };
};
