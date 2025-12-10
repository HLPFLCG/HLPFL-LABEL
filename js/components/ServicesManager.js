// Services Manager Component
// Handles all service-related functionality including payments

export class ServicesManager {
    constructor() {
        this.services = [];
        this.filteredServices = [];
        this.currentFilter = 'all';
        this.stripe = null;
        this.isLoading = false;
    }

    async init() {
        try {
            await this.loadServices();
            this.setupStripe();
            this.setupEventListeners();
            this.renderServices();
        } catch (error) {
            console.error('Failed to initialize ServicesManager:', error);
            this.showError();
        }
    }

    setupStripe() {
        if (window.Stripe && window.HLPFLConfig.stripePublicKey) {
            this.stripe = Stripe(window.HLPFLConfig.stripePublicKey);
        }
    }

    async loadServices() {
        this.setLoading(true);
        
        try {
            const response = await fetch(`${window.HLPFLConfig.apiBaseUrl}/data/services.json`);
            const data = await response.json();
            this.services = data.services || [];
            this.filteredServices = [...this.services];
        } catch (error) {
            console.error('Error loading services:', error);
            this.services = this.getFallbackServices();
            this.filteredServices = [...this.services];
        } finally {
            this.setLoading(false);
        }
    }

    getFallbackServices() {
        return [
            {
                id: "artist-development",
                title: "Artist Development Program",
                category: "Development",
                price: 2999,
                priceDisplay: "$2,999",
                duration: "3 Months",
                description: "Comprehensive artist development program.",
                features: [
                    "Vocal coaching and technique improvement",
                    "Songwriting workshops",
                    "Performance training",
                    "Personal branding"
                ],
                stripePriceId: "price_test_artist_development"
            }
        ];
    }

    setupEventListeners() {
        // Filter buttons
        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                filterButtons.forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.currentFilter = e.target.dataset.category;
                this.filterServices();
            });
        });
    }

    filterServices() {
        this.filteredServices = this.services.filter(service => {
            return this.currentFilter === 'all' ||
                service.category.toLowerCase().includes(this.currentFilter.toLowerCase());
        });
        
        this.renderServices();
    }

    renderServices() {
        const grid = document.getElementById('servicesGrid');
        if (!grid) return;
        
        if (this.isLoading) {
            grid.innerHTML = this.getLoadingHTML();
            return;
        }
        
        if (this.filteredServices.length === 0) {
            grid.innerHTML = this.getNoResultsHTML();
            return;
        }

        grid.innerHTML = this.filteredServices.map(service => this.createServiceCard(service)).join('');
        
        // Add staggered animation
        this.addStaggeredAnimation();
    }

    createServiceCard(service) {
        const imageUrl = service.image || `https://picsum.photos/seed/${service.id}/400/200.jpg`;
        
        return `
            <div class="service-card-enhanced fade-in-up" data-service-id="${service.id}">
                ${service.badge ? `<div class="service-badge">${service.badge}</div>` : ''}
                <div class="service-header">
                    <img src="${imageUrl}" alt="${service.title}" class="service-image" 
                         loading="lazy" onerror="this.src='https://picsum.photos/seed/${service.id}/400/200.jpg'">
                    <div class="service-overlay">
                        <div>
                            <h3 class="service-title">${service.title}</h3>
                            <p class="service-category">${service.category}</p>
                        </div>
                    </div>
                </div>
                <div class="service-content">
                    <p class="service-description">${service.description}</p>
                    
                    <div class="service-features">
                        <ul>
                            ${service.features.slice(0, 4).map(feature => `<li>${feature}</li>`).join('')}
                            ${service.features.length > 4 ? `<li>...and ${service.features.length - 4} more</li>` : ''}
                        </ul>
                    </div>

                    <div class="service-footer">
                        <div class="service-price">
                            <span class="service-amount">${service.priceDisplay}</span>
                            <span class="service-duration">${service.duration}</span>
                        </div>
                        <div class="service-actions">
                            <button class="btn-service btn-service--secondary" onclick="servicesManager.showServiceDetails('${service.id}')">
                                <i class="fas fa-info-circle"></i> Details
                            </button>
                            <button class="btn-service btn-service--primary" onclick="servicesManager.bookService('${service.id}')">
                                <i class="fas fa-shopping-cart"></i> Book Now
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    showServiceDetails(serviceId) {
        const service = this.services.find(s => s.id === serviceId);
        if (!service) return;

        this.updateModalContent(service);
        
        const modal = document.getElementById('serviceModal');
        if (modal) {
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        }

        this.trackServiceView(service);
    }

    updateModalContent(service) {
        const modalContent = document.getElementById('serviceModalContent');
        if (!modalContent) return;
        
        const imageUrl = service.image || `https://picsum.photos/seed/${service.id}/900/300.jpg`;
        
        modalContent.innerHTML = `
            <div style="position: relative; height: 300px; overflow: hidden; border-radius: var(--radius-lg) var(--radius-lg) 0 0;">
                <img src="${imageUrl}" alt="${service.title}" 
                     style="width: 100%; height: 100%; object-fit: cover;" 
                     onerror="this.src='https://picsum.photos/seed/${service.id}/900/300.jpg'">
                <div style="position: absolute; bottom: 0; left: 0; right: 0; padding: 40px; background: linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 100%);">
                    <h2 style="color: var(--color-white); font: 700 2.5rem var(--font-display); margin: 0;">${service.title}</h2>
                    <p style="color: var(--color-gold); font-size: 1.2rem; margin-top: 10px;">${service.category} • ${service.duration}</p>
                </div>
            </div>
            <div class="modal-body">
                <p style="color: var(--color-text); line-height: 1.8; font-size: 1.1rem; margin-bottom: 30px;">${service.description}</p>
                
                ${service.includes ? this.renderIncludes(service.includes) : ''}
                
                <h3 style="color: var(--color-white); font: 700 1.5rem var(--font-display); margin-bottom: 20px;">Complete Feature List</h3>
                <div class="service-features" style="margin-bottom: 30px;">
                    <ul>
                        ${service.features.map(feature => `<li>${feature}</li>`).join('')}
                    </ul>
                </div>

                ${service.timeline ? this.renderTimeline(service.timeline) : ''}

                <div style="display: flex; justify-content: space-between; align-items: center; padding: 30px; background: var(--color-tertiary); border-radius: var(--radius); margin-top: 30px;">
                    <div>
                        <div style="font: 700 2.5rem var(--font-display); color: var(--color-gold);">${service.priceDisplay}</div>
                        <div style="color: var(--color-text-muted); font-size: 1rem;">${service.duration}</div>
                    </div>
                    <button class="btn btn--primary" style="font-size: 1.1rem; padding: 15px 40px;" onclick="servicesManager.bookService('${service.id}')">
                        <i class="fas fa-shopping-cart"></i> Book This Service
                    </button>
                </div>
            </div>
        `;
    }

    renderIncludes(includes) {
        return `
            <div style="background: rgba(200, 121, 65, 0.1); padding: 30px; border-radius: var(--radius); margin-bottom: 30px;">
                <h3 style="color: var(--color-white); font: 700 1.5rem var(--font-display); margin-bottom: 20px;">What's Included</h3>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px;">
                    ${includes.map(item => `
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <i class="fas fa-check-circle" style="color: var(--color-gold);"></i>
                            <span style="color: var(--color-text);">${item}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    renderTimeline(timeline) {
        return `
            <div class="timeline">
                <h3 style="color: var(--color-white); font: 700 1.5rem var(--font-display); margin-bottom: 20px;">Program Timeline</h3>
                ${timeline.map(item => `
                    <div class="timeline-item">
                        <div class="timeline-marker">${item.week}</div>
                        <div class="timeline-content">
                            <h4 class="timeline-title">${item.title}</h4>
                            <p class="timeline-description">${item.description}</p>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    async bookService(serviceId) {
        const service = this.services.find(s => s.id === serviceId);
        if (!service) return;

        this.trackBookingAttempt(service);

        try {
            if (this.stripe && service.stripePriceId) {
                await this.processStripePayment(service);
            } else {
                await this.processMockPayment(service);
            }
        } catch (error) {
            console.error('Payment error:', error);
            this.showPaymentError(error);
        }
    }

    async processStripePayment(service) {
        this.showPaymentProcessing();

        try {
            // Create checkout session
            const response = await fetch(`${window.HLPFLConfig.apiBaseUrl}/api/create-checkout-session`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    priceId: service.stripePriceId,
                    serviceId: service.id
                })
            });

            const session = await response.json();

            if (session.error) {
                throw new Error(session.error.message);
            }

            // Redirect to Stripe Checkout
            const result = await this.stripe.redirectToCheckout({
                sessionId: session.id
            });

            if (result.error) {
                throw new Error(result.error.message);
            }

        } catch (error) {
            this.hidePaymentProcessing();
            throw error;
        }
    }

    async processMockPayment(service) {
        this.showPaymentProcessing();

        // Simulate payment processing
        await new Promise(resolve => setTimeout(resolve, 2000));

        this.hidePaymentProcessing();
        this.showPaymentSuccess(service);
        this.trackSuccessfulBooking(service);
    }

    showPaymentProcessing() {
        const processing = document.getElementById('paymentProcessing');
        if (processing) {
            processing.style.display = 'flex';
        }
    }

    hidePaymentProcessing() {
        const processing = document.getElementById('paymentProcessing');
        if (processing) {
            processing.style.display = 'none';
        }
    }

    showPaymentSuccess(service) {
        const successMessage = document.getElementById('successMessage');
        if (successMessage) {
            successMessage.innerHTML = `
                <h3>🎉 Payment Successful!</h3>
                <p>Thank you for choosing ${service.title}. We'll contact you within 24 hours to get started.</p>
                <button class="btn btn--secondary" onclick="this.parentElement.style.display='none'">
                    Dismiss
                </button>
            `;
            successMessage.style.display = 'block';
            successMessage.scrollIntoView({ behavior: 'smooth' });
        }

        // Close modal if open
        this.closeServiceModal();
    }

    showPaymentError(error) {
        alert(`Payment failed: ${error.message}. Please try again or contact support.`);
    }

    closeServiceModal() {
        const modal = document.getElementById('serviceModal');
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    }

    trackServiceView(service) {
        if (window.trackEvent) {
            window.trackEvent('service_view', {
                service_id: service.id,
                service_name: service.title,
                service_category: service.category,
                service_price: service.price
            });
        }
    }

    trackBookingAttempt(service) {
        if (window.trackEvent) {
            window.trackEvent('booking_attempt', {
                service_id: service.id,
                service_name: service.title,
                service_price: service.price
            });
        }
    }

    trackSuccessfulBooking(service) {
        if (window.trackEvent) {
            window.trackEvent('booking_success', {
                service_id: service.id,
                service_name: service.title,
                service_price: service.price,
                currency: 'USD'
            });
        }
    }

    setLoading(isLoading) {
        this.isLoading = isLoading;
        this.renderServices();
    }

    getLoadingHTML() {
        return `
            <div class="loading">
                <div class="loading-spinner"></div>
                <p>Loading amazing services...</p>
            </div>
        `;
    }

    getNoResultsHTML() {
        return `
            <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px;">
                <i class="fas fa-search" style="font-size: 3rem; color: var(--color-gold); margin-bottom: 20px;"></i>
                <h3 style="color: var(--color-white); margin-bottom: 10px;">No Services Found</h3>
                <p style="color: var(--color-text-muted);">Try adjusting your filters</p>
            </div>
        `;
    }

    addStaggeredAnimation() {
        const cards = document.querySelectorAll('.service-card-enhanced');
        cards.forEach((card, index) => {
            setTimeout(() => {
                card.classList.add('animate');
            }, index * 100);
        });
    }

    showError() {
        const grid = document.getElementById('servicesGrid');
        if (grid) {
            grid.innerHTML = `
                <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px;">
                    <i class="fas fa-exclamation-triangle" style="font-size: 3rem; color: var(--color-gold); margin-bottom: 20px;"></i>
                    <h3 style="color: var(--color-white); margin-bottom: 10px;">Unable to Load Services</h3>
                    <p style="color: var(--color-text-muted);">Please check back later.</p>
                </div>
            `;
        }
    }
}

// Global instance
window.servicesManager = new ServicesManager();