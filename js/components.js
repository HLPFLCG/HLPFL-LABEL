document.addEventListener('DOMContentLoaded', function() {
  // Load components
  loadComponent('header-container', 'components/header.html');
  loadComponent('footer-container', 'components/footer.html');
  
  // Set current year in footer
  document.getElementById('year').textContent = new Date().getFullYear();
  
  // Handle loading screen
  const loadingScreen = document.getElementById('loading-screen');
  if (loadingScreen) {
    window.addEventListener('load', function() {
      setTimeout(function() {
        loadingScreen.classList.add('hidden');
      }, 500);
    });
  }
});

function loadComponent(targetId, componentPath) {
  const target = document.getElementById(targetId);
  if (!target) return;
  
  fetch(componentPath)
    .then(response => response.text())
    .then(html => {
      target.innerHTML = html;
      // Trigger any scripts that need to run after component loads
      const event = new Event('componentLoaded');
      document.dispatchEvent(event);
    })
    .catch(error => console.error('Error loading component:', error));
}
