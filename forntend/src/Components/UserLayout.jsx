import { Outlet } from "react-router";
import Header from "./Header/Header";
import Footer from "./Footer/Footer";

export default function UserLayout() {
  return (
    <div className="min-h-screen w-full flex flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
