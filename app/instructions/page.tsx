// app/instructions/page.tsx
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import SecureVideoPlayer from '@/components/SecureVideoPlayer';

export default async function InstructionsPage() {
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

  // ✅ FIX: Correct destructuring syntax for getUser()
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect('/auth?redirect=instructions');
  }

  // Check for a PAID order in the 'orders' table
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .select('order_status, id')
    .eq('user_id', user.id)
    .eq('order_status', 'paid')
    .order('order_time', { ascending: false })
    .limit(1)
    .single();

  // If no paid order is found, redirect to payment page
  if (orderError || !order) {
    console.warn('No paid order found for user:', user.id, orderError);
    redirect('/order?need_payment=true');
  }

  const instructionsText = `Follow the instructions carefully.

What you need:

1. A mirror (if applying it yourself)
2. Clean water in a basin and a clean cloth or tissue paper.

Instructions:

1. Use the stick to place a tiny drop over one of the moles, warts, or spots and ensure it covers the spot without overflowing.
2. If it drops or overflows, immediately wipe it away using dry tissue paper.
3. It may be a bit itchy as it does its work but if it becomes too much or your skin is too sensitive, just wash it using the clean water sooner.
4. Leave it on for 5 to 10 minutes then you can wash it gently without rubbing or scratching.

Be sure to take some pictures of the process. Feel free to reach out at any time in case you need further help.`;

  const paidVideoUrl = '/videos/0001-3379.mp4';

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-6 md:p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-[#6a0dad] border-b-2 border-[#6a0dad] pb-2">
            Instructions
          </h2>
          <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded border border-green-400">
            Order #{order.id?.slice(0, 8)} Verified
          </span>
        </div>

        <div className="text-gray-700 leading-relaxed whitespace-pre-line mb-8">
          {instructionsText}
        </div>

        <div className="mt-8">
          <h3 className="text-xl font-semibold text-[#6a0dad] mb-4">Video Instructions</h3>
          
          <SecureVideoPlayer src={paidVideoUrl} />
          
         
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            Need help? <a href="/order-status" className="text-[#6a0dad] hover:underline font-medium">Check your order status</a> or contact support.
          </p>
        </div>
      </div>
    </div>
  );
}