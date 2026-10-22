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
  Tabs,
} from '../../components/ui'
import { col } from '../../components/ListPage'
import { useToast } from '../../context/ToastContext'
import { FACULTY_TODAY, FACULTY, COURSES, FEEDBACK } from '../../data/mock'
import './faculty.css'

/* ------------------------------------------------------------------ */
/* Faculty landing                                                     */
/* ------------------------------------------------------------------ */

export function FacultyPortal() {
  const toast = useToast()
  const me = FACULTY[0]
  const myCourses = COURSES.filter((c) => c.faculty === me?.name || c.faculty === 'Dr. S. Iyer' || c.faculty === 'Prof. K. Nair')

  return (
    <div>
      <PageHeader
        title={`Good morning, ${(me?.name ?? 'Faculty').split(' ').slice(-1)[0]}`}
        subtitle={`${me?.designation ?? 'Faculty'} · ${me?.dept ?? 'CSE'} · Teaching load ${myCourses.length} courses`}
        actions={
          <>
            <Button variant="secondary" icon="calendar" onClick={() => toast.info('Academic calendar opened')}>
              Calendar
            </Button>
            <Button icon="plus" onClick={() => toast.info('New announcement composer opened')}>
              Announce
            </Button>
          </>
        }
      />

      <div className="listpage__stats">
        <StatCard label="Classes Today" value={FACULTY_TODAY.classes} icon="calendar" accent="indigo" hint="First at 09:00" />
        <StatCard label="Students" value={FACULTY_TODAY.students} icon="users" accent="violet" />
        <StatCard label="Pending Evaluations" value={FACULTY_TODAY.pendingEvaluations} icon="clipboard" accent="warning" />
        <StatCard label="Courses" value={myCourses.length} icon="book" accent="success" />
      </div>

      <div className="ptr__grid">
        <Card title="Today's classes" subtitle="Wednesday, 22 October" padded={false}>
          <ul className="fac__today">
            {FACULTY_TODAY.upcoming.map((c) => (
              <li key={c.time}>
                <span className="fac__time">{c.time}</span>
                <span className="fac__bar" />
                <div className="fac__main">
                  <strong>{c.course}</strong>
                  <span>{c.students} students · Room {c.room}</span>
                </div>
                <Button size="sm" variant="secondary" onClick={() => toast.info(`Opening ${c.course} roster`)}>
                  Roster
                </Button>
              </li>
            ))}
          </ul>
        </Card>

        <Card title="Tasks pending" subtitle="Ordered by urgency" padded={false}>
          <ul className="fac__tasks">
            {FACULTY_TODAY.pendingTasks.map((t) => (
              <li key={t.id}>
                <span className={`fac__prio fac__prio--${t.priority.toLowerCase()}`}>
                  <Icon name={t.priority === 'High' ? 'alert' : 'clock'} size={14} />
                </span>
                <div className="fac__task-main">
                  <strong>{t.label}</strong>
                  <span>
                    {t.course} · due {t.due}
                  </span>
                </div>
                <Badge tone={t.priority === 'High' ? 'danger' : 'warning'}>{t.priority}</Badge>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <div className="ptr__grid">
        <Card title="My courses" subtitle="Current semester load" padded={false}>
          <DataTable
            columns={[
              col.text('code', 'Code', { primary: true }),
              col.text('name', 'Course'),
              col.number('credits', 'Credits'),
              col.number('students', 'Students'),
              col.badge('type', 'Type', 'indigo'),
            ]}
            rows={myCourses}
          />
        </Card>

        <Card title="Student feedback" subtitle="Latest published ratings">
          <ul className="fac__feedback">
            {FEEDBACK.filter((f) => f.responses > 0).map((f) => (
              <li key={f.id}>
                <div className="fac__fb-head">
                  <span className="mono">{f.course}</span>
                  <strong>{f.rating.toFixed(1)} / 5</strong>
                </div>
                <ProgressBar value={f.rating} max={5} tone="success" size="sm" />
                <span className="fac__fb-meta">{f.responses} responses · {f.comments} comments</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Faculty — my students                                               */
/* ------------------------------------------------------------------ */

export function FacultyStudents() {
  const toast = useToast()
  const [tab, setTab] = useState('sections')

  const sections = [
    { id: 'SEC-01', code: 'CS401', name: 'Machine Learning', semester: 7, students: 132, avg: 87, credits: 4, attendance: 89 },
    { id: 'SEC-02', code: 'CS402', name: 'Compiler Design', semester: 7, students: 128, avg: 84, credits: 4, attendance: 86 },
    { id: 'SEC-03', code: 'CS405', name: 'Elective — Cyber Security', semester: 7, students: 96, avg: 81, credits: 3, attendance: 78 },
  ]

  const students = [
    { id: '21CS042', name: 'Priya Sharma', roll: '21CS042', section: 'CSE-A', attendance: 92, cgpa: 8.9, status: 'Active' },
    { id: '21CS018', name: 'Arjun Mehta', roll: '21CS018', section: 'CSE-A', attendance: 78, cgpa: 7.4, status: 'Active' },
    { id: '21CS061', name: 'Nithya Ramesh', roll: '21CS061', section: 'CSE-A', attendance: 69, cgpa: 6.9, status: 'At Risk' },
    { id: '21CS074', name: 'Karthik Varma', roll: '21CS074', section: 'CSE-B', attendance: 85, cgpa: 8.1, status: 'Active' },
    { id: '21CS088', name: 'Ritu Das', roll: '21CS088', section: 'CSE-B', attendance: 95, cgpa: 9.4, status: 'Active' },
  ]

  return (
    <div>
      <PageHeader
        title="My Students"
        subtitle="Sections and learners assigned to you"
        actions={
          <Button variant="secondary" icon="download" onClick={() => toast.info('Attendance sheet exported')}>
            Export Sheet
          </Button>
        }
      />

      <div className="listpage__stats">
        <StatCard label="Sections" value={sections.length} icon="layers" accent="indigo" />
        <StatCard label="Students" value={sections.reduce((s, x) => s + x.students, 0)} icon="users" accent="violet" />
        <StatCard label="Avg Attendance" value="84%" icon="calendarCheck" accent="success" />
        <StatCard label="Below 75%" value={1} icon="alert" accent="danger" hint="Needs attention" />
      </div>

      <Card padded={false}>
        <div className="ptr__tabbar">
          <Tabs
            tabs={[
              { id: 'sections', label: 'Sections', count: sections.length },
              { id: 'students', label: 'Students', count: students.length },
            ]}
            active={tab}
            onChange={setTab}
          />
        </div>

        {tab === 'sections' ? (
          <DataTable
            columns={[
              col.text('code', 'Code', { primary: true }),
              col.text('name', 'Course'),
              col.number('semester', 'Semester'),
              col.number('students', 'Students'),
              col.progress('attendance', 'Attendance'),
              col.number('avg', 'Avg Marks'),
            ]}
            rows={sections}
          />
        ) : (
          <DataTable
            columns={[
              col.text('roll', 'Roll No', { primary: true }),
              col.text('name', 'Student'),
              col.text('section', 'Section'),
              col.progress('attendance', 'Attendance'),
              col.number('cgpa', 'CGPA'),
              col.status('status'),
            ]}
            rows={students}
          />
        )}
      </Card>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Faculty — evaluation                                                */
/* ------------------------------------------------------------------ */

export function FacultyEvaluation() {
  const toast = useToast()

  const submissions = [
    { id: 'AS-101-1', ref: 'AS-101', course: 'CS401', title: 'CNN architectures from scratch', student: 'Priya Sharma', submitted: '2026-10-21', marks: null, total: 20, status: 'Pending' },
    { id: 'AS-101-2', ref: 'AS-101', course: 'CS401', title: 'CNN architectures from scratch', student: 'Arjun Mehta', submitted: '2026-10-21', marks: null, total: 20, status: 'Pending' },
    { id: 'AS-102-1', ref: 'AS-102', course: 'CS402', title: 'Lexer & parser assignment', student: 'Nithya Ramesh', submitted: '2026-10-20', marks: 16, total: 20, status: 'Graded' },
    { id: 'AS-104-1', ref: 'AS-104', course: 'CS405', title: 'Threat modelling worksheet', student: 'Ritu Das', submitted: '2026-10-19', marks: 13, total: 15, status: 'Graded' },
  ]

  return (
    <div>
      <PageHeader
        title="Evaluation"
        subtitle="Grade submissions and upload marks"
        actions={
          <Button icon="upload" onClick={() => toast.info('Bulk marks upload opened')}>
            Upload Marks
          </Button>
        }
      />

      <div className="listpage__stats">
        <StatCard label="Pending" value={submissions.filter((s) => s.status === 'Pending').length} icon="clock" accent="warning" />
        <StatCard label="Graded" value={submissions.filter((s) => s.status === 'Graded').length} icon="checkCircle" accent="success" />
        <StatCard label="Submissions" value={submissions.length} icon="clipboard" accent="indigo" />
        <StatCard label="Classes" value={3} icon="layers" accent="violet" />
      </div>

      <Card title="Submissions" subtitle="Across all your courses" padded={false}>
        <DataTable
          columns={[
            col.text('ref', 'Ref', { primary: true }),
            col.text('title', 'Assignment'),
            col.text('student', 'Student'),
            col.badge('course', 'Course', 'indigo'),
            col.text('submitted', 'Submitted'),
            col.number('total', 'Max'),
            {
              key: 'marks',
              header: 'Marks',
              render: (r) =>
                r.marks != null ? (
                  <strong style={{ color: 'var(--success-600)' }}>{r.marks}</strong>
                ) : (
                  <Button size="sm" onClick={() => toast.info(`Grading ${r.ref} for ${r.student}`)}>
                    Grade
                  </Button>
                ),
            },
            col.status('status'),
          ]}
          rows={submissions}
        />
      </Card>
    </div>
  )
}
