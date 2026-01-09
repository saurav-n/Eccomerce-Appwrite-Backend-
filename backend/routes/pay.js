import { Router } from "express";
import { verifyToken } from "../middlewares/auth.js";
import { initiatePaymentKhalti } from "../controllers/pay.js";

const payRouter = Router();

payRouter.post("/khalti", verifyToken, initiatePaymentKhalti);

export default payRouter;