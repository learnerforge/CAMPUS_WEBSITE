/**
 * Pulls the design tokens, logo markup and background art out of the live
 * original so the replica can match it exactly.
 */
import { chromium } from 'playwright'
import { writeFileSync } from 'node:fs'

const ORIGINAL = process.env.ORIGINAL_URL || 'https://mgit.campx.in/'

const browser = await chromium.launch()
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } })
const page = await ctx.newPage()
await page.goto(ORIGINAL, { waitUntil: 'networkidle', timeout: 60000 }).catch(() => {})
await page.waitForTimeout(3000)

const data = await page.evaluate(() => {
  const out = { vars: {}, logo: '', bgImage: '', fonts: [] }

  for (const sheet of document.styleSheets) {
    let list
    try {
      list = sheet.cssRules
    } catch {
      continue
    }
    if (!list) continue
    for (const rule of list) {
      if (rule.style && rule.selectorText === ':root' || rule.selectorText === 'html') {
        for (const p of rule.style) {
          out.vars[p] = rule.style.getPropertyValue(p).trim()
        }
      }
    }
  }

  // Logo SVG — the first sizeable <svg> inside the card
  const svgs = [...document.querySelectorAll('#root svg')]
  out.logo = svgs.length ? svgs[0].outerHTML : ''

  // Background art
  const img = document.querySelector('img.h-full')
  out.bgImage = img ? img.getAttribute('src') : ''

  for (const l of document.querySelectorAll('link[rel="stylesheet"]')) {
    out.fonts.push(l.getAttribute('href'))
  }

  return out
})

await browser.close()

writeFileSync('reference/original-tokens.json', JSON.stringify(data, null, 2))
console.log('vars:', Object.keys(data.vars).length)
console.log('logo length:', data.logo.length)
console.log('bgImage:', data.bgImage)
console.log('fonts:', data.fonts.join('\n       '))
