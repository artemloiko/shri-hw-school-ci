const WorkboxWebpackPlugin = require('workbox-webpack-plugin');
module.exports = function override(config, env) {
  config.plugins = config.plugins.map((plugin) => {
    if (plugin.constructor.name === 'GenerateSW') {
      return new WorkboxWebpackPlugin.InjectManifest({
        swSrc: './temp/sw.js',
        compileSrc: false,
      });
    }
    return plugin;
  });
  return config;
};
