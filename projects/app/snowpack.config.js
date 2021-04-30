const WebpackConfigFN = require('./webpack.config')
const port = 3002
const host = `http://localhost:${port}`
module.exports = {
  // experiments: {
  //   source: 'local',
  // },
  mount: {
    public: {url: `/`},
    src: '/_dist_',
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
    'host/logo': `http://localhost:3001/_dist_/Logo.js`,
    // react: 'http://localhost:3001/web_modules/react.js',
    // 'react-dom': 'http://localhost:3001/web_modules/react-dom.js',
  },
}
