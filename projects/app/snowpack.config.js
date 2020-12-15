const WebpackConfigFN = require('./webpack.config')
/** @type {import("snowpack").SnowpackUserConfig } */
module.exports = {
  experiments: {
    source: 'local',
  },
  mount: {
    public: '/',
    src: '/_dist_',
  },
  plugins: [
    /* ... */
    // '@snowpack/plugin-react-refresh',
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
    dest: 'web_modules',
    treeshake: true,
    installTypes: true,
  },
  devOptions: {
    port: 3002,
    out: 'dist',
  },
  buildOptions: {
    /* ... */
  },
  proxy: {
    /* ... */
  },
  alias: {
    // react: 'http://localhost:3001/web_modules/react.js',
    // 'react-dom': 'http://localhost:3001/web_modules/react-dom.js',
  },
}
