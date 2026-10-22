/**
 * Finds `const toast = useToast()` declarations that are never used in the
 * same component — leftovers after a button was removed.
 *   node scripts/dbg-unused-toast.mjs
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
walk('src')

for (const file of files) {
  const lines = readFileSync(file, 'utf8').split('\n')
  const decls = lines
    .map((l, i) => [l, i])
    .filter(([l]) => /const toast = useToast\(\)/.test(l))

  for (const [, i] of decls) {
    /* Scan forward until the next declaration or 120 lines. */
    let used = false
    for (let j = i + 1; j < Math.min(lines.length, i + 120); j++) {
      if (/const toast = useToast\(\)/.test(lines[j])) break
      if (/^export function |^function /.test(lines[j])) break
      if (/\btoast\./.test(lines[j])) {
        used = true
        break
      }
    }
    if (!used) console.log(`${file}:${i + 1}  toast is unused`)
  }
}
