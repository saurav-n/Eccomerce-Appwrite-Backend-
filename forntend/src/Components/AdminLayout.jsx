import { Outlet } from "react-router"
import { AdminSidebar } from "./AdminSidebar"

export default function AdminLayout() {
  return (
    <div className="flex min-h-screen w-full">
      <AdminSidebar />
      <div className="flex-1 min-w-0 overflow-auto">
        <Outlet/>
      </div>
    </div>
  )
}