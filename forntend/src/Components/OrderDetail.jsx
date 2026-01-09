import { CheckCircle2, Package, Truck, MapPin, Loader } from "lucide-react";
import { Card } from "@/Components/ui/card";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrders } from "@/app/orderSlice";
import { useParams } from "react-router";
import { useState, useEffect } from "react";
import { Badge } from "@/Components/ui/badge";
import { Button } from "./ui/button";
import { useToast } from "./Toast/use-toast";
import axios from "axios";
const timelineSteps = [
  {
    id: 1,
    title: "Order Confirmed",
    description: "Your order has been confirmed",
    status: "confirmed",
    icon: CheckCircle2,
  },
  {
    id: 2,
    title: "Processing",
    description: "We are preparing your order",
    status: "processing",
    icon: Package,
  },
  {
    id: 3,
    title: "Shipped",
    description: "Your package is on the way",
    status: "shipped",
    icon: Truck,
  },
  {
    id: 4,
    title: "Delivered",
    description: "Package will arrive soon",
    status: "delivered",
    icon: MapPin,
  },
];

export default function OrderDetail() {
  const { orderId } = useParams();
  const dispatch = useDispatch();
  const { orders, isLoading, error } = useSelector((state) => state.order);
  const [currOrder, setCurrOrder] = useState(null);
  const { toast } = useToast();
  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  useEffect(() => {
    if (orders && orders.length > 0) {
      setCurrOrder(orders.find((order) => order._id === orderId));
    }
  }, [orders]);
  if (isLoading) {
    return (
      <div className="flex justify-center items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-200"></div>
      </div>
    );
  }

  const handlePayment = async (orderId) => {
    console.log("payment called", orderId);
    try {
      const khaltiRes = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/pay/khalti`,
        {
          amount: currOrder.products
            .reduce(
              (acc, product) =>
                acc + product.item.price * product.qty + 20 * product.qty,
              0
            )
            .toFixed(2),
          orderId: orderId,
          orderName: `Order ${orderId}`,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (khaltiRes.data.success) {
        console.log("khaltiRes", khaltiRes);
        toast({
          title: "Payment Successful",
          description: "Your payment has been successful",
          type: "success",
        });

        const redirectUrl = khaltiRes.data.data.paymentUrl;
        window.location.href = redirectUrl;
      }
    } catch (error) {
      toast({
        title: "Payment Failed",
        description: error.message,
        type: "error",
      });
    }
  };

  if (error) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-500">{error}</p>
      </div>
    );
  }
  return (
    currOrder && (
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Timeline Section */}
          <div className="lg:col-span-1">
            <Card className="p-8 sticky top-20 bg-white border-0 shadow-lg">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
                  <Package className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-lg font-bold text-gray-900">
                  Shipment Status
                </h2>
              </div>

              <div className="space-y-6">
                {timelineSteps.map((step, index) => {
                  const Icon = step.icon;
                  const isCompleted = step.status === currOrder.status;
                  const isInProgress =
                    (index == 0 && currOrder.status == "pending") ||
                    (index > 0 &&
                      timelineSteps[index - 1].status == currOrder.status);
                  const showLine = index !== timelineSteps.length - 1;

                  return (
                    <div key={step.id} className="relative">
                      {/* Timeline Line */}
                      {showLine && (
                        <div
                          className={`absolute left-5 top-10 w-0.5 h-12 ${
                            isCompleted ? "bg-blue-600" : "bg-gray-200"
                          }`}
                        />
                      )}

                      {/* Timeline Node */}
                      <div className="flex gap-4">
                        <div className="flex-shrink-0">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                              isCompleted
                                ? "bg-blue-600 text-white"
                                : "bg-gray-100 text-gray-400"
                            }`}
                          >
                            {isCompleted || !isInProgress ? (
                              <Icon className="w-5 h-5" />
                            ) : (
                              <Loader className="w-5 h-5 animate-spin" />
                            )}
                          </div>
                        </div>

                        {/* Timeline Content */}
                        <div className="flex-1 pt-1 self-center">
                          <p
                            className={`font-semibold text-sm ${
                              isCompleted ? "text-gray-900" : "text-gray-400"
                            }`}
                          >
                            {step.title}
                          </p>
                          {isCompleted && (
                            <p
                              className={`text-xs mt-0.5 ${
                                isCompleted ? "text-gray-600" : "text-gray-400"
                              }`}
                            >
                              {step.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>

          {/* Details Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Summary */}
            <Card className="p-8 bg-white border-0 shadow-lg">
              <div className="flex items-center flex-wrap justify-between mb-8">
                <h2 className="text-xl font-bold text-gray-900 truncate">
                  Order #{currOrder._id}
                </h2>
                <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                  {currOrder.status}
                </span>
              </div>

              <div className="grid md:grid-cols-3 gap-6 mb-8 pb-8 border-b border-gray-200">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Order Date</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {new Date(currOrder.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Items */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900 text-lg">Items</h3>
                {currOrder.products.map((product, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <div>
                      <p className="font-medium text-gray-900">
                        {product.item.name}
                      </p>
                      <p className="text-sm text-gray-600">
                        Qty: {product.qty}
                      </p>
                    </div>
                    <p className="font-semibold text-gray-900">
                      Rs.{(product.item.price * product.qty).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            </Card>

            {/* Pricing and Delivery */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Pricing */}
              <Card className="p-8 bg-white border-0 shadow-lg">
                <h3 className="font-semibold text-gray-900 text-lg mb-6">
                  Order Summary
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>
                      Rs.
                      {currOrder.products
                        .reduce(
                          (acc, product) =>
                            acc + product.item.price * product.qty,
                          0
                        )
                        .toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span>Rs.20/Item</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <spna>Payment</spna>
                    <span className="flex flex-col gap-1">
                      <Badge
                        className="text-xs bg-blue-500"
                        variant={
                          currOrder.paymentStatus === "pending"
                            ? "destructive"
                            : ""
                        }
                      >
                        {currOrder.paymentStatus === "pending"
                          ? "Pending"
                          : "Paid"}
                      </Badge>
                      {currOrder.paymentStatus === "pending" && (
                        <Button
                          className="h-fit"
                          variant="outline"
                          onClick={() => handlePayment(currOrder._id)}
                        >
                          Pay
                        </Button>
                      )}
                    </span>
                  </div>
                  <div className="pt-4 border-t border-gray-200 flex justify-between items-center">
                    <span className="font-semibold text-gray-900">Total</span>
                    <span className="text-2xl font-bold text-blue-600">
                      Rs.
                      {currOrder.products
                        .reduce(
                          (acc, product) =>
                            acc +
                            product.item.price * product.qty +
                            20 * product.qty,
                          0
                        )
                        .toFixed(2)}
                    </span>
                  </div>
                </div>
              </Card>

              {/* Delivery Address */}
              <Card className="p-8 bg-white border-0 shadow-lg">
                <h3 className="font-semibold text-gray-900 text-lg mb-6">
                  Delivery Address
                </h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Recipient Name</p>
                    <p className="font-semibold text-gray-900">
                      {currOrder.shippingAddress.name}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Address</p>
                    <p className="text-gray-900">
                      {currOrder.shippingAddress.street}
                      <br />
                      {currOrder.shippingAddress.city}
                      <br />
                      {currOrder.shippingAddress.state}
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    )
  );
}
