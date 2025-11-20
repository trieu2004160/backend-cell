const axios = require('axios');

const API_URL = 'http://localhost:3000/api';

async function testRegister() {
  try {
    console.log('📝 Testing Register...');
    const response = await axios.post(`${API_URL}/auth/register`, {
      full_name: "Test User",
      phone: "0987654321",
      email: "testuser@gmail.com",
      password_hash: "123456",
      date_of_birth: "1990-01-01"
    });
    console.log('✅ Register Success:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Register Error:', error.response?.data || error.message);
    return null;
  }
}

async function testLogin() {
  try {
    console.log('\n🔐 Testing Login...');
    const response = await axios.post(`${API_URL}/auth/login`, {
      phone: "0987654321",
      password_login: "123456"
    });
    console.log('✅ Login Success:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Login Error:', error.response?.data || error.message);
    return null;
  }
}

async function testServerHealth() {
  try {
    console.log('🏥 Testing Server Health...');
    const response = await axios.get('http://localhost:3000/test');
    console.log('✅ Server is running:', response.data);
    return true;
  } catch (error) {
    console.error('❌ Server is not running:', error.message);
    return false;
  }
}

async function runTests() {
  console.log('🧪 Starting Auth API Tests...\n');
  console.log('=' .repeat(50));
  
  // Test 1: Server Health
  const serverRunning = await testServerHealth();
  if (!serverRunning) {
    console.log('\n⚠️  Please start the backend server first:');
    console.log('   cd backend_cellphones');
    console.log('   npm run dev');
    return;
  }
  
  console.log('\n' + '='.repeat(50));
  
  // Test 2: Register
  const registerResult = await testRegister();
  
  console.log('\n' + '='.repeat(50));
  
  // Test 3: Login
  const loginResult = await testLogin();
  
  console.log('\n' + '='.repeat(50));
  console.log('\n📊 Test Summary:');
  console.log('  Server Health:', serverRunning ? '✅' : '❌');
  console.log('  Register:', registerResult ? '✅' : '❌');
  console.log('  Login:', loginResult ? '✅' : '❌');
  console.log('\n' + '='.repeat(50));
}

runTests();
