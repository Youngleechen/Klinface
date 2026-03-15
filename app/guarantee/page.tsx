// app/guarantee/page.tsx
import React from 'react';
import Link from 'next/link';

export default function GuaranteePage() {
  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6 md:p-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center">
          Why You Can Trust Us
        </h1>

        <section className="mb-10">
          <h2 className="text-2xl font-bold text-[#0000aa] mb-4">1. We Deliver What We Promise</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Your trust means everything to us. Here’s why you can be confident when paying before delivery:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li>
              <strong className="text-[#00aa00]">Proven Track Record:</strong> We have delivered successfully to thousands of happy customers. Our reviews and testimonials speak for themselves.
            </li>
            <li>
              <strong className="text-[#00aa00]">Secure Payment Methods:</strong> All transactions are processed securely, ensuring your payment is protected.
            </li>
            <li>
              <strong className="text-[#00aa00]">Transparent Communication:</strong> We keep you informed every step of the way, from order confirmation to delivery.
            </li>
            <li>
              <strong className="text-[#00aa00]">Money-Back Guarantee:</strong> If we fail to deliver as promised, we offer a no-questions-asked refund policy.
            </li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold text-[#0000aa] mb-4">2. Your Guarantee It Will Work</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            We stand by the quality and effectiveness of our product. Here’s why you can trust it will work for you:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li>
              <strong className="text-[#00aa00]">Quality Assurance:</strong> Each product undergoes rigorous testing and quality checks to ensure it meets our high standards.
            </li>
            <li>
              <strong className="text-[#00aa00]">Expert Validation:</strong> Our product is backed by experts in the field, ensuring its effectiveness and reliability.
            </li>
            <li>
              <strong className="text-[#00aa00]">Customer Satisfaction:</strong> Hundreds of testimonials confirm that our product works as promised.
            </li>
            <li>
              <strong className="text-[#00aa00]">Risk-Free Guarantee:</strong> If the product doesn’t work as claimed, we offer a full refund or replacement.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-[#0000aa] mb-4">Still Have Questions?</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            We’re here to help! Contact our support team for any additional concerns or clarifications:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li>
              Email:{' '}
              <a href="mailto:support@klinface.com" className="text-[#00aa00] hover:underline">
                support@klinface.com
              </a>
            </li>
            <li>
              WhatsApp:{' '}
              <a href="https://wa.me/254114398050" className="text-[#00aa00] hover:underline">
                +254114398050
              </a>
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}