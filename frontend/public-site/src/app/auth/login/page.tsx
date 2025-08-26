"use client";

import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Phone } from 'lucide-react';

export default function LoginPage() {
  const [countryCode, setCountryCode] = useState('NG');
  const [dialCode, setDialCode] = useState('+234');
  const [phoneLocal, setPhoneLocal] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const isValidE164Phone = (value: string) => /^\+[1-9]\d{7,14}$/.test(value);
  const e164 = () => {
    const digits = phoneLocal.replace(/\D/g, '');
    const dialDigits = dialCode.replace(/\D/g, '');
    const trimmed = digits.startsWith(dialDigits) ? digits.slice(dialDigits.length) : digits;
    return `${dialCode}${trimmed}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const full = e164();
      if (!isValidE164Phone(full)) {
        throw new Error('Enter phone in E.164 format with country code, e.g. +2348012345678');
      }
      await login(full);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link href="/auth/register" className="font-medium text-blue-600 hover:text-blue-500">
              create a new account
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Phone number
              </label>
              <div className="mt-1 grid grid-cols-3 gap-2">
                <select
                  aria-label="Country"
                  value={countryCode}
                  onChange={(e) => {
                    const cc = e.target.value;
                    setCountryCode(cc);
                    // Minimal mapping. Extend as needed.
                    const map: Record<string, string> = { NG: '+234', GH: '+233', US: '+1', GB: '+44', ZA: '+27', KE: '+254' };
                    setDialCode(map[cc] || '+234');
                  }}
                  className="col-span-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="NG">Nigeria (+234)</option>
                  <option value="GH">Ghana (+233)</option>
                  <option value="US">United States (+1)</option>
                  <option value="GB">United Kingdom (+44)</option>
                  <option value="ZA">South Africa (+27)</option>
                  <option value="KE">Kenya (+254)</option>
                </select>
                <div className="col-span-2 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    value={phoneLocal}
                    onChange={(e) => setPhoneLocal(e.target.value)}
                    className="appearance-none relative block w-full pl-10 pr-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                    placeholder="8012345678"
                  />
                </div>
              </div>
              <p className="mt-1 text-xs text-gray-500">We will send a verification code to {dialCode} {phoneLocal}.</p>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
