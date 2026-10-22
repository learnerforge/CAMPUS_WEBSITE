import { readFileSync } from 'node:fs'

const file = 'src/pages/people/PeoplePages.jsx'
const src = readFileSync(file, 'utf8')
const stripRe = /^import\s[\s\S]*?from\s*['"][^'"]+['"];?/gm
let m
while ((m = stripRe.exec(src))) {
  const start = src.slice(0, m.index).split('\n').length
  const end = src.slice(0, m.index + m[0].length).split('\n').length
  console.log(`stripped lines ${start}-${end}: ${m[0].split('\n')[0].slice(0, 60)}`)
}
const body = src.replace(stripRe, '')
console.log('body has useExport:', /\buseExport\b/.test(body))
console.log('body length:', body.length, 'src length:', src.length)
