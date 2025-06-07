import Category from "../models/category.js";
import uploadFiles from "../utils/cloudinary.js";
import Item from "../models/item.js";
import mongoose from "mongoose";
import User from "../models/user.js";

const addCategory=async(req,res)=>{
    try {
        const {categoryName}=req.body
        if(!categoryName){
            return res.status(400).json({
                success:false,
                message:"Category name is required"
            })
        }

        const category=await Category.findOne({name:categoryName})
        if(category){
            return res.status(400).json({
                success:false,
                message:"Category already exists"
            })
        }

        const newCategory=new Category({name:categoryName})
        if(newCategory){
            await newCategory.save()
            return res.status(201).json({
                success:true,
                message:"Category created successfully"
            })
        }
        
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:error.message || 'Internal Server Error'
        })
    }
}

const getCategories=async(req,res)=>{
    try {
        const categories=await Category.find()
        if(!categories){
            return res.status(500).json({
                success:false,
                message:"Internal server Error",
            })
        }
        return res.status(200).json({
            success:true,
            message:"Categories fetched successfully",
            data:{
                categories
            }
        })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:error.message || 'Internal Server Error'
        })
    }
}

const addItem=async(req,res)=>{
    try {

        const {name,price,description,stock,category}=req.body

        if([name,price,description,stock,category].includes(undefined)){
            return res.status(400).json({
                success:false,
                message:"All fields are required"
            })
        }

        console.log(category)

        const existingCategory=await Category.findOne({name:category})
        if(!existingCategory){
            return res.status(400).json({
                success:false,
                message:"Category not found"
            })
        }
        console.log(req.files)
        const featuredImgs=[]
        for(const file of req.files){
            const url=await uploadFiles(file.path)
            featuredImgs.push(url)
        }
        console.log('featured images',featuredImgs)
        const item=new Item({
            name,
            price,
            description,
            stock,
            category,
            featuredImgs
        })

        if(item){
            await item.save()
            return res.status(201).json({
                success:true,
                message:"Item added successfully"
            })
        }
        return res.status(500).json({
            success:false,
            message:"Item creation failed"
        })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:error.message || 'Internal Server Error'
        })
    }
}


const deleteItem=async(req,res)=>{
    try {
        const {itemId}=req.query

        if(!itemId){
            return res.status(400).json({
                success:false,
                message:"Item ID is required"
            })
        }

        const users=await User.find()
        for(const user of users){
            for(const cartItem of user.carts){
                if(String(cartItem.itemId)===String(itemId)){
                    user.carts.splice(user.carts.indexOf(cartItem),1)
                    user.cartItemQty-=cartItem.qty
                    await user.save()
                }
            }
        }

        console.log(itemId)

        await Item.findByIdAndDelete(new mongoose.Types.ObjectId(itemId))
        return res.status(200).json({
            success:true,
            message:"Item deleted successfully"
        })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:error.message || 'Internal Server Error'
        })
    }
}

const updateItem=async(req,res)=>{
    try {

        const {itemId,name,price,description,stock,category}=req.body

        if([name,price,description,stock,category].includes(undefined)){
            return res.status(400).json({
                success:false,
                message:"All fields are required"
            })
        }

        const existingCategory=await Category.findOne({name:category})
        if(!existingCategory){
            return res.status(400).json({
                success:false,
                message:"Category not found"
            })
        }

        const addedFeaturedImgs=[]
        for(const file of req.files){
            console.log(file)
            const url=await uploadFiles(file.path)

            addedFeaturedImgs.push(url)
        }

        const item=await Item.findById(new mongoose.Types.ObjectId(itemId))

        if(!item){
            return res.status(404).json({
                success:false,
                message:"Item not found"
            })
        }

        const featuredImgs=[...item.featuredImgs,...addedFeaturedImgs]
        
        const updatedItem=await Item.findByIdAndUpdate(new mongoose.Types.ObjectId(itemId),{
            name,
            price,
            description,
            stock,
            category,
            featuredImgs
        },{new:true})

        if(!updatedItem){
            return res.status(500).json({
                success:false,
                message:"Item update failed"
            })
        }

        return res.status(200).json({
            success:true,
            message:"Item updated successfully",
            data:{
                updatedItem
            }
        })

    } catch (error) {
        return res.status(500).json({
            success:false,
            message:error.message || 'Internal Server Error'
        })
    }
}

export {addCategory,getCategories,addItem,deleteItem,updateItem}
    