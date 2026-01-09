"use client"

import { Card } from "@/Components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

const ordersData = [
  { day: "Mon", completed: 220, pending: 140, cancelled: 40 },
  { day: "Tue", completed: 200, pending: 170, cancelled: 50 },
  { day: "Wed", completed: 280, pending: 100, cancelled: 30 },
  { day: "Thu", completed: 300, pending: 120, cancelled: 35 },
  { day: "Fri", completed: 220, pending: 180, cancelled: 60 },
  { day: "Sat", completed: 280, pending: 160, cancelled: 45 },
  { day: "Sun", completed: 190, pending: 200, cancelled: 70 },
]

export function OrdersChart() {
  return (
    <Card className="bg-blue-50 border border-blue-200">
      <div className="p-6 border-b border-blue-200">
        <h3 className="text-lg font-semibold text-gray-900">Orders Overview</h3>
        <p className="text-gray-600 text-sm mt-1">Daily order status breakdown</p>
      </div>
      <div className="p-6">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={ordersData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ddd" />
            <XAxis dataKey="day" stroke="#666" />
            <YAxis stroke="#666" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                border: "1px solid #ddd",
                borderRadius: "8px",
              }}
              labelStyle={{ color: "#000" }}
            />
            <Legend />
            <Bar dataKey="completed" fill="#10b981" />
            <Bar dataKey="pending" fill="#f59e0b" />
            <Bar dataKey="cancelled" fill="#ef4444" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}
