const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const ManifestPlugin = require('webpack-manifest-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const {getSplitChunksConfig} = require('./helper/index')
const path = require('path')
//
module.exports = ({
  assetsOutputPattern,
  cssOutputPattern,
  args,
  presetEnvTargets,
  buildDirectory,
  jsOutputPattern,
  baseUrl,
  jsEntries,
  manifest,
  extendConfig,
}) => {
  const conf = {
    context: buildDirectory,
    resolve: {
      alias: {
        '/__snowpack__': path.join(buildDirectory, '__snowpack__'),
        '/web_modules': path.join(buildDirectory, 'web_modules'),
      },
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: [
            {
              loader: require.resolve('babel-loader'),
              options: {
                cwd: buildDirectory,
                configFile: false,
                babelrc: false,
                compact: true,
                presets: [
                  [
                    require.resolve('@babel/preset-env'),
                    {
                      targets: presetEnvTargets,
                      bugfixes: true,
                      modules: false,
                      useBuiltIns: 'usage',
                      corejs: 3,
                    },
                  ],
                ],
              },
            },
            {
              loader: require.resolve('./plugins/import-meta-fix.js'),
            },
            {
              loader: require.resolve('./plugins/proxy-import-resolve.js'),
            },
          ],
        },
        {
          test: /\.css$/,
          exclude: /\.module\.css$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
            },
            {
              loader: require.resolve('css-loader'),
            },
          ],
        },
        {
          test: /\.module\.css$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
            },
            {
              loader: require.resolve('css-loader'),
              options: {
                modules: true,
              },
            },
          ],
        },
        {
          test: /.*/,
          exclude: [/\.js?$/, /\.json?$/, /\.css$/],
          use: [
            {
              loader: require.resolve('file-loader'),
              options: {
                name: assetsOutputPattern,
              },
            },
          ],
        },
      ],
    },
    mode: 'production',
    devtool: args.sourceMap ? 'source-map' : undefined,
    optimization: {
      // extract webpack runtime to its own chunk: https://webpack.js.org/concepts/manifest/#runtime
      runtimeChunk: {
        name: `webpack-runtime`,
      },
      splitChunks: getSplitChunksConfig({numEntries: Object.keys(jsEntries).length}),
      minimizer: [
        new CssMinimizerPlugin({
          parallel: true,
          sourceMap: false,
          minimizerOptions: {
            preset: [
              'default',
              {
                discardComments: {removeAll: true},
              },
            ],
          },
        }),
        '...',
      ],
    },
  }
  const plugins = [
    //Extract a css file from imported css files
    new MiniCssExtractPlugin({
      filename: cssOutputPattern,
    }),
  ]
  if (manifest) {
    plugins.push(new ManifestPlugin({fileName: manifest}))
  }

  let entry = {}
  for (name in jsEntries) {
    entry[name] = jsEntries[name].path
  }
  const extendedConfig = extendConfig({
    ...conf,
    plugins,
    entry,
    output: {
      path: buildDirectory,
      publicPath: baseUrl,
      filename: jsOutputPattern,
      //
      environment: {
        arrowFunction: false,
        bigIntLiteral: false,
        const: false,
        destructuring: false,
        forOf: false,
        dynamicImport: false,
        module: false,
      },
      publicPath: 'auto',
    },
  })
  return extendedConfig
}
