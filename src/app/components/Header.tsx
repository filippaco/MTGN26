"use client";
import React, { useState, useEffect, useRef } from "react";
import LogoutButton from "./LogoutBtn";
import Link from "next/link";
import Image from "next/image";
import useAuth from "./useAuth";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  {
    label: "Profil",
    type:"dropdown",
    items: [{ href: "/profil", label: "Min profil", target: "_self" }],
    includeLogout: true,
  },

  {
    label: "Media",
    type: "dropdown",
    items: [
      { href: "/blandaren", label: "Bländaren", target: "_self" },
      { href: "/bilder", label: "Bilder", target: "_self" }
    ],
  },
  
  {
    label: "Grupper",
    type: "dropdown",
    items: [
      { href: "/phosare", label: "Phösare", target: "_self" },
      { href: "/n0llegrupper", label: "nØllegrupper", target: "_self" },
      { href: "/namnquiz", label: "Namn-quiz", target: "_self" }
    ],
  },

  //Ifall vi lägger till Leaderboards kan det vara sin egen kategori
  /*
  {
    label: "Spel",
    type: "dropdown",
    items: [
      { href: "/namnquiz", label: "Namn-quiz", target: "_self" }
    ],
  },
*/

  {
    label: "Resurser",
    type: "dropdown",
    items: [
      { href: "/valkommen", label: "Välkommen", target: "_self" },
      { href: "https://forms.gle/yWqqumMhmq96T6Sm7", label: "På-Hjärtat-Lådan", target: "_blank" },
    ],
  },
];

export default function Header() {
  const { user } = useAuth();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const headerRef = useRef<HTMLElement>(null);

  const isValkommenPage = pathname === "/valkommen";

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMenuOpen(false);
        setOpenGroup(null);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        setOpenGroup(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
    setOpenGroup(null);
  };

  const toggleGroup = (label: string) => {
    setOpenGroup((prev) => (prev === label ? null : label));
  };

  return (
    <header className="flex justify-between items-center p-4 bg-[#70258F] drop-shadow-homeShadow text-amber-50 fixed top-0 left-0 w-full z-50">
      <Link
        href="/home"
        className="flex items-center text-2xl font-bold"
        onClick={closeMenu}
      >
        <Image
          src="/logo.png"
          alt="MTGN"
          width={32}
          height={32}
          className="mr-2 ml-4"
        />
        MTGN26
      </Link>

      {isValkommenPage && (
        <Link
        href="/"
        className="text-amber-100 hover:text-amber-50 font-medium transition ease-in-out mr-4">
          Logga in →
        </Link>
      )}

      {user && !isValkommenPage && (
        <>
          {/* Mobile hamburger */}
          <button className="md:hidden" onClick={() => setIsMenuOpen((v) => !v)}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>

          {/* Mobile menu */}
          <div className="absolute top-full right-0 w-full bg-darker-purple shadow-md z-10 md:hidden">
            <div className={`transition-all duration-200 overflow-hidden w-full ${isMenuOpen ? "max-h-[40rem]" : "max-h-0"}`}>
              <div className="flex flex-col p-4 gap-4">
                {NAV_ITEMS.map((item) => (
                    <div key={item.label} className="border-b border-amber-100/10 pb-4">
                      <div className="text-sm uppercase tracking-[0.2em] mb-2 text-amber-200">
                        {item.label}
                      </div>
                      <div className="flex flex-col gap-2">
                        {item.items.map((link) => (
                          <Link
                            key={link.href}
                            href={link.href}
                            target={link.target}
                            className="block text-center hover:text-amber-100 font-medium"
                            onClick={closeMenu}
                          >
                            {link.label}
                          </Link>
                        ))}
                        {"includeLogout" in item && item.includeLogout && (
                          <LogoutButton onClose={closeMenu} className="block text-center hover:text-amber-100 font-medium" />
                        )}
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            {NAV_ITEMS.map((item) => (
                <div key={item.label} className="relative">
                  <button
                    type="button"
                    onClick={() => toggleGroup(item.label)}
                    className="flex items-center gap-2 text-amber-100 hover:text-amber-50 font-medium transition ease-in-out"
                  >
                    <span>{item.label}</span>
                    <span className="text-xs">▾</span>
                  </button>
                  <div
                    className={`absolute right-0 mt-2 w-48 rounded-xl bg-darker-purple border border-amber-100/10 shadow-lg py-2 transition-all duration-200 ${
                      openGroup === item.label ? "opacity-100 visible" : "opacity-0 invisible"
                    }`}
                  >
                    <div className="flex flex-col gap-1 px-3">
                      {item.items.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          target={link.target}
                          className="block px-2 py-2 text-sm hover:text-amber-100 hover:bg-amber-950/10 rounded"
                          onClick={() => setOpenGroup(null)}
                        >
                          {link.label}
                        </Link>
                      ))}
                      {"includeLogout" in item && item.includeLogout && (
                        <LogoutButton onClose={() => setOpenGroup(null)} />
                      )}
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        </>
      )}
    </header>
  );
}