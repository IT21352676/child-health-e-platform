import React, { useState } from "react";
import BurgerMenu from "./burgermenu";
import Emblem from "../assets/Emblem.jpg"

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <header className="fixed z-50 flex items-center justify-between w-full px-4 py-3 bg-white shadow-md">
        <div className="flex items-center space-x-3">
          <img
            src={Emblem}
            alt="Logo"
            className="h-12"
          />
          <div >
            <h1 className="font-bold text-[9px] leading-tight ">
              දරුවගේ සෞඛ්‍ය වර්ධන සටහන
            </h1>
            <p className="text-[8px] text-gray-500">
              குழந்தை சுகாதார மேம்பாட்டு பதிவு
            </p>
            <p className="text-[9px] text-gray-500">
              CHILD HEALTH DEVELOPMENT RECORD
            </p>
          </div>
        </div>

        {/* Burger Button */}
        <button onClick={() => setMenuOpen(true)} className="text-2xl">
          ☰
        </button>
      </header>

      {/* Right-side Drawer */}
      <BurgerMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
