// Simple test to verify theme toggle functionality
console.log('Testing theme toggle functionality...');

// Check if dark mode class is applied
const isDarkMode = document.documentElement.classList.contains('dark');
console.log('Initial dark mode status:', isDarkMode);

// Test theme toggle
const toggleButton = document.querySelector('[aria-label*="Switch"]');
if (toggleButton) {
  console.log('Found theme toggle button');
  // Simulate click
  toggleButton.click();
  console.log('Clicked theme toggle button');
  
  // Check if theme changed
  setTimeout(() => {
    const newDarkModeStatus = document.documentElement.classList.contains('dark');
    console.log('New dark mode status:', newDarkModeStatus);
    console.log('Theme toggle test completed');
  }, 100);
} else {
  console.log('Theme toggle button not found');
}