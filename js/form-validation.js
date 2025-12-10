/**
 * Form Validation and Enhancement for HLPFL
 * Provides client-side validation, error messages, and success feedback
 */

(function() {
    'use strict';

    // Email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Phone validation regex (US format)
    const phoneRegex = /^[\d\s\-\(\)]+$/;

    /**
     * Validate email format
     */
    function isValidEmail(email) {
        return emailRegex.test(email);
    }

    /**
     * Validate phone format
     */
    function isValidPhone(phone) {
        return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
    }

    /**
     * Show error message for a field
     */
    function showError(input, message) {
        // Remove any existing error
        removeError(input);

        // Add error class to input
        input.classList.add('error');
        input.setAttribute('aria-invalid', 'true');

        // Create error message element
        const errorDiv = document.createElement('div');
        errorDiv.className = 'form-error-message';
        errorDiv.textContent = message;
        errorDiv.setAttribute('role', 'alert');

        // Insert error message after input
        input.parentNode.insertBefore(errorDiv, input.nextSibling);

        // Focus on the input
        input.focus();
    }

    /**
     * Remove error message from a field
     */
    function removeError(input) {
        input.classList.remove('error');
        input.removeAttribute('aria-invalid');

        const errorMessage = input.parentNode.querySelector('.form-error-message');
        if (errorMessage) {
            errorMessage.remove();
        }
    }

    /**
     * Show success message
     */
    function showSuccess(form, message) {
        const successDiv = document.createElement('div');
        successDiv.className = 'form-success-message';
        successDiv.textContent = message;
        successDiv.setAttribute('role', 'status');

        // Insert success message at the top of the form
        form.insertBefore(successDiv, form.firstChild);

        // Auto-remove after 5 seconds
        setTimeout(() => {
            successDiv.remove();
        }, 5000);
    }

    /**
     * Validate required field
     */
    function validateRequired(input) {
        const value = input.value.trim();
        if (!value) {
            showError(input, 'This field is required');
            return false;
        }
        removeError(input);
        return true;
    }

    /**
     * Validate email field
     */
    function validateEmail(input) {
        const value = input.value.trim();
        
        if (!value) {
            showError(input, 'Email address is required');
            return false;
        }
        
        if (!isValidEmail(value)) {
            showError(input, 'Please enter a valid email address');
            return false;
        }
        
        removeError(input);
        return true;
    }

    /**
     * Validate phone field
     */
    function validatePhone(input) {
        const value = input.value.trim();
        
        if (!value) {
            return true; // Phone is usually optional
        }
        
        if (!isValidPhone(value)) {
            showError(input, 'Please enter a valid phone number');
            return false;
        }
        
        removeError(input);
        return true;
    }

    /**
     * Validate name field
     */
    function validateName(input) {
        const value = input.value.trim();
        
        if (!value) {
            showError(input, 'Name is required');
            return false;
        }
        
        if (value.length < 2) {
            showError(input, 'Name must be at least 2 characters');
            return false;
        }
        
        removeError(input);
        return true;
    }

    /**
     * Validate message/textarea field
     */
    function validateMessage(input) {
        const value = input.value.trim();
        
        if (!value) {
            showError(input, 'Message is required');
            return false;
        }
        
        if (value.length < 10) {
            showError(input, 'Message must be at least 10 characters');
            return false;
        }
        
        removeError(input);
        return true;
    }

    /**
     * Validate entire form
     */
    function validateForm(form) {
        let isValid = true;

        // Get all required inputs
        const requiredInputs = form.querySelectorAll('[required]');
        
        requiredInputs.forEach(input => {
            const type = input.type;
            const name = input.name.toLowerCase();

            if (type === 'email' || name.includes('email')) {
                if (!validateEmail(input)) isValid = false;
            } else if (type === 'tel' || name.includes('phone')) {
                if (!validatePhone(input)) isValid = false;
            } else if (name.includes('name')) {
                if (!validateName(input)) isValid = false;
            } else if (input.tagName === 'TEXTAREA' || name.includes('message')) {
                if (!validateMessage(input)) isValid = false;
            } else {
                if (!validateRequired(input)) isValid = false;
            }
        });

        return isValid;
    }

    /**
     * Handle form submission
     */
    function handleFormSubmit(e, form) {
        e.preventDefault();

        // Validate form
        if (!validateForm(form)) {
            return false;
        }

        // Show loading state
        const submitButton = form.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.innerHTML;
        submitButton.disabled = true;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';

        // Here you would normally send the form data to your backend
        // For now, we'll simulate a successful submission
        setTimeout(() => {
            // Reset button
            submitButton.disabled = false;
            submitButton.innerHTML = originalButtonText;

            // Show success message
            showSuccess(form, 'Thank you! Your message has been sent successfully.');

            // Reset form
            form.reset();

            // Track successful submission
            if (typeof window.dataLayer !== 'undefined') {
                window.dataLayer.push({
                    'event': 'form_submission_success',
                    'form_id': form.id || 'contact_form'
                });
            }
        }, 1500);

        return false;
    }

    /**
     * Add real-time validation to inputs
     */
    function addRealTimeValidation(input) {
        input.addEventListener('blur', function() {
            const type = this.type;
            const name = this.name.toLowerCase();

            if (this.hasAttribute('required')) {
                if (type === 'email' || name.includes('email')) {
                    validateEmail(this);
                } else if (type === 'tel' || name.includes('phone')) {
                    validatePhone(this);
                } else if (name.includes('name')) {
                    validateName(this);
                } else if (this.tagName === 'TEXTAREA' || name.includes('message')) {
                    validateMessage(this);
                } else {
                    validateRequired(this);
                }
            }
        });

        // Remove error on input
        input.addEventListener('input', function() {
            if (this.classList.contains('error')) {
                removeError(this);
            }
        });
    }

    /**
     * Initialize form validation
     */
    function initFormValidation() {
        // Find all forms
        const forms = document.querySelectorAll('form');

        forms.forEach(form => {
            // Add submit handler
            form.addEventListener('submit', function(e) {
                handleFormSubmit(e, this);
            });

            // Add real-time validation to all inputs
            const inputs = form.querySelectorAll('input, textarea, select');
            inputs.forEach(input => {
                addRealTimeValidation(input);
            });
        });

        // Add styles for error and success messages
        addFormStyles();
    }

    /**
     * Add CSS styles for form validation
     */
    function addFormStyles() {
        const style = document.createElement('style');
        style.textContent = `
            /* Form Validation Styles */
            .form-error-message {
                color: var(--c-danger, #dc2626);
                font-size: 0.875rem;
                margin-top: 0.5rem;
                display: block;
                animation: slideDown 0.3s ease-out;
            }

            .form-success-message {
                background: var(--c-success, #059669);
                color: white;
                padding: 1rem;
                border-radius: var(--radius, 8px);
                margin-bottom: 1.5rem;
                display: flex;
                align-items: center;
                gap: 0.5rem;
                animation: slideDown 0.3s ease-out;
            }

            .form-success-message::before {
                content: "✓";
                font-size: 1.5rem;
                font-weight: bold;
            }

            input.error,
            textarea.error,
            select.error {
                border-color: var(--c-danger, #dc2626) !important;
                box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1) !important;
            }

            input:focus,
            textarea:focus,
            select:focus {
                outline: none;
                border-color: var(--c-gold, #c87941);
                box-shadow: 0 0 0 3px rgba(200, 121, 65, 0.1);
            }

            @keyframes slideDown {
                from {
                    opacity: 0;
                    transform: translateY(-10px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            /* Loading state for buttons */
            button[disabled] {
                opacity: 0.6;
                cursor: not-allowed;
            }
        `;
        document.head.appendChild(style);
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initFormValidation);
    } else {
        initFormValidation();
    }

})();