// Main JavaScript file for HLPFL Records Investor Website

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    initializeNavigation();
    initializeScrollEffects();
    initializeAnimations();
    initializeChart();
    initializeParticles();
    initializeFormHandling();
    initializeDownloadFunctions();
}

// Navigation functionality
function initializeNavigation() {
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    // Scroll effect for navbar
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // Mobile navigation toggle
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!navbar.contains(e.target)) {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    }
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offset = 80; // Account for fixed navbar
                const targetPosition = target.offsetTop - offset;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    });
}

// Scroll effects
function initializeScrollEffects() {
    // Parallax effect for hero section
    const heroBackground = document.querySelector('.hero-background');
    if (heroBackground) {
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const parallax = scrolled * 0.5;
            heroBackground.style.transform = `translateY(${parallax}px)`;
        });
    }
    
    // Reveal animations on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal');
            }
        });
    }, observerOptions);
    
    // Observe elements for scroll animations
    document.querySelectorAll('.feature-card, .team-member, .tier-card, .metric-card').forEach(el => {
        observer.observe(el);
    });
}

// Initialize AOS (Animate On Scroll)
function initializeAnimations() {
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 1000,
            once: true,
            offset: 100,
            easing: 'ease-out-cubic'
        });
    }
}

// Initialize Chart.js for financial projections
function initializeChart() {
    const ctx = document.getElementById('revenueChart');
    if (ctx && typeof Chart !== 'undefined') {
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5'],
                datasets: [{
                    label: 'Revenue Projection',
                    data: [2.5, 8, 18, 32, 50],
                    borderColor: 'rgb(102, 126, 234)',
                    backgroundColor: 'rgba(102, 126, 234, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: 'rgb(102, 126, 234)',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointRadius: 6,
                    pointHoverRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleFont: {
                            size: 14,
                            weight: 'bold'
                        },
                        bodyFont: {
                            size: 12
                        },
                        padding: 12,
                        displayColors: false,
                        callbacks: {
                            label: function(context) {
                                return '$' + context.parsed.y + 'M Revenue';
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)'
                        },
                        ticks: {
                            callback: function(value) {
                                return '$' + value + 'M';
                            },
                            font: {
                                size: 12
                            }
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            font: {
                                size: 12
                            }
                        }
                    }
                }
            }
        });
    }
}

// Initialize particle animation
function initializeParticles() {
    const particlesContainer = document.getElementById('particles');
    if (particlesContainer) {
        const particleCount = 50;
        
        for (let i = 0; i < particleCount; i++) {
            createParticle(particlesContainer, i);
        }
    }
}

function createParticle(container, index) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    // Random position and animation properties
    const startX = Math.random() * 100;
    const startY = Math.random() * 100;
    const duration = 8 + Math.random() * 12;
    const delay = Math.random() * 5;
    const size = 2 + Math.random() * 4;
    
    particle.style.left = startX + '%';
    particle.style.top = startY + '%';
    particle.style.width = size + 'px';
    particle.style.height = size + 'px';
    particle.style.animationDelay = delay + 's';
    particle.style.animationDuration = duration + 's';
    
    container.appendChild(particle);
}

// Form handling
function initializeFormHandling() {
    const form = document.querySelector('.investment-form');
    if (form) {
        form.addEventListener('submit', handleInvestmentSubmit);
    }
}

function handleInvestmentSubmit(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    const submitButton = form.querySelector('button[type="submit"]');
    
    // Disable submit button and show loading state
    submitButton.disabled = true;
    submitButton.innerHTML = `
        <span>Sending...</span>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style="animation: spin 1s linear infinite;">
            <circle cx="10" cy="10" r="8" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-dasharray="50 50"/>
        </svg>
    `;
    
    // Simulate form submission (replace with actual API call)
    setTimeout(() => {
        // Success state
        submitButton.innerHTML = `
            <span>Message Sent!</span>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M16.6667 5L7.50001 14.1667L3.33334 10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        `;
        submitButton.style.background = 'linear-gradient(135deg, #22c55e, #16a34a)';
        
        // Reset form
        form.reset();
        
        // Show success message
        showNotification('Your investment inquiry has been sent successfully!', 'success');
        
        // Reset button after 3 seconds
        setTimeout(() => {
            submitButton.disabled = false;
            submitButton.innerHTML = `
                <span>Submit Investment Inquiry</span>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M11 5L17 11M17 11L11 17M17 11H3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            `;
            submitButton.style.background = '';
        }, 3000);
    }, 2000);
}

// Download functions
function initializeDownloadFunctions() {
    // These functions would typically download actual files
    // For demo purposes, they'll show notifications
}

function downloadPitchDeck() {
    showNotification('Pitch deck download starting...', 'info');
    // In a real implementation, this would trigger a file download
    setTimeout(() => {
        showNotification('Pitch deck downloaded successfully!', 'success');
    }, 1500);
}

function downloadBusinessPlan() {
    showNotification('Business plan download starting...', 'info');
    setTimeout(() => {
        showNotification('Business plan downloaded successfully!', 'success');
    }, 1500);
}

function downloadFinancials() {
    showNotification('Financial model download starting...', 'info');
    setTimeout(() => {
        showNotification('Financial model downloaded successfully!', 'success');
    }, 1500);
}

// Utility functions
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        const offset = 80; // Account for fixed navbar
        const targetPosition = section.offsetTop - offset;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
        </div>
    `;
    
    // Add styles if not already present
    if (!document.querySelector('#notification-styles')) {
        const styles = document.createElement('style');
        styles.id = 'notification-styles';
        styles.textContent = `
            .notification {
                position: fixed;
                top: 100px;
                right: 20px;
                z-index: 9999;
                max-width: 400px;
                background: white;
                border-radius: 12px;
                box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
                border-left: 4px solid;
                animation: slideInRight 0.3s ease-out;
                font-family: -apple-system, BlinkMacSystemFont, sans-serif;
            }
            
            .notification-success {
                border-left-color: #22c55e;
            }
            
            .notification-info {
                border-left-color: #667eea;
            }
            
            .notification-error {
                border-left-color: #ef4444;
            }
            
            .notification-content {
                padding: 16px 20px;
                display: flex;
                align-items: center;
                justify-content: space-between;
            }
            
            .notification-message {
                color: #374151;
                font-size: 14px;
                line-height: 1.5;
            }
            
            .notification-close {
                background: none;
                border: none;
                font-size: 20px;
                color: #9ca3af;
                cursor: pointer;
                padding: 0;
                margin-left: 12px;
                line-height: 1;
            }
            
            .notification-close:hover {
                color: #6b7280;
            }
            
            @keyframes slideInRight {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(styles);
    }
    
    // Add to page
    document.body.appendChild(notification);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// Performance optimization
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Optimize scroll performance
const optimizedScroll = debounce(function() {
    // Scroll-based optimizations here
}, 16); // ~60fps

window.addEventListener('scroll', optimizedScroll);

// Keyboard navigation
document.addEventListener('keydown', function(e) {
    // ESC to close mobile menu
    if (e.key === 'Escape') {
        const navToggle = document.getElementById('nav-toggle');
        const navMenu = document.getElementById('nav-menu');
        if (navToggle && navMenu) {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
        }
    }
    
    // Arrow keys for navigation (if implemented)
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        // Add keyboard navigation logic here
    }
});

// Touch/swipe support for mobile
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', function(e) {
    touchStartX = e.changedTouches[0].screenX;
});

document.addEventListener('touchend', function(e) {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
});

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) > swipeThreshold) {
        // Add swipe navigation logic here
        if (diff > 0) {
            // Swipe left - next section
        } else {
            // Swipe right - previous section
        }
    }
}

// Analytics and tracking (placeholder)
function trackEvent(action, category = 'general') {
    // In a real implementation, this would send data to analytics service
    console.log(`Event tracked: ${category} - ${action}`);
}

// Track important interactions
document.addEventListener('click', function(e) {
    if (e.target.matches('.nav-cta, .btn-primary, .btn-secondary')) {
        trackEvent('button_click', 'engagement');
    }
    
    if (e.target.matches('.nav-link')) {
        trackEvent('navigation_click', 'navigation');
    }
});

// Page visibility API for performance optimization
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        // Page is hidden, pause animations
        document.body.classList.add('page-hidden');
    } else {
        // Page is visible, resume animations
        document.body.classList.remove('page-hidden');
    }
});

// Error handling
window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
    // In production, you might want to send this to an error tracking service
});

// Console message for developers
console.log('%c🚀 HLPFL Records Investor Website', 'font-size: 20px; font-weight: bold; color: #667eea;');
console.log('%cBuilt with passion for the music industry revolution 🎵', 'font-size: 14px; color: #a855f7;');