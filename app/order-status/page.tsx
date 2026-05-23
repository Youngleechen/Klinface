'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
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

// This component does the actual work and uses useSearchParams
function OrderStatusContent() {
  const { user, loading: authLoading } = useAuth();
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  useEffect(() => {
    const fetchOrder = async () => {
      if (authLoading) return;

      const phoneRaw = searchParams.get('phone');
      const cleanPhone = phoneRaw?.replace(/\s+/g, '').replace(/^\+254/, '0').replace(/^254/, '0').trim();

      let phoneToSearch = cleanPhone;
      if (!phoneToSearch &&!user?.id) {
        const saved = localStorage.getItem('pasaka_guest');
        if (saved) {
          try {
            phoneToSearch = JSON.parse(saved).phone;
          } catch {}
        }
      }

      // Don't query if we have no identifier - prevents leaking other users' orders
      if (!user?.id &&!phoneToSearch) {
        setLoading(false);
        return;
      }

      try {
        let query = supabase
         .from('orders')
         .select('id, name, phone, location, bus_company, order_status, order_time, mpesa_message, amount, currency')
         .order('order_time', { ascending: false })
         .limit(1);

        if (user?.id) {
          query = query.eq('user_id', user.id);
        } else if (phoneToSearch) {
          query = query.eq('phone', phoneToSearch);
        }

        const { data } = await query.maybeSingle();
        setOrder(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [user, authLoading, searchParams, supabase]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50"><p className="text-gray-900">Loading your order...</p></div>;
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md">
          <h2 className="text-xl font-bold text-gray-900 mb-2">No Order Found</h2>
          <p className="text-gray-600 mb-6">We couldn't find your order. Place one first.</p>
          <button onClick={() => router.push('/order')} className="px-6 py-2.5 bg-purple-600 text-white rounded-lg">Place Order</button>
        </div>
      </div>
    );
  }

  const formatTime = (iso: string | null) => iso? new Date(iso).toLocaleString('en-KE') : 'N/A';

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-6">
            <svg className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">Thank You, {order.name?.split(' ')[0]}! 🎉</h1>
          <p className="text-lg text-gray-600">Your order is confirmed.</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-4 text-white">
            <div className="flex justify-between">
              <div><p className="text-sm opacity-80">Status</p><p className="font-bold capitalize">{order.order_status}</p></div>
              <div className="text-right"><p className="text-sm opacity-80">Placed</p><p className="text-sm">{formatTime(order.order_time)}</p></div>
            </div>
          </div>

          <div className="p-6 space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Delivery Information</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg"><p className="text-sm text-gray-500">Name</p><p className="font-medium text-gray-900">{order.name}</p></div>
                <div className="bg-gray-50 p-4 rounded-lg"><p className="text-sm text-gray-500">Phone</p><p className="font-medium text-gray-900">{order.phone}</p></div>
                <div className="bg-gray-50 p-4 rounded-lg md:col-span-2"><p className="text-sm text-gray-500">Location</p><p className="font-medium text-gray-900">{order.location}</p></div>
                {order.bus_company && <div className="bg-gray-50 p-4 rounded-lg md:col-span-2"><p className="text-sm text-gray-500">Bus Company</p><p className="font-medium text-gray-900">{order.bus_company}</p></div>}
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
              <p className="text-green-800 text-sm">✓ M-PESA {order.currency} {order.amount?.toLocaleString()} received</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// The page wrapper - Suspense prevents the prerender error
export default function OrderStatusPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-900">Loading your order...</p>
      </div>
    }>
      <OrderStatusContent />
    </Suspense>
  );
}