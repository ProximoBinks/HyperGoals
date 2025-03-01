import { useState } from "react";
import Link from "next/link";
// import { Sling as Hamburger } from "hamburger-react";
import DarkModeToggle from './DarkModeToggle';

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
          <DarkModeToggle onToggle={(isDark) => console.log('Dark mode:', isDark)} />
        </div>
      </div>
    </header>
  );
}