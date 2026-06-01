const path = require('path')
const fs = require('fs')

const distDir = path.resolve(__dirname, '../dist')

function rmrf(dir) {
  if (!fs.existsSync(dir)) return
  fs.rmSync(dir, { recursive: true, force: true })
}

rmrf(distDir)
fs.mkdirSync(distDir, { recursive: true })
console.log('Cleaned dist/')
