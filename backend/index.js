import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.js"
import adminRouter from "./routes/admin.js"
import itemRouter from "./routes/item.js";
import userRouter from "./routes/user.js";
import { connectDb } from "./utils/connecDb.js";
import payRouter from "./routes/pay.js";
import orderRouter from "./routes/order.js";
import addressRouter from "./routes/address.js";


dotenv.config()

const app=express()
const port=process.env.PORT || 3000

app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials:true,
    methods: ['GET', 'POST', 'PUT', 'DELETE','PATCH' ,'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}))
app.use(express.json())

app.use(cookieParser())

app.use(express.urlencoded({extended:true}))

app.use(express.static("public"))


app.use("/api/auth",authRouter)
app.use("/api/admin",adminRouter)
app.use("/api/item",itemRouter)
app.use("/api/user",userRouter)
app.use("/api/pay",payRouter)
app.use("/api/order",orderRouter)
app.use("/api/address",addressRouter)

app.get("/",(req,res)=>{
    res.send("Hello World")
})

app.listen(port,async()=>{
    await connectDb()
    console.log(`Server running on port ${port}`)
})
