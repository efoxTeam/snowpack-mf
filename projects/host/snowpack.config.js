const WebpackConfigFN = require('./webpack.config')
/** @type {import("snowpack").SnowpackUserConfig } */
module.exports = {
  experiments: {
    source: 'skypack',
  },
  mount: {
    public: '/',
    src: '/_dist_',
  },
  plugins: [
    /* ... */
    /* '@snowpack/plugin-react-refresh',
    [
      '@snowpack/plugin-webpack',
      {
        extendConfig: WebpackConfigFN,
      },
    ], */
    ['@snowpack/plugin-dotenv', {}],
    // ['@snowpack/plugin-typescript', {args: '--project ./'}],
    /* 
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
  // install: [],
  installOptions: {
    dest: 'web_modules',
    treeshake: true,
    installTypes: true,
  },
  devOptions: {
    port: 3001,
    out: 'dist',
  },
  buildOptions: {
    clean: true,
    sourceMaps: true,
  },
  proxy: {},
  alias: {},
}
