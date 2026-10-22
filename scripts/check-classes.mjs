/**
 * Static check — every class token used in JSX should have a CSS rule
 * somewhere in the project. Catches typos that would silently render
 * unstyled elements.
 *
 *   node scripts/check-classes.mjs
 */
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'

const ROOT = process.cwd()
const SRC = join(ROOT, 'src')

function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) walk(full, out)
    else out.push(full)
  }
  return out
}

const files = walk(SRC)
const jsx = files.filter((f) => f.endsWith('.jsx') || f.endsWith('.js'))
const css = files.filter((f) => f.endsWith('.css'))

/* ---- CSS selectors ---- */
const defined = new Set()
for (const file of css) {
  const text = readFileSync(file, 'utf8').replace(/\/\*[\s\S]*?\*\//g, '')
  const re = /\.(-?[_a-zA-Z]+[_a-zA-Z0-9-]*)/g
  let m
  while ((m = re.exec(text))) defined.add(m[1])
}

/* ---- Classes used in JSX ---- */
const used = new Map()
for (const file of jsx) {
  const text = readFileSync(file, 'utf8')
  const re = /className\s*=\s*(?:"([^"]*)"|'([^']*)'|\{`([^`]*)`\})/g
  let m
  while ((m = re.exec(text))) {
    const raw = m[1] ?? m[2] ?? m[3] ?? ''
    // strip template expressions like ${cond ? 'a' : 'b'}
    const cleaned = raw.replace(/\$\{[^}]*\}/g, ' ')
    for (const token of cleaned.split(/\s+/)) {
      if (!token || token.includes('$') || token.includes('{')) continue
      if (!used.has(token)) used.set(token, new Set())
      used.get(token).add(relative(ROOT, file))
    }
  }
}

/**
 * A token built from a template expression such as `btn--${variant}` is only
 * known at runtime. Accept it when the block prefix (`btn--`) exists as a
 * modifier of some defined class.
 */
function isDynamicModifier(token) {
  if (!token.endsWith('-')) return false
  const prefix = token.slice(0, -1)
  return [...defined].some((d) => d.startsWith(prefix))
}

const missing = [...used.entries()].filter(
  ([c]) => !defined.has(c) && !isDynamicModifier(c),
)

if (missing.length) {
  console.log(`${missing.length} class token(s) with no CSS rule:\n`)
  for (const [cls, files] of missing) {
    console.log(`  .${cls}  <- ${[...files].join(', ')}`)
  }
  process.exit(1)
}

console.log(`All ${used.size} class tokens used in JSX have a CSS rule.`)
