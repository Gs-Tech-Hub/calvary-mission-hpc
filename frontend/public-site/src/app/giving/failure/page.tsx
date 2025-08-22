"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { XCircle, RefreshCw, Home, HelpCircle } from "lucide-react";

export default function DonationFailurePage() {
  const [errorDetails, setErrorDetails] = useState<any>(null);

  useEffect(() => {
    // Get error details from URL params if available
    const urlParams = new URLSearchParams(window.location.search);
    const status = urlParams.get('status');
    const txRef = urlParams.get('tx_ref');
    
    if (status || txRef) {
      setErrorDetails({ status, txRef });
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center px-4">
      <div className="max-w-2xl mx-auto text-center bg-white rounded-2xl shadow-xl p-8">
        {/* Error Icon */}
        <div className="mx-auto w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
          <XCircle className="w-12 h-12 text-red-600" />
        </div>

        {/* Error Message */}
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Payment Unsuccessful
        </h1>
        
        <p className="text-lg text-gray-600 mb-6">
          We're sorry, but your donation payment could not be completed. This could be due to various reasons.
        </p>

        {/* Error Details */}
        {errorDetails && (
          <div className="bg-red-50 rounded-lg p-4 mb-6">
            {errorDetails.status && (
              <p className="text-sm text-red-600 mb-2">
                Status: <span className="font-medium">{errorDetails.status}</span>
              </p>
            )}
            {errorDetails.txRef && (
              <p className="text-sm text-red-600">
                Transaction Reference: <span className="font-mono font-medium">{errorDetails.txRef}</span>
              </p>
            )}
          </div>
        )}

        {/* Common Reasons */}
        <div className="bg-orange-50 rounded-lg p-6 mb-8 text-left">
          <h3 className="font-semibold text-orange-800 mb-3">Common reasons for payment failure:</h3>
          <ul className="space-y-2 text-sm text-orange-700">
            <li>• Insufficient funds in your account</li>
            <li>• Card declined by your bank</li>
            <li>• Network connectivity issues</li>
            <li>• Payment timeout</li>
            <li>• Incorrect payment details</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
          <Link
            href="/giving"
            className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Link>
          
          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            <Home className="w-4 h-4 mr-2" />
            Return Home
          </Link>
        </div>

        {/* Help Section */}
        <div className="bg-blue-50 rounded-lg p-6">
          <h3 className="font-semibold text-blue-800 mb-3 flex items-center justify-center">
            <HelpCircle className="w-5 h-5 mr-2" />
            Need Help?
          </h3>
          <p className="text-blue-700 text-sm mb-3">
            If you continue to experience issues, please contact us for assistance.
          </p>
          <div className="space-y-2 text-sm text-blue-600">
            <p>📧 Email: support@calvarymissionhpc.com</p>
            <p>📞 Phone: +234 XXX XXX XXXX</p>
            <p>⏰ Hours: Monday - Friday, 9:00 AM - 5:00 PM</p>
          </div>
        </div>

        {/* Encouraging Message */}
        <div className="mt-8 p-4 bg-green-50 rounded-lg">
          <p className="text-green-700 text-sm">
            "Let us not become weary in doing good, for at the proper time we will reap a harvest 
            if we do not give up." - Galatians 6:9
          </p>
        </div>
      </div>
    </div>
  );
}
