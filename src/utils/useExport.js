import { useCallback } from 'react'
import { useToast } from '../context/ToastContext'
import { downloadCsv, slug } from './csv'

/**
 * Hook that turns a dataset into a real CSV download and reports the result.
 *
 *   const exportCsv = useExport()
 *   exportCsv('students', columns, rows)
 */
export function useExport() {
  const toast = useToast()

  return useCallback(
    (name, columns, rows, { label = 'rows', notify = true } = {}) => {
      const usable = (columns ?? []).filter((c) => c && c.key && c.header)
      const list = rows ?? []

      if (!usable.length || !list.length) {
        if (notify) toast.error('Nothing to export')
        return 0
      }

      const written = downloadCsv(name, usable, list)

      if (notify) {
        toast.success(
          `Exported ${written} ${label} to ${slug(name)}.csv`,
          { title: 'Export complete' },
        )
      }

      return written
    },
    [toast],
  )
}
