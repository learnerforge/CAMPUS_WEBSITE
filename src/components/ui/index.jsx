import { useMemo, useState } from 'react'
import Icon from './Icon'
import './ui.css'

/* ------------------------------------------------------------------ */
/* Card                                                               */
/* ------------------------------------------------------------------ */

export function Card({ title, subtitle, action, children, padded = true, className = '', ...rest }) {
  return (
    <section className={`card ${className}`} {...rest}>
      {(title || action) && (
        <header className="card__head">
          <div className="card__head-text">
            {title && <h3 className="card__title">{title}</h3>}
            {subtitle && <p className="card__subtitle">{subtitle}</p>}
          </div>
          {action && <div className="card__action">{action}</div>}
        </header>
      )}
      <div className={padded ? 'card__body' : 'card__body card__body--flush'}>{children}</div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Badge                                                              */
/* ------------------------------------------------------------------ */

const BADGE_TONES = {
  neutral: 'badge--neutral',
  success: 'badge--success',
  warning: 'badge--warning',
  danger: 'badge--danger',
  info: 'badge--info',
  indigo: 'badge--indigo',
  violet: 'badge--violet',
}

export function Badge({ tone = 'neutral', children, dot = false, className = '', ...rest }) {
  return (
    <span className={`badge ${BADGE_TONES[tone] || BADGE_TONES.neutral} ${className}`} {...rest}>
      {dot && <i className="badge__dot" />}
      {children}
    </span>
  )
}

/**
 * Maps a free-form status string onto a badge tone.
 */
export function statusTone(status = '') {
  const s = String(status).toLowerCase()
  if (['active', 'success', 'paid', 'published', 'confirmed', 'finalized', 'completed', 'on campus', 'offer accepted', 'verified', 'submitted', 'approved', 'graded'].some((k) => s.includes(k)))
    return 'success'
  if (['pending', 'scheduled', 'in progress', 'draft', 'under review', 'follow-up', 'open', 'at risk', 'new'].some((k) => s.includes(k)))
    return 'warning'
  if (['overdue', 'failed', 'rejected', 'not interested', 'cancelled', 'missing', 'incomplete'].some((k) => s.includes(k)))
    return 'danger'
  if (['partial', 'delayed', 'on leave', 'on sabbatical', 'released'].some((k) => s.includes(k)))
    return 'info'
  if (['refunded', 'closed', 'checked out', 'archived'].some((k) => s.includes(k)))
    return 'neutral'
  return 'neutral'
}

/* ------------------------------------------------------------------ */
/* Button                                                             */
/* ------------------------------------------------------------------ */

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  iconRight,
  loading = false,
  disabled = false,
  className = '',
  type = 'button',
  ...rest
}) {
  return (
    <button
      type={type}
      className={`btn btn--${variant} btn--${size} ${loading ? 'is-loading' : ''} ${className}`}
      disabled={disabled || loading}
      {...rest}
    >
      {loading && <span className="btn__spinner" />}
      {!loading && icon && <Icon name={icon} size={size === 'sm' ? 15 : 17} />}
      {children && <span>{children}</span>}
      {!loading && iconRight && <Icon name={iconRight} size={size === 'sm' ? 15 : 17} />}
    </button>
  )
}

/* ------------------------------------------------------------------ */
/* StatCard                                                           */
/* ------------------------------------------------------------------ */

export function StatCard({ label, value, delta, icon, accent = 'indigo', hint, onClick }) {
  const positive = typeof delta === 'number' && delta >= 0
  return (
    <div className={`stat stat--${accent} ${onClick ? 'stat--clickable' : ''}`} onClick={onClick}>
      <div className="stat__top">
        <span className="stat__label">{label}</span>
        {icon && (
          <span className="stat__icon">
            <Icon name={icon} size={18} />
          </span>
        )}
      </div>
      <div className="stat__value">{value}</div>
      <div className="stat__foot">
        {typeof delta === 'number' && (
          <span className={`stat__delta ${positive ? 'is-up' : 'is-down'}`}>
            <Icon name={positive ? 'trendingUp' : 'trendingDown'} size={13} />
            {Math.abs(delta)}%
          </span>
        )}
        {hint && <span className="stat__hint">{hint}</span>}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* DataTable                                                          */
/* ------------------------------------------------------------------ */

export function DataTable({
  columns,
  rows,
  rowKey = (r, i) => r.id ?? i,
  empty = 'No records found',
  onRowClick,
  dense = false,
  maxHeight,
}) {
  return (
    <div className="table-wrap" style={maxHeight ? { maxHeight, overflowY: 'auto' } : undefined}>
      <table className={`data-table ${dense ? 'data-table--dense' : ''}`}>
        <thead>
          <tr>
            {columns.map((c) => (
              <th key={c.key ?? c.header} style={c.width ? { width: c.width } : undefined}>
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="data-table__empty">
                <Icon name="info" size={18} />
                {empty}
              </td>
            </tr>
          ) : (
            rows.map((row, i) => (
              <tr
                key={rowKey(row, i)}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
                className={onRowClick ? 'is-clickable' : undefined}
              >
                {columns.map((c) => (
                  <td key={c.key ?? c.header}>
                    {c.render ? c.render(row, i) : row[c.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* ProgressBar                                                        */
/* ------------------------------------------------------------------ */

export function ProgressBar({ value = 0, max = 100, tone = 'indigo', showLabel = false, size = 'md' }) {
  const pct = Math.max(0, Math.min(100, max ? (value / max) * 100 : 0))
  return (
    <div className={`progress progress--${size}`}>
      {showLabel && (
        <div className="progress__meta">
          <span className="progress__value">{pct.toFixed(0)}%</span>
        </div>
      )}
      <div className="progress__track">
        <div className={`progress__fill progress__fill--${tone}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Modal                                                              */
/* ------------------------------------------------------------------ */

export function Modal({ open, onClose, title, subtitle, children, footer, size = 'md' }) {
  if (!open) return null
  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <div
        className={`modal modal--${size}`}
        role="dialog"
        aria-modal="true"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <header className="modal__head">
          <div>
            {title && <h3 className="modal__title">{title}</h3>}
            {subtitle && <p className="modal__subtitle">{subtitle}</p>}
          </div>
          <button className="modal__close" onClick={onClose} aria-label="Close dialog">
            <Icon name="plus" size={20} style={{ transform: 'rotate(45deg)' }} />
          </button>
        </header>
        <div className="modal__body">{children}</div>
        {footer && <footer className="modal__foot">{footer}</footer>}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Tabs                                                               */
/* ------------------------------------------------------------------ */

export function Tabs({ tabs, active, onChange, className = '' }) {
  return (
    <div className={`tabs ${className}`} role="tablist">
      {tabs.map((t) => (
        <button
          key={t.id}
          role="tab"
          aria-selected={active === t.id}
          className={`tabs__tab ${active === t.id ? 'is-active' : ''}`}
          onClick={() => onChange(t.id)}
        >
          {t.label}
          {typeof t.count === 'number' && <span className="tabs__count">{t.count}</span>}
        </button>
      ))}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* EmptyState                                                         */
/* ------------------------------------------------------------------ */

export function EmptyState({ icon = 'info', title, message, action }) {
  return (
    <div className="empty">
      <span className="empty__icon">
        <Icon name={icon} size={24} />
      </span>
      <h4 className="empty__title">{title}</h4>
      {message && <p className="empty__message">{message}</p>}
      {action}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* PageHeader                                                         */
/* ------------------------------------------------------------------ */

export function PageHeader({ title, subtitle, breadcrumb, actions, tabs, activeTab, onTabChange }) {
  return (
    <div className="page-header">
      {breadcrumb && (
        <nav className="page-header__crumbs" aria-label="Breadcrumb">
          {breadcrumb.map((c, i) => (
            <span key={c.label} className="page-header__crumb">
              {c.to ? (
                <a href={c.to}>{c.label}</a>
              ) : (
                <span className="is-current">{c.label}</span>
              )}
              {i < breadcrumb.length - 1 && <Icon name="chevronRight" size={13} />}
            </span>
          ))}
        </nav>
      )}
      <div className="page-header__row">
        <div className="page-header__text">
          <h1 className="page-header__title">{title}</h1>
          {subtitle && <p className="page-header__subtitle">{subtitle}</p>}
        </div>
        {actions && <div className="page-header__actions">{actions}</div>}
      </div>
      {tabs && <Tabs tabs={tabs} active={activeTab} onChange={onTabChange} className="page-header__tabs" />}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* SearchBar                                                          */
/* ------------------------------------------------------------------ */

export function SearchBar({ value, onChange, placeholder = 'Search…', className = '' }) {
  return (
    <div className={`searchbar ${className}`}>
      <Icon name="search" size={16} className="searchbar__icon" />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
      {value && (
        <button className="searchbar__clear" onClick={() => onChange('')} aria-label="Clear search">
          <Icon name="xCircle" size={15} />
        </button>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Select                                                              */
/* ------------------------------------------------------------------ */

export function Select({ value, onChange, options, label, className = '', ...rest }) {
  return (
    <label className={`select ${className}`}>
      {label && <span className="select__label">{label}</span>}
      <select value={value} onChange={(e) => onChange(e.target.value)} {...rest}>
        {options.map((o) =>
          typeof o === 'string' ? (
            <option key={o} value={o}>
              {o}
            </option>
          ) : (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ),
        )}
      </select>
      <Icon name="chevronDown" size={15} className="select__caret" />
    </label>
  )
}

/* ------------------------------------------------------------------ */
/* Donut / simple bar chart                                           */
/* ------------------------------------------------------------------ */

export function BarChart({ data, height = 160, showValues = true }) {
  const max = useMemo(() => Math.max(...data.map((d) => d.value), 1), [data])
  return (
    <div className="barchart" style={{ height }}>
      {data.map((d) => (
        <div className="barchart__col" key={d.label}>
          <div className="barchart__bar-wrap">
            <div
              className="barchart__bar"
              style={{
                height: `${(d.value / max) * 100}%`,
                background: d.color || 'var(--indigo-500)',
              }}
              title={`${d.label}: ${d.value}`}
            />
            {showValues && <span className="barchart__value">{d.value}</span>}
          </div>
          <span className="barchart__label">{d.label}</span>
        </div>
      ))}
    </div>
  )
}

export function DonutChart({ data, size = 180, thickness = 22, centerLabel, centerValue }) {
  const total = data.reduce((s, d) => s + d.value, 0) || 1
  let offset = 0
  const segments = data.map((d) => {
    const pct = (d.value / total) * 100
    const seg = { ...d, pct, offset }
    offset += pct
    return seg
  })

  return (
    <div className="donut" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox="0 0 100 100">
        <circle cx="50" cy="50" r={50 - thickness / 2} fill="none" stroke="var(--gray-100)" strokeWidth={thickness} />
        {segments.map((s) => (
          <circle
            key={s.label}
            cx="50"
            cy="50"
            r={50 - thickness / 2}
            fill="none"
            stroke={s.color}
            strokeWidth={thickness}
            strokeDasharray={`${s.pct} ${100 - s.pct}`}
            strokeDashoffset={-s.offset}
            transform="rotate(-90 50 50)"
            strokeLinecap="butt"
          />
        ))}
      </svg>
      {(centerValue || centerLabel) && (
        <div className="donut__center">
          {centerValue && <strong>{centerValue}</strong>}
          {centerLabel && <span>{centerLabel}</span>}
        </div>
      )}
    </div>
  )
}

export function Legend({ data }) {
  return (
    <ul className="legend">
      {data.map((d) => (
        <li key={d.label}>
          <i style={{ background: d.color }} />
          <span className="legend__label">{d.label}</span>
          <span className="legend__value">{d.value}</span>
        </li>
      ))}
    </ul>
  )
}
