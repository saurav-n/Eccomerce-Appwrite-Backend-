import OrderDetail from "@/Components/OrderDetail";
import Container from "@/Components/Container";
import AdminContainer from "@/Components/AdminContainer";
import { AdminOrderDetail } from "@/Components/AdminOrederDetail";
import useSession from "@/hooks/session";

export default function OrderDetailPage() {
  const { status, data } = useSession();
  if (status === "unauthenticated") {
    return <div>Unauthenticated</div>;
  }
  if (status === "loading") {
    return <div>Loading</div>;
  }
  return (
    <>
      {data.user.role === "admin" ? (
        <AdminContainer>
          <AdminOrderDetail />
        </AdminContainer>
      ) : (
        <Container>
          <OrderDetail />
        </Container>
      )}
    </>
  );
}
