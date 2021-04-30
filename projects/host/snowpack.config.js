// const WebpackConfigFN = require('./webpack.config')
// console.log('process', process.env)
const port = 3001
const host = `http://localhost:${port}`
/** @type {import("snowpack").SnowpackUserConfig } */
module.exports = {
  // experiments: {
  //   source: 'local',
  // },
  mount: {
    public: {url: `/`, resolve: true},
    src: `/dist`,
  },
  plugins: [
    '@snowpack/plugin-react-refresh',
    '@snowpack/plugin-sass',
    ,
    // [
    //   '@efox/snowpack-plugin-webpack5',
    //   {
    //     extendConfig: WebpackConfigFN,
    //   },
    // ],
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
  },
  buildOptions: {
    clean: true,
    sourcemap: true,
    baseUrl: `${host}/`,
  },
  // proxy: {},
  alias: {},
}
