import { useEffect, useState } from 'react'
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Card } from '@/components/ui/Card'
import { getRevenueData } from '@/services/adminService'
import { formatMoney } from '@/utils/customerFormat'

const ranges = [
  { id: '7d', label: '7 Days' },
  { id: '30d', label: '30 Days' },
  { id: '6m', label: '6 Months' },
  { id: '1y', label: '1 Year' },
]

export function RevenueOverview({ data = [] }) {
  const [range, setRange] = useState('1y')
  const [rows, setRows] = useState(data)

  useEffect(() => {
    setRows(data)
  }, [data])

  useEffect(() => {
    let active = true
    getRevenueData(range).then((next) => {
      if (active) setRows(next)
    })
    return () => {
      active = false
    }
  }, [range])

  return (
    <Card>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-h3 text-foreground">Revenue Overview</h2>
          <p className="mt-1 text-caption text-muted">Sample revenue. These figures are not live accounts.</p>
        </div>
        <div className="flex flex-wrap gap-1" role="group" aria-label="Revenue period">
          {ranges.map((item) => (
            <button
              key={item.id}
              type="button"
              aria-pressed={range === item.id}
              className={`h-8 rounded-md px-2.5 text-caption font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${range === item.id ? 'bg-primary text-white' : 'bg-canvas text-muted'}`}
              onClick={() => setRange(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-4 h-64 w-full min-w-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={rows} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid stroke="#E2E8F0" vertical={false} />
            <XAxis dataKey="label" tick={{ fill: '#64748B', fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#64748B', fontSize: 12 }} axisLine={false} tickLine={false} width={48} tickFormatter={(value) => `${Math.round(value / 1000)}k`} />
            <Tooltip formatter={(value) => [formatMoney(value), 'Sample revenue']} />
            <Area type="monotone" dataKey="amount" stroke="#D4A017" fill="#D4A017" fillOpacity={0.2} strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}
