"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Badge } from "@/Components/ui/badge";
import {
  ArrowLeft,
  Package,
  CheckCircle,
  Truck,
  MapPin,
  Clock,
  Loader2,
  Loader,
} from "lucide-react";
import { useNavigate, useParams } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import { fetchOrder } from "@/app/adminOrderSlice";
import axios from "axios";
import { useToast } from "./Toast/use-toast";

export function AdminOrderDetail() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { orderId } = useParams();
  const { data, isLoading, error } = useSelector((state) => state.adminOrder);
  const { toast } = useToast();

  console.log("admin order", data);

  // Mock order data - in production, fetch from API
  const [order, setOrder] = useState({
    id: orderId,
    customer: "John Doe",
    email: "john.doe@example.com",
    date: "2024-01-15",
    amount: "249.99",
    status: "confirmed", // pending, confirmed, processing, shipped, delivered
    items: [
      { id: 1, name: "Wireless Headphones", quantity: 1, price: "149.99" },
      { id: 2, name: "Phone Case", quantity: 2, price: "49.99" },
    ],
  });

  // Simulate pending to confirmed transition
  useEffect(() => {
    if (order.status === "pending") {
      const timer = setTimeout(() => {
        setOrder((prev) => ({ ...prev, status: "confirmed" }));
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [order.status]);

  useEffect(() => {
    console.log("orderId", orderId);
    dispatch(fetchOrder(orderId));
  }, [dispatch, orderId]);

  const updateOrderStatus = async (newStatus) => {
    try {
      await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/api/order/${orderId}/status`,
        {
          status: newStatus,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(fetchOrder(orderId));
      toast({
        title: "Success",
        description: "Order status updated successfully",
        type: "success",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Something went wrong",
        type: "error",
      });
    }
  };

  const getStatusIndex = (status) => {
    const statuses = [
      "pending",
      "confirmed",
      "processing",
      "shipped",
      "delivered",
    ];
    return statuses.indexOf(status);
  };

  const currentStatusIndex = getStatusIndex(data?.order?.status);

  const timelineSteps = [
    {
      status: "confirmed",
      label: "Confirmed",
      icon: CheckCircle,
      description: "Payment received",
      nextStatus: "processing",
    },
    {
      status: "processing",
      label: "Processing",
      icon: Package,
      description: "Preparing your order",
      nextStatus: "shipped",
      actionLabel: "Mark as Processed",
    },
    {
      status: "shipped",
      label: "Shipped",
      icon: Truck,
      description: "On the way",
      nextStatus: "delivered",
      actionLabel: "Mark as Shipped",
    },
    {
      status: "delivered",
      label: "Delivered",
      icon: MapPin,
      description: "Order completed",
      nextStatus: null,
      actionLabel: "Mark as Delivered",
    },
  ];

  const renderTimelineStep = (step, index) => {
    const stepStatusIndex = getStatusIndex(step.status);
    const isCompleted = currentStatusIndex > stepStatusIndex;
    const isCurrent = currentStatusIndex === stepStatusIndex;
    const isNextLoading = currentStatusIndex === stepStatusIndex - 1;
    const isUpcoming = currentStatusIndex < stepStatusIndex;

    const Icon = step.icon;

    return (
      <div
        key={step.status}
        className="flex-1 flex flex-col items-center relative z-10"
      >
        {/* Timeline Line */}
        {index < timelineSteps.length - 1 && (
          <div
            className={`absolute left-1/2 top-6 h-0.5 w-full transition-all duration-500 z-0 ${
              isCompleted || (isCurrent && index < timelineSteps.length - 1)
                ? "bg-blue-500"
                : "bg-gray-200"
            }`}
            style={{
              transform: "translateY(-50%)",
              marginLeft: "24px",
            }}
          />
        )}

        {/* Icon Circle */}
        <div
          className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-500 relative z-10 ${
            isCompleted || isCurrent
              ? "bg-blue-500 border-blue-500 text-white"
              : "border-gray-200 bg-gray-50 text-gray-400"
          }`}
        >
          {isCompleted || isCurrent ? (
            <Icon className="w-5 h-5" />
          ) : (
            isUpcoming && !isNextLoading && step.status!=="confirmed"?(
              <Icon className="w-5 h-5" />
            ):(
              <Loader2 className="w-5 h-5 animate-spin" />
            )
          )}
          {/* {isNextLoading ? (
            <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
          ) : isCompleted ? (
            <CheckCircle className="w-5 h-5 text-white" />
          ) : isCurrent ? (
            step.status === 'confirmed' ? (
              <CheckCircle className="w-5 h-5 text-blue-500" />
            ) : (
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            )
          ) : (
            <Icon className="w-5 h-5 text-gray-400" />
          )} */}
        </div>

        {/* Label */}
        <div className="mt-3 text-center px-2">
          <p
            className={`text-sm font-semibold ${
              isCurrent || isCompleted
                ? "text-blue-500"
                : isNextLoading
                ? "text-gray-500"
                : "text-gray-400"
            }`}
          >
            {step.label}
          </p>
          <p
            className={`text-xs mt-1 ${
              isCurrent || isCompleted
                ? "text-blue-500"
                : isNextLoading
                ? "text-gray-400" // Changed from text-blue-400 to text-gray-400
                : "text-gray-400"
            }`}
          >
            {step.description}
          </p>

          {isNextLoading && step.status !== "confirmed" && (
            <div className="mt-4 flex flex-col items-center">
              <p className="text-xs text-gray-500 mb-3">
                Waiting for admin action
              </p>
              <Button
                onClick={() => updateOrderStatus(step.status)}
                size="sm"
                className="bg-blue-500 hover:bg-blue-600 text-white shadow-sm transition-colors"
              >
                {step.actionLabel}
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (isLoading || !data?.order) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <Loader className="w-5 h-5 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4 max-w-6xl">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate("/orders")}
            className="mb-4 -ml-2 text-blue-500 hover:text-blue hover:bg-blue-100"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Orders
          </Button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Order Details
              </h1>
              <p className="text-muted-foreground">
                Order ID: {data?.order?._id}
              </p>
            </div>
            <Badge
              variant="secondary"
              className="text-sm px-3 py-1 bg-blue-500-200/10 text-blue border-blue/20"
            >
              {data?.order?.status.charAt(0).toUpperCase() +
                data?.order?.status.slice(1)}
            </Badge>
          </div>
        </div>

        {/* Pending State Alert */}
        {order.status === "pending" && (
          <Card className="mb-6 border-blue-500-200 bg-yellow-50 dark:border-yellow-900/50 dark:bg-yellow-950/20">
            <CardContent className="flex items-center gap-3 py-4">
              <Clock className="w-5 h-5 text-blue-500-600 dark:text-yellow-500" />
              <div>
                <p className="text-sm font-semibold text-blue-500-900 dark:text-yellow-200">
                  Awaiting Payment Confirmation
                </p>
                <p className="text-xs text-blue-500-700 dark:text-yellow-400">
                  This order will automatically move to confirmed status once
                  payment is processed.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Order Timeline */}
        <Card className="mb-6 border-border bg-card">
          <CardHeader className="border-b border-border bg-muted/30">
            <CardTitle className="text-xl font-semibold text-card-foreground">
              Order Timeline
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-12 pb-8">
            <div className="flex items-start relative px-6">
              {timelineSteps.map(renderTimelineStep)}
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Customer Information */}
          <Card className="border-border bg-card">
            <CardHeader className="border-b border-border bg-muted/30">
              <CardTitle className="text-lg font-semibold text-card-foreground">
                Customer Information
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Name</p>
                <p className="text-base font-medium text-foreground">
                  {data?.order?.customer?.userName}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Order Date</p>
                <p className="text-base font-medium text-foreground">
                  {new Date(data?.order?.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Address</p>
                <p className="text-base font-medium text-foreground">
                  {`${data?.order?.address?.street} ${data?.order?.address?.city}, ${data?.order?.address?.state} ${data?.order?.address?.country}`}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Order Items */}
          <Card className="border-border bg-card">
            <CardHeader className="border-b border-border bg-muted/30">
              <CardTitle className="text-lg font-semibold text-card-foreground">
                Order Items
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {data?.order?.products.map((product) => (
                  <div
                    key={product.item._id}
                    className="flex justify-between items-start pb-4 border-b border-border last:border-0"
                  >
                    <div>
                      <p className="font-medium text-foreground">{product.item.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Quantity: {product.quantity}
                      </p>
                    </div>
                    <p className="font-semibold text-foreground">
                      Rs.{product.item.price * product.quantity}
                    </p>
                  </div>
                ))}
                <div className="flex justify-between items-center pt-4">
                  <p className="text-lg font-bold text-foreground">Total</p>
                  <p className="text-xl font-bold text-blue-500">
                    Rs. {data?.order.products.reduce((acc, product) => acc + product.item.price * product.quantity, 0)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
