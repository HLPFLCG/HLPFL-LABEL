// Intersection Observer for scroll animations
document.addEventListener('DOMContentLoaded', function() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('scroll-reveal');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe all cards and sections
  const elementsToAnimate = document.querySelectorAll(
    '.team-card, .service-card, .timeline-item, .value-card, .stat-item'
  );

  elementsToAnimate.forEach(el => {
    observer.observe(el);
  });

  // Counter animation for stats
  const statNumbers = document.querySelectorAll('.stat-number');
  statNumbers.forEach(stat => {
    const target = stat.textContent;
    const isNumber = /^\d+/.test(target);
    
    if (isNumber) {
      const finalNumber = parseInt(target);
      let current = 0;
      const increment = finalNumber / 50;
      const timer = setInterval(() => {
        current += increment;
        if (current >= finalNumber) {
          stat.textContent = target;
          clearInterval(timer);
        } else {
          stat.textContent = Math.floor(current) + target.replace(/^\d+/, '');
        }
      }, 30);
    }
  });
});
