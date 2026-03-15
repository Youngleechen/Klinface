// app/order/OrderForm.tsx
'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

interface OrderFormProps {
  user: any;
  initialData?: {
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

    // 1. Update profile with basic user details (optional, for reuse)
    const { error: profileError } = await supabase
      .from('profiles')
      .update({
        name: formData.name,
        phone: formData.phone,
        location: formData.location,
      })
      .eq('id', user.id);

    if (profileError) {
      console.warn('Profile update warning:', profileError);
      // Continue anyway - order is more important
    }

    // 2. Validate M-PESA message
    if (!mpesaMessage.trim()) {
      setMessage('Please paste your M‑PESA confirmation message.');
      setLoading(false);
      return;
    }

    if (!mpesaMessage.includes('0100444592000') || !mpesaMessage.includes('1,500')) {
      setMessage('Invalid M‑PESA message. Please check the account number and amount.');
      setLoading(false);
      return;
    }

    // 3. INSERT new order record
    const { error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: user.id,
        name: formData.name,
        phone: formData.phone,
        location: formData.location,
        bus_company: formData.busCompany,
        order_status: 'paid',
        mpesa_message: mpesaMessage,
        order_time: new Date().toISOString(),
        amount: 1500,
        currency: 'KES',
      });

    if (orderError) {
      setMessage('Order submission failed. Please contact support.');
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
            <form id="details-form" className="space-y-4">
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
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 text-gray-900"
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
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 text-gray-900"
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
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 text-gray-900 placeholder-gray-400"
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
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 text-gray-900 placeholder-gray-400"
                />
              </div>
              
              <p className="text-xs text-gray-500 italic mt-4">
                * Please fill in your details above, then complete the payment steps on the right.
              </p>
            </form>
          </div>

          {/* Right column: Payment instructions & Submit */}
          <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Payment Instructions</h2>
            <div className="space-y-4 flex-grow">
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

              {/* Fixed Textarea Visibility */}
              <textarea
                rows={5}
                value={mpesaMessage}
                onChange={(e) => setMpesaMessage(e.target.value)}
                placeholder="Paste your M‑PESA confirmation message here..."
                className="mt-2 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 text-gray-900 placeholder-gray-400 bg-white"
              />
            </div>

            {/* Moved Submit Button to Bottom Right */}
            <div className="mt-6">
              <button
                type="submit"
                onClick={handleSubmit}
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  'Complete Order'
                )}
              </button>

              {message && (
                <div className={`mt-4 p-3 rounded-md text-sm ${
                  message.includes('Invalid') || message.includes('failed') 
                    ? 'bg-red-50 text-red-800 border border-red-200' 
                    : 'bg-green-50 text-green-800 border border-green-200'
                }`}>
                  {message}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}