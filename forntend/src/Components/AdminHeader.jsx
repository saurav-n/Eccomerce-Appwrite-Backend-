import Logo from "./Logo"
import { MdLogout } from "react-icons/md"
import useSession  from "@/hooks/session"
import { NavLink } from "react-router-dom"
import Hamburger from "./Header/hamburger"
import SlidingNavigtion from "./Header/SlidingNavigation"
import { Link } from "react-router-dom"
import { useState } from "react"
import { useEffect } from "react"
import { useToast } from "./Toast/use-toast"
import { useNavigate } from "react-router"
import axios from "axios"
import Loader from "./Loader"

export default function AdminHeader(){
    const navigate=useNavigate()
    const [shouldNavsBeShown, setShouldNavsBeShown] = useState(false);
    const {status,data}=useSession()
    const[isLoggingOut,setIsLoggingOut]=useState(false)
    const {toast}=useToast()
    const navItems=[{
        name:'Home',
        path:'/'
    },{
        name:'Add Product',
        path:'/addProduct'
    }]

    const onHamburgerClickHandler = () => {
        setShouldNavsBeShown(prev => !prev)
    }   

    const handleLogout=async()=>{
        setIsLoggingOut(true)
        try {
            const response=await axios.post('http://localhost:3000/api/auth/signout',{},{
                headers:{
                    'Authorization':`Bearer ${localStorage.getItem('token')}`
                }
            })
            if(response.data.success){
                toast({
                    description:'You have logged out',
                })
                localStorage.removeItem('token')
                navigate('/login')
            }
        } catch (error) {
            console.log(error)
            toast({
                description:error.response?.data?.message|| 'Something went wrong',
                variant:'destructive'
            })
        }finally{
            setIsLoggingOut(false)
        }
    }
    return(
        <>
            <div className="w-full flex flex-col justify-center py-4 shadow-md items-center fixed top-0 bg-white z-[99]">
                <div className="w-[90%] sm:w-[80%] flex justify-between  items-center">
                    <Logo className={'w-10 order-1'} />
                    <div className="order-2 sm:order-3 hidden sm:inline-block pl-1">
                        <ul className="w-full flex list-none text-gray-800 items-center gap-x-6">
                            {
                                navItems.map(navItem => (
                                    <li key={navItem.name}>
                                        <NavLink to={navItem.path} className={({isActive})=>`group flex flex-col gap-y-1
                                        ${isActive?'font-bold':''}`}>
                                            <p className="group-hover:text-black">{navItem.name}</p>
                                            <div className="w-0 h-[1.5px] rounded-lg bg-black group-hover:w-full duration-300"></div>
                                        </NavLink>
                                    </li>
                                ))
                            }
                        </ul>
                    </div>
                    <div className="min-w-[70px] flex justify-between order-2 sm:order-3 bg-blue-500 rounded-md p-2 text-white hover:bg-blue-600">
                        <button 
                        className=" flex justify-center items-center"
                        disabled={status==='unauthenticated'|| status==='loading'}
                        onClick={()=>handleLogout()}
                        >
                            {
                                isLoggingOut?(<Loader/>):(
                                    <>
                                        <MdLogout/>
                                        Logout
                                    </>
                                )
                            }
                        </button>
                    </div>
                    <Hamburger onClickHandler={onHamburgerClickHandler} className={'sm:hidden order-2 z-[99]'} />
                </div>
                <SlidingNavigtion shouldNavsBeShown={shouldNavsBeShown}>
                    <ul className="w-full flex flex-col items-center gap-y-1 list-none text-gray-800">
                    {
                               navItems.map(navItem => (
                                <li key={navItem.name}>
                                    <NavLink to={navItem.path} className={({isActive})=>`group flex flex-col gap-y-1
                                    ${isActive?'font-bold':''}`}>
                                        <p className="group-hover:text-black">{navItem.name}</p>
                                        <div className="w-0 h-[1.5px] rounded-lg bg-black group-hover:w-full duration-300"></div>
                                    </NavLink>
                                </li>
                            ))
                            }
                    </ul>
                </SlidingNavigtion>
            </div>
        </>
    )
}