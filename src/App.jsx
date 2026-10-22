import { useMemo } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'

import AppShell from './components/layout/AppShell'
import Login from './components/Login'
import { useAuth } from './context/AuthContext'

import Dashboard from './pages/Dashboard'
import MedhaPage from './pages/MedhaPage'

import { AcademicsOverview, ProgramsPage } from './pages/academics/AcademicsOverview'
import {
  CoursesPage,
  AttendancePage,
  ExaminationsPage,
  OBEPage,
  FeedbackPage,
  TimetablePage,
  StudentsPage,
  FacultyPage,
} from './pages/academics/AcademicsPages'

import {
  FinanceOverview,
  FeeStructurePage,
  PaymentsPage,
  ScholarshipsPage,
  ExpensesPage,
  PayrollPage,
} from './pages/finance/FinancePages'

import {
  OperationsOverview,
  HostelPage,
  TransportPage,
  LibraryPage,
  HelpdeskPage,
  PlacementsPage,
  VisitorsPage,
} from './pages/operations/OperationsPages'

import {
  EnrollmentOverview,
  EnquiriesPage,
  ApplicationsPage,
  CounsellingPage,
} from './pages/enrollment/EnrollmentPages'

import {
  PeopleOverview,
  DirectoryPage,
  OnboardingPage,
  StaffAttendancePage,
  LeavePage,
  AppraisalPage,
  ResearchPage,
} from './pages/people/PeoplePages'

import {
  ProfilePage,
  NoticesPage,
  ReportsPage,
  NotFoundPage,
  ForbiddenPage,
} from './pages/WorkspacePages'

import {
  PortalDashboard,
  MyCourses,
  MyAttendance,
  MyResults,
  MyFees,
  MyAssignments,
  MyLibrary,
  MyHostel,
  MyTimetable,
} from './pages/portal/PortalPages'

import { FacultyPortal, FacultyStudents, FacultyEvaluation } from './pages/faculty/FacultyPages'

/* ------------------------------------------------------------------ */
/* Access control                                                      */
/* ------------------------------------------------------------------ */

/** Modules and the roles allowed to open them. */
const ROLE_SCOPES = {
  '/app/dashboard': ['admin', 'faculty', 'finance', 'staff'],
  '/app/faculty': ['admin', 'faculty'],
  '/app/academics': ['admin', 'faculty', 'staff'],
  '/app/finance': ['admin', 'finance'],
  '/app/operations': ['admin', 'staff', 'faculty'],
  '/app/enrollment': ['admin', 'staff'],
  '/app/people': ['admin', 'staff', 'faculty'],
  '/app/reports': ['admin', 'finance', 'staff'],
  '/app/portal': ['student'],
}

/** Human-readable title shown in the top bar for every route. */
const ROUTE_TITLES = [
  ['/app/portal/timetable', 'Timetable'],
  ['/app/portal/assignments', 'Assignments'],
  ['/app/portal/attendance', 'Attendance'],
  ['/app/portal/results', 'Results & Marks'],
  ['/app/portal/fees', 'Fees & Dues'],
  ['/app/portal/library', 'Library'],
  ['/app/portal/hostel', 'Hostel'],
  ['/app/portal/courses', 'My Courses'],
  ['/app/portal', 'My Dashboard'],
  ['/app/faculty/students', 'My Students'],
  ['/app/faculty/evaluation', 'Evaluation'],
  ['/app/faculty', 'Faculty Portal'],
  ['/app/academics/courses', 'Programmes & Courses'],
  ['/app/academics/programs', 'Programmes'],
  ['/app/academics/attendance', 'Attendance'],
  ['/app/academics/examinations', 'Examinations'],
  ['/app/academics/obe', 'OBE Reports'],
  ['/app/academics/feedback', 'Course Feedback'],
  ['/app/academics/timetable', 'Timetable'],
  ['/app/academics/students', 'Students'],
  ['/app/academics/faculty', 'Faculty'],
  ['/app/academics', 'Academics'],
  ['/app/finance/fees', 'Fee Structure'],
  ['/app/finance/payments', 'Fee Payments'],
  ['/app/finance/scholarships', 'Scholarships'],
  ['/app/finance/expenses', 'Expenses'],
  ['/app/finance/payroll', 'Payroll'],
  ['/app/finance', 'Finance'],
  ['/app/operations/hostel', 'Hostel'],
  ['/app/operations/transport', 'Transport'],
  ['/app/operations/library', 'Library'],
  ['/app/operations/helpdesk', 'Helpdesk'],
  ['/app/operations/placements', 'Placements'],
  ['/app/operations/visitors', 'Visitors'],
  ['/app/operations', 'Operations'],
  ['/app/enrollment/enquiries', 'Enquiries'],
  ['/app/enrollment/applications', 'Applications'],
  ['/app/enrollment/counselling', 'Counselling'],
  ['/app/enrollment', 'Enrollment'],
  ['/app/people/directory', 'Staff Directory'],
  ['/app/people/onboarding', 'Onboarding'],
  ['/app/people/attendance', 'Staff Attendance'],
  ['/app/people/leave', 'Leave Management'],
  ['/app/people/appraisal', 'Appraisals'],
  ['/app/people/research', 'Research Profiles'],
  ['/app/people', 'People'],
  ['/app/medha', 'Medha AI'],
  ['/app/profile', 'My Profile'],
  ['/app/notices', 'Notices'],
  ['/app/reports', 'Reports'],
  ['/app/dashboard', 'Dashboard'],
]

function titleFor(pathname) {
  const match = ROUTE_TITLES.find(([prefix]) => pathname === prefix || pathname.startsWith(prefix + '/'))
  return match ? match[1] : 'CampX'
}

/* ------------------------------------------------------------------ */
/* Guards                                                              */
/* ------------------------------------------------------------------ */

function useAllowedRoles(pathname) {
  return useMemo(() => {
    const scope = Object.keys(ROLE_SCOPES).find(
      (prefix) => pathname === prefix || pathname.startsWith(prefix + '/'),
    )
    return scope ? ROLE_SCOPES[scope] : null
  }, [pathname])
}

function RequireRole({ children }) {
  const { user } = useAuth()
  const location = useLocation()
  const allowed = useAllowedRoles(location.pathname)

  if (!allowed) return children
  if (!user || !allowed.includes(user.role)) return <ForbiddenPage />
  return children
}

/** Sends each role to the landing page that makes sense for them. */
function RoleHome() {
  const { user } = useAuth()
  if (!user) return null
  if (user.role === 'student') return <Navigate to="/app/portal" replace />
  if (user.role === 'faculty') return <Navigate to="/app/faculty" replace />
  return <Navigate to="/app/dashboard" replace />
}

/** Blocks authenticated users from re-visiting the login screen. */
function LoginRoute() {
  const { user, status } = useAuth()
  if (status === 'loading') return null
  if (user) return <Navigate to="/app" replace />
  return <Login />
}

function Protected({ children }) {
  const { user, status } = useAuth()
  const location = useLocation()

  if (status === 'loading') {
    return (
      <div className="app-boot">
        <span className="app-boot__mark">CX</span>
        <span className="app-boot__text">Loading CampX…</span>
      </div>
    )
  }

  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />

  return (
    <AppShell title={titleFor(location.pathname)}>
      <RequireRole>{children}</RequireRole>
    </AppShell>
  )
}

/* ------------------------------------------------------------------ */
/* Routes                                                              */
/* ------------------------------------------------------------------ */

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/app" replace />} />
      <Route path="/login" element={<LoginRoute />} />

      <Route path="/app" element={<Protected><RoleHome /></Protected>} />

      {/* Overview */}
      <Route path="/app/dashboard" element={<Protected><Dashboard /></Protected>} />
      <Route path="/app/medha" element={<Protected><MedhaPage /></Protected>} />

      {/* Faculty portal */}
      <Route path="/app/faculty" element={<Protected><FacultyPortal /></Protected>} />
      <Route path="/app/faculty/students" element={<Protected><FacultyStudents /></Protected>} />
      <Route path="/app/faculty/evaluation" element={<Protected><FacultyEvaluation /></Protected>} />

      {/* Academics */}
      <Route path="/app/academics" element={<Protected><AcademicsOverview /></Protected>} />
      <Route path="/app/academics/courses" element={<Protected><CoursesPage /></Protected>} />
      <Route path="/app/academics/programs" element={<Protected><ProgramsPage /></Protected>} />
      <Route path="/app/academics/attendance" element={<Protected><AttendancePage /></Protected>} />
      <Route path="/app/academics/examinations" element={<Protected><ExaminationsPage /></Protected>} />
      <Route path="/app/academics/obe" element={<Protected><OBEPage /></Protected>} />
      <Route path="/app/academics/feedback" element={<Protected><FeedbackPage /></Protected>} />
      <Route path="/app/academics/timetable" element={<Protected><TimetablePage /></Protected>} />
      <Route path="/app/academics/students" element={<Protected><StudentsPage /></Protected>} />
      <Route path="/app/academics/faculty" element={<Protected><FacultyPage /></Protected>} />

      {/* Finance */}
      <Route path="/app/finance" element={<Protected><FinanceOverview /></Protected>} />
      <Route path="/app/finance/fees" element={<Protected><FeeStructurePage /></Protected>} />
      <Route path="/app/finance/payments" element={<Protected><PaymentsPage /></Protected>} />
      <Route path="/app/finance/scholarships" element={<Protected><ScholarshipsPage /></Protected>} />
      <Route path="/app/finance/expenses" element={<Protected><ExpensesPage /></Protected>} />
      <Route path="/app/finance/payroll" element={<Protected><PayrollPage /></Protected>} />

      {/* Operations */}
      <Route path="/app/operations" element={<Protected><OperationsOverview /></Protected>} />
      <Route path="/app/operations/hostel" element={<Protected><HostelPage /></Protected>} />
      <Route path="/app/operations/transport" element={<Protected><TransportPage /></Protected>} />
      <Route path="/app/operations/library" element={<Protected><LibraryPage /></Protected>} />
      <Route path="/app/operations/helpdesk" element={<Protected><HelpdeskPage /></Protected>} />
      <Route path="/app/operations/placements" element={<Protected><PlacementsPage /></Protected>} />
      <Route path="/app/operations/visitors" element={<Protected><VisitorsPage /></Protected>} />

      {/* Enrollment */}
      <Route path="/app/enrollment" element={<Protected><EnrollmentOverview /></Protected>} />
      <Route path="/app/enrollment/enquiries" element={<Protected><EnquiriesPage /></Protected>} />
      <Route path="/app/enrollment/applications" element={<Protected><ApplicationsPage /></Protected>} />
      <Route path="/app/enrollment/counselling" element={<Protected><CounsellingPage /></Protected>} />

      {/* People */}
      <Route path="/app/people" element={<Protected><PeopleOverview /></Protected>} />
      <Route path="/app/people/directory" element={<Protected><DirectoryPage /></Protected>} />
      <Route path="/app/people/onboarding" element={<Protected><OnboardingPage /></Protected>} />
      <Route path="/app/people/attendance" element={<Protected><StaffAttendancePage /></Protected>} />
      <Route path="/app/people/leave" element={<Protected><LeavePage /></Protected>} />
      <Route path="/app/people/appraisal" element={<Protected><AppraisalPage /></Protected>} />
      <Route path="/app/people/research" element={<Protected><ResearchPage /></Protected>} />

      {/* Workspace */}
      <Route path="/app/profile" element={<Protected><ProfilePage /></Protected>} />
      <Route path="/app/notices" element={<Protected><NoticesPage /></Protected>} />
      <Route path="/app/reports" element={<Protected><ReportsPage /></Protected>} />

      {/* Student portal */}
      <Route path="/app/portal" element={<Protected><PortalDashboard /></Protected>} />
      <Route path="/app/portal/courses" element={<Protected><MyCourses /></Protected>} />
      <Route path="/app/portal/attendance" element={<Protected><MyAttendance /></Protected>} />
      <Route path="/app/portal/results" element={<Protected><MyResults /></Protected>} />
      <Route path="/app/portal/fees" element={<Protected><MyFees /></Protected>} />
      <Route path="/app/portal/assignments" element={<Protected><MyAssignments /></Protected>} />
      <Route path="/app/portal/library" element={<Protected><MyLibrary /></Protected>} />
      <Route path="/app/portal/hostel" element={<Protected><MyHostel /></Protected>} />
      <Route path="/app/portal/timetable" element={<Protected><MyTimetable /></Protected>} />

      <Route path="*" element={<Protected><NotFoundPage /></Protected>} />
    </Routes>
  )
}
