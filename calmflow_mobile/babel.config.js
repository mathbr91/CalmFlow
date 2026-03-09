/**
 * babel.config.js
 * Configuração do Babel para React Native
 */

module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
  };
};
