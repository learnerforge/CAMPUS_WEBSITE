import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Icon from '../ui/Icon'
import {
  COURSES,
  FACULTY,
  HELPDESK_TICKETS,
  LIBRARY_ITEMS,
  PAYMENTS,
  PROGRAMS,
  STUDENTS,
  STUDENT_NOTICES,
} from '../../data/mock'
import './command.css'

/**
 * Global command palette.
 *
 * Searches every route the signed-in role can reach plus the campus records
 * behind them — students, courses, faculty, payments, library items, notices
 * and helpdesk tickets — and jumps straight to the match.
 *
 * Opened with ⌘K / Ctrl+K from anywhere in the shell.
 */
export default function CommandPalette({ open, onClose, sections, role }) {
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const navigate = useNavigate()
  const inputRef = useRef(null)
  const listRef = useRef(null)

  /* ---- Build the searchable index ---- */
  const index = useMemo(() => {
    const groups = []

    const nav = []
    for (const section of sections) {
      for (const item of section.items) {
        nav.push({
          group: 'Navigation',
          label: item.label,
          hint: section.label,
          to: item.to,
          icon: item.icon,
        })
        for (const child of item.children ?? []) {
          nav.push({
            group: 'Navigation',
            label: child.label,
            hint: item.label,
            to: child.to,
            icon: item.icon,
          })
        }
      }
    }
    groups.push({ name: 'Navigation', items: nav })

    const isStudent = role === 'student'

    groups.push({
      name: 'Programmes',
      items: PROGRAMS.map((p) => ({
        group: 'Programmes',
        label: p.name,
        hint: `${p.code} · ${p.filled}/${p.seats} seats`,
        to: '/app/academics/programs',
        icon: 'layers',
      })),
    })

    groups.push({
      name: 'Courses',
      items: COURSES.map((c) => ({
        group: 'Courses',
        label: c.name,
        hint: `${c.code} · ${c.credits} credits · ${c.faculty}`,
        to: isStudent ? '/app/portal/courses' : '/app/academics/courses',
        icon: 'book',
      })),
    })

    if (!isStudent) {
      groups.push({
        name: 'Students',
        items: STUDENTS.map((s) => ({
          group: 'Students',
          label: s.name,
          hint: `${s.roll} · ${s.program} · Sem ${s.sem}`,
          to: '/app/academics/students',
          icon: 'user',
        })),
      })

      groups.push({
        name: 'Faculty',
        items: FACULTY.map((f) => ({
          group: 'Faculty',
          label: f.name,
          hint: `${f.designation} · ${f.dept}`,
          to: '/app/academics/faculty',
          icon: 'user',
        })),
      })

      groups.push({
        name: 'Payments',
        items: PAYMENTS.map((p) => ({
          group: 'Payments',
          label: p.name,
          hint: `${p.id} · ${p.category} · ₹${Number(p.amount).toLocaleString('en-IN')}`,
          to: '/app/finance/payments',
          icon: 'wallet',
        })),
      })

      groups.push({
        name: 'Tickets',
        items: HELPDESK_TICKETS.map((t) => ({
          group: 'Tickets',
          label: t.subject,
          hint: `${t.id} · ${t.category} · ${t.status}`,
          to: '/app/operations/helpdesk',
          icon: 'help',
        })),
      })
    }

    groups.push({
      name: 'Library',
      items: LIBRARY_ITEMS.map((l) => ({
        group: 'Library',
        label: l.title,
        hint: `${l.id} · ${l.author}`,
        to: isStudent ? '/app/portal/library' : '/app/operations/library',
        icon: 'library',
      })),
    })

    groups.push({
      name: 'Notices',
      items: STUDENT_NOTICES.map((n) => ({
        group: 'Notices',
        label: n.title,
        hint: `${n.ref} · ${n.category}`,
        to: '/app/notices',
        icon: 'clipboard',
      })),
    })

    return groups
  }, [sections, role])

  /* ---- Filter ---- */
  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    const matches = []

    for (const group of index) {
      const items = q
        ? group.items.filter(
            (i) =>
              i.label.toLowerCase().includes(q) ||
              String(i.hint).toLowerCase().includes(q),
          )
        : group.items
      if (items.length) matches.push({ name: group.name, items })
    }

    /* An empty query shows navigation first and a trimmed preview of the rest. */
    if (!q) {
      return matches.map((g, i) => (i === 0 ? g : { ...g, items: g.items.slice(0, 3) }))
    }
    return matches
  }, [index, query])

  const flat = useMemo(() => results.flatMap((g) => g.items), [results])

  /* Keep the latest values in refs so the key handler can stay stable. */
  const flatRef = useRef(flat)
  flatRef.current = flat
  const activeRef = useRef(active)
  activeRef.current = active

  /* ---- Reset when reopened ---- */
  useEffect(() => {
    if (open) {
      setQuery('')
      setActive(0)
      inputRef.current?.focus()
      requestAnimationFrame(() => inputRef.current?.focus())
    }
  }, [open])

  useEffect(() => {
    setActive(0)
  }, [query])

  /* Keep the highlighted row inside the scroll area. */
  useEffect(() => {
    const el = listRef.current?.querySelector('.cmd__row.is-active')
    el?.scrollIntoView({ block: 'nearest' })
  }, [active, results])

  /* Keyboard handling lives on the window so the palette still responds when
     focus has not reached the input yet (or has been moved elsewhere). */
  useEffect(() => {
    if (!open) return

    const onKey = (e) => {
      const items = flatRef.current
      const current = activeRef.current

      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
      } else if (e.key === 'ArrowDown') {
        e.preventDefault()
        setActive((i) => (i + 1) % Math.max(items.length, 1))
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setActive((i) => (i - 1 + items.length) % Math.max(items.length, 1))
      } else if (e.key === 'Enter') {
        e.preventDefault()
        const item = items[current]
        if (item) {
          onClose()
          navigate(item.to)
        }
      }
    }

    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose, navigate])

  if (!open) return null

  const go = (item) => {
    if (!item) return
    onClose()
    navigate(item.to)
  }

  let cursor = -1

  return (
    <div className="cmd__backdrop" onMouseDown={onClose}>
      <div
        className="cmd"
        role="dialog"
        aria-modal="true"
        aria-label="Search the campus"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="cmd__search">
          <Icon name="search" size={17} />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search students, courses, fees, notices…"
            aria-label="Search the campus"
          />
          <kbd>Esc</kbd>
        </div>

        <div className="cmd__results" ref={listRef}>
          {flat.length === 0 && (
            <p className="cmd__empty">
              No matches for <strong>{query}</strong>
            </p>
          )}

          {results.map((group) => (
            <section key={group.name} className="cmd__group">
              <h4 className="cmd__group-title">{group.name}</h4>
              {group.items.map((item) => {
                cursor += 1
                const index = cursor
                const isActive = index === active
                return (
                  <button
                    key={`${group.name}-${item.label}-${index}`}
                    type="button"
                    className={`cmd__row ${isActive ? 'is-active' : ''}`}
                    onMouseEnter={() => setActive(index)}
                    onClick={() => go(item)}
                  >
                    <span className="cmd__row-icon">
                      <Icon name={item.icon || 'arrowRight'} size={16} />
                    </span>
                    <span className="cmd__row-text">
                      <strong>{item.label}</strong>
                      <span>{item.hint}</span>
                    </span>
                    <span className="cmd__row-go">
                      <Icon name="arrowRight" size={15} />
                    </span>
                  </button>
                )
              })}
            </section>
          ))}
        </div>

        <footer className="cmd__foot">
          <span>
            <kbd>↑</kbd>
            <kbd>↓</kbd> to navigate
          </span>
          <span>
            <kbd>↵</kbd> to open
          </span>
          <span>
            <kbd>esc</kbd> to close
          </span>
          <span className="cmd__count">{flat.length} results</span>
        </footer>
      </div>
    </div>
  )
}
