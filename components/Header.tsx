// components/Header.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Replace with your actual auth logic (e.g., using next-auth)
  const isLoggedIn = false; // placeholder

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="klinface-header bg-[#000080] text-white">
      <div className="header-container max-w-7xl mx-auto px-5 py-4 flex justify-between items-center relative">
        {/* Logo */}
        <div className="logo-section">
          <Link href="/">
            <div className="relative w-32 h-12">
              <Image
                src="/images/klinface-logo.png" // replace with your logo path
                alt="KlinFace Logo"
                fill
                className="object-contain bg-white p-1 rounded"
              />
            </div>
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className={`mobile-menu-toggle md:hidden flex flex-col justify-center items-center w-8 h-8 ${mobileMenuOpen ? 'active' : ''}`}
          onClick={toggleMobileMenu}
          aria-label="Toggle navigation menu"
        >
          <span className={`hamburger-line block w-6 h-0.5 bg-white transition-all duration-300 ${mobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
          <span className={`hamburger-line block w-6 h-0.5 bg-white my-1 transition-all duration-300 ${mobileMenuOpen ? 'opacity-0' : ''}`}></span>
          <span className={`hamburger-line block w-6 h-0.5 bg-white transition-all duration-300 ${mobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
        </button>

        {/* Navigation */}
        <nav
          className={`header-nav md:block ${
            mobileMenuOpen ? 'fixed top-0 right-0 w-64 h-full bg-[#000080] p-5 pt-20 z-50 shadow-lg' : 'hidden'
          } md:static md:w-auto md:h-auto md:bg-transparent md:p-0 md:shadow-none`}
        >
          <ul className="nav-menu md:flex md:space-x-6">
            <li><Link href="/faq" className="block py-2 px-4 hover:text-[#00c0ff] md:p-0">FAQ</Link></li>
            <li><Link href="/testimonials" className="block py-2 px-4 hover:text-[#00c0ff] md:p-0">Testimonials</Link></li>
            <li><Link href="/order" className="block py-2 px-4 hover:text-[#00c0ff] md:p-0">Order</Link></li>
            <li><Link href="/instructions" className="block py-2 px-4 hover:text-[#00c0ff] md:p-0">Instructions</Link></li>
            <li><Link href="/order-status" className="block py-2 px-4 hover:text-[#00c0ff] md:p-0">Order Status</Link></li>
            <li><Link href="/guarantee" className="block py-2 px-4 hover:text-[#00c0ff] md:p-0">Guarantee</Link></li>
          </ul>
        </nav>

        {/* Auth Section */}
        <div className="auth-section hidden md:block">
          {isLoggedIn ? (
            <a href="/api/auth/signout" className="auth-link border-2 border-white rounded px-4 py-2 hover:bg-[#00c0ff] hover:text-[#000080] transition">
              Sign Out
            </a>
          ) : (
            <Link href="/login" className="auth-link border-2 border-white rounded px-4 py-2 hover:bg-[#00c0ff] hover:text-[#000080] transition">
              Sign In
            </Link>
          )}
        </div>
      </div>

      {/* Overlay when mobile menu is open */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </header>
  );
}