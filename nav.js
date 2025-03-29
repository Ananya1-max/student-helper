import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TextInput, Button } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

const NavigationScreen = () => {
  const [region, setRegion] = useState({
    latitude: 37.7749,
    longitude: -122.4194,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [destination, setDestination] = useState('');
  const [route, setRoute] = useState(null); //  route coordinates

  useEffect(() => {
    // Get the user's current location
    const getUserLocation = async () => {
      // Replace this with a function that gets the user's location
      // Example:  Location.getCurrentPositionAsync() from expo-location
      setTimeout(() => {
        setRegion({
          latitude: 37.78825,
          longitude: -122.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
      }, 1000);
    };

    getUserLocation();
  }, []);

  const handleSearch = async () => {
    // Use a geocoding service (like Google Maps API) to convert the destination string to coordinates
    try {
      // const response = await fetch(
      //   `https://maps.googleapis.com/maps/api/geocode/json?address=${destination}&key=YOUR_API_KEY`
      // );
      // const data = await response.json();
      //
      // if (data.results && data.results.length > 0) {
      //   const { lat, lng } = data.results[0].geometry.location;
      //   setRegion({
      //     ...region,
      //     latitude: lat,
      //     longitude: lng,
      //   });
      //
      //    // Get the route (directions)
      //   const directionsResponse = await fetch(
      //     `https://maps.googleapis.com/maps/api/directions/json?origin=${region.latitude},${region.longitude}&destination=${lat},${lng}&key=YOUR_API_KEY`
      //   );
      //   const directionsData = await directionsResponse.json();
      //
      //    if (directionsData.routes && directionsData.routes.length > 0) {
      //     const routeCoordinates = directionsData.routes[0].legs.flatMap(leg =>
      //       leg.steps.map(step => ({
      //         latitude: step.start_location.lat,
      //         longitude: step.start_location.lng,
      //       }))
      //     );
      //     setRoute(routeCoordinates);
      //   }
      // }
      setTimeout(() => {
        const lat = 37.8000;
        const lng = -122.4000;
        setRegion({
          ...region,
          latitude: lat,
          longitude: lng,
        });
        setRoute([
          { latitude: 37.78825, longitude: -122.4324 },
          { latitude: 37.7900, longitude: -122.4300 },
          { latitude: 37.8000, longitude: -122.4000 },
        ]);
      }, 1000);
    } catch (error) {
      console.error('Error searching for destination:', error);
      Alert.alert('Error', 'Could not find destination.');
    }
  };

  return (
    <View style={styles.container}>
      <MapView style={styles.map} region={region}>
        <Marker coordinate={region} title="Destination" />
        {route && (
          <MapView.Polyline
            coordinates={route}
            strokeColor="blue"
            strokeWidth={4}
          />
        )}
      </MapView>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter destination"
          value={destination}
          onChangeText={(text) => setDestination(text)}
        />
        <Button title="Search" onPress={handleSearch} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  map: {
    width: '100%',
    height: '80%',
  },
  searchContainer: {
    flexDirection: 'row',
    width: '100%',
    padding: 10,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    marginRight: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    backgroundColor: '#fff',
  },
});

export default NavigationScreen;