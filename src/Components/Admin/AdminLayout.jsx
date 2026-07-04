import { useState } from "react";
import { Outlet } from "react-router-dom";
import AdminNavbar from "./AdminNavbar";
import AdminSidebar from "./AdminSidebar";

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-dvh flex-col bg-[#FDF9F5]">
      <AdminNavbar onMenuToggle={() => setIsSidebarOpen(true)} />

      <div className="flex flex-1">
        <AdminSidebar
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

export default AdminLayout;
