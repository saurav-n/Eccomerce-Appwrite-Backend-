import mongoose from "mongoose";

const itemSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    stock:{
        type:Number,
        required:true
    },
    category:{
        type:String,
        required:true
    },
    featuredImgs:{
        type:[String],
        default:[]
    },
    ratings:{
        type:[{
            ratedBy:{
                type:mongoose.Schema.Types.ObjectId,
                ref:"User"
            },
            rate:{
                type:Number,
                required:true
            }
        }],
        default:[],
    },
})

const Item=mongoose.model("Item",itemSchema)

export default Item
