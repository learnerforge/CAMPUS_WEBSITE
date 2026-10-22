/**
 * Dumps the live original's login DOM so the replica can be matched to it.
 *
 *   node scripts/dump-original.mjs
 */
import { chromium } from 'playwright'
import { writeFileSync } from 'node:fs'

const ORIGINAL = process.env.ORIGINAL_URL || 'https://mgit.campx.in/'

const browser = await chromium.launch()
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } })
const page = await ctx.newPage()

await page.goto(ORIGINAL, { waitUntil: 'networkidle', timeout: 60000 }).catch(() => {})
await page.waitForTimeout(3000)

const dump = await page.evaluate(() => {
  const root = document.getElementById('root')
  const html = root ? root.innerHTML : document.body.innerHTML

  // Pull the CSS rules that apply to anything inside the root
  const rules = []
  for (const sheet of document.styleSheets) {
    let list
    try {
      list = sheet.cssRules
    } catch {
      continue
    }
    if (!list) continue
    for (const rule of list) {
      const text = rule.cssText || ''
      if (text.includes('--') || /form|input|button|login|auth|MuiBox|oauth/i.test(text)) {
        rules.push(text)
      }
    }
  }

  const desc = (el) => {
    const cs = getComputedStyle(el)
    const r = el.getBoundingClientRect()
    return {
      tag: el.tagName.toLowerCase(),
      cls: el.className && typeof el.className === 'string' ? el.className : '',
      box: `${Math.round(r.width)}x${Math.round(r.height)} @${Math.round(r.x)},${Math.round(r.y)}`,
      bg: cs.backgroundColor,
      color: cs.color,
      font: `${cs.fontSize}/${cs.fontWeight} ${cs.fontFamily.split(',')[0]}`,
      radius: cs.borderRadius,
      border: cs.border,
      pad: cs.padding,
      text: (el.childElementCount === 0 ? el.textContent : '').trim().slice(0, 50),
    }
  }

  const tree = []
  const walk = (el, depth) => {
    if (depth > 14) return
    for (const child of el.children) {
      tree.push({ depth, ...desc(child) })
      walk(child, depth + 1)
    }
  }
  if (root) walk(root, 0)

  return { html, rules: rules.slice(0, 400), tree }
})

await browser.close()

writeFileSync('reference/original-dom.html', dump.html)
writeFileSync('reference/original-tree.txt', dump.tree.map((t) => `${'  '.repeat(t.depth)}${t.tag}.${t.cls} [${t.box}] bg=${t.bg} color=${t.color} font=${t.font} r=${t.radius} border=${t.border} pad=${t.pad} ${t.text ? `text="${t.text}"` : ''}`).join('\n'))
writeFileSync('reference/original-css.txt', dump.rules.join('\n'))

console.log('DOM      ->', dump.html.length, 'bytes  (reference/original-dom.html)')
console.log('TREE     ->', dump.tree.length, 'nodes  (reference/original-tree.txt)')
console.log('CSS      ->', dump.rules.length, 'rules  (reference/original-css.txt)')
