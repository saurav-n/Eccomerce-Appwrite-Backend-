import Header from "./Components/Header/Header";
import Footer from "./Components/Footer/Footer";
import { Outlet } from "react-router";
import useSession from "./hooks/session";
import Loader from "./Components/Loader";
import AdminLayout from "./Components/AdminLayout";
import UserLayout from "./Components/UserLayout";
export default function Layout() {
  const { status, data } = useSession();
  return (
    <>
      {status === "loading" && (
        <div className="w-full h-screen flex justify-center items-center">
          <Loader/>
        </div>
      )}
      {status==='authenticated' && data.user.role==='admin'?<AdminLayout/>:<UserLayout/>}
    </>
  );
}
