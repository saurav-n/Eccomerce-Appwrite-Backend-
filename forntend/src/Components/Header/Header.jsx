import Hamburger from "./hamburger"
import SlidingNavigtion from "./SlidingNavigation"
import Logo from "../Logo"
import { CiSearch } from "react-icons/ci"
import { FaCartShopping } from "react-icons/fa6"
import { FaUser } from "react-icons/fa"
import { MdLogout } from "react-icons/md"
import { useState } from "react"
import { useNavigate, NavLink,Link } from 'react-router-dom'
import  useSession  from "@/hooks/session"
import { Skeleton } from "@/Components/skeleton"
import AdminHeader from "@/Components/AdminHeader"
import UserHeader from "@/Components/UserHeader"
export default function Header() {
    const {status,data}=useSession()

    return(
        <>
            {<UserHeader/>}
        </>
    )
}