"use client";

import { Eye } from "lucide-react";
import { Button } from "@/Components/ui/button";
import OrderImageGrid from "./OrderImageGrid";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { fetchOrders } from "@/app/orderSlice";
import { useNavigate } from "react-router";
const mockOrders = [
  {
    id: "ORD-001",
    total: 245.99,
    productImages: [
      "/elegant-watch.jpg",
      "/wireless-headphones.png",
      "/colorful-phone-case-display.png",
      "/screen-protector.png",
      "/charging-cable.jpg",
    ],
  },
  {
    id: "ORD-002",
    total: 89.5,
    productImages: ["/simple-coffee-mug.png", "/open-notebook-desk.png"],
  },
  {
    id: "ORD-003",
    total: 567.0,
    productImages: [
      "/laptop-bag.jpg",
      "/mechanical-keyboard.png",
      "/field-mouse.png",
      "/modern-desk-lamp.png",
      "/monitor-stand.jpg",
      "/classic-webcam.png",
    ],
  },
  {
    id: "ORD-004",
    total: 156.75,
    productImages: [
      "/running-shoes.jpg",
      "/sports-socks.jpg",
      "/fitness-tracker-lifestyle.png",
    ],
  },
  {
    id: "ORD-005",
    total: 342.5,
    productImages: ["/elegant-watch.jpg", "/wireless-headphones.png"],
  },
  {
    id: "ORD-006",
    total: 199.99,
    productImages: ["/simple-coffee-mug.png"],
  },
];

export default function OrdersTable() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { orders, isLoading, error } = useSelector((state) => state.order);
  useEffect(() => {
    dispatch(fetchOrders());
  }, []);
  return (
    <div className="bg-white">
      <div className="overflow-x-auto">
        <div className="h-96 overflow-y-auto">
          {isLoading ? (
            <div className="flex justify-center items-center">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-200"></div>
            </div>
          ) : error ? (
            <div className="p-8 text-center">
              <p className="text-gray-500">{error}</p>
            </div>
          ) : (
            <table className="w-full">
              <thead className="sticky top-0 bg-blue-50 border-b border-blue-200 z-10">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-blue-900">
                    Order ID
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-blue-900">
                    Products
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-blue-900">
                    Total Price
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-blue-900">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b border-gray-100 hover:bg-blue-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <span className="font-semibold text-gray-900">
                        {order._id}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <OrderImageGrid images={order.products.map(product=>product.item.featuredImgs[0])} />
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-gray-900">
                        Rs.{order.products.reduce((acc, curr) => acc + curr.item.price, 0).toFixed(2)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Button
                        variant="outline"
                        size="sm"
                        className="inline-flex items-center gap-2 bg-white border-blue-200 text-blue-600 hover:bg-blue-50"
                        onClick={() => {
                          console.log(order._id);
                          navigate(`/order/${order._id}/detail`)
                        }}
                      >
                        <Eye size={16} />
                        <span>View</span>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {mockOrders.length === 0 && (
        <div className="p-8 text-center">
          <p className="text-gray-500">No orders found</p>
        </div>
      )}
    </div>
  );
}
