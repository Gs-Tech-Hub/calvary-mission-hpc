"use client";

import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, User, Mail, Phone, MapPin, Church, Users } from 'lucide-react';

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    isMember: false,
    churchBranch: '',
    department: '',
    isChristian: false,
    previousChurch: '',
  });
  const [countryCode, setCountryCode] = useState('NG');
  const [dialCode, setDialCode] = useState('+234');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const isValidE164Phone = (value: string) => /^\+[1-9]\d{7,14}$/.test(value);
  const toE164 = (local: string) => {
    const digits = local.replace(/\D/g, '');
    const dialDigits = dialCode.replace(/\D/g, '');
    const trimmed = digits.startsWith(dialDigits) ? digits.slice(dialDigits.length) : digits;
    return `${dialCode}${trimmed}`;
  };

  const nextStep = () => {
    if (step === 1 && (!formData.fullName || !formData.email)) {
      setError('Please fill in all required fields');
      return;
    }
    if (step === 2 && (!formData.phone || !formData.address)) {
      setError('Please fill in all required fields');
      return;
    }
    if (step === 2 && !isValidE164Phone(toE164(formData.phone))) {
      setError('Enter a valid phone number');
      return;
    }
    setError('');
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const userData = {
        fullName: formData.fullName,
        email: formData.email,
        phone: toE164(formData.phone),
        address: formData.address,
        isMember: formData.isMember,
        churchBranch: formData.churchBranch,
        department: formData.department,
        isChristian: formData.isChristian,
        previousChurch: formData.previousChurch,
        internalizedPhone: toE164(formData.phone)
      };

      await register(userData);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-4">
      <div>
        <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
          Full name *
        </label>
        <div className="mt-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <User className="h-5 w-5 text-gray-400" />
          </div>
          <input
            id="fullName"
            name="fullName"
            type="text"
            required
            value={formData.fullName}
            onChange={handleInputChange}
            className="appearance-none relative block w-full pl-10 pr-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
            placeholder="Enter your full name"
          />
        </div>
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email *
        </label>
        <div className="mt-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Mail className="h-5 w-5 text-gray-400" />
          </div>
          <input
            id="email"
            name="email"
            type="email"
            required
            value={formData.email}
            onChange={handleInputChange}
            className="appearance-none relative block w-full pl-10 pr-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
            placeholder="Enter your email"
          />
        </div>
      </div>

      {/* No password: phone will be used as backend password to satisfy Strapi */}
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-4">
      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
          Phone Number *
        </label>
        <div className="mt-1 grid grid-cols-3 gap-2">
          <select
            aria-label="Country"
            value={countryCode}
            onChange={(e) => {
              const cc = e.target.value;
              setCountryCode(cc);
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
              value={formData.phone}
              onChange={handleInputChange}
              className="appearance-none relative block w-full pl-10 pr-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              placeholder="8012345678"
            />
          </div>
        </div>
        <p className="mt-1 text-xs text-gray-500">Your number will be saved as {dialCode} {formData.phone}.</p>
      </div>

      <div>
        <label htmlFor="address" className="block text-sm font-medium text-gray-700">
          Address *
        </label>
        <div className="mt-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MapPin className="h-5 w-5 text-gray-400" />
          </div>
          <input
            id="address"
            name="address"
            type="text"
            required
            value={formData.address}
            onChange={handleInputChange}
            className="appearance-none relative block w-full pl-10 pr-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
            placeholder="Enter your address"
          />
        </div>
      </div>

      <div className="flex items-center">
        <input
          id="isMember"
          name="isMember"
          type="checkbox"
          checked={formData.isMember}
          onChange={handleInputChange}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label htmlFor="isMember" className="ml-2 block text-sm text-gray-900">
          I am a member of this church
        </label>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-4">
      {formData.isMember && (
        <>
          <div>
            <label htmlFor="churchBranch" className="block text-sm font-medium text-gray-700">
              Church Branch
            </label>
            <div className="mt-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Church className="h-5 w-5 text-gray-400" />
              </div>
              <select
                id="churchBranch"
                name="churchBranch"
                value={formData.churchBranch}
                onChange={handleInputChange}
                className="appearance-none relative block w-full pl-10 pr-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              >
                <option value="">Select church branch</option>
                <option value="main">Main Branch</option>
                <option value="north">North Branch</option>
                <option value="south">South Branch</option>
                <option value="east">East Branch</option>
                <option value="west">West Branch</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="department" className="block text-sm font-medium text-gray-700">
              Department (Optional)
            </label>
            <div className="mt-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Users className="h-5 w-5 text-gray-400" />
              </div>
              <select
                id="department"
                name="department"
                value={formData.department}
                onChange={handleInputChange}
                className="appearance-none relative block w-full pl-10 pr-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              >
                <option value="">Select department</option>
                <option value="worship">Worship Team</option>
                <option value="youth">Youth Ministry</option>
                <option value="children">Children's Ministry</option>
                <option value="ushering">Ushering</option>
                <option value="media">Media Team</option>
                <option value="outreach">Outreach</option>
              </select>
            </div>
          </div>
        </>
      )}

      {!formData.isMember && (
        <>
          <div className="flex items-center">
            <input
              id="isChristian"
              name="isChristian"
              type="checkbox"
              checked={formData.isChristian}
              onChange={handleInputChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="isChristian" className="ml-2 block text-sm text-gray-900">
              I am a Christian
            </label>
          </div>

          {formData.isChristian && (
            <div>
              <label htmlFor="previousChurch" className="block text-sm font-medium text-gray-700">
                Previous/Current Church
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Church className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="previousChurch"
                  name="previousChurch"
                  type="text"
                  value={formData.previousChurch}
                  onChange={handleInputChange}
                  className="appearance-none relative block w-full pl-10 pr-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Enter church name"
                />
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link href="/auth/login" className="font-medium text-blue-600 hover:text-blue-500">
              sign in to your existing account
            </Link>
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center space-x-2">
          {[1, 2, 3].map((stepNumber) => (
            <div
              key={stepNumber}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step >= stepNumber
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-600'
              }`}
            >
              {stepNumber}
            </div>
          ))}
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}

          <div className="flex space-x-3">
            {step > 1 && (
              <button
                type="button"
                onClick={prevStep}
                className="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Previous
              </button>
            )}
            
            {step < 3 ? (
              <button
                type="button"
                onClick={nextStep}
                className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating account...' : 'Create account'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
