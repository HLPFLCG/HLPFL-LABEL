// Form Utilities
// Helper functions for form handling and validation

export class FormUtils {
    static validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    static validatePhone(phone) {
        const phoneRegex = /^[\d\s\-\+\(\)]+$/;
        return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
    }

    static validateRequired(value) {
        return value && value.trim().length > 0;
    }

    static validateMinLength(value, minLength) {
        return value && value.length >= minLength;
    }

    static validateUrl(url) {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    }

    static showError(field, message) {
        // Remove existing error
        this.clearError(field);
        
        // Add error class
        field.classList.add('error');
        
        // Create error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        errorDiv.style.cssText = `
            color: #dc3545;
            font-size: 0.875rem;
            margin-top: 5px;
        `;
        
        // Insert error message
        field.parentNode.insertBefore(errorDiv, field.nextSibling);
    }

    static clearError(field) {
        field.classList.remove('error');
        const errorMessage = field.parentNode.querySelector('.error-message');
        if (errorMessage) {
            errorMessage.remove();
        }
    }

    static clearAllErrors(form) {
        form.querySelectorAll('.error').forEach(field => {
            this.clearError(field);
        });
        form.querySelectorAll('.error-message').forEach(msg => {
            msg.remove();
        });
    }

    static serializeForm(form) {
        const formData = new FormData(form);
        const data = {};
        
        for (let [key, value] of formData.entries()) {
            // Handle checkboxes
            if (form.querySelector(`[name="${key}"][type="checkbox"]`)) {
                data[key] = form.querySelector(`[name="${key}"][type="checkbox"]`).checked;
            } else {
                data[key] = value;
            }
        }
        
        return data;
    }

    static async submitForm(form, url, options = {}) {
        const formData = this.serializeForm(form);
        
        const defaultOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        };

        const response = await fetch(url, { ...defaultOptions, ...options });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
    }

    static setupValidation(form, rules) {
        const validateField = (field) => {
            const fieldName = field.name;
            const fieldRules = rules[fieldName];
            
            if (!fieldRules) return true;
            
            let isValid = true;
            
            for (const rule of fieldRules) {
                if (!rule.validator(field.value)) {
                    this.showError(field, rule.message);
                    isValid = false;
                    break;
                } else {
                    this.clearError(field);
                }
            }
            
            return isValid;
        };

        // Real-time validation
        form.querySelectorAll('input, select, textarea').forEach(field => {
            field.addEventListener('blur', () => validateField(field));
            field.addEventListener('input', () => {
                if (field.classList.contains('error')) {
                    validateField(field);
                }
            });
        });

        // Form submission validation
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            this.clearAllErrors(form);
            
            let isFormValid = true;
            form.querySelectorAll('input, select, textarea').forEach(field => {
                if (!validateField(field)) {
                    isFormValid = false;
                }
            });
            
            if (isFormValid) {
                const submitEvent = new CustomEvent('formValid', {
                    detail: { formData: this.serializeForm(form) }
                });
                form.dispatchEvent(submitEvent);
            }
        });
    }
}

// Contact Form Handler
export class ContactFormHandler {
    constructor(formId) {
        this.form = document.getElementById(formId);
        this.isSubmitting = false;
        
        if (this.form) {
            this.init();
        }
    }

    init() {
        const rules = {
            name: [
                { validator: FormUtils.validateRequired, message: 'Name is required' },
                { validator: (value) => FormUtils.validateMinLength(value, 2), message: 'Name must be at least 2 characters' }
            ],
            email: [
                { validator: FormUtils.validateRequired, message: 'Email is required' },
                { validator: FormUtils.validateEmail, message: 'Please enter a valid email address' }
            ],
            phone: [
                { validator: (value) => !value || FormUtils.validatePhone(value), message: 'Please enter a valid phone number' }
            ],
            message: [
                { validator: FormUtils.validateRequired, message: 'Message is required' },
                { validator: (value) => FormUtils.validateMinLength(value, 10), message: 'Message must be at least 10 characters' }
            ]
        };

        FormUtils.setupValidation(this.form, rules);
        
        this.form.addEventListener('formValid', (e) => {
            this.handleSubmit(e.detail.formData);
        });
    }

    async handleSubmit(formData) {
        if (this.isSubmitting) return;
        
        this.isSubmitting = true;
        this.showSubmitting();

        try {
            const response = await this.sendForm(formData);
            this.showSuccess(response);
            
            // Track form submission
            if (window.trackEvent) {
                window.trackEvent('contact_form_submission', {
                    form_type: 'contact'
                });
            }
            
        } catch (error) {
            console.error('Form submission error:', error);
            this.showError(error.message);
        } finally {
            this.isSubmitting = false;
        }
    }

    async sendForm(formData) {
        // Mock API call - replace with actual endpoint
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        return {
            success: true,
            message: 'Thank you for your message! We\'ll get back to you soon.',
            referenceId: Math.random().toString(36).substr(2, 9).toUpperCase()
        };
    }

    showSubmitting() {
        const submitBtn = this.form.querySelector('button[type="submit"]');
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        }
    }

    showSuccess(response) {
        const submitBtn = this.form.querySelector('button[type="submit"]');
        if (submitBtn) {
            submitBtn.innerHTML = '<i class="fas fa-check"></i> Sent!';
        }

        // Show success message
        const successDiv = document.createElement('div');
        successDiv.className = 'form-success';
        successDiv.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <h3>Message Sent!</h3>
            <p>${response.message}</p>
            <p><small>Reference ID: ${response.referenceId}</small></p>
        `;
        
        successDiv.style.cssText = `
            background: linear-gradient(135deg, #28a745, #20c997);
            color: white;
            padding: 30px;
            border-radius: 8px;
            text-align: center;
            margin-top: 20px;
        `;
        
        this.form.appendChild(successDiv);
        this.form.reset();
        
        // Reset button after 3 seconds
        setTimeout(() => {
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
            }
        }, 3000);
    }

    showError(message) {
        const submitBtn = this.form.querySelector('button[type="submit"]');
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
        }

        // Show error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'form-error';
        errorDiv.innerHTML = `
            <i class="fas fa-exclamation-triangle"></i>
            <p>${message}</p>
        `;
        
        errorDiv.style.cssText = `
            background: #dc3545;
            color: white;
            padding: 20px;
            border-radius: 8px;
            margin-top: 20px;
        `;
        
        this.form.appendChild(errorDiv);
        
        // Remove error after 5 seconds
        setTimeout(() => {
            errorDiv.remove();
        }, 5000);
    }
}

// Initialize contact forms when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Initialize contact form
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        window.contactFormHandler = new ContactFormHandler('contactForm');
    }
    
    // Initialize partnership form
    const partnershipForm = document.querySelector('.partnership-form');
    if (partnershipForm) {
        window.partnershipFormHandler = new ContactFormHandler('partnershipForm');
    }
});