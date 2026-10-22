/**
 * Throwaway probe for the ⌘K shortcut.
 *   node scripts/dbg-key.mjs
 */
import { chromium } from 'playwright'

const BASE = 'http://localhost:3000'
const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })

page.on('console', (m) => console.log('[page]', m.text()))

await page.goto(`${BASE}/login`, { waitUntil: 'networkidle' })
const inputs = page.locator('form input')
await inputs.nth(0).fill('admin')
await inputs.nth(1).fill('admin@123')
await page.locator('form button[type="submit"]').click()
await page.waitForURL(/\/app\//, { timeout: 15000 })

await page.evaluate(() => {
  window.__keys = []
  window.addEventListener(
    'keydown',
    (e) => {
      window.__keys.push({ key: e.key, ctrl: e.ctrlKey, meta: e.metaKey, defaultPrevented: e.defaultPrevented })
    },
    true,
  )
})

await page.keyboard.press('Control+k')
await page.waitForTimeout(600)

console.log('keys seen:', JSON.stringify(await page.evaluate(() => window.__keys)))
console.log('.cmd count:', await page.locator('.cmd').count())
console.log('.cmd__backdrop count:', await page.locator('.cmd__backdrop').count())
console.log('active element:', await page.evaluate(() => document.activeElement?.className || document.activeElement?.tagName))

/* now try Meta */
await page.keyboard.press('Meta+k')
await page.waitForTimeout(400)
console.log('after Meta+k .cmd count:', await page.locator('.cmd').count())

/* try pressing the key alone to see the key value */
await page.evaluate(() => (window.__keys = []))
await page.keyboard.press('k')
await page.waitForTimeout(200)
console.log('plain k:', JSON.stringify(await page.evaluate(() => window.__keys)))

await browser.close()
