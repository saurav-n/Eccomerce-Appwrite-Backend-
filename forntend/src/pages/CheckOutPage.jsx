import { useEffect, useState } from "react";
import { ShoppingCart, Trash2, Plus, Minus } from "lucide-react";
import CartSummary from "@/Components/CartSummary";
import Container from "@/Components/Container";
import { useDispatch, useSelector } from "react-redux";
import useSession from "@/hooks/session";
import { FaStar, FaRegStar, FaStarHalfAlt } from "react-icons/fa";
import { fetchItems } from "@/app/itemSlice";
import { fetchUsers } from "@/app/userSlice";

export default function CheckoutPage() {
  const dispatch = useDispatch();
  const { status, data } = useSession();
  const [cartItems, setCartItems] = useState([]);
  const [mainImage, setMainImage] = useState("");
  const {
    users,
    isLoading: isUsersLoading,
    error: usersError,
  } = useSelector((state) => state.user);
  const {
    items,
    isLoading: isItemsLoading,
    error: itemsError,
  } = useSelector((state) => state.item);

  useEffect(() => {
    if (users && data && items) {
      const currUser = users.find((user) => user._id === data.user._id);
      if (currUser) {
        console.log("setting cart Items");
        console.log("items", items);
        console.log(
          currUser,
          currUser.carts.map((cartItem) => {
            return {
              item: items.find((item) => item._id === cartItem.itemId),
              qty: cartItem.qty,
            };
          })
        );
        setCartItems(
          currUser.carts.map((cartItem) => {
            return {
              item: items.find((item) => item._id === cartItem.itemId),
              qty: cartItem.qty,
            };
          })
        );
      }
    }
  }, [users, data, items]);

  useEffect(() => {
    console.log("checkout cartItems", cartItems);
  }, [cartItems]);

  useEffect(() => {
    console.log("fetching");
    dispatch(fetchItems({}));
    dispatch(fetchUsers());
  }, [dispatch]);
  const availableProducts = [
    { id: 3, name: "Phone Case", price: 599, image: "/stylish-phone-case.png" },
    {
      id: 4,
      name: "Screen Protector",
      price: 399,
      image: "/screen-protector.png",
    },
    {
      id: 5,
      name: "Phone Stand",
      price: 1299,
      image: "/minimalist-wooden-phone-stand.png",
    },
  ];

  const addToCart = (product) => {
    const existing = cartItems.find((item) => item.id === product.id);
    if (existing) {
      setCartItems(
        cartItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCartItems([...cartItems, { ...product, quantity: 1 }]);
    }
  };

  const removeFromCart = (id) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  const updateQuantity = (id, quantity) => {
    if (quantity <= 0) {
      removeFromCart(id);
    } else {
      setCartItems(
        cartItems.map((item) => (item.id === id ? { ...item, quantity } : item))
      );
    }
  };

  const getStartRating = (rating) => {
    let dummyRating = rating;
    const ratingArr = Array.from([0, 0, 0, 0, 0], (elem) => {
      if (dummyRating >= 1) {
        dummyRating--;
        return 1;
      } else if (dummyRating > 0) {
        const ratingCpy = dummyRating;
        dummyRating = 0;
        return ratingCpy >= 0.5 ? 0.5 : 0;
      }
      return 0;
    });
    return ratingArr;
  };



  return (
    <Container>
      <main className="min-h-screen bg-gradient-to-b from-white to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Products and Cart */}
            <div className="lg:col-span-2">
              {/* Shopping Cart */}
              <div className="">
                <div className="flex items-center gap-2 mb-6">
                  <h2 className="text-3xl font-bold text-foreground">
                    Products
                  </h2>
                </div>

                {cartItems.length === 0 ? (
                  <div className="text-center py-12 bg-blue-50 rounded-lg">
                    <p className="text-gray-500">Your cart is empty</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {cartItems.map((cartItem) => (
                      <ProductCard
                        item={cartItem.item}
                        qty={cartItem.qty}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Order Summary */}
            {cartItems.length>0 && <CartSummary
              noItems={cartItems.length}
              subtotal={cartItems.reduce(
                (sum, cartItem) => sum + cartItem.item.price * cartItem.qty,
                0
              )}
            />}
          </div>
        </div>
      </main>
    </Container>
  );
}

const getStartRating = (rating) => {
  let dummyRating = rating;
  const ratingArr = Array.from([0, 0, 0, 0, 0], (elem) => {
    if (dummyRating >= 1) {
      dummyRating--;
      return 1;
    } else if (dummyRating > 0) {
      const ratingCpy = dummyRating;
      dummyRating = 0;
      return ratingCpy >= 0.5 ? 0.5 : 0;
    }
    return 0;
  });
  return ratingArr;
};

const ProductCard = ({ item, qty }) => {
  const [mainImage, setMainImage] = useState(item.featuredImgs[0]);
  return (
    <div className="flex items-center justify-between bg-white p-4 rounded-lg border border-blue-100 hover:border-blue-300 transition">
      <div className="flex items-center gap-4 flex-1">
        <img
          src={mainImage || "/placeholder.svg"}
          alt={item.name}
          className="w-16 h-16 rounded object-cover"
        />
        <div className="flex-1">
          <h3 className="font-semibold text-foreground">{item.name}</h3>
          <p className="text-primary font-bold">
            {`Rs. ${item.price} X ${qty}= Rs. ${new Intl.NumberFormat({
              style: "currency",
              currency: "NPR",
            }).format(item.price * qty)}`}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex gap-x-1">
          {getStartRating(
            item.ratings.reduce((acc, curr) => acc + curr.rate, 0) /
              item.ratings.length
          ).map((currRating, index) => (
            <span className="text-yellow-400 text-base">
              {currRating === 1 ? (
                <FaStar />
              ) : currRating === 0 ? (
                <FaRegStar />
              ) : (
                <FaStarHalfAlt />
              )}
            </span>
          ))}
        </div>
        <div className="flex gap-x-1">
          {item.featuredImgs.map((img, indx) => {
            return (
              <button
                className=""
                key={indx}
                onClick={() => setMainImage(img)}
              >
                <div
                  className="overflow-hidden p-1 border-2 border-gray-100 rounded-md
                                            hover:border-slate-400 transition-all"
                >
                  <img
                    src={img}
                    alt={item.name}
                    className={`w-8 h-8  object-contain ${
                      img === mainImage ? "border-blue-500" : ""
                    }`}
                  />
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
