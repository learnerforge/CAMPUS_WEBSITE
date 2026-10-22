import { useState } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import Icon from '../ui/Icon'
import { useAuth } from '../../context/AuthContext'
import { NAV_SECTIONS, STUDENT_NAV } from '../../data/nav'
import './shell.css'

export default function AppShell({ children, title }) {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [expanded, setExpanded] = useState({})
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const isStudent = user?.role === 'student'
  const workspaceSection = NAV_SECTIONS.find((s) => s.id === 'workspace')

  const sections = isStudent
    ? [
        { id: 'portal', label: 'Student Portal', items: STUDENT_NAV },
        ...(workspaceSection
          ? [{ ...workspaceSection, items: workspaceSection.items.filter((i) => !i.roles || i.roles.includes('student')) }]
          : []),
      ]
    : NAV_SECTIONS

  const visibleSections = sections
    .map((s) => ({
      ...s,
      items: s.items.filter((i) => !i.roles || i.roles.includes(user?.role)),
    }))
    .filter((s) => s.items.length > 0)

  const toggle = (id) => setExpanded((prev) => ({ ...prev, [id]: !prev[id] }))

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className={`shell ${collapsed ? 'shell--collapsed' : ''} ${mobileOpen ? 'shell--mobile-open' : ''}`}>
      <aside className="shell__sidebar">
        <div className="shell__brand">
          <div className="shell__brand-mark">CX</div>
          <div className="shell__brand-text">
            <strong>CampX</strong>
            <span>Digital Campus</span>
          </div>
          <button
            className="shell__collapse"
            onClick={() => setCollapsed((c) => !c)}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <Icon name={collapsed ? 'chevronRight' : 'chevronLeft'} size={16} />
          </button>
        </div>

        <nav className="shell__nav" aria-label="Primary">
          {visibleSections.map((section) => (
            <div className="shell__section" key={section.id}>
              <span className="shell__section-label">{section.label}</span>
              <ul>
                {section.items.map((item) => {
                  const isActive =
                    location.pathname === item.to ||
                    (item.to !== '/app/dashboard' &&
                      item.to !== '/app/portal' &&
                      location.pathname.startsWith(item.to + '/'))
                  const hasChildren = !!item.children?.length
                  const isOpen = expanded[item.id] ?? isActive

                  return (
                    <li key={item.id}>
                      <NavLink
                        to={item.to}
                        className={`shell__link ${isActive ? 'is-active' : ''} ${item.accent ? 'is-accent' : ''}`}
                        onClick={() => setMobileOpen(false)}
                        title={collapsed ? item.label : undefined}
                      >
                        {item.icon && <Icon name={item.icon} size={18} />}
                        <span className="shell__link-text">{item.label}</span>
                        {hasChildren && (
                          <span
                            className={`shell__chevron ${isOpen ? 'is-open' : ''}`}
                            onClick={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                              toggle(item.id)
                            }}
                            role="button"
                            tabIndex={0}
                            aria-label="Toggle submenu"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault()
                                toggle(item.id)
                              }
                            }}
                          >
                            <Icon name="chevronDown" size={14} />
                          </span>
                        )}
                      </NavLink>

                      {hasChildren && isOpen && (
                        <ul className="shell__sub">
                          {item.children.map((child) => (
                            <li key={child.id}>
                              <NavLink
                                to={child.to}
                                end
                                className={({ isActive: childActive }) =>
                                  `shell__sublink ${childActive ? 'is-active' : ''}`
                                }
                                onClick={() => setMobileOpen(false)}
                              >
                                {child.label}
                              </NavLink>
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </nav>

        <div className="shell__sidebar-foot">
          <div className="shell__ai-card">
            <span className="shell__ai-icon">
              <Icon name="medha" size={16} />
            </span>
            <div className="shell__ai-text">
              <strong>Medha AI</strong>
              <span>Ask your campus</span>
            </div>
            <Icon name="arrowRight" size={15} className="shell__ai-arrow" />
          </div>
        </div>
      </aside>

      {mobileOpen && <div className="shell__scrim" onClick={() => setMobileOpen(false)} />}

      <div className="shell__main">
        <header className="shell__topbar">
          <button
            className="shell__menu-btn"
            onClick={() => setMobileOpen(true)}
            aria-label="Open navigation"
          >
            <Icon name="menu" size={20} />
          </button>

          <div className="shell__topbar-title">
            <h2>{title}</h2>
          </div>

          <div className="shell__topbar-search">
            <Icon name="search" size={16} />
            <input type="search" placeholder="Search students, courses, fees…" />
            <kbd>⌘K</kbd>
          </div>

          <div className="shell__topbar-actions">
            <button className="shell__icon-btn" aria-label="Help">
              <Icon name="help" size={18} />
            </button>
            <button className="shell__icon-btn shell__icon-btn--notif" aria-label="Notifications">
              <Icon name="bell" size={18} />
              <i className="shell__notif-dot" />
            </button>
            <div className="shell__user">
              <span className="shell__avatar">{user?.avatar ?? 'U'}</span>
              <div className="shell__user-text">
                <strong>{user?.name}</strong>
                <span>{user?.roleLabel}</span>
              </div>
              <button className="shell__user-btn" onClick={handleLogout} aria-label="Sign out" title="Sign out">
                <Icon name="logout" size={17} />
              </button>
            </div>
          </div>
        </header>

        <main className="shell__content">{children}</main>
      </div>
    </div>
  )
}
