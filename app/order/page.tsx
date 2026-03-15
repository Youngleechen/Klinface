// app/order/page.tsx
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import OrderForm from './OrderForm'; // client component for the interactive form

export default async function OrderPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login?redirect=order');
  }

  // Fetch existing profile data to pre‑fill the form
  const { data: profile } = await supabase
    .from('profiles')
    .select('name, phone, location, bus_company')
    .eq('id', user.id)
    .single();

  // Pass the existing data to the client component
  return <OrderForm user={user} initialData={profile} />;
}