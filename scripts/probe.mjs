/**
 * Probe — prints the box model of a chain of selectors at a given viewport,
 * plus every element whose content is wider than its own box.
 *
 *   node scripts/probe.mjs <route> <width> <selector> [selector...]
 */
import { chromium } from 'playwright'

const BASE = process.env.BASE_URL || 'http://localhost:3000'
const ROUTE = process.argv[2] || '/app/dashboard'
const WIDTH = Number(process.argv[3] || 390)
const SELECTORS = process.argv
  .slice(4)
  .map((s) => s.replace(/["']/g, ''))
  .filter(Boolean)

const PROBE = (selectors) => {
  const out = { boxes: [], wide: [] }
  const vw = document.documentElement.clientWidth

  for (const sel of selectors) {
    for (const el of document.querySelectorAll(sel)) {
      const r = el.getBoundingClientRect()
      const cs = getComputedStyle(el)
      out.boxes.push({
        sel,
        left: Math.round(r.left),
        right: Math.round(r.right),
        w: Math.round(r.width),
        scrollW: el.scrollWidth,
        clientW: el.clientWidth,
        display: cs.display,
        minW: cs.minWidth,
        overflowX: cs.overflowX,
        gridCols: cs.gridTemplateColumns,
        flex: cs.flex,
      })
    }
  }

  for (const el of document.querySelectorAll('body *')) {
    const cs = getComputedStyle(el)
    if (cs.display === 'none') continue
    if (el.scrollWidth > el.clientWidth + 1 && el.clientWidth > 0) {
      const r = el.getBoundingClientRect()
      out.wide.push({
        sel:
          el.tagName.toLowerCase() +
          (typeof el.className === 'string' && el.className
            ? '.' + el.className.trim().split(/\s+/).slice(0, 3).join('.')
            : ''),
        left: Math.round(r.left),
        w: Math.round(r.width),
        scrollW: el.scrollWidth,
        clientW: el.clientWidth,
        overflowX: cs.overflowX,
        display: cs.display,
        text: (el.textContent || '').trim().slice(0, 30),
      })
    }
  }
  out.vw = vw
  out.docScrollW = document.documentElement.scrollWidth
  return out
}

const browser = await chromium.launch()
const ctx = await browser.newContext({ viewport: { width: WIDTH, height: 844 } })
const page = await ctx.newPage()

await page.goto(`${BASE}/login`, { waitUntil: 'networkidle' })
const inputs = page.locator('form input')
await inputs.nth(0).fill('admin')
await inputs.nth(1).fill('admin@123')
await page.locator('form button[type="submit"]').click()
await page.waitForURL(/\/app\//, { timeout: 15000 })

await page.goto(`${BASE}${ROUTE}`, { waitUntil: 'networkidle' })
await page.waitForTimeout(400)

const data = await page.evaluate(PROBE, SELECTORS)
await browser.close()

console.log(`viewport ${data.vw} · doc scrollWidth ${data.docScrollW} · route ${ROUTE}\n`)
console.log('--- boxes ---')
for (const b of data.boxes) {
  console.log(
    `${b.sel.padEnd(28)} left=${String(b.left).padStart(5)} right=${String(b.right).padStart(5)} w=${String(b.w).padStart(5)} scrollW=${String(b.scrollW).padStart(5)} clientW=${String(b.clientW).padStart(5)} ${b.display} minW=${b.minW} ovX=${b.overflowX} flex=${b.flex} cols=${b.gridCols}`,
  )
}
console.log('\n--- content wider than box ---')
for (const w of data.wide) {
  console.log(
    `${w.sel.padEnd(38)} left=${String(w.left).padStart(5)} w=${String(w.w).padStart(5)} scrollW=${String(w.scrollW).padStart(5)} clientW=${String(w.clientW).padStart(5)} ovX=${w.overflowX} ${w.display} "${w.text}"`,
  )
}
