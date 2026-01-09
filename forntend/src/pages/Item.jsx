import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import Container from "../Components/Container";
import { storageService } from "@/appwriteServices/storage";
import { secImagesDBService } from "@/appwriteServices/database/secImagesDb";
import StarRating from "@/Components/StarRating";
import ItemPropertyBadge from "@/Components/itemPropertyBadge";
import { MdDeliveryDining } from "react-icons/md";
import { TbReplaceFilled } from "react-icons/tb";
import { VscWorkspaceTrusted } from "react-icons/vsc";
import { FaPlus } from "react-icons/fa";
import { FaMinus } from "react-icons/fa";
import Button from "@/Components/Button";
import { useToast } from "@/Components/Toast/use-toast";
import useSession from "@/hooks/session";
import { useDispatch, useSelector } from "react-redux";
import { fetchItems } from "@/app/itemSlice";
import { fetchUsers } from "@/app/userSlice";
import Loader from "@/Components/Loader";
import axios from "axios";
import { Card } from "@/Components/ui/card";
import {
  Star,
  ShoppingCart,
  Truck,
  RefreshCw,
  Shield,
  Heart,
} from "lucide-react";

export default function Item() {
  const { itemId } = useParams();
  const { status, data } = useSession();
  const {
    items,
    isLoading: isItemsLoading,
    error: itemsError,
  } = useSelector((state) => state.item);
  const [item, setItem] = useState(null);
  const [itemImages, setItemImages] = useState([]);
  const [mainImage, setMainImage] = useState("");
  const [orderQty, setOrderQty] = useState(0);
  const [itemRating, setItemRating] = useState(null);
  const [isItemAddedToCart, setIsItemAddedToCart] = useState(false);
  const dispatch = useDispatch();
  const { toast } = useToast();

  useEffect(() => {
    dispatch(fetchItems({}));
  }, [dispatch]);

  useEffect(() => {
    if (items) {
      console.log("setting item");
      setItem(items.find((item) => item._id === itemId));
    }
  }, [items]);

  useEffect(() => {
    if (item) {
      setItemImages([...item.featuredImgs]);
      setMainImage(item.featuredImgs[0]);
      setOrderQty(item.stock >= 1 ? 1 : 0);
      console.log(
        parseFloat(
          item.ratings.length > 0
            ? item.ratings.reduce((total, rating) => total + rating.rate, 0) /
                item.ratings.length
            : 0
        )
      );
      setItemRating(
        parseFloat(
          item.ratings.length > 0
            ? item.ratings.reduce((total, rating) => total + rating.rate, 0) /
                item.ratings.length
            : 0
        )
      );
    }
  }, [item]);

  return (
    <Container>
      <div className="w-full flex justify-center items-center py-10">
        {itemsError ? (
          <p>{itemsError}</p>
        ) : isItemsLoading || !item ? (
          <Loader />
        ) : (
          <div className="w-full max-w-5xl mx-auto px-4 py-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
              <div className="flex gap-4 max-w-xl mx-auto">
                {/* Thumbnail Navigation */}
                <div className="flex flex-col gap-3 w-20">
                  {itemImages.map((img, idx) => (
                    <button
                      key={idx}
                      className="w-20 h-20 bg-slate-100 rounded-lg cursor-pointer hover:ring-2 hover:ring-blue-600 transition overflow-hidden"
                      onClick={() => setMainImage(img)}
                    >
                      <img
                        src={img}
                        alt={`Product variant ${idx}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>

                {/* Main Image */}
                <div className="flex-1">
                  <div className="bg-slate-100 rounded-xl overflow-hidden aspect-square flex items-center justify-center">
                    <img
                      src={mainImage}
                      alt={item.name}
                      className="w-full h-full  object-cover"
                    />
                  </div>
                </div>
              </div>
              <div className="space-y-8 w-full max-w-xl mx-auto">
                {/* Title & Rating */}
                <div>
                  <h1 className="text-3xl font-bold text-slate-900 mb-4">
                    {item.name}
                  </h1>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      {itemRating !== null && (
                        <StarRating itemId={item._id} rating={itemRating} />
                      )}
                    </div>
                  </div>
                </div>

                {/* Price Section */}
                <div className="border-y border-blue-100 py-6">
                  <div className="text-sm text-slate-600 mb-2 uppercase tracking-wide font-semibold">
                    Price
                  </div>
                  <div className="text-4xl font-bold text-blue-600">
                    {`Rs ${new Intl.NumberFormat({
                      style: "currency",
                      currency: "NPR",
                    }).format(item.price)}`}
                  </div>
                  <p className="text-sm text-slate-600 mt-3">
                    {item.description}
                  </p>
                </div>

                {/* Benefits Grid */}
                <div className="grid grid-cols-3 gap-3">
                  <Card className="p-4 text-center bg-blue-50 border-blue-100 hover:border-blue-300 transition">
                    <Truck className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                    <div className="text-xs font-semibold text-slate-900">
                      Free Delivery
                    </div>
                  </Card>
                  <Card className="p-4 text-center bg-blue-50 border-blue-100 hover:border-blue-300 transition">
                    <RefreshCw className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                    <div className="text-xs font-semibold text-slate-900">
                      Replacement
                    </div>
                  </Card>
                  <Card className="p-4 text-center bg-blue-50 border-blue-100 hover:border-blue-300 transition">
                    <Shield className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                    <div className="text-xs font-semibold text-slate-900">
                      100% Warranty
                    </div>
                  </Card>
                </div>

                {/* Stock Status */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="text-sm text-blue-900">
                    <span className="font-semibold">Availability:</span>
                    {item.stock > 0 ? "In stock" : "Out of stock"}
                  </div>
                </div>

                {/* Quantity & CTA */}
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-semibold text-slate-700">
                      Quantity
                    </span>
                    <div className="flex items-center gap-3 bg-blue-50 rounded-lg p-2 border border-blue-100">
                      <button
                        disabled={orderQty <= 0}
                        className="w-8 h-8 flex items-center justify-center text-blue-500 hover:bg-transparent hover:text-blue-800 bg-transparent font-bold disabled:opacity-40 disabled:text-blue-400 transition"
                        onClick={() => {
                          if (orderQty > 0) setOrderQty((prev) => prev - 1);
                        }}
                      >
                        −
                      </button>
                      <span className="w-8 text-center font-semibold text-slate-900">
                        {orderQty}
                      </span>
                      <button
                        disabled={orderQty>=item.stock}
                        className="w-8 h-8 flex items-center justify-center text-blue-500 hover:bg-transparent hover:text-blue-800 bg-transparent font-bold disabled:opacity-40 disabled:text-blue-400 transition"
                        onClick={() => {
                          if (orderQty < item.stock) setOrderQty((prev) => prev + 1);
                        }}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <Button
                    disabled={orderQty <= 0}
                    className="w-full h-12 bg-blue-300 text-white hover:bg-blue-300 disabled:cursor-not-allowed disabled:bg-slate-200"
                    onClick={() => {
                      const addToCart = async () => {
                        console.log('item adding to cart')
                        setIsItemAddedToCart(true);
                        try {
                          const res = await axios.post(
                            `${import.meta.env.VITE_BACKEND_URL}/api/user/addToCart`,
                            {
                              itemId,
                              qty: orderQty,
                            },
                            {
                              headers: {
                                Authorization: `Bearer ${localStorage.getItem(
                                  "token"
                                )}`,
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
                          console.log(error);
                          toast({
                            variant: "destructive",
                            title:
                              error.response?.data?.message ||
                              "Something went wrong",
                          });
                        } finally {
                          setIsItemAddedToCart(false);
                        }
                      };
                      addToCart();
                    }}
                  >
                    {isItemAddedToCart ? (
                      <Loader />
                    ) : (
                      <ShoppingCart className="w-5 h-5 mr-2" />
                    )}
                    Add to Cart
                  </Button>
                </div>
              </div>
            </div>
            {/* <div className="w-full flex flex-wrap items-center justify-center sm:flex-col">
              {itemImages.map((img, indx) => {
                return (
                  <button
                    className="w-1/4 min-w-[100px] h-[100px]"
                    key={indx}
                    onClick={() => setMainImage(img)}
                  >
                    <div
                      className="w-full h-full overflow-hidden p-1 border-2 border-gray-100 rounded-md
                                            hover:border-slate-400 transition-all"
                    >
                      <img
                        src={img}
                        alt={item.name}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  </button>
                );
              })}
            </div> */}
            {/* <div className="w-full max-w-[300px] flex flex-col items-center gap-y-2 px-1">
              <h1 className="text-xl font-semibold">{item.name}</h1>
              {itemRating !== null && (
                <StarRating itemId={item._id} rating={itemRating} />
              )}
              <div className="w-full max-w-[200px] h-[200px] overflow-hidden p-2 border-2 rounded-md border-slate-300">
                <img
                  src={mainImage}
                  alt={item.name}
                  className="w-full h-full object-contain"
                />
              </div>
              <p className="font-semibold">{`Rs ${new Intl.NumberFormat({
                style: "currency",
                currency: "NPR",
              }).format(item.price)}`}</p>
              <p className="text-sm text-gray-500">{item.description}</p>
              <div className="w-full flex flex-wrap gap-x-2 justify-center">
                <ItemPropertyBadge
                  className={"w-1/3 max-w-[56px]"}
                  badgeDesc={"Free Delivery"}
                >
                  <MdDeliveryDining />
                </ItemPropertyBadge>
                <ItemPropertyBadge
                  className={"w-1/3 max-w-[56px]"}
                  badgeDesc={"Replacement"}
                >
                  <TbReplaceFilled />
                </ItemPropertyBadge>
                <ItemPropertyBadge
                  className={"w-1/3 max-w-[56px]"}
                  badgeDesc={"100% warranty"}
                >
                  <VscWorkspaceTrusted />
                </ItemPropertyBadge>
              </div>
              <div className="h-[1px] w-full rounded-lg bg-slate-300"></div>
              <div className="w-full flex flex-col gap-y-2">
                <p className="text-sm text-gray-500">
                  {`Avialable: ${
                    parseInt(item.stock) > 0 ? "In stock" : "Out of stock"
                  }`}
                </p>
                <div className="flex gap-x-3">
                  <button
                    onClick={() => {
                      if (orderQty > 0) setOrderQty((prev) => prev - 1);
                    }}
                  >
                    <FaMinus />
                  </button>
                  <p>{orderQty}</p>
                  <button
                    onClick={() => {
                      if (orderQty < parseInt(item.stock))
                        setOrderQty((prev) => prev + 1);
                    }}
                  >
                    <FaPlus />
                  </button>
                </div>
                <Button
                  className={`w-[50%] min-w-[115px] ${
                    orderQty <= 0 ? "bg-gray-400" : ""
                  }`}
                  onClick={() => {
                    const addToCart = async () => {
                      setIsItemAddedToCart(true);
                      try {
                        const res = await axios.post(
                          `${import.meta.env.VITE_BACKEND_URL}/api/user/addToCart`,
                          {
                            itemId,
                            qty: orderQty,
                          },
                          {
                            headers: {
                              Authorization: `Bearer ${localStorage.getItem(
                                "token"
                              )}`,
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
                        console.log(error);
                        toast({
                          variant: "destructive",
                          title:
                            error.response?.data?.message ||
                            "Something went wrong",
                        });
                      } finally {
                        setIsItemAddedToCart(false);
                      }
                    };
                    addToCart();
                  }}
                  text={isItemAddedToCart ? <Loader /> : "Add to cart"}
                  disabled={orderQty <= 0}
                />
              </div>
            </div> */}
          </div>
        )}
      </div>
    </Container>
  );
}
