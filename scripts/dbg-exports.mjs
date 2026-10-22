/**
 * Prints the context around every "download" button so each one can be
 * classified as ListPage-owned or page-owned.
 *   node scripts/dbg-exports.mjs
 */
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'

const files = []
const walk = (d) => {
  for (const n of readdirSync(d)) {
    const p = join(d, n)
    if (statSync(p).isDirectory()) walk(p)
    else if (/\.jsx$/.test(n)) files.push(p)
  }
}
walk('src/pages')

for (const file of files) {
  const lines = readFileSync(file, 'utf8').split('\n')
  const hits = lines.map((l, i) => [l, i]).filter(([l]) => l.includes('icon="download"'))
  if (!hits.length) continue

  console.log(`\n===== ${file}`)
  for (const [, i] of hits) {
    const start = Math.max(0, i - 12)
    console.log(`--- line ${i + 1}`)
    for (let j = start; j <= i + 3; j++) {
      console.log(`${String(j + 1).padStart(4)}  ${lines[j]}`)
    }
  }
}
