"use client"

import { Card } from "@/Components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { useSelector } from "react-redux"

const orderTrendData = [
  { month: "January", orders: 1200 },
  { month: "February", orders: 1450 },
  { month: "March", orders: 1320 },
  { month: "April", orders: 1680 },
  { month: "May", orders: 1550 },
  { month: "June", orders: 1820 },
  { month: "July", orders: 1980 },
  { month: "August", orders: 1750 },
  { month: "September", orders: 2100 },
  { month: "October", orders: 2250 },
  { month: "November", orders: 2480 },
  { month: "December", orders: 2650 },
]

export function RevenueChart() {
  const { data: dashBoardData } = useSelector((state) => state.dashBoard)
  return (
    <Card className="bg-blue-50 border border-blue-200">
      <div className="p-6 border-b border-blue-200">
        <h3 className="text-lg font-semibold text-gray-900">Order Trend</h3>
        <p className="text-gray-600 text-sm mt-1">Monthly order volume</p>
      </div>
      <div className="p-6">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={dashBoardData?.orderTrend}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ddd" />
            <XAxis dataKey="month" stroke="#666" />
            <YAxis stroke="#666" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                border: "1px solid #ddd",
                borderRadius: "8px",
              }}
              labelStyle={{ color: "#000" }}
            />
            <Line type="monotone" dataKey="orders" stroke="#2563eb" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}
