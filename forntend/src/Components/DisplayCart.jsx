import { ShoppingCart } from "lucide-react";
import { useToast } from "./Toast/use-toast";
import { useDispatch } from "react-redux";
import { fetchItems } from "@/app/itemSlice";
import { fetchUsers } from "@/app/userSlice";
import axios from "axios";
import { useState } from "react"; 
import { cn } from "@/lib/utils";

export default function DisplayCart({ item,className=''  }) {
  const dispatch = useDispatch();
  const [isItemAddingToCart, setIsItemAddingToCart] = useState(false);
  const { toast } = useToast();
  const onAddToCart = async (item) => {
    setIsItemAddingToCart(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/addToCart`,
        {
          itemId: item._id,
          qty: 1,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (res.data.success) {
        toast({
          variant: "default",
          title: "Item added to cart",
        });
        dispatch(fetchItems({}));
        dispatch(fetchUsers());
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: error.response?.data?.message || "Something went wrong",
      });
    } finally {
      setIsItemAddingToCart(false);
    }
  };
  return (
    <div className="bg-white rounded-lg border border-blue-100 hover:border-blue-300 overflow-hidden transition hover:shadow-lg h-full">
      <div className={cn("relative overflow-hidden bg-blue-50 w-full  aspect-[4/5]",className)}>
        <img
          src={item.featuredImgs[0] || "/placeholder.svg"}
          alt={item.name}
          className="w-full h-full object-cover hover:scale-105 transition duration-300"
        />
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-foreground mb-2 line-clamp-2">
          {item.name}
        </h3>
        <div className="flex items-center justify-between">
          <span className="text-base font-bold text-primary">
            Rs. {item.price}
          </span>
          <button
            onClick={() => onAddToCart(item)}
            disabled={isItemAddingToCart}
            className="bg-blue-500 hover:bg-blue-700 text-white p-2 rounded-lg transition duration-200 shadow-md hover:shadow-lg disabled:bg-slate-300"
          >
            <ShoppingCart size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
