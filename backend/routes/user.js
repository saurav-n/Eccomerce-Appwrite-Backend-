import { Router } from "express";
import { verifyToken } from "../middlewares/auth.js";
import {
  updateSearchHistory,
  addToCart,
  rateItem,
  removeItemFromCart,
  clearCart,
  getUsers,
  updateCartItemQty,
  getAddresses,
  makeDefaultAddress,
  getOrders,
} from "../controllers/user.js";

const userRouter = Router();

userRouter.post("/updateSearchHistory", verifyToken, updateSearchHistory);
userRouter.post("/addToCart", verifyToken, addToCart);
userRouter.post("/rateItem", verifyToken, rateItem);
userRouter.post("/removeItemFromCart", verifyToken, removeItemFromCart);
userRouter.post("/clearCart", verifyToken, clearCart);
userRouter.post("/updateCartItemQty", verifyToken, updateCartItemQty);
userRouter.get("/getUsers", verifyToken, getUsers);
userRouter.get("/addresses", verifyToken, getAddresses);
userRouter.patch(
  "/addresses/:addressId/default",
  verifyToken,
  makeDefaultAddress
);
userRouter.get("/orders", verifyToken, getOrders);
export default userRouter;
