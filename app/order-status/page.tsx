// app/order-status/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface OrderDetails {
  id: string;
  name: string | null;
  phone: string | null;
  location: string | null;
  bus_company: string | null;
  order_status: string | null;
  order_time: string | null;
  mpesa_message: string | null;
  amount: number | null;
  currency: string | null;
}

export default function OrderStatusPage() {
  const { user, loading: authLoading } = useAuth();
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();
  
  // Initialize supabase client
  const supabase = createClient();

  useEffect(() => {
    // 1. Redirect if not authenticated
    if (!authLoading && !user) {
      router.replace('/auth');
      return;
    }

    // 2. Fetch order details from the NEW 'orders' table
    const fetchOrder = async () => {
      if (!user?.id) return;

      try {
        // 👇 CHANGE: We are now selecting from 'orders', NOT 'profiles'
        const { data, error: fetchError } = await supabase
          .from('orders') 
          .select(`
            id,
            name,
            phone,
            location,
            bus_company,
            order_status,
            order_time,
            mpesa_message,
            amount,
            currency
          `)
          .eq('user_id', user.id) // 👇 CHANGE: Filter by user_id column in orders table
          .order('order_time', { ascending: false })
          .limit(1)
          .single();

        // Handle "No rows returned" gracefully (PGRST116)
        if (fetchError && fetchError.code !== 'PGRST116') {
          throw fetchError;
        }

        setOrder(data || null);
      } catch (err: unknown) {
        console.error('Error fetching order:', err);
        setError('Unable to load your order details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchOrder();
    }
  }, [user, authLoading, router, supabase]);

  // --- Loading State ---
  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-100 mb-4">
            <svg className="animate-spin h-8 w-8 text-purple-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          </div>
          <p className="text-gray-600 text-lg">Loading your order...</p>
        </div>
      </div>
    );
  }

  // --- Error State ---
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
            <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Something went wrong</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => router.push('/order')}
            className="px-6 py-2.5 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors"
          >
            Return to Order
          </button>
        </div>
      </div>
    );
  }

  // --- No Order Found State ---
  if (!order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-yellow-100 mb-4">
            <svg className="h-8 w-8 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">No Order Found</h2>
          <p className="text-gray-600 mb-6">It looks like you haven&apos;t placed an order yet.</p>
          <button
            onClick={() => router.push('/order')}
            className="px-6 py-2.5 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors"
          >
            Place Your Order
          </button>
        </div>
      </div>
    );
  }

  // --- Helper to format date ---
  const formatOrderTime = (isoString: string | null) => {
    if (!isoString) return 'N/A';
    return new Date(isoString).toLocaleString('en-KE', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // --- Success View ---
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-6 animate-pulse">
            <svg className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Thank You, {order.name?.split(' ')[0] || 'Friend'}! 🎉
          </h1>
          <p className="text-lg text-gray-600 max-w-xl mx-auto">
            Your order has been confirmed and is being prepared for delivery.
          </p>
        </div>

        {/* Main Order Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
          {/* Status Banner */}
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">Order Status</p>
                <p className="text-white text-lg font-bold capitalize">
                  {order.order_status?.replace('_', ' ') || 'Processing'}
                </p>
              </div>
              <div className="text-right">
                <p className="text-purple-100 text-sm font-medium">Order Placed</p>
                <p className="text-white text-sm">{formatOrderTime(order.order_time)}</p>
              </div>
            </div>
          </div>

          {/* Order Details */}
          <div className="p-6 space-y-6">
            {/* Delivery Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <svg className="h-5 w-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Delivery Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500 mb-1">Full Name</p>
                  <p className="font-medium text-gray-900">{order.name || 'Not provided'}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500 mb-1">Phone Number</p>
                  <p className="font-medium text-gray-900">{order.phone || 'Not provided'}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 md:col-span-2">
                  <p className="text-sm text-gray-500 mb-1">Delivery Location</p>
                  <p className="font-medium text-gray-900">{order.location || 'Not provided'}</p>
                </div>
                {order.bus_company && (
                  <div className="bg-gray-50 rounded-lg p-4 md:col-span-2">
                    <p className="text-sm text-gray-500 mb-1">Preferred Bus Company</p>
                    <p className="font-medium text-gray-900">{order.bus_company}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Payment Confirmation */}
            {order.mpesa_message && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <svg className="h-5 w-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Payment Confirmed
                </h3>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-sm text-green-800">
                    ✓ M‑PESA payment of <strong>{order.currency} {order.amount?.toLocaleString()}</strong> received successfully.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Delivery Timeline */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">What Happens Next?</h3>
          <div className="space-y-4">
            {[
              { step: 1, title: 'Order Processing', desc: 'We\'re preparing your order for dispatch.', active: true },
              { step: 2, title: 'Dispatched', desc: 'Your order will be handed to the bus company.', active: false },
              { step: 3, title: 'In Transit', desc: 'Your package is on its way to your location.', active: false },
              { step: 4, title: 'Delivered', desc: 'You\'ll receive a call when it arrives!', active: false },
            ].map((item) => (
              <div key={item.step} className="flex items-start gap-4">
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                  item.active ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  {item.step}
                </div>
                <div className="flex-1 pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                  <p className={`font-medium ${item.active ? 'text-gray-900' : 'text-gray-500'}`}>
                    {item.title}
                  </p>
                  <p className="text-sm text-gray-600">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => router.push('/')}
            className="px-8 py-3 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700 transition-colors shadow-lg shadow-purple-200"
          >
            Continue Shopping
          </button>
          <button
            onClick={() => {
              window.open(`https://wa.me/254700000000?text=Hi, I have a question about my order #${order.id?.slice(0,8)}`, '_blank');
            }}
            className="px-8 py-3 bg-white text-purple-600 border-2 border-purple-200 rounded-xl font-medium hover:bg-purple-50 transition-colors"
          >
            Need Help? Contact Us
          </button>
        </div>

        {/* Footer Note */}
        <p className="text-center text-sm text-gray-500 mt-10">
          Questions? Reach out to us anytime. We&apos;re here to help! 💜
        </p>
      </div>
    </div>
  );
}