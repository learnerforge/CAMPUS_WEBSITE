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
  Tabs,
} from '../../components/ui'
import { col } from '../../components/ListPage'
import { useToast } from '../../context/ToastContext'
import {
  STUDENT_COURSES,
  STUDENT_ATTENDANCE_SUBJECT,
  STUDENT_SEMESTERS,
  STUDENT_DUES,
  STUDENT_NOTICES,
  STUDENT_ASSIGNMENTS,
  STUDENT_TIMETABLE,
  LIBRARY_ITEMS,
} from '../../data/mock'
import { useExport } from '../../utils/useExport'
import './portal.css'

/* ------------------------------------------------------------------ */
/* Dashboard                                                           */
/* ------------------------------------------------------------------ */

export function PortalDashboard() {
  const toast = useToast()
  const exportCsv = useExport()
  const attendanceAvg = Math.round(
    STUDENT_ATTENDANCE_SUBJECT.reduce((s, r) => s + r.pct, 0) / STUDENT_ATTENDANCE_SUBJECT.length,
  )
  const dueTotal = STUDENT_DUES.filter((d) => d.status !== 'Paid').reduce((s, d) => s + d.amount, 0)
  const cgpa = STUDENT_SEMESTERS[STUDENT_SEMESTERS.length - 1].sgpa

  return (
    <div>
      <PageHeader
        title="Welcome back, Priya"
        subtitle="21CS042 · B.Tech Computer Science & Engineering · Semester 7 · Section CSE-A"
        actions={
          <>
            <Button
              variant="secondary"
              icon="download"
              onClick={() =>
                exportCsv(
                  'report-card-21CS042',
                  [
                    { key: 'sem', header: 'Semester' },
                    { key: 'sgpa', header: 'SGPA' },
                    { key: 'credits', header: 'Credits' },
                    { key: 'backlogs', header: 'Backlogs' },
                    { key: 'status', header: 'Status' },
                  ],
                  STUDENT_SEMESTERS,
                  { label: 'semesters' },
                )
              }
            >
              Report Card
            </Button>
            <Button icon="wallet" onClick={() => toast.info('Opening fee payment…')}>
              Pay Dues
            </Button>
          </>
        }
      />

      <div className="listpage__stats">
        <StatCard label="Attendance" value={`${attendanceAvg}%`} icon="calendarCheck" accent="success" delta={1.2} />
        <StatCard label="CGPA" value={cgpa} icon="award" accent="violet" delta={0.3} />
        <StatCard label="Credits Earned" value="169" icon="book" accent="indigo" />
        <StatCard label="Pending Dues" value={`₹${dueTotal.toLocaleString('en-IN')}`} icon="indianRupee" accent="warning" hint="3 items" />
      </div>

      <div className="ptr__grid">
        <Card title="Today's classes" subtitle="Wednesday, 22 October">
          <ul className="ptr__today">
            {STUDENT_TIMETABLE[2].slots.map((s) => (
              <li key={s.time + s.course}>
                <span className="ptr__today-time">{s.time}</span>
                <div className="ptr__today-main">
                  <strong>{s.course}</strong>
                  <span>{s.faculty}</span>
                </div>
                <Badge tone="neutral">{s.room}</Badge>
              </li>
            ))}
          </ul>
        </Card>

        <Card title="Attendance by subject" subtitle="Minimum 75% required">
          <ul className="ptr__subjects">
            {STUDENT_ATTENDANCE_SUBJECT.map((s) => (
              <li key={s.code}>
                <div className="ptr__subj-head">
                  <span className="mono">{s.code}</span>
                  <span className="truncate">{s.name}</span>
                  <strong data-band={s.pct >= 85 ? 'good' : s.pct >= 75 ? 'mid' : 'low'}>{s.pct}%</strong>
                </div>
                <ProgressBar value={s.pct} max={100} tone={s.pct >= 85 ? 'success' : s.pct >= 75 ? 'warning' : 'danger'} size="sm" />
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <div className="ptr__grid ptr__grid--2">
        <Card title="Assignments" subtitle="Deadlines approaching" padded={false}>
          <ul className="ptr__assigns">
            {STUDENT_ASSIGNMENTS.map((a) => (
              <li key={a.id}>
                <span className={`ptr__assign-icon ${a.submitted ? 'is-done' : ''}`}>
                  <Icon name={a.submitted ? 'check' : 'clipboard'} size={15} />
                </span>
                <div className="ptr__assign-main">
                  <strong>{a.title}</strong>
                  <span>{a.course} · due {a.due}</span>
                </div>
                {a.submitted ? (
                  <Badge tone="success">{a.marks}/{a.total}</Badge>
                ) : (
                  <Badge tone="warning">Pending</Badge>
                )}
              </li>
            ))}
          </ul>
        </Card>

        <Card title="Notices" subtitle="From your departments" padded={false}>
          <ul className="ptr__notices">
            {STUDENT_NOTICES.map((n) => (
              <li key={n.id}>
                <span className="ptr__notice-date">
                  <strong>{new Date(n.date).getDate()}</strong>
                  <em>{new Date(n.date).toLocaleString('en', { month: 'short' })}</em>
                </span>
                <div className="ptr__notice-main">
                  <strong>{n.title}</strong>
                  <span>{n.tag}</span>
                </div>
                {n.urgent && <Badge tone="danger">Urgent</Badge>}
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Courses                                                             */
/* ------------------------------------------------------------------ */

export function MyCourses() {
  const exportCsv = useExport()
  return (
    <div>
      <PageHeader
        title="My Courses"
        subtitle="Semester 7 · 26 credits registered"
        actions={
          <Button
            variant="secondary"
            icon="download"
            onClick={() =>
              exportCsv(
                'my-courses',
                [
                  { key: 'code', header: 'Code' },
                  { key: 'name', header: 'Course' },
                  { key: 'faculty', header: 'Faculty' },
                  { key: 'credits', header: 'Credits' },
                  { key: 'attendance', header: 'Attendance %' },
                  { key: 'marks', header: 'Marks' },
                  { key: 'grade', header: 'Grade' },
                  { key: 'status', header: 'Status' },
                ],
                STUDENT_COURSES,
                { label: 'courses' },
              )
            }
          >
            Export
          </Button>
        }
      />
      <div className="ptr__course-grid">
        {STUDENT_COURSES.map((c) => (
          <Card key={c.code} className="ptr__course-card">
            <div className="ptr__course-head">
              <span className="ptr__course-code">{c.code}</span>
              <div>
                <strong>{c.name}</strong>
                <span>{c.faculty} · {c.credits} credits</span>
              </div>
              <Badge tone={c.grade === 'Pending' ? 'warning' : c.grade === 'A+' ? 'success' : 'indigo'}>
                {c.grade}
              </Badge>
            </div>
            <div className="ptr__course-meta">
              <div>
                <span>Attendance</span>
                <strong>{c.attendance}%</strong>
              </div>
              <div>
                <span>Marks</span>
                <strong>{c.marks || '—'}</strong>
              </div>
            </div>
            <ProgressBar value={c.attendance} max={100} tone={c.attendance >= 85 ? 'success' : c.attendance >= 75 ? 'warning' : 'danger'} size="sm" showLabel />
          </Card>
        ))}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Attendance                                                          */
/* ------------------------------------------------------------------ */

export function MyAttendance() {
  const overall = Math.round(
    STUDENT_ATTENDANCE_SUBJECT.reduce((s, r) => s + r.pct, 0) / STUDENT_ATTENDANCE_SUBJECT.length,
  )
  return (
    <div>
      <PageHeader title="My Attendance" subtitle="Subject-wise presence for the current semester" />

      <div className="listpage__stats">
        <StatCard label="Overall" value={`${overall}%`} icon="calendarCheck" accent="success" delta={1.2} />
        <StatCard label="Classes Attended" value="104" icon="checkCircle" accent="indigo" />
        <StatCard label="Classes Missed" value="14" icon="xCircle" accent="danger" />
        <StatCard label="Eligibility" value="Eligible" icon="shield" accent="violet" hint="≥ 75% required" />
      </div>

      <div className="ptr__grid">
        <Card title="Subject-wise attendance" subtitle="Minimum 75% to write the end-semester exam" padded={false}>
          <DataTable
            columns={[
              col.text('code', 'Code', { primary: true }),
              col.text('name', 'Subject'),
              col.number('attended', 'Attended'),
              col.number('total', 'Held'),
              col.progress('pct', 'Percentage'),
            ]}
            rows={STUDENT_ATTENDANCE_SUBJECT}
          />
        </Card>

        <Card title="Monthly trend" subtitle="Attendance across the semester">
          <BarChart
            data={[
              { label: 'Jul', value: 94, color: 'var(--success-500)' },
              { label: 'Aug', value: 91, color: 'var(--indigo-500)' },
              { label: 'Sep', value: 88, color: 'var(--indigo-500)' },
              { label: 'Oct', value: 86, color: 'var(--warning-500)' },
            ]}
            height={190}
          />
        </Card>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Results                                                             */
/* ------------------------------------------------------------------ */

export function MyResults() {
  const [tab, setTab] = useState('semesters')
  const cgpa = STUDENT_SEMESTERS[STUDENT_SEMESTERS.length - 1].sgpa

  return (
    <div>
      <PageHeader title="Results & Marks" subtitle="Semester-wise academic performance" />

      <div className="listpage__stats">
        <StatCard label="Current CGPA" value={cgpa} icon="award" accent="violet" delta={0.3} />
        <StatCard label="Credits Earned" value="169" icon="book" accent="indigo" />
        <StatCard label="Backlogs" value={0} icon="checkCircle" accent="success" />
        <StatCard label="Class Rank" value="12" icon="trendingUp" accent="info" hint="of 140" />
      </div>

      <Card padded={false}>
        <div className="ptr__tabbar">
          <Tabs
            tabs={[
              { id: 'semesters', label: 'Semester-wise', count: STUDENT_SEMESTERS.length },
              { id: 'subjects', label: 'Subject-wise', count: STUDENT_COURSES.length },
            ]}
            active={tab}
            onChange={setTab}
          />
        </div>

        {tab === 'semesters' ? (
          <DataTable
            columns={[
              col.text('sem', 'Semester', { primary: true }),
              col.number('sgpa', 'SGPA'),
              col.number('credits', 'Credits'),
              col.number('backlogs', 'Backlogs'),
              col.status('status'),
            ]}
            rows={STUDENT_SEMESTERS.map((s) => ({ ...s, sem: `Semester ${s.sem}` }))}
          />
        ) : (
          <DataTable
            columns={[
              col.text('code', 'Code', { primary: true }),
              col.text('name', 'Subject'),
              col.number('marks', 'Marks'),
              col.badge('grade', 'Grade', 'indigo'),
              col.number('credits', 'Credits'),
            ]}
            rows={STUDENT_COURSES}
          />
        )}
      </Card>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Fees                                                                */
/* ------------------------------------------------------------------ */

export function MyFees() {
  const toast = useToast()
  const outstanding = STUDENT_DUES.filter((d) => d.status !== 'Paid')
  const total = outstanding.reduce((s, d) => s + d.amount, 0)

  return (
    <div>
      <PageHeader
        title="Fees & Dues"
        subtitle="Fee status, pending dues and payment history"
        actions={<Button icon="wallet" onClick={() => toast.info('Opening secure payment gateway…')}>Pay Now</Button>}
      />

      <div className="listpage__stats">
        <StatCard label="Outstanding" value={`₹${total.toLocaleString('en-IN')}`} icon="indianRupee" accent="danger" />
        <StatCard label="Paid This Year" value="₹1,70,000" icon="checkCircle" accent="success" />
        <StatCard label="Scholarships" value="₹50,000" icon="gift" accent="violet" hint="Merit Cum Means" />
        <StatCard label="Concessions" value="₹40,000" icon="award" accent="info" hint="EBC" />
      </div>

      <Card title="Pending dues" subtitle="Pay before the due date to avoid late charges" padded={false}>
        <DataTable
          columns={[
            col.text('title', 'Item', { primary: true }),
            col.money('amount', 'Amount'),
            col.text('due', 'Due Date'),
            col.status('status'),
            {
              key: 'action',
              header: '',
              render: (r) =>
                r.status !== 'Paid' ? (
                  <Button size="sm" variant="secondary" onClick={() => toast.info(`Opening payment for ${r.title}`)}>
                    Pay
                  </Button>
                ) : (
                  <span style={{ fontSize: 'var(--fs-sm)', color: 'var(--text-subtle)' }}>Receipt</span>
                ),
            },
          ]}
          rows={STUDENT_DUES}
        />
      </Card>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Assignments                                                         */
/* ------------------------------------------------------------------ */

export function MyAssignments() {
  const toast = useToast()
  const [tab, setTab] = useState('pending')
  const rows =
    tab === 'all'
      ? STUDENT_ASSIGNMENTS
      : STUDENT_ASSIGNMENTS.filter((a) => (tab === 'pending' ? !a.submitted : a.submitted))

  return (
    <div>
      <PageHeader
        title="Assignments"
        subtitle="Course-wise submissions and marks"
        actions={<Button icon="upload" onClick={() => toast.info('Upload dialog opened')}>Submit Assignment</Button>}
      />

      <div className="listpage__stats">
        <StatCard label="Total" value={STUDENT_ASSIGNMENTS.length} icon="clipboard" accent="indigo" />
        <StatCard label="Submitted" value={STUDENT_ASSIGNMENTS.filter((a) => a.submitted).length} icon="checkCircle" accent="success" />
        <StatCard label="Pending" value={STUDENT_ASSIGNMENTS.filter((a) => !a.submitted).length} icon="clock" accent="warning" />
        <StatCard label="Avg Marks" value="17 / 20" icon="award" accent="violet" />
      </div>

      <Card padded={false}>
        <div className="ptr__tabbar">
          <Tabs
            tabs={[
              { id: 'pending', label: 'Pending', count: STUDENT_ASSIGNMENTS.filter((a) => !a.submitted).length },
              { id: 'submitted', label: 'Submitted', count: STUDENT_ASSIGNMENTS.filter((a) => a.submitted).length },
              { id: 'all', label: 'All' },
            ]}
            active={tab}
            onChange={setTab}
          />
        </div>
        <DataTable
          columns={[
            col.text('id', 'Ref', { primary: true }),
            col.text('title', 'Assignment'),
            col.badge('course', 'Course', 'indigo'),
            col.text('due', 'Due Date'),
            col.number('total', 'Max Marks'),
            {
              key: 'marks',
              header: 'Score',
              render: (r) => (r.submitted ? <strong style={{ color: 'var(--success-600)' }}>{r.marks}</strong> : '—'),
            },
            col.status('submitted', 'Status'),
          ]}
          rows={rows.map((r) => ({ ...r, submitted: r.submitted ? 'Submitted' : 'Pending' }))}
        />
      </Card>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Library                                                             */
/* ------------------------------------------------------------------ */

export function MyLibrary() {
  const toast = useToast()
  return (
    <div>
      <PageHeader
        title="Library"
        subtitle="Borrowed books, due dates and catalogue"
        actions={<Button variant="secondary" icon="search" onClick={() => toast.info('Catalogue search opened')}>Browse Catalogue</Button>}
      />

      <div className="listpage__stats">
        <StatCard label="Books Issued" value={3} icon="book" accent="indigo" />
        <StatCard label="Due This Week" value={1} icon="clock" accent="warning" />
        <StatCard label="Fines" value="₹320" icon="indianRupee" accent="danger" />
        <StatCard label="Available Titles" value={LIBRARY_ITEMS.length} icon="library" accent="success" />
      </div>

      <Card title="My borrowed books" padded={false}>
        <DataTable
          columns={[
            col.text('id', 'Acc. No', { primary: true }),
            col.text('title', 'Title'),
            col.text('author', 'Author'),
            col.text('issued', 'Issued On'),
            col.text('due', 'Due Date'),
          ]}
          rows={[
            { id: 'BK-2201', title: 'Introduction to Algorithms', author: 'Cormen et al.', issued: '2026-10-08', due: '2026-10-22' },
            { id: 'BK-2206', title: 'Machine Learning Yearning', author: 'Andrew Ng', issued: '2026-10-12', due: '2026-10-26' },
            { id: 'BK-2205', title: 'Principles of Marketing', author: 'Kotler', issued: '2026-10-15', due: '2026-10-29' },
          ]}
        />
      </Card>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Hostel                                                              */
/* ------------------------------------------------------------------ */

export function MyHostel() {
  const toast = useToast()
  return (
    <div>
      <PageHeader
        title="Hostel"
        subtitle="Your accommodation details and mess schedule"
        actions={<Button variant="secondary" icon="phone" onClick={() => toast.info('Calling hostel warden…')}>Contact Warden</Button>}
      />

      <div className="ptr__grid">
        <Card title="Room details">
          <div className="detail__grid">
            <div className="detail__field">
              <span className="detail__label">Block</span>
              <span className="detail__value">Block C</span>
            </div>
            <div className="detail__field">
              <span className="detail__label">Room</span>
              <span className="detail__value">214</span>
            </div>
            <div className="detail__field">
              <span className="detail__label">Warden</span>
              <span className="detail__value">Prof. D. Naik</span>
            </div>
            <div className="detail__field">
              <span className="detail__label">Room Type</span>
              <span className="detail__value">Shared — 3 Bed</span>
            </div>
            <div className="detail__field">
              <span className="detail__label">Annual Rent</span>
              <span className="detail__value">₹45,000</span>
            </div>
            <div className="detail__field">
              <span className="detail__label">Fee Status</span>
              <span className="detail__value">Paid</span>
            </div>
          </div>
        </Card>

        <Card title="Mess schedule" subtitle="Weekday timings">
          <ul className="ptr__mess">
            {[
              ['Breakfast', '07:30 – 08:15'],
              ['Lunch', '12:30 – 13:15'],
              ['Evening Tea', '16:30 – 17:00'],
              ['Dinner', '19:00 – 20:00'],
            ].map(([label, time]) => (
              <li key={label}>
                <Icon name="clock" size={15} />
                <span>{label}</span>
                <strong>{time}</strong>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <Card title="Pending requests" padded={false}>
        <DataTable
          columns={[
            col.text('id', 'Request', { primary: true }),
            col.text('type', 'Type'),
            col.text('raised', 'Raised On'),
            col.status('status'),
          ]}
          rows={[
            { id: 'HR-112', type: 'Room change — Block C to B', raised: '2026-10-20', status: 'Open' },
            { id: 'HR-108', type: 'Guest pass — 2 visitors', raised: '2026-10-18', status: 'Approved' },
          ]}
        />
      </Card>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Timetable                                                           */
/* ------------------------------------------------------------------ */

export function MyTimetable() {
  const [day, setDay] = useState('Monday')
  const selected = STUDENT_TIMETABLE.find((d) => d.day === day) ?? STUDENT_TIMETABLE[0]

  return (
    <div>
      <PageHeader
        title="Timetable"
        subtitle="Your weekly class schedule"
        actions={
          <div className="ptr__days">
            {STUDENT_TIMETABLE.map((d) => (
              <button
                key={d.day}
                className={`ptr__day ${d.day === day ? 'is-active' : ''}`}
                onClick={() => setDay(d.day)}
              >
                {d.day.slice(0, 3)}
              </button>
            ))}
          </div>
        }
      />

      <Card title={`${selected.day} · ${selected.slots.length} classes`}>
        <ul className="ptr__tt">
          {selected.slots.map((s) => (
            <li key={s.time + s.course}>
              <span className="ptr__tt-time">{s.time}</span>
              <span className="ptr__tt-bar" />
              <div className="ptr__tt-main">
                <strong>{s.course}</strong>
                <span>{s.faculty}</span>
              </div>
              <span className="ptr__tt-room">
                <Icon name="mapPin" size={13} /> {s.room}
              </span>
            </li>
          ))}
          {selected.slots.length === 0 && (
            <li style={{ color: 'var(--text-subtle)', fontSize: 'var(--fs-base)' }}>No classes scheduled.</li>
          )}
        </ul>
      </Card>
    </div>
  )
}
