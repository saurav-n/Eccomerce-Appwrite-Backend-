import axios from "axios"
import { useEffect, useState } from "react"

const useSession=()=>{
    const [session,setSession]=useState({status:'loading',data:null})
    useEffect(()=>{
        const getCurrentUser=async ()=>{
            try {
                const response=await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/auth/me`,{
                    headers:{
                        'Authorization':`Bearer ${localStorage.getItem('token')}`
                    }
                })
                console.log(response)
                setSession({status:'authenticated',data:response.data.data})
            } catch (error) {
                console.log(error)
                setSession({status:'unauthenticated',data:null})
            }
        }
        getCurrentUser()
    },[])
    return session
}

export default useSession