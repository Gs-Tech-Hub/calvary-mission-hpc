"use client";
import { useState } from "react";
import { FlutterWaveButton, closePaymentModal } from "flutterwave-react-v3";
import { useForm } from "react-hook-form";
import { flutterwaveConfig } from "@/lib/flutterwave-config";

interface DonationFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  amount: number;
  donationType: string;
  message?: string;
  anonymous: boolean;
}

interface DonationType {
  id: string;
  name: string;
  description: string;
  suggestedAmounts: number[];
}

const donationTypes: DonationType[] = [
  {
    id: "tithe",
    name: "Tithe",
    description: "Give 10% of your income as commanded in the Bible",
    suggestedAmounts: [1000, 2500, 5000, 10000, 25000]
  },
  {
    id: "offering",
    name: "Offering",
    description: "Give freely from your heart to support the ministry",
    suggestedAmounts: [500, 1000, 2500, 5000, 10000]
  },
  {
    id: "building-fund",
    name: "Building Fund",
    description: "Support our church building and expansion projects",
    suggestedAmounts: [1000, 5000, 10000, 25000, 50000]
  },
  {
    id: "missions",
    name: "Missions",
    description: "Support our local and international mission work",
    suggestedAmounts: [500, 1000, 2500, 5000, 10000]
  },
  {
    id: "benevolence",
    name: "Benevolence",
    description: "Help those in need within our community",
    suggestedAmounts: [500, 1000, 2500, 5000, 10000]
  },
  {
    id: "other",
    name: "Other",
    description: "Specify a custom donation purpose",
    suggestedAmounts: [500, 1000, 2500, 5000, 10000]
  }
];

export default function DonationForm() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [selectedType, setSelectedType] = useState<DonationType>(donationTypes[0]);
  const [customAmount, setCustomAmount] = useState<number | "">("");
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue
  } = useForm<DonationFormData>({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      amount: 1000,
      donationType: "tithe",
      message: "",
      anonymous: false
    }
  });

  const watchedAmount = watch("amount");
  const watchedAnonymous = watch("anonymous");

  const handleDonationTypeChange = (typeId: string) => {
    const type = donationTypes.find(t => t.id === typeId);
    if (type) {
      setSelectedType(type);
      // Set default amount to first suggested amount
      if (type.suggestedAmounts.length > 0) {
        setCustomAmount("");
        setValue("amount", type.suggestedAmounts[0]);
      }
    }
  };

  const handleAmountChange = (amount: number) => {
    setCustomAmount("");
    setValue("amount", amount);
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCustomAmount(value === "" ? "" : Number(value));
    // When custom amount is entered, update the form's amount field
    if (value !== "") {
      setValue("amount", Number(value));
    }
  };

  const getFinalAmount = () => {
    if (customAmount !== "") {
      return Number(customAmount);
    }
    return watchedAmount;
  };

  const onSubmit = async (data: DonationFormData) => {
    setIsProcessing(true);
    
    try {
      // Record donation in Strapi first
      const donationRecord = await fetch('/api/donations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          amount: getFinalAmount(),
          donationType: selectedType.id,
          status: 'pending'
        }),
      });

      if (!donationRecord.ok) {
        throw new Error('Failed to record donation');
      }

      const donationData = await donationRecord.json();
      
      // Flutterwave will handle the payment modal
      // The success callback will update the donation status
    } catch (error) {
      console.error('Error recording donation:', error);
      setIsProcessing(false);
    }
  };

  const config = {
    public_key: flutterwaveConfig.publicKey,
    tx_ref: Date.now().toString(),
    amount: getFinalAmount(),
    currency: flutterwaveConfig.currency,
    payment_options: flutterwaveConfig.paymentOptions,
    redirect_url: `${window.location.origin}${flutterwaveConfig.urls.success}`,
    customer: {
      email: watch("email"),
      phone_number: watch("phone"),
      name: `${watch("firstName")} ${watch("lastName")}`,
    },
    customizations: {
      title: flutterwaveConfig.company.name,
      description: `${selectedType.name} Donation`,
      logo: flutterwaveConfig.company.logo,
    },
    onClose: () => {
      setIsProcessing(false);
    },
    callback: async (response: any) => {
      if (response.status === "successful") {
        // Update donation status in Strapi
        try {
          await fetch('/api/donations/update-status', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              transactionId: response.transaction_id,
              status: 'completed',
              flutterwaveRef: response.flw_ref
            }),
          });
        } catch (error) {
          console.error('Error updating donation status:', error);
        }
        
        closePaymentModal();
        reset();
        setIsProcessing(false);
        setIsSuccess(true);
        // Stay on same page and show success message
      }
    },
  };

  // Show success message if donation was successful
  if (isSuccess) {
    return (
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Thank You!</h2>
        <p className="text-lg text-gray-600 mb-6">
          Your donation has been received successfully. You will receive a confirmation email shortly.
        </p>
        <button
          onClick={() => setIsSuccess(false)}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Make Another Donation
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Make a Donation</h2>
        <p className="text-gray-600">Support our ministry and make a difference</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Donation Type Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Donation Type *
          </label>
          <div className="grid grid-cols-2 gap-3">
            {donationTypes.map((type) => (
              <button
                key={type.id}
                type="button"
                onClick={() => handleDonationTypeChange(type.id)}
                className={`p-4 text-left rounded-lg border-2 transition-all ${
                  selectedType.id === type.id
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <h4 className="font-semibold text-gray-800">{type.name}</h4>
                <p className="text-sm text-gray-600 mt-1">{type.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Amount Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Amount (₦) *
          </label>
          <div className="grid grid-cols-3 gap-3 mb-3">
            {selectedType.suggestedAmounts.map((amount) => (
              <button
                key={amount}
                type="button"
                onClick={() => handleAmountChange(amount)}
                className={`p-3 rounded-lg border-2 transition-all ${
                  watchedAmount === amount && customAmount === ""
                    ? "border-blue-500 bg-blue-50 text-blue-700 font-semibold"
                    : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                }`}
              >
                ₦{amount.toLocaleString()}
              </button>
            ))}
          </div>
          <div className="flex items-center space-x-3">
            <input
              type="number"
              placeholder="Custom amount"
              value={customAmount}
              onChange={handleCustomAmountChange}
              className={`flex-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                customAmount !== "" 
                  ? "border-blue-500 bg-blue-50" 
                  : "border-gray-300"
              }`}
              min="100"
            />
            <span className="text-gray-500">₦</span>
          </div>
          {customAmount !== "" && (
            <p className="text-sm text-blue-600 mt-2">
              ✓ Custom amount: ₦{Number(customAmount).toLocaleString()}
            </p>
          )}
        </div>

        {/* Personal Information */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              First Name *
            </label>
            <input
              {...register("firstName", { required: "First name is required" })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="John"
            />
            {errors.firstName && (
              <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Last Name *
            </label>
            <input
              {...register("lastName", { required: "Last name is required" })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Doe"
            />
            {errors.lastName && (
              <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email *
            </label>
            <input
              {...register("email", { 
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address"
                }
              })}
              type="email"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="john@example.com"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone *
            </label>
            <input
              {...register("phone", { required: "Phone number is required" })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="+234 801 234 5678"
            />
            {errors.phone && (
              <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
            )}
          </div>
        </div>

        {/* Message */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Message (Optional)
          </label>
          <textarea
            {...register("message")}
            rows={3}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Share why you're giving or any prayer requests..."
          />
        </div>

        {/* Anonymous Option */}
        <div className="flex items-center">
          <input
            {...register("anonymous")}
            type="checkbox"
            id="anonymous"
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="anonymous" className="ml-2 block text-sm text-gray-700">
            Make this donation anonymous
          </label>
        </div>

        {/* Summary */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-semibold text-gray-800 mb-2">Donation Summary</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Type:</span>
              <span className="font-medium">{selectedType.name}</span>
            </div>
            <div className="flex justify-between">
              <span>Amount:</span>
              <span className="font-medium">₦{getFinalAmount().toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Donor:</span>
              <span className="font-medium">
                {watchedAnonymous ? "Anonymous" : `${watch("firstName")} ${watch("lastName")}`}
              </span>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <FlutterWaveButton
          {...config}
          className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isProcessing || getFinalAmount() < 100}
        >
          {isProcessing ? "Processing..." : `Donate ₦${getFinalAmount().toLocaleString()}`}
        </FlutterWaveButton>

        <p className="text-xs text-gray-500 text-center">
          Your payment is secure and encrypted. You will receive a confirmation email after successful payment.
        </p>
      </form>
    </div>
  );
}
