import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import AppLoader from "@/Components/appLoader";
import AdminDisplayCart from "@/Components/AdminDisplayCart";
import { fetchItems } from "@/app/itemSlice";
import Button from "@/Components/Button";
import { useNavigate } from "react-router-dom";
import AdminContainer from "@/Components/AdminContainer";
import { useInView } from "react-intersection-observer";
import { use } from "react";

export default function AdminLanding() {
  const { items, isLoading, error, paginateData,isFetchingNextPage } = useSelector(
    (state) => state.item
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [ref, inView] = useInView({
    threshold:0,
    triggerOnce:false
  });
  const [page, setPage] = useState(1);

  useEffect(() => {
    dispatch(fetchItems({page}));
    const scrollY = window.scrollY;
    window.scrollTo(0, scrollY);
  }, [page]);

  useEffect(() => {
    if (inView && paginateData?.hasNextPage && !isLoading) {
      setPage((prev) => prev + 1);
    }
  }, [inView, paginateData]);

  return (
    <AdminContainer>
      {error ? (
        <p>{error}</p>
      ) : isLoading ? (
        <AppLoader />
      ) : (
        <div className="w-full flex flex-col gap-y-4 p-3">
          <div className="w-full flex justify-between">
            <h2 className="text-2xl font-bold mb-4">All Items</h2>
            <Button onClick={() => navigate("/addProduct")}>
              <p className="h-fit">Add Product</p>
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 p-4">
            {items.map((item) => (
              <div key={item._id} className="w-full">
                <AdminDisplayCart item={item} />
              </div>
            ))}
          </div>
          <div ref={ref} className="flex justify-center p-2">
            {isFetchingNextPage && (
              <p className="text-center">Loading...</p>
            )}
          </div>
        </div>
      )}
    </AdminContainer>
  );
}
