import { useState } from "react";
import Link from "next/link";
import { Sling as Hamburger } from "hamburger-react";

export default function Header({ title }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 w-full bg-gradient-to-br from-[#d089f4] to-[#764bb7] text-white p-3 z-50 shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-4 md:px-6">
        {/* Logo */}
        <h1 className="text-3xl font-[800] font-proxima-condensed">
          <Link href="/">
            <span className="cursor-pointer">{title}</span>
          </Link>
        </h1>

        {/* Hamburger Menu (Mobile) */}
        <div className="md:hidden">
          <Hamburger toggled={menuOpen} toggle={setMenuOpen} color="white" size={24} />
        </div>

        {/* Navigation */}
        {/* <nav
          className={`absolute top-14 left-0 w-full bg-gray-900 md:relative md:bg-transparent md:flex md:items-center md:space-x-6 md:top-auto md:left-auto p-4 md:p-0 transition-all duration-300 ${
            menuOpen ? "block" : "hidden md:flex"
          }`}
        >
          <ul className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-6">
            <li>
              <Link href="/">
                <span className="block py-2 px-4 text-sm md:text-base hover:text-gray-400 cursor-pointer">
                  Home
                </span>
              </Link>
            </li>
            <li>
              <Link href="/about">
                <span className="block py-2 px-4 text-sm md:text-base hover:text-gray-400 cursor-pointer">
                  About
                </span>
              </Link>
            </li>
            <li>
              <Link href="/contact">
                <span className="block py-2 px-4 text-sm md:text-base hover:text-gray-400 cursor-pointer">
                  Contact
                </span>
              </Link>
            </li>
          </ul>
        </nav> */}
      </div>
    </header>
  );
}