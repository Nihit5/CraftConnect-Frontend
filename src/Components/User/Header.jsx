import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import logoImage from "../../assets/Logo.png";
import { useAuth } from "../../context/AuthContext";
import { notify } from "../../utils/toast";

const LOGO_URL = logoImage;

const navClass = ({ isActive }) =>
  [
    "shrink-0 text-sm font-medium transition-opacity hover:opacity-80 sm:text-[15px]",
    isActive
      ? "rounded-full bg-[#F2EBE4] px-3 py-1.5 text-[#2E1D17] sm:px-4 sm:py-2"
      : "rounded-full px-3 py-1.5 text-[#6B6560] sm:px-4 sm:py-2",
  ].join(" ");

const iconBtn =
  "flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[#4A4A4A] transition-opacity hover:opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B05B3B] sm:h-10 sm:w-10";

function IconSearch(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={22}
      height={22}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...props}
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}

function IconCart(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={22}
      height={22}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...props}
    >
      <circle cx="9" cy="21" r="1" />
      <circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    </svg>
  );
}

function IconUser(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={22}
      height={22}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...props}
    >
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20a8 8 0 0 1 16 0" />
    </svg>
  );
}

function Brand() {
  return (
    <Link
      to="/"
      className="flex min-w-0 max-w-full items-center gap-2 rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B05B3B]"
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full sm:h-11 sm:w-11">
        <img
          src={LOGO_URL}
          alt="CraftConnect"
          className="h-full w-full scale-[1.9] object-cover"
        />
      </div>
      <span className="truncate font-serif text-base font-bold tracking-tight text-[#1A1A1A] sm:text-lg md:text-[22px]">
        CraftConnect
      </span>
    </Link>
  );
}

function ProfileMenu() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  const handleLogout = () => {
    setIsOpen(false);
    logout();
    notify.info("You have been logged out.");
    navigate("/login", { replace: true });
  };

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        className={iconBtn}
        aria-label="Profile"
        aria-expanded={isOpen}
        aria-haspopup="menu"
        onClick={() => setIsOpen((open) => !open)}
      >
        <IconUser className="max-sm:scale-90" />
      </button>

      {isOpen && (
        <div
          role="menu"
          className="absolute right-0 top-[calc(100%+8px)] z-50 min-w-[180px] overflow-hidden rounded-xl border border-[#E8DFD6] bg-white py-1 shadow-lg"
        >
          <Link
            to="/profile"
            role="menuitem"
            onClick={() => setIsOpen(false)}
            className="block px-4 py-2.5 text-sm text-[#3D342E] transition-colors hover:bg-[#F8F4EF]"
          >
            My Profile
          </Link>
          <button
            type="button"
            role="menuitem"
            onClick={handleLogout}
            className="block w-full px-4 py-2.5 text-left text-sm text-[#3D342E] transition-colors hover:bg-[#F8F4EF]"
          >
            Log Out
          </button>
        </div>
      )}
    </div>
  );
}

function Actions() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="flex shrink-0 items-center gap-2">
      <button
        type="button"
        className={`${iconBtn} hidden sm:flex`}
        aria-label="Search"
      >
        <IconSearch className="max-sm:scale-90" />
      </button>
      <button
        type="button"
        className={`${iconBtn} hidden sm:flex`}
        aria-label="Cart"
      >
        <IconCart className="max-sm:scale-90" />
      </button>
      {isAuthenticated ? (
        <ProfileMenu />
      ) : (
        <Link
          to="/login"
          className="shrink-0 rounded-full bg-[#B05B3B] px-5 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1A1A1A] sm:ml-2 sm:px-6 sm:text-[15px]"
        >
          Sign in
        </Link>
      )}
    </div>
  );
}

const Header = () => {
  return (
    <header className="w-full bg-[#FDF9F5]">
      <div className="mx-auto grid w-full max-w-[1600px] grid-cols-[minmax(0,1fr)_auto] grid-rows-[auto_auto] items-center gap-x-3 gap-y-3 px-4 py-3 sm:px-6 lg:px-10 md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] md:grid-rows-1 md:gap-x-6">
        <div className="col-start-1 row-start-1 flex min-w-0 justify-self-start">
          <Brand />
        </div>

        <div className="col-start-2 row-start-1 flex justify-self-end md:col-start-3">
          <Actions />
        </div>

        <nav
          className="col-span-2 row-start-2 flex min-w-0 items-center justify-start gap-3 overflow-x-auto overscroll-x-contain pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] sm:justify-center sm:gap-5 md:col-span-1 md:col-start-2 md:row-start-1 md:w-auto md:justify-center md:gap-6 md:overflow-visible md:pb-0 [&::-webkit-scrollbar]:hidden"
          aria-label="Primary"
        >
          <NavLink to="/" end className={navClass}>
            Home
          </NavLink>
          <NavLink to="/marketplace" className={navClass}>
            Marketplace
          </NavLink>
          <NavLink to="/artisans" className={navClass}>
            Artisans
          </NavLink>
          <NavLink to="/my-order" className={navClass}>
            My Order
          </NavLink>
        </nav>
      </div>
    </header>
  );
};

export default Header;
