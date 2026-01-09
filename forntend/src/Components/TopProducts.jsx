"use client"

import { Card } from "@/Components/ui/card"
import { TrendingUp } from "lucide-react"

const products = [
  { name: "Wireless Headphones", sales: 1250, revenue: "$18,750" },
  { name: "USB-C Cable", sales: 980, revenue: "$4,900" },
  { name: "Phone Case", sales: 856, revenue: "$8,560" },
  { name: "Screen Protector", sales: 742, revenue: "$2,226" },
  { name: "Laptop Stand", sales: 631, revenue: "$15,775" },
]

export function TopProducts() {
  return (
    <Card className="bg-blue-50 border border-blue-200">
      <div className="p-6 border-b border-blue-200">
        <h3 className="text-lg font-semibold text-gray-900">Top Products</h3>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          {products.map((product, idx) => (
            <div key={idx} className="flex items-center justify-between pb-4 border-b border-blue-200 last:border-0">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{product.name}</p>
                <p className="text-xs text-gray-600 mt-1">{product.sales} sales</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-900">{product.revenue}</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3 h-3 text-green-600" />
                  <span className="text-xs text-green-600">+12.5%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}
