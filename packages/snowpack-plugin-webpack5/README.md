# @efox/snowpack-plugin-webpack5 
> use webpack 5 to bundle your application for production. 

### Install

```
npm install --save-dev @efox/snowpack-plugin-webpack5 
```

### Usage

Add `@efox/snowpack-plugin-webpack5 ` to `snowpack.config.json`:

```json
{
  "plugins": [
    [
      "@efox/snowpack-plugin-webpack5 ",
      {
        /* see "Plugin Options" below */
      }
    ]
  ]
}
```

or to `snowpack.config.js`:

```js
module.exports = {
  plugins: [
    [
      '@efox/snowpack-plugin-webpack5 ',
      {
        /* see "Plugin Options" below */
      },
    ],
  ],
};
```

The options object is optional.

### Default Build Script

```json
{
  "scripts": {"bundle:*": "@efox/snowpack-plugin-webpack5 "}
}
```

### Plugin Options

- `sourceMap: boolean` - Enable sourcemaps in the bundled output.
- `outputPattern: {css: string, js: string, assets: string}` - Set the URL for your final bundled files. This is where they will be written to disk in the `build/` directory. See Webpack's [`output.filename`](https://webpack.js.org/configuration/output/#outputfilename) documentation for examples of valid values.
- `extendConfig: (config: WebpackConfig) => WebpackConfig` - extend your webpack config, see below.
- `manifest: boolean | string` - Enable generating a manifest file. The default value is `false`, the default file name is `./asset-manifest.json` if setting manifest to `true`. The relative path is resolved from the output directory.
- `htmlMinifierOptions: boolean | object` - [See below](#minify-html).
- `failOnWarnings: boolean` - Does fail the build when Webpack emits warnings. The default value is `false`.

#### Extending The Default Webpack Config

The `extendConfig` option is a function that you can provide to configure the default webpack config. If you provide this function, the plugin will pass its return value to `webpack.compile()`. Use this to make changes, add plugins, configure loaders, etc.

Note that this requires you use a `snowpack.config.js` JavaScript config file. JSON configuration cannot represent a function.

```js
// snowpack.config.js
module.exports = {
  plugins: [
    [
      '@efox/snowpack-plugin-webpack5 ',
      {
        extendConfig: (config) => {
          config.plugins.push(/* ... */);
          return config;
        },
      },
    ],
  ],
};
```

#### Minify HTML

With `htmlMinifierOptions` you can either disable the minification entirely or provide your own [options](https://github.com/kangax/html-minifier#options-quick-reference).

```js
// snowpack.config.js
module.exports = {
  plugins: [
    [
      '@efox/snowpack-plugin-webpack5 ',
      {
        htmlMinifierOptions: false, // disabled entirely,
      },
    ],
  ],
};
```

The default options are:

```js
{
  collapseWhitespace: true,
  removeComments: true,
  removeEmptyAttributes: true,
  removeRedundantAttributes: true,
  removeScriptTypeAttributes: true,
  removeStyleLinkTypeAttributes: true,
}
```
