import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logoImage from "../../assets/Logo.png";
import { useAuth } from "../../context/AuthContext";
import { notify } from "../../utils/toast";

const iconBtn =
  "flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[#4A4A4A] transition-opacity hover:opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B05B3B] sm:h-10 sm:w-10";

function getInitials(name) {
  if (!name?.trim()) return "AD";
  const words = name.trim().split(/\s+/);
  if (words.length >= 2) {
    return `${words[0][0]}${words[1][0]}`.toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

function ProfileMenu() {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  const displayName =
    [user?.firstName, user?.lastName].filter(Boolean).join(" ") ||
    user?.email ||
    "Admin";
  const initials = getInitials(displayName);

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
        className="flex items-center gap-2 rounded-full py-1 pl-1 pr-3 transition-colors hover:bg-[#F2EBE4] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B05B3B] sm:pr-3.5"
        aria-label="Profile"
        aria-expanded={isOpen}
        aria-haspopup="menu"
        onClick={() => setIsOpen((open) => !open)}
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F2EBE4] text-xs font-semibold text-[#9E4F2F] sm:h-9 sm:w-9">
          {initials}
        </span>
        <span className="hidden max-w-[140px] truncate text-sm font-medium text-[#1A1A1A] sm:block">
          {displayName}
        </span>
      </button>

      {isOpen && (
        <div
          role="menu"
          className="absolute right-0 top-[calc(100%+8px)] z-50 min-w-[200px] overflow-hidden rounded-xl border border-[#E8DFD6] bg-white py-1 shadow-lg"
        >
          <p className="border-b border-[#F2EBE4] px-4 py-2.5 text-sm font-medium text-[#2E1D17]">
            {displayName}
          </p>
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

const AdminNavbar = ({ onMenuToggle }) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#EDE5DC] bg-[#FDF9F5]">
      <div className="mx-auto grid w-full max-w-[1600px] grid-cols-[1fr_auto_1fr] items-center gap-x-3 px-4 py-3 sm:px-6 lg:px-10">
        <div className="flex min-w-0 items-center gap-2 justify-self-start">
          <button
            type="button"
            className={`${iconBtn} lg:hidden`}
            aria-label="Open sidebar"
            onClick={onMenuToggle}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={22}
              height={22}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              strokeLinecap="round"
              aria-hidden
            >
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          </button>

          <Link
            to="/admin/dashboard"
            className="flex min-w-0 max-w-full items-center gap-2 rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B05B3B]"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full sm:h-11 sm:w-11">
              <img
                src={logoImage}
                alt="CraftConnect"
                className="h-full w-full scale-[1.9] object-cover"
              />
            </div>
            <span className="truncate font-serif text-base font-bold tracking-tight text-[#1A1A1A] sm:text-lg md:text-[22px]">
              CraftConnect
            </span>
          </Link>
        </div>

        <h1 className="max-w-[38vw] truncate justify-self-center text-center font-serif text-base font-semibold italic tracking-wide text-[#9E4F2F] sm:max-w-none sm:text-xl md:text-2xl">
          Admin Portal
        </h1>

        <div className="justify-self-end">
          <ProfileMenu />
        </div>
      </div>
    </header>
  );
};

export default AdminNavbar;
