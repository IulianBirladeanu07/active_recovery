jest.mock('expo-camera', () => {
  return {
    Camera: jest.fn(),
    CameraType: {},
    FlashMode: {},
    WhiteBalance: {},
    getAvailableCameraTypesAsync: jest.fn(),
    isAvailableAsync: jest.fn(),
    requestPermissionsAsync: jest.fn(),
    takePictureAsync: jest.fn(),
  };
});

jest.mock('expo-modules-core', () => {
  return {
    NativeModulesProxy: {},
    EventEmitter: jest.fn(),
    Platform: { OS: 'test' },
  };
});

jest.mock('@react-native-async-storage/async-storage', () => {
  return {
    setItem: jest.fn(() => Promise.resolve(null)),
    getItem: jest.fn(() => Promise.resolve(null)),
    removeItem: jest.fn(() => Promise.resolve(null)),
    clear: jest.fn(() => Promise.resolve(null)),
    getAllKeys: jest.fn(() => Promise.resolve([])),
    multiGet: jest.fn(() => Promise.resolve([])),
    multiSet: jest.fn(() => Promise.resolve(null)),
    multiRemove: jest.fn(() => Promise.resolve(null)),
    multiMerge: jest.fn(() => Promise.resolve(null)),
  };
});
