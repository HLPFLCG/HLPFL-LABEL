// HLPFL Records - React-like Application Architecture
// Client-side routing and component management

class HLPFLApp {
    constructor() {
        this.currentPage = null;
        this.routes = {};
        this.components = {};
        this.state = {};
        this.init();
    }

    init() {
        this.setupRouting();
        this.setupNavigation();
        this.handleInitialRoute();
        this.setupGlobalEventListeners();
    }

    setupRouting() {
        this.routes = {
            '': 'home',
            'about': 'about',
            'artists': 'artists',
            'services': 'services',
            'music': 'music',
            'partnerships': 'partnerships',
            'contact': 'contact'
        };
    }

    setupNavigation() {
        // Intercept link clicks for client-side routing
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a');
            if (link && link.hostname === window.location.hostname) {
                const href = link.getAttribute('href');
                if (href && href.startsWith('/') && !href.includes('#')) {
                    e.preventDefault();
                    this.navigate(href);
                }
            }
        });
    }

    handleInitialRoute() {
        const path = window.location.pathname.replace('/', '');
        const route = this.routes[path] || 'home';
        this.loadPage(route);
    }

    navigate(path) {
        const cleanPath = path.replace(/^\//, '');
        const route = this.routes[cleanPath] || 'home';
        
        // Update browser history
        history.pushState({ route }, '', path);
        
        // Load new page
        this.loadPage(route);
    }

    async loadPage(pageName) {
        try {
            // Show loading state
            this.showLoading();

            // Load page content
            const content = await this.fetchPageContent(pageName);
            
            // Update page content
            this.updatePageContent(content, pageName);
            
            // Update navigation active state
            this.updateNavigation(pageName);
            
            // Initialize page-specific functionality
            this.initializePage(pageName);
            
            // Update page title and meta
            this.updatePageMeta(pageName);
            
            this.currentPage = pageName;
            
        } catch (error) {
            console.error('Error loading page:', error);
            this.showError('Failed to load page');
        } finally {
            this.hideLoading();
        }
    }

    async fetchPageContent(pageName) {
        // In a real SPA, this would fetch JSON data or components
        // For now, we'll simulate with static content
        const pageData = {
            home: {
                title: 'HLPFL Records | Independent Record Label',
                content: this.getHomeContent()
            },
            about: {
                title: 'About HLPFL Records',
                content: this.getAboutContent()
            },
            artists: {
                title: 'Our Artists - HLPFL Records',
                content: this.getArtistsContent()
            },
            services: {
                title: 'Services - HLPFL Records',
                content: this.getServicesContent()
            },
            music: {
                title: 'Music - HLPFL Records',
                content: this.getMusicContent()
            },
            partnerships: {
                title: 'Partnerships - HLPFL Records',
                content: this.getPartnershipsContent()
            },
            contact: {
                title: 'Contact - HLPFL Records',
                content: this.getContactContent()
            }
        };

        return pageData[pageName] || pageData.home;
    }

    updatePageContent(pageData, pageName) {
        // Update main content area
        const mainContent = document.querySelector('main') || document.querySelector('.content-section') || document.body;
        
        // Update page title
        document.title = pageData.title;
        
        // Update meta description
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
            metaDescription.content = this.getPageDescription(pageName);
        }

        // In a real SPA, this would render React components
        // For now, we'll just update the current page
        if (this[`${pageName}Content`]) {
            this[`${pageName}Content`]();
        }
    }

    updateNavigation(activePage) {
        const navLinks = document.querySelectorAll('.nav__list a');
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            const cleanHref = href.replace(/^\//, '').replace(/\.html$/, '');
            
            if (cleanHref === activePage || (activePage === 'home' && cleanHref === '')) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    updatePageMeta(pageName) {
        // Update Open Graph tags
        const ogTitle = document.querySelector('meta[property="og:title"]');
        const ogDescription = document.querySelector('meta[property="og:description"]');
        
        if (ogTitle) {
            ogTitle.content = this.getPageTitle(pageName);
        }
        if (ogDescription) {
            ogDescription.content = this.getPageDescription(pageName);
        }
    }

    initializePage(pageName) {
        // Initialize page-specific components
        switch(pageName) {
            case 'artists':
                if (window.artistManager) {
                    artistManager.init();
                }
                break;
            case 'services':
                if (window.servicesManager) {
                    servicesManager.init();
                }
                break;
            // Add other page initializations as needed
        }

        // Scroll to top
        window.scrollTo(0, 0);
        
        // Update header scroll state
        this.updateHeaderScroll();
    }

    getPageTitle(pageName) {
        const titles = {
            home: 'HLPFL Records | Independent Record Label',
            about: 'About HLPFL Records | Independent Record Label',
            artists: 'Our Artists | HLPFL Records',
            services: 'Services | HLPFL Records',
            music: 'Music | HLPFL Records',
            partnerships: 'Partnerships | HLPFL Records',
            contact: 'Contact | HLPFL Records'
        };
        return titles[pageName] || titles.home;
    }

    getPageDescription(pageName) {
        const descriptions = {
            home: 'HLPFL Records is an independent record label helping artists launch successful music careers through artist development, production, and distribution.',
            about: 'Learn about HLPFL Records\' mission to help independent artists launch successful music careers through comprehensive label services.',
            artists: 'Meet the talented artists signed to HLPFL Records. Discover their music, stories, and upcoming releases.',
            services: 'Professional record label services including artist development, music production, distribution, marketing, and A&R services.',
            music: 'Discover the latest music releases from HLPFL Records artists. Stream new singles, albums, and playlists.',
            partnerships: 'Partner with HLPFL Records for strategic collaborations, artist development, distribution deals, and music industry partnerships.',
            contact: 'Submit your music demo to HLPFL Records or contact our A&R team for artist development opportunities.'
        };
        return descriptions[pageName] || descriptions.home;
    }

    showLoading() {
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) {
            loadingScreen.classList.remove('hidden');
        }
    }

    hideLoading() {
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) {
            setTimeout(() => {
                loadingScreen.classList.add('hidden');
            }, 300);
        }
    }

    showError(message) {
        // Create error notification
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-notification';
        errorDiv.innerHTML = `
            <div class="error-content">
                <i class="fas fa-exclamation-triangle"></i>
                <span>${message}</span>
                <button onclick="this.parentElement.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        // Add error styles
        errorDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #dc3545;
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            z-index: 9999;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            animation: slideInRight 0.3s ease;
        `;
        
        document.body.appendChild(errorDiv);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (errorDiv.parentElement) {
                errorDiv.remove();
            }
        }, 5000);
    }

    setupGlobalEventListeners() {
        // Handle browser back/forward buttons
        window.addEventListener('popstate', (e) => {
            const route = e.state?.route || 'home';
            this.loadPage(route);
        });

        // Handle scroll events
        window.addEventListener('scroll', () => {
            this.updateHeaderScroll();
            this.updateScrollProgress();
        });

        // Handle page visibility changes
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                // Page is hidden - pause animations, videos, etc.
                this.pausePageActivity();
            } else {
                // Page is visible - resume activity
                this.resumePageActivity();
            }
        });
    }

    updateHeaderScroll() {
        const header = document.getElementById('header');
        const scrolled = window.pageYOffset;
        
        if (header) {
            if (scrolled > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }
    }

    updateScrollProgress() {
        const scrollProgress = document.getElementById('scrollProgress');
        if (scrollProgress) {
            const winHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrollPercent = (window.pageYOffset / winHeight) * 100;
            scrollProgress.style.width = scrollPercent + '%';
        }
    }

    pausePageActivity() {
        // Pause videos, animations, etc.
        const videos = document.querySelectorAll('video');
        videos.forEach(video => video.pause());
    }

    resumePageActivity() {
        // Resume activity if needed
    }

    // Component-like content methods
    getHomeContent() {
        return 'Home content loaded via JavaScript';
    }

    getAboutContent() {
        return 'About content loaded via JavaScript';
    }

    getArtistsContent() {
        return 'Artists content loaded via JavaScript';
    }

    getServicesContent() {
        return 'Services content loaded via JavaScript';
    }

    getMusicContent() {
        return 'Music content loaded via JavaScript';
    }

    getPartnershipsContent() {
        return 'Partnerships content loaded via JavaScript';
    }

    getContactContent() {
        return 'Contact content loaded via JavaScript';
    }
}

// State Management
class StateManager {
    constructor() {
        this.state = {};
        this.listeners = {};
    }

    setState(key, value) {
        this.state[key] = value;
        this.notifyListeners(key, value);
    }

    getState(key) {
        return this.state[key];
    }

    subscribe(key, callback) {
        if (!this.listeners[key]) {
            this.listeners[key] = [];
        }
        this.listeners[key].push(callback);
    }

    notifyListeners(key, value) {
        if (this.listeners[key]) {
            this.listeners[key].forEach(callback => callback(value));
        }
    }
}

// Initialize application
let app;
let stateManager;

document.addEventListener('DOMContentLoaded', () => {
    app = new HLPFLApp();
    stateManager = new StateManager();
    
    // Make app globally available
    window.HLPFLApp = app;
    window.StateManager = stateManager;
});

// Add CSS animations for page transitions
const style = document.createElement('style');
style.textContent = `
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
    
    .error-content {
        display: flex;
        align-items: center;
        gap: 10px;
    }
    
    .error-content button {
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        padding: 0;
        margin-left: 10px;
    }
    
    .nav__list a.active {
        color: var(--color-gold) !important;
        font-weight: 700;
    }
    
    .page-transition {
        animation: fadeIn 0.3s ease;
    }
    
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }
`;
document.head.appendChild(style);