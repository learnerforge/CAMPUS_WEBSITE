import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Icon from '../components/ui/Icon'
import {
  Badge,
  Button,
  Card,
  DonutChart,
  Legend,
  BarChart,
  PageHeader,
  ProgressBar,
} from '../components/ui'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import {
  ACTIVITY_FEED,
  AI_INSIGHTS,
  DASHBOARD_STATS,
  ENROLLMENT_BREAKDOWN,
  FEE_COLLECTION_TREND,
  ATTENDANCE_TREND,
  LEAVE_REQUESTS,
  HELPDESK_TICKETS,
  PAYMENTS,
  ENQUIRIES,
} from '../data/mock'
import { MODULE_TILES } from '../data/nav'
import './dashboard.css'

const INSIGHT_TONE = {
  critical: { tone: 'danger', icon: 'alert' },
  warning: { tone: 'warning', icon: 'alert' },
  info: { tone: 'info', icon: 'info' },
  success: { tone: 'success', icon: 'checkCircle' },
}

export default function Dashboard() {
  const { user } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()
  const [range, setRange] = useState('This Month')

  const greeting = useMemo(() => {
    const h = new Date().getHours()
    if (h < 12) return 'Good morning'
    if (h < 17) return 'Good afternoon'
    return 'Good evening'
  }, [])

  const pendingLeaves = LEAVE_REQUESTS.filter((l) => l.status === 'Pending').length
  const openTickets = HELPDESK_TICKETS.filter((t) => t.status !== 'Closed' && t.status !== 'Resolved').length
  const newEnquiries = ENQUIRIES.filter((e) => e.status === 'New' || e.status === 'Follow-up Due').length
  const failedPayments = PAYMENTS.filter((p) => p.status === 'Failed').length

  const todoItems = [
    { id: 'td1', label: 'Leave requests awaiting approval', count: pendingLeaves, icon: 'calendar', to: '/app/people/leave', tone: 'warning' },
    { id: 'td2', label: 'Open helpdesk tickets', count: openTickets, icon: 'help', to: '/app/operations/helpdesk', tone: 'info' },
    { id: 'td3', label: 'Admission follow-ups due', count: newEnquiries, icon: 'phone', to: '/app/enrollment/enquiries', tone: 'indigo' },
    { id: 'td4', label: 'Failed fee transactions', count: failedPayments, icon: 'wallet', to: '/app/finance/payments', tone: 'danger' },
  ]

  const chartData = FEE_COLLECTION_TREND.map((m) => ({
    label: m.month,
    value: m.collected / 100000,
    color: m.collected >= m.target ? 'var(--success-500)' : 'var(--indigo-500)',
  }))

  const attendanceData = ATTENDANCE_TREND.map((d) => ({
    label: d.day,
    value: d.value,
    color: d.value >= 85 ? 'var(--indigo-500)' : 'var(--warning-500)',
  }))

  const collectionTotal = FEE_COLLECTION_TREND.reduce((s, m) => s + m.collected, 0)
  const collectionTarget = FEE_COLLECTION_TREND.reduce((s, m) => s + m.target, 0)

  return (
    <div className="dash">
      <PageHeader
        title={`${greeting}, ${user?.name?.split(' ')[0] ?? 'there'}`}
        subtitle={`${user?.designation ?? ''} · ${user?.department ?? ''} — ${user?.institution ?? ''}`}
        actions={
          <>
            <SelectRange value={range} onChange={setRange} />
            <Button variant="ai" icon="medha" onClick={() => navigate('/app/medha')}>
              Ask Medha
            </Button>
            <Button icon="download" onClick={() => toast.info('Dashboard report is being prepared…')}>
              Export
            </Button>
          </>
        }
      />

      {/* Stat strip */}
      <div className="dash__stats">
        {Object.entries(DASHBOARD_STATS).map(([key, s], i) => (
          <StatTile key={key} {...s} accent={['indigo', 'violet', 'info', 'success', 'warning', 'danger'][i]} />
        ))}
      </div>

      {/* Modules */}
      <section className="dash__modules">
        <div className="dash__section-head">
          <h2>Campus Systems</h2>
          <p>Six connected systems, one data spine.</p>
        </div>
        <div className="dash__module-grid">
          {MODULE_TILES.map((m) => (
            <Link to={m.to} className={`modtile modtile--${m.tone}`} key={m.id}>
              <span className="modtile__icon">
                <Icon name={m.icon} size={22} />
              </span>
              <div className="modtile__body">
                <strong>{m.label}</strong>
                <span>{m.blurb}</span>
              </div>
              <Icon name="arrowRight" size={17} className="modtile__arrow" />
            </Link>
          ))}
        </div>
      </section>

      <div className="dash__grid">
        {/* Activity feed */}
        <Card
          title="Live campus activity"
          subtitle="Every signal, every system"
          className="dash__activity"
          action={
            <Badge tone="success" dot>
              Streaming
            </Badge>
          }
        >
          <ul className="feed">
            {ACTIVITY_FEED.map((a) => (
              <li className="feed__item" key={a.id}>
                <span className="feed__icon">
                  <Icon name={a.icon} size={15} />
                </span>
                <div className="feed__body">
                  <div className="feed__head">
                    <span className="feed__module">{a.module}</span>
                    <span className="feed__time">{a.time}</span>
                  </div>
                  <strong className="feed__title">{a.title}</strong>
                  <span className="feed__detail">{a.detail}</span>
                </div>
              </li>
            ))}
          </ul>
        </Card>

        {/* Right column */}
        <div className="dash__side">
          <Card title="Medha insights" subtitle="Generated from live campus data" className="dash__insights">
            <ul className="insights">
              {AI_INSIGHTS.map((i) => {
                const conf = INSIGHT_TONE[i.severity] || INSIGHT_TONE.info
                return (
                  <li key={i.id} className={`insight insight--${i.severity}`}>
                    <span className="insight__icon">
                      <Icon name={conf.icon} size={15} />
                    </span>
                    <div className="insight__body">
                      <strong>{i.title}</strong>
                      <p>{i.body}</p>
                      <Badge tone={conf.tone}>{i.module}</Badge>
                    </div>
                  </li>
                )
              })}
            </ul>
            <Button variant="secondary" size="sm" icon="medha" className="dash__insights-cta" onClick={() => navigate('/app/medha')}>
              Open Medha
            </Button>
          </Card>

          <Card title="Needs your attention" subtitle="Pending approvals and actions">
            <ul className="todo">
              {todoItems.map((t) => (
                <li key={t.id}>
                  <button className="todo__item" onClick={() => navigate(t.to)}>
                    <span className={`todo__icon todo__icon--${t.tone}`}>
                      <Icon name={t.icon} size={15} />
                    </span>
                    <span className="todo__label">{t.label}</span>
                    <Badge tone={t.count > 0 ? 'warning' : 'neutral'}>{t.count}</Badge>
                    <Icon name="chevronRight" size={15} className="todo__chev" />
                  </button>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>

      {/* Charts row */}
      <div className="dash__grid dash__grid--3">
        <Card title="Fee collection" subtitle={`${range} — ₹${(collectionTotal / 10000000).toFixed(2)}Cr of ₹${(collectionTarget / 10000000).toFixed(2)}Cr`}>
          <div className="dash__chart-head">
            <div>
              <div className="dash__chart-value">₹{(collectionTotal / 10000000).toFixed(2)}Cr</div>
              <div className="dash__chart-sub">
                <span className="is-up">{Math.round((collectionTotal / collectionTarget) * 100)}%</span> of target
              </div>
            </div>
            <ProgressBar value={collectionTotal} max={collectionTarget} tone="success" size="lg" />
          </div>
          <BarChart data={chartData} height={150} />
        </Card>

        <Card title="Enrollment mix" subtitle="Active students by programme">
          <div className="dash__donut-row">
            <DonutChart data={ENROLLMENT_BREAKDOWN} size={150} thickness={20} centerValue="530" centerLabel="Students" />
            <Legend data={ENROLLMENT_BREAKDOWN} />
          </div>
        </Card>

        <Card title="Attendance trend" subtitle="Average daily attendance this week">
          <div className="dash__chart-head">
            <div>
              <div className="dash__chart-value">88.4%</div>
              <div className="dash__chart-sub">
                <span className="is-down">-1.2%</span> vs last week
              </div>
            </div>
          </div>
          <BarChart data={attendanceData} height={150} />
        </Card>
      </div>
    </div>
  )
}

function StatTile({ label, value, delta, icon, accent }) {
  const positive = delta >= 0
  return (
    <div className={`stat stat--${accent}`}>
      <div className="stat__top">
        <span className="stat__label">{label}</span>
        <span className="stat__icon">
          <Icon name={icon} size={18} />
        </span>
      </div>
      <div className="stat__value">{value}</div>
      <div className="stat__foot">
        <span className={`stat__delta ${positive ? 'is-up' : 'is-down'}`}>
          <Icon name={positive ? 'trendingUp' : 'trendingDown'} size={13} />
          {Math.abs(delta)}%
        </span>
        <span className="stat__hint">vs last term</span>
      </div>
    </div>
  )
}

function SelectRange({ value, onChange }) {
  return (
    <label className="select">
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        <option>This Month</option>
        <option>This Term</option>
        <option>This Year</option>
      </select>
      <Icon name="chevronDown" size={15} className="select__caret" />
    </label>
  )
}
