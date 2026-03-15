// app/order/OrderForm.tsx
'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

interface OrderFormProps {
  user: any;
  initialData: {
    name: string | null;
    phone: string | null;
    location: string | null;
    bus_company: string | null;
  } | null;
}

export default function OrderForm({ user, initialData }: OrderFormProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    phone: initialData?.phone || '',
    location: initialData?.location || '',
    busCompany: initialData?.bus_company || '',
  });
  const [mpesaMessage, setMpesaMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const needPayment = searchParams.get('need_payment') === 'true';
  const supabase = createClient();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    // 1. Update profile with user details
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        name: formData.name,
        phone: formData.phone,
        location: formData.location,
        bus_company: formData.busCompany,
      })
      .eq('id', user.id);

    if (updateError) {
      setMessage('Error saving your details. Please try again.');
      setLoading(false);
      return;
    }

    // 2. Simulate payment verification – in production you would validate the M‑PESA message
    if (!mpesaMessage.trim()) {
      setMessage('Please paste your M‑PESA confirmation message.');
      setLoading(false);
      return;
    }

    // For demo, we simply check that the message contains the expected account number
    if (!mpesaMessage.includes('0100444592000') || !mpesaMessage.includes('1,500')) {
      setMessage('Invalid M‑PESA message. Please check the account number and amount.');
      setLoading(false);
      return;
    }

    // 3. Mark order as paid and save the M‑PESA message
    const { error: paidError } = await supabase
      .from('profiles')
      .update({
        order_status: 'paid',
        mpesa_message: mpesaMessage,
        order_time: new Date().toISOString(),
      })
      .eq('id', user.id);

    if (paidError) {
      setMessage('Payment confirmation failed. Please contact support.');
      setLoading(false);
      return;
    }

    // 4. Redirect to order status page
    router.push('/order-status');
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {needPayment && (
          <div className="mb-6 p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700">
            You need to complete payment before you can access the instructions.
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          {/* Left column: Delivery form */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Details</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                />
              </div>

              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                  Location *
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  required
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g., Nairobi, Mombasa"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                />
              </div>

              <div>
                <label htmlFor="busCompany" className="block text-sm font-medium text-gray-700">
                  Preferred Bus Company
                </label>
                <input
                  type="text"
                  id="busCompany"
                  name="busCompany"
                  value={formData.busCompany}
                  onChange={handleChange}
                  placeholder="e.g., Guardian, ENA Coach"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50"
              >
                {loading ? 'Processing...' : 'Complete Order'}
              </button>

              {message && (
                <div className={`mt-4 p-3 rounded-md ${message.includes('Invalid') ? 'bg-red-50 text-red-800' : 'bg-green-50 text-green-800'}`}>
                  {message}
                </div>
              )}
            </form>
          </div>

          {/* Right column: Payment instructions */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Payment Instructions</h2>
            <div className="space-y-4">
              <p className="text-gray-700">
                <strong>Price:</strong> KES 1,500 (delivery inclusive)
              </p>
              <p className="text-gray-700">
                <strong>Paybill Number:</strong> 329329
              </p>
              <p className="text-gray-700">
                <strong>Account Number:</strong> 0100444592000
              </p>

              <ol className="list-decimal list-inside space-y-2 text-gray-700">
                <li>Go to your M‑PESA menu.</li>
                <li>Select <strong>Lipa na M‑PESA</strong>.</li>
                <li>Choose <strong>Paybill</strong>.</li>
                <li>Enter Paybill <strong>329329</strong>.</li>
                <li>Enter Account <strong>0100444592000</strong>.</li>
                <li>Enter Amount <strong>1500</strong>.</li>
                <li>Enter your PIN and confirm.</li>
              </ol>

              <p className="text-gray-700 font-medium mt-4">
                Once you have completed the payment, paste your M‑PESA confirmation message below.
              </p>

              <textarea
                rows={4}
                value={mpesaMessage}
                onChange={(e) => setMpesaMessage(e.target.value)}
                placeholder="Paste your M‑PESA confirmation message here..."
                className="mt-2 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}