import {
  dashboard,
  academics,
  finance,
  operations,
  enrollment,
  people,
  medha,
  book,
  user,
  clipboard,
  calendar,
  library,
  bed,
  bus,
  help,
  award,
  layers,
  gift,
  wallet,
  target,
  trendingUp,
  phone,
  list,
} from '../components/ui/Icon'

/**
 * Sidebar navigation tree.
 * `roles` limits visibility; omitting it means the item is visible to all roles.
 */
export const NAV_SECTIONS = [
  {
    id: 'overview',
    label: 'Overview',
    items: [
      { id: 'dashboard', label: 'Dashboard', to: '/app/dashboard', icon: dashboard, roles: ['admin', 'faculty', 'finance', 'staff'] },
      { id: 'medha-home', label: 'Medha AI', to: '/app/medha', icon: medha, accent: true, roles: ['admin', 'faculty', 'finance', 'staff', 'student'] },
    ],
  },
  {
    id: 'systems',
    label: 'Campus Systems',
    items: [
      {
        id: 'academics',
        label: 'Academics',
        to: '/app/academics',
        icon: academics,
        roles: ['admin', 'faculty', 'staff'],
        children: [
          { id: 'ac-overview', label: 'Overview', to: '/app/academics' },
          { id: 'ac-programs', label: 'Programs & Courses', to: '/app/academics/courses' },
          { id: 'ac-attendance', label: 'Attendance', to: '/app/academics/attendance' },
          { id: 'ac-exams', label: 'Examinations', to: '/app/academics/examinations' },
          { id: 'ac-obe', label: 'OBE Reports', to: '/app/academics/obe' },
          { id: 'ac-feedback', label: 'Feedback', to: '/app/academics/feedback' },
          { id: 'ac-timetable', label: 'Timetable', to: '/app/academics/timetable' },
          { id: 'ac-students', label: 'Students', to: '/app/academics/students' },
        ],
      },
      {
        id: 'finance',
        label: 'Finance',
        to: '/app/finance',
        icon: finance,
        roles: ['admin', 'finance'],
        children: [
          { id: 'fin-overview', label: 'Overview', to: '/app/finance' },
          { id: 'fin-fees', label: 'Fee Structure', to: '/app/finance/fees' },
          { id: 'fin-payments', label: 'Fee Payments', to: '/app/finance/payments' },
          { id: 'fin-scholarships', label: 'Scholarships', to: '/app/finance/scholarships' },
          { id: 'fin-expenses', label: 'Expenses', to: '/app/finance/expenses' },
          { id: 'fin-payroll', label: 'Payroll', to: '/app/finance/payroll' },
        ],
      },
      {
        id: 'operations',
        label: 'Operations',
        to: '/app/operations',
        icon: operations,
        roles: ['admin', 'staff', 'faculty'],
        children: [
          { id: 'ops-overview', label: 'Overview', to: '/app/operations' },
          { id: 'ops-hostel', label: 'Hostel', to: '/app/operations/hostel' },
          { id: 'ops-transport', label: 'Transport', to: '/app/operations/transport' },
          { id: 'ops-library', label: 'Library', to: '/app/operations/library' },
          { id: 'ops-helpdesk', label: 'Helpdesk', to: '/app/operations/helpdesk' },
          { id: 'ops-placements', label: 'Placements', to: '/app/operations/placements' },
          { id: 'ops-visitors', label: 'Visitors', to: '/app/operations/visitors' },
        ],
      },
      {
        id: 'enrollment',
        label: 'Enrollment',
        to: '/app/enrollment',
        icon: enrollment,
        roles: ['admin', 'staff'],
        children: [
          { id: 'enr-overview', label: 'Overview', to: '/app/enrollment' },
          { id: 'enr-enquiries', label: 'Enquiries', to: '/app/enrollment/enquiries' },
          { id: 'enr-applications', label: 'Applications', to: '/app/enrollment/applications' },
          { id: 'enr-counselling', label: 'Counselling', to: '/app/enrollment/counselling' },
        ],
      },
      {
        id: 'people',
        label: 'People',
        to: '/app/people',
        icon: people,
        roles: ['admin', 'staff', 'faculty'],
        children: [
          { id: 'ppl-overview', label: 'Overview', to: '/app/people' },
          { id: 'ppl-directory', label: 'Staff Directory', to: '/app/people/directory' },
          { id: 'ppl-onboarding', label: 'Onboarding', to: '/app/people/onboarding' },
          { id: 'ppl-attendance', label: 'Staff Attendance', to: '/app/people/attendance' },
          { id: 'ppl-leave', label: 'Leave Management', to: '/app/people/leave' },
          { id: 'ppl-appraisal', label: 'Appraisals', to: '/app/people/appraisal' },
          { id: 'ppl-research', label: 'Research Profiles', to: '/app/people/research' },
        ],
      },
    ],
  },
  {
    id: 'workspace',
    label: 'My Workspace',
    items: [
      { id: 'my-profile', label: 'My Profile', to: '/app/profile', icon: user, roles: ['admin', 'faculty', 'finance', 'staff', 'student'] },
      { id: 'my-notices', label: 'Notices', to: '/app/notices', icon: list, roles: ['admin', 'faculty', 'finance', 'staff', 'student'] },
      { id: 'my-reports', label: 'Reports', to: '/app/reports', icon: trendingUp, roles: ['admin', 'finance', 'staff'] },
    ],
  },
]

/** Student-only portal navigation. */
export const STUDENT_NAV = [
  { id: 'st-dashboard', label: 'My Dashboard', to: '/app/portal', icon: dashboard },
  { id: 'st-courses', label: 'My Courses', to: '/app/portal/courses', icon: book },
  { id: 'st-attendance', label: 'Attendance', to: '/app/portal/attendance', icon: calendar },
  { id: 'st-results', label: 'Results & Marks', to: '/app/portal/results', icon: trendingUp },
  { id: 'st-fees', label: 'Fees & Dues', to: '/app/portal/fees', icon: wallet },
  { id: 'st-assignments', label: 'Assignments', to: '/app/portal/assignments', icon: clipboard },
  { id: 'st-library', label: 'Library', to: '/app/portal/library', icon: library },
  { id: 'st-hostel', label: 'Hostel', to: '/app/portal/hostel', icon: bed },
  { id: 'st-timetable', label: 'Timetable', to: '/app/portal/timetable', icon: list },
]

/** Icon used for the module tiles on the dashboard. */
export const MODULE_ICONS = {
  Academics: academics,
  Finance: finance,
  Operations: operations,
  Enrollment: enrollment,
  People: people,
  'Medha AI': medha,
}

export const MODULE_TILES = [
  { id: 'academics', label: 'Academics', to: '/app/academics', icon: academics, tone: 'indigo', blurb: 'Courses, attendance, exams & OBE' },
  { id: 'finance', label: 'Finance', to: '/app/finance', icon: finance, tone: 'violet', blurb: 'Fees, scholarships, payroll' },
  { id: 'operations', label: 'Operations', to: '/app/operations', icon: operations, tone: 'success', blurb: 'Hostel, transport, library, helpdesk' },
  { id: 'enrollment', label: 'Enrollment', to: '/app/enrollment', icon: enrollment, tone: 'info', blurb: 'Enquiries, applications, admissions' },
  { id: 'people', label: 'People', to: '/app/people', icon: people, tone: 'warning', blurb: 'Staff, leave, appraisals, research' },
  { id: 'medha', label: 'Medha AI', to: '/app/medha', icon: medha, tone: 'danger', blurb: 'Ask anything about your campus' },
]
