import User from "../models/user.js"
import Item from "../models/item.js"
import Order from "../models/order.js"
import mongoose from "mongoose"

const getUsers=async (req,res)=>{
    try {
        const users=await User.find()
        if(!users){
            return res.status(500).json({
                success:false,
                message:"Internal server Error"
            })
        }
        return res.status(200).json({
            success:true,
            message:"Users fetched successfully",
            data:{
                users
            }
        })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:error.message || 'Internal Server Error'
        })
    }
}

const updateSearchHistory=async (req,res)=>{
    try {
        const {searchedVal}=req.body
        if(!searchedVal){
            return res.status(400).json({
                success:false,
                message:"Search value is required"
            })
        }
        const user=await User.findById(req.user.id)
        if(!user){
            return res.status(404).json({
                success:false,
                message:"User not found"
            })
        }
        user.searchHistory.push(searchedVal)
        await user.save()
        return res.status(200).json({
            success:true,
            message:"Search history updated successfully"
        })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:error.message || 'Internal Server Error'
        })
    }
}

const createOrder=async (req,res)=>{
    try {
        const {itemId,qty}=req.body
        if(!itemId||!qty){
            return res.status(400).json({
                success:false,
                message:"Item id and quantity are required"
            })
        }
        const item=await Item.findById(new mongoose.Types.ObjectId(itemId))
        if(!item){
            return res.status(404).json({
                success:false,
                message:"Item not found"
            })
        }
        const newOrder=await Order.create({
            owner:req.user.id,
            item:itemId,
            qty:qty
        })
        if(!newOrder){
            return res.status(400).json({
                success:false,
                message:"Order creation failed"
            })
        }
        return res.status(200).json({
            success:true,
            message:"Order created successfully"
        })            
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:error.message || 'Internal Server Error'
        })
    }
}

const addToCart=async (req,res)=>{
    try {
        const {itemId,qty}=req.body
        if(!itemId||!qty){
            return res.status(400).json({
                success:false,
                message:"Item id and quantity are required"
            })
        }

        const itemObjId=new mongoose.Types.ObjectId(itemId)
        const user=await User.findById(req.user.id)
        if(!user){
            return res.status(404).json({
                success:false,
                message:"User not found"
            })
        }

        const item=await Item.findById(itemObjId)
        if(!item){
            return res.status(404).json({
                success:false,
                message:"Item not found"
            })
        }

        const itemInCart=user.carts.find(cartItem=>String(cartItem.itemId)===String(itemObjId))
        console.log(itemInCart)
        if(itemInCart){
            return res.status(404).json({
                success:false,
                message:"Item already in cart"
            })
        }

        if(item.stock<qty){
            return res.status(400).json({
                success:false,
                message:"Not enough stock"
            })
        }
        user.carts.push({
            itemId:itemObjId,
            qty:qty
        })

        user.cartItemQty+=qty
        item.stock-=qty
        await user.save()
        await item.save()
        return res.status(200).json({
            success:true,
            message:"Item added to cart"
        })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:error.message || 'Internal Server Error'
        })
    }
}

const rateItem=async (req,res)=>{
    try {
        const {itemId,userRate}=req.body
        if(!itemId||!userRate){
            return res.status(400).json({
                success:false,
                message:"Item id and rating are required"
            })
        }

        const item=await Item.findById(new mongoose.Types.ObjectId(itemId))
        if(!item){
            return res.status(404).json({
                success:false,
                message:"Item not found"
            })
        }

        const user=await User.findById(req.user.id)
        if(!user){
            return res.status(404).json({
                success:false,
                message:"User not found"
            })
        }

        const hasUserRatedItem=item.ratings.find(rating=>String(rating.ratedBy)===String(req.user.id))
        console.log(userRate)
        console.log(hasUserRatedItem)
        console.log(req.user.id)
        let newRating=[]
        if(hasUserRatedItem){
            newRating=item.ratings.map(rating=>String(rating.ratedBy)===String(req.user.id)?{
                ratedBy:new mongoose.Types.ObjectId(req.user.id),
                rate:userRate
            }:rating)
        }
        else{
            newRating=[...item.ratings,{
                ratedBy:new mongoose.Types.ObjectId(req.user.id),
                rate:userRate
            }]
        }
        const updatedItem=await Item.findByIdAndUpdate(item._id,{ratings:newRating})
        if(!updatedItem){
            return res.status(400).json({
                success:false,
                message:"Item rating update failed"
            })
        }
        return res.status(200).json({
            success:true,
            message:"Item rated successfully"
        })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:error.message || 'Internal Server Error'
        })
    }
}


const removeItemFromCart=async(req,res)=>{
    try {
        const {itemId}=req.body
        if(!itemId){
            return res.status(400).json({
                success:false,
                message:"Item id is required"
            })
        }

        console.log(itemId)

        const user=await User.findById(req.user.id)
        if(!user){
            return res.status(404).json({
                success:false,
                message:"User not found"
            })
        }

        const item=await Item.findById(new mongoose.Types.ObjectId(itemId))
        if(!item){
            return res.status(404).json({
                success:false,
                message:"Item not found"
            })
        }

        const itemInCart=user.carts.find(cartItem=>String(cartItem.itemId)===String(itemId))
        if(!itemInCart){
            return res.status(404).json({
                success:false,
                message:"Item not found in cart"
            })
        }

        user.carts=user.carts.filter(cartItem=>String(cartItem.itemId)!==String(itemId))
        user.cartItemQty-=itemInCart.qty
        item.stock+=itemInCart.qty
        await item.save()
        await user.save()
        return res.status(200).json({
            success:true,
            message:"Item removed from cart"
        })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:error.message || 'Internal Server Error'
        })
    }
}

const clearCart=async(req,res)=>{
    try {
        const user=await User.findById(req.user.id)
        if(!user){
            return res.status(404).json({
                success:false,
                message:"User not found"
            })
        }

        for(const cartItem of user.carts){
            const item=await Item.findById(cartItem.itemId)
            if(!item){
                return res.status(404).json({
                    success:false,
                    message:"Item not found"
                })
            }
            item.stock+=cartItem.qty
            await item.save()
        }
        user.carts=[]
        user.cartItemQty=0
        await user.save()
        return res.status(200).json({
            success:true,
            message:"Cart cleared successfully"
        })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:error.message || 'Internal Server Error'
        })
    }
}
export {updateSearchHistory,createOrder,addToCart,rateItem,removeItemFromCart,clearCart,getUsers}