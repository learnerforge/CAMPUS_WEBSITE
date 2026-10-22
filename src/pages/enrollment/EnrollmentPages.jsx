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
import { ENQUIRIES, APPLICATIONS, ADMISSIONS_STATS } from '../../data/mock'
import './enrollment.css'

/* ------------------------------------------------------------------ */
/* Overview                                                           */
/* ------------------------------------------------------------------ */

export function EnrollmentOverview() {
  const toast = useToast()
  const exportCsv = useExport()
  const stats = ADMISSIONS_STATS

  const funnel = [
    { label: 'Applications', value: stats.applications, color: 'var(--indigo-500)' },
    { label: 'Shortlisted', value: stats.shortlisted, color: 'var(--indigo-400)' },
    { label: 'Confirmed', value: stats.confirmed, color: 'var(--violet-500)' },
    { label: 'Offer Released', value: stats.offerReleased, color: 'var(--info-500)' },
    { label: 'Joined', value: stats.joined, color: 'var(--success-500)' },
  ]

  const sourceMix = ENQUIRIES.reduce((acc, e) => {
    acc[e.source] = (acc[e.source] || 0) + 1
    return acc
  }, {})
  const mixColors = ['var(--indigo-500)', 'var(--violet-500)', 'var(--success-500)', 'var(--warning-500)', 'var(--info-500)']
  const mix = Object.entries(sourceMix).map(([label, value], i) => ({ label, value, color: mixColors[i % mixColors.length] }))

  return (
    <div>
      <PageHeader
        title="Enrollment"
        subtitle="Full visibility from first enquiry to confirmed admission."
        breadcrumb={[{ label: 'Campus Systems' }, { label: 'Enrollment' }]}
        actions={
          <>
            <Button
              variant="secondary"
              icon="download"
              onClick={() =>
                exportCsv(
                  'enrollment-admission-funnel',
                  [
                    { key: 'label', header: 'Stage' },
                    { key: 'value', header: 'Candidates' },
                  ],
                  funnel,
                  { label: 'stages' },
                )
              }
            >
              Export
            </Button>
            <Button icon="plus" onClick={() => toast.success('New enquiry form opened')}>New Enquiry</Button>
          </>
        }
      />

      <div className="listpage__stats">
        <StatCard label="Applications" value={stats.applications} icon="file" accent="indigo" delta={18.2} />
        <StatCard label="Confirmed" value={stats.confirmed} icon="checkCircle" accent="success" delta={12.5} />
        <StatCard label="Pending Review" value={stats.pending} icon="clock" accent="warning" />
        <StatCard label="Join Rate" value={`${Math.round((stats.joined / stats.applications) * 100)}%`} icon="percent" accent="violet" delta={2.8} />
      </div>

      <div className="enr__grid">
        <Card title="Admission funnel" subtitle="Enquiry to enrolment, 2025-26">
          <BarChart data={funnel} height={200} />
        </Card>

        <Card title="Enquiry sources" subtitle="Where prospects come from">
          <div className="enr__donut">
            <DonutChart data={mix} size={160} thickness={20} centerValue={ENQUIRIES.length} centerLabel="Enquiries" />
            <Legend data={mix} />
          </div>
        </Card>
      </div>

      <div className="enr__grid enr__grid--2">
        <Card title="Latest enquiries" subtitle="Most recent prospects" action={<Button size="sm" variant="ghost" onClick={() => (window.location.hash = '#enquiries')}>View all</Button>}>
          <ul className="enr__enquiries">
            {ENQUIRIES.slice(0, 5).map((e) => (
              <li key={e.id}>
                <span className="enr__eq-score">{e.score}</span>
                <div className="enr__eq-main">
                  <strong>{e.name}</strong>
                  <span>{e.program} · {e.source}</span>
                </div>
                <Badge tone={e.status === 'Admitted' ? 'success' : e.status === 'New' ? 'info' : e.status === 'Not Interested' ? 'danger' : 'warning'}>
                  {e.status}
                </Badge>
              </li>
            ))}
          </ul>
        </Card>

        <Card title="Applications pipeline" subtitle="Document verification status">
          <ul className="enr__pipeline">
            {[
              { label: 'Documents verified', value: APPLICATIONS.filter((a) => a.docs === 'Verified').length, total: APPLICATIONS.length, tone: 'success' },
              { label: 'Pending verification', value: APPLICATIONS.filter((a) => a.docs === 'Pending').length, total: APPLICATIONS.length, tone: 'warning' },
              { label: 'Incomplete', value: APPLICATIONS.filter((a) => a.docs === 'Incomplete').length, total: APPLICATIONS.length, tone: 'danger' },
            ].map((s) => (
              <li key={s.label}>
                <div className="enr__pipe-head">
                  <span>{s.label}</span>
                  <strong>{s.value}/{s.total}</strong>
                </div>
                <ProgressBar value={s.value} max={s.total} tone={s.tone} size="sm" />
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Enquiries                                                          */
/* ------------------------------------------------------------------ */

export function EnquiriesPage() {
  const toast = useToast()
  return (
    <ListPage
      title="Enquiries"
      subtitle="Pre-admissions CRM — every prospect, every source, every follow-up."
      breadcrumb={[{ label: 'Enrollment' }, { label: 'Enquiries' }]}
      searchKeys="name program source counsellor"
      searchPlaceholder="Search prospect, programme or source…"
      entityName="enquiries"
      filters={[
        { key: 'status', label: 'status', options: ['New', 'Follow-up Due', 'Counselling Done', 'Admitted', 'Not Interested'].map((v) => ({ value: v, label: v })) },
        { key: 'source', label: 'sources', options: [...new Set(ENQUIRIES.map((e) => e.source))].map((v) => ({ value: v, label: v })) },
      ]}
      stats={[
        { label: 'Total Enquiries', value: 486, icon: 'phone', accent: 'indigo', delta: 12.4 },
        { label: 'New', value: ENQUIRIES.filter((e) => e.status === 'New').length, icon: 'sparkles', accent: 'info' },
        { label: 'Follow-up Due', value: ENQUIRIES.filter((e) => e.status === 'Follow-up Due').length, icon: 'clock', accent: 'warning' },
        { label: 'Converted', value: ENQUIRIES.filter((e) => e.status === 'Admitted').length, icon: 'checkCircle', accent: 'success' },
      ]}
      actions={
        <Button icon="plus" onClick={() => toast.success('New enquiry form opened')}>Add Enquiry</Button>
      }
      columns={[
        col.text('id', 'Enquiry', { primary: true }),
        col.text('name', 'Prospect'),
        col.badge('program', 'Interested In', 'indigo'),
        col.badge('source', 'Source', 'violet'),
        {
          key: 'score',
          header: 'Lead Score',
          render: (r) => (
            <span className="enr__score" data-band={r.score >= 85 ? 'high' : r.score >= 70 ? 'mid' : 'low'}>
              {r.score}
            </span>
          ),
        },
        col.text('date', 'Date'),
        col.status('status'),
        col.text('counsellor', 'Counsellor'),
      ]}
      rows={ENQUIRIES}
      renderDetail={(e) => (
        <div className="detail">
          <div className="detail__grid">
            <div className="detail__field">
              <span className="detail__label">Prospect</span>
              <span className="detail__value">{e.name}</span>
            </div>
            <div className="detail__field">
              <span className="detail__label">Programme</span>
              <span className="detail__value">{e.program}</span>
            </div>
            <div className="detail__field">
              <span className="detail__label">Source</span>
              <span className="detail__value">{e.source}</span>
            </div>
            <div className="detail__field">
              <span className="detail__label">Counsellor</span>
              <span className="detail__value">{e.counsellor}</span>
            </div>
            <div className="detail__field">
              <span className="detail__label">Enquiry Date</span>
              <span className="detail__value">{e.date}</span>
            </div>
            <div className="detail__field">
              <span className="detail__label">Status</span>
              <span className="detail__value">{e.status}</span>
            </div>
          </div>
          <div>
            <h4 className="detail__section-title">Lead score</h4>
            <ProgressBar value={e.score} max={100} tone={e.score >= 85 ? 'success' : e.score >= 70 ? 'warning' : 'danger'} size="lg" showLabel />
          </div>
          <ul className="detail__list">
            <li><span>Qualification</span><strong>JEE / State CET</strong></li>
            <li><span>Secondary marks</span><strong>88.4%</strong></li>
            <li><span>Preferred hostel</span><strong>Yes</strong></li>
            <li><span>Next action</span><strong>Schedule counselling</strong></li>
          </ul>
        </div>
      )}
    />
  )
}

/* ------------------------------------------------------------------ */
/* Applications                                                       */
/* ------------------------------------------------------------------ */

export function ApplicationsPage() {
  const toast = useToast()
  return (
    <ListPage
      title="Applications"
      subtitle="Applicant tracking with document verification and entrance scores."
      breadcrumb={[{ label: 'Enrollment' }, { label: 'Applications' }]}
      searchKeys="name program"
      searchPlaceholder="Search applicant or programme…"
      entityName="applications"
      filters={[
        { key: 'status', label: 'status', options: ['Confirmed', 'Under Review', 'Documents Missing'].map((v) => ({ value: v, label: v })) },
        { key: 'docs', label: 'document status', options: ['Verified', 'Pending', 'Incomplete'].map((v) => ({ value: v, label: v })) },
      ]}
      stats={[
        { label: 'Total Applications', value: ADMISSIONS_STATS.applications, icon: 'file', accent: 'indigo', delta: 18.2 },
        { label: 'Confirmed', value: ADMISSIONS_STATS.confirmed, icon: 'checkCircle', accent: 'success' },
        { label: 'Under Review', value: ADMISSIONS_STATS.pending, icon: 'clock', accent: 'warning' },
        { label: 'Docs Missing', value: APPLICATIONS.filter((a) => a.docs === 'Incomplete').length, icon: 'alert', accent: 'danger' },
      ]}
      actions={
        <Button icon="plus" onClick={() => toast.success('New application form opened')}>Add Application</Button>
      }
      columns={[
        col.text('id', 'Application', { primary: true }),
        col.text('name', 'Applicant'),
        col.badge('program', 'Programme', 'indigo'),
        col.text('appliedOn', 'Applied On'),
        {
          key: 'entrance',
          header: 'Entrance',
          render: (r) => <span className="cell-num" style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{r.entrance}</span>,
        },
        col.badge('docs', 'Documents', 'neutral'),
        col.status('status'),
      ]}
      rows={APPLICATIONS}
      renderDetail={(a) => (
        <div className="detail">
          <div className="detail__grid">
            <div className="detail__field">
              <span className="detail__label">Applicant</span>
              <span className="detail__value">{a.name}</span>
            </div>
            <div className="detail__field">
              <span className="detail__label">Programme</span>
              <span className="detail__value">{a.program}</span>
            </div>
            <div className="detail__field">
              <span className="detail__label">Applied On</span>
              <span className="detail__value">{a.appliedOn}</span>
            </div>
            <div className="detail__field">
              <span className="detail__label">Entrance Score</span>
              <span className="detail__value">{a.entrance} / 100</span>
            </div>
            <div className="detail__field">
              <span className="detail__label">Documents</span>
              <span className="detail__value">{a.docs}</span>
            </div>
            <div className="detail__field">
              <span className="detail__label">Status</span>
              <span className="detail__value">{a.status}</span>
            </div>
          </div>
          <div>
            <h4 className="detail__section-title">Document checklist</h4>
            <ul className="enr__checklist">
              {['10th Marksheet', '12th Marksheet', 'Entrance Scorecard', 'Transfer Certificate', 'Aadhaar / ID Proof', 'Passport Photos'].map((d) => (
                <li key={d}>
                  <Icon name="checkCircle" size={15} />
                  {d}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    />
  )
}

/* ------------------------------------------------------------------ */
/* Counselling                                                        */
/* ------------------------------------------------------------------ */

export function CounsellingPage() {
  const toast = useToast()
  const [tab, setTab] = useState('schedule')

  return (
    <div>
      <PageHeader
        title="Counselling"
        subtitle="Scheduled sessions, seat allotment and conversion outcomes."
        breadcrumb={[{ label: 'Enrollment' }, { label: 'Counselling' }]}
        actions={<Button icon="plus" onClick={() => toast.success('Counselling slot created')}>Schedule Session</Button>}
      />

      <div className="listpage__stats">
        <StatCard label="Sessions This Week" value={18} icon="calendar" accent="indigo" />
        <StatCard label="Slots Booked" value={142} icon="checkCircle" accent="success" delta={9.4} />
        <StatCard label="Seats Allotted" value={96} icon="target" accent="violet" />
        <StatCard label="Avg Conversion" value="62%" icon="percent" accent="info" delta={4.1} />
      </div>

      <Card padded={false}>
        <div className="enr__tabbar">
          <Tabs
            tabs={[
              { id: 'schedule', label: 'Upcoming Sessions', count: 4 },
              { id: 'allotment', label: 'Seat Allotment', count: 6 },
            ]}
            active={tab}
            onChange={setTab}
          />
        </div>

        {tab === 'schedule' ? (
          <ul className="enr__sessions">
            {[
              { time: '10:00 – 10:30', date: '22 Oct 2026', name: 'Anitha Sharma', program: 'B.Tech CSE', counsellor: 'P. Lakshmi', mode: 'In person', venue: 'Admissions Office' },
              { time: '11:00 – 11:30', date: '22 Oct 2026', name: 'Sandeep Kumar', program: 'B.Tech ECE', counsellor: 'M. Feroz', mode: 'Online', venue: 'Google Meet' },
              { time: '12:00 – 12:30', date: '23 Oct 2026', name: 'Neha Agarwal', program: 'B.Tech ME', counsellor: 'P. Lakshmi', mode: 'In person', venue: 'Admissions Office' },
              { time: '14:00 – 14:30', date: '24 Oct 2026', name: 'Farhan Ali', program: 'B.Tech CIVIL', counsellor: 'S. Kiran', mode: 'In person', venue: 'Admin Block' },
            ].map((s) => (
              <li key={s.time + s.name}>
                <div className="enr__sess-time">
                  <strong>{s.time}</strong>
                  <span>{s.date}</span>
                </div>
                <div className="enr__sess-main">
                  <strong>{s.name}</strong>
                  <span>{s.program} · {s.mode} · {s.venue}</span>
                </div>
                <Badge tone="indigo">{s.counsellor}</Badge>
                <Button size="sm" variant="secondary" onClick={() => toast.info(`Opening session for ${s.name}`)}>
                  Open
                </Button>
              </li>
            ))}
          </ul>
        ) : (
          <DataTable
            columns={[
              col.text('name', 'Applicant', { primary: true }),
              col.badge('program', 'Programme', 'indigo'),
              col.badge('category', 'Category', 'violet'),
              col.text('quota', 'Quota'),
              col.text('rank', 'Rank'),
              col.status('status'),
            ]}
            rows={[
              { id: 'SA1', name: 'Anitha Sharma', program: 'B.Tech CSE', category: 'General', quota: 'Telangana', rank: 1240, status: 'Confirmed' },
              { id: 'SA2', name: 'Sandeep Kumar', program: 'B.Tech ECE', category: 'BC-B', quota: 'Telangana', rank: 2210, status: 'Under Review' },
              { id: 'SA3', name: 'Neha Agarwal', program: 'B.Tech ME', category: 'General', quota: 'Andhra Pradesh', rank: 3320, status: 'Confirmed' },
              { id: 'SA4', name: 'Farhan Ali', program: 'B.Tech CIVIL', category: 'BC-A', quota: 'Telangana', rank: 1875, status: 'Under Review' },
              { id: 'SA5', name: 'Vivek Joshi', program: 'M.Tech', category: 'General', quota: 'GATE', rank: 210, status: 'Confirmed' },
              { id: 'SA6', name: 'Rohit Bansal', program: 'MBA', category: 'General', quota: 'CAT', rank: 840, status: 'Documents Missing' },
            ]}
          />
        )}
      </Card>
    </div>
  )
}
