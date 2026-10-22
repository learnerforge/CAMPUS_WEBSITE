import { useMemo, useState } from 'react'
import Icon from '../../components/ui/Icon'
import {
  Badge,
  Button,
  Card,
  PageHeader,
  ProgressBar,
  StatCard,
  BarChart,
  DonutChart,
  Legend,
  DataTable,
  Tabs,
} from '../../components/ui'
import ListPage, { col } from '../../components/ListPage'
import { useToast } from '../../context/ToastContext'
import { useExport } from '../../utils/useExport'
import {
  FEE_STRUCTURES,
  PAYMENTS,
  SCHOLARSHIPS,
  EXPENSES,
  PAYROLL,
  FEE_COLLECTION_TREND,
} from '../../data/mock'
import './finance.css'

/* ------------------------------------------------------------------ */
/* Overview                                                           */
/* ------------------------------------------------------------------ */

export function FinanceOverview() {
  const toast = useToast()
  const exportCsv = useExport()
  const totalExpected = FEE_STRUCTURES.reduce((s, f) => s + f.amount * f.students, 0)
  const totalCollected = FEE_STRUCTURES.reduce((s, f) => s + f.amount * f.paid, 0)
  const totalPending = totalExpected - totalCollected
  const collectionRate = ((totalCollected / totalExpected) * 100).toFixed(1)

  const trend = FEE_COLLECTION_TREND.map((m) => ({
    label: m.month,
    value: Math.round(m.collected / 100000),
    color: m.collected >= m.target ? 'var(--success-500)' : 'var(--indigo-500)',
  }))

  const categoryMix = FEE_STRUCTURES.reduce((acc, f) => {
    const found = acc.find((a) => a.label === f.category)
    if (found) found.value += f.amount * f.paid
    else acc.push({ label: f.category, value: f.amount * f.paid })
    return acc
  }, [])

  const mixColors = ['var(--indigo-500)', 'var(--violet-500)', 'var(--success-500)', 'var(--warning-500)', 'var(--info-500)', 'var(--danger-500)', 'var(--gray-400)']
  const mix = categoryMix.map((c, i) => ({ ...c, color: mixColors[i % mixColors.length] }))

  return (
    <div>
      <PageHeader
        title="Finance"
        subtitle="Every rupee accounted for — collections, scholarships, expenses and payroll."
        breadcrumb={[{ label: 'Campus Systems' }, { label: 'Finance' }]}
        actions={
          <>
            <Button
              variant="secondary"
              icon="download"
              onClick={() =>
                exportCsv(
                  'finance-collection-trend',
                  [
                    { key: 'month', header: 'Month' },
                    { key: 'collected', header: 'Collected (₹)' },
                    { key: 'target', header: 'Target (₹)' },
                    { key: 'variance', header: 'Variance (₹)', csv: (r) => r.collected - r.target },
                  ],
                  FEE_COLLECTION_TREND,
                  { label: 'months' },
                )
              }
            >
              Export
            </Button>
            <Button icon="plus" onClick={() => toast.success('Payment entry form opened')}>Record Payment</Button>
          </>
        }
      />

      <div className="listpage__stats">
        <StatCard label="Collected (FY)" value={`₹${(totalCollected / 10000000).toFixed(2)}Cr`} icon="indianRupee" accent="success" delta={12.4} />
        <StatCard label="Expected" value={`₹${(totalExpected / 10000000).toFixed(2)}Cr`} icon="target" accent="indigo" />
        <StatCard label="Outstanding" value={`₹${(totalPending / 10000000).toFixed(2)}Cr`} icon="alert" accent="danger" hint={`${FEE_STRUCTURES.reduce((s, f) => s + f.pending, 0)} students`} />
        <StatCard label="Collection Rate" value={`${collectionRate}%`} icon="percent" accent="violet" delta={3.2} />
      </div>

      <div className="fin__grid">
        <Card title="Collection vs target" subtitle="Monthly, in lakhs">
          <BarChart data={trend} height={190} />
        </Card>

        <Card title="Revenue by category" subtitle="Collected to date">
          <div className="fin__donut">
            <DonutChart data={mix} size={160} thickness={20} centerValue={`${collectionRate}%`} centerLabel="Collected" />
            <Legend data={mix} />
          </div>
        </Card>
      </div>

      <div className="fin__grid fin__grid--2">
        <Card title="Fee structure summary" subtitle="By category and programme">
          <DataTable
            columns={[
              col.text('category', 'Category', { primary: true }),
              col.text('program', 'Programme'),
              col.number('students', 'Students'),
              {
                key: 'collected',
                header: 'Collected',
                render: (r) => (
                  <span className="cell-num">₹{((r.amount * r.paid) / 100000).toFixed(1)}L</span>
                ),
              },
              {
                key: 'pending',
                header: 'Pending',
                render: (r) => (
                  <Badge tone={r.pending > 20 ? 'danger' : r.pending > 5 ? 'warning' : 'success'}>
                    {r.pending}
                  </Badge>
                ),
              },
            ]}
            rows={FEE_STRUCTURES}
          />
        </Card>

        <Card title="Recent transactions" subtitle="Latest fee payments">
          <ul className="fin__txns">
            {PAYMENTS.slice(0, 6).map((p) => (
              <li key={p.id}>
                <span className={`fin__txn-icon fin__txn-icon--${p.status.toLowerCase()}`}>
                  <Icon name="indianRupee" size={15} />
                </span>
                <div className="fin__txn-main">
                  <strong>{p.name}</strong>
                  <span>{p.category} · {p.mode}</span>
                </div>
                <div className="fin__txn-amt">
                  <strong>₹{p.amount.toLocaleString('en-IN')}</strong>
                  <span>{p.date}</span>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Fee structure                                                      */
/* ------------------------------------------------------------------ */

export function FeeStructurePage() {
  const toast = useToast()
  return (
    <ListPage
      title="Fee Structure"
      subtitle="Programme-wise fee heads, due dates and collection status."
      breadcrumb={[{ label: 'Finance' }, { label: 'Fee Structure' }]}
      searchKeys="category program"
      searchPlaceholder="Search category or programme…"
      entityName="fee heads"
      filters={[
        { key: 'category', label: 'categories', options: [...new Set(FEE_STRUCTURES.map((f) => f.category))].map((v) => ({ value: v, label: v })) },
      ]}
      stats={[
        { label: 'Fee Heads', value: FEE_STRUCTURES.length, icon: 'layers', accent: 'indigo' },
        { label: 'Total Billed', value: `₹${(FEE_STRUCTURES.reduce((s, f) => s + f.amount * f.students, 0) / 10000000).toFixed(2)}Cr`, icon: 'indianRupee', accent: 'violet' },
        { label: 'Total Collected', value: `₹${(FEE_STRUCTURES.reduce((s, f) => s + f.amount * f.paid, 0) / 10000000).toFixed(2)}Cr`, icon: 'checkCircle', accent: 'success' },
        { label: 'Defaulters', value: FEE_STRUCTURES.reduce((s, f) => s + f.pending, 0), icon: 'alert', accent: 'danger' },
      ]}
      actions={
        <Button icon="plus" onClick={() => toast.success('Fee head form opened')}>Add Fee Head</Button>
      }
      columns={[
        col.text('category', 'Category', { primary: true }),
        col.badge('program', 'Programme', 'indigo'),
        col.money('amount', 'Amount'),
        col.number('students', 'Students'),
        col.number('paid', 'Paid'),
        col.number('pending', 'Pending'),
        col.text('dueDate', 'Due Date'),
      ]}
      rows={FEE_STRUCTURES}
      renderDetail={(f) => {
        const collected = f.amount * f.paid
        return (
          <div className="detail">
            <div className="detail__grid">
              <div className="detail__field">
                <span className="detail__label">Fee Head</span>
                <span className="detail__value">{f.category}</span>
              </div>
              <div className="detail__field">
                <span className="detail__label">Programme</span>
                <span className="detail__value">{f.program}</span>
              </div>
              <div className="detail__field">
                <span className="detail__label">Amount per Student</span>
                <span className="detail__value">₹{f.amount.toLocaleString('en-IN')}</span>
              </div>
              <div className="detail__field">
                <span className="detail__label">Due Date</span>
                <span className="detail__value">{f.dueDate}</span>
              </div>
            </div>
            <div>
              <h4 className="detail__section-title">Collection</h4>
              <ProgressBar value={f.paid} max={f.students} tone="success" size="lg" showLabel />
              <ul className="detail__list" style={{ marginTop: 12 }}>
                <li><span>Total billed</span><strong>₹{(f.amount * f.students).toLocaleString('en-IN')}</strong></li>
                <li><span>Collected</span><strong>₹{collected.toLocaleString('en-IN')}</strong></li>
                <li><span>Outstanding</span><strong>₹{(f.amount * f.pending).toLocaleString('en-IN')}</strong></li>
              </ul>
            </div>
          </div>
        )
      }}
    />
  )
}

/* ------------------------------------------------------------------ */
/* Payments                                                           */
/* ------------------------------------------------------------------ */

export function PaymentsPage() {
  const toast = useToast()
  const exportCsv = useExport()
  const [tab, setTab] = useState('all')

  const tabRows = useMemo(() => {
    if (tab === 'all') return PAYMENTS
    return PAYMENTS.filter((p) => p.status.toLowerCase() === tab)
  }, [tab])

  return (
    <div>
      <PageHeader
        title="Fee Payments"
        subtitle="Every transaction across UPI, net banking and card rails."
        breadcrumb={[{ label: 'Finance' }, { label: 'Fee Payments' }]}
        actions={
          <>
            <Button
              variant="secondary"
              icon="download"
              onClick={() =>
                exportCsv(
                  'fee-payments',
                  [
                    { key: 'id', header: 'Receipt' },
                    { key: 'student', header: 'Roll No' },
                    { key: 'name', header: 'Student' },
                    { key: 'program', header: 'Programme' },
                    { key: 'category', header: 'Category' },
                    { key: 'amount', header: 'Amount (₹)' },
                    { key: 'mode', header: 'Mode' },
                    { key: 'txn', header: 'Transaction ID' },
                    { key: 'date', header: 'Date' },
                    { key: 'status', header: 'Status' },
                  ],
                  tabRows,
                  { label: 'transactions' },
                )
              }
            >
              Export
            </Button>
            <Button icon="plus" onClick={() => toast.success('Manual payment entry opened')}>Record Payment</Button>
          </>
        }
      />

      <div className="listpage__stats">
        <StatCard label="Successful" value={PAYMENTS.filter((p) => p.status === 'Success').length} icon="checkCircle" accent="success" />
        <StatCard label="Partial" value={PAYMENTS.filter((p) => p.status === 'Partial').length} icon="percent" accent="warning" />
        <StatCard label="Failed" value={PAYMENTS.filter((p) => p.status === 'Failed').length} icon="xCircle" accent="danger" />
        <StatCard label="Refunded" value={PAYMENTS.filter((p) => p.status === 'Refunded').length} icon="refresh" accent="info" />
      </div>

      <Card padded={false}>
        <div className="fin__tabbar">
          <Tabs
            tabs={[
              { id: 'all', label: 'All', count: PAYMENTS.length },
              { id: 'success', label: 'Successful', count: PAYMENTS.filter((p) => p.status === 'Success').length },
              { id: 'partial', label: 'Partial', count: PAYMENTS.filter((p) => p.status === 'Partial').length },
              { id: 'failed', label: 'Failed', count: PAYMENTS.filter((p) => p.status === 'Failed').length },
              { id: 'refunded', label: 'Refunded', count: PAYMENTS.filter((p) => p.status === 'Refunded').length },
            ]}
            active={tab}
            onChange={setTab}
          />
        </div>
        <DataTable
          columns={[
            col.text('id', 'Receipt', { primary: true }),
            col.text('name', 'Student'),
            col.badge('program', 'Programme', 'indigo'),
            col.badge('category', 'Category', 'neutral'),
            col.money('amount', 'Amount'),
            col.badge('mode', 'Mode', 'violet'),
            col.text('txn', 'Transaction ID'),
            col.text('date', 'Date'),
            col.status('status'),
          ]}
          rows={tabRows}
        />
      </Card>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Scholarships                                                       */
/* ------------------------------------------------------------------ */

export function ScholarshipsPage() {
  const toast = useToast()
  return (
    <ListPage
      title="Scholarships"
      subtitle="Schemes, sanctioned budgets and disbursement tracking."
      breadcrumb={[{ label: 'Finance' }, { label: 'Scholarships' }]}
      searchKeys="name type"
      searchPlaceholder="Search scheme or type…"
      entityName="scholarship schemes"
      filters={[
        { key: 'type', label: 'types', options: ['Merit', 'Government', 'Concession'].map((v) => ({ value: v, label: v })) },
      ]}
      stats={[
        { label: 'Active Schemes', value: SCHOLARSHIPS.filter((s) => s.status === 'Active').length, icon: 'gift', accent: 'indigo' },
        { label: 'Beneficiaries', value: SCHOLARSHIPS.reduce((s, x) => s + x.beneficiaries, 0), icon: 'users', accent: 'violet' },
        { label: 'Total Budget', value: `₹${(SCHOLARSHIPS.reduce((s, x) => s + x.budget, 0) / 10000000).toFixed(2)}Cr`, icon: 'indianRupee', accent: 'info' },
        {
          label: 'Disbursed',
          value: `₹${(SCHOLARSHIPS.reduce((s, x) => s + x.disbursed, 0) / 10000000).toFixed(2)}Cr`,
          icon: 'checkCircle',
          accent: 'success',
        },
      ]}
      actions={<Button icon="plus" onClick={() => toast.success('Scholarship scheme form opened')}>New Scheme</Button>}
      columns={[
        col.text('name', 'Scheme', { primary: true }),
        col.badge('type', 'Type', 'indigo'),
        col.money('amount', 'Per Student'),
        col.number('beneficiaries', 'Beneficiaries'),
        col.number('applied', 'Applications'),
        col.money('budget', 'Budget'),
        col.money('disbursed', 'Disbursed'),
        col.status('status'),
      ]}
      rows={SCHOLARSHIPS}
      renderDetail={(s) => (
        <div className="detail">
          <div className="detail__grid">
            <div className="detail__field">
              <span className="detail__label">Scheme</span>
              <span className="detail__value">{s.name}</span>
            </div>
            <div className="detail__field">
              <span className="detail__label">Type</span>
              <span className="detail__value">{s.type}</span>
            </div>
            <div className="detail__field">
              <span className="detail__label">Award per Student</span>
              <span className="detail__value">₹{s.amount.toLocaleString('en-IN')}</span>
            </div>
            <div className="detail__field">
              <span className="detail__label">Status</span>
              <span className="detail__value">{s.status}</span>
            </div>
          </div>
          <div>
            <h4 className="detail__section-title">Budget utilisation</h4>
            <ProgressBar value={s.disbursed} max={s.budget} tone="success" size="lg" showLabel />
            <ul className="detail__list" style={{ marginTop: 12 }}>
              <li><span>Sanctioned budget</span><strong>₹{s.budget.toLocaleString('en-IN')}</strong></li>
              <li><span>Disbursed</span><strong>₹{s.disbursed.toLocaleString('en-IN')}</strong></li>
              <li><span>Applications received</span><strong>{s.applied}</strong></li>
              <li><span>Beneficiaries selected</span><strong>{s.beneficiaries}</strong></li>
            </ul>
          </div>
        </div>
      )}
    />
  )
}

/* ------------------------------------------------------------------ */
/* Expenses                                                           */
/* ------------------------------------------------------------------ */

export function ExpensesPage() {
  const toast = useToast()
  const total = EXPENSES.reduce((s, e) => s + e.amount, 0)
  return (
    <ListPage
      title="Expenses"
      subtitle="Department-wise expenditure with approval workflow."
      breadcrumb={[{ label: 'Finance' }, { label: 'Expenses' }]}
      searchKeys="category department"
      searchPlaceholder="Search category or department…"
      entityName="expense entries"
      filters={[
        { key: 'status', label: 'status', options: ['Approved', 'Pending', 'Rejected'].map((v) => ({ value: v, label: v })) },
      ]}
      stats={[
        { label: 'Total Spend', value: `₹${(total / 100000).toFixed(1)}L`, icon: 'indianRupee', accent: 'indigo' },
        { label: 'Approved', value: EXPENSES.filter((e) => e.status === 'Approved').length, icon: 'checkCircle', accent: 'success' },
        { label: 'Pending Approval', value: EXPENSES.filter((e) => e.status === 'Pending').length, icon: 'clock', accent: 'warning' },
        { label: 'Rejected', value: EXPENSES.filter((e) => e.status === 'Rejected').length, icon: 'xCircle', accent: 'danger' },
      ]}
      actions={
        <Button icon="plus" onClick={() => toast.success('Expense claim form opened')}>New Expense</Button>
      }
      columns={[
        col.text('id', 'Voucher', { primary: true }),
        col.text('category', 'Category'),
        col.badge('department', 'Department', 'indigo'),
        col.money('amount', 'Amount'),
        col.text('date', 'Date'),
        col.status('status'),
      ]}
      rows={EXPENSES}
      renderDetail={(e) => (
        <div className="detail">
          <div className="detail__grid">
            <div className="detail__field">
              <span className="detail__label">Voucher No</span>
              <span className="detail__value mono">{e.id}</span>
            </div>
            <div className="detail__field">
              <span className="detail__label">Category</span>
              <span className="detail__value">{e.category}</span>
            </div>
            <div className="detail__field">
              <span className="detail__label">Department</span>
              <span className="detail__value">{e.department}</span>
            </div>
            <div className="detail__field">
              <span className="detail__label">Amount</span>
              <span className="detail__value">₹{e.amount.toLocaleString('en-IN')}</span>
            </div>
            <div className="detail__field">
              <span className="detail__label">Date</span>
              <span className="detail__value">{e.date}</span>
            </div>
            <div className="detail__field">
              <span className="detail__label">Status</span>
              <span className="detail__value">{e.status}</span>
            </div>
          </div>
          <ul className="detail__list">
            <li><span>Approver</span><strong>Finance Officer</strong></li>
            <li><span>Payment mode</span><strong>NEFT</strong></li>
            <li><span>Budget head</span><strong>{e.category} — {e.department}</strong></li>
          </ul>
        </div>
      )}
    />
  )
}

/* ------------------------------------------------------------------ */
/* Payroll                                                            */
/* ------------------------------------------------------------------ */

export function PayrollPage() {
  const toast = useToast()
  const exportCsv = useExport()
  const last = PAYROLL[0]
  return (
    <div>
      <PageHeader
        title="Payroll"
        subtitle="Monthly salary cycles, statutory deductions and disbursement."
        breadcrumb={[{ label: 'Finance' }, { label: 'Payroll' }]}
        actions={
          <>
            <Button
              variant="secondary"
              icon="download"
              onClick={() =>
                exportCsv(
                  'payroll-register',
                  [
                    { key: 'id', header: 'Cycle ID' },
                    { key: 'month', header: 'Month' },
                    { key: 'employees', header: 'Employees' },
                    { key: 'gross', header: 'Gross (₹)' },
                    { key: 'tds', header: 'TDS (₹)' },
                    { key: 'pf', header: 'PF (₹)' },
                    { key: 'net', header: 'Net Payable (₹)' },
                    { key: 'status', header: 'Status' },
                  ],
                  PAYROLL,
                  { label: 'cycles' },
                )
              }
            >
              Export
            </Button>
            <Button icon="plus" onClick={() => toast.success('Payroll run initiated for November')}>Run Payroll</Button>
          </>
        }
      />

      <div className="listpage__stats">
        <StatCard label="Employees" value={last.employees} icon="users" accent="indigo" />
        <StatCard label="Gross Payroll" value={`₹${(last.gross / 100000).toFixed(1)}L`} icon="wallet" accent="violet" delta={1.4} />
        <StatCard label="Net Payable" value={`₹${(last.net / 100000).toFixed(1)}L`} icon="indianRupee" accent="success" />
        <StatCard label="Deductions" value={`₹${((last.tds + last.pf) / 100000).toFixed(1)}L`} icon="percent" accent="warning" />
      </div>

      <Card title="Payroll cycles" subtitle="Recent and upcoming months" padded={false}>
        <DataTable
          columns={[
            col.text('month', 'Month', { primary: true }),
            col.number('employees', 'Employees'),
            col.money('gross', 'Gross'),
            col.money('tds', 'TDS'),
            col.money('pf', 'PF'),
            col.money('net', 'Net Payable'),
            col.status('status'),
          ]}
          rows={PAYROLL}
        />
      </Card>
    </div>
  )
}
