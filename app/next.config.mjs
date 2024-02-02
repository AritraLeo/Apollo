import NodePolyfillPlugin from 'node-polyfill-webpack-plugin';

export default {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
      };

      config.plugins.push(
        new NodePolyfillPlugin({
          exclude: ['crypto'] // Exclude unnecessary modules
        })
      );
    }

    return config;
  },
};
