// Main Application Entry Point
// HLPFL Records - Modern JavaScript Application

// Import core modules
import './js/app.js';
import './js/components/ArtistManager.js';
import './js/components/ServicesManager.js';
import './js/components/PartnershipManager.js';
import './js/utils/AnimationUtils.js';
import './js/utils/FormUtils.js';

// Application Configuration
const config = {
    apiBaseUrl: window.location.origin,
    stripePublicKey: 'pk_test_51234567890abcdefghijklmnopqrstuvwxyz', // Replace with actual key
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0'
};

// Initialize application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('🎵 HLPFL Records Application v' + config.version + ' initializing...');
    
    // Set global configuration
    window.HLPFLConfig = config;
    
    // Initialize service workers for PWA capabilities
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('✅ Service Worker registered:', registration);
            })
            .catch(error => {
                console.log('❌ Service Worker registration failed:', error);
            });
    }
    
    // Initialize analytics
    initializeAnalytics();
    
    // Initialize error tracking
    initializeErrorTracking();
    
    console.log('🚀 HLPFL Records Application ready!');
});

// Analytics initialization
function initializeAnalytics() {
    // Google Analytics 4
    gtag('config', 'GA_MEASUREMENT_ID', {
        page_location: window.location.href,
        page_title: document.title
    });
    
    // Custom event tracking
    window.trackEvent = (eventName, parameters = {}) => {
        gtag('event', eventName, {
            ...parameters,
            custom_parameter_1: 'HLPFL Records'
        });
    };
}

// Error tracking
function initializeErrorTracking() {
    window.addEventListener('error', (event) => {
        console.error('Application Error:', event.error);
        trackEvent('app_error', {
            error_message: event.error?.message,
            error_stack: event.error?.stack,
            page_location: window.location.href
        });
    });
    
    window.addEventListener('unhandledrejection', (event) => {
        console.error('Unhandled Promise Rejection:', event.reason);
        trackEvent('promise_rejection', {
            reason: event.reason?.toString(),
            page_location: window.location.href
        });
    });
}

// Performance monitoring
window.addEventListener('load', () => {
    if ('performance' in window) {
        const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
        console.log(`⚡ Page load time: ${loadTime}ms`);
        
        trackEvent('page_load_complete', {
            load_time: loadTime,
            page_path: window.location.pathname
        });
    }
});

// Export for module usage
export { config };