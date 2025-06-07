import Item from "../models/item.js";

const getItems=async(req,res)=>{
    try {
        const items=await Item.find()
        if(!items){
            return res.status(500).json({
                success:false,
                message:"Internal server Error",
            })
        }
        return res.status(200).json({
            success:true,
            message:"Items fetched successfully",
            data:{
                items
            }
        })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:error.message || 'Internal Server Error'
        })
    }
}
    
export {getItems}