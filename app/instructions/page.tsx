// app/instructions/page.tsx
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

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

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login?redirect=instructions');
  }

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('order_status')
    .eq('id', user.id)
    .single();

  if (error || !profile) {
    console.error('Profile fetch error:', error);
    redirect('/signup?error=profile_missing');
  }

  if (profile.order_status !== 'paid') {
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

  const paidVideoUrl = 'https://www.klinface.com/wp-content/uploads/2025/01/2511-5425.mp4';

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-6 md:p-8">
        <h2 className="text-2xl md:text-3xl font-bold text-[#6a0dad] border-b-2 border-[#6a0dad] pb-2 mb-6">
          Instructions
        </h2>

        <div className="text-gray-700 leading-relaxed whitespace-pre-line mb-8">
          {instructionsText}
        </div>

        <div className="mt-8">
          <h3 className="text-xl font-semibold text-[#6a0dad] mb-4">Video Instructions</h3>
          <div className="relative aspect-video w-full max-w-2xl mx-auto">
            <video
              controls
              width="100%"
              height="auto"
              className="rounded-lg shadow-lg w-full h-full object-cover"
              onContextMenu={(e) => e.preventDefault()}
              disablePictureInPicture
              controlsList="nodownload"
            >
              <source src={paidVideoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
          <p className="text-sm text-gray-500 mt-2 text-center">
            Right-click and download are disabled.
          </p>
        </div>
      </div>
    </div>
  );
}