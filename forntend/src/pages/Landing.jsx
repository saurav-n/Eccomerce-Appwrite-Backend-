import AdminLanding from "@/Components/AdminLanding"
import UserLanding from "@/Components/UserLanding"
import  useSession  from '@/hooks/session'
import AppLoader from "@/Components/appLoader"
import { useEffect } from "react"

export default function Landing(){
    const {status,data}=useSession()
    console.log('From landing page')
    console.log(status,data)
    useEffect(()=>{
        console.log(status,data)
    },[status,data])
    return(
        <>
           {status==='loading'?<AppLoader/>:status==='authenticated'&&data.user.role==='admin'?<AdminLanding/>:<UserLanding/>}
        </>
    )
}