import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts"

export default function AdminDashboard() {
  // Class participation
  const classes = [
    { name: "Class 1", participation: 80 },
    { name: "Class 2", participation: 65 },
    { name: "Class 3", participation: 90 },
    { name: "Class 4", participation: 75 },
  ]

  // Monthly drill performance
  const monthly = [
    { month: "Jan", drills: 60 },
    { month: "Feb", drills: 70 },
    { month: "Mar", drills: 50 },
    { month: "Apr", drills: 85 },
    { month: "May", drills: 95 },
    { month: "Jun", drills: 80 },
  ]

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-gray-800">📊 Admin Dashboard</h2>

      {/* Participation per class */}
      <div className="bg-white rounded-2xl shadow p-4">
        <h3 className="text-lg font-semibold mb-3">Class Participation (%)</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={classes}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="participation" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Monthly drill trends */}
      <div className="bg-white rounded-2xl shadow p-4">
        <h3 className="text-lg font-semibold mb-3">Monthly Drill Performance</h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={monthly}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="drills" stroke="#ef4444" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
