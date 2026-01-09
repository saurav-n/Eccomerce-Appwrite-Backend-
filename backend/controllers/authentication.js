import User from "../models/user.js";
import jwt from "jsonwebtoken";

const signUp=async(req,res)=>{
    try {
        console.log(req)
        const {userName,password}=req.body
        
        if(!userName || !password){
            return res.status(400).json({
                success:false,
                message:"User name and password are required",
            })
        }

        const user=await User.findOne({userName})
        if(user){
            return res.status(400).json({
                success:false,
                message:"User already exists"
            })
        }

        const newUser=new User({userName,password})

        if(newUser){
            await newUser.save()
            return res.status(201).json({
                success:true,
                message:"User created successfully"
            })
        }

        return res.status(500).json({
            success:false,
            message:"User creation failed"
        })
        
        
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:error.message || 'Internal Server Error'
        })
    }
}


const signIn=async(req,res)=>{
    try {
        const {userName,password}=req.body

        console.log(userName,password)
        
        if(!userName || !password){
            return res.status(400).json({
                success:false,
                message:"User name and password are required"
            })
        }

        const user=await User.findOne({userName})
        if(!user){
            return res.status(400).json({
                success:false,
                message:"User not found"
            })
        }

        if(user.password!==password){
            return res.status(400).json({
                success:false,
                message:"Incorrect password"
            })
        }

        const token=jwt.sign({id:user._id,role:user.role},process.env.JWT_SECRET,{
            expiresIn:"1d"
        })

        const cookieOptions={
            httpOnly:true,
            secure:true,
            sameSite:"strict",
            maxAge:24*60*60*1000
        }

        return res.cookie("token",token,cookieOptions).status(200).json({
            success:true,
            message:"User signed in successfully",
            data:{
                token
            }
        })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:error.message || 'Internal Server Error'
        })
    }
}


const signOut=async(req,res)=>{
    try {
        return res.clearCookie("token").json({
            success:true,
            message:"User signed out successfully"
        })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:error.message || 'Internal Server Error'
        })
    }
}


const getCurrentUser=async(req,res)=>{
    try {
        const user=await User.findById(req.user.id)
        if(!user){
            return res.status(400).json({
                success:false,
                message:"User not found"
            })
        }
        return res.status(200).json({
            success:true,
            message:"User fetched successfully",
            data:{
                user
            }
        })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:error.message || 'Internal Server Error'
        })
    }
}

export {signUp,signIn,signOut,getCurrentUser}
