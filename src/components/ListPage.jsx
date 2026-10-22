import { useMemo, useState } from 'react'
import Icon from './ui/Icon'
import {
  Badge,
  Button,
  Card,
  DataTable,
  EmptyState,
  Modal,
  PageHeader,
  SearchBar,
  Select,
  StatCard,
  statusTone,
} from './ui'
import './datapage.css'

/**
 * Generic list page used across every module.
 *
 * @param {object}   props
 * @param {string}   props.title
 * @param {string}   props.subtitle
 * @param {Array}    props.columns     DataTable column defs
 * @param {Array}    props.rows
 * @param {string}   props.searchKeys  space-separated field names to match
 * @param {Array}    props.filters     [{ key, label, options }]
 * @param {Array}    props.stats       [{ label, value, delta, icon, accent }]
 * @param {Function} props.renderDetail receives the selected row
 * @param {string}   props.entityName  used in empty states / modal titles
 */
export default function ListPage({
  title,
  subtitle,
  breadcrumb,
  columns,
  rows,
  searchKeys = 'name',
  searchPlaceholder = 'Search…',
  filters = [],
  stats = [],
  renderDetail,
  entityName = 'records',
  actions,
  bulkActions = [],
  defaultSort,
}) {
  const [query, setQuery] = useState('')
  const [filterValues, setFilterValues] = useState(() =>
    Object.fromEntries(filters.map((f) => [f.key, 'all'])),
  )
  const [selected, setSelected] = useState(null)
  const [selectedRows, setSelectedRows] = useState([])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    const keys = searchKeys.split(' ').filter(Boolean)

    let out = rows.filter((row) => {
      if (q) {
        const hay = keys.map((k) => String(row[k] ?? '')).join(' ').toLowerCase()
        if (!hay.includes(q)) return false
      }
      for (const f of filters) {
        const v = filterValues[f.key]
        if (v && v !== 'all' && String(row[f.key]) !== v) return false
      }
      return true
    })

    if (defaultSort) {
      const { key, dir = 'asc' } = defaultSort
      out = [...out].sort((a, b) => {
        const av = a[key]
        const bv = b[key]
        if (typeof av === 'number' && typeof bv === 'number') return dir === 'asc' ? av - bv : bv - av
        return dir === 'asc'
          ? String(av).localeCompare(String(bv))
          : String(bv).localeCompare(String(av))
      })
    }

    return out
  }, [rows, query, filterValues, filters, searchKeys, defaultSort])

  const toggleRow = (row) => {
    setSelectedRows((prev) =>
      prev.includes(row) ? prev.filter((r) => r !== row) : [...prev, row],
    )
  }

  const hasToolbar = filters.length > 0 || bulkActions.length > 0

  return (
    <div className="listpage">
      <PageHeader
        title={title}
        subtitle={subtitle}
        breadcrumb={breadcrumb}
        actions={actions}
      />

      {stats.length > 0 && (
        <div className="listpage__stats">
          {stats.map((s) => (
            <StatCard key={s.label} {...s} />
          ))}
        </div>
      )}

      <Card padded={false}>
        {hasToolbar && (
          <div className="listpage__toolbar">
            <SearchBar value={query} onChange={setQuery} placeholder={searchPlaceholder} />

            {filters.map((f) => (
              <Select
                key={f.key}
                value={filterValues[f.key]}
                onChange={(v) => setFilterValues((prev) => ({ ...prev, [f.key]: v }))}
                options={[{ value: 'all', label: `All ${f.label}` }, ...f.options]}
              />
            ))}

            <div className="listpage__toolbar-right">
              {selectedRows.length > 0 && (
                <>
                  <span className="listpage__selected">{selectedRows.length} selected</span>
                  {bulkActions.map((a) => (
                    <Button key={a.label} size="sm" variant={a.variant || 'secondary'} onClick={a.onClick}>
                      {a.label}
                    </Button>
                  ))}
                </>
              )}
              <Button size="sm" variant="ghost" icon="refresh" onClick={() => { setQuery(''); setFilterValues(Object.fromEntries(filters.map((f) => [f.key, 'all']))) }}>
                Reset
              </Button>
            </div>
          </div>
        )}

        {filtered.length === 0 ? (
          <EmptyState
            icon="search"
            title={`No ${entityName} found`}
            message="Try adjusting your search or filter criteria."
          />
        ) : (
          <DataTable
            columns={columns}
            rows={filtered}
            onRowClick={renderDetail ? (row) => setSelected(row) : undefined}
            rowKey={(r, i) => r.id ?? i}
          />
        )}

        <div className="listpage__footer">
          <span>
            Showing <strong>{filtered.length}</strong> of <strong>{rows.length}</strong> {entityName}
          </span>
          {selectedRows.length > 0 && (
            <button className="listpage__clear" onClick={() => setSelectedRows([])}>
              Clear selection
            </button>
          )}
        </div>
      </Card>

      {renderDetail && (
        <Modal
          open={!!selected}
          onClose={() => setSelected(null)}
          title={selected?.name || selected?.title || selected?.id || 'Details'}
          subtitle={selected ? `${entityName.replace(/s$/, '')} record` : ''}
          size="lg"
        >
          {selected && renderDetail(selected)}
        </Modal>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Column factories                                                   */
/* ------------------------------------------------------------------ */

export const col = {
  text: (key, header, opts = {}) => ({
    key,
    header,
    render: opts.render ?? ((row) => <span className={opts.primary ? 'cell-primary' : undefined}>{row[key]}</span>),
  }),
  money: (key, header) => ({
    key,
    header,
    render: (row) => (
      <span className="cell-num" style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
        ₹{Number(row[key]).toLocaleString('en-IN')}
      </span>
    ),
  }),
  number: (key, header) => ({
    key,
    header,
    render: (row) => <span className="cell-num">{row[key]}</span>,
  }),
  status: (key = 'status', header = 'Status') => ({
    key,
    header,
    render: (row) => (
      <Badge tone={statusTone(row[key])} dot>
        {row[key]}
      </Badge>
    ),
  }),
  badge: (key, header, tone = 'neutral') => ({
    key,
    header,
    render: (row) => <Badge tone={tone}>{row[key]}</Badge>,
  }),
  progress: (key, header, max = 100) => ({
    key,
    header,
    render: (row) => (
      <div className="listpage__prog">
        <div className="listpage__prog-track">
          <div
            className={`listpage__prog-fill ${
              row[key] >= (max * 0.85) ? 'is-good' : row[key] >= (max * 0.75) ? 'is-mid' : 'is-low'
            }`}
            style={{ width: `${Math.min(100, (row[key] / max) * 100)}%` }}
          />
        </div>
        <span className="listpage__prog-val">{row[key]}%</span>
      </div>
    ),
  }),
  icon: (key, header, iconName) => ({
    key,
    header,
    render: (row) => (
      <span className="listpage__icon-cell">
        <Icon name={iconName} size={15} />
        {row[key]}
      </span>
    ),
  }),
}
