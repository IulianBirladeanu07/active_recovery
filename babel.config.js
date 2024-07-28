module.exports = function(api) {
  api.cache(true);
  
  return {
    presets: [
      ['@babel/preset-env', { targets: { node: 'current' } }],
      'babel-preset-expo',
      // Uncomment if using TypeScript
      // '@babel/preset-typescript',
    ],
    plugins: [
      ['@babel/plugin-proposal-class-properties', { loose: true }],
      ['@babel/plugin-transform-private-methods', { loose: true }],
      ['@babel/plugin-transform-private-property-in-object', { loose: true }],
      'react-native-reanimated/plugin',
    ],
  };
};
