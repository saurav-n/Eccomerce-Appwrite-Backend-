import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate,useLocation } from "react-router";
import { useDispatch } from "react-redux";

export default function Protected({shouldBeAuthenticated,children}){
    const authStatus=useSelector(state=>state.auth.status)
    const navigate=useNavigate()
    const currentLocation=useLocation()
    const dispatch=useDispatch()

    useEffect(()=>{
        console.log(shouldBeAuthenticated&&shouldBeAuthenticated!==authStatus)
        if(shouldBeAuthenticated&&shouldBeAuthenticated!==authStatus){
            console.log('entered in protected component')
            navigate('/login',{state:{from:currentLocation}})
        }
    },[shouldBeAuthenticated,authStatus])

    return(
        <>{children}</>
    )
}