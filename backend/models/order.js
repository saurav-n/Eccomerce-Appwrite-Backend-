import mongoose from "mongoose";
import mongoosePaginate from "mongoose-aggregate-paginate-v2";

const orderSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  address:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Address"
  },
  products: [
    {
      item: { type: mongoose.Schema.Types.ObjectId, ref: "Item" },
      qty: Number,
    },
  ],
  status:{
    type:String,
    default:"pending"
  },
  paymentStatus:{
    type:String,
    default:"pending"
  },
  pidx:{
    type:String,
    default:''
  }
},{timestamps:true});

orderSchema.plugin(mongoosePaginate);

const Order = mongoose.model("Order", orderSchema);

export default Order;
