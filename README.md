# CampX — Digital Campus Ecosystem

A front-end replica of the CampX portal at **https://mgit.campx.in/** for
**MAHATMA GANDHI INSTITUTE OF TECHNOLOGY**, expanded from the public login
screen into the complete authenticated portal: every module, the student
portal, the faculty workspace and the Medha AI assistant.

Built with **Vite 8 + React 18 + React Router 7** — no backend. The data
layer is a mock API that mirrors the shape of the REST payloads the real
CampX services return.

---

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
```

| Script | What it does |
| --- | --- |
| `npm run dev` | Dev server with HMR on port 3000 |
| `npm run build` | Production bundle into `dist/` |
| `npm run preview` | Serve the production bundle locally |
| `npm run smoke` | Mount every route in jsdom and assert a clean render |

## Demo accounts

The login screen ships with clickable demo chips. Credentials are also
accepted by username **or** email.

| Role | Username | Password | Lands on |
| --- | --- | --- | --- |
| Administrator | `admin` | `admin@123` | `/app/dashboard` |
| Faculty | `faculty` | `faculty@123` | `/app/faculty` |
| Student | `student` | `student@123` | `/app/portal` |
| Finance Officer | `accounts` | `accounts@123` | `/app/dashboard` |

Sessions persist in `localStorage` when **Remember me** is ticked, otherwise
in `sessionStorage`. Signing out clears both.

---

## Routes

### Public
| Path | Screen |
| --- | --- |
| `/login` | Login screen (redirects to the portal when already signed in) |
| `/` | Redirects to `/app` |

### Overview
| Path | Screen |
| --- | --- |
| `/app` | Role-aware landing (dashboard / faculty portal / student portal) |
| `/app/dashboard` | Campus dashboard — stats, module tiles, live feed, Medha insights, charts |
| `/app/medha` | Medha AI assistant chat |

### Academics — `admin`, `faculty`, `staff`
`/app/academics` · `/courses` · `/programs` · `/attendance` · `/examinations` ·
`/obe` · `/feedback` · `/timetable` · `/students` · `/faculty`

### Finance — `admin`, `finance`
`/app/finance` · `/fees` · `/payments` · `/scholarships` · `/expenses` · `/payroll`

### Operations — `admin`, `staff`, `faculty`
`/app/operations` · `/hostel` · `/transport` · `/library` · `/helpdesk` ·
`/placements` · `/visitors`

### Enrollment — `admin`, `staff`
`/app/enrollment` · `/enquiries` · `/applications` · `/counselling`

### People — `admin`, `staff`, `faculty`
`/app/people` · `/directory` · `/onboarding` · `/attendance` · `/leave` ·
`/appraisal` · `/research`

### Faculty portal — `admin`, `faculty`
`/app/faculty` · `/students` · `/evaluation`

### Student portal — `student`
`/app/portal` · `/courses` · `/attendance` · `/results` · `/fees` ·
`/assignments` · `/library` · `/hostel` · `/timetable`

### Workspace
`/app/profile` · `/app/notices` · `/app/reports` (`admin`, `finance`, `staff`)

Roles outside a module's scope get a **403** page; unknown URLs get a **404**.

---

## Project layout

```
src/
├─ main.jsx                  BrowserRouter + AuthProvider + ToastProvider
├─ App.jsx                   Route table, role guards, top-bar titles
├─ styles/theme.css          Design tokens, reset, utilities
├─ context/
│  ├─ AuthContext.jsx        Session state, demo credentials, persistence
│  └─ ToastContext.jsx       Global toast notifications
├─ components/
│  ├─ Login.jsx/.css         Public login screen
│  ├─ ListPage.jsx           Generic list screen + `col` column factories
│  ├─ layout/AppShell.jsx    Sidebar, top bar, mobile drawer
│  └─ ui/                    Card, Badge, Button, StatCard, DataTable,
│                            ProgressBar, Modal, Tabs, EmptyState, charts
├─ data/
│  ├─ mock.js                Every dataset, shaped like the real API
│  └─ nav.js                 Sidebar tree, role filters, module tiles
└─ pages/
   ├─ Dashboard.jsx          Admin/faculty/finance dashboard
   ├─ MedhaPage.jsx          AI assistant
   ├─ WorkspacePages.jsx     Profile, notices, reports, 404/403
   ├─ academics/ finance/ operations/ enrollment/ people/
   ├─ portal/                Student portal
   └─ faculty/               Faculty portal
```

## Design system

All colour, spacing, radius, shadow and motion values are CSS custom
properties in `src/styles/theme.css`. The palette is built around an indigo
primary (`--indigo-600`) with a violet accent (`--violet-600`), on a light
`--canvas` shell. Components never hard-code colours — they read the tokens.

## Testing

`npm run smoke` boots the real application inside jsdom, walks every route
for every role, and fails if any screen throws, renders empty, or leaves
unhandled errors in the console. It also exercises the login form end to end
(success, wrong password, and anonymous redirect).

## Deployment

`npm run build` emits a static bundle in `dist/`. Because the app uses
history routing, the host must rewrite unknown paths to `index.html` —
`public/_redirects` covers Netlify-style hosts; for nginx use
`try_files $uri /index.html`.
