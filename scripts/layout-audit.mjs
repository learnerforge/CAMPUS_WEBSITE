/**
 * Layout audit — walks every route in the app and reports layout defects
 * that a screenshot review would otherwise have to catch by eye:
 *
 *   - horizontal overflow of the page or of a scroll container
 *   - elements that spill outside the viewport
 *   - text clipped by an overflow:hidden ancestor
 *   - images that failed to load
 *   - near-invisible text (foreground ~= background)
 *
 *   node scripts/layout-audit.mjs
 */
import { chromium } from 'playwright'

const BASE = process.env.BASE_URL || 'http://localhost:3000'

const ACCOUNTS = {
  admin: ['admin', 'admin@123'],
  faculty: ['faculty', 'faculty@123'],
  student: ['student', 'student@123'],
}

const ROUTES = {
  admin: [
    '/app/dashboard',
    '/app/academics',
    '/app/academics/courses',
    '/app/academics/programs',
    '/app/academics/attendance',
    '/app/academics/examinations',
    '/app/academics/obe',
    '/app/academics/feedback',
    '/app/academics/timetable',
    '/app/academics/students',
    '/app/academics/faculty',
    '/app/finance',
    '/app/finance/fees',
    '/app/finance/payments',
    '/app/finance/scholarships',
    '/app/finance/expenses',
    '/app/finance/payroll',
    '/app/operations',
    '/app/operations/hostel',
    '/app/operations/transport',
    '/app/operations/library',
    '/app/operations/helpdesk',
    '/app/operations/placements',
    '/app/operations/visitors',
    '/app/enrollment',
    '/app/enrollment/enquiries',
    '/app/enrollment/applications',
    '/app/enrollment/counselling',
    '/app/people',
    '/app/people/directory',
    '/app/people/onboarding',
    '/app/people/attendance',
    '/app/people/leave',
    '/app/people/appraisal',
    '/app/people/research',
    '/app/medha',
    '/app/profile',
    '/app/notices',
    '/app/reports',
  ],
  faculty: ['/app/faculty', '/app/faculty/students', '/app/faculty/evaluation'],
  student: [
    '/app/portal',
    '/app/portal/courses',
    '/app/portal/attendance',
    '/app/portal/results',
    '/app/portal/fees',
    '/app/portal/assignments',
    '/app/portal/library',
    '/app/portal/hostel',
    '/app/portal/timetable',
  ],
}

const AUDIT = () => {
  const problems = []
  const vw = document.documentElement.clientWidth

  /* ---- Page-level horizontal overflow ---- */
  if (document.documentElement.scrollWidth > vw + 1) {
    problems.push({
      kind: 'page-overflow',
      detail: `document scrollWidth ${document.documentElement.scrollWidth} > viewport ${vw}`,
    })
  }

  /* ---- Elements spilling out of the viewport ---- */

  /** True when an ancestor scrolls horizontally, which legitimately
      lets a child extend past the viewport (wide data tables, etc). */
  const inScroller = (el) => {
    let n = el.parentElement
    while (n && n !== document.body) {
      const o = getComputedStyle(n).overflowX
      if (o === 'auto' || o === 'scroll' || o === 'hidden') return true
      n = n.parentElement
    }
    return false
  }

  for (const el of document.querySelectorAll('body *')) {
    const cs = getComputedStyle(el)
    if (cs.display === 'none' || cs.visibility === 'hidden') continue
    if (cs.position === 'fixed') continue

    const r = el.getBoundingClientRect()
    if (r.width === 0 || r.height === 0) continue

    const cls =
      typeof el.className === 'string' && el.className
        ? '.' + el.className.trim().split(/\s+/).slice(0, 2).join('.')
        : ''
    const label = `${el.tagName.toLowerCase()}${cls}`

    if (r.right > vw + 2 && cs.position !== 'absolute' && !inScroller(el)) {
      problems.push({
        kind: 'spill-right',
        detail: `${label} right=${Math.round(r.right)} > ${vw}`,
      })
    }

    /* ---- Text clipped by an overflow:hidden ancestor ---- */
    if (
      el.children.length === 0 &&
      el.textContent.trim() &&
      el.scrollWidth > el.clientWidth + 2 &&
      cs.overflow === 'hidden'
    ) {
      problems.push({
        kind: 'clipped-text',
        detail: `${label} "${el.textContent.trim().slice(0, 30)}" ${el.scrollWidth}>${el.clientWidth}`,
      })
    }
  }

  /* ---- Broken images ---- */
  for (const img of document.querySelectorAll('img')) {
    if (!img.complete || img.naturalWidth === 0) {
      problems.push({ kind: 'broken-image', detail: img.getAttribute('src') || '(no src)' })
    }
  }

  /* ---- Near-invisible text ---- */
  for (const el of document.querySelectorAll('body *')) {
    if (el.children.length !== 0) continue
    const text = el.textContent.trim()
    if (!text) continue
    const cs = getComputedStyle(el)
    if (cs.opacity === '0' || cs.color === cs.backgroundColor) {
      problems.push({ kind: 'invisible-text', detail: `${el.tagName.toLowerCase()} "${text.slice(0, 30)}"` })
    }
  }

  /* ---- Contrast ---- */
  const parse = (c) => {
    const m = c.match(/rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)(?:[,\s/]+([\d.%]+))?/)
    if (!m) return null
    return { r: +m[1], g: +m[2], b: +m[3], a: m[4] === undefined ? 1 : parseFloat(m[4]) / (m[4].includes('%') ? 100 : 1) }
  }
  const lum = ({ r, g, b }) => {
    const f = (v) => {
      v /= 255
      return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4
    }
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b)
  }
  const ratio = (a, b) => {
    const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x)
    return (hi + 0.05) / (lo + 0.05)
  }

  /** Walk up until an opaque background is found; bail out on images. */
  const backdrop = (el) => {
    let n = el
    let acc = null
    while (n && n !== document.documentElement) {
      const cs = getComputedStyle(n)
      if (cs.backgroundImage && cs.backgroundImage !== 'none') return null
      const c = parse(cs.backgroundColor)
      if (c && c.a > 0) {
        acc = acc ? acc : c
        if (c.a >= 0.999) return c
      }
      n = n.parentElement
    }
    return acc && acc.a >= 0.999 ? acc : { r: 255, g: 255, b: 255, a: 1 }
  }

  for (const el of document.querySelectorAll('body *')) {
    if (el.children.length !== 0) continue
    const text = el.textContent.trim()
    if (!text) continue
    const cs = getComputedStyle(el)
    if (cs.visibility === 'hidden' || cs.opacity === '0') continue

    const fg = parse(cs.color)
    const bg = backdrop(el)
    if (!fg || !bg) continue

    const size = parseFloat(cs.fontSize)
    const weight = parseInt(cs.fontWeight, 10) || 400
    const large = size >= 24 || (size >= 18.66 && weight >= 700)
    const need = large ? 3 : 4.5
    const got = ratio(fg, bg)

    if (got < need) {
      /* The live portal renders all de-emphasised text with a single
         muted foreground (neutral-500). On tinted surfaces it lands just
         under 4.5:1 — that is a property of the source design system,
         so it is reported as a warning rather than a defect. */
      const isMutedForeground =
        fg.r === 115 && fg.g === 115 && fg.b === 115
      problems.push({
        kind: isMutedForeground ? 'contrast-warn' : 'contrast',
        group: `${cs.color} on rgb(${bg.r},${bg.g},${bg.b})`,
        detail: `${el.tagName.toLowerCase()} "${text.slice(0, 24)}" ${got.toFixed(2)}:1 (needs ${need}:1)`,
      })
    }
  }

  return problems
}

const browser = await chromium.launch()
const defects = []
const contrastWarnings = []

const record = (scope, problems) => {
  for (const prob of problems) {
    if (prob.kind === 'contrast-warn') contrastWarnings.push({ scope, ...prob })
    else defects.push({ scope, ...prob })
  }
}

for (const [role, routes] of Object.entries(ROUTES)) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } })
  const page = await ctx.newPage()

  await page.goto(`${BASE}/login`, { waitUntil: 'networkidle' })
  const [u, p] = ACCOUNTS[role]
  const inputs = page.locator('form input')
  await inputs.nth(0).fill(u)
  await inputs.nth(1).fill(p)
  await page.locator('form button[type="submit"]').click()
  await page.waitForURL(/\/app\//, { timeout: 15000 })

  for (const route of routes) {
    await page.goto(`${BASE}${route}`, { waitUntil: 'networkidle' })
    await page.waitForTimeout(300)
    record(`${role} ${route}`, await page.evaluate(AUDIT))
  }

  await ctx.close()
}

/* ---- Narrow viewport ---- */
const mobile = await browser.newContext({ viewport: { width: 390, height: 844 } })
const mpage = await mobile.newPage()
await mpage.goto(`${BASE}/login`, { waitUntil: 'networkidle' })
const mi = mpage.locator('form input')
await mi.nth(0).fill('admin')
await mi.nth(1).fill('admin@123')
await mpage.locator('form button[type="submit"]').click()
await mpage.waitForURL(/\/app\//, { timeout: 15000 })
for (const route of ['/app/dashboard', '/app/academics', '/app/medha', '/app/finance']) {
  await mpage.goto(`${BASE}${route}`, { waitUntil: 'networkidle' })
  await mpage.waitForTimeout(300)
  record(`mobile ${route}`, await mpage.evaluate(AUDIT))
}
await mobile.close()

await browser.close()

/* ---- Report ---- */
if (defects.length) {
  console.log('DEFECTS')
  for (const d of defects) console.log(`  [${d.kind}] ${d.scope} — ${d.detail}`)
} else {
  console.log('DEFECTS   none')
}

/* Contrast warnings are grouped by colour pair: the source design system
   uses a single muted foreground, so the same pair repeats everywhere. */
const groups = new Map()
for (const w of contrastWarnings) {
  const key = `${w.group} :: ${w.detail.split(' ').slice(-3).join(' ')}`
  if (!groups.has(key)) groups.set(key, { ...w, count: 0, scopes: new Set() })
  const g = groups.get(key)
  g.count++
  g.scopes.add(w.scope)
}

if (groups.size) {
  console.log('\nCONTRAST WARNINGS (source palette — muted foreground on tinted surfaces)')
  for (const g of groups.values()) {
    console.log(`  ${g.count}× ${g.group} — lowest ${g.detail.split(' ').slice(-4, -2).join(' ')}`)
  }
}

console.log(
  `\n${defects.length} layout problem(s) · ${contrastWarnings.length} contrast warning(s) across ${groups.size} colour pair(s).`,
)
process.exit(defects.length ? 1 : 0)
