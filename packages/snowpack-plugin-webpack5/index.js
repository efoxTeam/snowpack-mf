const fs = require('fs')
const path = require('path')
const webpack = require('webpack')
const {getPresetEnvTargets, emitHTMLFiles, parseHTMLFiles} = require('./helper/index')
const wpf = require('./webpack.config')

module.exports = function plugin(config, args = {}) {
  // Deprecated: args.mode
  if (args.mode && args.mode !== 'production') {
    throw new Error('args.mode support has been removed.')
  }
  // Validate: args.outputPattern
  args.outputPattern = args.outputPattern || {}
  const jsOutputPattern = args.outputPattern.js || 'js/[name].[contenthash].js'
  const cssOutputPattern = args.outputPattern.css || 'css/[name].[contenthash].css'
  const assetsOutputPattern = args.outputPattern.assets || 'assets/[name]-[hash].[ext]'
  if (!jsOutputPattern.endsWith('.js')) {
    throw new Error('Output Pattern for JS must end in .js')
  }
  if (!cssOutputPattern.endsWith('.css')) {
    throw new Error('Output Pattern for CSS must end in .css')
  }

  // Default options for HTMLMinifier
  // https://github.com/kangax/html-minifier#options-quick-reference
  const defaultHtmlMinifierOptions = {
    collapseWhitespace: true,
    removeComments: true,
    removeEmptyAttributes: true,
    removeRedundantAttributes: true,
    removeScriptTypeAttributes: true,
    removeStyleLinkTypeAttributes: true,
  }

  const htmlMinifierOptions =
    args.htmlMinifierOptions === false ? false : Object.assign({}, defaultHtmlMinifierOptions, args.htmlMinifierOptions)

  const manifest =
    typeof args.manifest === 'string' ? args.manifest : !!args.manifest ? './asset-manifest.json' : undefined

  // Webpack handles minification for us, so its safe to always
  // disable Snowpack's default minifier.
  config.buildOptions.minify = false
  // Webpack creates unique file hashes for all generated bundles,
  // so we clean the build directory before building to remove outdated
  // build artifacts.
  config.buildOptions.clean = true

  return {
    name: '@efox/plugin-webpack5',
    async optimize({buildDirectory, log}) {
      // config.homepage is legacy, remove in future version
      const buildOptions = config.buildOptions || {}
      let baseUrl = buildOptions.baseUrl || config.homepage || '/'
      const tempBuildManifest = JSON.parse(
        await fs.readFileSync(path.join(config.root || process.cwd(), 'package.json'), {
          encoding: 'utf-8',
        }),
      )
      const presetEnvTargets = getPresetEnvTargets(tempBuildManifest)

      let extendConfig = cfg => cfg
      if (typeof args.extendConfig === 'function') {
        extendConfig = args.extendConfig
      } else if (typeof args.extendConfig === 'object') {
        extendConfig = cfg => ({...cfg, ...args.extendConfig})
      }

      const {doms, jsEntries} = parseHTMLFiles({buildDirectory})

      if (Object.keys(jsEntries).length === 0) {
        throw new Error("Can't bundle without script tag in html")
      }

      //Compile files using webpack
      const webpackConfig = wpf({
        assetsOutputPattern,
        args,
        presetEnvTargets,
        buildDirectory,
        jsOutputPattern,
        baseUrl,
        jsEntries,
        cssOutputPattern,
        manifest,
        extendConfig,
      })
      const compiler = webpack(webpackConfig)

      const stats = await new Promise((resolve, reject) => {
        compiler.run((err, stats) => {
          if (err) {
            reject(err)
            return
          }
          if (stats.hasWarnings()) {
            // console.log('\n=== EMP Compiled with warnings.===\n')
            console.log(
              stats.toString({
                all: false,
                colors: true,
                warnings: true,
              }),
            )
          }
          //
          if (stats.hasErrors()) {
            // console.log('\n=== EMP Failed to compile.===\n')
            const tscCompileOnError = process.env.TSC_COMPILE_ON_ERROR === 'true'
            if (tscCompileOnError) {
              console.log(
                'Compiled with the following type errors (you may want to check these before deploying your app):\n',
              )
            } else {
              console.log(
                stats.toString({
                  all: false,
                  colors: true,
                  errors: true,
                }),
              )
              process.exit(1)
            }
          }
          resolve(stats)
        })
      })

      if (webpackConfig.stats !== 'none') {
        console.log(
          stats.toString(
            webpackConfig.stats
              ? webpackConfig.stats
              : {
                  colors: true,
                  all: false,
                  assets: true,
                },
          ),
        )
      }

      emitHTMLFiles({
        doms,
        jsEntries,
        stats,
        baseUrl,
        buildDirectory,
        htmlMinifierOptions,
      })
    },
  }
}
