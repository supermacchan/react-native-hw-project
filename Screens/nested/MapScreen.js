import { View, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

export const MapScreen = ({ route }) => {
  const title = route.params.title;
  const location = route.params.location;
  const { latitude, longitude } = route.params.coords;

  return (
    <View style={styles.container}>
      <MapView
        style={{ flex: 1 }}
        initialRegion={{
          latitude: latitude,
          longitude: longitude,
          latitudeDelta: 0.001,
          longitudeDelta: 0.006,
        }}
      >
        <Marker
          coordinate={{
            latitude: latitude,
            longitude: longitude,
          }}
          title={title}
          description={location}
        />
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});