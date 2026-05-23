'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

export default function OrderForm({ user, initialData }: any) {
  const router = useRouter();
  const supabase = createClient();

  const [form, setForm] = useState({
    name: initialData?.name || '',
    phone: initialData?.phone || '',
    location: initialData?.location || '',
    bus_company: initialData?.bus_company || '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const update = (key: string, value: string) =>
    setForm(s => ({...s, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const cleanPhone = form.phone.replace(/\s+/g, '').replace(/^\+254/, '0').replace(/^254/, '0').trim();

      if (!form.name ||!cleanPhone ||!form.location) {
        throw new Error('Please fill name, phone and location');
      }

      const payload = {
        user_id: user?.id || null,
        name: form.name.trim(),
        phone: cleanPhone,
        location: form.location.trim(),
        bus_company: form.bus_company.trim() || null,
        order_status: 'confirmed',
        order_time: new Date().toISOString(),
        amount: 150,
        currency: 'KES',
        mpesa_message: 'MPESA payment received',
      };

      const { error: insertErr } = await supabase.from('orders').insert(payload);
      if (insertErr) throw insertErr;

      // Save for guest lookup (matches your OrderStatusPage logic)
      if (!user) {
        localStorage.setItem('pasaka_guest', JSON.stringify({ phone: cleanPhone }));
      }

      router.push(`/order-status?phone=${encodeURIComponent(cleanPhone)}`);
    } catch (err: any) {
      setError(err.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  const s = {
    page: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #faf5ff 0%, #ffffff 50%, #eef2ff 100%)',
      padding: '48px 16px',
      fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, sans-serif',
    },
    wrap: { maxWidth: '640px', margin: '0 auto' },
    card: {
      background: '#ffffff',
      borderRadius: '16px',
      boxShadow: '0 20px 40px rgba(0,0,0,0.08)',
      overflow: 'hidden',
    },
    header: {
      background: 'linear-gradient(90deg, #7c3aed 0%, #4f46e5 100%)',
      padding: '28px 24px',
      color: '#fff',
    },
    title: { margin: 0, fontSize: '24px', fontWeight: 700 },
    subtitle: { margin: '6px 0 0', opacity: 0.9, fontSize: '14px' },
    body: { padding: '24px' },
    grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' },
    field: { marginBottom: '16px' },
    label: { display: 'block', fontSize: '13px', color: '#4b5563', marginBottom: '6px', fontWeight: 500 },
    input: {
      width: '100%',
      padding: '12px 14px',
      border: '1px solid #e5e7eb',
      borderRadius: '10px',
      fontSize: '15px',
      outline: 'none',
      boxSizing: 'border-box' as const,
      background: '#fff',
    },
    inputFocus: { borderColor: '#7c3aed', boxShadow: '0 0 0 3px rgba(124,58,237,0.15)' },
    full: { gridColumn: '1 / -1' },
    error: {
      background: '#fef2f2',
      color: '#b91c1c',
      border: '1px solid #fecaca',
      padding: '10px 12px',
      borderRadius: '10px',
      fontSize: '14px',
      marginBottom: '16px',
    },
    button: {
      width: '100%',
      padding: '14px',
      background: '#7c3aed',
      color: '#fff',
      border: 'none',
      borderRadius: '10px',
      fontSize: '16px',
      fontWeight: 600,
      cursor: 'pointer',
      marginTop: '8px',
    },
    buttonDisabled: { opacity: 0.7, cursor: 'not-allowed' },
    note: { fontSize: '12px', color: '#6b7280', textAlign: 'center' as const, marginTop: '14px' },
  };

  return (
    <div style={s.page}>
      <div style={s.wrap}>
        <div style={s.card}>
          <div style={s.header}>
            <h1 style={s.title}>Place Your Order</h1>
            <p style={s.subtitle}>
              {user? `Welcome back, ${user.email}` : 'Checkout as guest'}
            </p>
          </div>

          <form onSubmit={handleSubmit} style={s.body}>
            {error && <div style={s.error}>{error}</div>}

            <div style={s.grid}>
              <div style={s.field}>
                <label style={s.label}>Full Name</label>
                <input
                  style={s.input}
                  value={form.name}
                  onChange={e => update('name', e.target.value)}
                  placeholder="Jane Doe"
                  required
                />
              </div>

              <div style={s.field}>
                <label style={s.label}>Phone (M-PESA)</label>
                <input
                  style={s.input}
                  value={form.phone}
                  onChange={e => update('phone', e.target.value)}
                  placeholder="0712 345 678"
                  required
                  inputMode="tel"
                />
              </div>

              <div style={{...s.field,...s.full}}>
                <label style={s.label}>Delivery Location</label>
                <input
                  style={s.input}
                  value={form.location}
                  onChange={e => update('location', e.target.value)}
                  placeholder="Estate, street, house no."
                  required
                />
              </div>

              <div style={{...s.field,...s.full}}>
                <label style={s.label}>Bus Company (optional)</label>
                <input
                  style={s.input}
                  value={form.bus_company}
                  onChange={e => update('bus_company', e.target.value)}
                  placeholder="e.g., Easy Coach, Guardian"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{...s.button,...(loading? s.buttonDisabled : {}) }}
            >
              {loading? 'Placing order...' : 'Pay KES 150 with M-PESA'}
            </button>

            <p style={s.note}>
              You'll be redirected to order status after placing the order.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}