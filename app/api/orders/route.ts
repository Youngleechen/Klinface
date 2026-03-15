import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, phone, location, busCompany, product, price } = body;

    // Basic validation
    if (!name || !phone || !location) {
      return NextResponse.json(
        { error: 'Name, phone, and location are required' },
        { status: 400 }
      );
    }

    // Insert order into Supabase
    const { data, error } = await supabase
      .from('orders')
      .insert({
        customer_name: name,
        phone_number: phone,
        delivery_location: location,
        bus_company: busCompany || null,
        product_name: product || 'KlinFace Herbal Jar',
        amount: price || 1500,
        status: 'pending_payment',
        payment_method: 'mpesa',
      })
      .select('id')
      .single();

    if (error) throw error;

    return NextResponse.json({
      success: true,
      order_id: data.id,
      message: 'Order created successfully'
    });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}