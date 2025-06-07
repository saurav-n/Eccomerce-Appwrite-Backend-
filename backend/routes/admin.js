import {Router} from "express";
import { verifyToken } from "../middlewares/auth.js";
import { addCategory,getCategories,addItem,deleteItem,updateItem } from "../controllers/admin.js";
import { upload } from "../middlewares/multer.js";

const adminRouter=Router()

adminRouter.post("/addCategory",verifyToken,addCategory)
adminRouter.get("/getCategories",verifyToken,getCategories)
adminRouter.post("/addItem",verifyToken,upload.array("featuredImgs"),addItem)
adminRouter.delete("/deleteItem",verifyToken,deleteItem)
adminRouter.post("/updateItem",verifyToken,upload.array("featuredImgs"),updateItem)

export default adminRouter