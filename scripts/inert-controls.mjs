/**
 * Inert-control finder — lists every interactive element that has no
 * handler wired up, so dead buttons can be spotted in the source.
 *
 *   node scripts/inert-controls.mjs [srcDir]
 */
import { readdirSync, statSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = process.argv[2] || 'src'

const files = []
const walk = (dir) => {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name)
    if (statSync(p).isDirectory()) walk(p)
    else if (/\.jsx$/.test(name)) files.push(p)
  }
}
walk(ROOT)

/** Split a JSX file into top-level-ish chunks so a tag can be inspected. */
const TAG = /<(button|Button|input|Input|select|Select|a|Link)\b([^>]*?)\/?>/g

let total = 0
for (const file of files) {
  const src = readFileSync(file, 'utf8')
  const lines = src.split('\n')
  const hits = []

  lines.forEach((line, i) => {
    let m
    TAG.lastIndex = 0
    while ((m = TAG.exec(line))) {
      const attrs = m[2]
      if (/type="(checkbox|radio|file|submit)"/.test(attrs)) continue
      if (/href=/.test(attrs)) continue
      if (/\bonClick=/.test(attrs)) continue
      if (/\btype="button"/.test(attrs) && /onClick/.test(src.slice(0, 0))) continue
      hits.push({ line: i + 1, tag: m[1], text: line.trim().slice(0, 90) })
    }
  })

  if (hits.length) {
    console.log(`\n${file}  (${hits.length})`)
    for (const h of hits) console.log(`  ${String(h.line).padStart(4)}  ${h.tag.padEnd(6)} ${h.text}`)
    total += hits.length
  }
}

console.log(`\n${total} interactive element(s) without an onClick handler.`)
