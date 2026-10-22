/**
 * CSV export helpers.
 *
 * Every "Export" control in the portal produces a real, downloadable file
 * rather than a placeholder toast.
 */

/** Escape a single CSV cell. */
function cell(value) {
  if (value === null || value === undefined) return ''
  const s = String(value)
  return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
}

/**
 * Build a CSV string from a column definition and a row set.
 *
 * @param {Array<{key: string, header: string}>} columns
 * @param {Array<object>} rows
 */
export function rowsToCsv(columns, rows) {
  const header = columns.map((c) => cell(c.header ?? c.key)).join(',')
  const body = rows.map((row) =>
    columns
      .map((c) => {
        const v = c.csv ? c.csv(row) : row[c.key]
        return cell(typeof v === 'number' ? v : v)
      })
      .join(','),
  )
  return [header, ...body].join('\r\n')
}

/** Turn a page title into a safe file stem. */
export function slug(text = '') {
  return (
    String(text)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '') || 'export'
  )
}

/**
 * Trigger a browser download for a blob.
 */
export function downloadBlob(filename, content, mime = 'text/csv;charset=utf-8') {
  const blob = content instanceof Blob ? content : new Blob([content], { type: mime })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  /* Give the browser a tick to start the download before revoking. */
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

/**
 * Download a set of rows as a CSV file.
 *
 * @param {string} name    file name without the extension
 * @param {Array}  columns column definitions ({ key, header })
 * @param {Array}  rows    the rows to write
 * @returns {number} the number of rows written
 */
export function downloadCsv(name, columns, rows) {
  const csv = rowsToCsv(columns, rows)
  downloadBlob(`${slug(name)}.csv`, '﻿' + csv)
  return rows.length
}
