import {Router} from "express";
import {getItems} from "../controllers/item.js";
import { verifyToken } from "../middlewares/auth.js";

const itemRouter=Router()

itemRouter.route("/getItems").get(verifyToken,getItems)

export default itemRouter