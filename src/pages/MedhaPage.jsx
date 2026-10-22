import { useEffect, useRef, useState } from 'react'
import Icon from '../components/ui/Icon'
import { Badge, Button, Card, PageHeader } from '../components/ui'
import { useToast } from '../context/ToastContext'
import { AI_INSIGHTS, MEDHA_SUGGESTIONS } from '../data/mock'
import './medha.css'

const SEED_MESSAGES = [
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
      {
        type: 'text',
        text: 'I found **3 students** in CSE-A (Semester 7) with attendance below the 75% threshold this academic year.',
      },
      {
        type: 'table',
        columns: ['Roll No', 'Student', 'Attendance', 'CGPA', 'Status'],
        rows: [
          ['21CS018', 'Arjun Mehta', '78%', '7.4', 'Active'],
          ['21CS029', 'Sai Kiran', '71%', '6.8', 'Active'],
          ['21CS063', 'Manish Yadav', '68%', '6.2', 'At Risk'],
        ],
      },
      {
        type: 'text',
        text: 'Two of these students have fallen below the minimum attendance requirement of 75% and may be barred from the end-semester examination. Want me to notify the course faculty?',
      },
    ],
    actions: [
      { label: 'Notify faculty', kind: 'primary' },
      { label: 'Send parent SMS', kind: 'ghost' },
      { label: 'Export list', kind: 'ghost' },
    ],
  },
]

/** Canned answers keyed by intent detection in the prompt. */
function buildReply(prompt) {
  const p = prompt.toLowerCase()

  if (/fee|payment|due|collect/.test(p)) {
    return {
      blocks: [
        {
          type: 'text',
          text: 'Here is the current fee position for the 2025-26 academic year.',
        },
        {
          type: 'table',
          columns: ['Category', 'Billed', 'Collected', 'Outstanding'],
          rows: [
            ['Tuition', '₹1.31Cr', '₹1.24Cr', '₹7.2L'],
            ['Hostel', '₹19.4L', '₹18.1L', '₹1.3L'],
            ['Examination', '₹31.8L', '₹30.7L', '₹1.1L'],
            ['Library', '₹18.6L', '₹17.5L', '₹1.1L'],
          ],
        },
        {
          type: 'text',
          text: '**18 students** have overdue balances exceeding 30 days. October collection is running 14% below target — Medha can trigger reminder SMS to the 18 defaulters.',
        },
      ],
      actions: [
        { label: 'Send reminders', kind: 'primary' },
        { label: 'Open Finance', kind: 'ghost' },
      ],
    }
  }

  if (/attendance|default|present/.test(p)) {
    return {
      blocks: [
        {
          type: 'text',
          text: 'Attendance analysis for the last 30 days across all programmes.',
        },
        {
          type: 'stats',
          items: [
            { label: 'Overall', value: '88.4%' },
            { label: 'Below 75%', value: '12' },
            { label: 'Absent Today', value: '31' },
          ],
        },
        {
          type: 'text',
          text: '**ME (Mechanical)** has the weakest attendance at 78.2%, driven by Dr. M. Rao’s Thermodynamics II section. A schedule rebalance could recover roughly 3% next month.',
        },
      ],
      actions: [
        { label: 'Schedule rebalance', kind: 'primary' },
        { label: 'Notify HOD', kind: 'ghost' },
      ],
    }
  }

  if (/hostel|room|bed|accommodation/.test(p)) {
    return {
      blocks: [
        {
          type: 'text',
          text: 'Hostel occupancy is at **93.2%** across four blocks.',
        },
        {
          type: 'table',
          columns: ['Block', 'Type', 'Capacity', 'Occupied', 'Vacant'],
          rows: [
            ['A', 'Boys', '180', '168', '12'],
            ['B', 'Girls', '200', '192', '8'],
            ['C', 'Boys', '160', '149', '11'],
            ['D', 'Girls', '120', '101', '19'],
          ],
        },
        {
          type: 'text',
          text: '**3 vacant rooms** are available in Block C. Two pending room-change requests can be accommodated immediately.',
        },
      ],
      actions: [
        { label: 'Approve room changes', kind: 'primary' },
        { label: 'Open Hostel', kind: 'ghost' },
      ],
    }
  }

  if (/obe|attainment|outcome|po/.test(p)) {
    return {
      blocks: [
        {
          type: 'text',
          text: 'OBE attainment snapshot for the current cycle.',
        },
        {
          type: 'table',
          columns: ['Course', 'PO', 'PS', 'CO', 'Level'],
          rows: [
            ['CS301', '1.42', '1.38', '0.82', 'High'],
            ['EC305', '1.35', '1.29', '0.79', 'High'],
            ['CS401', '1.21', '1.15', '0.76', 'Medium'],
            ['ME301', '1.08', '1.02', '0.68', 'Medium'],
            ['CV302', '1.19', '1.11', '0.74', 'Medium'],
          ],
        },
        {
          type: 'text',
          text: '**ME301** has the lowest attainment and is the only course below the 1.5 target across all three levels. I can draft a corrective action plan for the HoD.',
        },
      ],
      actions: [
        { label: 'Draft CAP', kind: 'primary' },
        { label: 'Open OBE', kind: 'ghost' },
      ],
    }
  }

  if (/leave|staff|employee|hr/.test(p)) {
    return {
      blocks: [
        {
          type: 'text',
          text: '**2 leave requests** are awaiting your approval.',
        },
        {
          type: 'table',
          columns: ['Employee', 'Type', 'Dates', 'Days'],
          rows: [
            ['Prof. D. Naik', 'Earned Leave', '23 – 24 Oct', '2'],
            ['Dr. A. Menon', 'Earned Leave', '02 – 06 Nov', '5'],
          ],
        },
        {
          type: 'text',
          text: 'Neither overlaps with a scheduled class or exam duty. I can approve both and notify the concerned department heads.',
        },
      ],
      actions: [
        { label: 'Approve both', kind: 'primary' },
        { label: 'Review details', kind: 'ghost' },
      ],
    }
  }

  if (/admission|enquir|applicant|counsel/.test(p)) {
    return {
      blocks: [
        {
          type: 'text',
          text: 'Enrollment pipeline for the 2026-27 intake.',
        },
        {
          type: 'stats',
          items: [
            { label: 'Applications', value: '1,248' },
            { label: 'Confirmed', value: '704' },
            { label: 'Joined', value: '612' },
          ],
        },
        {
          type: 'text',
          text: '**3 enquiries** are marked follow-up due with no contact in the last 5 days. Two are high lead-score (B.Tech CSE) and worth a priority call.',
        },
      ],
      actions: [
        { label: 'Assign follow-ups', kind: 'primary' },
        { label: 'Open Enrollment', kind: 'ghost' },
      ],
    }
  }

  if (/bonafide|certificate|letter|document|draft/.test(p)) {
    return {
      blocks: [
        {
          type: 'text',
          text: 'I can generate a bonafide certificate. Here is a draft for **21CS042 — Priya Sharma** (B.Tech CSE, Semester 7):',
        },
        {
          type: 'text',
          text: '> **CERTIFICATE**\n> This is to certify that *Priya Sharma* (Roll No. 21CS042) is a bonafide student of Mahatma Gandhi Institute of Technology, Hyderabad, pursuing B.Tech in Computer Science & Engineering, Semester 7, for the academic year 2025-26.\n> *Date: 22 October 2026*\n> *Dr. Anil Kumar — Principal*',
        },
        {
          type: 'text',
          text: 'The draft is ready for the Principal’s digital signature. Shall I route it for approval?',
        },
      ],
      actions: [
        { label: 'Route for signature', kind: 'primary' },
        { label: 'Regenerate', kind: 'ghost' },
      ],
    }
  }

  if (/payroll|salary|ctc|payslip/.test(p)) {
    return {
      blocks: [
        {
          type: 'text',
          text: 'The **October 2026** payroll cycle has been processed for 214 staff.',
        },
        {
          type: 'table',
          columns: ['Component', 'Amount'],
          rows: [
            ['Gross payroll', '₹48.50L'],
            ['TDS', '₹5.12L'],
            ['Provident fund', '₹6.83L'],
            ['Net payable', '₹36.20L'],
          ],
        },
        {
          type: 'text',
          text: 'The November cycle is still in draft. Three new joiners from the October intake have not been added to the payroll master.',
        },
      ],
      actions: [
        { label: 'Add new joiners', kind: 'primary' },
        { label: 'Open Payroll', kind: 'ghost' },
      ],
    }
  }

  return {
    blocks: [
      {
        type: 'text',
        text: 'I looked across Academics, Finance, Operations, Enrollment and People for that. Here is what I found:',
      },
      {
        type: 'text',
        text: '**12 items need attention** across the campus right now — 4 pending approvals, 3 attendance risks, 3 failed fee transactions and 2 overdue scholarship disbursals. The most urgent is the attendance risk for **Sai Kiran (21CS029)**, who drops below exam eligibility in 2 days.',
      },
    ],
    actions: [
      { label: 'Show all 12 items', kind: 'primary' },
      { label: 'Summarise by module', kind: 'ghost' },
    ],
  }
}

export default function MedhaPage() {
  const [messages, setMessages] = useState(SEED_MESSAGES)
  const [input, setInput] = useState('')
  const [thinking, setThinking] = useState(false)
  const endRef = useRef(null)
  const toast = useToast()

  useEffect(() => {
    endRef.current?.scrollIntoView?.({ behavior: 'smooth', block: 'end' })
  }, [messages, thinking])

  const send = (text) => {
    const trimmed = (text ?? input).trim()
    if (!trimmed || thinking) return

    const now = new Date()
    const time = now.toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit', hour12: false })

    setMessages((m) => [...m, { id: `u${Date.now()}`, role: 'user', text: trimmed, time }])
    setInput('')
    setThinking(true)

    setTimeout(() => {
      setMessages((m) => [
        ...m,
        {
          id: `a${Date.now()}`,
          role: 'assistant',
          time,
          ...buildReply(trimmed),
        },
      ])
      setThinking(false)
    }, 900)
  }

  const handleAction = (label) => {
    if (label === 'Open Finance') toast.info('Opening Finance module…')
    else if (label === 'Open Hostel') toast.info('Opening Hostel module…')
    else if (label === 'Open OBE') toast.info('Opening OBE reports…')
    else if (label === 'Open Enrollment') toast.info('Opening Enrollment module…')
    else if (label === 'Open Payroll') toast.info('Opening Payroll…')
    else toast.success(`“${label}” — action queued for Medha to execute`)
  }

  return (
    <div className="medha">
      <PageHeader
        title="Medha"
        subtitle="The intelligence layer across every campus system."
        breadcrumb={[{ label: 'Overview' }, { label: 'Medha AI' }]}
        actions={
          <Badge tone="violet" dot>
            Connected to live campus data
          </Badge>
        }
      />

      <div className="medha__layout">
        <Card className="medha__chat" padded={false}>
          <div className="medha__chat-head">
            <span className="medha__avatar">
              <Icon name="medha" size={20} />
            </span>
            <div>
              <strong>Medha</strong>
              <span>AI campus assistant</span>
            </div>
            <span className="medha__pulse" />
          </div>

          <div className="medha__messages">
            {messages.map((m) => (
              <Message key={m.id} message={m} onAction={handleAction} />
            ))}

            {thinking && (
              <div className="medha__msg medha__msg--assistant">
                <span className="medha__avatar medha__avatar--sm">
                  <Icon name="medha" size={15} />
                </span>
                <div className="medha__bubble">
                  <span className="medha__typing">
                    <i />
                    <i />
                    <i />
                  </span>
                </div>
              </div>
            )}

            <div ref={endRef} />
          </div>

          <div className="medha__composer">
            <div className="medha__suggestions">
              {MEDHA_SUGGESTIONS.slice(0, 4).map((s) => (
                <button key={s} onClick={() => send(s)}>
                  {s}
                </button>
              ))}
            </div>
            <form
              className="medha__input"
              onSubmit={(e) => {
                e.preventDefault()
                send()
              }}
            >
              <button type="button" className="medha__attach" aria-label="Attach file">
                <Icon name="paperclip" size={18} />
              </button>
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask Medha about anything on campus…"
                aria-label="Message Medha"
              />
              <button type="submit" className="medha__send" disabled={!input.trim() || thinking} aria-label="Send message">
                <Icon name="send" size={17} />
              </button>
            </form>
          </div>
        </Card>

        <div className="medha__side">
          <Card title="Proactive insights" subtitle="Medha watches these for you">
            <ul className="medha__insights">
              {AI_INSIGHTS.map((i) => (
                <li key={i.id}>
                  <span className={`medha__ins-dot medha__ins-dot--${i.severity}`} />
                  <div>
                    <strong>{i.title}</strong>
                    <p>{i.body}</p>
                    <Badge tone="neutral">{i.module}</Badge>
                  </div>
                </li>
              ))}
            </ul>
          </Card>

          <Card title="Try asking" subtitle="Common campus questions">
            <ul className="medha__asks">
              {MEDHA_SUGGESTIONS.map((s) => (
                <li key={s}>
                  <button onClick={() => send(s)}>
                    <Icon name="sparkles" size={14} />
                    {s}
                  </button>
                </li>
              ))}
            </ul>
          </Card>

          <Card title="Connected systems" subtitle="Data Medha can read">
            <ul className="medha__systems">
              {[
                ['Academics', 'courses · attendance · exams · OBE'],
                ['Finance', 'fees · scholarships · payroll'],
                ['Operations', 'hostel · transport · library · helpdesk'],
                ['Enrollment', 'enquiries · applications · admissions'],
                ['People', 'staff · leave · appraisals · research'],
              ].map(([name, detail]) => (
                <li key={name}>
                  <span className="medha__sys-dot" />
                  <div>
                    <strong>{name}</strong>
                    <span>{detail}</span>
                  </div>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </div>
  )
}

function Message({ message, onAction }) {
  if (message.role === 'user') {
    return (
      <div className="medha__msg medha__msg--user">
        <div className="medha__bubble">
          <p>{message.text}</p>
          <span className="medha__time">{message.time}</span>
        </div>
      </div>
    )
  }

  return (
    <div className="medha__msg medha__msg--assistant">
      <span className="medha__avatar medha__avatar--sm">
        <Icon name="medha" size={15} />
      </span>
      <div className="medha__bubble">
        {message.blocks?.map((b, i) => (
          <Block key={i} block={b} />
        ))}

        {message.actions && (
          <div className="medha__actions">
            {message.actions.map((a) => (
              <button
                key={a.label}
                className={`medha__action medha__action--${a.kind}`}
                onClick={() => onAction(a.label)}
              >
                {a.label}
              </button>
            ))}
          </div>
        )}

        <span className="medha__time">{message.time}</span>
      </div>
    </div>
  )
}

function Block({ block }) {
  if (block.type === 'text') {
    return (
      <p className="medha__text" dangerouslySetInnerHTML={{ __html: renderMarkdown(block.text) }} />
    )
  }

  if (block.type === 'table') {
    return (
      <div className="medha__table-wrap">
        <table className="medha__table">
          <thead>
            <tr>
              {block.columns.map((c) => (
                <th key={c}>{c}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {block.rows.map((row, i) => (
              <tr key={i}>
                {row.map((cell, j) => (
                  <td key={j} className={j === 0 ? 'mono' : undefined}>
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  if (block.type === 'stats') {
    return (
      <div className="medha__stats">
        {block.items.map((s) => (
          <div key={s.label}>
            <strong>{s.value}</strong>
            <span>{s.label}</span>
          </div>
        ))}
      </div>
    )
  }

  return null
}

/** Minimal inline markdown: **bold**, *italic*, and blockquote lines. */
function renderMarkdown(text) {
  const esc = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

  return esc
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/\n/g, '<br />')
}
