import express from "express";
import { createAddress } from "../controllers/address.js";
import { verifyToken } from "../middlewares/auth.js";
import { hasAddress } from "../middlewares/address.js";
import { deleteAdress } from "../controllers/address.js";

const addressRouter = express.Router();

addressRouter.post("/",verifyToken ,createAddress);
addressRouter.delete("/:addressId",verifyToken,hasAddress,deleteAdress)

export default addressRouter;