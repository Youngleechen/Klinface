'use client';

import { useState } from 'react';

interface Testimonial {
  id: number;
  client_name: string;
  review: string;
  votes_up: number;
  votes_down: number;
}

interface Props {
  initialData: Testimonial[];
}

export default function TestimonialsSection({ initialData }: Props) {
  const [testimonials] = useState(initialData);

  return (
    <section id="testimonials" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">What Clients Say</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t) => (
            <div key={t.id} className="p-6 bg-purple-50 rounded-xl shadow-sm">
              <h4 className="font-bold text-lg">{t.client_name}</h4>
              <p className="italic text-gray-700 mt-2">&quot;{t.review}&quot;</p>
              <div className="mt-4 text-sm text-gray-500">
                👍 {t.votes_up} | 👎 {t.votes_down}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}