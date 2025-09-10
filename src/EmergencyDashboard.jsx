import { useState } from "react"

export default function EmergencyDashboard() {
  const [panic, setPanic] = useState(false)
  const [logs, setLogs] = useState([])

  const contacts = [
    { name: "Police", phone: "100" },
    { name: "Fire", phone: "101" },
    { name: "Ambulance", phone: "102" },
    { name: "Disaster Helpline", phone: "108" },
  ]

  const triggerPanic = () => {
    setPanic(true)
    const timestamp = new Date().toLocaleTimeString()
    setLogs((prev) => [...prev, `🚨 Panic button pressed at ${timestamp}`])
    setTimeout(() => setPanic(false), 3000)
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-red-600">🚨 Emergency Dashboard</h2>

      {/* Panic Button */}
      <button
        onClick={triggerPanic}
        className={`w-full py-4 text-xl font-bold rounded-2xl shadow transition ${
          panic ? "bg-red-700 text-white animate-pulse" : "bg-red-500 text-white hover:bg-red-600"
        }`}
      >
        {panic ? "Emergency Alert Sent!" : "Press Panic Button"}
      </button>

      {/* Contacts */}
      <div className="bg-white rounded-2xl shadow p-4">
        <h3 className="text-lg font-semibold mb-3">📞 Emergency Contacts</h3>
        <ul className="space-y-2">
          {contacts.map((c, i) => (
            <li key={i} className="flex justify-between items-center">
              <span>{c.name}</span>
              <a
                href={`tel:${c.phone}`}
                className="text-blue-600 font-semibold hover:underline"
              >
                {c.phone}
              </a>
            </li>
          ))}
        </ul>
      </div>

      {/* Logs */}
      <div className="bg-white rounded-2xl shadow p-4">
        <h3 className="text-lg font-semibold mb-3">📝 Alert Logs</h3>
        {logs.length === 0 ? (
          <p className="text-gray-500">No emergency alerts yet.</p>
        ) : (
          <ul className="list-disc pl-6 space-y-1">
            {logs.map((log, i) => (
              <li key={i}>{log}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
