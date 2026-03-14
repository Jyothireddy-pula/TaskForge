import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts"

function StatsChart({ tasks }) {
  const completed = tasks.filter((t) => t.completed).length
  const pending = tasks.length - completed

  const data = [
    { name: "Completed", value: completed },
    { name: "Pending", value: pending }
  ]

  return (
    <div className="stats-chart-card">
      <h3>Task Overview</h3>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data}>
          <XAxis dataKey="name" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="value" fill="#7c3aed" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default StatsChart

