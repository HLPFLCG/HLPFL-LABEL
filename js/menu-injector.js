/**
 * Menu Injector Script
 * This script injects the navigation menu into all pages
 */

document.addEventListener('DOMContentLoaded', function() {
    // Determine which page we're on
    const isAboutPage = window.location.pathname.includes('about.html');
    
    // Create the navigation HTML
    const navHTML = `
        <div class="container">
            <a href="/" class="logo">
                <img src="images/updatedimages/headerlogoaugust.svg" alt="HLPFL">
            </a>
            <nav class="nav">
                <ul class="nav__list" id="navList">
                    <li><a href="about.html">About</a></li>
                    <li><a href="services.html">Services</a></li>
                    <li><a href="under-construction.html">Red Flag Guide</a></li>
                    <li><a href="under-construction.html">Shop</a></li>
                    <li><a href="under-construction.html">VIP</a></li>
                    <li><a href="https://calendly.com/founder-hlpfl/30min?month=2025-08" class="btn btn--primary" target="_blank">
                        <i class="fas fa-calendar-alt"></i> Let's Talk
                    </a></li>
                </ul>
                <button class="nav__toggle" id="navToggle" aria-expanded="false" aria-label="Toggle navigation">
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
            </nav>
        </div>
    `;
    
    // Find the header element
    const header = document.querySelector('header.header');
    
    // If header exists, inject the navigation
    if (header) {
        header.innerHTML = navHTML;
        
        // Re-initialize the mobile navigation functionality
        const navToggle = document.getElementById('navToggle');
        const navList = document.getElementById('navList');
        
        if (navToggle && navList) {
            navToggle.addEventListener('click', function() {
                const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
                navToggle.setAttribute('aria-expanded', !isExpanded);
                navList.classList.toggle('active');
            });
            
            // Close mobile nav when clicking on links
            navList.addEventListener('click', function(e) {
                if (e.target.tagName === 'A') {
                    navList.classList.remove('active');
                    navToggle.setAttribute('aria-expanded', 'false');
                }
            });
        }
    }
});