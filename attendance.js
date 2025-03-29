import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import * as Location from 'expo-location';
import { Platform } from 'react-native';

const AttendanceScreen = ({ classId }) => {
  const [location, setLocation] = useState(null);
  const [status, setStatus] = useState('Not Marked');
  const [classSchedule, setClassSchedule] = useState({
    startTime: '09:00',
    endTime: '10:30',
    latitude: 37.7749,
    longitude: -122.4194,
  });
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    const getClassSchedule = async () => {
      setTimeout(() => {
        setClassSchedule({
          startTime: '09:00',
          endTime: '10:30',
          latitude: 37.7749,
          longitude: -122.4194,
        });
      }, 500);
    };
    getClassSchedule();
  }, [classId]);

  const markAttendance = async () => {
      if (Platform.OS === 'android') {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg('Permission to access location was denied');
          Alert.alert(
            'Location Permission Required',
            'Please enable location services for this app in your device settings.',
            [
              { text: 'OK' },
            ],
            { cancelable: false }
          );
          return;
        }
      }

    try {
      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);

      const now = new Date();
      const startTime = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        ...classSchedule.startTime.split(':')
      );
      const endTime = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        ...classSchedule.endTime.split(':')
      );

      if (now >= startTime && now <= endTime) {
        const distance = calculateDistance(
          location.coords.latitude,
          location.coords.longitude,
          classSchedule.latitude,
          classSchedule.longitude
        );

        if (distance <= 100) {
          setStatus('Marked');
          Alert.alert('Success', 'Attendance marked successfully!');
        } else {
          setStatus('Out of Range');
          Alert.alert(
            'Out of Range',
            'You are not within the class location.',
            [{ text: 'OK' }],
            { cancelable: false }
          );
        }
      } else {
        setStatus('Outside Time');
        Alert.alert(
          'Outside Time',
          'You can only mark attendance during class hours.',
          [{ text: 'OK' }],
          { cancelable: false }
        );
      }
    } catch (error) {
      console.error('Error marking attendance:', error);
      Alert.alert('Error', 'Failed to mark attendance. Please try again.');
      setStatus('Error');
    }
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) *
        Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c;
    return d * 1000;
  };

  const deg2rad = (deg) => {
    return deg * (Math.PI / 180);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Class ID: {classId}</Text>
      <Text style={styles.text}>Status: {status}</Text>
      {location && (
        <Text style={styles.text}>
          Your Location: {location.coords.latitude}, {location.coords.longitude}
        </Text>
      )}
      <Button title="Mark Attendance" onPress={markAttendance} />
      {errorMsg && <Text style={styles.errorText}>{errorMsg}</Text>}
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
  text: {
    fontSize: 18,
    marginBottom: 10,
  },
  errorText: {
    color: 'red',
    marginTop: 10,
  },
});

export default AttendanceScreen;