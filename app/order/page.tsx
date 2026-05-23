import { createClient } from '@/utils/supabase/server';
import OrderForm from './OrderForm';

export default async function OrderPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Pre-fill only if logged in
  let profile = null;
  if (user) {
    const { data } = await supabase
     .from('profiles')
     .select('name, phone, location, bus_company')
     .eq('id', user.id)
     .maybeSingle();
    profile = data;
  }

  return <OrderForm user={user} initialData={profile} />;
}