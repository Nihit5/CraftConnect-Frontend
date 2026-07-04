import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import Header from "./Header";

const Layout = () => {
  return (
    <div className="flex min-h-dvh w-full flex-col">
      <Header />

      <div className="main-body w-full flex-1">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default Layout;
