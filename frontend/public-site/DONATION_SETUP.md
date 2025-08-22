# Flutterwave Donation System Setup Guide

This guide will help you set up the Flutterwave payment integration for your church's donation system.

## Prerequisites

1. **Flutterwave Account**: You need a Flutterwave merchant account
2. **Strapi Backend**: Your Strapi instance should be running and accessible
3. **Environment Variables**: Configure the necessary environment variables

## Environment Variables

Create or update your `.env.local` file with the following variables:

```bash
# Strapi Configuration
STRAPI_URL=http://localhost:1337
STRAPI_API_TOKEN=your_strapi_api_token

# Flutterwave Configuration
NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY=FLWPUBK_TEST-xxxxxxxxxxxxxxxxxxxxx-X
NEXT_PUBLIC_FLUTTERWAVE_ENV=test  # Use 'live' for production
```

## Flutterwave Setup

### 1. Get Your API Keys

1. Log in to your [Flutterwave Dashboard](https://dashboard.flutterwave.com/)
2. Navigate to Settings > API Keys
3. Copy your Public Key (starts with `FLWPUBK_`)
4. For production, use the Live keys instead of Test keys

### 2. Configure Webhook (Optional but Recommended)

1. In your Flutterwave Dashboard, go to Settings > Webhooks
2. Add a webhook URL: `https://yourdomain.com/api/flutterwave/webhook`
3. Select events: `charge.completed`, `charge.failed`
4. Save the webhook configuration

## Strapi Backend Setup

### 1. Create Donation Content Type

In your Strapi admin panel, create a new content type called "Donation" with the following fields:

```json
{
  "firstName": "Text (Short text)",
  "lastName": "Text (Short text)",
  "email": "Email",
  "phone": "Text (Short text)",
  "amount": "Number (Decimal)",
  "donationType": "Enumeration",
  "message": "Text (Long text)",
  "anonymous": "Boolean",
  "status": "Enumeration",
  "transactionId": "Text (Short text)",
  "flutterwaveRef": "Text (Short text)",
  "paymentCompletedAt": "DateTime",
  "createdAt": "DateTime",
  "updatedAt": "DateTime"
}
```

### 2. Configure Enumeration Values

**Donation Type:**
- tithe
- offering
- building-fund
- missions
- benevolence
- other

**Status:**
- pending
- completed
- failed
- cancelled

### 3. Set Permissions

1. Go to Settings > Users & Permissions Plugin > Roles
2. Select "Public" role
3. Enable the following permissions for "Donation":
   - create
   - read (if you want public access to donation history)

## Frontend Configuration

### 1. Update Company Information

Edit `src/lib/flutterwave-config.ts` and update:

```typescript
export const flutterwaveConfig = {
  // Replace with your actual Flutterwave public key
  publicKey: process.env.NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY || 'FLWPUBK_TEST-xxxxxxxxxxxxxxxxxxxxx-X',
  
  // Company details
  company: {
    name: 'Your Church Name', // Update this
    logo: 'https://your-logo-url.com/logo.png', // Update with your logo URL
    description: 'Your church description'
  },
  
  // Update contact information in failure page
  // src/app/giving/failure/page.tsx
};
```

### 2. Customize Donation Types

Edit `src/components/DonationForm.tsx` to modify:

- Donation type descriptions
- Suggested amounts for each type
- Form validation rules
- UI styling

## Testing

### 1. Test Mode

1. Use Flutterwave test cards for development
2. Test card numbers:
   - Visa: 4000 0000 0000 0002
   - Mastercard: 5200 8300 0000 0008
   - Expiry: Any future date
   - CVV: Any 3 digits
   - PIN: Any 4 digits

### 2. Test Scenarios

- Successful payment
- Failed payment
- Cancelled payment
- Form validation
- Anonymous donations
- Custom amounts

## Production Deployment

### 1. Environment Variables

```bash
NEXT_PUBLIC_FLUTTERWAVE_ENV=live
NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY=FLWPUBK_LIVE-xxxxxxxxxxxxxxxxxxxxx-X
```

### 2. SSL Certificate

Ensure your domain has a valid SSL certificate (HTTPS)

### 3. Webhook Security

Implement webhook signature verification for production

## Features

### ✅ Implemented

- Multiple donation types (Tithe, Offering, Building Fund, Missions, Benevolence, Other)
- Custom amount input
- Form validation
- Anonymous donation option
- Flutterwave payment integration
- Strapi backend integration
- Success/Failure pages
- Responsive design
- Transaction tracking

### 🔄 Future Enhancements

- Recurring donations
- Donation goals/progress bars
- Donor dashboard
- Email receipts
- SMS notifications
- Analytics dashboard
- Multi-currency support

## Troubleshooting

### Common Issues

1. **Payment not processing**: Check Flutterwave public key and environment
2. **Strapi connection error**: Verify STRAPI_URL and API token
3. **Form validation errors**: Check required fields and email format
4. **Payment modal not opening**: Ensure Flutterwave script is loaded

### Debug Mode

Enable console logging by checking browser developer tools for:
- API request/response logs
- Flutterwave callback logs
- Form validation errors

## Support

For technical support:
- Check Flutterwave documentation: [https://docs.flutterwave.com/](https://docs.flutterwave.com/)
- Review Strapi documentation: [https://docs.strapi.io/](https://docs.strapi.io/)
- Check browser console for error messages

## Security Notes

- Never expose Flutterwave secret keys in frontend code
- Always validate form data on the backend
- Implement rate limiting for donation endpoints
- Use HTTPS in production
- Regularly update dependencies

---

**Note**: This system is designed for church donations and includes appropriate messaging and styling. Customize the content and branding to match your church's identity.
