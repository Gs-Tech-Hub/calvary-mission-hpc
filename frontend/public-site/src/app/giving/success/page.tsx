"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle, Heart, Home, Mail } from "lucide-react";

export default function DonationSuccessPage() {
  const [donationDetails, setDonationDetails] = useState<any>(null);

  useEffect(() => {
    // Get donation details from URL params or localStorage if available
    const urlParams = new URLSearchParams(window.location.search);
    const transactionId = urlParams.get('transaction_id');
    
    if (transactionId) {
      // You could fetch donation details here if needed
      setDonationDetails({ transactionId });
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center px-4">
      <div className="max-w-2xl mx-auto text-center bg-white rounded-2xl shadow-xl p-8">
        {/* Success Icon */}
        <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
          <CheckCircle className="w-12 h-12 text-green-600" />
        </div>

        {/* Success Message */}
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Thank You for Your Donation!
        </h1>
        
        <p className="text-lg text-gray-600 mb-6">
          Your generous contribution has been received and will make a significant impact on our ministry.
        </p>

        {/* Transaction Details */}
        {donationDetails && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-600">
              Transaction ID: <span className="font-mono font-medium">{donationDetails.transactionId}</span>
            </p>
          </div>
        )}

        {/* What Happens Next */}
        <div className="bg-blue-50 rounded-lg p-6 mb-8 text-left">
          <h3 className="font-semibold text-blue-800 mb-3">What happens next?</h3>
          <ul className="space-y-2 text-sm text-blue-700">
            <li className="flex items-start">
              <Mail className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
              You'll receive a confirmation email with your donation receipt
            </li>
            <li className="flex items-start">
              <Heart className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
              Your donation will be used to support our ministry and community
            </li>
            <li className="flex items-start">
              <CheckCircle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
              We'll keep you updated on how your contribution is making a difference
            </li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/giving"
            className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Heart className="w-4 h-4 mr-2" />
            Give Again
          </Link>
          
          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            <Home className="w-4 h-4 mr-2" />
            Return Home
          </Link>
        </div>

        {/* Additional Message */}
        <div className="mt-8 p-4 bg-green-50 rounded-lg">
          <p className="text-green-700 text-sm">
            "Each of you must give as you have made up your mind, not reluctantly or under compulsion, 
            for God loves a cheerful giver." - 2 Corinthians 9:7
          </p>
        </div>
      </div>
    </div>
  );
}
