import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Icon from '../ui/Icon'
import { ACTIVITY_FEED, STUDENT_NOTICES } from '../../data/mock'

/**
 * Top-bar popovers — the bell and the help button.
 *
 * Both close on outside click and on Escape, and the bell keeps a small
 * unread badge that clears once the panel has been opened.
 */
function useDismiss(open, onClose) {
  const ref = useRef(null)

  useEffect(() => {
    if (!open) return
    const onPointer = (e) => {
      if (ref.current && !ref.current.contains(e.target)) onClose()
    }
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('mousedown', onPointer)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onPointer)
      document.removeEventListener('keydown', onKey)
    }
  }, [open, onClose])

  return ref
}

const SHORTCUTS = [
  { keys: ['⌘', 'K'], label: 'Search the campus' },
  { keys: ['↑', '↓'], label: 'Move through results' },
  { keys: ['↵'], label: 'Open the selected result' },
  { keys: ['Esc'], label: 'Close a panel' },
  { keys: ['?'], label: 'Open this help panel' },
]

export function NotificationsMenu() {
  const [open, setOpen] = useState(false)
  const [read, setRead] = useState(false)
  const ref = useDismiss(open, () => setOpen(false))

  const items = [
    ...ACTIVITY_FEED.slice(0, 5).map((a) => ({
      id: a.id,
      icon: a.icon,
      title: a.title,
      detail: a.detail,
      time: a.time,
      tone: 'activity',
    })),
    ...STUDENT_NOTICES.slice(0, 2).map((n) => ({
      id: n.id,
      icon: 'clipboard',
      title: n.title,
      detail: n.tag,
      time: n.date,
      tone: 'notice',
    })),
  ]

  return (
    <div className="topbar-menu" ref={ref}>
      <button
        className="shell__icon-btn"
        aria-label="Notifications"
        aria-expanded={open}
        onClick={() => {
          setOpen((o) => !o)
          setRead(true)
        }}
      >
        <Icon name="bell" size={18} />
        {!read && <i className="shell__notif-dot" />}
      </button>

      {open && (
        <div className="popover popover--right" role="dialog" aria-label="Notifications">
          <header className="popover__head">
            <strong>Notifications</strong>
            <span>{items.length} new</span>
          </header>
          <ul className="popover__list">
            {items.map((n) => (
              <li key={n.id} className="popover__item">
                <span className={`popover__item-icon popover__item-icon--${n.tone}`}>
                  <Icon name={n.icon} size={15} />
                </span>
                <span className="popover__item-body">
                  <strong>{n.title}</strong>
                  <span>{n.detail}</span>
                </span>
                <span className="popover__item-time">{n.time}</span>
              </li>
            ))}
          </ul>
          <footer className="popover__foot">View all in Notices</footer>
        </div>
      )}
    </div>
  )
}

export function HelpMenu({ onOpenShortcuts }) {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const ref = useDismiss(open, () => setOpen(false))

  return (
    <div className="topbar-menu" ref={ref}>
      <button
        className="shell__icon-btn"
        aria-label="Help"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        <Icon name="help" size={18} />
      </button>

      {open && (
        <div className="popover popover--right" role="dialog" aria-label="Help and shortcuts">
          <header className="popover__head">
            <strong>Help &amp; shortcuts</strong>
          </header>

          <div className="popover__section">
            <span className="popover__label">Keyboard</span>
            <ul className="popover__keys">
              {SHORTCUTS.map((s) => (
                <li key={s.label}>
                  <span className="popover__keys-label">{s.label}</span>
                  <span className="popover__keys-combo">
                    {s.keys.map((k) => (
                      <kbd key={k}>{k}</kbd>
                    ))}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="popover__section">
            <span className="popover__label">Go to</span>
            <ul className="popover__links">
              <li>
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false)
                    navigate('/app/notices')
                  }}
                >
                  <Icon name="clipboard" size={15} />
                  Notices &amp; circulars
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false)
                    onOpenShortcuts()
                  }}
                >
                  <Icon name="search" size={15} />
                  Search everything
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false)
                    navigate('/app/medha')
                  }}
                >
                  <Icon name="medha" size={15} />
                  Ask Medha AI
                </button>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}
