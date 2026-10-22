/**
 * Generates `src/components/brand/CampXLogo.jsx` from the captured SVG so
 * the wordmark stays byte-identical to the original.
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'

const svg = readFileSync('reference/original-logo.svg', 'utf8')

const jsx = `/**
 * The CampX wordmark, reproduced from the live portal.
 *
 * The mark is a single-colour "C" ring plus the CAMPX letterforms, with
 * three brand-coloured dots. Colours are baked into the artwork, so this
 * component inherits \`currentColor\` only for the ring.
 */
export default function CampXLogo({ width = 200, height = 47, className = '', ...rest }) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 1954.7 454.9"
      fill="none"
      role="img"
      aria-label="CampX"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...rest}
    >
      ${svg.replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '')}
    </svg>
  )
}
`

mkdirSync('src/components/brand', { recursive: true })
writeFileSync('src/components/brand/CampXLogo.jsx', jsx)
console.log('wrote src/components/brand/CampXLogo.jsx', jsx.length, 'bytes')
