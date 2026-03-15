'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

const EMAIL_STORAGE_KEY = 'auth.email';

export default function AuthPage() {
  const { user, loading, signIn, signUp } = useAuth();
  const router = useRouter();

  const [authMode, setAuthMode] = useState<'sign-in' | 'sign-up'>('sign-up');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Redirect if authenticated
  useEffect(() => {
    if (!loading && user) {
      router.replace('/dashboard');
    }
  }, [user, loading, router]);

  // Detect returning user via saved email ONLY
  useEffect(() => {
    if (loading) return;
    if (typeof window !== 'undefined') {
      const savedEmail = localStorage.getItem(EMAIL_STORAGE_KEY);
      if (savedEmail && savedEmail.includes('@')) {
        setEmail(savedEmail);
        setAuthMode('sign-in');
        // Browser's password manager will handle password autofill
      }
    }
  }, [loading]);

  const handleEmailChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    // Only save email if it looks valid
    if (typeof window !== 'undefined' && value.includes('@')) {
      localStorage.setItem(EMAIL_STORAGE_KEY, value);
    } else if (value === '') {
      localStorage.removeItem(EMAIL_STORAGE_KEY);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      if (authMode === 'sign-in') {
        await signIn(email, password);
      } else {
        if (!fullName.trim()) {
          throw new Error('Please enter your name.');
        }
        await signUp(email, password, fullName.trim());
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Authentication failed. Please try again.');
      }
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        fontSize: '1.1rem',
        color: '#666'
      }}>
        Loading...
      </div>
    );
  }

  if (user) {
    return null;
  }

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: '100vh',
      padding: '1rem',
      backgroundColor: '#f9fafb'
    }}>
      <div style={{ 
        maxWidth: '400px', 
        width: '100%',
        padding: '2rem',
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ 
            fontSize: '1.875rem', 
            fontWeight: '700', 
            color: '#111827',
            marginBottom: '0.5rem'
          }}>
            {authMode === 'sign-in' ? 'Welcome Back' : 'Create an Account'}
          </h1>
          <p style={{ color: '#6b7280', fontSize: '0.95rem' }}>
            {authMode === 'sign-in' 
              ? 'Sign in to access your dashboard' 
              : 'Get started with your free account'}
          </p>
        </div>

        {error && (
          <div
            style={{
              color: '#991b1b',
              marginBottom: '1.5rem',
              padding: '0.75rem 1rem',
              backgroundColor: '#fee2e2',
              borderRadius: '8px',
              fontSize: '0.95rem',
              border: '1px solid #fecaca',
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {authMode === 'sign-up' && (
            <div style={{ marginBottom: '1rem' }}>
              <label 
                htmlFor="fullName" 
                style={{ 
                  display: 'block', 
                  marginBottom: '0.5rem', 
                  fontWeight: '500', 
                  color: '#374151',
                  fontSize: '0.95rem'
                }}
              >
                Full Name
              </label>
              <input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="John Doe"
                required
                autoComplete="name"
                style={{
                  width: '100%',
                  padding: '0.625rem 0.875rem',
                  borderRadius: '8px',
                  border: '1px solid #d1d5db',
                  fontSize: '1rem',
                  outline: 'none',
                  transition: 'border-color 0.15s ease',
                }}
                onFocus={(e) => e.target.style.borderColor = '#4f46e5'}
                onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
              />
            </div>
          )}

          <div style={{ marginBottom: '1rem' }}>
            <label 
              htmlFor="email" 
              style={{ 
                display: 'block', 
                marginBottom: '0.5rem', 
                fontWeight: '500', 
                color: '#374151',
                fontSize: '0.95rem'
              }}
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={handleEmailChange}
              placeholder="you@example.com"
              required
              autoComplete="email"
              style={{
                width: '100%',
                padding: '0.625rem 0.875rem',
                borderRadius: '8px',
                border: '1px solid #d1d5db',
                fontSize: '1rem',
                outline: 'none',
                transition: 'border-color 0.15s ease',
              }}
              onFocus={(e) => e.target.style.borderColor = '#4f46e5'}
              onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label 
              htmlFor="password" 
              style={{ 
                display: 'block', 
                marginBottom: '0.5rem', 
                fontWeight: '500', 
                color: '#374151',
                fontSize: '0.95rem'
              }}
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={authMode === 'sign-up' ? 'Create a password (6+ characters)' : 'Enter your password'}
              required
              minLength={6}
              autoComplete={authMode === 'sign-in' ? 'current-password' : 'new-password'}
              style={{
                width: '100%',
                padding: '0.625rem 0.875rem',
                borderRadius: '8px',
                border: '1px solid #d1d5db',
                fontSize: '1rem',
                outline: 'none',
                transition: 'border-color 0.15s ease',
              }}
              onFocus={(e) => e.target.style.borderColor = '#4f46e5'}
              onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            style={{
              width: '100%',
              padding: '0.75rem 1rem',
              backgroundColor: submitting ? '#818cf8' : '#4f46e5',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: submitting ? 'not-allowed' : 'pointer',
              fontSize: '1rem',
              fontWeight: '600',
              transition: 'background-color 0.2s',
              marginBottom: '1rem',
            }}
            onMouseEnter={(e) => !submitting && (e.currentTarget.style.backgroundColor = '#4338ca')}
            onMouseLeave={(e) => !submitting && (e.currentTarget.style.backgroundColor = '#4f46e5')}
          >
            {submitting ? (
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg style={{ animation: 'spin 1s linear infinite', marginRight: '0.5rem', height: '1.25rem', width: '1.25rem' }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : (
              authMode === 'sign-in' ? 'Sign In' : 'Create Account'
            )}
          </button>
        </form>

        <div style={{ textAlign: 'center' }}>
          <button
            type="button"
            onClick={() => {
              setAuthMode(authMode === 'sign-in' ? 'sign-up' : 'sign-in');
              setError(''); // Clear any errors when switching modes
            }}
            style={{
              background: 'none',
              border: 'none',
              color: '#4f46e5',
              cursor: 'pointer',
              fontSize: '0.95rem',
              fontWeight: '500',
              textDecoration: 'underline',
              textUnderlineOffset: '2px',
            }}
          >
            {authMode === 'sign-in'
              ? "Don't have an account? Sign up"
              : 'Already have an account? Sign in'}
          </button>
        </div>

        {authMode === 'sign-up' && (
          <p style={{ 
            marginTop: '1.5rem', 
            fontSize: '0.85rem', 
            color: '#6b7280',
            textAlign: 'center',
            borderTop: '1px solid #e5e7eb',
            paddingTop: '1.5rem'
          }}>
            By creating an account, you agree to our{' '}
            <a href="/terms" style={{ color: '#4f46e5', textDecoration: 'none' }}>Terms</a>{' '}
            and{' '}
            <a href="/privacy" style={{ color: '#4f46e5', textDecoration: 'none' }}>Privacy Policy</a>.
          </p>
        )}
      </div>

      <style jsx>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}