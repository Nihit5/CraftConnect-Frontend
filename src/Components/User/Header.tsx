import { Link, NavLink } from "react-router-dom";

const LOGO_URL = "/logo.png";

const navClass = ({ isActive }: { isActive: boolean }) =>
  [
    "shrink-0 text-sm font-medium transition-opacity hover:opacity-80 sm:text-[15px]",
    isActive
      ? "rounded-full bg-[#F0E6DA] px-3 py-1.5 text-[#2E1D17] sm:px-4 sm:py-2"
      : "rounded-full px-3 py-1.5 text-[#5F574F] sm:px-4 sm:py-2",
  ].join(" ");

const iconBtn =
  "flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[#1A1A1A] transition-opacity hover:opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B56342] sm:h-10 sm:w-10";

function IconSearch(props: React.SVGProps<SVGSVGElement>) {
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

function IconHeart(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.51 4.04 3 5.5l7 7Z" />
    </svg>
  );
}

function IconBag(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M6 7h12l-1 12H7L6 7Z" />
      <path d="M9 7V6a3 3 0 0 1 6 0v1" />
    </svg>
  );
}

function IconUser(props: React.SVGProps<SVGSVGElement>) {
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
      className="flex min-w-0 max-w-full items-center gap-2 rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B56342]"
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#B56342] sm:h-11 sm:w-11">
        <img
          src={LOGO_URL}
          alt="CraftConnect"
          className="h-full w-full object-contain"
        />
      </div>
      <span className="truncate font-serif text-base font-bold tracking-tight text-[#1A1A1A] sm:text-lg md:text-[22px]">
        CraftConnect
      </span>
    </Link>
  );
}

function Actions() {
  return (
    <div className="flex shrink-0 items-center gap-2 sm:gap-3 md:gap-5">
      <div className="hidden items-center gap-0 sm:flex">
        <button type="button" className={iconBtn} aria-label="Search">
          <IconSearch className="max-sm:scale-90" />
        </button>
        <button type="button" className={iconBtn} aria-label="Wishlist">
          <IconHeart className="max-sm:scale-90" />
        </button>
        <button type="button" className={iconBtn} aria-label="Cart">
          <IconBag className="max-sm:scale-90" />
        </button>
        <button type="button" className={iconBtn} aria-label="Profile">
          <IconUser className="max-sm:scale-90" />
        </button>
      </div>
      <button
        type="button"
        className="shrink-0 rounded-full bg-[#B56342] px-4 py-1.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1A1A1A] sm:px-6 sm:py-2 sm:text-[15px] sm:font-medium"
      >
        Log in
      </button>
    </div>
  );
}

const Header = () => {
  return (
    <header className="w-full bg-[#FEF9F1]">
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
          <NavLink to="/dashboard" className={navClass}>
            Dashboard
          </NavLink>
        </nav>
      </div>
    </header>
  );
};

export default Header;
