const path = require('path')
const fs = require('fs')

const pkg = require('../package.json')
const distDir = path.resolve(__dirname, '../dist')

// ── Rename tsdown IIFE outputs (removes '.iife' from filename) ────────────
const renames = [
  ['roderuda.iife.js', 'roderuda.js'],
  ['roderuda.iife.js.map', 'roderuda.js.map'],
  ['roderuda.min.iife.js', 'roderuda.min.js'],
  ['roderuda.min.iife.js.map', 'roderuda.min.js.map'],
  ['roderuda.with-comments.iife.js', 'roderuda.with-comments.js'],
]

for (const [from, to] of renames) {
  const src = path.join(distDir, from)
  const dest = path.join(distDir, to)
  if (!fs.existsSync(src)) continue
  // Fix sourceMappingURL comment to point to new map filename
  if (src.endsWith('.js') && !src.endsWith('.map')) {
    let content = fs.readFileSync(src, 'utf8')
    content = content.replace(
      /\/\/# sourceMappingURL=(.+\.iife\.js\.map)/g,
      (_, mapFile) => `//# sourceMappingURL=${mapFile.replace('.iife.js.map', '.js.map')}`
    )
    fs.writeFileSync(dest, content, 'utf8')
    fs.unlinkSync(src)
  } else {
    fs.renameSync(src, dest)
  }
}

// ── Write dist/package.json ───────────────────────────────────────────────
const distPkg = Object.assign({}, pkg)
delete distPkg.scripts
delete distPkg.devDependencies

fs.writeFileSync(
  path.join(distDir, 'package.json'),
  JSON.stringify(distPkg, null, 2),
  'utf8'
)

// ── Copy README and type definitions ─────────────────────────────────────
const rootDir = path.resolve(__dirname, '..')
for (const file of ['README.md', 'roderuda.d.ts']) {
  const src = path.join(rootDir, file)
  const dest = path.join(distDir, file)
  if (fs.existsSync(src)) fs.copyFileSync(src, dest)
}

console.log('dist/ finalised — files renamed and metadata copied.')
