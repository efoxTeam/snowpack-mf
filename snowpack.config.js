const WebpackConfigFN = require('./webpack.config')
/** @type {import("snowpack").SnowpackUserConfig } */
module.exports = {
  mount: {
    /* ... */
    public:'/',
    src:'/_dist_'
  },
  plugins: [
    /* ... */
    '@snowpack/plugin-react-refresh',
    ['@snowpack/plugin-webpack',{
      extendConfig: WebpackConfigFN
    }],
    ['@snowpack/plugin-dotenv',{}]
  ],
  install: [
    /* ... */
  ],
  installOptions: {
    /* ... */
  },
  devOptions: {
    /* ... */
  },
  buildOptions: {
    /* ... */
  },
  proxy: {
    /* ... */
  },
  alias: {
    /* ... */
  },
};
