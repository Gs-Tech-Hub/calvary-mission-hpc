export const flutterwaveConfig = {
  // Replace with your actual Flutterwave public key
  publicKey: process.env.NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY || 'FLWPUBK_TEST-xxxxxxxxxxxxxxxxxxxxx-X',
  
  // Environment: 'test' for development, 'live' for production
  environment: process.env.NEXT_PUBLIC_FLUTTERWAVE_ENV || 'test',
  
  // Default currency
  currency: 'NGN',
  
  // Payment options
  paymentOptions: 'card,mobilemoney,ussd,banktransfer',
  
  // Company details
  company: {
    name: 'Calvary Mission HPC',
    logo: 'https://your-logo-url.com/logo.png', // Replace with your actual logo URL
    description: 'Supporting ministry and community through generous giving'
  },
  
  // Success and failure URLs
  urls: {
    success: '/giving/success',
    failure: '/giving/failure',
    cancel: '/giving'
  }
};

export const getFlutterwaveConfig = (customData: any) => ({
  ...flutterwaveConfig,
  ...customData
});
