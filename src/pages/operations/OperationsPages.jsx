import { useMemo, useState } from 'react'
import Icon from '../../components/ui/Icon'
import {
  Badge,
  Button,
  Card,
  PageHeader,
  ProgressBar,
  StatCard,
  BarChart,
  DataTable,
  Select,
} from '../../components/ui'
import ListPage, { col } from '../../components/ListPage'
import { useToast } from '../../context/ToastContext'
import { useExport } from '../../utils/useExport'
import {
  HOSTELS,
  TRANSPORT_ROUTES,
  LIBRARY_ITEMS,
  HELPDESK_TICKETS,
  PLACEMENTS,
  VISITORS,
} from '../../data/mock'
import './operations.css'

const TICKET_PRIORITY = { High: 'danger', Medium: 'warning', Low: 'neutral' }

/* ------------------------------------------------------------------ */
/* Overview                                                           */
/* ------------------------------------------------------------------ */

export function OperationsOverview() {
  const toast = useToast()
  const exportCsv = useExport()
  const hostelCapacity = HOSTELS.reduce((s, h) => s + h.capacity, 0)
  const hostelOccupied = HOSTELS.reduce((s, h) => s + h.occupied, 0)
  const openTickets = HELPDESK_TICKETS.filter((t) => !['Closed', 'Resolved'].includes(t.status)).length
  const avgPackage = (PLACEMENTS.reduce((s, p) => s + p.package, 0) / PLACEMENTS.length).toFixed(1)

  const occupancy = HOSTELS.map((h) => ({
    label: h.id.replace('H-', ''),
    value: Math.round((h.occupied / h.capacity) * 100),
    color: h.occupied / h.capacity > 0.95 ? 'var(--warning-500)' : 'var(--indigo-500)',
  }))

  return (
    <div>
      <PageHeader
        title="Operations"
        subtitle="Operations that run without follow-up — hostel, transport, library, helpdesk and more."
        breadcrumb={[{ label: 'Campus Systems' }, { label: 'Operations' }]}
        actions={
          <>
            <Button
              variant="secondary"
              icon="download"
              onClick={() =>
                exportCsv(
                  'operations-hostel-occupancy',
                  [
                    { key: 'id', header: 'Block' },
                    { key: 'name', header: 'Hostel' },
                    { key: 'type', header: 'Type' },
                    { key: 'warden', header: 'Warden' },
                    { key: 'capacity', header: 'Capacity' },
                    { key: 'occupied', header: 'Occupied' },
                    { key: 'vacant', header: 'Vacant', csv: (r) => r.capacity - r.occupied },
                    { key: 'rent', header: 'Rent (₹)' },
                  ],
                  HOSTELS,
                  { label: 'hostels' },
                )
              }
            >
              Export
            </Button>
            <Button icon="plus" onClick={() => toast.success('New ticket / request form opened')}>New Request</Button>
          </>
        }
      />

      <div className="listpage__stats">
        <StatCard label="Hostel Occupancy" value={`${Math.round((hostelOccupied / hostelCapacity) * 100)}%`} icon="bed" accent="indigo" hint={`${hostelOccupied}/${hostelCapacity}`} />
        <StatCard label="Active Routes" value={TRANSPORT_ROUTES.length} icon="bus" accent="violet" hint={`${TRANSPORT_ROUTES.reduce((s, r) => s + r.students, 0)} students`} />
        <StatCard label="Open Tickets" value={openTickets} icon="help" accent="warning" delta={-12} />
        <StatCard label="Avg Package" value={`${avgPackage} LPA`} icon="award" accent="success" delta={6.2} />
      </div>

      <div className="ops__grid">
        <Card title="Hostel occupancy" subtitle="By block">
          <BarChart data={occupancy} height={180} />
        </Card>

        <Card title="Helpdesk load" subtitle="Tickets by category">
          <ul className="ops__load">
            {Object.entries(
              HELPDESK_TICKETS.reduce((acc, t) => {
                acc[t.category] = (acc[t.category] || 0) + 1
                return acc
              }, {}),
            )
              .sort((a, b) => b[1] - a[1])
              .map(([cat, count]) => {
                const max = HELPDESK_TICKETS.length
                return (
                  <li key={cat}>
                    <span className="ops__load-label">{cat}</span>
                    <ProgressBar value={count} max={max} tone="info" size="sm" />
                    <span className="ops__load-count">{count}</span>
                  </li>
                )
              })}
          </ul>
        </Card>
      </div>

      <div className="ops__grid ops__grid--2">
        <Card title="Transport routes" subtitle="Live fleet summary">
          <ul className="ops__routes">
            {TRANSPORT_ROUTES.map((r) => (
              <li key={r.id}>
                <span className="ops__route-icon">
                  <Icon name="bus" size={16} />
                </span>
                <div className="ops__route-main">
                  <strong>{r.name}</strong>
                  <span>{r.vehicle} · {r.driver}</span>
                </div>
                <div className="ops__route-load">
                  <span>{r.students}/{r.capacity}</span>
                  <ProgressBar value={r.students} max={r.capacity} tone={r.students / r.capacity > 0.85 ? 'warning' : 'success'} size="sm" />
                </div>
                <Badge tone={r.status === 'Active' ? 'success' : 'warning'}>{r.status}</Badge>
              </li>
            ))}
          </ul>
        </Card>

        <Card title="Recent placements" subtitle="Latest offers">
          <ul className="ops__places">
            {PLACEMENTS.slice(0, 5).map((p) => (
              <li key={p.id}>
                <div className="ops__place-main">
                  <strong>{p.student}</strong>
                  <span>{p.company} · {p.role}</span>
                </div>
                <div className="ops__place-amt">
                  <strong>₹{p.package}L</strong>
                  <span>{p.date}</span>
                </div>
                <Badge tone={p.status === 'Offer Accepted' ? 'success' : p.status === 'Under Process' ? 'warning' : 'info'}>
                  {p.status}
                </Badge>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Hostel                                                             */
/* ------------------------------------------------------------------ */

export function HostelPage() {
  const toast = useToast()
  return (
    <ListPage
      title="Hostel"
      subtitle="Blocks, wardens, room allocation and occupancy."
      breadcrumb={[{ label: 'Operations' }, { label: 'Hostel' }]}
      searchKeys="name warden type"
      searchPlaceholder="Search block or warden…"
      entityName="hostel blocks"
      filters={[
        { key: 'type', label: 'types', options: ['Boys', 'Girls'].map((v) => ({ value: v, label: v })) },
      ]}
      stats={[
        { label: 'Blocks', value: HOSTELS.length, icon: 'bed', accent: 'indigo' },
        { label: 'Total Capacity', value: HOSTELS.reduce((s, h) => s + h.capacity, 0), icon: 'building', accent: 'violet' },
        { label: 'Occupied', value: HOSTELS.reduce((s, h) => s + h.occupied, 0), icon: 'users', accent: 'success' },
        { label: 'Vacant Beds', value: HOSTELS.reduce((s, h) => s + h.capacity - h.occupied, 0), icon: 'target', accent: 'warning' },
      ]}
      actions={<Button icon="plus" onClick={() => toast.success('Room allocation form opened')}>Allocate Room</Button>}
      columns={[
        col.text('name', 'Block', { primary: true }),
        col.badge('type', 'Type', 'indigo'),
        col.text('warden', 'Warden'),
        col.number('capacity', 'Capacity'),
        col.number('occupied', 'Occupied'),
        col.money('rent', 'Annual Rent'),
      ]}
      rows={HOSTELS}
      renderDetail={(h) => (
        <div className="detail">
          <div className="detail__grid">
            <div className="detail__field">
              <span className="detail__label">Block</span>
              <span className="detail__value">{h.name}</span>
            </div>
            <div className="detail__field">
              <span className="detail__label">Warden</span>
              <span className="detail__value">{h.warden}</span>
            </div>
            <div className="detail__field">
              <span className="detail__label">Capacity</span>
              <span className="detail__value">{h.capacity}</span>
            </div>
            <div className="detail__field">
              <span className="detail__label">Occupied</span>
              <span className="detail__value">{h.occupied}</span>
            </div>
            <div className="detail__field">
              <span className="detail__label">Vacant</span>
              <span className="detail__value">{h.capacity - h.occupied}</span>
            </div>
            <div className="detail__field">
              <span className="detail__label">Annual Rent</span>
              <span className="detail__value">₹{h.rent.toLocaleString('en-IN')}</span>
            </div>
          </div>
          <div>
            <h4 className="detail__section-title">Occupancy</h4>
            <ProgressBar value={h.occupied} max={h.capacity} tone="indigo" size="lg" showLabel />
          </div>
        </div>
      )}
    />
  )
}

/* ------------------------------------------------------------------ */
/* Transport                                                          */
/* ------------------------------------------------------------------ */

export function TransportPage() {
  const toast = useToast()
  return (
    <ListPage
      title="Transport"
      subtitle="Routes, fleet, drivers and student allocation."
      breadcrumb={[{ label: 'Operations' }, { label: 'Transport' }]}
      searchKeys="name vehicle driver"
      searchPlaceholder="Search route, vehicle or driver…"
      entityName="routes"
      stats={[
        { label: 'Routes', value: TRANSPORT_ROUTES.length, icon: 'bus', accent: 'indigo' },
        { label: 'Students', value: TRANSPORT_ROUTES.reduce((s, r) => s + r.students, 0), icon: 'users', accent: 'violet' },
        { label: 'Seat Capacity', value: TRANSPORT_ROUTES.reduce((s, r) => s + r.capacity, 0), icon: 'target', accent: 'info' },
        { label: 'Delays', value: TRANSPORT_ROUTES.filter((r) => r.status === 'Delayed').length, icon: 'alert', accent: 'warning' },
      ]}
      actions={<Button icon="plus" onClick={() => toast.success('New route form opened')}>Add Route</Button>}
      columns={[
        col.text('name', 'Route', { primary: true }),
        col.text('vehicle', 'Vehicle'),
        col.text('driver', 'Driver'),
        col.text('timing', 'Timing'),
        {
          key: 'load',
          header: 'Load',
          render: (r) => (
            <span className="cell-num">
              {r.students} / {r.capacity}
            </span>
          ),
        },
        col.status('status'),
      ]}
      rows={TRANSPORT_ROUTES}
      renderDetail={(r) => (
        <div className="detail">
          <div className="detail__grid">
            <div className="detail__field">
              <span className="detail__label">Route</span>
              <span className="detail__value">{r.name}</span>
            </div>
            <div className="detail__field">
              <span className="detail__label">Vehicle</span>
              <span className="detail__value mono">{r.vehicle}</span>
            </div>
            <div className="detail__field">
              <span className="detail__label">Driver</span>
              <span className="detail__value">{r.driver}</span>
            </div>
            <div className="detail__field">
              <span className="detail__label">Timings</span>
              <span className="detail__value">{r.timing}</span>
            </div>
          </div>
          <div>
            <h4 className="detail__section-title">Seat utilisation</h4>
            <ProgressBar value={r.students} max={r.capacity} tone="success" size="lg" showLabel />
          </div>
        </div>
      )}
    />
  )
}

/* ------------------------------------------------------------------ */
/* Library                                                            */
/* ------------------------------------------------------------------ */

export function LibraryPage() {
  const toast = useToast()
  return (
    <ListPage
      title="Library"
      subtitle="Catalogue, issue tracking and circulation."
      breadcrumb={[{ label: 'Operations' }, { label: 'Library' }]}
      searchKeys="title author category"
      searchPlaceholder="Search title, author or category…"
      entityName="titles"
      filters={[
        {
          key: 'category',
          label: 'categories',
          options: [...new Set(LIBRARY_ITEMS.map((l) => l.category))].map((v) => ({ value: v, label: v })),
        },
      ]}
      stats={[
        { label: 'Titles', value: LIBRARY_ITEMS.length, icon: 'library', accent: 'indigo' },
        { label: 'Total Copies', value: LIBRARY_ITEMS.reduce((s, l) => s + l.copies, 0), icon: 'book', accent: 'violet' },
        { label: 'Issued', value: LIBRARY_ITEMS.reduce((s, l) => s + l.issued, 0), icon: 'send', accent: 'info' },
        { label: 'Available', value: LIBRARY_ITEMS.reduce((s, l) => s + l.copies - l.issued, 0), icon: 'checkCircle', accent: 'success' },
      ]}
      actions={
        <Button icon="plus" onClick={() => toast.success('New catalogue entry form opened')}>Add Title</Button>
      }
      columns={[
        col.text('id', 'Acc. No', { primary: true }),
        col.text('title', 'Title'),
        col.text('author', 'Author'),
        col.badge('category', 'Category', 'indigo'),
        col.number('copies', 'Copies'),
        col.number('issued', 'Issued'),
        col.badge('type', 'Type', 'neutral'),
      ]}
      rows={LIBRARY_ITEMS}
      renderDetail={(l) => (
        <div className="detail">
          <div className="detail__grid">
            <div className="detail__field">
              <span className="detail__label">Title</span>
              <span className="detail__value">{l.title}</span>
            </div>
            <div className="detail__field">
              <span className="detail__label">Author</span>
              <span className="detail__value">{l.author}</span>
            </div>
            <div className="detail__field">
              <span className="detail__label">Category</span>
              <span className="detail__value">{l.category}</span>
            </div>
            <div className="detail__field">
              <span className="detail__label">Accession No</span>
              <span className="detail__value mono">{l.id}</span>
            </div>
          </div>
          <div>
            <h4 className="detail__section-title">Circulation</h4>
            <ProgressBar value={l.issued} max={l.copies} tone="info" size="lg" showLabel />
            <ul className="detail__list" style={{ marginTop: 12 }}>
              <li><span>Total copies</span><strong>{l.copies}</strong></li>
              <li><span>Currently issued</span><strong>{l.issued}</strong></li>
              <li><span>Available</span><strong>{l.copies - l.issued}</strong></li>
              <li><span>Type</span><strong>{l.type}</strong></li>
            </ul>
          </div>
        </div>
      )}
    />
  )
}

/* ------------------------------------------------------------------ */
/* Helpdesk                                                           */
/* ------------------------------------------------------------------ */

export function HelpdeskPage() {
  const toast = useToast()
  const [tab, setTab] = useState('open')

  const rows = useMemo(() => {
    if (tab === 'open') return HELPDESK_TICKETS.filter((t) => !['Closed', 'Resolved'].includes(t.status))
    if (tab === 'resolved') return HELPDESK_TICKETS.filter((t) => ['Closed', 'Resolved'].includes(t.status))
    return HELPDESK_TICKETS
  }, [tab])

  return (
    <div>
      <PageHeader
        title="Helpdesk"
        subtitle="Student and staff service requests with SLA tracking."
        breadcrumb={[{ label: 'Operations' }, { label: 'Helpdesk' }]}
        actions={
          <>
            <Select
              value={tab}
              onChange={setTab}
              options={[
                { value: 'open', label: 'Open tickets' },
                { value: 'resolved', label: 'Resolved' },
                { value: 'all', label: 'All tickets' },
              ]}
            />
            <Button icon="plus" onClick={() => toast.success('New ticket form opened')}>New Ticket</Button>
          </>
        }
      />

      <div className="listpage__stats">
        <StatCard label="Open" value={HELPDESK_TICKETS.filter((t) => t.status === 'Open').length} icon="help" accent="info" />
        <StatCard label="In Progress" value={HELPDESK_TICKETS.filter((t) => t.status === 'In Progress').length} icon="clock" accent="warning" />
        <StatCard label="Resolved" value={HELPDESK_TICKETS.filter((t) => ['Resolved', 'Closed'].includes(t.status)).length} icon="checkCircle" accent="success" />
        <StatCard label="High Priority" value={HELPDESK_TICKETS.filter((t) => t.priority === 'High').length} icon="alert" accent="danger" />
      </div>

      <Card padded={false}>
        <DataTable
          columns={[
            col.text('id', 'Ticket', { primary: true }),
            col.text('subject', 'Subject'),
            col.badge('category', 'Category', 'indigo'),
            col.text('raisedBy', 'Raised By'),
            col.text('assignedTo', 'Assigned To'),
            {
              key: 'priority',
              header: 'Priority',
              render: (r) => <Badge tone={TICKET_PRIORITY[r.priority]}>{r.priority}</Badge>,
            },
            col.text('date', 'Raised'),
            col.status('status'),
          ]}
          rows={rows}
        />
      </Card>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Placements                                                         */
/* ------------------------------------------------------------------ */

export function PlacementsPage() {
  const toast = useToast()
  const avg = (PLACEMENTS.reduce((s, p) => s + p.package, 0) / PLACEMENTS.length).toFixed(1)
  return (
    <ListPage
      title="Placements"
      subtitle="Recruitment drives, offers and package outcomes."
      breadcrumb={[{ label: 'Operations' }, { label: 'Placements' }]}
      searchKeys="student company role program"
      searchPlaceholder="Search student, company or role…"
      entityName="placement records"
      stats={[
        { label: 'Placed', value: PLACEMENTS.length, icon: 'award', accent: 'success' },
        { label: 'Avg Package', value: `${avg} LPA`, icon: 'trendingUp', accent: 'indigo' },
        { label: 'Max Package', value: `${Math.max(...PLACEMENTS.map((p) => p.package))} LPA`, icon: 'target', accent: 'violet' },
        { label: 'Companies', value: new Set(PLACEMENTS.map((p) => p.company)).size, icon: 'building', accent: 'info' },
      ]}
      actions={
        <Button icon="plus" onClick={() => toast.success('Recruitment drive form opened')}>Add Drive</Button>
      }
      columns={[
        col.text('student', 'Student', { primary: true }),
        col.badge('program', 'Programme', 'indigo'),
        col.text('company', 'Company'),
        col.text('role', 'Role'),
        {
          key: 'package',
          header: 'Package',
          render: (r) => (
            <span className="cell-num" style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
              ₹{r.package} LPA
            </span>
          ),
        },
        col.text('date', 'Date'),
        col.status('status'),
      ]}
      rows={PLACEMENTS}
      renderDetail={(p) => (
        <div className="detail">
          <div className="detail__grid">
            <div className="detail__field">
              <span className="detail__label">Student</span>
              <span className="detail__value">{p.student}</span>
            </div>
            <div className="detail__field">
              <span className="detail__label">Programme</span>
              <span className="detail__value">{p.program}</span>
            </div>
            <div className="detail__field">
              <span className="detail__label">Company</span>
              <span className="detail__value">{p.company}</span>
            </div>
            <div className="detail__field">
              <span className="detail__label">Role</span>
              <span className="detail__value">{p.role}</span>
            </div>
            <div className="detail__field">
              <span className="detail__label">Package</span>
              <span className="detail__value">₹{p.package} LPA</span>
            </div>
            <div className="detail__field">
              <span className="detail__label">Status</span>
              <span className="detail__value">{p.status}</span>
            </div>
          </div>
        </div>
      )}
    />
  )
}

/* ------------------------------------------------------------------ */
/* Visitors                                                           */
/* ------------------------------------------------------------------ */

export function VisitorsPage() {
  const toast = useToast()
  return (
    <ListPage
      title="Visitors"
      subtitle="Gate register, host details and check-in status."
      breadcrumb={[{ label: 'Operations' }, { label: 'Visitors' }]}
      searchKeys="name purpose host"
      searchPlaceholder="Search visitor, purpose or host…"
      entityName="visitors"
      stats={[
        { label: 'On Campus', value: VISITORS.filter((v) => v.status === 'On Campus').length, icon: 'users', accent: 'warning' },
        { label: 'Checked Out', value: VISITORS.filter((v) => v.status === 'Checked Out').length, icon: 'checkCircle', accent: 'success' },
        { label: 'Today', value: VISITORS.length, icon: 'calendar', accent: 'indigo' },
        { label: 'Admissions Enquiries', value: VISITORS.filter((v) => v.purpose.includes('Admission')).length, icon: 'phone', accent: 'violet' },
      ]}
      actions={<Button icon="plus" onClick={() => toast.success('Visitor pass form opened')}>Register Visitor</Button>}
      columns={[
        col.text('id', 'Pass', { primary: true }),
        col.text('name', 'Visitor'),
        col.text('purpose', 'Purpose'),
        col.text('host', 'Host'),
        col.text('checkedIn', 'Check-in'),
        col.status('status'),
      ]}
      rows={VISITORS}
      renderDetail={(v) => (
        <div className="detail">
          <div className="detail__grid">
            <div className="detail__field">
              <span className="detail__label">Visitor</span>
              <span className="detail__value">{v.name}</span>
            </div>
            <div className="detail__field">
              <span className="detail__label">Purpose</span>
              <span className="detail__value">{v.purpose}</span>
            </div>
            <div className="detail__field">
              <span className="detail__label">Host</span>
              <span className="detail__value">{v.host}</span>
            </div>
            <div className="detail__field">
              <span className="detail__label">Check-in</span>
              <span className="detail__value">{v.checkedIn}</span>
            </div>
          </div>
        </div>
      )}
    />
  )
}
