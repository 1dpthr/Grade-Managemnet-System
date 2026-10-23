import { FormEvent, ReactNode, useMemo, useState } from 'react'

type Subject = 'math' | 'science' | 'english'
type Marks = Record<Subject, string>
type RecordRow = {
  id: number
  name: string
  roll: string
  className: string
  marks: Record<Subject, number>
}

const initialRecords: RecordRow[] = [
  {
    id: 1,
    name: 'Aria Bennett',
    roll: 'ST-1042',
    className: '10-A',
    marks: { math: 92, science: 88, english: 91 },
  },
  {
    id: 2,
    name: 'Ethan Cole',
    roll: 'ST-1038',
    className: '10-A',
    marks: { math: 76, science: 81, english: 73 },
  },
  {
    id: 3,
    name: 'Maya Rodriguez',
    roll: 'ST-1029',
    className: '10-B',
    marks: { math: 65, science: 71, english: 69 },
  },
  {
    id: 4,
    name: 'Noah Williams',
    roll: 'ST-1017',
    className: '9-A',
    marks: { math: 38, science: 44, english: 29 },
  },
]

function Icon({
  children,
  className = 'h-5 w-5',
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  )
}

function getStats(marks: Record<Subject, number>) {
  const values = Object.values(marks)
  const total = values.reduce((sum, value) => sum + value, 0)
  const average = total / values.length
  const passed = values.every((value) => value >= 35)
  let grade = 'F'
  if (passed && average >= 90) grade = 'A'
  else if (passed && average >= 80) grade = 'B'
  else if (passed && average >= 70) grade = 'C'
  else if (passed && average >= 60) grade = 'D'
  else if (passed) grade = 'E'
  return { total, average, passed, grade }
}

export default function App() {
  const [name, setName] = useState('')
  const [roll, setRoll] = useState('')
  const [className, setClassName] = useState('')
  const [marks, setMarks] = useState<Marks>({
    math: '',
    science: '',
    english: '',
  })
  const [records, setRecords] = useState(initialRecords)
  const [search, setSearch] = useState('')
  const [message, setMessage] = useState('')

  const numericMarks = useMemo(
    () => ({
      math: Number(marks.math) || 0,
      science: Number(marks.science) || 0,
      english: Number(marks.english) || 0,
    }),
    [marks],
  )
  const stats = getStats(numericMarks)
  const formComplete =
    name.trim() &&
    roll.trim() &&
    className.trim() &&
    Object.values(marks).every((mark) => mark !== '')

  const filteredRecords = records.filter((record) =>
    `${record.name} ${record.roll} ${record.className}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  )

  const updateMark = (subject: Subject, value: string) => {
    const nextValue = Math.min(100, Math.max(0, Number(value)))
    setMarks((current) => ({
      ...current,
      [subject]: value === '' ? '' : String(nextValue),
    }))
  }

  const resetForm = () => {
    setName('')
    setRoll('')
    setClassName('')
    setMarks({ math: '', science: '', english: '' })
    setMessage('')
  }

  const saveRecord = (event: FormEvent) => {
    event.preventDefault()
    if (!formComplete) {
      setMessage('Please complete all student and marks fields.')
      return
    }
    setRecords((current) => [
      {
        id: Date.now(),
        name: name.trim(),
        roll: roll.trim(),
        className: className.trim(),
        marks: numericMarks,
      },
      ...current,
    ])
    resetForm()
    setMessage('Student record saved successfully.')
  }

  return (
    <div className="min-h-screen bg-[#f4f7fb] text-[#17213a]">
      <header className="border-b border-[#e6eaf0] bg-white">
        <div className="mx-auto flex max-w-[1480px] items-center justify-between px-5 py-4 sm:px-8 lg:px-10">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#5b5ce2] text-white shadow-[0_7px_18px_rgba(91,92,226,.28)]">
              <Icon className="h-5 w-5">
                <path d="m3 10 9-5 9 5-9 5-9-5Z" />
                <path d="M7 12.5v4c2.8 2 7.2 2 10 0v-4M21 10v6" />
              </Icon>
            </div>
            <div>
              <p className="text-[17px] font-bold tracking-[-.02em]">
                GradeFlow
              </p>
              <p className="text-xs text-[#8490a7]">Academic workspace</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              className="hidden h-10 w-10 items-center justify-center rounded-xl border border-[#e4e8ef] text-[#7b869e] transition hover:bg-[#f5f6fa] sm:flex"
              aria-label="Notifications"
            >
              <Icon>
                <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
                <path d="M10 21h4" />
              </Icon>
            </button>
            <div className="flex items-center gap-2.5 border-l border-[#e7eaf0] pl-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#e8e8ff] text-xs font-bold text-[#5556cd]">
                AM
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-semibold">Alex Morgan</p>
                <p className="text-[11px] text-[#8c96aa]">Administrator</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1480px] px-5 py-7 sm:px-8 lg:px-10 lg:py-9">
        <div className="mb-7">
          <p className="mb-1.5 text-xs font-bold uppercase tracking-[.18em] text-[#5b5ce2]">
            Student management
          </p>
          <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
            <div>
              <h1 className="text-2xl font-bold tracking-[-.035em] sm:text-[30px]">
                Grade Management
              </h1>
              <p className="mt-1 text-sm text-[#7e899e]">
                Enter marks, calculate results, and manage student records.
              </p>
            </div>
            <p className="text-xs font-medium text-[#9aa3b5]">
              Academic year · 2024–25
            </p>
          </div>
        </div>

        <form onSubmit={saveRecord}>
          <div className="grid gap-5 xl:grid-cols-[1.45fr_.7fr]">
            <div className="space-y-5">
              <section className="card">
                <div className="section-heading">
                  <div className="section-icon">
                    <Icon>
                      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </Icon>
                  </div>
                  <div>
                    <h2>Student Information</h2>
                    <p>Enter the student’s basic details</p>
                  </div>
                  <span className="ml-auto text-xs font-medium text-[#a0a8b7]">
                    All fields required
                  </span>
                </div>
                <div className="grid gap-4 p-5 sm:grid-cols-3 sm:p-6">
                  <label className="field">
                    <span>Student name</span>
                    <input
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      placeholder="e.g. Olivia Martin"
                    />
                  </label>
                  <label className="field">
                    <span>Roll number</span>
                    <input
                      value={roll}
                      onChange={(event) => setRoll(event.target.value)}
                      placeholder="e.g. ST-1051"
                    />
                  </label>
                  <label className="field">
                    <span>Class</span>
                    <div className="relative">
                      <select
                        value={className}
                        onChange={(event) => setClassName(event.target.value)}
                      >
                        <option value="">Select class</option>
                        <option>9-A</option>
                        <option>9-B</option>
                        <option>10-A</option>
                        <option>10-B</option>
                        <option>11-A</option>
                        <option>12-A</option>
                      </select>
                      <Icon className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8993a7]">
                        <path d="m6 9 6 6 6-6" />
                      </Icon>
                    </div>
                  </label>
                </div>
              </section>

              <section className="card">
                <div className="section-heading">
                  <div className="section-icon bg-[#e5f8f1] text-[#1a9b73]">
                    <Icon>
                      <path d="M4 19.5V4.7A1.7 1.7 0 0 1 5.7 3H19v18H5.5A1.5 1.5 0 0 1 4 19.5Z" />
                      <path d="M4 19.5A1.5 1.5 0 0 1 5.5 18H19M8 7h7M8 11h5" />
                    </Icon>
                  </div>
                  <div>
                    <h2>Marks Entry</h2>
                    <p>Enter scores between 0 and 100</p>
                  </div>
                </div>
                <div className="grid gap-4 p-5 sm:grid-cols-3 sm:p-6">
                  {(
                    [
                      ['math', 'Math', 'M'],
                      ['science', 'Science', 'S'],
                      ['english', 'English', 'E'],
                    ] as const
                  ).map(([subject, label, initial]) => (
                    <label className="subject-field" key={subject}>
                      <span className={`subject-badge ${subject}`}>
                        {initial}
                      </span>
                      <span className="font-semibold text-[#263149]">
                        {label}
                      </span>
                      <div className="relative mt-3">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={marks[subject]}
                          onChange={(event) =>
                            updateMark(subject, event.target.value)
                          }
                          placeholder="0"
                          aria-label={`${label} marks`}
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-[#a1a9b8]">
                          / 100
                        </span>
                      </div>
                    </label>
                  ))}
                </div>
              </section>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-1">
              <section className="overflow-hidden rounded-2xl bg-[#242456] text-white shadow-[0_12px_30px_rgba(34,34,82,.16)]">
                <div className="flex items-center gap-2 border-b border-white/10 px-5 py-4">
                  <Icon className="h-4 w-4 text-[#aaaaff]">
                    <path d="M4 19V9M10 19V5M16 19v-7M22 19V3" />
                  </Icon>
                  <h2 className="text-sm font-semibold">Performance Summary</h2>
                </div>
                <div className="grid grid-cols-2 divide-x divide-white/10 px-2 py-6">
                  <div className="px-4">
                    <p className="text-xs font-medium text-[#a8aacb]">
                      Total marks
                    </p>
                    <p className="mt-2 text-3xl font-bold tracking-[-.04em]">
                      {stats.total}
                      <span className="ml-1 text-sm font-medium text-[#888bb4]">
                        /300
                      </span>
                    </p>
                  </div>
                  <div className="px-5">
                    <p className="text-xs font-medium text-[#a8aacb]">
                      Average
                    </p>
                    <p className="mt-2 text-3xl font-bold tracking-[-.04em]">
                      {stats.average.toFixed(1)}
                      <span className="ml-0.5 text-base text-[#a9aad0]">%</span>
                    </p>
                  </div>
                </div>
                <div className="mx-5 mb-5 h-1.5 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-[#8f91ff] transition-all duration-300"
                    style={{ width: `${stats.average}%` }}
                  />
                </div>
              </section>

              <section className="card flex flex-col">
                <div className="section-heading">
                  <div className="section-icon bg-[#fff3dd] text-[#dd8b21]">
                    <Icon>
                      <path d="M12 15 8.5 17l1-4-3-2.7 4.2-.3L12 6l1.3 4 4.2.3-3 2.7 1 4-3.5-2Z" />
                      <circle cx="12" cy="12" r="10" />
                    </Icon>
                  </div>
                  <div>
                    <h2>Final Result</h2>
                    <p>Calculated automatically</p>
                  </div>
                </div>
                <div className="flex flex-1 items-center justify-between p-5 sm:p-6">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[.14em] text-[#9aa3b3]">
                      Status
                    </p>
                    <span
                      className={`mt-2 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-bold ${
                        stats.passed
                          ? 'bg-[#e9f8f1] text-[#188461]'
                          : 'bg-[#fff0ef] text-[#d04d4d]'
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          stats.passed ? 'bg-[#22a879]' : 'bg-[#e45d5d]'
                        }`}
                      />
                      {stats.passed ? 'Pass' : 'Fail'}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-semibold uppercase tracking-[.14em] text-[#9aa3b3]">
                      Letter grade
                    </p>
                    <p className="mt-1 text-5xl font-black tracking-[-.06em] text-[#5b5ce2]">
                      {stats.grade}
                    </p>
                  </div>
                </div>
                <div className="mx-5 mb-5 rounded-xl bg-[#f7f7fb] px-3 py-2.5 text-center text-xs text-[#7e8799]">
                  Minimum 35 marks required in each subject
                </div>
              </section>
            </div>
          </div>

          <div className="mt-5 flex flex-col items-start justify-between gap-3 rounded-2xl border border-[#e4e8ef] bg-white px-5 py-4 sm:flex-row sm:items-center">
            <p
              className={`text-sm ${
                message.includes('success')
                  ? 'font-medium text-[#188461]'
                  : 'text-[#8993a7]'
              }`}
            >
              {message || 'Review the details before saving this record.'}
            </p>
            <div className="flex w-full gap-3 sm:w-auto">
              <button
                type="button"
                onClick={resetForm}
                className="h-10 flex-1 rounded-xl border border-[#dde2ea] px-5 text-sm font-semibold text-[#657087] transition hover:bg-[#f7f8fa] sm:flex-none"
              >
                Clear
              </button>
              <button
                type="submit"
                className="h-10 flex-1 rounded-xl bg-[#5b5ce2] px-6 text-sm font-semibold text-white shadow-[0_6px_14px_rgba(91,92,226,.25)] transition hover:bg-[#4d4ecc] sm:flex-none"
              >
                Save student record
              </button>
            </div>
          </div>
        </form>

        <section className="card mt-7">
          <div className="flex flex-col gap-4 border-b border-[#e9ecf1] p-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="text-base font-bold">Student Records</h2>
                <span className="rounded-full bg-[#eeeefe] px-2 py-0.5 text-[11px] font-bold text-[#5b5ce2]">
                  {records.length}
                </span>
              </div>
              <p className="mt-1 text-xs text-[#929bad]">
                Recently added grade entries
              </p>
            </div>
            <label className="relative sm:w-64">
              <Icon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9da6b7]">
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-4-4" />
              </Icon>
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="h-10 w-full rounded-xl border border-[#e0e4eb] bg-[#fafbfc] pl-9 pr-3 text-sm outline-none transition placeholder:text-[#aab1bf] focus:border-[#8586eb] focus:ring-3 focus:ring-[#5b5ce2]/10"
                placeholder="Search students..."
                aria-label="Search student records"
              />
            </label>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead>
                <tr className="bg-[#fafbfc] text-left text-[11px] font-bold uppercase tracking-[.1em] text-[#8f98aa]">
                  <th>Student</th>
                  <th>Roll no.</th>
                  <th>Class</th>
                  <th>Math</th>
                  <th>Science</th>
                  <th>English</th>
                  <th>Average</th>
                  <th>Grade</th>
                  <th>Result</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.map((record) => {
                  const rowStats = getStats(record.marks)
                  return (
                    <tr key={record.id}>
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#f0f0fe] text-[11px] font-bold text-[#5b5ce2]">
                            {record.name
                              .split(' ')
                              .map((part) => part[0])
                              .slice(0, 2)
                              .join('')}
                          </div>
                          <span className="font-semibold text-[#303a51]">
                            {record.name}
                          </span>
                        </div>
                      </td>
                      <td className="text-[#687389]">{record.roll}</td>
                      <td className="text-[#687389]">{record.className}</td>
                      <td>{record.marks.math}</td>
                      <td>{record.marks.science}</td>
                      <td>{record.marks.english}</td>
                      <td className="font-semibold">
                        {rowStats.average.toFixed(1)}%
                      </td>
                      <td>
                        <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-[#eeeefe] text-xs font-bold text-[#5657d2]">
                          {rowStats.grade}
                        </span>
                      </td>
                      <td>
                        <span
                          className={`status-pill ${
                            rowStats.passed ? 'passed' : 'failed'
                          }`}
                        >
                          {rowStats.passed ? 'Pass' : 'Fail'}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            {!filteredRecords.length && (
              <p className="py-10 text-center text-sm text-[#8e98aa]">
                No student records match your search.
              </p>
            )}
          </div>
        </section>
      </main>
    </div>
  )
}
