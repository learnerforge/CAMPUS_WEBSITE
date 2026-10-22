/**
 * Mock data for the CampX portal replica.
 * Mirrors the shape returned by the CampX REST services.
 */

export const INSTITUTION = {
  name: 'MAHATMA GANDHI INSTITUTE OF TECHNOLOGY',
  shortName: 'MGIT',
  location: 'Gandipet, Hyderabad, Telangana 500003',
  establishment: 2001,
  accreditation: 'NBA Accredited · NAAC A++ · ISO 27001',
  logoText: 'MGIT',
}

/* ------------------------------------------------------------------ */
/* Academics                                                          */
/* ------------------------------------------------------------------ */

export const ACADEMIC_YEARS = [
  { id: '2025-26', label: 'Academic Year 2025-26', status: 'active' },
  { id: '2024-25', label: 'Academic Year 2024-25', status: 'archived' },
  { id: '2023-24', label: 'Academic Year 2023-24', status: 'archived' },
]

export const PROGRAMS = [
  { id: 'CSE', code: 'CSE', name: 'Computer Science & Engineering', seats: 120, filled: 118, dept: 'CSE' },
  { id: 'ECE', code: 'ECE', name: 'Electronics & Communication', seats: 120, filled: 112, dept: 'ECE' },
  { id: 'ME', code: 'ME', name: 'Mechanical Engineering', seats: 60, filled: 58, dept: 'ME' },
  { id: 'CIVIL', code: 'CIVIL', name: 'Civil Engineering', seats: 60, filled: 54, dept: 'Civil' },
  { id: 'ECE-TEL', code: 'ECE-TEL', name: 'ECE — Telecommunication', seats: 60, filled: 41, dept: 'ECE' },
  { id: 'MBA', code: 'MBA', name: 'Master of Business Administration', seats: 90, filled: 87, dept: 'Management' },
]

export const COURSES = [
  { id: 'CS301', code: 'CS301', name: 'Data Structures & Algorithms', program: 'CSE', credits: 4, faculty: 'Dr. S. Iyer', semester: 5, students: 140, type: 'Core' },
  { id: 'CS302', code: 'CS302', name: 'Database Management Systems', program: 'CSE', credits: 4, faculty: 'Prof. K. Nair', semester: 5, students: 140, type: 'Core' },
  { id: 'CS401', code: 'CS401', name: 'Machine Learning', program: 'CSE', credits: 4, faculty: 'Dr. A. Menon', semester: 7, students: 132, type: 'Elective' },
  { id: 'EC305', code: 'EC305', name: 'Digital Signal Processing', program: 'ECE', credits: 3, faculty: 'Dr. R. Sharma', semester: 5, students: 112, type: 'Core' },
  { id: 'EC410', code: 'EC410', name: 'VLSI Design', program: 'ECE', credits: 4, faculty: 'Dr. P. Verma', semester: 7, students: 108, type: 'Elective' },
  { id: 'ME301', code: 'ME301', name: 'Thermodynamics II', program: 'ME', credits: 3, faculty: 'Dr. M. Rao', semester: 5, students: 58, type: 'Core' },
  { id: 'CV302', code: 'CV302', name: 'Structural Analysis', program: 'CIVIL', credits: 4, faculty: 'Dr. V. Reddy', semester: 5, students: 54, type: 'Core' },
  { id: 'MB502', code: 'MB502', name: 'Financial Management', program: 'MBA', credits: 4, faculty: 'Prof. N. Gupta', semester: 3, students: 87, type: 'Core' },
]

export const STUDENTS = [
  { id: '21CS042', name: 'Priya Sharma', program: 'CSE', sem: 7, roll: '21CS042', section: 'CSE-A', email: '21CS042@mgit.edu.in', phone: '+91 98450 11223', attendance: 92, cgpa: 8.9, status: 'Active', feeStatus: 'Paid', hostel: 'Block C / 214' },
  { id: '21CS018', name: 'Arjun Mehta', program: 'CSE', sem: 7, roll: '21CS018', section: 'CSE-A', email: '21CS018@mgit.edu.in', phone: '+91 98450 11456', attendance: 78, cgpa: 7.4, status: 'Active', feeStatus: 'Pending', hostel: 'Block C / 118' },
  { id: '22EC077', name: 'Sneha Reddy', program: 'ECE', sem: 5, roll: '22EC077', section: 'ECE-B', email: '22EC077@mgit.edu.in', phone: '+91 98450 11789', attendance: 95, cgpa: 9.2, status: 'Active', feeStatus: 'Paid', hostel: 'Block B / 302' },
  { id: '22ME031', name: 'Karthik Rao', program: 'ME', sem: 5, roll: '22ME031', section: 'ME-A', email: '22ME031@mgit.edu.in', phone: '+91 98450 12345', attendance: 64, cgpa: 6.1, status: 'At Risk', feeStatus: 'Overdue', hostel: 'Day Scholar' },
  { id: '23CV014', name: 'Divya Sree', program: 'CIVIL', sem: 3, roll: '23CV014', section: 'CIVIL-A', email: '23CV014@mgit.edu.in', phone: '+91 98450 12678', attendance: 88, cgpa: 8.2, status: 'Active', feeStatus: 'Paid', hostel: 'Block A / 105' },
  { id: '24MBA009', name: 'Rahul Pillai', program: 'MBA', sem: 3, roll: '24MBA009', section: 'MBA-B', email: '24MBA009@mgit.edu.in', phone: '+91 98450 13012', attendance: 71, cgpa: 7.8, status: 'Active', feeStatus: 'Pending', hostel: 'Block D / 407' },
  { id: '21CS056', name: 'Anjali Desai', program: 'CSE', sem: 7, roll: '21CS056', section: 'CSE-B', email: '21CS056@mgit.edu.in', phone: '+91 98450 13345', attendance: 97, cgpa: 9.4, status: 'Active', feeStatus: 'Paid', hostel: 'Block C / 220' },
  { id: '22EC091', name: 'Vikram Chari', program: 'ECE', sem: 5, roll: '22EC091', section: 'ECE-A', email: '22EC091@mgit.edu.in', phone: '+91 98450 13678', attendance: 83, cgpa: 7.9, status: 'Active', feeStatus: 'Paid', hostel: 'Day Scholar' },
  { id: '23ME022', name: 'Lakshmi Prasad', program: 'ME', sem: 3, roll: '23ME022', section: 'ME-A', email: '23ME022@mgit.edu.in', phone: '+91 98450 13901', attendance: 86, cgpa: 8.0, status: 'Active', feeStatus: 'Paid', hostel: 'Block A / 220' },
  { id: '23CV036', name: 'Naveen Kumar', program: 'CIVIL', sem: 3, roll: '23CV036', section: 'CIVIL-B', email: '23CV036@mgit.edu.in', phone: '+91 98450 14234', attendance: 59, cgpa: 5.8, status: 'At Risk', feeStatus: 'Overdue', hostel: 'Block A / 118' },
]

export const FACULTY = [
  { id: 'F-1001', name: 'Dr. S. Iyer', designation: 'Professor & Head', dept: 'CSE', courses: 3, students: 140, email: 'iyer@mgit.edu.in', joined: '2012-06-01', status: 'Active' },
  { id: 'F-1002', name: 'Dr. A. Menon', designation: 'Professor', dept: 'CSE', courses: 3, students: 132, email: 'menon@mgit.edu.in', joined: '2015-07-15', status: 'Active' },
  { id: 'F-1003', name: 'Prof. K. Nair', designation: 'Associate Professor', dept: 'CSE', courses: 2, students: 140, email: 'nair@mgit.edu.in', joined: '2017-08-20', status: 'Active' },
  { id: 'F-1004', name: 'Dr. R. Sharma', designation: 'Professor & Head', dept: 'Physics', courses: 3, students: 118, email: 'sharma@mgit.edu.in', joined: '2010-03-11', status: 'Active' },
  { id: 'F-1005', name: 'Dr. P. Verma', designation: 'Associate Professor', dept: 'ECE', courses: 2, students: 108, email: 'verma@mgit.edu.in', joined: '2019-06-02', status: 'Active' },
  { id: 'F-1006', name: 'Dr. M. Rao', designation: 'Professor & Head', dept: 'Mechanical', courses: 3, students: 120, email: 'rao@mgit.edu.in', joined: '2011-09-05', status: 'On Sabbatical' },
  { id: 'F-1007', name: 'Dr. V. Reddy', designation: 'Professor & Head', dept: 'Civil', courses: 2, students: 110, email: 'reddy@mgit.edu.in', joined: '2013-11-18', status: 'Active' },
  { id: 'F-1008', name: 'Prof. N. Gupta', designation: 'Assistant Professor', dept: 'Management', courses: 4, students: 180, email: 'gupta@mgit.edu.in', joined: '2020-01-13', status: 'Active' },
]

export const ATTENDANCE_SESSIONS = [
  { id: 'AS-901', course: 'CS301', date: '2026-10-21', time: '09:00 – 09:50', faculty: 'Dr. S. Iyer', present: 132, total: 140, pct: 94.3, status: 'Completed' },
  { id: 'AS-902', course: 'EC305', date: '2026-10-21', time: '10:00 – 10:50', faculty: 'Dr. R. Sharma', present: 104, total: 112, pct: 92.9, status: 'Completed' },
  { id: 'AS-903', course: 'ME301', date: '2026-10-21', time: '11:00 – 11:50', faculty: 'Dr. M. Rao', present: 41, total: 58, pct: 70.7, status: 'Completed' },
  { id: 'AS-904', course: 'CS401', date: '2026-10-22', time: '09:00 – 09:50', faculty: 'Dr. A. Menon', present: 0, total: 132, pct: 0, status: 'Scheduled' },
  { id: 'AS-905', course: 'MB502', date: '2026-10-22', time: '11:00 – 12:00', faculty: 'Prof. N. Gupta', present: 0, total: 87, pct: 0, status: 'Scheduled' },
  { id: 'AS-906', course: 'CS302', date: '2026-10-20', time: '14:00 – 15:00', faculty: 'Prof. K. Nair', present: 121, total: 140, pct: 86.4, status: 'Completed' },
]

export const EXAMINATIONS = [
  { id: 'EX-2201', course: 'CS301', type: 'Mid-Term', date: '2026-09-14', max: 50, avg: 38.4, pass: 92.1, students: 140, status: 'Published' },
  { id: 'EX-2202', course: 'EC305', type: 'Mid-Term', date: '2026-09-16', max: 50, avg: 35.1, pass: 88.0, students: 112, status: 'Published' },
  { id: 'EX-2203', course: 'CS401', type: 'End-Term', date: '2026-10-28', max: 100, avg: 0, pass: 0, students: 132, status: 'Scheduled' },
  { id: 'EX-2204', course: 'ME301', type: 'Mid-Term', date: '2026-09-18', max: 50, avg: 29.7, pass: 74.1, students: 58, status: 'Published' },
  { id: 'EX-2205', course: 'MB502', type: 'End-Term', date: '2026-10-30', max: 100, avg: 0, pass: 0, students: 87, status: 'Scheduled' },
  { id: 'EX-2206', course: 'CS302', type: 'Assignment 3', date: '2026-10-15', max: 20, avg: 16.8, pass: 96.4, students: 140, status: 'Published' },
]

export const OBE_REPORTS = [
  { id: 'OBE-31', program: 'CSE', course: 'CS301', po: 1.42, ps: 1.38, co: 0.82, level: 'High', date: '2026-10-18', status: 'Finalized' },
  { id: 'OBE-32', program: 'CSE', course: 'CS401', po: 1.21, ps: 1.15, co: 0.76, level: 'Medium', date: '2026-10-15', status: 'Draft' },
  { id: 'OBE-33', program: 'ECE', course: 'EC305', po: 1.35, ps: 1.29, co: 0.79, level: 'High', date: '2026-10-12', status: 'Finalized' },
  { id: 'OBE-34', program: 'ME', course: 'ME301', po: 1.08, ps: 1.02, co: 0.68, level: 'Medium', date: '2026-10-10', status: 'Draft' },
  { id: 'OBE-35', program: 'CIVIL', course: 'CV302', po: 1.19, ps: 1.11, co: 0.74, level: 'Medium', date: '2026-10-08', status: 'Finalized' },
]

export const FEEDBACK = [
  { id: 'FB-401', course: 'CS301', faculty: 'Dr. S. Iyer', responses: 128, rating: 4.6, comments: 42, date: '2026-10-05', status: 'Published' },
  { id: 'FB-402', course: 'EC410', faculty: 'Dr. P. Verma', responses: 96, rating: 4.3, comments: 31, date: '2026-10-05', status: 'Published' },
  { id: 'FB-403', course: 'MB502', faculty: 'Prof. N. Gupta', responses: 74, rating: 4.1, comments: 25, date: '2026-10-06', status: 'Closed' },
  { id: 'FB-404', course: 'CS302', faculty: 'Prof. K. Nair', responses: 0, rating: 0, comments: 0, date: '2026-11-01', status: 'Scheduled' },
]

export const TIMETABLE = [
  { day: 'Monday', slots: [
    { time: '09:00 – 09:50', course: 'CS301', room: 'A-204', faculty: 'Dr. S. Iyer' },
    { time: '10:00 – 10:50', course: 'EC305', room: 'B-112', faculty: 'Dr. R. Sharma' },
    { time: '11:00 – 11:50', course: 'ME301', room: 'C-305', faculty: 'Dr. M. Rao' },
    { time: '14:00 – 15:00', course: 'CS302', room: 'A-204', faculty: 'Prof. K. Nair' },
  ]},
  { day: 'Tuesday', slots: [
    { time: '09:00 – 09:50', course: 'CS401', room: 'A-301', faculty: 'Dr. A. Menon' },
    { time: '11:00 – 12:00', course: 'MB502', room: 'D-101', faculty: 'Prof. N. Gupta' },
    { time: '15:00 – 16:00', course: 'EC410', room: 'B-210', faculty: 'Dr. P. Verma' },
  ]},
  { day: 'Wednesday', slots: [
    { time: '09:00 – 09:50', course: 'CV302', room: 'E-101', faculty: 'Dr. V. Reddy' },
    { time: '10:00 – 10:50', course: 'CS301', room: 'A-204', faculty: 'Dr. S. Iyer' },
    { time: '13:00 – 14:00', course: 'ECE-TEL', room: 'B-115', faculty: 'Dr. P. Verma' },
  ]},
  { day: 'Thursday', slots: [
    { time: '09:00 – 09:50', course: 'CS302', room: 'A-204', faculty: 'Prof. K. Nair' },
    { time: '10:00 – 10:50', course: 'EC305', room: 'B-112', faculty: 'Dr. R. Sharma' },
    { time: '14:00 – 14:50', course: 'CS401', room: 'A-301', faculty: 'Dr. A. Menon' },
  ]},
  { day: 'Friday', slots: [
    { time: '09:00 – 09:50', course: 'ME301', room: 'C-305', faculty: 'Dr. M. Rao' },
    { time: '11:00 – 12:00', course: 'MB502', room: 'D-101', faculty: 'Prof. N. Gupta' },
  ]},
]

/* ------------------------------------------------------------------ */
/* Finance                                                            */
/* ------------------------------------------------------------------ */

export const FEE_STRUCTURES = [
  { id: 'FS-CSE', program: 'CSE', semester: 7, category: 'Tuition', amount: 125000, paid: 118, pending: 2, students: 120, dueDate: '2026-08-15' },
  { id: 'FS-ECE', program: 'ECE', semester: 5, category: 'Tuition', amount: 115000, paid: 110, pending: 2, students: 112, dueDate: '2026-08-15' },
  { id: 'FS-ME', program: 'ME', semester: 5, category: 'Tuition', amount: 95000, paid: 55, pending: 3, students: 58, dueDate: '2026-08-15' },
  { id: 'FS-CIVIL', program: 'CIVIL', semester: 3, category: 'Tuition', amount: 90000, paid: 52, pending: 2, students: 54, dueDate: '2026-08-15' },
  { id: 'FS-MBA', program: 'MBA', semester: 3, category: 'Tuition', amount: 180000, paid: 84, pending: 3, students: 87, dueDate: '2026-08-20' },
  { id: 'FS-HOSTEL', program: 'All', semester: 0, category: 'Hostel', amount: 45000, paid: 402, pending: 28, students: 430, dueDate: '2026-07-30' },
  { id: 'FS-EXAM', program: 'All', semester: 0, category: 'Examination', amount: 6000, paid: 512, pending: 18, students: 530, dueDate: '2026-09-01' },
  { id: 'FS-LIB', program: 'All', semester: 0, category: 'Library', amount: 3500, paid: 498, pending: 32, students: 530, dueDate: '2026-09-01' },
]

export const PAYMENTS = [
  { id: 'PAY-90001', student: '21CS042', name: 'Priya Sharma', program: 'CSE', category: 'Tuition', amount: 125000, mode: 'UPI', txn: '523418776201', date: '2026-08-12', status: 'Success' },
  { id: 'PAY-90002', student: '22EC077', name: 'Sneha Reddy', program: 'ECE', category: 'Tuition', amount: 115000, mode: 'Net Banking', txn: 'NEFT8829134', date: '2026-08-12', status: 'Success' },
  { id: 'PAY-90003', student: '24MBA009', name: 'Rahul Pillai', program: 'MBA', category: 'Tuition', amount: 90000, mode: 'Card', txn: 'CRD7712093', date: '2026-08-19', status: 'Success' },
  { id: 'PAY-90004', student: '22ME031', name: 'Karthik Rao', program: 'ME', category: 'Tuition', amount: 47500, mode: 'UPI', txn: '523418776554', date: '2026-09-02', status: 'Partial' },
  { id: 'PAY-90005', student: '23CV036', name: 'Naveen Kumar', program: 'CIVIL', category: 'Hostel', amount: 45000, mode: 'UPI', txn: '523418776890', date: '2026-09-15', status: 'Failed' },
  { id: 'PAY-90006', student: '21CS018', name: 'Arjun Mehta', program: 'CSE', category: 'Examination', amount: 6000, mode: 'Net Banking', txn: 'NEFT8829901', date: '2026-09-04', status: 'Success' },
  { id: 'PAY-90007', student: '23CV014', name: 'Divya Sree', program: 'CIVIL', category: 'Library', amount: 3500, mode: 'UPI', txn: '523418777112', date: '2026-09-05', status: 'Success' },
  { id: 'PAY-90008', student: '21CS056', name: 'Anjali Desai', program: 'CSE', category: 'Hostel', amount: 45000, mode: 'Card', txn: 'CRD7712550', date: '2026-08-10', status: 'Success' },
  { id: 'PAY-90009', student: '22EC091', name: 'Vikram Chari', program: 'ECE', category: 'Tuition', amount: 115000, mode: 'UPI', txn: '523418777344', date: '2026-08-16', status: 'Refunded' },
  { id: 'PAY-90010', student: '23ME022', name: 'Lakshmi Prasad', program: 'ME', category: 'Tuition', amount: 95000, mode: 'Net Banking', txn: 'NEFT8830122', date: '2026-08-18', status: 'Success' },
]

export const SCHOLARSHIPS = [
  { id: 'SCH-701', name: 'Merit Cum Means Scholarship', type: 'Merit', amount: 50000, beneficiaries: 38, applied: 120, budget: 1900000, disbursed: 1420000, status: 'Active' },
  { id: 'SCH-702', name: 'Post-Matric Scholarship (Govt.)', type: 'Government', amount: 35000, beneficiaries: 64, applied: 210, budget: 2240000, disbursed: 2240000, status: 'Completed' },
  { id: 'SCH-703', name: 'EBC / Tuition Fee Concession', type: 'Concession', amount: 40000, beneficiaries: 41, applied: 95, budget: 1640000, disbursed: 920000, status: 'Active' },
  { id: 'SCH-704', name: 'Girl/Bridge Scholarship', type: 'Merit', amount: 25000, beneficiaries: 19, applied: 48, budget: 475000, disbursed: 475000, status: 'Completed' },
  { id: 'SCH-705', name: 'AICTE Pragati Scholarship', type: 'Government', amount: 50000, beneficiaries: 12, applied: 30, budget: 600000, disbursed: 250000, status: 'Active' },
]

export const EXPENSES = [
  { id: 'EXP-3101', category: 'Salaries & Wages', department: 'Administration', amount: 4850000, date: '2026-10-05', status: 'Approved' },
  { id: 'EXP-3102', category: 'Utilities', department: 'Facilities', amount: 342000, date: '2026-10-08', status: 'Approved' },
  { id: 'EXP-3103', category: 'Laboratory Consumables', department: 'CSE', amount: 218500, date: '2026-10-10', status: 'Pending' },
  { id: 'EXP-3104', category: 'Travel & Conveyance', department: 'Administration', amount: 96400, date: '2026-10-12', status: 'Approved' },
  { id: 'EXP-3105', category: 'Campus Maintenance', department: 'Facilities', amount: 176000, date: '2026-10-14', status: 'Pending' },
  { id: 'EXP-3106', category: 'Library Acquisition', department: 'Library', amount: 132800, date: '2026-10-16', status: 'Approved' },
  { id: 'EXP-3107', category: 'Marketing & Outreach', department: 'Admissions', amount: 74500, date: '2026-10-18', status: 'Rejected' },
]

export const PAYROLL = [
  { id: 'PR-2026-10', month: 'October 2026', employees: 214, gross: 4850000, net: 3620000, tds: 512000, pf: 683000, status: 'Processed' },
  { id: 'PR-2026-09', month: 'September 2026', employees: 212, gross: 4782000, net: 3574000, tds: 504000, pf: 674000, status: 'Processed' },
  { id: 'PR-2026-08', month: 'August 2026', employees: 209, gross: 4698000, net: 3512000, tds: 496000, pf: 662000, status: 'Processed' },
  { id: 'PR-2026-07', month: 'July 2026', employees: 207, gross: 4640000, net: 3471000, tds: 490000, pf: 655000, status: 'Processed' },
  { id: 'PR-2026-11', month: 'November 2026', employees: 214, gross: 0, net: 0, tds: 0, pf: 0, status: 'Draft' },
]

export const FEE_COLLECTION_TREND = [
  { month: 'Jun', collected: 4200000, target: 4500000 },
  { month: 'Jul', collected: 6800000, target: 7000000 },
  { month: 'Aug', collected: 11400000, target: 11000000 },
  { month: 'Sep', collected: 2900000, target: 3500000 },
  { month: 'Oct', collected: 1750000, target: 2200000 },
  { month: 'Nov', collected: 0, target: 1500000 },
]

/* ------------------------------------------------------------------ */
/* Operations                                                         */
/* ------------------------------------------------------------------ */

export const HOSTELS = [
  { id: 'H-A', name: 'Block A — Boys', warden: 'Dr. M. Prasad', capacity: 180, occupied: 168, rent: 45000, type: 'Boys' },
  { id: 'H-B', name: 'Block B — Girls', warden: 'Dr. L. Anitha', capacity: 200, occupied: 192, rent: 48000, type: 'Girls' },
  { id: 'H-C', name: 'Block C — Boys', warden: 'Prof. D. Naik', capacity: 160, occupied: 149, rent: 45000, type: 'Boys' },
  { id: 'H-D', name: 'Block D — Girls', warden: 'Dr. S. Fatima', capacity: 120, occupied: 101, rent: 48000, type: 'Girls' },
]

export const TRANSPORT_ROUTES = [
  { id: 'RT-07', name: 'Route 7 — Uppal → Campus', vehicle: 'TS07-AB-1234', capacity: 52, students: 42, driver: 'S. Yadav', timing: '07:15 / 17:10', status: 'Active' },
  { id: 'RT-12', name: 'Route 12 — Miyapur → Campus', vehicle: 'TS09-CD-7788', capacity: 45, students: 38, driver: 'R. Naik', timing: '07:00 / 17:30', status: 'Active' },
  { id: 'RT-03', name: 'Route 3 — Secunderabad → Campus', vehicle: 'TS01-EF-2210', capacity: 52, students: 44, driver: 'K. Prasad', timing: '06:45 / 18:00', status: 'Delayed' },
  { id: 'RT-21', name: 'Route 21 — Kukatpally → Campus', vehicle: 'TS10-GH-9981', capacity: 45, students: 29, driver: 'M. Babu', timing: '07:30 / 16:50', status: 'Active' },
]

export const LIBRARY_ITEMS = [
  { id: 'BK-2201', title: 'Introduction to Algorithms', author: 'Cormen et al.', category: 'Computer Science', copies: 12, issued: 9, type: 'Reference' },
  { id: 'BK-2202', title: 'Signals and Systems', author: 'Oppenheim', category: 'Electronics', copies: 8, issued: 7, type: 'Reference' },
  { id: 'BK-2203', title: 'Thermodynamics — An Engineering Approach', author: 'Çengel', category: 'Mechanical', copies: 6, issued: 3, type: 'Textbook' },
  { id: 'BK-2204', title: 'Reinforced Concrete Design', author: 'N. Krishna Raju', category: 'Civil', copies: 5, issued: 4, type: 'Textbook' },
  { id: 'BK-2205', title: 'Principles of Marketing', author: 'Kotler', category: 'Management', copies: 10, issued: 6, type: 'Reference' },
  { id: 'BK-2206', title: 'Machine Learning Yearning', author: 'Andrew Ng', category: 'Computer Science', copies: 7, issued: 5, type: 'Reference' },
]

export const HELPDESK_TICKETS = [
  { id: 'HD-5501', subject: 'Wi-Fi connectivity issue in Block A', raisedBy: 'Karthik Rao', category: 'IT Support', priority: 'High', assignedTo: 'Ravi — IT Helpdesk', date: '2026-10-21', status: 'In Progress' },
  { id: 'HD-5502', subject: 'Duplicate fee payment receipt needed', raisedBy: 'Arjun Mehta', category: 'Accounts', priority: 'Medium', assignedTo: 'S. Venkatesh', date: '2026-10-21', status: 'Open' },
  { id: 'HD-5503', subject: 'Hostel room change request — Block C to B', raisedBy: 'Priya Sharma', category: 'Hostel', priority: 'Low', assignedTo: 'Prof. D. Naik', date: '2026-10-20', status: 'Open' },
  { id: 'HD-5504', subject: 'Library fine not reflecting on student portal', raisedBy: 'Sneha Reddy', category: 'Library', priority: 'Medium', assignedTo: 'Dr. K. Iyer', date: '2026-10-19', status: 'Resolved' },
  { id: 'HD-5505', subject: 'Bus route 3 delayed by 25 minutes', raisedBy: 'Vikram Chari', category: 'Transport', priority: 'High', assignedTo: 'M. Babu', date: '2026-10-19', status: 'In Progress' },
  { id: 'HD-5506', subject: 'Bonafide certificate for passport application', raisedBy: 'Divya Sree', category: 'Student Services', priority: 'Medium', assignedTo: 'Front Office', date: '2026-10-18', status: 'Closed' },
  { id: 'HD-5507', subject: 'Lab projector not working — CSE Lab 3', raisedBy: 'Dr. S. Iyer', category: 'Facilities', priority: 'High', assignedTo: 'Electrical Team', date: '2026-10-17', status: 'In Progress' },
]

export const PLACEMENTS = [
  { id: 'PL-4401', student: 'Anjali Desai', program: 'CSE', company: 'TCS Digital', role: 'SDE Trainee', package: 7.2, date: '2026-10-18', status: 'Offer Accepted' },
  { id: 'PL-4402', student: 'Priya Sharma', program: 'CSE', company: 'Infosys', role: 'Systems Engineer', package: 6.0, date: '2026-10-17', status: 'Offer Accepted' },
  { id: 'PL-4403', student: 'Sneha Reddy', program: 'ECE', company: 'Wipro', role: 'Embedded Engineer', package: 5.6, date: '2026-10-16', status: 'Offer Accepted' },
  { id: 'PL-4404', student: 'Vikram Chari', program: 'ECE', company: 'Tech Mahindra', role: 'Associate Engineer', package: 5.4, date: '2026-10-15', status: 'Offer Released' },
  { id: 'PL-4405', student: 'Rahul Pillai', program: 'MBA', company: 'Deloitte', role: 'Business Analyst', package: 8.5, date: '2026-10-14', status: 'Offer Accepted' },
  { id: 'PL-4406', student: 'Lakshmi Prasad', program: 'ME', company: 'L&T Construction', role: 'Graduate Engineer', package: 4.8, date: '2026-10-12', status: 'Under Process' },
]

export const VISITORS = [
  { id: 'VS-2201', name: 'R. Balakrishnan', purpose: 'Parent — Student Meeting', host: 'Priya Sharma', checkedIn: '2026-10-22 09:15', status: 'On Campus' },
  { id: 'VS-2202', name: 'Sunil Industries — HR Team', purpose: 'Campus Recruitment', host: 'Placement Cell', checkedIn: '2026-10-22 10:40', status: 'On Campus' },
  { id: 'VS-2203', name: 'Anitha Sharma', purpose: 'Admission Enquiry — CSE', host: 'Admissions Office', checkedIn: '2026-10-22 11:05', status: 'On Campus' },
  { id: 'VS-2204', name: 'Deepak Jain', purpose: 'Alumni — Batch 2015', host: 'Alumni Coordinator', checkedIn: '2026-10-21 16:20', status: 'Checked Out' },
]

/* ------------------------------------------------------------------ */
/* Enrollment                                                         */
/* ------------------------------------------------------------------ */

export const ENQUIRIES = [
  { id: 'ENQ-8801', name: 'Anitha Sharma', program: 'B.Tech CSE', source: 'Website', date: '2026-10-22', score: 92, status: 'Follow-up Due', counsellor: 'P. Lakshmi' },
  { id: 'ENQ-8802', name: 'Rohit Bansal', program: 'MBA', source: 'Referral', date: '2026-10-21', score: 78, status: 'Counselling Done', counsellor: 'M. Feroz' },
  { id: 'ENQ-8803', name: 'Sandeep Kumar', program: 'B.Tech ECE', source: 'Education Fair', date: '2026-10-21', score: 85, status: 'New', counsellor: 'Unassigned' },
  { id: 'ENQ-8804', name: 'Neha Agarwal', program: 'B.Tech ME', source: 'Instagram', date: '2026-10-20', score: 71, status: 'Follow-up Due', counsellor: 'P. Lakshmi' },
  { id: 'ENQ-8805', name: 'Vivek Joshi', program: 'M.Tech', source: 'Website', date: '2026-10-19', score: 88, status: 'Admitted', counsellor: 'M. Feroz' },
  { id: 'ENQ-8806', name: 'Kiranmai N.', program: 'B.Tech CSE', source: 'Walk-in', date: '2026-10-18', score: 64, status: 'Not Interested', counsellor: 'S. Kiran' },
]

export const APPLICATIONS = [
  { id: 'APP-6601', name: 'Vivek Joshi', program: 'M.Tech', appliedOn: '2026-10-18', docs: 'Verified', entrance: 84, status: 'Confirmed' },
  { id: 'APP-6602', name: 'Anitha Sharma', program: 'B.Tech CSE', appliedOn: '2026-10-19', docs: 'Pending', entrance: 92, status: 'Under Review' },
  { id: 'APP-6603', name: 'Rohit Bansal', program: 'MBA', appliedOn: '2026-10-17', docs: 'Verified', entrance: 78, status: 'Confirmed' },
  { id: 'APP-6604', name: 'Sandeep Kumar', program: 'B.Tech ECE', appliedOn: '2026-10-20', docs: 'Incomplete', entrance: 85, status: 'Documents Missing' },
  { id: 'APP-6605', name: 'Neha Agarwal', program: 'B.Tech ME', appliedOn: '2026-10-19', docs: 'Verified', entrance: 71, status: 'Under Review' },
  { id: 'APP-6606', name: 'Farhan Ali', program: 'B.Tech CIVIL', appliedOn: '2026-10-15', docs: 'Verified', entrance: 88, status: 'Confirmed' },
]

export const ADMISSIONS_STATS = {
  applications: 1248,
  shortlisted: 862,
  confirmed: 704,
  pending: 138,
  offerReleased: 690,
  joined: 612,
}

/* ------------------------------------------------------------------ */
/* People                                                             */
/* ------------------------------------------------------------------ */

export const STAFF = [
  { id: 'EMP-1201', name: 'Dr. S. Iyer', designation: 'Professor & Head', dept: 'CSE', type: 'Teaching', joined: '2012-06-01', reportsTo: 'Dr. Anil Kumar', status: 'Active' },
  { id: 'EMP-1202', name: 'Dr. Anil Kumar', designation: 'Principal', dept: 'Administration', type: 'Administrative', joined: '2009-04-01', reportsTo: 'Board of Governors', status: 'Active' },
  { id: 'EMP-1203', name: 'Dr. A. Menon', designation: 'Professor', dept: 'CSE', type: 'Teaching', joined: '2015-07-15', reportsTo: 'Dr. S. Iyer', status: 'Active' },
  { id: 'EMP-1204', name: 'S. Venkatesh', designation: 'Finance Officer', dept: 'Accounts', type: 'Administrative', joined: '2014-02-10', reportsTo: 'Dr. Anil Kumar', status: 'Active' },
  { id: 'EMP-1205', name: 'Dr. R. Sharma', designation: 'Professor & Head', dept: 'Physics', type: 'Teaching', joined: '2010-03-11', reportsTo: 'Dr. Anil Kumar', status: 'Active' },
  { id: 'EMP-1206', name: 'Prof. D. Naik', designation: 'Hostel Warden', dept: 'Hostel', type: 'Support', joined: '2018-06-05', reportsTo: 'Dean — Student Affairs', status: 'Active' },
  { id: 'EMP-1207', name: 'P. Lakshmi', designation: 'Admissions Counsellor', dept: 'Admissions', type: 'Administrative', joined: '2021-08-09', reportsTo: 'Head — Admissions', status: 'On Leave' },
  { id: 'EMP-1208', name: 'M. Feroz', designation: 'Senior Counsellor', dept: 'Admissions', type: 'Administrative', joined: '2019-11-18', reportsTo: 'Head — Admissions', status: 'Active' },
  { id: 'EMP-1209', name: 'Dr. L. Anitha', designation: 'Hostel Warden', dept: 'Hostel', type: 'Support', joined: '2016-01-20', reportsTo: 'Dean — Student Affairs', status: 'Active' },
  { id: 'EMP-1210', name: 'Ravi Kumar', designation: 'IT Support Engineer', dept: 'IT', type: 'Support', joined: '2022-03-14', reportsTo: 'Head — IT', status: 'Active' },
]

export const LEAVE_REQUESTS = [
  { id: 'LV-3301', employee: 'Dr. R. Sharma', type: 'Casual Leave', from: '2026-10-24', to: '2026-10-28', days: 5, reason: 'Family function', status: 'Approved' },
  { id: 'LV-3302', employee: 'Prof. D. Naik', type: 'Earned Leave', from: '2026-10-23', to: '2026-10-24', days: 2, reason: 'Personal work', status: 'Pending' },
  { id: 'LV-3303', employee: 'P. Lakshmi', type: 'Maternity Leave', from: '2026-09-01', to: '2026-11-30', days: 91, reason: 'Medical', status: 'Approved' },
  { id: 'LV-3304', employee: 'Ravi Kumar', type: 'Casual Leave', from: '2026-10-20', to: '2026-10-20', days: 1, reason: 'Fever', status: 'Approved' },
  { id: 'LV-3305', employee: 'Dr. A. Menon', type: 'Earned Leave', from: '2026-11-02', to: '2026-11-06', days: 5, reason: 'Conference travel', status: 'Pending' },
  { id: 'LV-3306', employee: 'S. Venkatesh', type: 'Compensatory Off', from: '2026-10-25', to: '2026-10-25', days: 1, reason: 'Weekend duty', status: 'Rejected' },
]

export const APPRAISALS = [
  { id: 'AP-9901', employee: 'Dr. S. Iyer', cycle: '2025-26', rating: 4.6, reviewer: 'Dr. Anil Kumar', submitted: '2026-09-30', status: 'Finalized' },
  { id: 'AP-9902', employee: 'Dr. A. Menon', cycle: '2025-26', rating: 4.4, reviewer: 'Dr. S. Iyer', submitted: '2026-09-30', status: 'Finalized' },
  { id: 'AP-9903', employee: 'Prof. K. Nair', cycle: '2025-26', rating: 4.2, reviewer: 'Dr. S. Iyer', submitted: '2026-09-28', status: 'Under Review' },
  { id: 'AP-9904', employee: 'Dr. R. Sharma', cycle: '2025-26', rating: 4.5, reviewer: 'Dr. Anil Kumar', submitted: '2026-09-30', status: 'Finalized' },
  { id: 'AP-9905', employee: 'Ravi Kumar', cycle: '2025-26', rating: 3.9, reviewer: 'Head — IT', submitted: '2026-10-02', status: 'Under Review' },
  { id: 'AP-9906', employee: 'P. Lakshmi', cycle: '2025-26', rating: 4.7, reviewer: 'Head — Admissions', submitted: '2026-09-27', status: 'Finalized' },
]

export const RESEARCH_PROFILES = [
  { id: 'RP-101', faculty: 'Dr. A. Menon', title: 'Federated Learning for Edge Campus Networks', journals: 4, citations: 61, hIndex: 7, projects: 2, status: 'Active' },
  { id: 'RP-102', faculty: 'Dr. R. Sharma', title: 'Quantum Photonics in Undergraduate Labs', journals: 6, citations: 128, hIndex: 11, projects: 3, status: 'Active' },
  { id: 'RP-103', faculty: 'Dr. S. Iyer', title: 'Algorithmic Efficiency in Large-Scale Systems', journals: 9, citations: 214, hIndex: 14, projects: 4, status: 'Active' },
  { id: 'RP-104', faculty: 'Dr. P. Verma', title: 'Low-Power VLSI Architectures for IoT', journals: 3, citations: 42, hIndex: 5, projects: 1, status: 'Active' },
]

/* ------------------------------------------------------------------ */
/* Medha (AI assistant)                                               */
/* ------------------------------------------------------------------ */

export const MEDHA_SUGGESTIONS = [
  'Show attendance below 75% for CSE-A',
  'Which students have pending fees?',
  'Summarise this month’s fee collection',
  'Generate a bonafide letter for 21CS042',
  'Which courses have low OBE attainment?',
  'Draft an attendance circular for tomorrow',
  'Show hostel occupancy by block',
  'List pending leave requests',
]

export const MEDHA_CONVERSATION = [
  {
    id: 'm1',
    role: 'user',
    text: 'Show me students with attendance below 75% in CSE-A.',
    time: '09:41',
  },
  {
    id: 'm2',
    role: 'assistant',
    time: '09:41',
    blocks: [
      { type: 'text', text: 'I found **3 students** in CSE-A (Semester 7) with attendance below the 75% threshold this academic year.' },
      {
        type: 'table',
        columns: ['Roll No', 'Student', 'Attendance', 'CGPA', 'Status'],
        rows: [
          ['21CS018', 'Arjun Mehta', '78%', '7.4', 'Active'],
          ['21CS029', 'Sai Kiran', '71%', '6.8', 'Active'],
          ['21CS063', 'Manish Yadav', '68%', '6.2', 'At Risk'],
        ],
      },
      { type: 'text', text: 'Two of these students (Sai Kiran, Manish Yadav) have fallen below the minimum attendance requirement of 75% and may be barred from the end-semester examination. Want me to notify the course faculty?' },
    ],
    actions: [
      { label: 'Notify faculty', kind: 'primary' },
      { label: 'Send parent SMS', kind: 'ghost' },
      { label: 'Export list', kind: 'ghost' },
    ],
  },
]

export const AI_INSIGHTS = [
  { id: 'ai1', severity: 'critical', title: 'Attendance risk for 2 students', body: 'Sai Kiran (21CS029) and Manish Yadav (21CS063) are below the 75% eligibility threshold for end-sem exams. Action recommended before 24 Oct.', module: 'Academics' },
  { id: 'ai2', severity: 'warning', title: 'Fee collection below target by 14%', body: 'October collection stands at ₹17.5L against a ₹22L target. 18 students with overdue balances have not responded to reminders.', module: 'Finance' },
  { id: 'ai3', severity: 'info', title: '3 hostel rooms available', body: 'Block C has 11 vacant rooms. 2 students have pending room-change requests that can be accommodated immediately.', module: 'Operations' },
  { id: 'ai4', severity: 'success', title: 'OBE attainment improved in ECE', body: 'PO attainment for EC305 rose to 1.35 (High) from 1.24 last cycle, narrowing the gap to the target of 1.5.', module: 'Academics' },
]

/* ------------------------------------------------------------------ */
/* Activity feed / dashboard                                          */
/* ------------------------------------------------------------------ */

export const ACTIVITY_FEED = [
  { id: 'ac1', module: 'Enrollment', title: 'Application received', detail: '14 new · B.Tech CSE', time: 'just now', icon: 'file' },
  { id: 'ac2', module: 'Academics', title: 'Attendance marked', detail: 'CSE-A Batch · 84 students', time: 'just now', icon: 'check' },
  { id: 'ac3', module: 'Finance', title: 'Fee payment received', detail: '₹48,000 · MBA Finance', time: 'just now', icon: 'rupee' },
  { id: 'ac4', module: 'Operations', title: 'Leave request approved', detail: 'Dr. Ramesh · Physics Dept', time: '2 min ago', icon: 'calendar' },
  { id: 'ac5', module: 'Medha AI', title: 'Query resolved', detail: 'Fee structure · Student portal', time: '4 min ago', icon: 'sparkles' },
  { id: 'ac6', module: 'Academics', title: 'OBE report generated', detail: 'ECE Dept · Semester Q3', time: '8 min ago', icon: 'book' },
  { id: 'ac7', module: 'Finance', title: 'Payroll processed', detail: '214 staff · October cycle', time: '15 min ago', icon: 'wallet' },
  { id: 'ac8', module: 'Operations', title: 'Bus route updated', detail: 'Route 7 · 42 students reallocated', time: '22 min ago', icon: 'bus' },
  { id: 'ac9', module: 'People', title: 'Staff onboarding initiated', detail: '3 new hires · Engineering dept', time: '31 min ago', icon: 'user' },
  { id: 'ac10', module: 'Enrollment', title: 'Counsellor follow-up logged', detail: 'Arjun M. · Engineering enquiry', time: '44 min ago', icon: 'phone' },
  { id: 'ac11', module: 'Academics', title: 'Assignment submitted', detail: 'CS301 · 127 of 140 students', time: '1 hr ago', icon: 'upload' },
  { id: 'ac12', module: 'Finance', title: 'Scholarship disbursed', detail: '38 students · Merit batch', time: '1 hr ago', icon: 'gift' },
]

export const DASHBOARD_STATS = {
  students: { value: '530', label: 'Students', delta: 4.2, icon: 'users' },
  faculty: { value: '128', label: 'Faculty', delta: 1.8, icon: 'academic' },
  staff: { value: '86', label: 'Staff', delta: 0.9, icon: 'briefcase' },
  courses: { value: '64', label: 'Courses', delta: 3.1, icon: 'book' },
  revenue: { value: '₹2.7Cr', label: 'Collected (FY)', delta: 12.4, icon: 'indianRupee' },
  attendance: { value: '88.4%', label: 'Avg Attendance', delta: -1.2, icon: 'calendarCheck' },
}

export const ENROLLMENT_BREAKDOWN = [
  { label: 'B.Tech CSE', value: 118, color: 'var(--indigo-500)' },
  { label: 'B.Tech ECE', value: 112, color: 'var(--violet-500)' },
  { label: 'B.Tech ME', value: 58, color: 'var(--success-500)' },
  { label: 'B.Tech CIVIL', value: 54, color: 'var(--warning-500)' },
  { label: 'MBA', value: 87, color: 'var(--info-500)' },
  { label: 'Other', value: 101, color: 'var(--gray-400)' },
]

export const ATTENDANCE_TREND = [
  { day: 'Mon', value: 92 },
  { day: 'Tue', value: 89 },
  { day: 'Wed', value: 91 },
  { day: 'Thu', value: 86 },
  { day: 'Fri', value: 84 },
  { day: 'Sat', value: 71 },
]

/* ------------------------------------------------------------------ */
/* Student portal                                                     */
/* ------------------------------------------------------------------ */

export const STUDENT_SEMESTERS = [
  { sem: 1, sgpa: 8.4, credits: 22, backlogs: 0, status: 'Completed' },
  { sem: 2, sgpa: 8.7, credits: 23, backlogs: 0, status: 'Completed' },
  { sem: 3, sgpa: 8.5, credits: 24, backlogs: 0, status: 'Completed' },
  { sem: 4, sgpa: 9.0, credits: 24, backlogs: 0, status: 'Completed' },
  { sem: 5, sgpa: 8.8, credits: 25, backlogs: 0, status: 'Completed' },
  { sem: 6, sgpa: 8.9, credits: 25, backlogs: 0, status: 'Completed' },
  { sem: 7, sgpa: 8.9, credits: 26, backlogs: 0, status: 'In Progress' },
]

export const STUDENT_COURSES = [
  { code: 'CS401', name: 'Machine Learning', faculty: 'Dr. A. Menon', credits: 4, attendance: 92, grade: 'A', marks: 88, status: 'Active' },
  { code: 'CS402', name: 'Compiler Design', faculty: 'Prof. K. Nair', credits: 4, attendance: 88, grade: 'A', marks: 84, status: 'Active' },
  { code: 'CS403', name: 'Cloud Computing', faculty: 'Dr. S. Iyer', credits: 3, attendance: 95, grade: 'A+', marks: 94, status: 'Active' },
  { code: 'CS404', name: 'Software Engineering', faculty: 'Prof. K. Nair', credits: 4, attendance: 85, grade: 'B+', marks: 78, status: 'Active' },
  { code: 'CS405', name: 'Elective — Cyber Security', faculty: 'Dr. A. Menon', credits: 3, attendance: 78, grade: 'Pending', marks: 0, status: 'Active' },
  { code: 'CS406', name: 'Project Work', faculty: 'Dr. S. Iyer', credits: 6, attendance: 90, grade: 'Pending', marks: 0, status: 'Active' },
]

export const STUDENT_ATTENDANCE_SUBJECT = [
  { code: 'CS401', name: 'Machine Learning', attended: 23, total: 25, pct: 92 },
  { code: 'CS402', name: 'Compiler Design', attended: 22, total: 25, pct: 88 },
  { code: 'CS403', name: 'Cloud Computing', attended: 19, total: 20, pct: 95 },
  { code: 'CS404', name: 'Software Engineering', attended: 21, total: 25, pct: 84 },
  { code: 'CS405', name: 'Cyber Security', attended: 19, total: 25, pct: 76 },
  { code: 'CS406', name: 'Project Work', attended: 9, total: 10, pct: 90 },
]

export const STUDENT_DUES = [
  { id: 'SD-1', title: 'Tuition Fee — Sem 7', amount: 125000, due: '2026-10-30', status: 'Due' },
  { id: 'SD-2', title: 'Examination Fee', amount: 6000, due: '2026-10-25', status: 'Due' },
  { id: 'SD-3', title: 'Library Fine', amount: 320, due: '2026-09-30', status: 'Overdue' },
  { id: 'SD-4', title: 'Hostel Fee — Block C', amount: 45000, due: '2026-08-15', status: 'Paid' },
]

export const STUDENT_TIMETABLE = TIMETABLE

export const STUDENT_NOTICES = [
  { id: 'NT-1', title: 'End-Semester Examination Timetable — Sem 7', date: '2026-10-20', tag: 'Examinations', urgent: true },
  { id: 'NT-2', title: 'Ravindra Narayana Scholarship — Application Open', date: '2026-10-18', tag: 'Scholarship', urgent: false },
  { id: 'NT-3', title: 'Annual Technical Fest "Ignite 2026"', date: '2026-10-15', tag: 'Events', urgent: false },
  { id: 'NT-4', title: 'Library Hours Extended During Exams', date: '2026-10-12', tag: 'Library', urgent: false },
  { id: 'NT-5', title: 'Mid-Semester Results Published', date: '2026-10-08', tag: 'Results', urgent: false },
]

export const STUDENT_ASSIGNMENTS = [
  { id: 'AS-101', course: 'CS401', title: 'CNN architectures from scratch', due: '2026-10-24', submitted: false, marks: null, total: 20 },
  { id: 'AS-102', course: 'CS402', title: 'Lexer & parser assignment', due: '2026-10-22', submitted: true, marks: 18, total: 20 },
  { id: 'AS-103', course: 'CS404', title: 'Agile sprint case study', due: '2026-10-20', submitted: true, marks: 16, total: 20 },
  { id: 'AS-104', course: 'CS405', title: 'Threat modelling worksheet', due: '2026-10-27', submitted: false, marks: null, total: 15 },
]

/* ------------------------------------------------------------------ */
/* Faculty portal                                                     */
/* ------------------------------------------------------------------ */

export const FACULTY_TODAY = {
  classes: 3,
  students: 340,
  pendingEvaluations: 12,
  upcoming: [
    { time: '09:00 – 09:50', course: 'CS301', room: 'A-204', students: 140 },
    { time: '10:00 – 10:50', course: 'CS302', room: 'A-204', students: 140 },
    { time: '14:00 – 14:50', course: 'CS401', room: 'A-301', students: 132 },
  ],
  pendingTasks: [
    { id: 'T1', label: 'Upload CS401 assignment marks', course: 'CS401', due: '2026-10-23', priority: 'High' },
    { id: 'T2', label: 'Approve 4 attendance regularisation requests', course: 'CS301', due: '2026-10-22', priority: 'High' },
    { id: 'T3', label: 'Submit OBE attainment for CS302', course: 'CS302', due: '2026-10-26', priority: 'Medium' },
    { id: 'T4', label: 'Upload end-sem question paper', course: 'CS301', due: '2026-10-28', priority: 'Medium' },
  ],
}
