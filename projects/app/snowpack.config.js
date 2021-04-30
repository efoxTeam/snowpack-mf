// const WebpackConfigFN = require('./webpack.config')
const port = 3002
const host = `http://localhost:${port}`
/** @type {import("snowpack").SnowpackUserConfig } */
module.exports = {
  // experiments: {
  //   source: 'local',
  // },
  mount: {
    public: {url: `/`},
    src: '/dist',
  },
  plugins: [
    '@snowpack/plugin-react-refresh',
    '@snowpack/plugin-sass',
    /* [
      '@efox/snowpack-plugin-webpack5',
      {
        extendConfig: WebpackConfigFN,
      },
    ], */
    ['@snowpack/plugin-dotenv', {}],
    // ['@snowpack/plugin-typescript', {args: '--project ./'}],
    /*[
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
  packageOptions: {
    dest: 'web_modules',
    installTypes: true,
    source: 'local',
  },
  optimize: {
    treeshake: true,
  },
  devOptions: {
    port,
    out: 'dist',
    // fallback: 'index.html',
  },
  buildOptions: {
    clean: true,
    sourcemap: true,
    baseUrl: `${host}/`,
  },
  // proxy: {},
  alias: {
    'host/logo': `http://localhost:3001/dist/Logo.js`,
    // react: 'http://localhost:3001/web_modules/react.js',
    // 'react-dom': 'http://localhost:3001/web_modules/react-dom.js',
  },
}
