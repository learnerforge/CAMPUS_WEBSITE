/**
 * Reports imported identifiers that are never referenced in the file body.
 *   node scripts/dbg-unused-imports.mjs
 */
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'

const files = []
const walk = (d) => {
  for (const n of readdirSync(d)) {
    const p = join(d, n)
    if (statSync(p).isDirectory()) walk(p)
    else if (/\.jsx?$/.test(n)) files.push(p)
  }
}
walk('src')

/* Strip every import statement (including multi-line and side-effect ones). */
const stripImports = (src) =>
  src
    .replace(/^import\s+['"][^'"]+['"];?/gm, '')
    .replace(/^import\s[\s\S]*?from\s*['"][^'"]+['"];?/gm, '')

for (const file of files) {
  const src = readFileSync(file, 'utf8')
  const importRe = /^import\s+(?:([\w$]+)\s*,\s*)?(?:\{([\s\S]*?)\})?\s*from\s*['"][^'"]+['"]/gm

  let m
  while ((m = importRe.exec(src))) {
    const names = []
    if (m[1]) names.push(m[1])
    if (m[2]) {
      for (const part of m[2].split(',')) {
        const name = part.trim().split(/\s+as\s+/).pop()?.trim()
        if (name) names.push(name)
      }
    }

    const body = stripImports(src)
    for (const name of names) {
      const re = new RegExp(`\\b${name.replace(/[$]/g, '\\$')}\\b`)
      if (!re.test(body)) console.log(`${file}  unused import: ${name}`)
    }
  }
}
