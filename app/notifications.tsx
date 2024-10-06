import React, { useState, useEffect, useRef } from 'react';
import { View, Button } from 'react-native';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function NotificationsComponent() {
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);

  useEffect(() => {
    registerForPushNotis().then(token => {
      if (token) setExpoPushToken(token);
    });
    return () => {

    };
  }, []);

  return (
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
      <Button
        title="Notify me"
        onPress={schedulePushNotification}
      />
    </View>
  );
}

async function schedulePushNotification() {
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

  // if (!projectId) {
  //   console.error('Project ID not found.');
  //   return null;
  // }

  token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
  console.log('Expo Push Token:', token);

  return token;
}
