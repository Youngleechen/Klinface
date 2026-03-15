// app/faq/page.tsx
import React from 'react';
import Link from 'next/link';

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6 md:p-8">
        <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-8">
          Frequently Asked Questions
        </h1>

        <div className="space-y-8">
          <div className="border-b border-gray-200 pb-6">
            <h3 className="text-xl font-semibold text-[#6a0dad] mb-2">What is KlinFace?</h3>
            <p className="text-gray-700 leading-relaxed">
              KlinFace is a 100% natural herbal skin solution designed to help remove black spots, moles, warts, and skin tags.
              It is formulated with safe and effective herbal ingredients, ensuring gentle care for your skin.
            </p>
          </div>

          <div className="border-b border-gray-200 pb-6">
            <h3 className="text-xl font-semibold text-[#6a0dad] mb-2">How does KlinFace work?</h3>
            <p className="text-gray-700 leading-relaxed">
              KlinFace works by utilizing the healing properties of its natural ingredients, such as garlic, aloe vera, and sandalwood.
              These components help exfoliate the dead skin, reduce pigmentation, and promote natural healing to remove blemishes effectively.
            </p>
          </div>

          <div className="border-b border-gray-200 pb-6">
            <h3 className="text-xl font-semibold text-[#6a0dad] mb-2">Is KlinFace safe to use?</h3>
            <p className="text-gray-700 leading-relaxed">
              Yes, KlinFace is completely safe to use. It is made from 100% natural ingredients and contains no harsh chemicals.
              It is suitable for all skin types, including sensitive skin.
            </p>
          </div>

          <div className="border-b border-gray-200 pb-6">
            <h3 className="text-xl font-semibold text-[#6a0dad] mb-2">How do I apply KlinFace?</h3>
            <p className="text-gray-700 leading-relaxed">
              You can visit{' '}
              <Link href="/instructions" className="text-[#6a0dad] underline hover:text-[#580b9e]">
                here
              </Link>{' '}
              to watch the application video.
            </p>
          </div>

          <div className="border-b border-gray-200 pb-6">
            <h3 className="text-xl font-semibold text-[#6a0dad] mb-2">How long does it take to see results?</h3>
            <p className="text-gray-700 leading-relaxed">
              KlinFace takes only 3 days.
            </p>
          </div>

          <div className="border-b border-gray-200 pb-6">
            <h3 className="text-xl font-semibold text-[#6a0dad] mb-2">Can KlinFace be used on children?</h3>
            <p className="text-gray-700 leading-relaxed">
              KlinFace is safe for children aged 12 and above.
            </p>
          </div>

          <div className="border-b border-gray-200 pb-6">
            <h3 className="text-xl font-semibold text-[#6a0dad] mb-2">Are there any side effects?</h3>
            <p className="text-gray-700 leading-relaxed">
              Since KlinFace is made from natural ingredients, it has no side effects.
            </p>
          </div>

          <div className="border-b border-gray-200 pb-6">
            <h3 className="text-xl font-semibold text-[#6a0dad] mb-2">Where can I purchase KlinFace?</h3>
            <p className="text-gray-700 leading-relaxed">
              KlinFace is available for purchase directly on our website. Click{' '}
              <Link href="/order" className="text-[#6a0dad] underline hover:text-[#580b9e]">
                here
              </Link>{' '}
              to shop now. Delivery is inclusive at a price of Ksh 1500.
            </p>
          </div>

          <div className="border-b border-gray-200 pb-6">
            <h3 className="text-xl font-semibold text-[#6a0dad] mb-2">What if I am not satisfied with the product?</h3>
            <p className="text-gray-700 leading-relaxed">
              We are confident in KlinFace’s effectiveness. If for any reason you are not satisfied, please contact us within 30 days of purchase for assistance.
            </p>
          </div>

          <div className="border-b border-gray-200 pb-6">
            <h3 className="text-xl font-semibold text-[#6a0dad] mb-2">Can I use KlinFace on my face?</h3>
            <p className="text-gray-700 leading-relaxed">
              Absolutely! KlinFace is gentle enough to be used on facial skin. Avoid applying it on open wounds.
            </p>
          </div>

          <div className="border-b border-gray-200 pb-6">
            <h3 className="text-xl font-semibold text-[#6a0dad] mb-2">How do I store KlinFace?</h3>
            <p className="text-gray-700 leading-relaxed">
              Store KlinFace in a cool, dry place away from direct sunlight. Ensure the lid is tightly closed after each use.
            </p>
          </div>

          <div className="border-b border-gray-200 pb-6">
            <h3 className="text-xl font-semibold text-[#6a0dad] mb-2">What payment methods do you accept?</h3>
            <p className="text-gray-700 leading-relaxed">
              We only accept payment to our paybill number on the checkout page.
            </p>
          </div>

          <div className="border-b border-gray-200 pb-6">
            <h3 className="text-xl font-semibold text-[#6a0dad] mb-2">Is KlinFace suitable for all skin types?</h3>
            <p className="text-gray-700 leading-relaxed">
              Yes, KlinFace is designed to be effective for all skin types, including oily, dry, combination, and sensitive skin.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}