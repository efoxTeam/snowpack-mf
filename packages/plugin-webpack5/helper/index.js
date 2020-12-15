const crypto = require('crypto')
const glob = require('glob')
const url = require('url')
const {minify} = require('html-minifier')
const path = require('path')
const fs = require('fs')
const jsdom = require('jsdom')
const {JSDOM} = jsdom
//
function insertBefore(newNode, existingNode) {
  existingNode.parentNode.insertBefore(newNode, existingNode)
}

function getSplitChunksConfig({numEntries}) {
  const isCss = module => module.type === `css/mini-extract`
  /**
   * Implements a version of granular chunking, as described at https://web.dev/granular-chunking-nextjs/.
   */
  return {
    chunks: 'all',
    maxInitialRequests: 25,
    minSize: 20000,
    cacheGroups: {
      default: false,
      vendors: false,
      /**
       * NPM libraries larger than 100KB are pulled into their own chunk
       *
       * We use a smaller cutoff than the reference implementation (which does 150KB),
       * because our babel-loader config compresses whitespace with `compact: true`.
       */
      lib: {
        test(module) {
          return !isCss(module) && module.size() > 100000 && /web_modules[/\\]/.test(module.identifier())
        },
        name(module) {
          /**
           * Name the chunk based on the filename in /web_modules.
           *
           * E.g. /web_modules/moment.js -> lib-moment.HASH.js
           */
          const ident = module.libIdent({context: 'dir'})
          const lastItem = ident
            .split('/')
            .reduceRight(item => item)
            .replace(/\.js$/, '')
          return `lib-${lastItem}`
        },
        priority: 30,
        minChunks: 1,
        reuseExistingChunk: true,
      },
      // modules used by all entrypoints end up in commons
      commons: {
        test(module) {
          return !isCss(module)
        },
        name: 'commons',
        // don't create a commons chunk until there are 2+ entries
        minChunks: Math.max(2, numEntries),
        priority: 20,
      },
      // modules used by multiple chunks can be pulled into shared chunks
      shared: {
        test(module) {
          return !isCss(module)
        },
        name(module, chunks) {
          const hash = crypto
            .createHash(`sha1`)
            .update(chunks.reduce((acc, chunk) => acc + chunk.name, ``))
            .digest(`hex`)

          return hash
        },
        priority: 10,
        minChunks: 2,
        reuseExistingChunk: true,
      },
      // Bundle all css & lazy css into one stylesheet to make sure lazy components do not break
      styles: {
        test(module) {
          return isCss(module)
        },
        name: `styles`,
        priority: 40,
        enforce: true,
      },
    },
  }
}
function emitHTMLFiles({doms, jsEntries, stats, baseUrl, buildDirectory, htmlMinifierOptions}) {
  const entrypoints = stats.toJson({assets: false, hash: true}).entrypoints
  //Now that webpack is done, modify the html files to point to the newly compiled resources
  Object.keys(jsEntries).forEach(name => {
    if (entrypoints[name] !== undefined && entrypoints[name]) {
      const assetFiles = entrypoints[name].assets || []
      const assetFilesArrStr = []
      assetFiles.map(d => {
        assetFilesArrStr.push(d.name)
      })
      const jsFiles = assetFilesArrStr.filter(d => d.endsWith('.js'))
      const cssFiles = assetFilesArrStr.filter(d => d.endsWith('.css'))
      for (const occurrence of jsEntries[name].occurrences) {
        const originalScriptEl = occurrence.script
        const dom = occurrence.dom
        const head = dom.window.document.querySelector('head')

        for (const jsFile of jsFiles) {
          const scriptEl = dom.window.document.createElement('script')
          scriptEl.src = url.parse(baseUrl).protocol ? url.resolve(baseUrl, jsFile) : path.posix.join(baseUrl, jsFile)
          // insert _before_ so the relative order of these scripts is maintained
          insertBefore(scriptEl, originalScriptEl)
        }
        for (const cssFile of cssFiles) {
          const linkEl = dom.window.document.createElement('link')
          linkEl.setAttribute('rel', 'stylesheet')
          linkEl.href = url.parse(baseUrl).protocol ? url.resolve(baseUrl, cssFile) : path.posix.join(baseUrl, cssFile)
          head.append(linkEl)
        }
        originalScriptEl.remove()
      }
    }
  })

  //And write our modified html files out to the destination
  for (const [htmlFile, dom] of Object.entries(doms)) {
    const html = htmlMinifierOptions ? minify(dom.serialize(), htmlMinifierOptions) : dom.serialize()

    fs.writeFileSync(path.join(buildDirectory, htmlFile), html)
  }
}

function getPresetEnvTargets({browserslist}) {
  if (Array.isArray(browserslist) || typeof browserslist === 'string') {
    return browserslist
  } else if (typeof browserslist === 'object' && 'production' in browserslist) {
    return browserslist.production
  } else {
    return '>0.75%, not ie 11, not UCAndroid >0, not OperaMini all'
  }
}

function parseHTMLFiles({buildDirectory}) {
  // Get all html files from the output folder
  const pattern = buildDirectory + '/**/*.html'
  const htmlFiles = glob.sync(pattern).map(htmlPath => path.relative(buildDirectory, htmlPath))

  const doms = {}
  const jsEntries = {}
  for (const htmlFile of htmlFiles) {
    const dom = new JSDOM(fs.readFileSync(path.join(buildDirectory, htmlFile)))

    //Find all local script, use it as the entrypoint
    const scripts = Array.from(dom.window.document.querySelectorAll('script'))
      .filter(el => el.type.trim().toLowerCase() === 'module')
      .filter(el => !/^[a-zA-Z]+:\/\//.test(el.src))

    for (const el of scripts) {
      const src = el.src.trim()
      const parsedPath = path.parse(src)
      const name = parsedPath.name
      if (!(name in jsEntries)) {
        jsEntries[name] = {
          path: path.join(buildDirectory, src),
          occurrences: [],
        }
      }
      jsEntries[name].occurrences.push({script: el, dom})
    }

    doms[htmlFile] = dom
  }
  return {doms, jsEntries}
}

module.exports = {getPresetEnvTargets, getSplitChunksConfig, emitHTMLFiles, insertBefore, parseHTMLFiles}
