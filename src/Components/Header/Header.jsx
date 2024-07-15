import Hamburger from "./hamburger"
import SlidingNavigtion from "./SlidingNavigation"
import Logo from "../Logo"
import { CiSearch } from "react-icons/ci"
import { FaCartShopping } from "react-icons/fa6"
import { FaUser } from "react-icons/fa"
import { MdLogout } from "react-icons/md"
import { useState } from "react"
import { useNavigate, NavLink,Link } from 'react-router-dom'
import { useSelector,useDispatch } from "react-redux"
import { authService } from "../../appwriteServices/authentication"
import { authActions } from "../../app/authSlice"
import { useToast } from "../Toast/use-toast"
export default function Header() {
    const [shouldNavsBeShown, setShouldNavsBeShown] = useState(false);
    const authStatus = useSelector(state => state.auth.status)
    const userData=useSelector(state=>state.auth.userData)
    const users=useSelector(state=>state.user.users)
    const [currentUser]=users.filter(user=>user.accountId===userData?.$id)
    const onHamburgerClickHandler = () => {
        setShouldNavsBeShown(prev => !prev)
    }
    const {toast}=useToast()
    const dispatch=useDispatch()
    const navigate = useNavigate()
    const navItems = [
        {
            name: 'Home',
            path: '/'
        },
        // {
        //     name: 'About',
        //     path: '/about'
        // },
        // {
        //     name: 'Contact',
        //     path: '/contact'
        // },
        {
            name: 'Product',
            path: '/product'
        },
    ]
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
                    <div className="min-w-[70px] flex justify-between order-2 sm:order-3">
                        <Link to={'/myCart'}>
                        <div className="relative h-10 w-10 flex justify-center items-center">
                                <FaCartShopping/>
                                <div 
                                className={`${currentUser&&currentUser?.cartItemQty.reduce((acc,qty)=>{
                                        return acc+qty
                                    },0)!==0?'flex':'hidden'} w-4 h-4 justify-center 
                                items-center absolute bg-blue-500 rounded-full top-[2px] right-1`}
                                >
                                    <p className="text-xs">{
                                        currentUser?.cartItemQty.reduce((acc,qty)=>{
                                            return acc+qty
                                        },0)
                                    }</p>
                                </div>
                            </div>
                        </Link>
                        <Link to={'/account'}>
                            <div className="flex justify-center items-center h-10 w-10">
                                <FaUser/>
                            </div>
                        </Link>
                        <button 
                        className=" flex justify-center items-center h-10 w-10"
                        disabled={!authStatus}
                        onClick={()=>{
                            console.log('logged out');
                            authService.logOut();
                            dispatch(authActions.logOut())
                            toast({
                                description:'You have logged out'
                            })
                            navigate('/')
                        }}
                        >
                            <MdLogout/>
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