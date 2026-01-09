"use client"

import { Card } from "@/Components/ui/card"
import { Eye } from "lucide-react"
import { useSelector } from "react-redux"

const orders = [
  { id: "#12345", customer: "John Doe", amount: "$234.50", status: "Completed", date: "2024-12-10" },
  { id: "#12346", customer: "Jane Smith", amount: "$567.89", status: "Pending", date: "2024-12-10" },
  { id: "#12347", customer: "Bob Johnson", amount: "$123.45", status: "Completed", date: "2024-12-09" },
  { id: "#12348", customer: "Alice Brown", amount: "$789.00", status: "Cancelled", date: "2024-12-09" },
  { id: "#12349", customer: "Charlie Wilson", amount: "$456.78", status: "Completed", date: "2024-12-08" },
]

function getStatusColor(status) {
  switch (status) {
    case "Confirmed":
      return "bg-yellow-500/10 text-yellow-400"
    case "Pending":
      return "bg-red-500/10 text-red-400"
    case "Devlivered":
      return "bg-green-700/10 text-green-700"
    default:
      return "bg-gray-500/10 text-gray-400"
  }
}

export function RecentOrders() {
  const { data: dashBoardData } = useSelector((state) => state.dashBoard)
  console.log('recent order dash board',dashBoardData)
  return (
    <Card className="bg-blue-50 border border-blue-200">
      <div className="p-6 border-b border-blue-200">
        <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-blue-200">
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600">Order ID</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600">Customer</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600">Amount</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600">Status</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600">Date</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600">Action</th>
            </tr>
          </thead>
          <tbody>
            {dashBoardData?.recentOrders.map((order, idx) => (
              <tr key={idx} className="border-b border-blue-200 hover:bg-blue-100 transition-colors">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{order._id}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{order.customer.userName}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{order.products.reduce((acc,product)=>acc+product.quantity*product.item.price,0)}</td>
                <td className="px-6 py-4 text-sm">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status[0].toUpperCase()+order.status.slice(1))}`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">{new Date(order.createdAt).toLocaleDateString()}</td>
                <td className="px-6 py-4 text-sm">
                  <button className="text-gray-600 hover:text-gray-900 transition-colors">
                    <Eye className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}
