import jwt from "jsonwebtoken";

const verifyToken=async(req,res,next)=>{
    try {
        const token=req.cookies?.token||req.header('Authorization')?.replace('Bearer ','')
        if(!token){
            return res.status(401).json({
                success:false,
                message:"Unauthorized"
            })
        }
        console.log('token',token)
        const decodedToken=jwt.verify(token,process.env.JWT_SECRET)
        req.user=decodedToken
        next()
    } catch (error) {
        console.log('verify error',error)
        return res.status(500).json({
            success:false,
            message:error.message || 'Internal Server Error'
        })
    }
}


export {verifyToken}
    