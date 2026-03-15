// app/page.tsx (updated with ingredients section)
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Testimonial {
  id: number;
  client_name: string;
  review: string;
  klinface_response?: string;
  votes_up: number;
  votes_down: number;
}

interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  image: string;
}

export default function HomePage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const response = await fetch('/api/testimonials?limit=15&status=approved');
      const data = await response.json();
      setTestimonials(data);
    } catch (error) {
      console.error('Error fetching testimonials:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOrderClick = (product?: Product) => {
    const productId = product?.id || 1;
    const productName = product?.name || 'KlinFace Herbal Jar';
    const price = product?.price || 1500;
    router.push(`/order?product_id=${productId}&name=${encodeURIComponent(productName)}&price=${price}`);
  };

  const features = [
    {
      icon: '🌿',
      title: '100% Natural Ingredients',
      description: 'Crafted with herbal ingredients like garlic, aloe vera, and sandalwood for safe, effective results.',
    },
    {
      icon: '✅',
      title: 'Proven Results',
      description: 'Thousands of satisfied customers trust KlinFace for flawless, healthy skin.',
    },
    {
      icon: '📦',
      title: 'Easy to Use',
      description: 'Designed for simple, at-home application with step-by-step instructions.',
    },
  ];

  const products: Product[] = [
    {
      id: 1,
      name: 'KlinFace Herbal Jar',
      price: 1500,
      description: 'Perfect for removing black spots, moles, warts, and skin tags naturally.',
      image: '/images/klinface-jar.jpg',
    },
  ];

  // Ingredients data
  const ingredients = [
    {
      name: 'Garlic',
      description: 'Garlic’s enzymes dissolve warts and skin tags, while its natural acids break down moles and black spots for a clear skin surface.',
      image: '/images/garlic.jpg', // Placeholder – replace with actual image
    },
    {
      name: 'Manjistha',
      description: 'This blood-purifying herb helps to fade stubborn black spots and supports the natural shedding of warts and skin tags.',
      image: '/images/manjistha.jpg',
    },
    {
      name: 'Sandalwood',
      description: 'Sandalwood’s active compounds soothe the skin and help repair damage caused by warts, moles, and skin tags.',
      image: '/images/sandalwood.jpg',
    },
    {
      name: 'Indian Lilac',
      description: 'Also known as neem, it destroys wart-causing viruses and reduces skin tags with its antifungal and antibacterial properties.',
      image: '/images/indian-lilac.jpg',
    },
    {
      name: 'Aloe Vera',
      description: 'Aloe Vera provides deep hydration while targeting black spots and aiding in the quick removal of warts and skin tags.',
      image: '/images/aloe-vera.jpg',
    },
  ];

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-purple-50 to-blue-50 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
                KlinFace Herbal Skin{' '}
                <span className="block text-purple-600">Solution</span>
              </h1>
              <p className="text-xl text-gray-700 mb-8 max-w-2xl">
                Say goodbye to black spots, moles, warts, and skin tags with our 100% natural herbal formula.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <button
                  onClick={() => handleOrderClick()}
                  className="px-8 py-4 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors shadow-lg"
                >
                  Order Now - KES 1,500
                </button>
                <Link
                  href="/testimonials"
                  className="px-8 py-4 bg-white text-purple-600 font-semibold rounded-lg hover:bg-gray-50 transition-colors shadow-lg border border-purple-200"
                >
                  View Testimonials
                </Link>
              </div>
            </div>
            <div className="flex-1">
              <div className="relative">
                <Image
                  src="/images/klinface-product.jpg"
                  alt="KlinFace Herbal Solution"
                  width={500}
                  height={500}
                  className="rounded-2xl shadow-2xl"
                  priority
                />
                <div className="absolute -bottom-4 -right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg">
                  <span className="font-bold">Delivery Inclusive!</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose KlinFace?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Trusted by thousands across Kenya for effective, natural skin solutions
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-purple-50 to-blue-50 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ingredients Section – New */}
      <section className="py-16 md:py-24 bg-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Powerful Natural Ingredients
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              KlinFace is formulated with a blend of potent natural ingredients that effectively remove warts, skin tags, moles, and black spots within just 3 days of application.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {ingredients.map((ingredient, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="flex justify-center mb-4">
                  <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-purple-100">
                    <Image
                      src={ingredient.image}
                      alt={ingredient.name}
                      width={96}
                      height={96}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 text-center mb-3">
                  {ingredient.name}
                </h3>
                <p className="text-gray-600 text-center">
                  {ingredient.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-gray-50 to-purple-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Featured Product
            </h2>
            <p className="text-xl text-gray-600">
              One solution for all your skin concerns
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                <div className="relative h-64 bg-gray-100">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {product.name}
                  </h3>
                  <p className="text-gray-600 mb-4">{product.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-purple-600">
                      KES {product.price.toLocaleString()}
                    </span>
                    <button
                      onClick={() => handleOrderClick(product)}
                      className="px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      Buy Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Our Clients Say
            </h2>
            <p className="text-xl text-gray-600">
              Real results from real customers across Kenya
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading testimonials...</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {testimonials.map((testimonial) => (
                <div
                  key={testimonial.id}
                  className="bg-gradient-to-br from-purple-50 to-blue-50 p-6 rounded-2xl shadow-lg"
                >
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {testimonial.client_name.charAt(0)}
                    </div>
                    <div className="ml-4">
                      <h4 className="font-bold text-gray-900">
                        {testimonial.client_name}
                      </h4>
                      <div className="flex text-yellow-400">
                        {'★'.repeat(5)}
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-700 mb-4 italic">
                    &quot;{testimonial.review}&quot;
                  </p>
                  {testimonial.klinface_response && (
                    <div className="bg-white p-4 rounded-lg border-l-4 border-purple-600">
                      <p className="text-sm text-gray-600">
                        <strong>KlinFace Response:</strong> {testimonial.klinface_response}
                      </p>
                    </div>
                  )}
                  {/* Vote buttons without counts */}
                  <div className="mt-4 flex items-center gap-2">
                    <button 
                      className="p-2 hover:bg-purple-100 rounded-full transition-colors"
                      aria-label="Helpful"
                    >
                      <span className="text-green-600 text-lg">👍</span>
                    </button>
                    <button 
                      className="p-2 hover:bg-purple-100 rounded-full transition-colors"
                      aria-label="Not helpful"
                    >
                      <span className="text-red-600 text-lg">👎</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link
              href="/testimonials"
              className="inline-block px-8 py-4 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors"
            >
              View All Testimonials
            </Link>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section id="cta" className="py-16 md:py-24 bg-gradient-to-r from-purple-600 to-blue-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Your Skin Transformation Starts Here
          </h2>
          <p className="text-xl text-white mb-8 max-w-2xl mx-auto">
            Join thousands of happy customers and achieve flawless skin with KlinFace. Don&apos;t wait!
          </p>
          <button
            onClick={() => handleOrderClick()}
            className="px-10 py-5 bg-white text-purple-600 font-bold text-lg rounded-lg hover:bg-gray-100 transition-colors shadow-lg"
          >
            Shop Now - KES 1,500 (Delivery Inclusive)
          </button>
          <p className="text-white mt-6 text-sm">
            🚚 Free delivery nationwide | 💯 Money-back guarantee
          </p>
        </div>
      </section>
    </main>
  );
}