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

  // Remember guest details
  useEffect(() => {
    if (!user &&!initialData?.phone) {
      const saved = localStorage.getItem('pasaka_guest');
      if (saved) {
        try {
          setFormData(prev => ({...prev,...JSON.parse(saved) }));
        } catch {}
      }
    }
  }, [user, initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({...formData, [e.target.name]: e.target.value });
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

    // Clean phone to 07 format
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
    if (!mpesaMessage.includes('0100444592000') ||!mpesaMessage.includes('1,500')) {
      setMessage('Invalid M-PESA message. Check account number and amount.');
      setLoading(false); return;
    }

    if (!user) {
      localStorage.setItem('pasaka_guest', JSON.stringify({...formData, phone: cleanPhone }));
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

  const inputClass = "mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-900 placeholder-gray-400";

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {needPayment && (
          <div className="mb-6 p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700">
            Complete payment to access instructions.
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          {/* Left */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Details</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Full Name *</label>
                <input type="text" name="name" required value={formData.name} onChange={handleChange} autoComplete="name" className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone Number *</label>
                <input type="tel" name="phone" required value={formData.phone} onChange={handleChange} autoComplete="tel" className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Location *</label>
                <input type="text" name="location" required value={formData.location} onChange={handleChange} placeholder="e.g., Nairobi" autoComplete="address-level2" className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Preferred Bus Company</label>
                <input type="text" name="busCompany" value={formData.busCompany} onChange={handleChange} placeholder="e.g., Guardian" className={inputClass} />
              </div>
            </div>
          </div>

          {/* Right */}
          <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Payment</h2>
            <div className="space-y-4 flex-grow">
              <p className="text-gray-900"><strong>Price:</strong> KES 1,500</p>

              <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-200">
                <div>
                  <span className="text-xs text-gray-500 uppercase">Paybill</span>
                  <p className="font-mono text-lg font-semibold text-gray-900">329329</p>
                </div>
                <button type="button" onClick={() => copyToClipboard('329329', 'paybill')} className="px-3 py-1.5 text-sm bg-white border border-purple-200 text-purple-600 rounded-md hover:bg-purple-50">
                  {copiedField === 'paybill'? 'Copied!' : 'Copy'}
                </button>
              </div>

              <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-200">
                <div>
                  <span className="text-xs text-gray-500 uppercase">Account Number</span>
                  <p className="font-mono text-lg font-semibold text-gray-900">0100444592000</p>
                </div>
                <button type="button" onClick={() => copyToClipboard('0100444592000', 'account')} className="px-3 py-1.5 text-sm bg-white border border-purple-200 text-purple-600 rounded-md hover:bg-purple-50">
                  {copiedField === 'account'? 'Copied!' : 'Copy'}
                </button>
              </div>

              <textarea rows={5} value={mpesaMessage} onChange={(e) => setMpesaMessage(e.target.value)} placeholder="Paste M-PESA message here..." className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-purple-500" />
            </div>

            <button onClick={handleSubmit} disabled={loading} className="mt-6 w-full py-3 bg-purple-600 text-white rounded-md font-medium hover:bg-purple-700 disabled:opacity-50">
              {loading? 'Processing...' : 'Complete Order'}
            </button>
            {message && <div className="mt-3 p-3 bg-red-50 text-red-800 border border-red-200 rounded-md text-sm">{message}</div>}
          </div>
        </div>
      </div>
    </div>
  );
}