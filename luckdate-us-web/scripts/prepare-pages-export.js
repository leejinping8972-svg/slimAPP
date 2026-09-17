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

const keep = new Set([
  'page.tsx',
  'layout.tsx',
  'globals.css',
  'not-found.tsx',
  'about',
  'shop',
  'science',
  'faq',
  'slim_1',
])

const appDir = path.join(root, 'src', 'app')
for (const name of fs.readdirSync(appDir)) {
  if (!keep.has(name)) rmrf(path.join(appDir, name))
}

const layoutPath = path.join(root, 'src', 'app', 'layout.tsx')
let layout = fs.readFileSync(layoutPath, 'utf8')
layout = layout.replace(/import \{ cookies \} from 'next\/headers'\r?\n/, '')
if (!layout.includes("import { Suspense } from 'react'")) {
  layout = layout.replace(
    "import type { Metadata } from 'next'\n",
    "import type { Metadata } from 'next'\nimport { Suspense } from 'react'\n"
  )
}
layout = layout.replace(/const cookieStore = await cookies\(\)\r?\n\s*/g, '')
layout = layout.replace(/const locale = [^\n]+\n/, "const locale = 'en'\n")
if (layout.includes('<MetaPixel />') && !layout.includes('<Suspense fallback={null}>')) {
  layout = layout.replace(
    /<MetaPixel \/>\r?\n\s*<TikTokPixel \/>/,
    `<Suspense fallback={null}>
            <MetaPixel />
            <TikTokPixel />
          </Suspense>`
  )
}
fs.writeFileSync(layoutPath, layout)

console.log('Prepared static export for GitHub Pages')