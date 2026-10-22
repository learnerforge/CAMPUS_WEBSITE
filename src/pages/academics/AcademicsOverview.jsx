import { Link } from 'react-router-dom'
import Icon from '../../components/ui/Icon'
import { Badge, Button, Card, PageHeader, ProgressBar, StatCard, BarChart, DonutChart, Legend } from '../../components/ui'
import { useToast } from '../../context/ToastContext'
import { useExport } from '../../utils/useExport'
import {
  PROGRAMS,
  COURSES,
  ATTENDANCE_SESSIONS,
  EXAMINATIONS,
  OBE_REPORTS,
  FEEDBACK,
  ATTENDANCE_TREND,
} from '../../data/mock'
import './academics.css'

export function AcademicsOverview() {
  const toast = useToast()
  const exportCsv = useExport()
  const totalStudents = PROGRAMS.reduce((s, p) => s + p.filled, 0)
  const totalSeats = PROGRAMS.reduce((s, p) => s + p.seats, 0)
  const avgAtt = (
    ATTENDANCE_SESSIONS.filter((s) => s.status === 'Completed').reduce((s, r) => s + r.pct, 0) /
    ATTENDANCE_SESSIONS.filter((s) => s.status === 'Completed').length
  ).toFixed(1)

  const programMix = PROGRAMS.map((p, i) => ({
    label: p.code,
    value: p.filled,
    color: ['var(--indigo-500)', 'var(--violet-500)', 'var(--success-500)', 'var(--warning-500)', 'var(--info-500)', 'var(--danger-500)'][i],
  }))

  return (
    <div>
      <PageHeader
        title="Academics"
        subtitle="Every academic cycle, covered — from course registration to outcome-based education."
        breadcrumb={[{ label: 'Campus Systems' }, { label: 'Academics' }]}
        actions={
          <>
            <Button
              variant="secondary"
              icon="download"
              onClick={() =>
                exportCsv(
                  'academics-programme-intake',
                  [
                    { key: 'code', header: 'Code' },
                    { key: 'name', header: 'Programme' },
                    { key: 'dept', header: 'Department' },
                    { key: 'seats', header: 'Sanctioned Seats' },
                    { key: 'filled', header: 'Admitted' },
                  ],
                  PROGRAMS,
                  { label: 'programmes' },
                )
              }
            >
              Export
            </Button>
            <Button icon="plus" onClick={() => toast.success('New course creation form opened')}>
              New Course
            </Button>
          </>
        }
      />

      <div className="listpage__stats">
        <StatCard label="Active Students" value={totalStudents} icon="users" accent="indigo" delta={4.2} />
        <StatCard label="Courses Running" value={COURSES.length} icon="book" accent="violet" delta={3.1} />
        <StatCard label="Avg Attendance" value={`${avgAtt}%`} icon="calendarCheck" accent="success" delta={1.4} />
        <StatCard label="Seat Utilisation" value={`${Math.round((totalStudents / totalSeats) * 100)}%`} icon="target" accent="warning" hint={`${totalSeats} sanctioned`} />
      </div>

      <div className="acad__grid">
        <Card title="Programme intake" subtitle="Sanctioned vs admitted — 2025-26">
          <ul className="acad__programs">
            {PROGRAMS.map((p) => (
              <li key={p.id}>
                <div className="acad__program-head">
                  <span className="acad__program-code">{p.code}</span>
                  <span className="acad__program-name">{p.name}</span>
                  <span className="acad__program-count">
                    {p.filled}
                    <em>/{p.seats}</em>
                  </span>
                </div>
                <ProgressBar value={p.filled} max={p.seats} tone={p.filled / p.seats > 0.9 ? 'success' : 'indigo'} size="sm" />
              </li>
            ))}
          </ul>
        </Card>

        <Card title="Attendance by day" subtitle="Average across all programmes">
          <BarChart
            data={ATTENDANCE_TREND.map((d) => ({
              label: d.day,
              value: d.value,
              color: d.value >= 85 ? 'var(--indigo-500)' : 'var(--warning-500)',
            }))}
            height={190}
          />
        </Card>
      </div>

      <div className="acad__grid acad__grid--2">
        <Card
          title="Recent sessions"
          subtitle="Attendance marking status"
          action={<Link to="/app/academics/attendance" className="acad__link">View all <Icon name="arrowRight" size={14} /></Link>}
        >
          <ul className="acad__sessions">
            {ATTENDANCE_SESSIONS.slice(0, 5).map((s) => (
              <li key={s.id}>
                <div className="acad__session-main">
                  <strong>{s.course}</strong>
                  <span>{s.faculty} · {s.time}</span>
                </div>
                <div className="acad__session-bar">
                  <ProgressBar value={s.pct} max={100} tone={s.pct >= 85 ? 'success' : s.pct >= 75 ? 'warning' : 'danger'} size="sm" />
                </div>
                <span className="acad__session-pct">{s.pct ? `${s.pct}%` : '—'}</span>
                <Badge tone={s.status === 'Completed' ? 'success' : 'info'}>{s.status}</Badge>
              </li>
            ))}
          </ul>
        </Card>

        <Card
          title="Upcoming examinations"
          subtitle="Scheduled in the next 14 days"
          action={<Link to="/app/academics/examinations" className="acad__link">View all <Icon name="arrowRight" size={14} /></Link>}
        >
          <ul className="acad__exams">
            {EXAMINATIONS.filter((e) => e.status === 'Scheduled').map((e) => (
              <li key={e.id}>
                <span className="acad__exam-date">
                  <strong>{new Date(e.date).getDate()}</strong>
                  <em>{new Date(e.date).toLocaleString('en', { month: 'short' })}</em>
                </span>
                <div className="acad__exam-main">
                  <strong>{e.course}</strong>
                  <span>{e.type} · {e.students} students</span>
                </div>
                <Badge tone="info">{e.max} marks</Badge>
              </li>
            ))}
            {EXAMINATIONS.filter((e) => e.status === 'Scheduled').length === 0 && (
              <li className="acad__empty">No examinations scheduled.</li>
            )}
          </ul>
        </Card>
      </div>

      <div className="acad__grid acad__grid--3">
        <Card title="Programme mix" subtitle="Students per programme">
          <div className="acad__donut">
            <DonutChart data={programMix} size={160} thickness={20} centerValue={totalStudents} centerLabel="Students" />
            <Legend data={programMix} />
          </div>
        </Card>

        <Card title="OBE attainment" subtitle="Programme outcome mapping" action={<Link to="/app/academics/obe" className="acad__link">Open <Icon name="arrowRight" size={14} /></Link>}>
          <ul className="acad__obe">
            {OBE_REPORTS.map((o) => (
              <li key={o.id}>
                <div className="acad__obe-head">
                  <strong>{o.course}</strong>
                  <Badge tone={o.level === 'High' ? 'success' : 'warning'}>{o.level}</Badge>
                </div>
                <div className="acad__obe-bars">
                  <span>PO <b>{o.po}</b></span>
                  <span>PS <b>{o.ps}</b></span>
                  <span>CO <b>{o.co}</b></span>
                </div>
              </li>
            ))}
          </ul>
        </Card>

        <Card title="Course feedback" subtitle="Student satisfaction ratings" action={<Link to="/app/academics/feedback" className="acad__link">Open <Icon name="arrowRight" size={14} /></Link>}>
          <ul className="acad__fb">
            {FEEDBACK.filter((f) => f.rating > 0).map((f) => (
              <li key={f.id}>
                <div className="acad__fb-head">
                  <strong>{f.course}</strong>
                  <span className="acad__fb-rating">
                    <Icon name="award" size={13} /> {f.rating}
                  </span>
                </div>
                <span className="acad__fb-meta">{f.responses} responses · {f.comments} comments</span>
                <ProgressBar value={f.rating * 20} max={100} tone="violet" size="sm" />
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  )
}

export function ProgramsPage() {
  return (
    <div className="acad__course-grid">
      {PROGRAMS.map((p) => {
        const courses = COURSES.filter((c) => c.program === p.code)
        return (
          <Card key={p.id} className="acad__course-card">
            <div className="acad__course-head">
              <span className="acad__course-badge">{p.code}</span>
              <div>
                <strong>{p.name}</strong>
                <span>{p.seats} sanctioned seats</span>
              </div>
              <Badge tone={p.filled / p.seats > 0.9 ? 'success' : 'warning'}>
                {p.filled}/{p.seats}
              </Badge>
            </div>
            <ProgressBar value={p.filled} max={p.seats} tone="indigo" size="sm" showLabel />
            <ul className="acad__course-list">
              {courses.length ? (
                courses.map((c) => (
                  <li key={c.id}>
                    <span className="mono">{c.code}</span>
                    <span className="truncate">{c.name}</span>
                    <em>{c.students}</em>
                  </li>
                ))
              ) : (
                <li className="acad__empty">No courses mapped yet.</li>
              )}
            </ul>
          </Card>
        )
      })}
    </div>
  )
}
