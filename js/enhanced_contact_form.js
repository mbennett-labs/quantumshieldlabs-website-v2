/**
 * Enhanced Contact Form Handler for Quantum Shield Labs
 * Handles form submission with validation and user feedback
 */

document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', handleFormSubmission);
        
        // Add real-time validation
        const inputs = contactForm.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', validateField);
            input.addEventListener('input', clearFieldError);
        });
    }
});

async function handleFormSubmission(e) {
    e.preventDefault();
    
    const form = e.target;
    const submitButton = form.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.innerHTML;
    
    // Get form data
    const formData = new FormData(form);
    const data = {
        name: formData.get('name'),
        email: formData.get('email'),
        company: formData.get('company'),
        message: formData.get('message')
    };
    
    // Validate form
    if (!validateForm(data)) {
        return;
    }
    
    // Show loading state
    submitButton.disabled = true;
    submitButton.innerHTML = `
        <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Sending Application...
    `;
    
    try {
        // Submit to PHP handler
        const response = await fetch('/contact-handler.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        
        if (result.success) {
            // Show success message
            showSuccessMessage(form, result);
            form.reset();
        } else {
            // Show error message
            showErrorMessage(result.message || 'An error occurred. Please try again.');
        }
        
    } catch (error) {
        console.error('Form submission error:', error);
        showErrorMessage('Network error. Please check your connection and try again.');
    } finally {
        // Restore button
        submitButton.disabled = false;
        submitButton.innerHTML = originalButtonText;
    }
}

function validateForm(data) {
    let isValid = true;
    
    // Clear previous errors
    clearAllErrors();
    
    // Validate name
    if (!data.name || data.name.trim().length < 2) {
        showFieldError('name', 'Name must be at least 2 characters long');
        isValid = false;
    }
    
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!data.email || !emailRegex.test(data.email)) {
        showFieldError('email', 'Please enter a valid email address');
        isValid = false;
    }
    
    // Validate message
    if (!data.message || data.message.trim().length < 10) {
        showFieldError('message', 'Message must be at least 10 characters long');
        isValid = false;
    }
    
    return isValid;
}

function validateField(e) {
    const field = e.target;
    const value = field.value.trim();
    
    clearFieldError(field);
    
    switch (field.name) {
        case 'name':
            if (value && value.length < 2) {
                showFieldError('name', 'Name must be at least 2 characters long');
            }
            break;
            
        case 'email':
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (value && !emailRegex.test(value)) {
                showFieldError('email', 'Please enter a valid email address');
            }
            break;
            
        case 'message':
            if (value && value.length < 10) {
                showFieldError('message', 'Message must be at least 10 characters long');
            }
            break;
    }
}

function showFieldError(fieldName, message) {
    const field = document.getElementById(fieldName);
    if (!field) return;
    
    // Add error styling
    field.classList.add('border-red-500', 'bg-red-900', 'bg-opacity-20');
    field.classList.remove('focus:ring-blue-500');
    field.classList.add('focus:ring-red-500');
    
    // Show error message
    const errorId = `${fieldName}-error`;
    let errorElement = document.getElementById(errorId);
    
    if (!errorElement) {
        errorElement = document.createElement('p');
        errorElement.id = errorId;
        errorElement.className = 'mt-1 text-sm text-red-400';
        field.parentNode.appendChild(errorElement);
    }
    
    errorElement.textContent = message;
    errorElement.innerHTML = `<i class="fas fa-exclamation-circle mr-1"></i>${message}`;
}

function clearFieldError(field) {
    if (typeof field === 'string') {
        field = document.getElementById(field);
    }
    if (!field) return;
    
    // Remove error styling
    field.classList.remove('border-red-500', 'bg-red-900', 'bg-opacity-20', 'focus:ring-red-500');
    field.classList.add('focus:ring-blue-500');
    
    // Remove error message
    const errorElement = document.getElementById(`${field.name}-error`);
    if (errorElement) {
        errorElement.remove();
    }
}

function clearAllErrors() {
    const fields = ['name', 'email', 'company', 'message'];
    fields.forEach(fieldName => {
        clearFieldError(fieldName);
    });
    
    // Clear any general error messages
    const errorContainer = document.getElementById('form-error');
    if (errorContainer) {
        errorContainer.remove();
    }
}

function showSuccessMessage(form, result) {
    // Create success message
    const successHtml = `
        <div class="flex flex-col items-center justify-center py-12">
            <div class="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-6">
                <i class="fas fa-check text-green-500 text-2xl"></i>
            </div>
            <h3 class="text-2xl font-bold mb-2">Application Submitted!</h3>
            <p class="text-gray-300 text-center mb-4">
                Thank you for your interest in Quantum Shield Labs Early Access program.
            </p>
            <p class="text-gray-400 text-center text-sm">
                We'll review your application and get back to you within 24-48 hours.
            </p>
            <div class="mt-6 flex space-x-4">
                <button onclick="resetForm()" class="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg text-sm transition">
                    Submit Another Application
                </button>
                <a href="/blog/" class="bg-gray-600 hover:bg-gray-700 px-6 py-2 rounded-lg text-sm transition">
                    Read Our Blog
                </a>
            </div>
        </div>
    `;
    
    // Replace form with success message
    form.innerHTML = successHtml;
    
    // Scroll to success message
    form.scrollIntoView({ behavior: 'smooth', block: 'center' });
    
    // Track success (optional analytics)
    if (typeof gtag !== 'undefined') {
        gtag('event', 'form_submit', {
            event_category: 'engagement',
            event_label: 'early_access_application'
        });
    }
}

function showErrorMessage(message) {
    // Remove existing error messages
    const existingError = document.getElementById('form-error');
    if (existingError) {
        existingError.remove();
    }
    
    // Create error message
    const errorDiv = document.createElement('div');
    errorDiv.id = 'form-error';
    errorDiv.className = 'bg-red-900/30 border border-red-500 text-red-300 px-4 py-3 rounded-lg mb-6 flex items-center';
    errorDiv.innerHTML = `
        <i class="fas fa-exclamation-triangle mr-3 text-red-500"></i>
        <div>
            <strong>Error:</strong> ${message}
            <br><small>Please try again or contact us directly at michael@quantumshieldlabs.dev</small>
        </div>
    `;
    
    // Insert error message at top of form
    const form = document.getElementById('contact-form');
    form.insertBefore(errorDiv, form.firstChild);
    
    // Scroll to error
    errorDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function resetForm() {
    // Restore original form HTML
    const formContainer = document.getElementById('contact-form').parentNode;
    
    const originalFormHtml = `
        <div class="mb-6 bg-blue-900 bg-opacity-20 rounded-lg p-4 border-l-4 border-blue-500">
            <h3 class="font-semibold text-lg mb-2">Early Access Application</h3>
            <p class="text-gray-300 text-sm">
                We're selectively accepting early access partners while we prepare for our full launch. 
                Tell us about your organization's security needs below.
            </p>
        </div>
        
        <form class="space-y-6" id="contact-form">
            <div>
                <label for="name" class="block text-sm font-medium mb-2">Name *</label>
                <input
                    id="name"
                    name="name"
                    type="text"
                    class="w-full px-4 py-3 bg-gray-800 bg-opacity-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    placeholder="Your name"
                    required
                />
            </div>
            
            <div>
                <label for="email" class="block text-sm font-medium mb-2">Email *</label>
                <input
                    id="email"
                    name="email"
                    type="email"
                    class="w-full px-4 py-3 bg-gray-800 bg-opacity-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    placeholder="your@email.com"
                    required
                />
            </div>
            
            <div>
                <label for="company" class="block text-sm font-medium mb-2">Company</label>
                <input
                    id="company"
                    name="company"
                    type="text"
                    class="w-full px-4 py-3 bg-gray-800 bg-opacity-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    placeholder="Your organization"
                />
            </div>
            
            <div>
                <label for="message" class="block text-sm font-medium mb-2">Security Needs *</label>
                <textarea
                    id="message"
                    name="message"
                    class="w-full px-4 py-3 bg-gray-800 bg-opacity-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-32 transition"
                    placeholder="Briefly describe your security challenges and requirements"
                    required
                ></textarea>
            </div>
            
            <button
                type="submit"
                class="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition transform hover:scale-[1.02]"
            >
                Apply for Early Access
            </button>
        </form>
    `;
    
    formContainer.innerHTML = originalFormHtml;
    
    // Reinitialize form handlers
    const newForm = document.getElementById('contact-form');
    newForm.addEventListener('submit', handleFormSubmission);
    
    const inputs = newForm.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', validateField);
        input.addEventListener('input', clearFieldError);
    });
}

// Utility function to show loading state on any button
function setButtonLoading(button, isLoading, loadingText = 'Loading...') {
    if (isLoading) {
        button.disabled = true;
        button.dataset.originalText = button.innerHTML;
        button.innerHTML = `
            <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            ${loadingText}
        `;
    } else {
        button.disabled = false;
        button.innerHTML = button.dataset.originalText || button.innerHTML;
    }
}

// Export functions for testing (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        validateForm,
        showFieldError,
        clearFieldError,
        showSuccessMessage,
        showErrorMessage
    };
}