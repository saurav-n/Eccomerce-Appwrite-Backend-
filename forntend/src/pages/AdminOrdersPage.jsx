import AdminContainer from "@/Components/AdminContainer";
import { AdminOrdersTable } from "@/Components/AdminOrdersTable";

export default function AdminOrdersPage() {
  return (
    <AdminContainer>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Order Management
        </h1>
        <p className="text-muted-foreground">
          View and manage all customer orders
        </p>
      </div>
      <AdminOrdersTable />
    </AdminContainer>
  );
}
