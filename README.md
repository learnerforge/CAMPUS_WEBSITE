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
| `npm run check` | Verify every JSX class has a CSS rule and every CSS token is defined |
| `npm run shots` | Capture 28 screenshots of the app into `screenshots/` |
| `npm run audit:layout` | Walk every route at 1440 px and 390 px, reporting overflow, clipping and contrast defects |
| `npm run fidelity` | Diff the replica's login screen against the live `mgit.campx.in` page |

The Playwright-based scripts (`shots`, `audit:layout`, `fidelity`) need the dev
server running on port 3000.

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
│  ├─ brand/CampXLogo.jsx    Wordmark reproduced from the live portal
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

reference/                   Captures of the live portal (provenance)
├─ original-vars.css         Its 351 CSS custom properties, lab() resolved
├─ original-tree.txt         Computed-style tree of the live login page
├─ original-dom.html         Serialised DOM of the live login page
├─ original-css.txt          Matched CSS rules from the live bundle
├─ original-tokens.json      Raw token dump (fonts, background image, logo)
└─ original-logo.svg         The CampX wordmark

scripts/                     Tooling — capture, verify, screenshot
├─ smoke.mjs                 jsdom route + login-flow harness
├─ layout-audit.mjs          Overflow / clipping / contrast scanner
├─ fidelity.mjs              Original-vs-replica PASS/DIFF table
├─ shots.mjs                 Playwright screenshot capture
├─ check-classes.mjs         JSX class ↔ CSS rule checker
├─ check-tokens.mjs          CSS custom property coverage report
├─ probe.mjs                 Box-model probe for a single route
├─ overflow-diag.mjs         Narrow-viewport overflow diagnostic
├─ dump-original.mjs         Re-capture the live login page
├─ dump-tokens.mjs           Re-extract the live design tokens
├─ resolve-tokens.mjs        Resolve lab() tokens to hex
└─ gen-logo.mjs              Regenerate CampXLogo.jsx from the capture
```

## Design system

All colour, spacing, radius, shadow and motion values are CSS custom
properties in `src/styles/theme.css`. The palette is the live portal's own —
a deep indigo primary (`#1e027f`), coral (`#c24548`) and magenta (`#822c79`)
brand gradient, a warm-neutral grey scale, and Hanken Grotesk for type. The
shell is light: a `#f1f3fa` canvas and sidebar with an indigo active accent.
Components never hard-code colours — they read the tokens.

The login screen is the reference implementation: `npm run fidelity` compares
it against the live `https://mgit.campx.in/` page property by property
(typeface, sizes, colours, radii, padding, and the vertical offset of every
element) and currently reports **51/51 matches**.

## Testing

`npm run smoke` boots the real application inside jsdom, walks every route
for every role, and fails if any screen throws, renders empty, or leaves
unhandled errors in the console. It also exercises the login form end to end
(success, wrong password, and anonymous redirect).

`npm run audit:layout` drives the built app in Chromium at 1440 px and 390 px
and reports horizontal overflow, clipped text, broken images and text/background
contrast. It currently reports **0 defects** across 52 routes. Contrast
warnings are grouped and called out separately: the live portal renders all
de-emphasised text in a single muted foreground (`#737373`), which lands just
under 4.5:1 on tinted surfaces — a property of the source design system, so
the audit preserves it rather than silently diverging.

`npm run check` confirms every class token used in JSX has a matching CSS
rule (405 of 405) and that every CSS custom property referenced is defined.

## Deployment

`npm run build` emits a static bundle in `dist/`. Because the app uses
history routing, the host must rewrite unknown paths to `index.html` —
`public/_redirects` covers Netlify-style hosts; for nginx use
`try_files $uri /index.html`.
