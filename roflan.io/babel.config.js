module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        extensions: [
          '.ios.js',
          '.android.js',
          '.js',
          '.ios.jsx',
          '.android.jsx',
          '.jsx',
          '.jsx',
          '.js',
          '.json',
          'ts',
          'tsx',
          'yaml',
        ],
        alias: {
          '@assets': './src/assets',
          '@components': './src/components',
          '@core': './src/core',
          '@locale': './src/locale',
          '@redux': './src/redux',
          '@screens': './src/screens',
          '@theme': './src/theme',
          '@tm': './src/tm',
          '@type': './src/types',
          '@utils': './src/utils',
          '@src': './src',
        },
      },
    ],
    ['transform-decorators-legacy'],
  ],
};
