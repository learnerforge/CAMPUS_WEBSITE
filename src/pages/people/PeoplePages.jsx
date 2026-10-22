import { useState } from 'react'
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
  DonutChart,
  Legend,
  Tabs,
} from '../../components/ui'
import ListPage, { col } from '../../components/ListPage'
import { useToast } from '../../context/ToastContext'
import { STAFF, LEAVE_REQUESTS, APPRAISALS, RESEARCH_PROFILES } from '../../data/mock'
import { useExport } from '../../utils/useExport'
import './people.css'

/* ------------------------------------------------------------------ */
/* Overview                                                           */
/* ------------------------------------------------------------------ */

export function PeopleOverview() {
  const toast = useToast()
  const exportCsv = useExport()
  const deptMix = STAFF.reduce((acc, s) => {
    acc[s.dept] = (acc[s.dept] || 0) + 1
    return acc
  }, {})
  const mixColors = ['var(--indigo-500)', 'var(--violet-500)', 'var(--success-500)', 'var(--warning-500)', 'var(--info-500)']
  const mix = Object.entries(deptMix)
    .sort((a, b) => b[1] - a[1])
    .map(([label, value], i) => ({ label, value, color: mixColors[i % mixColors.length] }))

  const ratingDist = [1, 2, 3, 4, 5].map((r) => ({
    label: `${r}★`,
    value: APPRAISALS.filter((a) => Math.round(a.rating) === r).length,
    color: 'var(--indigo-500)',
  }))

  return (
    <div>
      <PageHeader
        title="People"
        subtitle="Your people strategy — measured and managed across every stage of the employee lifecycle."
        breadcrumb={[{ label: 'Campus Systems' }, { label: 'People' }]}
        actions={
          <>
            <Button
              variant="secondary"
              icon="download"
              onClick={() =>
                exportCsv(
                  'people-department-mix',
                  [
                    { key: 'department', header: 'Department' },
                    { key: 'staff', header: 'Staff' },
                  ],
                  mix.map((m) => ({ department: m.label, staff: m.value })),
                  { label: 'departments' },
                )
              }
            >
              Export
            </Button>
            <Button icon="plus" onClick={() => toast.success('Staff onboarding form opened')}>Add Staff</Button>
          </>
        }
      />

      <div className="listpage__stats">
        <StatCard label="Total Staff" value={214} icon="users" accent="indigo" delta={2.4} />
        <StatCard label="Teaching" value={128} icon="academic" accent="violet" />
        <StatCard label="Non-Teaching" value={86} icon="briefcase" accent="info" />
        <StatCard label="On Leave" value={STAFF.filter((s) => s.status === 'On Leave').length} icon="clock" accent="warning" />
      </div>

      <div className="ppl__grid">
        <Card title="Department distribution" subtitle="Headcount by department">
          <div className="ppl__donut">
            <DonutChart data={mix} size={160} thickness={20} centerValue="214" centerLabel="Staff" />
            <Legend data={mix} />
          </div>
        </Card>

        <Card title="Appraisal rating spread" subtitle="2025-26 review cycle">
          <BarChart data={ratingDist} height={180} />
        </Card>
      </div>

      <div className="ppl__grid ppl__grid--2">
        <Card title="Pending leave requests" subtitle="Awaiting your approval">
          <ul className="ppl__leaves">
            {LEAVE_REQUESTS.filter((l) => l.status === 'Pending').map((l) => (
              <li key={l.id}>
                <div className="ppl__leave-main">
                  <strong>{l.employee}</strong>
                  <span>{l.type} · {l.from} → {l.to}</span>
                </div>
                <Badge tone="warning">{l.days} days</Badge>
                <div className="ppl__leave-actions">
                  <Button size="sm" variant="success" onClick={() => toast.success(`${l.employee}'s leave approved`)}>
                    Approve
                  </Button>
                  <Button size="sm" variant="secondary" onClick={() => toast.info('Leave request rejected')}>
                    Reject
                  </Button>
                </div>
              </li>
            ))}
            {LEAVE_REQUESTS.filter((l) => l.status === 'Pending').length === 0 && (
              <li className="ppl__empty">Nothing awaiting approval.</li>
            )}
          </ul>
        </Card>

        <Card title="Research output" subtitle="Publications and citations">
          <ul className="ppl__research">
            {RESEARCH_PROFILES.map((r) => (
              <li key={r.id}>
                <div className="ppl__res-main">
                  <strong>{r.faculty}</strong>
                  <span>{r.title}</span>
                </div>
                <div className="ppl__res-stats">
                  <span><b>{r.journals}</b> papers</span>
                  <span><b>{r.citations}</b> cites</span>
                  <span>h-index <b>{r.hIndex}</b></span>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Directory                                                          */
/* ------------------------------------------------------------------ */

export function DirectoryPage() {
  const toast = useToast()
  return (
    <ListPage
      title="Staff Directory"
      subtitle="Everyone who runs the campus — reporting lines, roles and departments."
      breadcrumb={[{ label: 'People' }, { label: 'Staff Directory' }]}
      searchKeys="name designation dept type email"
      searchPlaceholder="Search name, role or department…"
      entityName="staff"
      filters={[
        { key: 'dept', label: 'departments', options: [...new Set(STAFF.map((s) => s.dept))].map((v) => ({ value: v, label: v })) },
        { key: 'type', label: 'types', options: ['Teaching', 'Administrative', 'Support'].map((v) => ({ value: v, label: v })) },
      ]}
      stats={[
        { label: 'Total Staff', value: 214, icon: 'users', accent: 'indigo' },
        { label: 'Departments', value: new Set(STAFF.map((s) => s.dept)).size, icon: 'building', accent: 'violet' },
        { label: 'Teaching', value: STAFF.filter((s) => s.type === 'Teaching').length, icon: 'academic', accent: 'info' },
        { label: 'Reporting To', value: new Set(STAFF.map((s) => s.reportsTo)).size, icon: 'layers', accent: 'success' },
      ]}
      actions={
        <Button icon="plus" onClick={() => toast.success('Staff onboarding form opened')}>Add Staff</Button>
      }
      columns={[
        col.text('id', 'Employee ID', { primary: true }),
        col.text('name', 'Name'),
        col.text('designation', 'Designation'),
        col.badge('dept', 'Department', 'indigo'),
        col.badge('type', 'Category', 'neutral'),
        col.text('reportsTo', 'Reports To'),
        col.text('joined', 'Joined'),
        col.status('status'),
      ]}
      rows={STAFF}
      renderDetail={(s) => (
        <div className="detail">
          <div className="detail__grid">
            <div className="detail__field">
              <span className="detail__label">Name</span>
              <span className="detail__value">{s.name}</span>
            </div>
            <div className="detail__field">
              <span className="detail__label">Employee ID</span>
              <span className="detail__value mono">{s.id}</span>
            </div>
            <div className="detail__field">
              <span className="detail__label">Designation</span>
              <span className="detail__value">{s.designation}</span>
            </div>
            <div className="detail__field">
              <span className="detail__label">Department</span>
              <span className="detail__value">{s.dept}</span>
            </div>
            <div className="detail__field">
              <span className="detail__label">Category</span>
              <span className="detail__value">{s.type}</span>
            </div>
            <div className="detail__field">
              <span className="detail__label">Reports To</span>
              <span className="detail__value">{s.reportsTo}</span>
            </div>
            <div className="detail__field">
              <span className="detail__label">Date of Joining</span>
              <span className="detail__value">{s.joined}</span>
            </div>
            <div className="detail__field">
              <span className="detail__label">Status</span>
              <span className="detail__value">{s.status}</span>
            </div>
          </div>
        </div>
      )}
    />
  )
}

/* ------------------------------------------------------------------ */
/* Onboarding                                                         */
/* ------------------------------------------------------------------ */

export function OnboardingPage() {
  const toast = useToast()
  const stages = [
    { label: 'Offer Released', value: 8, tone: 'indigo' },
    { label: 'Documents Submitted', value: 6, tone: 'info' },
    { label: 'Background Check', value: 4, tone: 'violet' },
    { label: 'ID Card Issued', value: 3, tone: 'success' },
    { label: 'Reporting', value: 2, tone: 'warning' },
  ]

  return (
    <div>
      <PageHeader
        title="Onboarding"
        subtitle="New joiners and their progress through the onboarding pipeline."
        breadcrumb={[{ label: 'People' }, { label: 'Onboarding' }]}
        actions={<Button icon="plus" onClick={() => toast.success('Onboarding record created')}>Add New Joiner</Button>}
      />

      <div className="listpage__stats">
        <StatCard label="In Progress" value={8} icon="users" accent="indigo" />
        <StatCard label="Reporting This Week" value={3} icon="calendar" accent="success" />
        <StatCard label="Pending Documents" value={6} icon="file" accent="warning" />
        <StatCard label="Avg Onboarding Time" value="9 days" icon="clock" accent="info" delta={-2} />
      </div>

      <Card title="Pipeline" subtitle="Joiners by onboarding stage">
        <ul className="ppl__stages">
          {stages.map((s) => (
            <li key={s.label}>
              <span className="ppl__stage-label">{s.label}</span>
              <ProgressBar value={s.value} max={8} tone={s.tone} size="sm" />
              <span className="ppl__stage-count">{s.value}</span>
            </li>
          ))}
        </ul>
      </Card>

      <Card title="New joiners" subtitle="Active onboarding records" padded={false} className="ppl__mt">
        <DataTable
          columns={[
            col.text('name', 'Name', { primary: true }),
            col.text('role', 'Designation'),
            col.badge('dept', 'Department', 'indigo'),
            col.text('startDate', 'Start Date'),
            col.badge('stage', 'Stage', 'violet'),
            col.text('buddy', 'Buddy'),
            col.status('status'),
          ]}
          rows={[
            { id: 'OB-1', name: 'Dr. Haritha Ramesh', role: 'Associate Professor', dept: 'ECE', startDate: '2026-11-02', stage: 'Background Check', buddy: 'Dr. P. Verma', status: 'In Progress' },
            { id: 'OB-2', name: 'S. Nivedita', role: 'Assistant Professor', dept: 'CSE', startDate: '2026-11-05', stage: 'Documents Submitted', buddy: 'Dr. S. Iyer', status: 'In Progress' },
            { id: 'OB-3', name: 'B. Vamsi Krishna', role: 'Lab Engineer', dept: 'Mechanical', startDate: '2026-11-10', stage: 'Offer Released', buddy: 'Dr. M. Rao', status: 'In Progress' },
            { id: 'OB-4', name: 'Dr. Ayesha Siddiqui', role: 'Assistant Professor', dept: 'Management', startDate: '2026-10-28', stage: 'Reporting', buddy: 'Prof. N. Gupta', status: 'Onboarding' },
            { id: 'OB-5', name: 'M. Sridhar', role: 'System Engineer', dept: 'IT', startDate: '2026-10-20', stage: 'ID Card Issued', buddy: 'Ravi Kumar', status: 'Completed' },
          ]}
        />
      </Card>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Staff attendance                                                   */
/* ------------------------------------------------------------------ */

export function StaffAttendancePage() {
  const exportCsv = useExport()

  const roster = [
    { id: 'SA1', name: 'Dr. S. Iyer', dept: 'CSE', in: '08:52', out: '—', hours: 6.1, status: 'Present' },
    { id: 'SA2', name: 'Dr. R. Sharma', dept: 'Physics', in: '09:04', out: '—', hours: 5.9, status: 'Present' },
    { id: 'SA3', name: 'Prof. K. Nair', dept: 'CSE', in: '09:31', out: '—', hours: 5.5, status: 'Late' },
    { id: 'SA4', name: 'S. Venkatesh', dept: 'Accounts', in: '—', out: '—', hours: 0, status: 'On Leave' },
    { id: 'SA5', name: 'Prof. D. Naik', dept: 'Hostel', in: '08:45', out: '—', hours: 6.2, status: 'Present' },
    { id: 'SA6', name: 'Ravi Kumar', dept: 'IT', in: '09:18', out: '—', hours: 5.8, status: 'Present' },
  ]

  return (
    <div>
      <PageHeader
        title="Staff Attendance"
        subtitle="Daily presence, late arrivals and department-wise patterns."
        breadcrumb={[{ label: 'People' }, { label: 'Staff Attendance' }]}
        actions={
          <Button
            variant="secondary"
            icon="download"
            onClick={() =>
              exportCsv(
                'staff-attendance',
                [
                  { key: 'name', header: 'Name' },
                  { key: 'dept', header: 'Department' },
                  { key: 'in', header: 'Marked In' },
                  { key: 'out', header: 'Marked Out' },
                  { key: 'hours', header: 'Hours' },
                  { key: 'status', header: 'Status' },
                ],
                roster,
                { label: 'staff' },
              )
            }
          >
            Export
          </Button>
        }
      />

      <div className="listpage__stats">
        <StatCard label="Present Today" value={198} icon="checkCircle" accent="success" hint="of 214" />
        <StatCard label="On Leave" value={9} icon="clock" accent="warning" />
        <StatCard label="Absent" value={7} icon="xCircle" accent="danger" />
        <StatCard label="Late Arrivals" value={11} icon="alert" accent="info" />
      </div>

      <Card title="Today's roster" subtitle="Marked as of 09:30" padded={false}>
        <DataTable
          columns={[
            col.text('name', 'Name', { primary: true }),
            col.badge('dept', 'Department', 'indigo'),
            col.text('in', 'Marked In'),
            col.text('out', 'Marked Out'),
            col.number('hours', 'Hours'),
            col.status('status'),
          ]}
          rows={roster}
        />
      </Card>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Leave management                                                   */
/* ------------------------------------------------------------------ */

export function LeavePage() {
  const toast = useToast()
  const [tab, setTab] = useState('pending')

  const rows =
    tab === 'all' ? LEAVE_REQUESTS : LEAVE_REQUESTS.filter((l) => l.status.toLowerCase() === tab)

  return (
    <div>
      <PageHeader
        title="Leave Management"
        subtitle="Leave applications, balances and approval workflow."
        breadcrumb={[{ label: 'People' }, { label: 'Leave Management' }]}
        actions={<Button icon="plus" onClick={() => toast.success('Leave application form opened')}>Apply for Leave</Button>}
      />

      <div className="listpage__stats">
        <StatCard label="Pending" value={LEAVE_REQUESTS.filter((l) => l.status === 'Pending').length} icon="clock" accent="warning" />
        <StatCard label="Approved" value={LEAVE_REQUESTS.filter((l) => l.status === 'Approved').length} icon="checkCircle" accent="success" />
        <StatCard label="Rejected" value={LEAVE_REQUESTS.filter((l) => l.status === 'Rejected').length} icon="xCircle" accent="danger" />
        <StatCard label="On Leave Today" value={9} icon="users" accent="info" />
      </div>

      <Card padded={false}>
        <div className="ppl__tabbar">
          <Tabs
            tabs={[
              { id: 'pending', label: 'Pending', count: LEAVE_REQUESTS.filter((l) => l.status === 'Pending').length },
              { id: 'approved', label: 'Approved', count: LEAVE_REQUESTS.filter((l) => l.status === 'Approved').length },
              { id: 'rejected', label: 'Rejected', count: LEAVE_REQUESTS.filter((l) => l.status === 'Rejected').length },
              { id: 'all', label: 'All' },
            ]}
            active={tab}
            onChange={setTab}
          />
        </div>
        <DataTable
          columns={[
            col.text('id', 'Request', { primary: true }),
            col.text('employee', 'Employee'),
            col.badge('type', 'Leave Type', 'indigo'),
            col.text('from', 'From'),
            col.text('to', 'To'),
            col.number('days', 'Days'),
            col.text('reason', 'Reason'),
            col.status('status'),
          ]}
          rows={rows}
        />
      </Card>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Appraisals                                                          */
/* ------------------------------------------------------------------ */

export function AppraisalPage() {
  const avg = (APPRAISALS.reduce((s, a) => s + a.rating, 0) / APPRAISALS.length).toFixed(2)
  return (
    <ListPage
      title="Appraisals"
      subtitle="Performance review cycle, ratings and reviewer sign-off."
      breadcrumb={[{ label: 'People' }, { label: 'Appraisals' }]}
      searchKeys="employee reviewer cycle"
      searchPlaceholder="Search employee or reviewer…"
      entityName="appraisals"
      stats={[
        { label: 'Cycle', value: '2025-26', icon: 'calendar', accent: 'indigo' },
        { label: 'Avg Rating', value: avg, icon: 'award', accent: 'violet' },
        { label: 'Finalized', value: APPRAISALS.filter((a) => a.status === 'Finalized').length, icon: 'checkCircle', accent: 'success' },
        { label: 'Under Review', value: APPRAISALS.filter((a) => a.status === 'Under Review').length, icon: 'clock', accent: 'warning' },
      ]}
      columns={[
        col.text('employee', 'Employee', { primary: true }),
        col.badge('cycle', 'Cycle', 'indigo'),
        {
          key: 'rating',
          header: 'Rating',
          render: (r) => (
            <span className="ppl__rating">
              <Icon name="award" size={13} /> {r.rating} / 5
            </span>
          ),
        },
        col.text('reviewer', 'Reviewer'),
        col.text('submitted', 'Submitted'),
        col.status('status'),
      ]}
      rows={APPRAISALS}
      renderDetail={(a) => (
        <div className="detail">
          <div className="detail__grid">
            <div className="detail__field">
              <span className="detail__label">Employee</span>
              <span className="detail__value">{a.employee}</span>
            </div>
            <div className="detail__field">
              <span className="detail__label">Cycle</span>
              <span className="detail__value">{a.cycle}</span>
            </div>
            <div className="detail__field">
              <span className="detail__label">Reviewer</span>
              <span className="detail__value">{a.reviewer}</span>
            </div>
            <div className="detail__field">
              <span className="detail__label">Rating</span>
              <span className="detail__value">{a.rating} / 5</span>
            </div>
          </div>
          <div>
            <h4 className="detail__section-title">Competency breakdown</h4>
            {[
              ['Subject Knowledge', 92],
              ['Pedagogy', 88],
              ['Research Output', 74],
              ['Student Feedback', 90],
              ['Administration', 81],
            ].map(([label, val]) => (
              <div key={label} className="ppl__comp">
                <span>{label}</span>
                <ProgressBar value={val} max={100} tone="violet" size="sm" showLabel />
              </div>
            ))}
          </div>
        </div>
      )}
    />
  )
}

/* ------------------------------------------------------------------ */
/* Research                                                           */
/* ------------------------------------------------------------------ */

export function ResearchPage() {
  const toast = useToast()
  return (
    <ListPage
      title="Research Profiles"
      subtitle="Publications, citations, h-index and funded projects."
      breadcrumb={[{ label: 'People' }, { label: 'Research Profiles' }]}
      searchKeys="faculty title"
      searchPlaceholder="Search faculty or research area…"
      entityName="research profiles"
      stats={[
        { label: 'Researchers', value: RESEARCH_PROFILES.length, icon: 'academic', accent: 'indigo' },
        { label: 'Papers', value: RESEARCH_PROFILES.reduce((s, r) => s + r.journals, 0), icon: 'book', accent: 'violet' },
        { label: 'Citations', value: RESEARCH_PROFILES.reduce((s, r) => s + r.citations, 0), icon: 'award', accent: 'success' },
        { label: 'Funded Projects', value: RESEARCH_PROFILES.reduce((s, r) => s + r.projects, 0), icon: 'target', accent: 'info' },
      ]}
      actions={<Button icon="plus" onClick={() => toast.success('Research profile form opened')}>Add Profile</Button>}
      columns={[
        col.text('faculty', 'Faculty', { primary: true }),
        col.text('title', 'Research Area'),
        col.number('journals', 'Papers'),
        col.number('citations', 'Citations'),
        col.number('hIndex', 'h-index'),
        col.number('projects', 'Projects'),
        col.status('status'),
      ]}
      rows={RESEARCH_PROFILES}
      renderDetail={(r) => (
        <div className="detail">
          <div className="detail__grid">
            <div className="detail__field">
              <span className="detail__label">Faculty</span>
              <span className="detail__value">{r.faculty}</span>
            </div>
            <div className="detail__field">
              <span className="detail__label">h-index</span>
              <span className="detail__value">{r.hIndex}</span>
            </div>
            <div className="detail__field">
              <span className="detail__label">Papers</span>
              <span className="detail__value">{r.journals}</span>
            </div>
            <div className="detail__field">
              <span className="detail__label">Citations</span>
              <span className="detail__value">{r.citations}</span>
            </div>
          </div>
          <div>
            <h4 className="detail__section-title">Research area</h4>
            <p style={{ fontSize: 'var(--fs-md)', color: 'var(--text-secondary)' }}>{r.title}</p>
          </div>
          <ul className="detail__list">
            <li><span>Funded projects</span><strong>{r.projects}</strong></li>
            <li><span>Funding agencies</span><strong>DST, AICTE, MeitY</strong></li>
            <li><span>Current h-index</span><strong>{r.hIndex}</strong></li>
          </ul>
        </div>
      )}
    />
  )
}
