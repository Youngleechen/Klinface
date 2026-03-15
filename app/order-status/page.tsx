// app/order-status/page.tsx
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function OrderStatusPage() {
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Ignored – middleware refreshes session
          }
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login?redirect=order-status');
  }

  // Fetch profile with order details
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('name, phone, location, bus_company, order_status, mpesa_message, order_time')
    .eq('id', user.id)
    .single();

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-gray-100 py-8 px-4">
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-6 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Profile Not Found</h2>
          <p className="text-gray-700 mb-6">We couldn’t find your profile information. Please complete your registration.</p>
          <Link
            href="/signup"
            className="inline-block px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700"
          >
            Complete Signup
          </Link>
        </div>
      </div>
    );
  }

  const hasOrder = profile.order_status === 'paid' || profile.mpesa_message;

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-6 md:p-8">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">Order Status</h2>

        {hasOrder ? (
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Name</p>
              <p className="font-medium">{profile.name || '—'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Phone</p>
              <p className="font-medium">{profile.phone || '—'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Location</p>
              <p className="font-medium">{profile.location || '—'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Bus Company</p>
              <p className="font-medium">{profile.bus_company || '—'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Order Status</p>
              <p className="font-medium">
                {profile.order_status === 'paid' ? (
                  <span className="text-green-600 font-semibold">Paid – You have access</span>
                ) : (
                  <span className="text-yellow-600">Pending payment</span>
                )}
              </p>
            </div>
            {profile.order_time && (
              <div>
                <p className="text-sm text-gray-500">Order Placed On</p>
                <p className="font-medium">{new Date(profile.order_time).toLocaleString()}</p>
              </div>
            )}
            {profile.mpesa_message && (
              <div>
                <p className="text-sm text-gray-500">M‑PESA Confirmation</p>
                <p className="font-mono text-sm bg-gray-100 p-3 rounded border">{profile.mpesa_message}</p>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center">
            <p className="text-gray-700 mb-6">You haven’t placed an order yet.</p>
            <Link
              href="/order"
              className="inline-block px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700"
            >
              Place an Order
            </Link>
          </div>
        )}

        <div className="mt-8 pt-6 border-t border-gray-200 text-center">
          <Link href="/instructions" className="text-purple-600 hover:underline">
            Go to Instructions
          </Link>
        </div>
      </div>
    </div>
  );
}