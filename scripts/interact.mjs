/**
 * Interaction harness — drives the real app in Chromium and asserts that the
 * interactive affordances actually change state.
 *
 *   node scripts/interact.mjs
 */
import { chromium } from 'playwright'

const BASE = process.env.BASE_URL || 'http://localhost:3000'

let pass = 0
let fail = 0
const failures = []

const check = async (name, fn) => {
  try {
    await fn()
    pass++
    console.log(`ok    ${name}`)
  } catch (err) {
    fail++
    failures.push(`${name} — ${err.message}`)
    console.log(`FAIL  ${name}  ${err.message}`)
  }
}

const assert = (cond, msg) => {
  if (!cond) throw new Error(msg)
}

const browser = await chromium.launch()
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } })
const page = await ctx.newPage()

const errors = []
page.on('pageerror', (e) => errors.push(String(e)))
page.on('console', (m) => {
  if (m.type() === 'error') errors.push(m.text())
})

/* ---- Sign in ---- */
await page.goto(`${BASE}/login`, { waitUntil: 'networkidle' })
const inputs = page.locator('form input')
await inputs.nth(0).fill('admin')
await inputs.nth(1).fill('admin@123')
await page.locator('form button[type="submit"]').click()
await page.waitForURL(/\/app\//, { timeout: 15000 })
await page.waitForSelector('.shell__sidebar', { timeout: 15000 })

/* ------------------------------------------------------------------ */
/* Command palette (⌘K)                                               */
/* ------------------------------------------------------------------ */

await check('⌘K opens the command palette', async () => {
  await page.keyboard.press('Control+k')
  await page.waitForSelector('.cmd', { timeout: 5000 })
  assert(await page.locator('.cmd input').isVisible(), 'palette input not visible')
})

await check('palette lists navigation results', async () => {
  const rows = await page.locator('.cmd__row').count()
  assert(rows > 3, `expected several results, got ${rows}`)
})

await check('typing filters the palette', async () => {
  await page.locator('.cmd input').fill('Priya')
  await page.waitForTimeout(200)
  const labels = await page.locator('.cmd__row-text strong').allTextContents()
  assert(labels.length > 0, 'no results for "Priya"')
  assert(
    labels.some((l) => l.toLowerCase().includes('priya')),
    `expected a student match, got ${JSON.stringify(labels)}`,
  )
})

await check('palette shows the student group', async () => {
  const groups = await page.locator('.cmd__group-title').allTextContents()
  assert(groups.includes('Students'), `expected a Students group, got ${JSON.stringify(groups)}`)
})

await check('Enter navigates to the selected result', async () => {
  await page.locator('.cmd input').fill('Priya Sharma')
  await page.waitForTimeout(150)
  await page.locator('.cmd input').press('Enter')
  await page.waitForURL(/\/app\/academics\/students/, { timeout: 5000 })
  await page.waitForSelector('.cmd', { state: 'detached', timeout: 5000 })
})

await check('Escape closes the palette', async () => {
  await page.keyboard.press('Control+k')
  await page.waitForSelector('.cmd', { timeout: 5000 })
  await page.keyboard.press('Escape')
  await page.waitForSelector('.cmd', { state: 'detached', timeout: 5000 })
})

await check('clicking the top-bar search opens the palette', async () => {
  await page.locator('.shell__topbar-search').click()
  await page.waitForSelector('.cmd', { timeout: 5000 })
  await page.keyboard.press('Escape')
  await page.waitForSelector('.cmd', { state: 'detached', timeout: 5000 })
})

/* ------------------------------------------------------------------ */
/* Top-bar popovers                                                   */
/* ------------------------------------------------------------------ */

await check('the bell opens a notifications panel', async () => {
  await page.locator('button[aria-label="Notifications"]').click()
  await page.waitForSelector('.popover--right', { timeout: 5000 })
  const items = await page.locator('.popover__item').count()
  assert(items > 0, 'notifications panel is empty')
})

await check('clicking outside closes the notifications panel', async () => {
  await page.locator('.shell__topbar-title h2').click()
  await page.waitForSelector('.popover--right', { state: 'detached', timeout: 5000 })
})

await check('the help button opens a shortcuts panel', async () => {
  await page.locator('button[aria-label="Help"]').click()
  await page.waitForSelector('.popover--right', { timeout: 5000 })
  const keys = await page.locator('.popover__keys li').count()
  assert(keys >= 4, `expected a shortcut list, got ${keys} rows`)
})

await check('help → "Search everything" opens the palette', async () => {
  await page.locator('.popover__links button', { hasText: 'Search everything' }).click()
  await page.waitForSelector('.cmd', { timeout: 5000 })
  await page.keyboard.press('Escape')
})

/* ------------------------------------------------------------------ */
/* List page: search, filter, reset, detail modal                     */
/* ------------------------------------------------------------------ */

await page.goto(`${BASE}/app/academics/students`, { waitUntil: 'networkidle' })

await check('search narrows the table', async () => {
  const before = await page.locator('.data-table tbody tr').count()
  await page.locator('.listpage__toolbar input').fill('Priya')
  await page.waitForTimeout(250)
  const after = await page.locator('.data-table tbody tr').count()
  assert(after === 1, `expected 1 row, got ${after} (was ${before})`)
})

await check('the footer reports the filtered count', async () => {
  const text = await page.locator('.listpage__footer').innerText()
  assert(/Showing\s+1\s+of/i.test(text), `unexpected footer: ${text}`)
})

await check('an empty result shows the empty state', async () => {
  await page.locator('.listpage__toolbar input').fill('zzzznotarealname')
  await page.waitForTimeout(250)
  assert(
    await page.locator('.empty').first().isVisible(),
    'empty state not shown',
  )
})

await check('reset restores every row', async () => {
  await page.locator('.listpage__toolbar button', { hasText: 'Reset' }).click()
  await page.waitForTimeout(250)
  const rows = await page.locator('.data-table tbody tr').count()
  assert(rows === 10, `expected 10 rows, got ${rows}`)
})

await check('a status filter narrows the table', async () => {
  const selects = page.locator('.listpage__toolbar select')
  const count = await selects.count()
  assert(count > 0, 'no filter selects rendered')
  const options = await selects.first().locator('option').allTextContents()
  assert(options.length > 1, 'filter has no options')
  const target = options.find((o) => o !== options[0])
  await selects.first().selectOption({ label: target })
  await page.waitForTimeout(250)
  const rows = await page.locator('.data-table tbody tr').count()
  assert(rows > 0 && rows < 10, `filter did not narrow the table (${rows} rows)`)
})

await check('clicking a row opens the detail modal', async () => {
  await page.locator('.listpage__toolbar button', { hasText: 'Reset' }).click()
  await page.waitForTimeout(200)
  await page.locator('.data-table tbody tr').first().click()
  await page.waitForSelector('.modal', { timeout: 5000 })
  assert(await page.locator('.modal__title').isVisible(), 'modal has no title')
})

await check('the detail modal closes', async () => {
  await page.locator('.modal__close').click()
  await page.waitForSelector('.modal', { state: 'detached', timeout: 5000 })
})

/* ------------------------------------------------------------------ */
/* Tabs                                                                */
/* ------------------------------------------------------------------ */

await check('tabs switch the active panel', async () => {
  await page.goto(`${BASE}/app/finance/payments`, { waitUntil: 'networkidle' })
  const tabs = page.locator('.tabs__tab')
  if ((await tabs.count()) < 2) return
  const before = await page.locator('.tabs__tab.is-active').innerText()
  const index = await tabs.evaluateAll((els) =>
    els.findIndex((e) => e.classList.contains('is-active')),
  )
  const next = (index + 1) % (await tabs.count())
  await tabs.nth(next).click()
  await page.waitForTimeout(250)
  const after = await page.locator('.tabs__tab.is-active').innerText()
  assert(after !== before, `active tab did not change (${before})`)
})

/* ------------------------------------------------------------------ */
/* CSV export                                                          */
/* ------------------------------------------------------------------ */

await check('Export downloads the visible rows as CSV', async () => {
  await page.goto(`${BASE}/app/academics/students`, { waitUntil: 'networkidle' })
  await page.waitForSelector('.data-table tbody tr')

  const [download] = await Promise.all([
    page.waitForEvent('download', { timeout: 10000 }),
    page.locator('.page-header__actions button', { hasText: 'Export' }).click(),
  ])

  const name = download.suggestedFilename()
  assert(name === 'students.csv', `unexpected file name: ${name}`)

  const stream = await download.createReadStream()
  let csv = ''
  for await (const chunk of stream) csv += chunk

  const lines = csv.trim().split(/\r?\n/)
  assert(lines.length === 11, `expected a header plus 10 rows, got ${lines.length}`)
  assert(/Roll No/i.test(lines[0]), `unexpected header: ${lines[0]}`)
  assert(/Priya Sharma/.test(csv), 'CSV is missing the first student row')
})

await check('Export honours the active filter', async () => {
  await page.locator('.listpage__toolbar input').fill('Priya')
  await page.waitForTimeout(250)

  const [download] = await Promise.all([
    page.waitForEvent('download', { timeout: 10000 }),
    page.locator('.page-header__actions button', { hasText: 'Export' }).click(),
  ])

  const stream = await download.createReadStream()
  let csv = ''
  for await (const chunk of stream) csv += chunk

  const lines = csv.trim().split(/\r?\n/)
  assert(lines.length === 2, `expected a header plus 1 row, got ${lines.length}`)
})

/* ------------------------------------------------------------------ */
/* Medha assistant                                                     */
/* ------------------------------------------------------------------ */

await check('Medha replies to a message', async () => {
  await page.goto(`${BASE}/app/medha`, { waitUntil: 'networkidle' })
  const before = await page.locator('.medha__msg').count()
  await page.locator('.medha__input input, .medha__composer input, .medha input[type="text"]').first().fill('How many students are enrolled?')
  await page.keyboard.press('Enter')
  await page.waitForTimeout(1200)
  const after = await page.locator('.medha__msg').count()
  assert(after > before, `expected a new message (${before} → ${after})`)
})

await check('Medha accepts a file attachment', async () => {
  await page.goto(`${BASE}/app/medha`, { waitUntil: 'networkidle' })

  await page.locator('.medha__file-input').setInputFiles({
    name: 'attendance-october.csv',
    mimeType: 'text/csv',
    buffer: Buffer.from('roll,attendance\n21CS042,92\n21CS018,78\n'),
  })

  await page.waitForSelector('.medha__attachment', { timeout: 5000 })
  const label = await page.locator('.medha__attachment-name').innerText()
  assert(label === 'attendance-october.csv', `unexpected chip text: ${label}`)

  await page.locator('.medha__input input[type="text"], .medha__composer input:not([type="file"])').first().fill('Summarise this file')
  await page.keyboard.press('Enter')
  await page.waitForTimeout(1200)

  const sent = await page.locator('.medha__msg--user .medha__file').allTextContents()
  assert(
    sent.some((t) => t.includes('attendance-october.csv')),
    `attachment not shown on the sent message: ${JSON.stringify(sent)}`,
  )
})

/* ------------------------------------------------------------------ */
/* Sidebar                                                             */
/* ------------------------------------------------------------------ */

await check('the sidebar collapses and expands', async () => {
  await page.goto(`${BASE}/app/dashboard`, { waitUntil: 'networkidle' })
  const width = async () =>
    (await page.locator('.shell__sidebar').boundingBox()).width
  const open = await width()
  await page.locator('.shell__collapse').click()
  await page.waitForTimeout(400)
  const collapsed = await width()
  assert(collapsed < open, `sidebar did not shrink (${open} → ${collapsed})`)
  await page.locator('.shell__collapse').click()
  await page.waitForTimeout(400)
  assert((await width()) === open, 'sidebar did not restore')
})

await check('sidebar navigation marks the active item', async () => {
  await page.goto(`${BASE}/app/academics`, { waitUntil: 'networkidle' })
  await page.waitForTimeout(300)
  const active = await page.locator('.shell__link.is-active').count()
  assert(active === 1, `expected exactly one active nav item, got ${active}`)
})

/* ------------------------------------------------------------------ */
/* Mobile drawer                                                       */
/* ------------------------------------------------------------------ */

await check('the mobile drawer opens and closes', async () => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto(`${BASE}/app/dashboard`, { waitUntil: 'networkidle' })
  await page.locator('.shell__menu-btn').click()
  await page.waitForTimeout(400)
  const open = await page.locator('.shell__sidebar').boundingBox()
  assert(open.x >= -1, `drawer did not slide in (x=${open.x})`)
  await page.locator('.shell__scrim').click({ position: { x: 340, y: 400 } })
  await page.waitForTimeout(400)
  const closed = await page.locator('.shell__sidebar').boundingBox()
  assert(closed.x < 0, `drawer did not slide out (x=${closed.x})`)
  await page.setViewportSize({ width: 1440, height: 900 })
})

/* ------------------------------------------------------------------ */

await browser.close()

if (errors.length) {
  console.log('\nConsole/page errors:')
  for (const e of errors) console.log(`  ${e}`)
}

console.log(`\n${pass} passed · ${fail} failed`)
process.exit(fail || errors.length ? 1 : 0)
