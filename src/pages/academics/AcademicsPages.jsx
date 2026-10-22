import { useState } from 'react'
import Icon from '../../components/ui/Icon'
import {
  Badge,
  Button,
  Card,
  PageHeader,
  ProgressBar,
  StatCard,
  DataTable,
  Modal,
  Select,
  Tabs,
} from '../../components/ui'
import ListPage, { col } from '../../components/ListPage'
import { useToast } from '../../context/ToastContext'
import {
  ATTENDANCE_SESSIONS,
  COURSES,
  EXAMINATIONS,
  OBE_REPORTS,
  FEEDBACK,
  TIMETABLE,
  STUDENTS,
  FACULTY,
  PROGRAMS,
} from '../../data/mock'
import './academics.css'

/* ------------------------------------------------------------------ */
/* Courses & programmes                                               */
/* ------------------------------------------------------------------ */

export function CoursesPage() {
  const toast = useToast()
  const [detail, setDetail] = useState(null)

  return (
    <>
      <ListPage
        title="Programmes & Courses"
        subtitle="Course catalogue mapped to programmes, credits and faculty."
        breadcrumb={[{ label: 'Academics' }, { label: 'Programmes & Courses' }]}
        searchKeys="code name faculty program"
        searchPlaceholder="Search code, course or faculty…"
        entityName="courses"
        filters={[
          {
            key: 'program',
            label: 'programmes',
            options: [...new Set(COURSES.map((c) => c.program))].map((v) => ({ value: v, label: v })),
          },
          { key: 'type', label: 'types', options: ['Core', 'Elective'].map((v) => ({ value: v, label: v })) },
        ]}
        stats={[
          { label: 'Total Courses', value: COURSES.length, icon: 'book', accent: 'indigo' },
          { label: 'Core Courses', value: COURSES.filter((c) => c.type === 'Core').length, icon: 'layers', accent: 'violet' },
          { label: 'Electives', value: COURSES.filter((c) => c.type === 'Elective').length, icon: 'target', accent: 'info' },
          {
            label: 'Total Enrolment',
            value: COURSES.reduce((s, c) => s + c.students, 0),
            icon: 'users',
            accent: 'success',
          },
        ]}
        actions={
          <>
            <Button variant="secondary" icon="download" onClick={() => toast.info('Course catalogue exported')}>Export</Button>
            <Button icon="plus" onClick={() => toast.success('Course creation form opened')}>New Course</Button>
          </>
        }
        columns={[
          col.text('code', 'Code', { primary: true }),
          col.text('name', 'Course Name'),
          col.badge('program', 'Programme', 'indigo'),
          col.number('credits', 'Credits'),
          col.text('faculty', 'Faculty'),
          col.number('students', 'Enrolled'),
          col.badge('type', 'Type', 'neutral'),
        ]}
        rows={COURSES}
        renderDetail={(c) => (
          <div className="detail">
            <div className="detail__grid">
              <div className="detail__field">
                <span className="detail__label">Course Code</span>
                <span className="detail__value mono">{c.code}</span>
              </div>
              <div className="detail__field">
                <span className="detail__label">Programme</span>
                <span className="detail__value">{c.program}</span>
              </div>
              <div className="detail__field">
                <span className="detail__label">Credits</span>
                <span className="detail__value">{c.credits}</span>
              </div>
              <div className="detail__field">
                <span className="detail__label">Semester</span>
                <span className="detail__value">{c.semester}</span>
              </div>
              <div className="detail__field">
                <span className="detail__label">Faculty</span>
                <span className="detail__value">{c.faculty}</span>
              </div>
              <div className="detail__field">
                <span className="detail__label">Enrolled</span>
                <span className="detail__value">{c.students} students</span>
              </div>
            </div>
            <div>
              <h4 className="detail__section-title">Enrolment strength</h4>
              <ProgressBar value={c.students} max={150} tone="indigo" showLabel size="lg" />
            </div>
            <ul className="detail__list">
              <li><span>Course type</span><strong>{c.type}</strong></li>
              <li><span>Delivery mode</span><strong>Offline · Classroom</strong></li>
              <li><span>Prerequisite</span><strong>Semester {c.semester - 1} core</strong></li>
            </ul>
          </div>
        )}
      />
    </>
  )
}

/* ------------------------------------------------------------------ */
/* Attendance                                                         */
/* ------------------------------------------------------------------ */

export function AttendancePage() {
  const toast = useToast()
  const [tab, setTab] = useState('sessions')
  const completed = ATTENDANCE_SESSIONS.filter((s) => s.status === 'Completed')
  const avg = completed.length
    ? (completed.reduce((s, r) => s + r.pct, 0) / completed.length).toFixed(1)
    : 0

  return (
    <div>
      <PageHeader
        title="Attendance"
        subtitle="Session-wise marking, defaulters and eligibility for end-semester exams."
        breadcrumb={[{ label: 'Academics' }, { label: 'Attendance' }]}
        actions={
          <>
            <Button variant="secondary" icon="download" onClick={() => toast.info('Attendance report exported')}>Export</Button>
            <Button icon="check" onClick={() => toast.success('Attendance marked for today’s sessions')}>Mark Attendance</Button>
          </>
        }
      />

      <div className="listpage__stats">
        <StatCard label="Sessions Today" value="3" icon="calendar" accent="indigo" hint="2 completed" />
        <StatCard label="Avg Attendance" value={`${avg}%`} icon="calendarCheck" accent="success" delta={1.4} />
        <StatCard label="Below 75%" value="12" icon="alert" accent="danger" hint="Students at risk" />
        <StatCard label="Scheduled" value="2" icon="clock" accent="warning" hint="Awaiting" />
      </div>

      <Card padded={false}>
        <div className="acad__tabbar">
          <Tabs
            tabs={[
              { id: 'sessions', label: 'Sessions', count: ATTENDANCE_SESSIONS.length },
              { id: 'defaulters', label: 'Defaulters', count: STUDENTS.filter((s) => s.attendance < 75).length },
            ]}
            active={tab}
            onChange={setTab}
          />
        </div>

        {tab === 'sessions' ? (
          <DataTable
            columns={[
              col.text('course', 'Course', { primary: true }),
              col.text('date', 'Date'),
              col.text('time', 'Time'),
              col.text('faculty', 'Faculty'),
              {
                key: 'present',
                header: 'Present / Total',
                render: (r) => (
                  <span className="cell-num">
                    {r.present} <em style={{ color: 'var(--text-subtle)' }}>/ {r.total}</em>
                  </span>
                ),
              },
              col.progress('pct', 'Attendance'),
              col.status('status'),
            ]}
            rows={ATTENDANCE_SESSIONS}
            rowKey={(r) => r.id}
          />
        ) : (
          <DataTable
            columns={[
              col.text('roll', 'Roll No', { primary: true }),
              col.text('name', 'Student'),
              col.badge('program', 'Programme', 'indigo'),
              col.badge('section', 'Section', 'neutral'),
              col.progress('attendance', 'Attendance'),
              col.number('cgpa', 'CGPA'),
              col.status('status'),
            ]}
            rows={STUDENTS.filter((s) => s.attendance < 75)}
            rowKey={(r) => r.id}
          />
        )}
      </Card>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Examinations                                                       */
/* ------------------------------------------------------------------ */

export function ExaminationsPage() {
  const toast = useToast()
  return (
    <ListPage
      title="Examinations"
      subtitle="Schedule, conduct and publish results across all programmes."
      breadcrumb={[{ label: 'Academics' }, { label: 'Examinations' }]}
      searchKeys="course type"
      searchPlaceholder="Search course or exam type…"
      entityName="examinations"
      filters={[
        { key: 'type', label: 'types', options: ['Mid-Term', 'End-Term', 'Assignment 3'].map((v) => ({ value: v, label: v })) },
        { key: 'status', label: 'status', options: ['Published', 'Scheduled'].map((v) => ({ value: v, label: v })) },
      ]}
      stats={[
        { label: 'Published', value: EXAMINATIONS.filter((e) => e.status === 'Published').length, icon: 'checkCircle', accent: 'success' },
        { label: 'Scheduled', value: EXAMINATIONS.filter((e) => e.status === 'Scheduled').length, icon: 'clock', accent: 'warning' },
        {
          label: 'Avg Score',
          value: `${Math.round(
            EXAMINATIONS.filter((e) => e.avg > 0).reduce((s, e) => s + (e.avg / e.max) * 100, 0) /
              EXAMINATIONS.filter((e) => e.avg > 0).length,
          )}%`,
          icon: 'percent',
          accent: 'indigo',
        },
        { label: 'Students Covered', value: '530', icon: 'users', accent: 'violet' },
      ]}
      actions={
        <>
          <Button variant="secondary" icon="download" onClick={() => toast.info('Results exported')}>Export</Button>
          <Button icon="plus" onClick={() => toast.success('New examination scheduled')}>Schedule Exam</Button>
        </>
      }
      columns={[
        col.text('course', 'Course', { primary: true }),
        col.badge('type', 'Type', 'indigo'),
        col.text('date', 'Date'),
        col.number('students', 'Students'),
        col.number('max', 'Max Marks'),
        {
          key: 'avg',
          header: 'Average',
          render: (r) => (
            <span className="cell-num">{r.avg ? `${r.avg} (${Math.round((r.avg / r.max) * 100)}%)` : '—'}</span>
          ),
        },
        {
          key: 'pass',
          header: 'Pass %',
          render: (r) => <span className="cell-num">{r.pass ? `${r.pass}%` : '—'}</span>,
        },
        col.status('status'),
      ]}
      rows={EXAMINATIONS}
      renderDetail={(e) => (
        <div className="detail">
          <div className="detail__grid">
            <div className="detail__field">
              <span className="detail__label">Course</span>
              <span className="detail__value">{e.course}</span>
            </div>
            <div className="detail__field">
              <span className="detail__label">Type</span>
              <span className="detail__value">{e.type}</span>
            </div>
            <div className="detail__field">
              <span className="detail__label">Date</span>
              <span className="detail__value">{e.date}</span>
            </div>
            <div className="detail__field">
              <span className="detail__label">Candidates</span>
              <span className="detail__value">{e.students}</span>
            </div>
          </div>
          {e.avg > 0 ? (
            <>
              <div>
                <h4 className="detail__section-title">Performance</h4>
                <ul className="detail__list">
                  <li><span>Average score</span><strong>{e.avg} / {e.max}</strong></li>
                  <li><span>Pass percentage</span><strong>{e.pass}%</strong></li>
                  <li><span>Students appeared</span><strong>{Math.round((e.students * e.pass) / 100)} of {e.students}</strong></li>
                </ul>
              </div>
              <ProgressBar value={e.avg} max={e.max} tone="indigo" showLabel size="lg" />
            </>
          ) : (
            <p className="acad__empty">Results will appear once the exam is conducted and evaluated.</p>
          )}
        </div>
      )}
    />
  )
}

/* ------------------------------------------------------------------ */
/* OBE                                                                */
/* ------------------------------------------------------------------ */

export function OBEPage() {
  const toast = useToast()
  return (
    <ListPage
      title="OBE Reports"
      subtitle="Programme outcome mapping, course outcomes and attainment levels."
      breadcrumb={[{ label: 'Academics' }, { label: 'OBE Reports' }]}
      searchKeys="course program"
      searchPlaceholder="Search course or programme…"
      entityName="OBE reports"
      filters={[
        { key: 'program', label: 'programmes', options: [...new Set(OBE_REPORTS.map((o) => o.program))].map((v) => ({ value: v, label: v })) },
        { key: 'level', label: 'levels', options: ['High', 'Medium'].map((v) => ({ value: v, label: v })) },
      ]}
      stats={[
        { label: 'Finalized', value: OBE_REPORTS.filter((o) => o.status === 'Finalized').length, icon: 'checkCircle', accent: 'success' },
        { label: 'Drafts', value: OBE_REPORTS.filter((o) => o.status === 'Draft').length, icon: 'file', accent: 'warning' },
        { label: 'Avg PO Attainment', value: (OBE_REPORTS.reduce((s, o) => s + o.po, 0) / OBE_REPORTS.length).toFixed(2), icon: 'target', accent: 'indigo' },
        { label: 'High Attainment', value: OBE_REPORTS.filter((o) => o.level === 'High').length, icon: 'trendingUp', accent: 'violet' },
      ]}
      actions={
        <>
          <Button variant="secondary" icon="download" onClick={() => toast.info('OBE report exported')}>Export</Button>
          <Button icon="plus" onClick={() => toast.success('New OBE mapping started')}>New Mapping</Button>
        </>
      }
      columns={[
        col.text('course', 'Course', { primary: true }),
        col.badge('program', 'Programme', 'indigo'),
        col.number('po', 'PO Attainment'),
        col.number('ps', 'PS Attainment'),
        col.number('co', 'CO Attainment'),
        col.badge('level', 'Level', 'neutral'),
        col.text('date', 'Updated'),
        col.status('status'),
      ]}
      rows={OBE_REPORTS}
      renderDetail={(o) => (
        <div className="detail">
          <div className="detail__grid">
            <div className="detail__field">
              <span className="detail__label">Course</span>
              <span className="detail__value">{o.course}</span>
            </div>
            <div className="detail__field">
              <span className="detail__label">Programme</span>
              <span className="detail__value">{o.program}</span>
            </div>
            <div className="detail__field">
              <span className="detail__label">Attainment Level</span>
              <span className="detail__value">{o.level}</span>
            </div>
            <div className="detail__field">
              <span className="detail__label">Last Updated</span>
              <span className="detail__value">{o.date}</span>
            </div>
          </div>
          <div>
            <h4 className="detail__section-title">Attainment against target (1.5)</h4>
            {[
              ['Programme Outcomes (PO)', o.po],
              ['Programme Specific Outcomes (PS)', o.ps],
              ['Course Outcomes (CO)', o.co],
            ].map(([label, val]) => (
              <div key={label} className="acad__obe-row">
                <span>{label}</span>
                <ProgressBar value={val} max={1.5} tone={val >= 1.3 ? 'success' : val >= 1.1 ? 'warning' : 'danger'} size="sm" showLabel />
              </div>
            ))}
          </div>
        </div>
      )}
    />
  )
}

/* ------------------------------------------------------------------ */
/* Feedback                                                           */
/* ------------------------------------------------------------------ */

export function FeedbackPage() {
  const toast = useToast()
  return (
    <ListPage
      title="Course Feedback"
      subtitle="Student satisfaction ratings and qualitative comments."
      breadcrumb={[{ label: 'Academics' }, { label: 'Feedback' }]}
      searchKeys="course faculty"
      searchPlaceholder="Search course or faculty…"
      entityName="feedback cycles"
      stats={[
        { label: 'Avg Rating', value: '4.4', icon: 'award', accent: 'violet', delta: 0.3 },
        { label: 'Responses', value: 298, icon: 'users', accent: 'indigo' },
        { label: 'Comments', value: 98, icon: 'messageSquare', accent: 'info' },
        { label: 'Open Cycles', value: 1, icon: 'clock', accent: 'warning' },
      ]}
      actions={<Button variant="secondary" icon="download" onClick={() => toast.info('Feedback exported')}>Export</Button>}
      columns={[
        col.text('course', 'Course', { primary: true }),
        col.text('faculty', 'Faculty'),
        col.number('responses', 'Responses'),
        {
          key: 'rating',
          header: 'Rating',
          render: (r) =>
            r.rating ? (
              <span className="acad__rating">
                <Icon name="award" size={13} /> {r.rating} / 5
              </span>
            ) : (
              '—'
            ),
        },
        col.number('comments', 'Comments'),
        col.text('date', 'Date'),
        col.status('status'),
      ]}
      rows={FEEDBACK}
      renderDetail={(f) => (
        <div className="detail">
          <div className="detail__grid">
            <div className="detail__field">
              <span className="detail__label">Course</span>
              <span className="detail__value">{f.course}</span>
            </div>
            <div className="detail__field">
              <span className="detail__label">Faculty</span>
              <span className="detail__value">{f.faculty}</span>
            </div>
            <div className="detail__field">
              <span className="detail__label">Responses</span>
              <span className="detail__value">{f.responses}</span>
            </div>
            <div className="detail__field">
              <span className="detail__label">Rating</span>
              <span className="detail__value">{f.rating ? `${f.rating} / 5` : 'Not available'}</span>
            </div>
          </div>
          {f.rating > 0 && <ProgressBar value={f.rating * 20} max={100} tone="violet" size="lg" showLabel />}
          <div>
            <h4 className="detail__section-title">Sample comments</h4>
            <ul className="acad__comments">
              <li>“Explains concepts clearly with real-time examples. Assignments are well designed.”</li>
              <li>“Course content is relevant to industry, though the pace was fast towards the end.”</li>
              <li>“More hands-on sessions would help bridge theory and practice.”</li>
            </ul>
          </div>
        </div>
      )}
    />
  )
}

/* ------------------------------------------------------------------ */
/* Timetable                                                          */
/* ------------------------------------------------------------------ */

export function TimetablePage() {
  const toast = useToast()
  const [day, setDay] = useState(TIMETABLE[0].day)

  const selected = TIMETABLE.find((d) => d.day === day) ?? TIMETABLE[0]

  return (
    <div>
      <PageHeader
        title="Timetable"
        subtitle="Weekly class schedule across all programmes and rooms."
        breadcrumb={[{ label: 'Academics' }, { label: 'Timetable' }]}
        actions={
          <>
            <Select
              value={day}
              onChange={setDay}
              options={TIMETABLE.map((d) => ({ value: d.day, label: d.day }))}
            />
            <Button variant="secondary" icon="download" onClick={() => toast.info('Timetable exported')}>Export</Button>
          </>
        }
      />

      <Card
        title={`${selected.day} schedule`}
        subtitle={`${selected.slots.length} classes scheduled`}
        action={
          <div className="acad__days">
            {TIMETABLE.map((d) => (
              <button
                key={d.day}
                className={`acad__day ${d.day === day ? 'is-active' : ''}`}
                onClick={() => setDay(d.day)}
              >
                {d.day.slice(0, 3)}
              </button>
            ))}
          </div>
        }
      >
        <ul className="acad__timetable">
          {selected.slots.map((s) => (
            <li key={s.time + s.course}>
              <span className="acad__tt-time">{s.time}</span>
              <span className="acad__tt-bar" />
              <div className="acad__tt-main">
                <strong>{s.course}</strong>
                <span>{s.faculty}</span>
              </div>
              <span className="acad__tt-room">
                <Icon name="mapPin" size={13} /> {s.room}
              </span>
            </li>
          ))}
          {selected.slots.length === 0 && <li className="acad__empty">No classes scheduled.</li>}
        </ul>
      </Card>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Students                                                           */
/* ------------------------------------------------------------------ */

export function StudentsPage() {
  const toast = useToast()
  return (
    <ListPage
      title="Students"
      subtitle="Enrolment register with academic standing and fee status."
      breadcrumb={[{ label: 'Academics' }, { label: 'Students' }]}
      searchKeys="name roll program email"
      searchPlaceholder="Search by name, roll number or email…"
      entityName="students"
      filters={[
        { key: 'program', label: 'programmes', options: [...new Set(STUDENTS.map((s) => s.program))].map((v) => ({ value: v, label: v })) },
        { key: 'status', label: 'status', options: ['Active', 'At Risk'].map((v) => ({ value: v, label: v })) },
        { key: 'feeStatus', label: 'fee status', options: ['Paid', 'Pending', 'Overdue'].map((v) => ({ value: v, label: v })) },
      ]}
      stats={[
        { label: 'Total Students', value: 530, icon: 'users', accent: 'indigo', delta: 4.2 },
        { label: 'Avg CGPA', value: (STUDENTS.reduce((s, x) => s + x.cgpa, 0) / STUDENTS.length).toFixed(2), icon: 'award', accent: 'violet' },
        { label: 'At Risk', value: STUDENTS.filter((s) => s.status === 'At Risk').length, icon: 'alert', accent: 'danger' },
        { label: 'Hosters', value: STUDENTS.filter((s) => s.hostel !== 'Day Scholar').length, icon: 'bed', accent: 'info' },
      ]}
      actions={
        <>
          <Button variant="secondary" icon="download" onClick={() => toast.info('Student register exported')}>Export</Button>
          <Button icon="plus" onClick={() => toast.success('Student admission form opened')}>Add Student</Button>
        </>
      }
      columns={[
        col.text('roll', 'Roll No', { primary: true }),
        col.text('name', 'Student'),
        col.badge('program', 'Programme', 'indigo'),
        col.badge('section', 'Section', 'neutral'),
        col.number('sem', 'Sem'),
        col.progress('attendance', 'Attendance'),
        col.number('cgpa', 'CGPA'),
        col.status('feeStatus'),
      ]}
      rows={STUDENTS}
      renderDetail={(s) => (
        <div className="detail">
          <div className="detail__grid">
            <div className="detail__field">
              <span className="detail__label">Roll Number</span>
              <span className="detail__value mono">{s.roll}</span>
            </div>
            <div className="detail__field">
              <span className="detail__label">Programme</span>
              <span className="detail__value">{s.program}</span>
            </div>
            <div className="detail__field">
              <span className="detail__label">Semester</span>
              <span className="detail__value">{s.sem}</span>
            </div>
            <div className="detail__field">
              <span className="detail__label">CGPA</span>
              <span className="detail__value">{s.cgpa}</span>
            </div>
            <div className="detail__field">
              <span className="detail__label">Email</span>
              <span className="detail__value">{s.email}</span>
            </div>
            <div className="detail__field">
              <span className="detail__label">Phone</span>
              <span className="detail__value">{s.phone}</span>
            </div>
            <div className="detail__field">
              <span className="detail__label">Hostel</span>
              <span className="detail__value">{s.hostel}</span>
            </div>
            <div className="detail__field">
              <span className="detail__label">Fee Status</span>
              <span className="detail__value">{s.feeStatus}</span>
            </div>
          </div>
          <div>
            <h4 className="detail__section-title">Attendance</h4>
            <ProgressBar value={s.attendance} max={100} tone={s.attendance >= 85 ? 'success' : s.attendance >= 75 ? 'warning' : 'danger'} size="lg" showLabel />
          </div>
        </div>
      )}
    />
  )
}

/* ------------------------------------------------------------------ */
/* Faculty (used within Academics)                                    */
/* ------------------------------------------------------------------ */

export function FacultyPage() {
  const toast = useToast()
  return (
    <ListPage
      title="Faculty"
      subtitle="Teaching staff, workloads and course assignments."
      breadcrumb={[{ label: 'Academics' }, { label: 'Faculty' }]}
      searchKeys="name dept designation email"
      searchPlaceholder="Search faculty…"
      entityName="faculty"
      filters={[
        { key: 'dept', label: 'departments', options: [...new Set(FACULTY.map((f) => f.dept))].map((v) => ({ value: v, label: v })) },
      ]}
      stats={[
        { label: 'Faculty', value: 128, icon: 'academic', accent: 'indigo' },
        { label: 'Departments', value: new Set(FACULTY.map((f) => f.dept)).size, icon: 'building', accent: 'violet' },
        { label: 'Avg Courses / Faculty', value: (FACULTY.reduce((s, f) => s + f.courses, 0) / FACULTY.length).toFixed(1), icon: 'book', accent: 'info' },
        { label: 'On Sabbatical', value: FACULTY.filter((f) => f.status !== 'Active').length, icon: 'clock', accent: 'warning' },
      ]}
      actions={<Button variant="secondary" icon="download" onClick={() => toast.info('Faculty list exported')}>Export</Button>}
      columns={[
        col.text('name', 'Name', { primary: true }),
        col.text('designation', 'Designation'),
        col.badge('dept', 'Department', 'indigo'),
        col.number('courses', 'Courses'),
        col.number('students', 'Students'),
        col.text('email', 'Email'),
        col.status('status'),
      ]}
      rows={FACULTY}
    />
  )
}
