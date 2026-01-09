"use client";
import { NavLink } from "react-router-dom";
import { LayoutGrid, Package, Tag, ShoppingCart, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useToast } from "./Toast/use-toast";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Loader from "./Loader";
import Button from "./Button";
import { useLocation } from "react-router-dom";
import Hamburger from "./Header/hamburger";
import SlidingNavigtion from "./Header/SlidingNavigation";

const navItems = [
  { id: "dashboard", path: "/", icon: LayoutGrid, label: "Dashboard" },
  { id: "products", path: "/products", icon: Package, label: "Products" },
  { id: "categories", path: "/categories", icon: Tag, label: "Categories" },
  { id: "orders", path: "/orders", icon: ShoppingCart, label: "Orders" },
];

export function AdminSidebar() {
  const location = useLocation();
  const [isSideBarOpen, setIsSideBarOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  console.log(location);
  const handleLogout = async () => {
    console.log("User logged out");
    // Handle logout logic here (clear auth, redirect, etc.)
    setIsLoggingOut(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/signout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.data.success) {
        toast({
          description: "You have logged out",
        });
        localStorage.removeItem("token");
        navigate("/login");
      }
    } catch (error) {
      console.log(error);
      toast({
        description: error.response?.data?.message || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <>
      <aside className="w-64 min-h-screen bg-slate-900 border-r border-slate-700 hidden sm:flex flex-col sticky top-0">
        {/* Logo Section */}
        <div className="p-6 border-b border-slate-700">
          <NavLink
            to="/dashboard"
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <span className="text-lg font-bold text-white">Admin</span>
          </NavLink>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.id}>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      cn(
                        "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left",
                        isActive ||
                          (item.path === "/" && location.pathname === "/")
                          ? "bg-blue-600 text-white"
                          : "text-slate-300 hover:bg-slate-800 hover:text-white"
                      )
                    }
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-slate-700">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors text-left text-sm font-medium"
          >
            {isLoggingOut ? <Loader /> : <LogOut className="w-5 h-5" />}
            <span>Logout</span>
          </button>
        </div>
      </aside>
      <Hamburger
        onClickHandler={() => {
          setIsSideBarOpen(!isSideBarOpen);
        }}
        className={"sm:hidden fixed top-4 right-4 z-[99]"}
      />
      <SlidingNavigtion shouldNavsBeShown={isSideBarOpen} className="w-fit">
        <aside className="w-full min-w-64 min-h-screen h-full z-50 bg-slate-900 border-r border-slate-700 flex flex-col">
          {/* Logo Section */}
          <div className="p-6 border-b border-slate-700">
            <NavLink
              to="/dashboard"
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">A</span>
              </div>
              <span className="text-lg font-bold text-white">Admin</span>
            </NavLink>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.id}>
                    <NavLink
                      to={item.path}
                      className={({ isActive }) =>
                        cn(
                          "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left",
                          isActive ||
                            (item.path === "/" && location.pathname === "/")
                            ? "bg-blue-600 text-white"
                            : "text-slate-300 hover:bg-slate-800 hover:text-white"
                        )
                      }
                    >
                      <Icon className="w-5 h-5" />
                      <span className="text-sm font-medium">{item.label}</span>
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Logout Button */}
          <div className="p-4 border-t border-slate-700">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors text-left text-sm font-medium"
            >
              {isLoggingOut ? <Loader /> : <LogOut className="w-5 h-5" />}
              <span>Logout</span>
            </button>
          </div>
        </aside>
      </SlidingNavigtion>
    </>
  );
}
