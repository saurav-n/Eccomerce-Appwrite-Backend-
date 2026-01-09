import Address from "../models/address.js";

export const hasAddress = async (req, res, next) => {

    try {
        const addressId=req.params.addressId
        if(!addressId){
            return res.status(400).json({
                success:false,
                message:"addressId is required"
            })
        }

        const addres=await Address.findById(addressId)
        if(!addres){
            return res.status(404).json({
                success:false,
                message:"Address not found"
            })
        }

        if(String(addres.owner)!==String(req.user.id)){
            console.log(String(addres.owner),String(req.user.id))
            return res.status(401).json({
                success:false,
                message:"You haven't added this address to your account"
            })
        }

        return next()
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Internal Server Error",
        });
    }
}