import mongoose from "mongoose";

export async function connectDb(){
    try {
        const connectionInstance=await mongoose.connect(process.env.MONGO_URI)
        console.log("MongoDB connected")
    } catch (error) {
        throw error
    }
}
    