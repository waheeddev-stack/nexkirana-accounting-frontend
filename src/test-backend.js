// Simple test to verify backend connectivity
const testBackend = async () => {
  const backendUrl = 'https://nexkirana-accounting-backend.onrender.com';
  
  console.log('🧪 Testing Backend Connectivity...');
  console.log('Backend URL:', backendUrl);
  
  try {
    // Test root endpoint
    console.log('Testing root endpoint...');
    const rootResponse = await fetch(backendUrl);
    const rootData = await rootResponse.json();
    console.log('✅ Root endpoint working:', rootData);
    
    // Test health endpoint
    console.log('Testing health endpoint...');
    const healthResponse = await fetch(`${backendUrl}/api/health`);
    const healthData = await healthResponse.json();
    console.log('✅ Health endpoint working:', healthData);
    
    // Test auth endpoint (should return 400 for missing credentials)
    console.log('Testing auth endpoint...');
    const authResponse = await fetch(`${backendUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({})
    });
    console.log('Auth endpoint status:', authResponse.status);
    console.log('Auth endpoint response:', await authResponse.text());
    
    return true;
  } catch (error) {
    console.error('❌ Backend test failed:', error);
    return false;
  }
};

// Run test if in browser
if (typeof window !== 'undefined') {
  testBackend();
}

export default testBackend;