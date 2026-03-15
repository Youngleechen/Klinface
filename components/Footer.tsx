// components/Footer.tsx
'use client';

import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="klinface-footer bg-[#000080] text-white py-10 px-5">
      <div className="footer-container max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
        {/* About Section */}
        <div className="footer-section about-section">
          <h3 className="text-2xl font-bold mb-3">KlinFace Herbal Skin Solution</h3>
          <p className="text-gray-200 leading-relaxed">
            Say goodbye to black spots, moles, warts, and skin tags with KlinFace’s 100% natural herbal formula.
            Trusted by thousands for safe and effective skincare.
          </p>
        </div>

        {/* Quick Links */}
        <div className="footer-section links-section">
          <h4 className="text-xl font-bold mb-3">Quick Links</h4>
          <ul className="space-y-2">
            <li><Link href="/faq" className="hover:text-[#00c0ff] transition">FAQ</Link></li>
            <li><Link href="/testimonials" className="hover:text-[#00c0ff] transition">Testimonials</Link></li>
            <li><Link href="/order" className="hover:text-[#00c0ff] transition">Order</Link></li>
            <li><Link href="/instructions" className="hover:text-[#00c0ff] transition">Instructions</Link></li>
            <li><Link href="/order-status" className="hover:text-[#00c0ff] transition">Order Status</Link></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="footer-section contact-section">
          <h4 className="text-xl font-bold mb-3">Contact Us</h4>
          <p className="mb-2">
            <strong>Phone:</strong> <a href="tel:+254114398050" className="hover:text-[#00c0ff]">+254 114 398 050</a>
          </p>
          <p>
            <strong>Address:</strong> TF Mall, Moi Avenue, Second Floor 2D
          </p>
        </div>
      </div>

      {/* Copyright */}
      <div className="footer-bottom text-center mt-8 pt-5 border-t border-white border-opacity-30 text-sm text-gray-300">
        <p>&copy; {currentYear} KlinFace Herbal Skin Solution. All rights reserved.</p>
      </div>
    </footer>
  );
}