import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate,useLocation } from "react-router";
import useSession from "../hooks/session";
import AppLoader from "./appLoader";


export default function Protected({shouldBeAuthenticated,children}){
    const navigate=useNavigate()
    const currentLocation=useLocation()
    const session=useSession()

    useEffect(()=>{
        if(session.status==='unauthenticated'){
            navigate('/login',{state:{from:currentLocation}})
        }
    },[session])

    return(
        <>{session?.status==='loading'?<AppLoader/>:session?.status==='authenticated'?children:<p>Unauthorized</p>}</>
    )
}