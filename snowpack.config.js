const WebpackConfigFN = require('./webpack.config')
/** @type {import("snowpack").SnowpackUserConfig } */
module.exports = {
  mount: {
    /* ... */
    public: '/',
    src: '/_dist_',
  },
  plugins: [
    /* ... */
    '@snowpack/plugin-react-refresh',
    [
      '@snowpack/plugin-webpack',
      {
        extendConfig: WebpackConfigFN,
      },
    ],
    ['@snowpack/plugin-dotenv', {}],
    /* '@snowpack/plugin-typescript',
    [
      '@snowpack/plugin-babel',
      {
        input: ['.js', '.mjs', '.jsx', '.ts', '.tsx'],
        transformOptions: {
          plugins: [['import', {libraryName: 'antd', style: true}]],
        },
      },
    ], */
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
}
