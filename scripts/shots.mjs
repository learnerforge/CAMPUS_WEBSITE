/**
 * Visual capture — drives the running dev server with a real browser and
 * writes screenshots to `screenshots/` so the UI can be reviewed.
 *
 *   npm run dev          # in one terminal
 *   npm run shots        # in another
 */
import { chromium } from 'playwright'
import { mkdirSync } from 'node:fs'

const BASE = process.env.BASE_URL || 'http://localhost:3000'
const OUT = 'screenshots'

const ACCOUNTS = {
  admin: ['admin', 'admin@123'],
  faculty: ['faculty', 'faculty@123'],
  student: ['student', 'student@123'],
}

const SHOTS = [
  { name: 'login', path: '/login', as: null },
  { name: 'dashboard', path: '/app/dashboard', as: 'admin' },
  { name: 'academics', path: '/app/academics', as: 'admin' },
  { name: 'academics-courses', path: '/app/academics/courses', as: 'admin' },
  { name: 'attendance', path: '/app/academics/attendance', as: 'admin' },
  { name: 'finance', path: '/app/finance', as: 'admin' },
  { name: 'payments', path: '/app/finance/payments', as: 'admin' },
  { name: 'operations', path: '/app/operations', as: 'admin' },
  { name: 'library', path: '/app/operations/library', as: 'admin' },
  { name: 'enrollment', path: '/app/enrollment', as: 'admin' },
  { name: 'people', path: '/app/people', as: 'admin' },
  { name: 'directory', path: '/app/people/directory', as: 'admin' },
  { name: 'medha', path: '/app/medha', as: 'admin' },
  { name: 'profile', path: '/app/profile', as: 'admin' },
  { name: 'notices', path: '/app/notices', as: 'admin' },
  { name: 'reports', path: '/app/reports', as: 'admin' },
  { name: 'not-found', path: '/app/nope', as: 'admin' },
  { name: 'faculty-portal', path: '/app/faculty', as: 'faculty' },
  { name: 'faculty-students', path: '/app/faculty/students', as: 'faculty' },
  { name: 'faculty-evaluation', path: '/app/faculty/evaluation', as: 'faculty' },
  { name: 'portal', path: '/app/portal', as: 'student' },
  { name: 'portal-courses', path: '/app/portal/courses', as: 'student' },
  { name: 'portal-attendance', path: '/app/portal/attendance', as: 'student' },
  { name: 'portal-results', path: '/app/portal/results', as: 'student' },
  { name: 'portal-fees', path: '/app/portal/fees', as: 'student' },
  { name: 'portal-timetable', path: '/app/portal/timetable', as: 'student' },
]

mkdirSync(OUT, { recursive: true })

const browser = await chromium.launch()
const problems = []

/** One browser context per role so each keeps its own session. */
async function makeContext(role, opts = {}) {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1,
    ...opts,
  })
  context.on('page', (p) => {
    p.on('pageerror', (e) => problems.push(`pageerror[${role}]: ${e.message}`))
    p.on('console', (m) => {
      if (m.type() === 'error') problems.push(`console[${role}]: ${m.text()}`)
    })
  })

  if (role) {
    const page = await context.newPage()
    await page.goto(`${BASE}/login`, { waitUntil: 'networkidle' })
    const [username, password] = ACCOUNTS[role]
    const inputs = page.locator('form input')
    await inputs.nth(0).fill(username)
    await inputs.nth(1).fill(password)
    await page.locator('form button[type="submit"]').click()
    await page.waitForURL(/\/app\//, { timeout: 15000 })
    await page.close()
  }

  return context
}

const contexts = {
  anon: await makeContext(null),
  admin: await makeContext('admin'),
  faculty: await makeContext('faculty'),
  student: await makeContext('student'),
}

for (const shot of SHOTS) {
  const page = await contexts[shot.as ?? 'anon'].newPage()
  await page.goto(`${BASE}${shot.path}`, { waitUntil: 'networkidle' })
  await page.waitForTimeout(450)
  await page.screenshot({ path: `${OUT}/${shot.name}.png`, fullPage: true })
  console.log(`captured ${shot.name}`)
  await page.close()
}

/* ---- Mobile pass ---- */
const mobile = await browser.newContext({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 2,
  isMobile: true,
  hasTouch: true,
})
const mpage = await mobile.newPage()
await mpage.goto(`${BASE}/login`, { waitUntil: 'networkidle' })
await mpage.waitForTimeout(300)
await mpage.screenshot({ path: `${OUT}/mobile-login.png`, fullPage: true })
console.log('captured mobile-login')

const madmin = await mobile.newPage()
await madmin.goto(`${BASE}/login`, { waitUntil: 'networkidle' })
const mi = madmin.locator('form input')
await mi.nth(0).fill('admin')
await mi.nth(1).fill('admin@123')
await madmin.locator('form button[type="submit"]').click()
await madmin.waitForURL(/\/app\//, { timeout: 15000 })
await madmin.waitForTimeout(600)
await madmin.screenshot({ path: `${OUT}/mobile-dashboard.png`, fullPage: true })
console.log('captured mobile-dashboard')
await mobile.close()

for (const c of Object.values(contexts)) await c.close()
await browser.close()

if (problems.length) {
  console.log(`\n${problems.length} runtime problem(s):`)
  for (const p of [...new Set(problems)]) console.log(' -', p)
  process.exit(1)
}
console.log('\nNo console or page errors.')
