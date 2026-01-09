import { Router } from "express";
import { verifyToken } from "../middlewares/auth.js";
import { createOrder,confirmOrder,rejectOrder,getOrderIdFromPidx,getOrder,updateOrderStatus } from "../controllers/order.js";
import { isAuthorizedToOrder } from "../middlewares/order.js";
import { isAdmin } from "../middlewares/admin.js";  


const orderRouter = Router();

orderRouter.post("/", verifyToken, createOrder);
orderRouter.patch("/:orderId/confirm",verifyToken,isAuthorizedToOrder,confirmOrder)
orderRouter.patch("/:orderId/reject",verifyToken,isAuthorizedToOrder,rejectOrder)
orderRouter.get("/order/:orderId",verifyToken,isAuthorizedToOrder,getOrder)
orderRouter.get("/orderIdFromPidx/:pidx",verifyToken,getOrderIdFromPidx)
orderRouter.patch("/:orderId/status",verifyToken,isAdmin,updateOrderStatus)

export default orderRouter;