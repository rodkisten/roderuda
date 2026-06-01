// tsdown.config.js
// RodEruda build config – replaces webpack
const { defineConfig } = require('tsdown')
const replace = require('@rollup/plugin-replace')
const sass = require('sass')
const postcss = require('postcss')
const autoprefixer = require('autoprefixer')
const { readFileSync } = require('fs')
const pkg = require('./package.json')

// ── PostCSS 8-compatible inline prefix plugin ─────────────────────────────
// Prefixes all CSS class selectors with `_` (e.g. .container → ._container).
// At runtime evalCss does css.replace(/_/g, 'roderuda-') → .roderuda-container.
// Luna component classes (luna-*) are left untouched.
const SELECTOR_RE = /\.(-?[a-zA-Z_][a-zA-Z0-9_-]*)/g

const inlinePrefixer = {
  postcssPlugin: 'inline-prefix',
  Rule(rule) {
    rule.selector = rule.selector.replace(SELECTOR_RE, (match, name) => {
      if (/^luna-/.test(name)) return match
      return `._${name}`
    })
  },
}

const postcssPlugins = [inlinePrefixer, autoprefixer()]

/**
 * Process raw CSS through the PostCSS pipeline.
 * luna-dom-highlighter is passed raw (injected as DOM string, not via evalCss).
 */
async function processCssContent(cssContent, filePath) {
  if (filePath && filePath.includes('luna-dom-highlighter')) {
    return cssContent
  }
  const result = await postcss(postcssPlugins).process(cssContent, {
    from: filePath || undefined,
  })
  return result.css
}

/**
 * Rolldown plugin — intercepts .scss and .css imports via the `load` hook
 * (before rolldown tries its own module-type handling) and returns a JS
 * string module.  We also register the `load` hook with `filter` so that
 * rolldown never attempts to natively parse those extensions.
 */
function scssPlugin() {
  return {
    name: 'roderuda-scss-plugin',
    async load(id) {
      if (id.endsWith('.scss')) {
        const sassResult = sass.compile(id, { style: 'expanded' })
        const css = await processCssContent(sassResult.css, id)
        return { code: `export default ${JSON.stringify(css)};`, map: null }
      }
      if (id.endsWith('.css') && !id.includes('.css.map')) {
        const rawCss = readFileSync(id, 'utf8')
        const css = await processCssContent(rawCss, id)
        return { code: `export default ${JSON.stringify(css)};`, map: null }
      }
    },
  }
}

// Tell rolldown to treat CSS/SCSS as JS so it doesn't reject them before
// handing control to our plugin.
const cssLoader = { '.css': 'js', '.scss': 'js' }

const banner = `/*! ${pkg.name} v${pkg.version} | MIT License | https://github.com/oirodolfo/eruda-console-browser */`

// Inject VERSION and ENV as literal replacements via rollup plugin
function makeReplace(envValue) {
  return replace({
    preventAssignment: true,
    values: {
      VERSION: JSON.stringify(pkg.version),
      ENV: JSON.stringify(envValue),
    },
  })
}

const basePlugins = [scssPlugin()]

module.exports = defineConfig([
  // ── Non-minified: dist/roderuda.js ──────────────────────────────────────
  {
    entry: { roderuda: 'src/index.js' },
    format: ['iife'],
    globalName: 'RodEruda',
    platform: 'browser',
    outDir: 'dist',
    target: 'es2015',
    treeshake: true,
    sourcemap: true,
    minify: false,
    banner: { js: banner },
    loader: cssLoader,
    plugins: [...basePlugins, makeReplace('production')],
  },
  // ── Minified: dist/roderuda.min.js ───────────────────────────────────────
  {
    entry: { 'roderuda.min': 'src/index.js' },
    format: ['iife'],
    globalName: 'RodEruda',
    platform: 'browser',
    outDir: 'dist',
    target: 'es2015',
    treeshake: true,
    minify: true,
    sourcemap: true,
    banner: { js: banner },
    loader: cssLoader,
    plugins: [...basePlugins, makeReplace('production')],
  },
  // ── With-comments / dev: dist/roderuda.with-comments.js ─────────────────
  {
    entry: { 'roderuda.with-comments': 'src/index.js' },
    format: ['iife'],
    globalName: 'RodEruda',
    platform: 'browser',
    outDir: 'dist',
    target: 'es2015',
    treeshake: true,
    minify: false,
    sourcemap: false,
    banner: { js: banner },
    loader: cssLoader,
    plugins: [...basePlugins, makeReplace('development')],
  },
])
