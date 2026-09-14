const fs = require('node:fs')
const path = require('node:path')

const root = path.join(__dirname, '..')

function rmrf(p) {
  fs.rmSync(p, { recursive: true, force: true })
}

rmrf(path.join(root, 'src', 'app', 'api'))
rmrf(path.join(root, 'src', 'app', 'sitemap.ts'))
rmrf(path.join(root, 'src', 'app', 'sitemap.xml'))
rmrf(path.join(root, 'src', 'app', 'sitemap-agentic.xml'))
rmrf(path.join(root, 'src', 'app', 'robots.ts'))
rmrf(path.join(root, 'src', 'app', 'robots.txt'))

function walk(dir) {
  if (!fs.existsSync(dir)) return
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name)
    const st = fs.statSync(full)
    if (st.isDirectory()) walk(full)
    else if (name === 'route.ts' || name === 'route.js') rmrf(full)
  }
}
walk(path.join(root, 'src', 'app'))

// Marketing preview: home + about + shop PDPs + slim redirect
const keep = new Set([
  'page.tsx',
  'layout.tsx',
  'globals.css',
  'not-found.tsx',
  'about',
  'shop',
  'slim_1',
])

const appDir = path.join(root, 'src', 'app')
for (const name of fs.readdirSync(appDir)) {
  if (!keep.has(name)) rmrf(path.join(appDir, name))
}

console.log('Prepared static export for GitHub Pages (home/about/shop)')
