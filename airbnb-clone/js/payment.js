// Payment handling functionality

class PaymentHandler {
    constructor() {
        this.paymentMethods = {
            creditCard: true,
            paypal: true,
            bankTransfer: true
        };
        
        this.validationRules = {
            cardNumber: /^[0-9]{16}$/,
            expiryDate: /^(0[1-9]|1[0-2])\/([0-9]{2})$/,
            cvv: /^[0-9]{3,4}$/
        };
    }

    // Initialize payment form
    initializePaymentForm() {
        const form = document.getElementById('payment-form');
        if (form) {
            form.addEventListener('submit', (e) => this.handlePaymentSubmission(e));
            this.attachInputListeners();
        }
    }

    // Attach input validation listeners
    attachInputListeners() {
        const inputs = document.querySelectorAll('#payment-form input');
        inputs.forEach(input => {
            input.addEventListener('input', (e) => this.validateInput(e.target));
            input.addEventListener('blur', (e) => this.validateInput(e.target));
        });
    }

    // Validate individual input fields
    validateInput(input) {
        const value = input.value.trim();
        const type = input.dataset.type;
        let isValid = true;
        let errorMessage = '';

        switch(type) {
            case 'cardNumber':
                isValid = this.validationRules.cardNumber.test(value.replace(/\s/g, ''));
                errorMessage = 'Please enter a valid 16-digit card number';
                break;
            case 'expiryDate':
                isValid = this.validationRules.expiryDate.test(value);
                errorMessage = 'Please enter a valid expiry date (MM/YY)';
                break;
            case 'cvv':
                isValid = this.validationRules.cvv.test(value);
                errorMessage = 'Please enter a valid CVV';
                break;
            case 'name':
                isValid = value.length >= 3;
                errorMessage = 'Please enter your full name';
                break;
        }

        this.toggleError(input, isValid, errorMessage);
        return isValid;
    }

    // Toggle error message display
    toggleError(input, isValid, message) {
        const errorElement = input.parentElement.querySelector('.error-message');
        if (!isValid) {
            if (!errorElement) {
                const error = document.createElement('div');
                error.className = 'error-message text-red-500 text-sm mt-1';
                error.textContent = message;
                input.parentElement.appendChild(error);
            }
            input.classList.add('border-red-500');
        } else {
            errorElement?.remove();
            input.classList.remove('border-red-500');
        }
    }

    // Format card number with spaces
    formatCardNumber(input) {
        let value = input.value.replace(/\s/g, '');
        let formattedValue = '';
        
        for (let i = 0; i < value.length; i++) {
            if (i > 0 && i % 4 === 0) {
                formattedValue += ' ';
            }
            formattedValue += value[i];
        }
        
        input.value = formattedValue;
    }

    // Handle form submission
    async handlePaymentSubmission(e) {
        e.preventDefault();
        
        const form = e.target;
        const submitButton = form.querySelector('button[type="submit"]');
        
        // Validate all inputs
        const inputs = form.querySelectorAll('input');
        let isValid = true;
        
        inputs.forEach(input => {
            if (!this.validateInput(input)) {
                isValid = false;
            }
        });

        if (!isValid) {
            this.showNotification('Please check your payment details', 'error');
            return;
        }

        // Show loading state
        submitButton.disabled = true;
        submitButton.innerHTML = '<div class="loading-spinner"></div>';

        try {
            // Simulate payment processing
            await this.processPayment(form);
            
            this.showNotification('Payment successful!', 'success');
            form.reset();
            
            // Redirect to confirmation page
            setTimeout(() => {
                window.location.href = '/confirmation.html';
            }, 2000);
            
        } catch (error) {
            this.showNotification(error.message, 'error');
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = 'Complete Payment';
        }
    }

    // Process payment (mock implementation)
    async processPayment(form) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const success = Math.random() > 0.1; // 90% success rate
                if (success) {
                    resolve({
                        status: 'success',
                        message: 'Payment processed successfully'
                    });
                } else {
                    reject(new Error('Payment processing failed. Please try again.'));
                }
            }, 2000);
        });
    }

    // Show notification
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `fixed bottom-4 right-4 p-4 rounded-lg shadow-lg ${
            type === 'error' ? 'bg-red-500' : 'bg-green-500'
        } text-white`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 5000);
    }

    // Add new payment method
    addPaymentMethod(method, isEnabled = true) {
        this.paymentMethods[method] = isEnabled;
    }

    // Remove payment method
    removePaymentMethod(method) {
        delete this.paymentMethods[method];
    }

    // Check if payment method is available
    isPaymentMethodAvailable(method) {
        return !!this.paymentMethods[method];
    }
}

// Initialize payment handler
const paymentHandler = new PaymentHandler();

// Make payment handler available globally
window.paymentHandler = paymentHandler;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    paymentHandler.initializePaymentForm();
    
    // Add card number formatting
    const cardNumberInput = document.querySelector('input[data-type="cardNumber"]');
    if (cardNumberInput) {
        cardNumberInput.addEventListener('input', (e) => {
            paymentHandler.formatCardNumber(e.target);
        });
    }
});
