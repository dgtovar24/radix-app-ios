import { useEffect, useRef, useState } from 'react';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export function useNotifications(onNotificationReceived?: (data: any) => void) {
  const [pushToken, setPushToken] = useState<string | null>(null);
  const responseListener = useRef<Notifications.EventSubscription | undefined>(undefined);
  const notificationListener = useRef<Notifications.EventSubscription | undefined>(undefined);

  useEffect(() => {
    register();
    return () => {
      notificationListener.current?.remove();
      responseListener.current?.remove();
    };
  }, []);

  const register = async () => {
    const { status: existing } = await Notifications.getPermissionsAsync();
    let finalStatus = existing;

    if (existing !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') return;

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('alerts', {
        name: 'Alertas médicas',
        importance: Notifications.AndroidImportance.HIGH,
      });
    }

    const tokenData = await Notifications.getExpoPushTokenAsync();
    setPushToken(tokenData.data);

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      const data = notification.request.content.data;
      onNotificationReceived?.(data);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      const data = response.notification.request.content.data;
      onNotificationReceived?.(data);
    });
  };

  return { pushToken };
}
