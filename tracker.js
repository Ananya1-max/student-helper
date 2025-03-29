import PushNotification from 'react-native-push-notification';
import { Platform } from 'react-native';

const configureNotifications = () => {
  PushNotification.configure({
    onRegister: function (token) {
      console.log('[Notification] OS Token:', token);
    },
    onNotification: function (notification) {
      console.log('[Notification] onNotification:', notification);
    },
    requestPermissions: Platform.OS === 'ios',
    popInitialNotification: true,
    requestPermissions: true,
  });
  if (Platform.OS === 'ios') {
    PushNotification.requestIOSPermissions().then(
      (data) => {
        console.log('PushNotification.requestIOSPermissions', data);
      },
      (error) => {
        console.log('PushNotification.requestIOSPermissions ERROR', error);
      }
    );
  }

  PushNotification.createChannel({
    channelId: 'study-break-channel', // required
    channelName: 'Study Break Reminders',
    channelDescription: 'Reminds you to take study breaks',
    soundName: 'default',
    importance: 4, // high
    vibrate: true,
  });
};

const createStudyBreakNotification = (timeInMinutes) => {
  PushNotification.localNotificationSchedule({
    channelId: 'study-break-channel',
    title: 'Time for a Break!',
    message: 'Take a 15-minute break from studying.',
    date: new Date(Date.now() + timeInMinutes * 60 * 1000),
    allowWhileIdle: true,
  });
};

const cancelAllNotifications = () => {
  PushNotification.cancelAllLocalNotifications();
};

export { configureNotifications, createStudyBreakNotification, cancelAllNotifications };

// modules/study-break/screens/StudyBreakScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { configureNotifications, createStudyBreakNotification, cancelAllNotifications } from '../utils/notifications';

const StudyBreakScreen = () => {
  const [breakTime, setBreakTime] = useState(25); // Default: 25 minutes (Pomodoro)
  const [notificationCreated, setNotificationCreated] = useState(false);

  useEffect(() => {
    configureNotifications();
  }, []);

  const handleSetReminder = () => {
    createStudyBreakNotification(breakTime);
    setNotificationCreated(true);
    Alert.alert(
      'Reminder Set',
      `A study break reminder has been set for ${breakTime} minutes.`,
      [{ text: 'OK' }],
      { cancelable: false }
    );
  };

  const handleCancelReminder = () => {
    cancelAllNotifications();
    setNotificationCreated(false);
    Alert.alert('Reminder Cancelled', 'All study break reminders have been cancelled.');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Study Break Reminder</Text>
      <Text style={styles.text}>Set a reminder to take a break from studying.</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter break time (minutes)"
        value={breakTime.toString()}
        onChangeText={(text) => setBreakTime(parseInt(text, 10) || 0)}
        keyboardType="numeric"
      />
      <Button
        title="Set Reminder"
        onPress={handleSetReminder}
        disabled={notificationCreated}
        color={notificationCreated ? 'gray' : undefined}
      />
      <Button
        title="Cancel Reminder"
        onPress={handleCancelReminder}
        color="red"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  text: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    backgroundColor: '#fff',
  },
});

export default StudyBreakScreen;