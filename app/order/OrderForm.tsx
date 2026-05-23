'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

interface OrderFormProps {
  user: any | null;
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
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const needPayment = searchParams.get('need_payment') === 'true';
  const supabase = createClient();

  useEffect(() => {
    if (!user && !initialData?.phone) {
      const saved = localStorage.getItem('pasaka_guest');
      if (saved) {
        try {
          setFormData(prev => ({ ...prev, ...JSON.parse(saved) }));
        } catch {}
      }
    }
  }, [user, initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const copyToClipboard = async (text: string, field: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const cleanPhone = formData.phone.replace(/\s+/g, '').replace(/^\+254/, '0').replace(/^254/, '0').trim();

    if (user?.id) {
      await supabase.from('profiles').update({
        name: formData.name,
        phone: cleanPhone,
        location: formData.location,
      }).eq('id', user.id);
    }

    if (!mpesaMessage.trim()) {
      setMessage('Please paste your M-PESA confirmation message.');
      setLoading(false); return;
    }
    if (!mpesaMessage.includes('0100444592000') || !mpesaMessage.includes('1,500')) {
      setMessage('Invalid M-PESA message. Check account number and amount.');
      setLoading(false); return;
    }

    if (!user) {
      localStorage.setItem('pasaka_guest', JSON.stringify({ ...formData, phone: cleanPhone }));
    }

    const { error } = await supabase.from('orders').insert({
      user_id: user?.id || null,
      name: formData.name.trim(),
      phone: cleanPhone,
      location: formData.location.trim(),
      bus_company: formData.busCompany.trim(),
      order_status: 'paid',
      mpesa_message: mpesaMessage,
      order_time: new Date().toISOString(),
      amount: 1500,
      currency: 'KES',
    });

    if (error) {
      setMessage('Order submission failed. Please contact support.');
      setLoading(false); return;
    }

    router.push('/order-status?phone=' + encodeURIComponent(cleanPhone));
  };

  const s = {
    page: { minHeight: '100vh', backgroundColor: '#f3f4f6', padding: '32px 16px', fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, sans-serif' },
    container: { maxWidth: '1024px', margin: '0 auto' },
    alert: { marginBottom: '24px', padding: '16px', backgroundColor: '#fefce8', borderLeft: '4px solid #eab308', color: '#854d0e', borderRadius: '6px', fontSize: '14px' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' },
    card: { backgroundColor: '#ffffff', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', padding: '24px' },
    cardFlex: { backgroundColor: '#ffffff', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', padding: '24px', display: 'flex', flexDirection: 'column' as const },
    h2: { fontSize: '22px', fontWeight: 700, color: '#111827', margin: '0 0 24px 0' },
    label: { display: 'block', fontSize: '14px', fontWeight: 500, color: '#374151', marginBottom: '6px' },
    input: { width: '100%', padding: '10px 12px', backgroundColor: '#ffffff', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '15px', color: '#111827', boxSizing: 'border-box' as const, outline: 'none' },
    field: { marginBottom: '16px' },
    price: { color: '#111827', fontSize: '15px', marginBottom: '16px' },
    payRow: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#f9fafb', padding: '12px', borderRadius: '8px', border: '1px solid #e5e7eb', marginBottom: '12px' },
    payLabel: { fontSize: '11px', color: '#6b7280', textTransform: 'uppercase' as const, letterSpacing: '0.5px' },
    payValue: { fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace', fontSize: '18px', fontWeight: 600, color: '#111827', margin: '2px 0 0 0' },
    copyBtn: { padding: '6px 12px', fontSize: '13px', backgroundColor: '#ffffff', border: '1px solid #ddd6fe', color: '#7c3aed', borderRadius: '6px', cursor: 'pointer' },
    textarea: { width: '100%', padding: '10px 12px', backgroundColor: '#ffffff', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', color: '#111827', boxSizing: 'border-box' as const, minHeight: '110px', resize: 'vertical' as const },
    submit: { marginTop: '24px', width: '100%', padding: '12px', backgroundColor: '#7c3aed', color: '#ffffff', border: 'none', borderRadius: '6px', fontSize: '16px', fontWeight: 500, cursor: 'pointer' },
    submitDisabled: { opacity: 0.5, cursor: 'not-allowed' },
    error: { marginTop: '12px', padding: '12px', backgroundColor: '#fef2f2', color: '#991b1b', border: '1px solid #fecaca', borderRadius: '6px', fontSize: '14px' },
  };

  return (
    <div style={s.page}>
      <div style={s.container}>
        {needPayment && (
          <div style={s.alert}>
            Complete payment to access instructions.
          </div>
        )}

        <div style={s.grid}>
          {/* Left */}
          <div style={s.card}>
            <h2 style={s.h2}>Your Details</h2>
            <div>
              <div style={s.field}>
                <label style={s.label}>Full Name *</label>
                <input type="text" name="name" required value={formData.name} onChange={handleChange} autoComplete="name" style={s.input} />
              </div>
              <div style={s.field}>
                <label style={s.label}>Phone Number *</label>
                <input type="tel" name="phone" required value={formData.phone} onChange={handleChange} autoComplete="tel" style={s.input} />
              </div>
              <div style={s.field}>
                <label style={s.label}>Location *</label>
                <input type="text" name="location" required value={formData.location} onChange={handleChange} placeholder="e.g., Nairobi" autoComplete="address-level2" style={s.input} />
              </div>
              <div style={s.field}>
                <label style={s.label}>Preferred Bus Company</label>
                <input type="text" name="busCompany" value={formData.busCompany} onChange={handleChange} placeholder="e.g., Guardian" style={s.input} />
              </div>
            </div>
          </div>

          {/* Right */}
          <div style={s.cardFlex}>
            <h2 style={s.h2}>Payment</h2>
            <div style={{ flexGrow: 1 }}>
              <p style={s.price}><strong>Price:</strong> KES 1,500</p>

              <div style={s.payRow}>
                <div>
                  <span style={s.payLabel}>Paybill</span>
                  <p style={s.payValue}>329329</p>
                </div>
                <button type="button" onClick={() => copyToClipboard('329329', 'paybill')} style={s.copyBtn}>
                  {copiedField === 'paybill' ? 'Copied!' : 'Copy'}
                </button>
              </div>

              <div style={s.payRow}>
                <div>
                  <span style={s.payLabel}>Account Number</span>
                  <p style={s.payValue}>0100444592000</p>
                </div>
                <button type="button" onClick={() => copyToClipboard('0100444592000', 'account')} style={s.copyBtn}>
                  {copiedField === 'account' ? 'Copied!' : 'Copy'}
                </button>
              </div>

              <textarea
                rows={5}
                value={mpesaMessage}
                onChange={(e) => setMpesaMessage(e.target.value)}
                placeholder="Paste M-PESA message here..."
                style={s.textarea}
              />
            </div>

            <button onClick={handleSubmit} disabled={loading} style={{ ...s.submit, ...(loading ? s.submitDisabled : {}) }}>
              {loading ? 'Processing...' : 'Complete Order'}
            </button>
            {message && <div style={s.error}>{message}</div>}
          </div>
        </div>
      </div>
    </div>
  );
}