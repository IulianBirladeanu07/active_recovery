import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CameraView, Camera } from 'expo-camera';

const BarcodeScanner = ({ onBarcodeRead }) => {
  const [hasPermission, setHasPermission] = useState(null);

  useEffect(() => {
    const getCameraPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    };

    getCameraPermissions();
  }, []);

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <CameraView
        onBarcodeScanned={onBarcodeRead}
        barcodeScannerSettings={{
          barcodeTypes: ['aztec', 'ean13', 'ean8', 'qr', 'pdf417', 'upc_e', 'datamatrix', 'code39', 'code93', 'itf14', 'codabar', 'code128', 'upc_a']
        }}
        style={StyleSheet.absoluteFillObject}
      />
      <View style={styles.scanningAreaOverlay}>
        <View style={styles.scanningAreaBorder} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  scanningAreaOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanningAreaBorder: {
    height: 200,
    width: 300,
    borderWidth: 2,
    borderColor: 'red',
    borderRadius: 10,
    opacity: 0.5,
  },
});

export default BarcodeScanner;
