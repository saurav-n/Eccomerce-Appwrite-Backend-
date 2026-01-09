export const isAdmin=(req,res,next)=>{
    try {
        if(req.user.role==="admin"){
            return next()
        }
        return res.status(401).json({
            success:false,
            message:"Unauthorized access"
        })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:error.message || 'Internal Server Error'
        })
    }
}