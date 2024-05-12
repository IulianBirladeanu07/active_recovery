import React, { useEffect, useState } from 'react';
import { View, Text, Alert, StyleSheet } from 'react-native';
import { Camera } from 'expo-camera';
import { CameraView, BarcodeSize, BarcodePoint } from 'expo-camera/next';

const BarcodeScanner = ({ onBarcodeScanned }) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanning, setScanning] = useState(true); // State to control scanning

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    // Disable scanning after successful scan
    setScanning(false);
    // Pass the scanned barcode data to the parent component
    onBarcodeScanned({ type, data });
    // Optionally, you can show an alert or perform any other action here
    Alert.alert(
      'Barcode Scanned',
      `Type: ${type}, Data: ${data}`,
      [
        { text: 'OK', onPress: () => setScanning(true) } // Enable scanning again after the user dismisses the alert
      ]
    );
  };

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <CameraView
        
        onBarCodeScanned={scanning ? handleBarCodeScanned : undefined}
        style={styles.cameraView}
      />
      {/* Rectangle overlay */}
      <View style={styles.rectangleContainer}>
        <View style={styles.rectangle} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  cameraView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rectangleContainer: {
    position: 'absolute',
    top: '30%', // Adjust the position of the rectangle
    alignItems: 'center',
  },
  rectangle: {
    height: 200,
    width: 300,
    borderWidth: 2,
    borderColor: '#FF9800', // Change the color of the rectangle
    borderRadius: 10, // Add border radius to make it look nicer
  },
});

export default BarcodeScanner;
