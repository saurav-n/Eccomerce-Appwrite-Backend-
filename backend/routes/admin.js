import { Router } from "express";
import { verifyToken } from "../middlewares/auth.js";
import {
  addCategory,
  getCategories,
  addItem,
  deleteItem,
  updateItem,
  updateCategory,
  deleteCategory,
  getDashBoardData,
  getOrders,
  getOrder
} from "../controllers/admin.js";
import { upload } from "../middlewares/multer.js";
import { isAdmin } from "../middlewares/admin.js";

const adminRouter = Router();

adminRouter.use(verifyToken);

adminRouter.get("/getCategories",  getCategories);
adminRouter.use(isAdmin)
adminRouter.post("/addCategory",  addCategory);
adminRouter.post(
  "/addItem",
  
  upload.array("featuredImgs"),
  addItem
);
adminRouter.delete("/deleteItem",  deleteItem);
adminRouter.post(
  "/updateItem",
  
  upload.array("newFeaturedImgs"),
  updateItem
);
adminRouter.post("/updateCategory/:catId",  updateCategory);
adminRouter.delete("/deleteCategory/:catId",  deleteCategory);
adminRouter.get("/dashBoradData",  getDashBoardData);
adminRouter.get('/orders',getOrders)
adminRouter.get('/order/:orderId',getOrder)
export default adminRouter;
