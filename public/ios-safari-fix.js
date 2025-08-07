// iOS Safari viewport height fix
function setIOSViewportHeight() {
  // Calculate the actual viewport height
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
}

// Call on load
setIOSViewportHeight();

// Call on resize
window.addEventListener('resize', setIOSViewportHeight);

// Call on orientation change for mobile devices
window.addEventListener('orientationchange', () => {
  setTimeout(setIOSViewportHeight, 100);
});

// iOS Safari specific fixes
if (navigator.userAgent.includes('Safari') && navigator.userAgent.includes('iPhone')) {
  // Prevent zoom on input focus
  const inputs = document.querySelectorAll('input[type="text"], input[type="number"], input[type="email"], input[type="password"], select, textarea');
  inputs.forEach(input => {
    input.style.fontSize = '16px';
  });

  // Handle viewport changes when Safari UI appears/disappears
  const handleViewportChange = () => {
    const currentVh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${currentVh}px`);
  };

  // Listen for viewport changes
  let timeout;
  window.addEventListener('resize', () => {
    clearTimeout(timeout);
    timeout = setTimeout(handleViewportChange, 100);
  });

  // Handle scroll to hide/show Safari UI
  let lastScrollY = window.scrollY;
  window.addEventListener('scroll', () => {
    if (Math.abs(window.scrollY - lastScrollY) > 50) {
      handleViewportChange();
      lastScrollY = window.scrollY;
    }
  });
}
