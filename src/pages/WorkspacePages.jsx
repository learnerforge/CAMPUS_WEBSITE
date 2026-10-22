import { useState } from 'react'
import Icon from '../components/ui/Icon'
import {
  Badge,
  Button,
  Card,
  PageHeader,
  StatCard,
  DataTable,
  Tabs,
  DonutChart,
  Legend,
} from '../components/ui'
import { col } from '../components/ListPage'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import {
  STUDENT_NOTICES,
  FEE_COLLECTION_TREND,
  ENROLLMENT_BREAKDOWN,
  PAYROLL,
  ACADEMIC_YEARS,
  STUDENTS,
  OBE_REPORTS,
  APPRAISALS,
  HOSTELS,
  ADMISSIONS_STATS,
} from '../data/mock'
import { useExport } from '../utils/useExport'
import './workspace.css'

/* ------------------------------------------------------------------ */
/* Profile                                                             */
/* ------------------------------------------------------------------ */

export function ProfilePage() {
  const { user } = useAuth()
  const toast = useToast()
  const [tab, setTab] = useState('personal')

  if (!user) return null

  const initials = user.avatar

  return (
    <div>
      <PageHeader
        title="My Profile"
        subtitle="Your identity on the CampX platform"
        actions={
          <Button icon="settings" onClick={() => toast.info('Profile settings opened')}>
            Edit Profile
          </Button>
        }
      />

      <Card padded={false} className="ws__profile-card">
        <div className="ws__profile-head">
          <span className="ws__profile-avatar">{initials}</span>
          <div className="ws__profile-id">
            <h2>{user.name}</h2>
            <p>
              {user.designation} · {user.department}
            </p>
            <div className="ws__profile-badges">
              <Badge tone="indigo" dot>
                {user.roleLabel}
              </Badge>
              <Badge tone="neutral">{user.institution}</Badge>
            </div>
          </div>
          <div className="ws__profile-meta">
            <span>Member since</span>
            <strong>2012</strong>
          </div>
        </div>
      </Card>

      <div className="ws__tabwrap">
        <Tabs
          tabs={[
            { id: 'personal', label: 'Personal Details' },
            { id: 'academic', label: 'Academic Record' },
            { id: 'preferences', label: 'Preferences' },
          ]}
          active={tab}
          onChange={setTab}
        />
      </div>

      {tab === 'personal' && (
        <div className="ws__grid">
          <Card title="Contact information">
            <div className="detail__grid">
              <div className="detail__field">
                <span className="detail__label">Full Name</span>
                <span className="detail__value">{user.name}</span>
              </div>
              <div className="detail__field">
                <span className="detail__label">Username</span>
                <span className="detail__value mono">{user.username}</span>
              </div>
              <div className="detail__field">
                <span className="detail__label">Email</span>
                <span className="detail__value">{user.email}</span>
              </div>
              <div className="detail__field">
                <span className="detail__label">Phone</span>
                <span className="detail__value">+91 98450 11223</span>
              </div>
              <div className="detail__field">
                <span className="detail__label">Department</span>
                <span className="detail__value">{user.department}</span>
              </div>
              <div className="detail__field">
                <span className="detail__label">Designation</span>
                <span className="detail__value">{user.designation}</span>
              </div>
              <div className="detail__field">
                <span className="detail__label">Institution</span>
                <span className="detail__value">{user.institution}</span>
              </div>
              <div className="detail__field">
                <span className="detail__label">Campus</span>
                <span className="detail__value">Gandipet, Hyderabad</span>
              </div>
            </div>
          </Card>

          <Card title="Security" subtitle="Protect your account">
            <ul className="ws__security">
              <li>
                <span className="ws__sec-icon is-ok">
                  <Icon name="lock" size={15} />
                </span>
                <div>
                  <strong>Password</strong>
                  <span>Last changed 42 days ago</span>
                </div>
                <Badge tone="success">Strong</Badge>
              </li>
              <li>
                <span className="ws__sec-icon is-ok">
                  <Icon name="shield" size={15} />
                </span>
                <div>
                  <strong>Two-factor authentication</strong>
                  <span>Authenticator app enabled</span>
                </div>
                <Badge tone="success">Enabled</Badge>
              </li>
              <li>
                <span className="ws__sec-icon is-warn">
                  <Icon name="help" size={15} />
                </span>
                <div>
                  <strong>Recovery email</strong>
                  <span>Not configured</span>
                </div>
                <Button size="sm" variant="secondary" onClick={() => toast.info('Recovery email form opened')}>
                  Set up
                </Button>
              </li>
            </ul>
          </Card>
        </div>
      )}

      {tab === 'academic' && (
        <div className="ws__grid">
          <Card title="Academic history" subtitle="Programme and admission record" padded={false}>
            <ul className="ws__history">
              <li>
                <span className="ws__hist-year">2021</span>
                <div>
                  <strong>B.Tech Computer Science & Engineering</strong>
                  <span>MGIT · Roll No 21CS042 · CGPA 8.9</span>
                </div>
              </li>
              <li>
                <span className="ws__hist-year">2019</span>
                <div>
                  <strong>Senior Secondary — CBSE</strong>
                  <span>MPC · 89.4%</span>
                </div>
              </li>
              <li>
                <span className="ws__hist-year">2017</span>
                <div>
                  <strong>Secondary — CBSE</strong>
                  <span>92.1%</span>
                </div>
              </li>
            </ul>
          </Card>

          <Card title="Academic years" subtitle="CampX academic calendar">
            <ul className="ws__years">
              {ACADEMIC_YEARS.map((y) => (
                <li key={y.id}>
                  <Icon name="calendar" size={15} />
                  <span>{y.label}</span>
                  <Badge tone={y.status === 'active' ? 'success' : 'neutral'}>{y.status}</Badge>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      )}

      {tab === 'preferences' && (
        <div className="ws__grid">
          <Card title="Notifications" subtitle="Choose what reaches you">
            <ul className="ws__toggles">
              {[
                ['Fee reminders', 'Receive reminders before due dates', true],
                ['Attendance alerts', 'Alert when attendance drops below 80%', true],
                ['Exam announcements', 'Notifications about new exam schedules', true],
                ['Newsletter', 'Monthly campus newsletter', false],
              ].map(([label, desc, on]) => (
                <li key={label}>
                  <div>
                    <strong>{label}</strong>
                    <span>{desc}</span>
                  </div>
                  <Toggle defaultOn={on} />
                </li>
              ))}
            </ul>
          </Card>

          <Card title="Appearance" subtitle="How CampX looks for you">
            <ul className="ws__toggles">
              {[
                ['Compact tables', 'Show more rows per screen', false],
                ['Reduce motion', 'Limit animations across the portal', false],
                ['High contrast text', 'Increase text contrast for readability', false],
              ].map(([label, desc, on]) => (
                <li key={label}>
                  <div>
                    <strong>{label}</strong>
                    <span>{desc}</span>
                  </div>
                  <Toggle defaultOn={on} />
                </li>
              ))}
            </ul>
          </Card>
        </div>
      )}
    </div>
  )
}

function Toggle({ defaultOn = false }) {
  const [on, setOn] = useState(defaultOn)
  return (
    <button
      className={`ws__toggle ${on ? 'is-on' : ''}`}
      onClick={() => setOn((v) => !v)}
      role="switch"
      aria-checked={on}
    >
      <span />
    </button>
  )
}

/* ------------------------------------------------------------------ */
/* Notices                                                             */
/* ------------------------------------------------------------------ */

export function NoticesPage() {
  const toast = useToast()
  const [tab, setTab] = useState('all')

  const all = [
    ...STUDENT_NOTICES.map((n) => ({
      id: n.id,
      title: n.title,
      date: n.date,
      tag: n.tag,
      body: 'Official communication issued by the academic administration. Please read carefully and comply with the timeline mentioned.',
      audience: 'All',
    })),
    {
      id: 'NT-6',
      title: 'Revised Hostel Mess Timetable from 1 November',
      date: '2026-10-21',
      tag: 'Hostel',
      body: 'The mess timings are extended by 30 minutes on weekends following feedback from the student council.',
      audience: 'Hostellers',
    },
    {
      id: 'NT-7',
      title: 'AICTE Pragati Scholarship — Document Verification',
      date: '2026-10-19',
      tag: 'Scholarship',
      body: 'Students who applied must complete document verification at the scholarship cell before 30 October.',
      audience: 'Scholarship',
    },
  ]

  const rows = tab === 'all' ? all : all.filter((n) => n.tag.toLowerCase() === tab)
  const tags = [...new Set(all.map((n) => n.tag))]

  return (
    <div>
      <PageHeader
        title="Notices"
        subtitle="Official circulars and announcements from the campus"
        actions={<Button icon="plus" onClick={() => toast.success('Notice composer opened')}>New Notice</Button>}
      />

      <div className="listpage__stats">
        <StatCard label="Total Notices" value={all.length} icon="list" accent="indigo" />
        <StatCard label="Urgent" value={1} icon="alert" accent="danger" />
        <StatCard label="Categories" value={tags.length} icon="layers" accent="violet" />
        <StatCard label="This Week" value={3} icon="calendar" accent="success" />
      </div>

      <Card padded={false}>
        <div className="ws__tabbar">
          <Tabs
            tabs={[
              { id: 'all', label: 'All', count: all.length },
              ...tags.map((t) => ({ id: t.toLowerCase(), label: t })),
            ]}
            active={tab}
            onChange={setTab}
          />
        </div>
        <DataTable
          columns={[
            col.text('id', 'Ref', { primary: true }),
            col.text('title', 'Notice'),
            col.badge('tag', 'Category', 'indigo'),
            col.text('audience', 'Audience'),
            col.text('date', 'Published'),
          ]}
          rows={rows}
          onRowClick={(n) => toast.info(n.title)}
        />
      </Card>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Reports                                                             */
/* ------------------------------------------------------------------ */

export function ReportsPage() {
  const toast = useToast()
  const exportCsv = useExport()
  const [tab, setTab] = useState('collection')

  const reports = [
    { id: 'RP-01', name: 'Monthly Fee Collection', type: 'Finance', period: 'October 2026', generated: '2026-10-22', size: '412 KB', format: 'PDF' },
    { id: 'RP-02', name: 'Attendance Defaulters List', type: 'Academics', period: 'Semester 7', generated: '2026-10-22', size: '128 KB', format: 'XLSX' },
    { id: 'RP-03', name: 'OBE Attainment Summary', type: 'Academics', period: '2025-26', generated: '2026-10-20', size: '1.2 MB', format: 'PDF' },
    { id: 'RP-04', name: 'Payroll Register', type: 'Finance', period: 'October 2026', generated: '2026-10-05', size: '890 KB', format: 'XLSX' },
    { id: 'RP-05', name: 'Admission Funnel', type: 'Enrollment', period: '2026-27', generated: '2026-10-21', size: '340 KB', format: 'PDF' },
    { id: 'RP-06', name: 'Staff Appraisal Summary', type: 'People', period: '2025-26', generated: '2026-10-02', size: '520 KB', format: 'PDF' },
    { id: 'RP-07', name: 'Hostel Occupancy', type: 'Operations', period: 'October 2026', generated: '2026-10-01', size: '96 KB', format: 'CSV' },
  ]

  /* Each catalogue entry points at the dataset it summarises, so "Download"
     produces the report rather than a placeholder file. */
  const reportData = {
    'RP-01': {
      columns: [
        { key: 'month', header: 'Month' },
        { key: 'collected', header: 'Collected (₹)' },
        { key: 'target', header: 'Target (₹)' },
        { key: 'variance', header: 'Variance (₹)', csv: (r) => r.collected - r.target },
      ],
      rows: FEE_COLLECTION_TREND,
    },
    'RP-02': {
      columns: [
        { key: 'name', header: 'Student' },
        { key: 'roll', header: 'Roll No' },
        { key: 'program', header: 'Programme' },
        { key: 'attendance', header: 'Attendance %' },
        { key: 'cgpa', header: 'CGPA' },
        { key: 'status', header: 'Status' },
      ],
      rows: STUDENTS.filter((s) => s.attendance < 75),
    },
    'RP-03': {
      columns: [
        { key: 'id', header: 'Mapping ID' },
        { key: 'program', header: 'Programme' },
        { key: 'course', header: 'Course' },
        { key: 'po', header: 'PO' },
        { key: 'ps', header: 'PS' },
        { key: 'co', header: 'CO' },
        { key: 'level', header: 'Attainment' },
        { key: 'status', header: 'Status' },
      ],
      rows: OBE_REPORTS,
    },
    'RP-04': {
      columns: [
        { key: 'month', header: 'Month' },
        { key: 'employees', header: 'Employees' },
        { key: 'gross', header: 'Gross (₹)' },
        { key: 'tds', header: 'TDS (₹)' },
        { key: 'pf', header: 'PF (₹)' },
        { key: 'net', header: 'Net Payable (₹)' },
        { key: 'status', header: 'Status' },
      ],
      rows: PAYROLL,
    },
    'RP-05': {
      columns: [
        { key: 'stage', header: 'Stage' },
        { key: 'candidates', header: 'Candidates' },
      ],
      rows: [
        { stage: 'Applications', candidates: ADMISSIONS_STATS.applications },
        { stage: 'Shortlisted', candidates: ADMISSIONS_STATS.shortlisted },
        { stage: 'Confirmed', candidates: ADMISSIONS_STATS.confirmed },
        { stage: 'Offer Released', candidates: ADMISSIONS_STATS.offerReleased },
        { stage: 'Joined', candidates: ADMISSIONS_STATS.joined },
      ],
    },
    'RP-06': {
      columns: [
        { key: 'employee', header: 'Employee' },
        { key: 'cycle', header: 'Cycle' },
        { key: 'rating', header: 'Rating' },
        { key: 'reviewer', header: 'Reviewer' },
        { key: 'status', header: 'Status' },
      ],
      rows: APPRAISALS,
    },
    'RP-07': {
      columns: [
        { key: 'id', header: 'Block' },
        { key: 'name', header: 'Hostel' },
        { key: 'type', header: 'Type' },
        { key: 'warden', header: 'Warden' },
        { key: 'capacity', header: 'Capacity' },
        { key: 'occupied', header: 'Occupied' },
        { key: 'vacant', header: 'Vacant', csv: (r) => r.capacity - r.occupied },
      ],
      rows: HOSTELS,
    },
  }

  return (
    <div>
      <PageHeader
        title="Reports"
        subtitle="Generated documents across every campus system"
        actions={<Button icon="refresh" onClick={() => toast.success('Report catalogue refreshed')}>Refresh</Button>}
      />

      <div className="ws__grid">
        <Card title="Fee collection trend" subtitle="Monthly collected vs target, in lakhs">
          <div className="ws__chart">
            {FEE_COLLECTION_TREND.map((m) => {
              const pct = (m.collected / m.target) * 100
              return (
                <div key={m.month} className="ws__chart-col">
                  <div className="ws__chart-track">
                    <div
                      className="ws__chart-bar"
                      style={{ height: `${Math.min(100, pct)}%`, background: m.collected >= m.target ? 'var(--success-500)' : 'var(--indigo-500)' }}
                    />
                    <div className="ws__chart-target" style={{ bottom: '100%' }} />
                  </div>
                  <span className="ws__chart-label">{m.month}</span>
                </div>
              )
            })}
          </div>
        </Card>

        <Card title="Enrollment mix" subtitle="Students by programme">
          <div className="ws__donut">
            <DonutChart data={ENROLLMENT_BREAKDOWN} size={160} thickness={20} centerValue="530" centerLabel="Students" />
            <Legend data={ENROLLMENT_BREAKDOWN} />
          </div>
        </Card>
      </div>

      <Card title="Report library" subtitle="Generated artefacts available for download" padded={false}>
        <div className="ws__tabbar">
          <Tabs
            tabs={[
              { id: 'all', label: 'All', count: reports.length },
              ...['Finance', 'Academics', 'Enrollment', 'People', 'Operations'].map((t) => ({
                id: t.toLowerCase(),
                label: t,
                count: reports.filter((r) => r.type === t).length,
              })),
            ]}
            active={tab}
            onChange={setTab}
          />
        </div>
        <DataTable
          columns={[
            col.text('id', 'ID', { primary: true }),
            col.text('name', 'Report'),
            col.badge('type', 'System', 'indigo'),
            col.text('period', 'Period'),
            col.text('generated', 'Generated'),
            col.text('format', 'Format'),
            col.text('size', 'Size'),
            {
              key: 'download',
              header: '',
              render: (r) => {
                const data = reportData[r.id]
                return (
                  <Button
                    size="sm"
                    variant="secondary"
                    icon="download"
                    onClick={() =>
                      data
                        ? exportCsv(r.name, data.columns, data.rows, { label: 'rows' })
                        : toast.info(`${r.name} is being regenerated`)
                    }
                  >
                    Download
                  </Button>
                )
              },
            },
          ]}
          rows={tab === 'all' ? reports : reports.filter((r) => r.type.toLowerCase() === tab)}
        />
      </Card>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Fallback pages                                                      */
/* ------------------------------------------------------------------ */

export function NotFoundPage() {
  return (
    <div className="ws__fallback">
      <span className="ws__fallback-code">404</span>
      <h1>Page not found</h1>
      <p>The page you are looking for does not exist or has been moved.</p>
      <Button icon="arrowLeft" onClick={() => window.history.back()}>
        Go back
      </Button>
    </div>
  )
}

export function ForbiddenPage() {
  return (
    <div className="ws__fallback">
      <span className="ws__fallback-code">403</span>
      <h1>Access restricted</h1>
      <p>Your role does not have permission to view this module. Contact your administrator if you believe this is an error.</p>
      <Button icon="arrowLeft" onClick={() => window.history.back()}>
        Go back
      </Button>
    </div>
  )
}
