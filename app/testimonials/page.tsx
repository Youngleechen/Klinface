// app/testimonials/page.tsx
'use client';

import { useState, useEffect } from 'react';

interface Testimonial {
  id: number;
  client_name: string;
  review: string;
  klinface_response: string | null;
  votes_up: number;
  votes_down: number;
  status: string;
  created_at: string;
}

const ITEMS_PER_PAGE = 6;

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const res = await fetch('/api/testimonials');
        if (!res.ok) throw new Error('Failed to fetch testimonials');
        const data = await res.json();
        setTestimonials(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + ITEMS_PER_PAGE);
  };

  const visibleTestimonials = testimonials.slice(0, visibleCount);
  const hasMore = visibleCount < testimonials.length;

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8 text-red-600">
        <p>Error: {error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-center">Customer Testimonials</h1>
      {testimonials.length === 0 ? (
        <p className="text-center text-gray-500">No testimonials yet.</p>
      ) : (
        <>
          <div className="space-y-6">
            {visibleTestimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="border rounded-lg p-6 shadow-md bg-white hover:shadow-lg transition-shadow"
              >
                <div className="mb-2">
                  <h2 className="text-xl font-semibold text-gray-800">
                    {testimonial.client_name}
                  </h2>
                </div>

                <p className="text-gray-700 mb-4 italic">&ldquo;{testimonial.review}&rdquo;</p>

                {testimonial.klinface_response && (
                  <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-md mb-4">
                    <p className="text-sm font-medium text-blue-800 mb-1">
                      Klinface Response:
                    </p>
                    <p className="text-gray-700">{testimonial.klinface_response}</p>
                  </div>
                )}

                <div className="flex items-center gap-4 text-sm">
                  <button 
                    className="flex items-center gap-1 text-green-600 font-medium hover:text-green-700 transition-colors disabled:opacity-50"
                    aria-label="Upvote"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 9.067a.5.5 0 01-.8.266z" />
                    </svg>
                  </button>
                  <button 
                    className="flex items-center gap-1 text-red-600 font-medium hover:text-red-700 transition-colors disabled:opacity-50"
                    aria-label="Downvote"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M18 9.5a1.5 1.5 0 11-3 0v-6a1.5 1.5 0 013 0v6zM14 9.667v-5.43a2 2 0 00-1.105-1.79l-.05-.025A4 4 0 0011.055 2H5.64a2 2 0 00-1.962 1.608l-1.2 6A2 2 0 004.44 12H8v4a2 2 0 002 2 1 1 0 001-1v-.667a4 4 0 01.8-2.4l1.4-1.866a.5.5 0 01.8-.267z" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          {hasMore && (
            <div className="flex justify-center mt-8">
              <button
                onClick={handleLoadMore}
                className="px-6 py-3 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition-colors shadow-md"
              >
                Load More
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}