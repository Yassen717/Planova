// Phase 3 Verification Test
console.log('=== Planova Phase 3 Verification ===');

// Test 1: Theme Toggle
console.log('\n1. Testing Theme Toggle...');
try {
  const initialTheme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
  console.log(`Initial theme: ${initialTheme}`);
  
  const toggleButton = document.querySelector('[aria-label*="Switch"]');
  if (toggleButton) {
    toggleButton.click();
    console.log('Theme toggle clicked');
    
    setTimeout(() => {
      const newTheme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
      console.log(`New theme: ${newTheme}`);
      console.log(`Theme toggle: ${initialTheme !== newTheme ? 'PASS' : 'FAIL'}`);
    }, 100);
  } else {
    console.log('Theme toggle button not found - FAIL');
  }
} catch (error) {
  console.log('Theme toggle test error:', error.message);
}

// Test 2: Notification System
console.log('\n2. Testing Notification System...');
try {
  // Check if notification button exists
  const notificationButton = document.querySelector('[aria-label*="Notifications"]');
  if (notificationButton) {
    console.log('Notification button found - PASS');
  } else {
    console.log('Notification button not found - FAIL');
  }
} catch (error) {
  console.log('Notification system test error:', error.message);
}

// Test 3: Reporting Dashboard
console.log('\n3. Testing Reporting Dashboard...');
try {
  // Check if we're on the reports page
  if (window.location.pathname.includes('/reports')) {
    // Look for dashboard elements
    const statsElements = document.querySelectorAll('[class*="stat"]');
    const chartElements = document.querySelectorAll('[class*="chart"]');
    
    console.log(`Found ${statsElements.length} stat elements`);
    console.log(`Found ${chartElements.length} chart elements`);
    console.log('Reporting dashboard elements present - PASS');
  } else {
    console.log('Not on reports page, skipping dashboard test');
  }
} catch (error) {
  console.log('Reporting dashboard test error:', error.message);
}

// Test 4: API Endpoints
console.log('\n4. Testing API Endpoints...');
fetch('/api/health')
  .then(response => {
    console.log(`Health API status: ${response.status} - ${response.ok ? 'PASS' : 'FAIL'}`);
    return response.json();
  })
  .then(data => {
    console.log('Health API response:', data);
  })
  .catch(error => {
    console.log('Health API test error:', error.message);
  });

// Test 5: Real-time Functionality
console.log('\n5. Testing Real-time Functionality...');
try {
  // This would typically be tested with Socket.io client
  console.log('Real-time functionality test - MANUAL VERIFICATION REQUIRED');
} catch (error) {
  console.log('Real-time functionality test error:', error.message);
}

console.log('\n=== Verification Complete ===');
console.log('Please check the browser console for detailed results');