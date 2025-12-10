/**
 * Enhanced Analytics Tracking for HLPFL
 * Tracks key user interactions and events
 */

(function() {
    'use strict';

    // Check if GTM is loaded
    function isGTMLoaded() {
        return typeof window.dataLayer !== 'undefined';
    }

    // Generic event tracking function
    function trackEvent(eventName, eventData) {
        if (isGTMLoaded()) {
            window.dataLayer.push({
                'event': eventName,
                ...eventData
            });
            console.log('Event tracked:', eventName, eventData);
        }
    }

    // Track button clicks
    function trackButtonClicks() {
        document.querySelectorAll('.btn').forEach(function(button) {
            button.addEventListener('click', function(e) {
                const buttonText = this.textContent.trim();
                const buttonHref = this.getAttribute('href') || '';
                const buttonClass = this.className;

                trackEvent('button_click', {
                    'button_text': buttonText,
                    'button_url': buttonHref,
                    'button_class': buttonClass,
                    'button_location': getElementLocation(this)
                });
            });
        });
    }

    // Track form submissions
    function trackFormSubmissions() {
        document.querySelectorAll('form').forEach(function(form) {
            form.addEventListener('submit', function(e) {
                const formId = this.id || 'unnamed_form';
                const formAction = this.action || '';

                trackEvent('form_submission', {
                    'form_id': formId,
                    'form_action': formAction,
                    'form_location': getElementLocation(this)
                });
            });
        });
    }

    // Track popup interactions
    function trackPopupInteractions() {
        // Red Flag Popup Open
        const redFlagButtons = document.querySelectorAll('[onclick*="openRedFlagPopup"]');
        redFlagButtons.forEach(function(button) {
            button.addEventListener('click', function() {
                trackEvent('popup_open', {
                    'popup_name': 'red_flag_guide',
                    'trigger_location': getElementLocation(this)
                });
            });
        });

        // Red Flag Popup Close
        const closeButton = document.querySelector('.popup-close');
        if (closeButton) {
            closeButton.addEventListener('click', function() {
                trackEvent('popup_close', {
                    'popup_name': 'red_flag_guide',
                    'close_method': 'button'
                });
            });
        }

        // Red Flag Form Submit
        const popupForm = document.querySelector('.popup-form');
        if (popupForm) {
            popupForm.addEventListener('submit', function(e) {
                trackEvent('lead_generation', {
                    'lead_source': 'red_flag_guide_popup',
                    'form_type': 'email_capture'
                });
            });
        }
    }

    // Track navigation clicks
    function trackNavigationClicks() {
        document.querySelectorAll('.nav__list a').forEach(function(link) {
            link.addEventListener('click', function(e) {
                const linkText = this.textContent.trim();
                const linkHref = this.getAttribute('href') || '';

                trackEvent('navigation_click', {
                    'link_text': linkText,
                    'link_url': linkHref,
                    'link_type': 'main_navigation'
                });
            });
        });
    }

    // Track footer link clicks
    function trackFooterClicks() {
        document.querySelectorAll('.footer a').forEach(function(link) {
            link.addEventListener('click', function(e) {
                const linkText = this.textContent.trim();
                const linkHref = this.getAttribute('href') || '';

                trackEvent('footer_click', {
                    'link_text': linkText,
                    'link_url': linkHref
                });
            });
        });
    }

    // Track social media clicks
    function trackSocialClicks() {
        document.querySelectorAll('.footer-social a').forEach(function(link) {
            link.addEventListener('click', function(e) {
                const platform = getSocialPlatform(this.getAttribute('href'));

                trackEvent('social_click', {
                    'social_platform': platform,
                    'link_location': 'footer'
                });
            });
        });
    }

    // Track scroll depth
    function trackScrollDepth() {
        let scrollDepths = [25, 50, 75, 100];
        let trackedDepths = [];

        window.addEventListener('scroll', function() {
            const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;

            scrollDepths.forEach(function(depth) {
                if (scrollPercent >= depth && !trackedDepths.includes(depth)) {
                    trackedDepths.push(depth);
                    trackEvent('scroll_depth', {
                        'scroll_percentage': depth,
                        'page_url': window.location.pathname
                    });
                }
            });
        });
    }

    // Track time on page
    function trackTimeOnPage() {
        let startTime = Date.now();
        let timeIntervals = [30, 60, 120, 300]; // seconds
        let trackedIntervals = [];

        setInterval(function() {
            const timeOnPage = Math.floor((Date.now() - startTime) / 1000);

            timeIntervals.forEach(function(interval) {
                if (timeOnPage >= interval && !trackedIntervals.includes(interval)) {
                    trackedIntervals.push(interval);
                    trackEvent('time_on_page', {
                        'time_seconds': interval,
                        'page_url': window.location.pathname
                    });
                }
            });
        }, 5000); // Check every 5 seconds
    }

    // Track external link clicks
    function trackExternalLinks() {
        document.querySelectorAll('a[target="_blank"]').forEach(function(link) {
            link.addEventListener('click', function(e) {
                const linkHref = this.getAttribute('href') || '';
                const linkText = this.textContent.trim();

                trackEvent('external_link_click', {
                    'link_url': linkHref,
                    'link_text': linkText,
                    'link_location': getElementLocation(this)
                });
            });
        });
    }

    // Track service card interactions
    function trackServiceCardClicks() {
        document.querySelectorAll('.service-card').forEach(function(card) {
            card.addEventListener('click', function(e) {
                const serviceName = this.querySelector('h3')?.textContent.trim() || 'Unknown Service';

                trackEvent('service_card_click', {
                    'service_name': serviceName,
                    'card_location': getElementLocation(this)
                });
            });
        });
    }

    // Helper function to get element location on page
    function getElementLocation(element) {
        const sections = ['hero', 'services', 'about', 'contact', 'footer'];
        let location = 'unknown';

        sections.forEach(function(section) {
            const sectionElement = document.querySelector('.' + section + '-section, .' + section);
            if (sectionElement && sectionElement.contains(element)) {
                location = section;
            }
        });

        return location;
    }

    // Helper function to identify social platform
    function getSocialPlatform(url) {
        if (!url) return 'unknown';
        if (url.includes('linkedin')) return 'linkedin';
        if (url.includes('twitter')) return 'twitter';
        if (url.includes('instagram')) return 'instagram';
        if (url.includes('youtube')) return 'youtube';
        if (url.includes('facebook')) return 'facebook';
        return 'other';
    }

    // Track page view
    function trackPageView() {
        trackEvent('page_view', {
            'page_url': window.location.pathname,
            'page_title': document.title,
            'referrer': document.referrer
        });
    }

    // Initialize all tracking
    function initAnalytics() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', function() {
                setupTracking();
            });
        } else {
            setupTracking();
        }
    }

    function setupTracking() {
        // Track initial page view
        trackPageView();

        // Setup all event tracking
        trackButtonClicks();
        trackFormSubmissions();
        trackPopupInteractions();
        trackNavigationClicks();
        trackFooterClicks();
        trackSocialClicks();
        trackScrollDepth();
        trackTimeOnPage();
        trackExternalLinks();
        trackServiceCardClicks();

        console.log('HLPFL Analytics tracking initialized');
    }

    // Initialize when script loads
    initAnalytics();

})();