import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/Components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Badge } from "@/Components/ui/badge";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Eye,
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { fetchOrders } from "@/app/adminOrderSlice";
import { Skeleton } from "./skeleton";
import { useNavigate } from "react-router";
// Sample order data
const generateOrders = () => {
  const statuses = [
    "pending",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
  ];
  const customers = [
    "John Doe",
    "Jane Smith",
    "Mike Johnson",
    "Sarah Williams",
    "Tom Brown",
  ];

  return Array.from({ length: 47 }, (_, i) => ({
    id: `ORD-${String(i + 100).padStart(4, "0")}`,
    customer: customers[Math.floor(Math.random() * customers.length)],
    date: new Date(
      2024,
      0,
      Math.floor(Math.random() * 30) + 1
    ).toLocaleDateString(),
    amount: (Math.random() * 500 + 50).toFixed(2),
    status: statuses[Math.floor(Math.random() * statuses.length)],
  }));
};

const orders = generateOrders();

export function AdminOrdersTable() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const dispatch = useDispatch();
  const { data, isLoading, error } = useSelector((state) => state.adminOrder);
  const totalPages = Math.ceil(orders.length / 1);
  const startIndex = (currentPage - 1) * 1;
  const endIndex = startIndex + 1;
  const currentOrders = orders.slice(startIndex, endIndex);
  console.log("admin order", data);

  const goToFirstPage = () => setCurrentPage(1);
  const goToLastPage = () => setCurrentPage(data?.paginateData?.totalPages);
  const goToPreviousPage = () =>
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  const goToNextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  useEffect(() => {
    console.log('fetching admin orders')
    dispatch(fetchOrders(currentPage));
  }, [dispatch, currentPage]);

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      case "processing":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
      case "shipped":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400";
      case "delivered":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400";
    }
  };

  const handleViewOrder = (orderId) => {
    navigate(`/order/${orderId}/detail`);
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <Card className="border-border bg-card">
      <CardHeader className="border-b border-border bg-muted/30">
        <CardTitle className="text-xl font-semibold text-card-foreground">
          Orders
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto overflow-y-hidden max-w-full">
          <div className="min-w-full inline-block align-middle">
            <Table className="min-w-[800px]">
              <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead className="font-semibold text-foreground">
                  Order ID
                </TableHead>
                <TableHead className="font-semibold text-foreground">
                  Customer
                </TableHead>
                <TableHead className="font-semibold text-foreground">
                  Date
                </TableHead>
                <TableHead className="font-semibold text-foreground">
                  Amount
                </TableHead>
                <TableHead className="font-semibold text-foreground">
                  Status
                </TableHead>
                <TableHead className="font-semibold text-foreground text-right">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>

            {isLoading && (
              <TableBody>
                <TableRow>
                  <Skeleton className="w-full h-1" />
                </TableRow>
                <TableRow>
                  <Skeleton className="w-full h-1" />
                </TableRow>
                <TableRow>
                  <Skeleton className="w-full h-1" />
                </TableRow>
              </TableBody>
            )}

            {!isLoading && data?.orders && (
              <TableBody>
                {data.orders.map((order) => (
                  <TableRow key={order._id} className="hover:bg-muted/30">
                    <TableCell className="font-medium text-foreground">
                      {order._id}
                    </TableCell>
                    <TableCell className="text-foreground">
                      {order.customer.userName}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-foreground font-medium">
                      Rs.
                      {order.products.reduce(
                        (acc, product) =>
                          acc + product.quantity * product.item.price,
                        0
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={`${getStatusColor(order.status)} border-0`}
                      >
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewOrder(order._id)}
                        className="h-8 px-3 text-primary hover:text-primary hover:bg-primary/10"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            )}
          </Table>
          </div>
        </div>

        {/* Pagination Controls */}
        {data && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-border bg-muted/20">
            <div className="text-sm text-muted-foreground">
              Showing{" "}
              <span className="font-medium text-foreground">
                {(currentPage - 1) * 10 + 1}
              </span>{" "}
              to{" "}
              <span className="font-medium text-foreground">
                {(currentPage - 1) * 10 + data.orders.length}
              </span>{" "}
              of{" "}
              <span className="font-medium text-foreground">
                {data.paginateData.totalDocs}
              </span>{" "}
              orders
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={goToFirstPage}
                disabled={!data.paginateData.hasPrevPage}
                className="h-8 w-8 bg-transparent"
              >
                <ChevronsLeft className="h-4 w-4" />
                <span className="sr-only">First page</span>
              </Button>

              <Button
                variant="outline"
                size="icon"
                onClick={goToPreviousPage}
                disabled={!data.paginateData.hasPrevPage}
                className="h-8 w-8 bg-transparent"
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Previous page</span>
              </Button>

              <div className="flex items-center gap-1">
                <span className="text-sm font-medium text-foreground">
                  Page {currentPage} of {data.paginateData.totalPages}
                </span>
              </div>

              <Button
                variant="outline"
                size="icon"
                onClick={goToNextPage}
                disabled={!data.paginateData.hasNextPage}
                className="h-8 w-8 bg-transparent"
              >
                <ChevronRight className="h-4 w-4" />
                <span className="sr-only">Next page</span>
              </Button>

              <Button
                variant="outline"
                size="icon"
                onClick={goToLastPage}
                disabled={!data.paginateData.hasNextPage}
                className="h-8 w-8 bg-transparent"
              >
                <ChevronsRight className="h-4 w-4" />
                <span className="sr-only">Last page</span>
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
