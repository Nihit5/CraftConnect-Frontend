import type { ReactNode } from "react";
import { Link } from "react-router-dom";

/** Same as header — set your logo path (e.g. `/logo.png` in `public/`). */
const LOGO_URL = "/logo.png";

const linkClass =
  "text-[17px] text-[#4f4842] transition-colors hover:text-[#2f2a25] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7a6d60] rounded-sm";

const headingClass =
  "mb-3 text-[18px] font-semibold tracking-wide text-[#4a433d] uppercase";

function FooterLink({ to, children }: { to: string; children: ReactNode }) {
  return (
    <Link to={to} className={linkClass}>
      {children}
    </Link>
  );
}

const Footer = () => {
  return (
    <footer className="mt-auto w-full bg-[#fcfaf7]">
      <div className="mx-auto w-full max-w-[1400px] px-6 py-10 sm:px-10 lg:px-16 lg:py-12">
        <div className="grid grid-cols-1 gap-y-10 md:grid-cols-[1.3fr_1fr_1fr_1fr] md:gap-x-10">
          <div className="flex flex-col items-start">
            <Link
              to="/"
              className="flex items-center gap-2 rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7a6d60]"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#c05638] sm:h-11 sm:w-11">
                <img
                  src={LOGO_URL}
                  alt="CraftConnect"
                  className="h-full w-full object-contain"
                />
              </div>
              <span className="font-serif text-[34px] font-bold tracking-tight text-[#2f2a25]">
                CraftConnect
              </span>
            </Link>
            <p className="mt-4 max-w-[320px] text-[18px] leading-7 text-[#5a524b]">
              Connecting craftsmanship with community. Made with care in
              Kathmandu.
            </p>
          </div>

          <nav
            className="contents"
            aria-label="Footer"
          >
            <ul className="flex flex-col gap-2">
              <li className={headingClass}>Discover</li>
              <li>
                <FooterLink to="/marketplace">Marketplace</FooterLink>
              </li>
              <li>
                <FooterLink to="/artisans">Artisans</FooterLink>
              </li>
              <li>
                <FooterLink to="/categories">Categories</FooterLink>
              </li>
            </ul>
            <ul className="flex flex-col gap-2">
              <li className={headingClass}>Account</li>
              <li>
                <FooterLink to="/dashboard">Dashboard</FooterLink>
              </li>
              <li>
                <FooterLink to="/orders">Orders</FooterLink>
              </li>
              <li>
                <FooterLink to="/profile">Profile</FooterLink>
              </li>
            </ul>
            <ul className="flex flex-col gap-2">
              <li className={headingClass}>Company</li>
              <li>
                <FooterLink to="/about">About</FooterLink>
              </li>
              <li>
                <FooterLink to="/contact">Contact</FooterLink>
              </li>
              <li>
                <FooterLink to="/press">Press</FooterLink>
              </li>
            </ul>
          </nav>
        </div>

        <div className="mt-10 border-t border-[#dcd4cb] pt-5 text-center text-[16px] text-[#6b625a]">
          <p>© {new Date().getFullYear()} CraftConnect. Handmade with love.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
