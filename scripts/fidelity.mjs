/**
 * Fidelity report — measures the replica's login screen against the live
 * original and prints a PASS/FAIL table for every property that can be
 * compared objectively (sizes, colours, spacing, type).
 *
 *   node scripts/fidelity.mjs
 */
import { chromium } from 'playwright'

const ORIGINAL = process.env.ORIGINAL_URL || 'https://mgit.campx.in/'
const REPLICA = process.env.BASE_URL || 'http://localhost:3000/login'

/** Measurements taken from a rendered login screen. */
const MEASURE = () => {
  /* Colours are compared at the pixel level: the browser paints the
     computed colour into a 1x1 canvas and the resulting sRGB byte triple
     is read back. That sidesteps differences in how each side *writes*
     the colour (lab() vs hex) while still comparing what the eye sees. */
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = 1
  const ctx = canvas.getContext('2d', { willReadFrequently: true })

  const toHex = (css) => {
    if (!css) return css
    ctx.clearRect(0, 0, 1, 1)
    ctx.fillStyle = '#123456'
    ctx.fillStyle = css
    ctx.fillRect(0, 0, 1, 1)
    const d = ctx.getImageData(0, 0, 1, 1).data
    const hex = '#' + [d[0], d[1], d[2]].map((v) => v.toString(16).padStart(2, '0')).join('')
    if (hex === '#123456' && css.trim().toLowerCase() !== '#123456') return null
    return hex
  }

  const COLOUR_PROPS = /(^|-)color$|^background-color$|^border-top-color$/

  const box = (el) => {
    if (!el) return null
    const r = el.getBoundingClientRect()
    return {
      w: Math.round(r.width),
      h: Math.round(r.height),
      x: Math.round(r.x),
      y: Math.round(r.y),
    }
  }
  const style = (el, props) => {
    if (!el) return null
    const cs = getComputedStyle(el)
    const out = {}
    for (const p of props) {
      const v = cs.getPropertyValue(p)
      out[p] = v
      if (COLOUR_PROPS.test(p)) out[`${p}#hex`] = toHex(v)
    }
    return out
  }

  const q = (sel) => document.querySelector(sel)

  const card = q('[class*="card"]')
  const inputs = [...document.querySelectorAll('input')]
  const buttons = [...document.querySelectorAll('button')]
  const submit = buttons.find((b) => /sign in/i.test(b.innerText) && !/google|microsoft/i.test(b.innerText))
  const sso = buttons.filter((b) => /google|microsoft/i.test(b.innerText))
  const labels = [...document.querySelectorAll('label')]
  const heading = document.querySelector('h1,h2,h3,h4,h5,h6')
  const para = [...document.querySelectorAll('p')].find((p) => /sign in to continue/i.test(p.innerText))
  const link = [...document.querySelectorAll('a')].find((a) => /forgot/i.test(a.innerText))
  const eye = buttons.find((b) => b.getAttribute('aria-label')?.toLowerCase().includes('password'))
  const sep = [...document.querySelectorAll('div')].find(
    (d) => d.children.length === 3 && d.textContent.trim().toLowerCase() === 'or',
  )
  const sepLabel = [...document.querySelectorAll('p,span')].find(
    (e) => e.textContent.trim().toLowerCase() === 'or' && e.children.length === 0,
  )

  const bodyText = document.body.innerText

  const cardEl = card
  const cardTop = cardEl ? cardEl.getBoundingClientRect().top : 0

  /** Offset of an element from the top of the card — robust against the
      card being centred at a different height. */
  const offset = (el) => {
    if (!el) return null
    return Math.round(el.getBoundingClientRect().top - cardTop)
  }

  return {
    bodyFont: getComputedStyle(document.body).fontFamily.split(',')[0].replace(/"/g, ''),
    heading: { text: heading?.innerText.trim(), ...style(heading, ['font-size', 'font-weight', 'color', 'line-height']), offset: offset(heading) },
    subtitle: { text: para?.innerText.trim().slice(0, 80), ...style(para, ['font-size', 'color']), offset: offset(para) },
    card: {
      ...box(card),
      ...style(card, ['background-color', 'border-radius', 'border-top-width', 'border-top-color', 'padding-top']),
    },
    label: { text: labels[0]?.innerText.trim(), ...style(labels[0], ['font-size', 'font-weight', 'line-height', 'color']), offset: offset(labels[0]) },
    input: { ...box(inputs[0]), ...style(inputs[0], ['height', 'background-color', 'border-radius', 'padding-left', 'font-size']), offset: offset(inputs[0]) },
    submit: { text: submit?.innerText.trim(), ...box(submit), ...style(submit, ['background-color', 'color', 'border-radius', 'font-size', 'font-weight', 'height']), offset: offset(submit) },
    sso: { text: sso[0]?.innerText.trim(), ...box(sso[0]), ...style(sso[0], ['background-color', 'color', 'border-radius', 'font-size', 'height']), offset: offset(sso[0]) },
    forgot: { text: link?.innerText.trim(), ...style(link, ['font-size', 'color']), offset: offset(link) },
    eye: { ...box(eye), ...style(eye, ['color']), offset: offset(eye) },
    sep: { ...box(sep), ...style(sep, ['margin-top', 'margin-bottom']), offset: offset(sep) },
    sepLabel: { ...box(sepLabel), ...style(sepLabel, ['font-size', 'line-height', 'margin-left', 'margin-right']) },
    passwordInput: { ...box(inputs[1]), offset: offset(inputs[1]) },
    logo: { ...box(document.querySelector('svg[aria-label="CampX"]')), offset: offset(document.querySelector('svg[aria-label="CampX"]')) },
    hasDividerOr: /(^|\n)or(\n|$)/i.test(bodyText),
    order: bodyText
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean)
      .slice(0, 14),
  }
}

const browser = await chromium.launch()

async function measure(url) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } })
  const page = await ctx.newPage()
  await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 }).catch(() => {})
  await page.waitForTimeout(2500)
  const data = await page.evaluate(MEASURE)
  await ctx.close()
  return data
}

const o = await measure(ORIGINAL)
const r = await measure(REPLICA)
await browser.close()

/* ---- Compare ---- */
const rows = []
const check = (label, a, b, tolerance = 0) => {
  if (a === b) {
    rows.push(['PASS', label, String(a), String(b)])
    return
  }
  const na = Number(a)
  const nb = Number(b)
  if (!Number.isNaN(na) && !Number.isNaN(nb) && Math.abs(na - nb) <= tolerance) {
    rows.push(['PASS~', label, String(a), String(b)])
    return
  }
  rows.push(['DIFF', label, String(a), String(b)])
}

/** Colour comparisons compare the pixel-normalised hex values. */
const checkColor = (label, a, b) => {
  rows.push([a === b ? 'PASS' : 'DIFF', label, String(a), String(b)])
}

check('font family', o.bodyFont, r.bodyFont)
check('heading text', o.heading.text, r.heading.text)
check('heading size', parseFloat(o.heading['font-size']), parseFloat(r.heading['font-size']), 1.2)
check('heading weight', o.heading['font-weight'], r.heading['font-weight'])
checkColor('heading colour', o.heading['color#hex'], r.heading['color#hex'])
check('subtitle size', parseFloat(o.subtitle['font-size']), parseFloat(r.subtitle['font-size']), 0.6)
checkColor('subtitle colour', o.subtitle['color#hex'], r.subtitle['color#hex'])
check('card width', o.card.w, r.card.w, 2)
check('card radius', o.card['border-radius'], r.card['border-radius'])
check('card padding', parseFloat(o.card['padding-top']), parseFloat(r.card['padding-top']), 1)
checkColor('card bg', o.card['background-color#hex'], r.card['background-color#hex'])
checkColor('card border colour', o.card['border-top-color#hex'], r.card['border-top-color#hex'])
check('label size', parseFloat(o.label['font-size']), parseFloat(r.label['font-size']), 0.6)
check('label weight', o.label['font-weight'], r.label['font-weight'])
check('label text', o.label.text, r.label.text)
check('input height', parseFloat(o.input.height), parseFloat(r.input.height), 1)
checkColor('input bg', o.input['background-color#hex'], r.input['background-color#hex'])
check('input radius', o.input['border-radius'], r.input['border-radius'])
check('input padding-left', parseFloat(o.input['padding-left']), parseFloat(r.input['padding-left']), 0.6)
check('input font-size', parseFloat(o.input['font-size']), parseFloat(r.input['font-size']), 0.6)
check('submit text', o.submit.text, r.submit.text)
check('submit height', parseFloat(o.submit.height), parseFloat(r.submit.height), 1)
checkColor('submit bg', o.submit['background-color#hex'], r.submit['background-color#hex'])
checkColor('submit colour', o.submit['color#hex'], r.submit['color#hex'])
check('submit radius', o.submit['border-radius'], r.submit['border-radius'])
check('submit font-size', parseFloat(o.submit['font-size']), parseFloat(r.submit['font-size']), 0.6)
check('submit weight', o.submit['font-weight'], r.submit['font-weight'])
check('sso text', o.sso.text, r.sso.text)
check('sso height', parseFloat(o.sso.height), parseFloat(r.sso.height), 1)
checkColor('sso bg', o.sso['background-color#hex'], r.sso['background-color#hex'])
checkColor('sso colour', o.sso['color#hex'], r.sso['color#hex'])
check('sso radius', o.sso['border-radius'], r.sso['border-radius'])
check('forgot text', o.forgot.text, r.forgot.text)
checkColor('forgot colour', o.forgot['color#hex'], r.forgot['color#hex'])
check('logo size', `${o.logo.w}x${o.logo.h}`, `${r.logo.w}x${r.logo.h}`, 2)
check('divider "or"', o.hasDividerOr, r.hasDividerOr)

/* ---- Vertical rhythm (offsets from the top of the card) ---- */
check('logo offset', o.logo.offset, r.logo.offset, 2)
check('heading offset', o.heading.offset, r.heading.offset, 2)
check('subtitle offset', o.subtitle.offset, r.subtitle.offset, 2)
check('label offset', o.label.offset, r.label.offset, 2)
check('input offset', o.input.offset, r.input.offset, 2)
check('submit offset', o.submit.offset, r.submit.offset, 2)
check('forgot offset', o.forgot.offset, r.forgot.offset, 2)
check('sso offset', o.sso.offset, r.sso.offset, 2)
check('logo width', o.logo.w, r.logo.w, 2)
check('password input offset', o.passwordInput.offset, r.passwordInput.offset, 2)
check('separator height', o.sep.h, r.sep.h, 2)
check('separator offset', o.sep.offset, r.sep.offset, 2)
check('separator label size', parseFloat(o.sepLabel['font-size']), parseFloat(r.sepLabel['font-size']), 0.6)
check('separator label height', o.sepLabel.h, r.sepLabel.h, 2)
check('separator label margin', parseFloat(o.sepLabel['margin-left']), parseFloat(r.sepLabel['margin-left']), 0.6)

const pad = (s, n) => String(s).padEnd(n)
console.log(pad('STATUS', 8) + pad('PROPERTY', 24) + pad('ORIGINAL', 34) + 'REPLICA')
console.log('-'.repeat(100))
for (const [status, label, a, b] of rows) {
  console.log(pad(status, 8) + pad(label, 24) + pad(a, 34) + b)
}
const diffs = rows.filter((r) => r[0] === 'DIFF').length
console.log('-'.repeat(100))
console.log(`${rows.length - diffs}/${rows.length} match · ${diffs} difference(s)`)

console.log('\n--- ORIGINAL text order ---')
console.log(o.order.join('\n'))
console.log('\n--- REPLICA text order ---')
console.log(r.order.join('\n'))
