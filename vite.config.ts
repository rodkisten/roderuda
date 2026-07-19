import replace from '@rollup/plugin-replace'
import autoprefixer from 'autoprefixer'
import postcss from 'postcss'
import { readFileSync } from 'node:fs'
import { dirname, isAbsolute, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import pkg from './package.json'

const SELECTOR_RE = /\.(-?[a-zA-Z_][a-zA-Z0-9_-]*)/g


const nesting = {
  postcssPlugin: 'inline-nesting',
  OnceExit(root, { Rule }) {
    let changed = true
    while (changed) {
      changed = false
      const nestedRules = []
      root.walkRules((rule) => {
        const parent = rule.parent
        if (parent && parent.type === 'rule') nestedRules.push(rule)
      })
      for (const rule of nestedRules) {
        const parent = rule.parent
        if (!parent || parent.type !== 'rule' || !parent.parent) continue
        const parentSelectors = parent.selectors || parent.selector.split(',')
        const childSelectors = rule.selectors || rule.selector.split(',')
        const selectors = []
        for (const parentSelector of parentSelectors) {
          for (const childSelector of childSelectors) {
            const child = childSelector.trim()
            selectors.push(
              child.includes('&')
                ? child.replace(/&/g, parentSelector.trim())
                : `${parentSelector.trim()} ${child}`
            )
          }
        }
        const flattened = new Rule({ selector: selectors.join(', ') })
        flattened.append(rule.nodes.map((node) => node.clone()))
        parent.after(flattened)
        rule.remove()
        changed = true
      }
    }
  },
}

const inlinePrefixer = {
  postcssPlugin: 'inline-prefix',
  Rule(rule) {
    rule.selector = rule.selector.replace(SELECTOR_RE, (match, name) => {
      if (/^luna-/.test(name)) return match
      return `._${name}`
    })
  },
}

const postcssPlugins = [nesting, inlinePrefixer, autoprefixer()]

const rootDir = dirname(fileURLToPath(import.meta.url))
const cssModulePrefix = '\0roderuda-css-string:'
const cssModules = new Map()

const cssAsString = () => ({
  name: 'roderuda-css-as-string',
  enforce: 'pre',
  async resolveId(source, importer) {
    if (!source.endsWith('.css') || source.includes('.css.map')) return null
    const resolved = await this.resolve(source, importer, { skipSelf: true })
    const filePath = resolved
      ? resolved.id
      : source.startsWith('.')
        ? resolve(dirname(importer || rootDir), source)
        : isAbsolute(source)
          ? source
          : resolve(rootDir, source)
    const moduleId = cssModulePrefix + Buffer.from(filePath).toString('base64url')
    cssModules.set(moduleId, filePath)
    return moduleId
  },
  async load(id) {
    if (!id.startsWith(cssModulePrefix)) return null
    const filePath = cssModules.get(id)
    if (filePath.includes('luna-dom-highlighter')) {
      return `export default ${JSON.stringify(readFileSync(filePath, 'utf8'))};`
    }
    const result = await postcss(postcssPlugins).process(
      readFileSync(filePath, 'utf8'),
      { from: filePath }
    )
    return `export default ${JSON.stringify(result.css)};`
  },
})

const banner = `/*! ${pkg.name} v${pkg.version} | MIT License | https://github.com/oirodolfo/eruda-console-browser */`

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    cssAsString(),
    replace({
      preventAssignment: true,
      values: {
        VERSION: JSON.stringify(pkg.version),
        ENV: JSON.stringify(mode === 'development' ? 'development' : 'production'),
        BUILD_INFO: JSON.stringify(process.env.BUILD_INFO || ''),
      },
    }),
  ],
  css: {
    postcss: {
      plugins: postcssPlugins,
    },
  },
  build: {
    outDir: 'dist-vite',
    sourcemap: true,
    target: 'es2015',
    lib: {
      entry: 'src/index.js',
      name: 'RodEruda',
      formats: ['iife'],
      fileName: () => 'roderuda.js',
    },
    rollupOptions: {
      output: {
        banner,
      },
    },
  },
}))
