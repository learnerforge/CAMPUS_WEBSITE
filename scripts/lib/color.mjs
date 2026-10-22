/**
 * Colour helpers shared by the fidelity and token scripts.
 *
 * Chrome reports colours as `rgb(...)` for hex-authored CSS but as
 * `lab(...)` for colours authored in the lab() function, so both sides
 * have to be normalised before they can be compared.
 */

/** Convert a CIE Lab colour to an sRGB hex string. */
export function labToHex(L, a, b) {
  const fy = (L + 16) / 116
  const fx = a / 500 + fy
  const fz = -b / 200 + fy

  const finv = (t) => (t ** 3 > 0.008856 ? t ** 3 : (t - 16 / 116) / 7.787)
  const x = finv(fx) * 0.95047
  const y = finv(fy)
  const z = finv(fz) * 1.08883

  const r = x * 3.2406 + y * -1.5372 + z * -0.4986
  const g = x * -0.9689 + y * 1.8758 + z * 0.0415
  const bl = x * 0.0557 + y * -0.204 + z * 1.057

  const gamma = (c) =>
    c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(Math.max(c, 0), 1 / 2.4) - 0.055
  const to255 = (c) => Math.max(0, Math.min(255, Math.round(gamma(c) * 255)))

  return '#' + [r, g, bl].map((c) => to255(c).toString(16).padStart(2, '0')).join('')
}

/**
 * Normalise any CSS colour string to a lower-case hex value so two
 * colours reported in different notations compare equal.
 */
export function normalizeColor(value) {
  if (!value) return value

  const lab = value.match(/lab\(\s*([\d.]+)\s+([\d.-]+)\s+([\d.-]+)\s*\)/)
  if (lab) return labToHex(+lab[1], +lab[2], +lab[3])

  const rgb = value.match(/rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)/)
  if (rgb) {
    return (
      '#' +
      [rgb[1], rgb[2], rgb[3]]
        .map((c) => Math.round(+c).toString(16).padStart(2, '0'))
        .join('')
    )
  }

  return value.trim().toLowerCase()
}
