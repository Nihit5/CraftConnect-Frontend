import { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-dvh flex-col bg-[#FDF9F5]">
      <Navbar onMenuToggle={() => setIsSidebarOpen(true)} />

      <div className="flex flex-1">
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        <main className="min-w-0 flex-1 bg-white px-5 py-6 sm:px-8 sm:py-8 lg:px-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
