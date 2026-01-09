import useSession from "@/hooks/session"
import { useState } from "react"
import SlidingNavigtion from "./Header/SlidingNavigation"
import Hamburger from "./Header/hamburger"
import { NavLink } from "react-router-dom"
import { Link } from "react-router-dom"
import Logo from "./Logo"
import { FaCartShopping } from "react-icons/fa6"
import { FaUser } from "react-icons/fa6"
import { MdLogout, MdAccountCircle } from "react-icons/md"
import * as Popover from '@radix-ui/react-popover'
import { useNavigate } from "react-router"
import axios from "axios"
import { useToast } from "./Toast/use-toast"
import Loader from "./Loader"
import { useDispatch, useSelector } from "react-redux"
import { useEffect } from "react"
import { fetchUsers } from "@/app/userSlice";


export default function UserHeader() {
    const { status, data } = useSession()
    const { users, isLoading: isUsersLoading, error: usersError } = useSelector((state) => state.user)
    const [shouldNavsBeShown, setShouldNavsBeShown] = useState(false)
    const [isLoggingOut, setIsLoggingOut] = useState(false)
    const [currUser, setCurrUser] = useState(null)
    const { toast } = useToast()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const navItems = [{
        name: 'Home',
        path: '/'
    }, {
        name: 'Product',
        path: '/product'
    }]

    useEffect(() => {
        dispatch(fetchUsers())
    }, [dispatch])

    useEffect(() => {
        if (users && data && status === 'authenticated') {
            const user = users.find(user => user._id === data.user._id)
            setCurrUser(user)
        }
    }, [users, data, status])

    const handleLogout = async () => {
        setIsLoggingOut(true)
        try {
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/signout`, {}, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            })
            if (response.data.success) {
                toast({
                    description: 'You have logged out',
                })
                localStorage.removeItem('token')
                navigate('/login')
            }
        } catch (error) {
            console.log(error)
            toast({
                description: error.response?.data?.message || 'Something went wrong',
                variant: 'destructive'
            })
        } finally {
            setIsLoggingOut(false)
        }
    }

    const onHamburgerClickHandler = () => {
        setShouldNavsBeShown(prev => !prev)
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
                    <div className="min-w-[70px] flex justify-between order-2 sm:order-3 gap-3">
                        <Link to={'/myCart'} className="group relative">
                            <div className="relative flex items-center rounded-full border-2 border-blue-500 p-2 text-white transition-all duration-300 sm:group-hover:pr-24 sm:hover:bg-blue-600 sm:hover:shadow-md">
                                <div className="flex items-center justify-center w-6 h-6">
                                    <FaCartShopping className="w-5 h-5 transition-transform sm:group-hover:scale-110 text-blue-500 sm:group-hover:text-white" />
                                </div>
                                <span className="absolute left-10 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-300 transform -translate-x-2 sm:group-hover:translate-x-2 pointer-events-none">
                                    My Cart
                                </span>
                                {status === 'authenticated' && currUser?.cartItemQty > 0 && (
                                    <div className="absolute -top-2 -right-2 sm:group-hover:opacity-0 flex items-center justify-center w-6 h-6 bg-white text-blue-600 rounded-full shadow-md border-2 border-blue-500 transition-transform sm:group-hover:scale-110">
                                        <p className="text-xs font-bold">{currUser?.cartItemQty}</p>
                                    </div>
                                )}
                            </div>
                        </Link>
                        <Popover.Root>
                            <Popover.Trigger asChild>
                                <button
                                    className="group relative flex items-center rounded-full border-2 border-blue-500 p-2 text-white transition-all duration-300 overflow-hidden sm:hover:bg-blue-600 sm:hover:shadow-md sm:hover:pr-32"
                                    disabled={status === 'loading' || status === 'unauthenticated'}
                                >
                                    <div className="flex items-center justify-center w-6 h-6">
                                        <FaUser className="w-5 h-5 transition-transform sm:group-hover:scale-110 text-blue-500 sm:group-hover:text-white" />
                                    </div>
                                    <span className="absolute left-10 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-300 transform -translate-x-2 sm:group-hover:translate-x-2 pointer-events-none">
                                        My Account
                                    </span>
                                </button>
                            </Popover.Trigger>
                            <Popover.Portal>
                                <Popover.Content
                                    className="rounded-lg bg-white shadow-xl border border-gray-200 w-56 p-1.5 animate-in fade-in-80 data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2"
                                    sideOffset={8}
                                    side="bottom"
                                    align="end"
                                >
                                    <div className="flex flex-col">
                                        <button
                                            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                                            onClick={() => navigate('/account')}
                                        >
                                            <MdAccountCircle className="w-5 h-5" />
                                            <span>Account</span>
                                        </button>
                                        <div className="border-t border-gray-200 my-1"></div>
                                        <button
                                            className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md"
                                            onClick={() => handleLogout()}
                                            disabled={isLoggingOut}
                                        >
                                            {isLoggingOut ? (
                                                <Loader className="w-4 h-4" />
                                            ) : (
                                                <>
                                                    <MdLogout className="w-5 h-5" />
                                                    <span>Logout</span>
                                                </>
                                            )}
                                        </button>
                                    </div>
                                    <Popover.Arrow className="fill-white" />
                                </Popover.Content>
                            </Popover.Portal>
                        </Popover.Root>
                    </div>
                    <Hamburger onClickHandler={onHamburgerClickHandler} className={'sm:hidden order-2 z-[99]'} />
                </div>
                <SlidingNavigtion shouldNavsBeShown={shouldNavsBeShown} className="bg-white py-28">
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