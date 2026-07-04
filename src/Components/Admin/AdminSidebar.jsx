import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { notify } from "../../utils/toast";

const navItems = [
  {
    label: "Dashboard",
    to: "/admin/dashboard",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
  {
    label: "User Management",
    to: "/admin/users",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <circle cx="9" cy="7" r="3" />
        <path d="M2 20a7 7 0 0 1 14 0" />
        <circle cx="17" cy="8" r="2.5" />
        <path d="M14 20a5 5 0 0 1 6-4" />
      </svg>
    ),
  },
  {
    label: "Vendor Management",
    to: "/admin/vendors",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z" />
        <path d="M3 9l2.45-4.9A2 2 0 0 1 7.24 3h9.52a2 2 0 0 1 1.8 1.1L21 9" />
        <path d="M12 12v4" />
      </svg>
    ),
  },
  {
    label: "Artist Management",
    to: "/admin/artists",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3Z" />
        <path d="M5 19h14" />
        <path d="M8 19l1-3h6l1 3" />
      </svg>
    ),
  },
  {
    label: "Add Category",
    to: "/admin/category",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M12 5v14M5 12h14" />
        <rect x="3" y="3" width="18" height="18" rx="2" />
      </svg>
    ),
  },
  {
    label: "Trending Product and Artist",
    to: "/admin/trending",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M3 17l6-6 4 4 7-7" />
        <path d="M14 8h6v6" />
      </svg>
    ),
  },
];

function SignOutIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}

function SidebarItem({ item, onClose }) {
  return (
    <NavLink to={item.to} onClick={onClose} className="block">
      {({ isActive }) => (
        <div
          className={[
            "flex items-center gap-2 rounded-lg border px-2.5 py-2 transition-colors",
            isActive
              ? "border-[#B05B3B] bg-[#FDF9F5] text-[#9E4F2F]"
              : "border-[#EDE5DC] bg-white text-[#2E1D17] hover:border-[#DFDCD0]",
          ].join(" ")}
        >
          <span
            className={[
              "flex h-8 w-8 shrink-0 items-center justify-center rounded-md [&_svg]:h-4 [&_svg]:w-4",
              isActive ? "bg-[#F2EBE4] text-[#B05B3B]" : "bg-[#F2F0E6] text-[#6B6560]",
            ].join(" ")}
          >
            {item.icon}
          </span>
          <span className="min-w-0 flex-1 text-[13px] font-medium leading-snug sm:text-sm">
            {item.label}
          </span>
          {isActive && (
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#B05B3B]" aria-hidden />
          )}
        </div>
      )}
    </NavLink>
  );
}

const AdminSidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleSignOut = () => {
    onClose();
    logout();
    notify.info("You have been logged out.");
    navigate("/login", { replace: true });
  };

  return (
    <>
      {isOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          className="fixed inset-0 z-40 bg-black/20 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={[
          "fixed bottom-0 left-0 top-[4.75rem] z-50 flex w-60 flex-col border-r border-[#DFDCD0] bg-[#EAE7D6] lg:static lg:z-auto lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
        ].join(" ")}
      >
        <nav
          className="flex flex-1 flex-col gap-1.5 overflow-y-auto p-3"
          aria-label="Admin"
        >
          {navItems.map((item) => (
            <SidebarItem key={item.to} item={item} onClose={onClose} />
          ))}
        </nav>

        <div className="border-t border-[#DFDCD0] p-3">
          <button
            type="button"
            onClick={handleSignOut}
            className="flex w-full items-center gap-2 rounded-lg border border-[#E8C4A8] bg-white px-2.5 py-2 text-[13px] font-semibold text-[#B05B3B] transition-colors hover:bg-[#FFF8F2] sm:text-sm"
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-[#FFF0E8] text-[#B05B3B] [&_svg]:h-4 [&_svg]:w-4">
              <SignOutIcon />
            </span>
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
