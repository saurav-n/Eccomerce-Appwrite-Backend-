import {Router} from "express";
import {signUp,signIn,signOut,getCurrentUser} from "../controllers/authentication.js"
import {verifyToken} from "../middlewares/auth.js"


const authRouter=Router()

authRouter.post("/signup",signUp)
authRouter.post("/signin",signIn)
authRouter.post("/signout",verifyToken,signOut)
authRouter.get("/me",verifyToken,getCurrentUser)

export default authRouter
