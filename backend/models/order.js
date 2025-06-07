import mongoose from "mongoose";

const orderSchema=new mongoose.Schema({
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    item:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Item"
    },
    qty:{
        type:Number,
        required:true
    }
})

const Order=mongoose.model("Order",orderSchema)

export default Order
