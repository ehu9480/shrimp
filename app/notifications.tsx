import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function NotificationsComponent({ cooldown }: { cooldown: number }) {
  const [countdown, setCountdown] = useState<number>(cooldown); // Initialize with the cooldown value

  useEffect(() => {
    // Countdown logic
    if (countdown > 0) {
      const timer = setInterval(() => {
        setCountdown(prev => (prev > 0 ? prev - 1 : 0));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [countdown]);

  useEffect(() => {
    // Reset countdown whenever cooldown changes
    setCountdown(cooldown);
  }, [cooldown]);

  return (
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
      {countdown > 0 ? (
        <Text>{`Next notification can be sent in ${countdown} second(s)`}</Text>
      ) : (
        <Text>Notification system ready!</Text>
      )}
    </View>
  );
}

export async function schedulePushNotification() {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Shrimp App",
      body: "You're shrimping 🦐",
    },
    trigger: { seconds: 1 },
  });
}

async function registerForPushNotis() {
  let token;

  await Notifications.setNotificationChannelAsync('default', {
    name: 'default',
    importance: Notifications.AndroidImportance.MAX,
    vibrationPattern: [0, 250, 250, 250],
    lightColor: '#FF231F7C',
  });

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    alert('Failed to get push token for push notifications!');
    return null;
  }

  const projectId = Constants.expoConfig?.extra?.eas?.projectId ?? Constants.easConfig?.projectId;

  token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
  console.log('Expo Push Token:', token);

  return token;
}
