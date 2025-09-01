/**
 * Test file for Phone Login API
 * This file demonstrates how to test the phone login functionality
 * 
 * Usage: Run this file with Node.js to test the endpoints
 */

const testPhoneLogin = async () => {
  const baseUrl = 'http://localhost:1337';
  
  console.log('🧪 Testing Phone Login API...\n');

  // Test 1: Phone Login with valid credentials
  console.log('1️⃣ Testing Phone Login...');
  try {
    const loginResponse = await fetch(`${baseUrl}/api/phone-login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        phone: '+1234567890',
        password: 'testpassword'
      })
    });

    const loginData = await loginResponse.json();
    console.log('Status:', loginResponse.status);
    console.log('Response:', JSON.stringify(loginData, null, 2));
  } catch (error) {
    console.error('❌ Login test failed:', error.message);
  }

  console.log('\n2️⃣ Testing Phone Existence Check...');
  try {
    const checkResponse = await fetch(`${baseUrl}/api/phone-login/check/+1234567890`);
    const checkData = await checkResponse.json();
    console.log('Status:', checkResponse.status);
    console.log('Response:', JSON.stringify(checkData, null, 2));
  } catch (error) {
    console.error('❌ Phone check test failed:', error.message);
  }

  console.log('\n3️⃣ Testing Invalid Phone Format...');
  try {
    const invalidResponse = await fetch(`${baseUrl}/api/phone-login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        phone: 'invalid-phone',
        password: 'testpassword'
      })
    });

    const invalidData = await invalidResponse.json();
    console.log('Status:', invalidResponse.status);
    console.log('Response:', JSON.stringify(invalidData, null, 2));
  } catch (error) {
    console.error('❌ Invalid phone test failed:', error.message);
  }

  console.log('\n✅ Phone Login API tests completed!');
};

// Run tests if this file is executed directly
if (require.main === module) {
  testPhoneLogin().catch(console.error);
}

module.exports = { testPhoneLogin };
