// import React, { useEffect, useState } from "react";
// import { View, StyleSheet, Button } from "react-native";
// import { GoogleMaps, Marker } from "expo-maps";
// import * as Location from "expo-location";
// import * as Linking from "expo-linking";

// const CoffeeShopLocation = { latitude: 21.001069049927082, longitude: 105.87577316140809 };

// const MapScreen = () => {
//   const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);

//   // Lấy vị trí người dùng
//   useEffect(() => {
//     const getUserLocation = async () => {
//       let { status } = await Location.requestForegroundPermissionsAsync();
//       if (status !== "granted") {
//         console.error("Quyền truy cập vị trí bị từ chối!");
//         return;
//       }

//       let location = await Location.getCurrentPositionAsync({});
//       setUserLocation({
//         latitude: location.coords.latitude,
//         longitude: location.coords.longitude,
//       });
//     };

//     getUserLocation();
//   }, []);

//   // Mở Google Maps để chỉ đường
//   const openGoogleMaps = () => {
//     if (!userLocation) return;

//     const url = `https://www.google.com/maps/dir/?api=1&origin=${userLocation.latitude},${userLocation.longitude}&destination=${CoffeeShopLocation.latitude},${CoffeeShopLocation.longitude}&travelmode=driving`;

//     Linking.openURL(url);
//   };

//   return (
//     <View style={styles.container}>
//       <GoogleMaps.View
//         style={styles.map}
//         cameraPosition={{
//           coordinates: CoffeeShopLocation,
//           zoom: 14,
//         }}
//       >
//         {/* Marker: Vị trí quán cafe */}

//       </GoogleMaps.View>

//       {/* Nút chọn đường đi */}
//       <View style={styles.buttonContainer}>
//         <Button title="Chọn đường đi" onPress={openGoogleMaps} color="#007AFF" />
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1 },
//   map: { width: "100%", height: "100%" },
//   buttonContainer: {
//     position: "absolute",
//     bottom: 20,
//     left: "50%",
//     transform: [{ translateX: -50 }],
//     backgroundColor: "white",
//     padding: 10,
//     borderRadius: 10,
//     elevation: 5,
//   },
// });

// export default MapScreen;
