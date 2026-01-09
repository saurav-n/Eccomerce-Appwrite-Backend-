import mongoose from "mongoose";
import mongoosePaginate from "mongoose-aggregate-paginate-v2";

const userSchema=new mongoose.Schema({
    userName:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        enum:["user","admin"],
        default:"user"
    },
    searchHistory:{
        type:[String],
        default:[]
    },
    carts:{
        type:[
            {
                itemId:{
                    type:mongoose.Schema.Types.ObjectId,
                    ref:"Item"
                },
                qty:{
                    type:Number,
                }
            }
        ],
        default:[]
    },
    cartItemQty:{
        type:Number,
        default:0
    }
})

userSchema.plugin(mongoosePaginate);

const User=mongoose.model("User",userSchema)

export default User
