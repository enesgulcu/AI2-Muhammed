"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { FaSignInAlt, FaUserPlus, FaBars, FaTimes } from "react-icons/fa";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-secondary p-5 px-4 md:px-16">
      <div className="flex container mx-auto justify-between items-center">
        {/* Logo-isim */}
        <div className="flex items-center space-x-2">
          <Link href="/" className="text-primary font-extrabold text-xl">İngilizce Sesli Asistan</Link>
        </div>

        {/* Menü Linkleri */}
        <div className="hidden md:flex space-x-6 text-white text-sm">
          <Link href="/" className="hover:text-primary">Ana Sayfa</Link>
          <Link href="/" className="hover:text-primary">Hakkımızda</Link>
          <Link href="/" className="hover:text-primary">Yardım</Link>
        </div>

        {/* Butonlar */}
        <div className="hidden md:flex space-x-4 text-sm">
          <div className="bg-btnprimary text-white px-4 gap-2 py-2 rounded-full hover:bg-blue-600 flex">
            <span className='flex justify-center items-center'>
              <FaUserPlus />
            </span>
            <Link href="/RegisterPage">
              Kayıt Ol
            </Link>
          </div>

          <div className="bg-btnsecondary text-white px-4 gap-2 py-2 rounded-full hover:bg-green-700 flex">
            <span className='flex justify-center items-center'>
              <FaSignInAlt />
            </span>
            <Link href="/LoginPage">
              Giriş Yap
            </Link>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden text-white text-xl">
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden flex flex-col items-center space-y-4 mt-4 text-white text-sm">
          <Link href="/" className="hover:text-primary">Ana Sayfa</Link>
          <Link href="/" className="hover:text-primary">Hakkımızda</Link>
          <Link href="/" className="hover:text-primary">Yardım</Link>
          <div className="bg-btnprimary text-white px-4 gap-2 py-2 rounded-full hover:bg-blue-600 flex">
            <span className='flex justify-center items-center'>
              <FaUserPlus />
            </span>
            <Link href="/RegisterPage">
              Kayıt Ol
            </Link>
          </div>
          <div className="bg-btnsecondary text-white px-4 gap-2 py-2 rounded-full hover:bg-green-700 flex">
            <span className='flex justify-center items-center'>
              <FaSignInAlt />
            </span>
            <Link href="/LoginPage">
              Giriş Yap
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
