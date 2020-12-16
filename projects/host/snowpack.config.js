const WebpackConfigFN = require('./webpack.config')
console.log('process', process.env)
const port = 3001
const host = `http://localhost:${port}`
module.exports = {
  experiments: {
    source: 'local',
  },
  mount: {
    public: {url: `/`, resolve: true},
    src: `/_dist_`,
  },
  plugins: [
    '@snowpack/plugin-react-refresh',
    '@snowpack/plugin-sass',
    ,
    [
      '@efox/snowpack-plugin-webpack5',
      {
        extendConfig: WebpackConfigFN,
      },
    ],
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
    port,
    out: 'dist',
  },
  buildOptions: {
    clean: true,
    sourceMaps: true,
    baseUrl: `${host}/`,
  },
  proxy: {},
  alias: {},
}
