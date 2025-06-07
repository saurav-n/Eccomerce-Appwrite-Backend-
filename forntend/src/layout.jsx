import Header from './Components/Header/Header'
import Footer from "./Components/Footer/Footer"
import { Outlet } from "react-router"
export default function Layout() {
    return (
        <>
            <Header />
            <Outlet />
            <Footer />
        </>
    )
}