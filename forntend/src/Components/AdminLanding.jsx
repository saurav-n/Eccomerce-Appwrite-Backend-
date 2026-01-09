import { useEffect } from "react";
import { Link } from "react-router-dom";
import Container from "./Container";
import AppLoader from "./appLoader";
import AdminDisplayCart from "./AdminDisplayCart";
import { fetchItems } from "@/app/itemSlice";
import AdminContainer from "./AdminContainer";
import { MetricsCards } from "./MetricCards";
import { RevenueChart } from "./RevenueChart";
import { OrdersChart } from "./OrdersChart";
import { RecentOrders } from "./RecentOrders";
import { TopProducts } from "./TopProducts";
import { useDispatch, useSelector } from "react-redux";
import { fetchDashBoardData } from "@/app/dashBoardDataSlice";
import { Loader } from "lucide-react";

export default function AdminLanding() {
  const { items, isLoading, error } = useSelector((state) => state.item);
  const dispatch = useDispatch();
  const {
    data: dashBoardData,
    isLoading: isLoadingDashBoard,
    error: errorDashBoard,
  } = useSelector((state) => state.dashBoard);

  useEffect(() => {
    dispatch(fetchItems({}));
    dispatch(fetchDashBoardData());
  }, [dispatch]);

  return (
    <AdminContainer>
      {isLoadingDashBoard ||
        (!dashBoardData && (
          <div className="w-full h-full flex items-center justify-center">
            <Loader className="w-5 h-5 animate-spin" />
          </div>
        ))}
      {!isLoadingDashBoard && dashBoardData && (
        <main className="flex-1 overflow-auto">
          <div className="p-8">
            {/* Page Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-white">Dashboard</h1>
              <p className="text-gray-400 mt-2">
                Welcome back! Here's your sales overview.
              </p>
            </div>

            {/* Metrics Cards */}
            <MetricsCards />

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
              <RevenueChart />
              <RecentOrders />
            </div>
          </div>
        </main>
      )}
    </AdminContainer>
  );
}
