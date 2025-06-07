import useSession from "@/hooks/session"
import { useState } from "react"
import SlidingNavigtion from "./Header/SlidingNavigation"
import Hamburger from "./Header/hamburger"
import { NavLink } from "react-router-dom"
import { Link } from "react-router-dom"
import Logo from "./Logo"
import { FaCartShopping } from "react-icons/fa6"
import { FaUser } from "react-icons/fa"
import { MdLogout } from "react-icons/md"
import { useNavigate } from "react-router"
import axios from "axios"
import { useToast } from "./Toast/use-toast"
import Loader from "./Loader"
import { useDispatch,useSelector } from "react-redux"
import { useEffect } from "react"
import { fetchUsers } from "@/app/userSlice";


export default function UserHeader() {
    const {status,data}=useSession()
    const {users,isLoading:isUsersLoading,error:usersError}=useSelector((state)=>state.user)
    const [shouldNavsBeShown,setShouldNavsBeShown]=useState(false)
    const [isLoggingOut,setIsLoggingOut]=useState(false)
    const [currUser,setCurrUser]=useState(null)
    const {toast}=useToast()
    const navigate=useNavigate()
    const dispatch=useDispatch()
    const navItems=[{
        name:'Home',
        path:'/'
    },{
        name:'Product',
        path:'/product'
    }]

    useEffect(()=>{
        dispatch(fetchUsers())
    },[dispatch])

    useEffect(()=>{
        if(users && data && status==='authenticated'){
            const user=users.find(user=>user._id===data.user._id)
            setCurrUser(user)
        }
    },[users,data,status])

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

    const onHamburgerClickHandler=()=>{
        setShouldNavsBeShown(prev=>!prev)
    }
    return (
        <>
            <div className="w-full flex flex-col justify-center py-4 shadow-md items-center fixed top-0 bg-white z-[99]">
                <div className="w-[90%] sm:w-[80%] flex justify-between  items-center">
                    <Logo className={'w-10 order-1'} />
                    <div className="order-2 sm:order-3 hidden sm:inline-block pl-1">
                        <ul className="w-full flex list-none text-gray-800 items-center gap-x-6">
                            {
                                navItems.map(navItem => (
                                    <li key={navItem.name}>
                                        <NavLink to={navItem.path} className={({ isActive }) => `group flex flex-col gap-y-1
                            ${isActive ? 'font-bold' : ''}`}>
                                            <p className="group-hover:text-black">{navItem.name}</p>
                                            <div className="w-0 h-[1.5px] rounded-lg bg-black group-hover:w-full duration-300"></div>
                                        </NavLink>
                                    </li>
                                ))
                            }
                        </ul>
                    </div>
                    <div className="min-w-[70px] flex justify-between order-2 sm:order-3 gap-2 text-white">
                        <Link to={'/myCart'}>
                            <div className="relative flex justify-center items-center rounded-md bg-blue-500 p-2 hover:bg-blue-600">
                                <FaCartShopping />
                                My Cart
                                {status==='authenticated'&&<div
                                    className={`${currUser?.cartItemQty !== 0 ? 'flex' : 'hidden'} w-6 h-6 justify-center 
                                    items-center absolute bg-gray-200 text-black rounded-full top-[-10px] right-1`}
                                >
                                    <p className="text-xs">{
                                        currUser?.cartItemQty
                                    }</p>
                                </div>}
                            </div>
                        </Link>
                        <button
                            className=" flex justify-center items-center rounded-md bg-blue-500 p-2 hover:bg-blue-600"
                            disabled={status==='loading'||status==='unauthenticated'}
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
                                    <NavLink to={navItem.path} className={({ isActive }) => `group flex flex-col gap-y-1
                        ${isActive ? 'font-bold' : ''}`}>
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