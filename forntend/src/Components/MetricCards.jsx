"use client";

import { TrendingUp, ShoppingCart, Users } from "lucide-react";
import { Card } from "@/Components/ui/card";
import { useSelector } from "react-redux";

export function MetricsCards() {
    const {data:dashBoardData}=useSelector(state=>state.dashBoard)
  const metrics = [
    {
      title: "Total Revenue",
      value: "$45,231.89",
      change: "+20.1%",
      trend: "up",
      icon: TrendingUp,
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/20",
    },
    {
      title: "Total Orders",
      value: "1,234",
      change: "+8.5%",
      trend: "up",
      icon: ShoppingCart,
      bgColor: "bg-cyan-500/10",
      borderColor: "border-cyan-500/20",
    },
    {
      title: "Total Customers",
      value: "8,945",
      change: "-2.3%",
      trend: "down",
      icon: Users,
      bgColor: "bg-purple-500/10",
      borderColor: "border-purple-500/20",
    },
    {
      title: "Avg Order Value",
      value: "$367.89",
      change: "+12.4%",
      trend: "up",
      icon: TrendingUp,
      bgColor: "bg-green-500/10",
      borderColor: "border-green-500/20",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric, idx) => {
        const Icon = metric.icon;
        return (
          <Card key={idx} className="bg-blue-50 border border-blue-200">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-600 text-sm font-medium">
                  {metric.title}
                </h3>
                <div className="p-2 rounded-lg bg-blue-100">
                  <Icon className="w-5 h-5 text-blue-600" />
                </div>
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {idx==0&&`Rs. ${dashBoardData?.totalRevenue}`}
                    {idx==1&&`${dashBoardData?.totalOrders}`}
                    {idx==2&&`${dashBoardData?.totalUsers}`}
                    {idx==3&&`Rs. ${parseFloat(dashBoardData?.avgOrderValue).toFixed(2)}`}
                  </p>
                </div>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
