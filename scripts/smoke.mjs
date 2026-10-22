/**
 * Headless smoke test — mounts the CampX SPA inside jsdom and walks the
 * router through every screen, failing loudly on any render error.
 *
 *   npm run smoke
 */
import { JSDOM } from 'jsdom'
import { createServer } from 'vite'

/* ------------------------------------------------------------------ */
/* Browser environment                                                 */
/* ------------------------------------------------------------------ */

const dom = new JSDOM('<!doctype html><html><body><div id="root"></div></body></html>', {
  url: 'http://localhost:3000/',
  pretendToBeVisual: true,
})

global.window = dom.window
global.document = dom.window.document
Object.defineProperty(global, 'navigator', { value: dom.window.navigator, configurable: true })
global.HTMLElement = dom.window.HTMLElement
global.HTMLAnchorElement = dom.window.HTMLAnchorElement
global.Element = dom.window.Element
global.Node = dom.window.Node
global.localStorage = dom.window.localStorage
global.sessionStorage = dom.window.sessionStorage
global.requestAnimationFrame = (cb) => setTimeout(cb, 0)
global.cancelAnimationFrame = (id) => clearTimeout(id)
global.getComputedStyle = dom.window.getComputedStyle
global.MutationObserver = dom.window.MutationObserver
global.IS_REACT_ACT_ENVIRONMENT = true

const errors = []
const origError = console.error
const IGNORED = [
  'not wrapped in act(',
  'Warning: Encountered two children with the same key',
  'Consider adding an error boundary',
]
console.error = (...args) => {
  const msg = args.map((a) => (a && a.stack ? a.stack : String(a))).join(' ')
  if (IGNORED.some((i) => msg.includes(i))) return
  errors.push(msg)
  origError(...args)
}
dom.window.addEventListener('error', (e) => errors.push('window.error: ' + e.message))

/* ------------------------------------------------------------------ */
/* Modules under test (compiled through Vite so JSX works)            */
/* ------------------------------------------------------------------ */

const vite = await createServer({
  configFile: false,
  root: process.cwd(),
  logLevel: 'error',
  server: { middlewareMode: true },
  appType: 'custom',
  esbuild: { jsx: 'automatic' },
})

const { default: App } = await vite.ssrLoadModule('/src/App.jsx')
const { AuthProvider, DEMO_USERS } = await vite.ssrLoadModule('/src/context/AuthContext.jsx')
const { ToastProvider } = await vite.ssrLoadModule('/src/context/ToastContext.jsx')

const React = (await import('react')).default
const { createElement } = await import('react')
const { act } = await import('react')
const { createRoot } = await import('react-dom/client')
const { MemoryRouter } = await import('react-router-dom')

/* ------------------------------------------------------------------ */
/* Route table                                                         */
/* ------------------------------------------------------------------ */

const PATHS = [
  '/login',
  '/app',
  '/app/dashboard',
  '/app/medha',
  '/app/faculty',
  '/app/faculty/students',
  '/app/faculty/evaluation',
  '/app/academics',
  '/app/academics/courses',
  '/app/academics/programs',
  '/app/academics/attendance',
  '/app/academics/examinations',
  '/app/academics/obe',
  '/app/academics/feedback',
  '/app/academics/timetable',
  '/app/academics/students',
  '/app/academics/faculty',
  '/app/finance',
  '/app/finance/fees',
  '/app/finance/payments',
  '/app/finance/scholarships',
  '/app/finance/expenses',
  '/app/finance/payroll',
  '/app/operations',
  '/app/operations/hostel',
  '/app/operations/transport',
  '/app/operations/library',
  '/app/operations/helpdesk',
  '/app/operations/placements',
  '/app/operations/visitors',
  '/app/enrollment',
  '/app/enrollment/enquiries',
  '/app/enrollment/applications',
  '/app/enrollment/counselling',
  '/app/people',
  '/app/people/directory',
  '/app/people/onboarding',
  '/app/people/attendance',
  '/app/people/leave',
  '/app/people/appraisal',
  '/app/people/research',
  '/app/profile',
  '/app/notices',
  '/app/reports',
  '/app/portal',
  '/app/portal/courses',
  '/app/portal/attendance',
  '/app/portal/results',
  '/app/portal/fees',
  '/app/portal/assignments',
  '/app/portal/library',
  '/app/portal/hostel',
  '/app/portal/timetable',
  '/app/does-not-exist',
]

/* ------------------------------------------------------------------ */
/* Harness                                                             */
/* ------------------------------------------------------------------ */

async function visit(path) {
  const container = dom.window.document.createElement('div')
  dom.window.document.body.appendChild(container)

  const root = createRoot(container)
  await act(async () => {
    root.render(
      createElement(
        MemoryRouter,
        { initialEntries: [path] },
        createElement(
          AuthProvider,
          null,
          createElement(ToastProvider, null, createElement(App)),
        ),
      ),
    )
  })

  await act(async () => {
    await new Promise((r) => setTimeout(r, 20))
  })

  const html = container.innerHTML
  root.unmount()
  container.remove()
  return html
}

/** Mount the app and hand back the live container so we can drive the UI. */
async function mount(path) {
  const container = dom.window.document.createElement('div')
  dom.window.document.body.appendChild(container)

  const root = createRoot(container)
  await act(async () => {
    root.render(
      createElement(
        MemoryRouter,
        { initialEntries: [path] },
        createElement(
          AuthProvider,
          null,
          createElement(ToastProvider, null, createElement(App)),
        ),
      ),
    )
  })
  await act(async () => {
    await new Promise((r) => setTimeout(r, 20))
  })
  return { container, root }
}

function setInputValue(el, value) {
  const proto = el.tagName === 'TEXTAREA' ? dom.window.HTMLTextAreaElement : dom.window.HTMLInputElement
  const setter = Object.getOwnPropertyDescriptor(proto.prototype, 'value').set
  setter.call(el, value)
  el.dispatchEvent(new dom.window.Event('input', { bubbles: true }))
}

function signIn(username) {
  const user = DEMO_USERS.find((u) => u.username === username)
  window.localStorage.setItem(
    'campx.session',
    JSON.stringify({
      username: user.username,
      name: user.name,
      email: user.email,
      role: user.role,
      roleLabel: user.roleLabel ?? user.role,
      designation: user.designation,
      department: user.department,
      avatar: user.name.split(' ').map((p) => p[0]).join('').slice(0, 2).toUpperCase(),
      institution: 'MAHATMA GANDHI INSTITUTE OF TECHNOLOGY',
      issuedAt: Date.now(),
    }),
  )
}

const failures = []

async function sweep(role, paths) {
  signIn(role)
  for (const path of paths) {
    const before = errors.length
    try {
      const html = await visit(path)
      const newErrors = errors.slice(before)
      if (newErrors.length) {
        failures.push({ role, path, reason: newErrors.slice(0, 2).join(' | ') })
        console.log(`FAIL  [${role}] ${path}`)
        continue
      }
      if (html.length < 80) {
        failures.push({ role, path, reason: `rendered almost nothing (${html.length} chars)` })
        console.log(`EMPTY [${role}] ${path}`)
        continue
      }
      console.log(`ok    [${role}] ${path}  (${html.length} chars)`)
    } catch (err) {
      failures.push({ role, path, reason: String(err && err.stack ? err.stack : err) })
      console.log(`THROW [${role}] ${path} :: ${err}`)
    }
  }
  window.localStorage.clear()
}

await sweep('admin', PATHS)
await sweep('faculty', [
  '/app',
  '/app/faculty',
  '/app/faculty/students',
  '/app/faculty/evaluation',
  '/app/dashboard',
  '/app/academics',
  '/app/operations',
  '/app/people',
  '/app/medha',
  '/app/profile',
  '/app/notices',
])
await sweep('student', [
  '/app',
  '/app/portal',
  '/app/portal/courses',
  '/app/portal/attendance',
  '/app/portal/results',
  '/app/portal/fees',
  '/app/portal/assignments',
  '/app/portal/library',
  '/app/portal/hostel',
  '/app/portal/timetable',
  '/app/profile',
  '/app/notices',
  '/app/medha',
])
await sweep('accounts', [
  '/app',
  '/app/dashboard',
  '/app/finance',
  '/app/finance/fees',
  '/app/finance/payments',
  '/app/finance/scholarships',
  '/app/finance/expenses',
  '/app/finance/payroll',
  '/app/reports',
  '/app/profile',
])

/* ------------------------------------------------------------------ */
/* Login flow                                                         */
/* ------------------------------------------------------------------ */

console.log('\n--- login flow ---')

window.localStorage.clear()
window.sessionStorage.clear()

{
  const { container, root } = await mount('/login')
  const inputs = container.querySelectorAll('input')
  const userInput = inputs[0]
  const passInput = inputs[1]

  await act(async () => {
    setInputValue(userInput, 'admin')
    setInputValue(passInput, 'admin@123')
  })

  const form = container.querySelector('form')
  await act(async () => {
    form.dispatchEvent(new dom.window.Event('submit', { bubbles: true, cancelable: true }))
  })

  // Auth gateway simulates ~900ms of latency
  await act(async () => {
    await new Promise((r) => setTimeout(r, 1200))
  })

  const session = window.localStorage.getItem('campx.session')
  if (!session) {
    failures.push({ role: 'login', path: '/login', reason: 'no session persisted after submit' })
    console.log('FAIL  login did not persist a session')
  } else {
    const parsed = JSON.parse(session)
    console.log(`ok    login persisted session for ${parsed.username} (${parsed.role})`)
  }

  const text = container.textContent || ''
  if (!text.includes('Dashboard') && !text.includes('Medha')) {
    failures.push({ role: 'login', path: '/login', reason: 'dashboard did not render after login' })
    console.log('FAIL  dashboard did not render after login')
  } else {
    console.log('ok    dashboard rendered after login')
  }

  root.unmount()
  container.remove()
}

/* Invalid credentials should surface an inline error. */
{
  window.localStorage.clear()
  const { container, root } = await mount('/login')
  const inputs = container.querySelectorAll('input')
  await act(async () => {
    setInputValue(inputs[0], 'admin')
    setInputValue(inputs[1], 'wrong-password')
  })
  await act(async () => {
    container
      .querySelector('form')
      .dispatchEvent(new dom.window.Event('submit', { bubbles: true, cancelable: true }))
  })
  await act(async () => {
    await new Promise((r) => setTimeout(r, 1200))
  })

  const text = container.textContent || ''
  if (!/invalid credentials/i.test(text)) {
    failures.push({ role: 'login', path: '/login', reason: 'no error shown for bad password' })
    console.log('FAIL  no error shown for bad password')
  } else {
    console.log('ok    invalid credentials show an inline error')
  }
  if (window.localStorage.getItem('campx.session')) {
    failures.push({ role: 'login', path: '/login', reason: 'session persisted despite bad password' })
    console.log('FAIL  session persisted despite bad password')
  }

  root.unmount()
  container.remove()
}

/* Anonymous visitors hitting a protected route land on the login screen. */
{
  window.localStorage.clear()
  const { container, root } = await mount('/app/dashboard')
  const text = container.textContent || ''
  const hasLoginForm =
    /sign in/i.test(text) &&
    !!container.querySelector('input[type="password"], input[name="password"]')
  if (!hasLoginForm) {
    failures.push({ role: 'anon', path: '/app/dashboard', reason: 'anonymous access was not redirected to /login' })
    console.log('FAIL  anonymous access was not redirected to /login')
  } else {
    console.log('ok    anonymous access redirects to /login')
  }
  root.unmount()
  container.remove()
}

await vite.close()

console.log('\n' + '='.repeat(64))
if (failures.length) {
  console.log(`${failures.length} failure(s):`)
  for (const f of failures) console.log(` - [${f.role}] ${f.path}: ${f.reason}`)
  process.exit(1)
}
console.log('All routes rendered without errors.')
process.exit(0)
