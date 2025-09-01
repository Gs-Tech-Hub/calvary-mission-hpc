# Phone Login API

This API provides an alternative login route using phone numbers instead of email/username.

## Endpoints

### 1. Phone Login
**POST** `/api/phone-login`

Authenticate a user using their phone number and password.

#### Request Body
```json
{
  "phone": "+1234567890",
  "password": "userpassword"
}
```

#### Response
```json
{
  "success": true,
  "message": "Login successful",
  "jwt": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "johndoe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "confirmed": true,
    "blocked": false,
    "role": {
      "id": 1,
      "name": "authenticated",
      "description": "Default role given to authenticated user."
    }
  }
}
```

### 2. Phone Existence Check
**GET** `/api/phone-login/check/:phone`

Check if a phone number exists in the system (useful for validation).

#### Response
```json
{
  "exists": true,
  "phone": "+1234567890"
}
```

## Features

- **Phone Format Validation**: Ensures phone numbers follow international format (+1234567890)
- **Password Validation**: Uses Strapi's built-in password validation
- **User Status Checks**: Verifies user is confirmed and not blocked
- **JWT Generation**: Returns a valid JWT token for authenticated requests
- **Data Sanitization**: Removes sensitive information from user data
- **Error Handling**: Comprehensive error messages for different scenarios

## Security

- Endpoint is public (no authentication required)
- Password validation uses Strapi's secure hashing
- JWT tokens are properly issued with user ID
- Input validation prevents common attack vectors

## Integration

This API integrates with the existing Strapi users-permissions system:
- Uses the same user database
- Follows the same authentication patterns
- Compatible with existing JWT middleware
- Works alongside email/username login

## Usage Examples

### Frontend Integration
```javascript
// Login with phone
const response = await fetch('/api/phone-login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    phone: '+1234567890',
    password: 'userpassword'
  })
});

const data = await response.json();
if (data.success) {
  // Store JWT token
  localStorage.setItem('jwt', data.jwt);
  // Redirect to dashboard
  window.location.href = '/dashboard';
}
```

### Check Phone Existence
```javascript
const response = await fetch('/api/phone-login/check/+1234567890');
const data = await response.json();
console.log('Phone exists:', data.exists);
```

## Error Handling

The API returns appropriate HTTP status codes and error messages:

- **400 Bad Request**: Invalid input (missing fields, invalid phone format)
- **401 Unauthorized**: Invalid credentials
- **403 Forbidden**: Account blocked or not confirmed
- **500 Internal Server Error**: Server-side errors

## Configuration

The phone login system is configured through:
- `src/api/phone-login/services/phone-login.ts` - Core authentication logic
- `src/api/phone-login/controllers/phone-login.ts` - Request handling
- `src/api/phone-login/routes/phone-login.ts` - Route definitions
- `src/components/shared/` - Data structure definitions
