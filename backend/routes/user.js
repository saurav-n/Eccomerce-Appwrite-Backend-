import { Router } from "express";
import { verifyToken } from "../middlewares/auth.js";
import { updateSearchHistory,addToCart,rateItem,removeItemFromCart,clearCart,getUsers } from "../controllers/user.js";

const userRouter=Router()

userRouter.post("/updateSearchHistory",verifyToken,updateSearchHistory)
userRouter.post("/addToCart",verifyToken,addToCart)
userRouter.post("/rateItem",verifyToken,rateItem)
userRouter.post("/removeItemFromCart",verifyToken,removeItemFromCart)
userRouter.post("/clearCart",verifyToken,clearCart)
userRouter.get("/getUsers",verifyToken,getUsers)
export default userRouter


