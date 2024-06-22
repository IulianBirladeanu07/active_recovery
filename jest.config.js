module.exports = {
    preset: 'react-native',
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    transformIgnorePatterns: [
      'node_modules/(?!(expo-.*|@expo-.*|@react-native|react-native|@react-navigation|react-native-responsive-fontsize|react-native-iphone-x-helper|@firebase|firebase|@react-native-async-storage)/)',
    ],
    setupFiles: ['./node_modules/react-native-gesture-handler/jestSetup.js', './jest.setup.js'],
    setupFilesAfterEnv: ['@testing-library/jest-native/extend-expect'],
    transform: {
      '^.+\\.[t|j]sx?$': 'babel-jest',
    },
  };
  