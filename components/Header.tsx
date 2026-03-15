// components/Header.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth'; // Import your custom auth hook

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, loading, signOut } = useAuth(); // Get auth state
  const router = useRouter();
  
  const isLoggedIn = !!user;

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      setMobileMenuOpen(false); // Close mobile menu if open
      router.push('/'); // Redirect to home after sign out
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Extract first name for display
  const displayName = user?.user_metadata?.full_name 
    ? user.user_metadata.full_name.split(' ')[0] 
    : user?.email?.split('@')[0] 
    || 'Account';

  return (
    <header className="klinface-header bg-[#000080] text-white">
      <div className="header-container max-w-7xl mx-auto px-5 py-4 flex justify-between items-center relative">
        {/* Logo */}
        <div className="logo-section">
          <Link href="/">
            <div className="relative w-32 h-12">
              <Image
                src="/images/klinface-logo.png" // Ensure this path exists in your public folder
                alt="KlinFace Logo"
                fill
                className="object-contain bg-white p-1 rounded"
              />
            </div>
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className={`mobile-menu-toggle md:hidden flex flex-col justify-center items-center w-8 h-8 z-50 ${mobileMenuOpen ? 'active' : ''}`}
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
            mobileMenuOpen ? 'fixed top-0 right-0 w-64 h-full bg-[#000080] p-5 pt-20 z-40 shadow-lg' : 'hidden'
          } md:static md:w-auto md:h-auto md:bg-transparent md:p-0 md:shadow-none`}
        >
          <ul className="nav-menu md:flex md:space-x-6">
            <li><Link href="/faq" className="block py-2 px-4 hover:text-[#00c0ff] md:p-0" onClick={() => setMobileMenuOpen(false)}>FAQ</Link></li>
            <li><Link href="/testimonials" className="block py-2 px-4 hover:text-[#00c0ff] md:p-0" onClick={() => setMobileMenuOpen(false)}>Testimonials</Link></li>
            <li><Link href="/order" className="block py-2 px-4 hover:text-[#00c0ff] md:p-0" onClick={() => setMobileMenuOpen(false)}>Order</Link></li>
            <li><Link href="/instructions" className="block py-2 px-4 hover:text-[#00c0ff] md:p-0" onClick={() => setMobileMenuOpen(false)}>Instructions</Link></li>
            <li><Link href="/order-status" className="block py-2 px-4 hover:text-[#00c0ff] md:p-0" onClick={() => setMobileMenuOpen(false)}>Order Status</Link></li>
            <li><Link href="/guarantee" className="block py-2 px-4 hover:text-[#00c0ff] md:p-0" onClick={() => setMobileMenuOpen(false)}>Guarantee</Link></li>
            
            {/* Mobile Auth Links (Visible only in mobile menu) */}
            <li className="md:hidden border-t border-blue-800 mt-4 pt-4">
              {loading ? (
                <span className="block py-2 text-gray-400">Loading...</span>
              ) : isLoggedIn ? (
                <>
                  <div className="mb-3 text-sm text-blue-200">Signed in as <strong>{displayName}</strong></div>
                  <button 
                    onClick={handleSignOut}
                    className="block w-full text-left py-2 px-4 text-red-300 hover:text-white hover:bg-blue-900 rounded"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <Link 
                  href="/auth" 
                  className="block py-2 px-4 text-[#00c0ff] hover:text-white hover:bg-blue-900 rounded"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign In
                </Link>
              )}
            </li>
          </ul>
        </nav>

        {/* Desktop Auth Section */}
        <div className="auth-section hidden md:block">
          {loading ? (
            <div className="w-20 h-10 bg-blue-900/50 rounded animate-pulse"></div>
          ) : isLoggedIn ? (
            <div className="flex items-center gap-4">
              <span className="text-sm text-blue-100 hidden lg:inline">Hi, {displayName}</span>
              <button 
                onClick={handleSignOut}
                className="auth-link border-2 border-white/30 rounded px-4 py-2 hover:bg-[#00c0ff] hover:text-[#000080] hover:border-[#00c0ff] transition font-medium text-sm"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <Link 
              href="/auth" 
              className="auth-link border-2 border-white rounded px-4 py-2 hover:bg-[#00c0ff] hover:text-[#000080] transition font-medium text-sm"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>

      {/* Overlay when mobile menu is open */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </header>
  );
}