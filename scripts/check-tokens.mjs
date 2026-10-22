/**
 * Lists every CSS custom property referenced in the source, so the theme
 * file can be audited for missing tokens.
 */
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'

function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) walk(full, out)
    else out.push(full)
  }
  return out
}

const used = new Map()
for (const file of walk(join(process.cwd(), 'src'))) {
  if (!file.endsWith('.css') && !file.endsWith('.jsx')) continue
  const text = readFileSync(file, 'utf8')
  for (const m of text.matchAll(/var\(\s*(--[a-z0-9-]+)/g)) {
    if (!used.has(m[1])) used.set(m[1], new Set())
    used.get(m[1]).add(file.replace(process.cwd() + '\\', ''))
  }
}

const theme = readFileSync(join(process.cwd(), 'src/styles/theme.css'), 'utf8')
const defined = new Set([...theme.matchAll(/(--[a-z0-9-]+)\s*:/g)].map((m) => m[1]))

const missing = [...used.keys()].filter((t) => !defined.has(t)).sort()

console.log('tokens used:', used.size)
console.log('tokens defined in theme.css:', defined.size)
console.log('\nMISSING from theme.css:')
for (const t of missing) console.log(`  ${t}   <- ${[...used.get(t)].join(', ')}`)
