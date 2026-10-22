/**
 * Overflow diagnostic — walks the DOM under a narrow viewport and reports
 * which elements are wider than the viewport, deepest-first, so the source
 * of a horizontal scroll can be identified precisely.
 *
 *   node scripts/overflow-diag.mjs [route] [width]
 */
import { chromium } from 'playwright'

const BASE = process.env.BASE_URL || 'http://localhost:3000'
const ROUTE = process.argv[2] || '/app/dashboard'
const WIDTH = Number(process.argv[3] || 390)

const DIAG = () => {
  const vw = document.documentElement.clientWidth
  const out = []

  const describe = (el) => {
    const cs = getComputedStyle(el)
    const r = el.getBoundingClientRect()
    return {
      sel:
        el.tagName.toLowerCase() +
        (typeof el.className === 'string' && el.className
          ? '.' + el.className.trim().split(/\s+/).slice(0, 3).join('.')
          : ''),
      left: Math.round(r.left),
      right: Math.round(r.right),
      width: Math.round(r.width),
      scrollWidth: el.scrollWidth,
      clientWidth: el.clientWidth,
      display: cs.display,
      minWidth: cs.minWidth,
      overflowX: cs.overflowX,
      whiteSpace: cs.whiteSpace,
      flex: cs.flex,
      gridCols: cs.gridTemplateColumns,
    }
  }

  for (const el of document.querySelectorAll('body *')) {
    const r = el.getBoundingClientRect()
    if (r.right <= vw + 1) continue
    out.push(describe(el))
  }

  return { vw, out }
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

const { vw, out } = await page.evaluate(DIAG)
await browser.close()

console.log(`viewport ${vw} · route ${ROUTE} · ${out.length} element(s) past the edge\n`)
for (const e of out) {
  console.log(
    `${e.sel}\n   left=${e.left} right=${e.right} w=${e.width} scrollW=${e.scrollWidth} clientW=${e.clientWidth}` +
      ` display=${e.display} minW=${e.minWidth} overflowX=${e.overflowX} ws=${e.whiteSpace} flex=${e.flex} cols=${e.gridCols}`,
  )
}
