// Sticky CTA Bar functionality
(function() {
  'use strict';
  
  // Create sticky CTA HTML
  const stickyCTAHTML = `
    <div class="sticky-cta" id="stickyCTA">
      <div class="sticky-cta-content">
        <div class="sticky-cta-text">
          <h4>Ready to Transform Your Music Business?</h4>
          <p>Book a free consultation and get expert guidance tailored to your goals</p>
        </div>
        <div class="sticky-cta-actions">
          <a href="https://calendly.com/founder-hlpfl/30min" class="btn btn--primary" target="_blank">
            <i class="fas fa-calendar-check"></i> Book Free Call
          </a>
          <a href="contact.html" class="btn btn--secondary">
            <i class="fas fa-envelope"></i> Contact Us
          </a>
        </div>
        <button class="sticky-cta-close" id="stickyCTAClose" aria-label="Close sticky CTA">
          <i class="fas fa-times"></i>
        </button>
      </div>
    </div>
  `;
  
  // Wait for DOM to be ready
  function init() {
    // Don't show on under-construction, vip, or shop pages
    const currentPage = window.location.pathname;
    if (currentPage.includes('under-construction') || 
        currentPage.includes('vip.html') || 
        currentPage.includes('shop.html')) {
      return;
    }
    
    // Insert sticky CTA into body
    document.body.insertAdjacentHTML('beforeend', stickyCTAHTML);
    
    const stickyCTA = document.getElementById('stickyCTA');
    const closeBtn = document.getElementById('stickyCTAClose');
    
    if (!stickyCTA) return;
    
    // Check if user has dismissed the CTA
    const ctaDismissed = sessionStorage.getItem('ctaDismissed');
    
    // Show CTA after scrolling 30% of page or after 5 seconds
    let hasShown = false;
    
    function showCTA() {
      if (hasShown || ctaDismissed) return;
      hasShown = true;
      setTimeout(() => {
        stickyCTA.classList.add('visible');
      }, 100);
    }
    
    // Show after 5 seconds
    setTimeout(showCTA, 5000);
    
    // Show after scrolling 30%
    function checkScroll() {
      if (hasShown || ctaDismissed) return;
      
      const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
      
      if (scrollPercent > 30) {
        showCTA();
        window.removeEventListener('scroll', checkScroll);
      }
    }
    
    window.addEventListener('scroll', checkScroll);
    
    // Close button functionality
    if (closeBtn) {
      closeBtn.addEventListener('click', function() {
        stickyCTA.classList.remove('visible');
        sessionStorage.setItem('ctaDismissed', 'true');
      });
    }
    
    // Track CTA clicks
    const ctaButtons = stickyCTA.querySelectorAll('.btn');
    ctaButtons.forEach(btn => {
      btn.addEventListener('click', function() {
        // Track with GTM if available
        if (window.dataLayer) {
          window.dataLayer.push({
            'event': 'sticky_cta_click',
            'cta_type': this.classList.contains('btn--primary') ? 'book_call' : 'contact'
          });
        }
      });
    });
  }
  
  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();