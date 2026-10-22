/**
 * Converts the original's CSS custom properties into a compact summary and
 * resolves the `lab()` colours to hex.
 */
import { readFileSync, writeFileSync } from 'node:fs'

const tokens = JSON.parse(readFileSync('reference/original-tokens.json', 'utf8'))

/* ---- lab()/oklab() -> sRGB hex ---- */
function labToHex(L, a, b) {
  const k = (n) => (n + 16) / 116
  const fy = (L + 16) / 116
  const fx = a / 500 + fy
  const fz = -b / 200 + fy

  const finv = (t) => (t ** 3 > 0.008856 ? t ** 3 : (t - 16 / 116) / 7.787)
  const x = finv(fx) * 0.95047
  const y = finv(fy)
  const z = finv(fz) * 1.08883

  let r = x * 3.2406 + y * -1.5372 + z * -0.4986
  let g = x * -0.9689 + y * 1.8758 + z * 0.0415
  let bl = x * 0.0557 + y * -0.204 + z * 1.057

  const gamma = (c) =>
    c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(Math.max(c, 0), 1 / 2.4) - 0.055
  const to255 = (c) => Math.max(0, Math.min(255, Math.round(gamma(c) * 255)))

  return '#' + [r, g, bl].map((c) => to255(c).toString(16).padStart(2, '0')).join('')
}

function resolve(value) {
  if (!value) return value
  const lab = value.match(/lab\(\s*([\d.]+)\s+([\d.-]+)\s+([\d.-]+)\s*\)/)
  if (lab) return labToHex(+lab[1], +lab[2], +lab[3])
  const rgb = value.match(/rgb\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)\s*\)/)
  if (rgb) {
    return (
      '#' +
      [rgb[1], rgb[2], rgb[3]]
        .map((c) => Math.round(+c).toString(16).padStart(2, '0'))
        .join('')
    )
  }
  return value
}

const interesting = Object.keys(tokens.vars).filter(
  (k) =>
    !/^(font|shadow|blur|perspective|aspect|spacing|breakpoint|text|leading|tracking|container|radius-(xs|sm|md|lg|xl|2xl|3xl)$)/.test(k) &&
    tokens.vars[k] !== '0px' &&
    !/^(0|1|2|3|4|5|6|8|10|12|16|20|24|32|40|48|56|64|72|80|96|128|160|192|224|256|320|384|448|512|576|640|704|768|896|1024|1280|1536)$/.test(
      tokens.vars[k],
    ),
)

const lines = interesting.map((k) => `  ${k}: ${tokens.vars[k]};` + (resolve(tokens.vars[k]) !== tokens.vars[k] ? `   /* ${resolve(tokens.vars[k])} */` : ''))

writeFileSync('reference/original-vars.css', `:root {\n${lines.join('\n')}\n}\n`)

console.log('--- resolved key colours ---')
for (const k of [
  '--primary',
  '--primary-foreground',
  '--secondary-foreground',
  '--background',
  '--foreground',
  '--card',
  '--card-foreground',
  '--muted-foreground',
  '--border',
  '--input',
  '--input-background',
  '--destructive',
  '--ring',
  '--radius',
  '--radius-field',
  '--radius-card',
  '--button-radius',
  '--button-secondary-fill',
  '--card-shadow',
  '--elevation-xs',
  '--elevation-btn-brand',
  '--duration-fast',
  '--duration-base',
  '--duration-slow',
  '--duration-slower',
  '--ease-default',
  '--press-translate',
  '--press-scale',
  '--ring-width',
]) {
  const v = tokens.vars[k]
  if (v === undefined) {
    console.log(`  ${k}: (missing)`)
    continue
  }
  console.log(`  ${k}: ${v}   ${resolve(v) !== v ? '-> ' + resolve(v) : ''}`)
}

console.log('\n--- full var dump written to reference/original-vars.css ---')
console.log('--- logo svg ---')
writeFileSync('reference/original-logo.svg', tokens.logo)
console.log(tokens.logo.slice(0, 400) + ' …')
