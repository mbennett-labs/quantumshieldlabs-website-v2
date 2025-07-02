// Main JavaScript for Quantum Shield Labs website

document.addEventListener('DOMContentLoaded', function() {
    // Initialize animations and interactions
    initScrollAnimations();
    initNavigation();
    initContactForm();
});

// Contact form handling
function initContactForm() {
    const contactForm = document.querySelector('#contact form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const nameInput = document.getElementById('name');
            const emailInput = document.getElementById('email');
            const messageInput = document.getElementById('message');
            
            // Simple validation
            let isValid = true;
            
            if (!nameInput.value.trim()) {
                highlightError(nameInput);
                isValid = false;
            }
            
            if (!emailInput.value.trim() || !isValidEmail(emailInput.value)) {
                highlightError(emailInput);
                isValid = false;
            }
            
            if (!messageInput.value.trim()) {
                highlightError(messageInput);
                isValid = false;
            }
            
            if (isValid) {
                // In a real implementation, you'd send this data to your server
                // For now, we'll just simulate success
                
                // Change button text and disable it
                const submitButton = contactForm.querySelector('button[type="submit"]');
                const originalText = submitButton.innerHTML;
                submitButton.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Sending...';
                submitButton.disabled = true;
                
                // Simulate server request
                setTimeout(() => {
                    // Show success message
                    contactForm.innerHTML = `
                        <div class="flex flex-col items-center justify-center py-12">
                            <div class="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-6">
                                <i class="fas fa-check text-green-500 text-2xl"></i>
                            </div>
                            <h3 class="text-2xl font-bold mb-2">Message Sent!</h3>
                            <p class="text-gray-300 text-center">
                                Thank you for reaching out. We'll get back to you as soon as possible.
                            </p>
                        </div>
                    `;
                }, 1500);
            }
        });
        
        // Remove error highlighting on input
        const inputs = contactForm.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('input', function() {
                this.classList.remove('border-red-500');
            });
        });
    }
}

function highlightError(element) {
    element.classList.add('border', 'border-red-500');
}

function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Scroll animations for elements
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    
    // Create an intersection observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                // Optional: stop observing after animation
                if (entry.target.dataset.once === 'true') {
                    observer.unobserve(entry.target);
                }
            } else if (!entry.target.dataset.once) {
                entry.target.classList.remove('animated');
            }
        });
    }, {
        rootMargin: '0px',
        threshold: 0.1
    });
    
    // Observe all elements with animation class
    animatedElements.forEach(element => {
        observer.observe(element);
    });
    
    // Add animation classes to elements dynamically
    document.querySelectorAll('section').forEach((section, index) => {
        const elements = section.querySelectorAll('h2, h3, p, .service-card, .value-card');
        elements.forEach((element, elementIndex) => {
            element.classList.add('animate-on-scroll');
            element.dataset.once = 'true';
            element.style.transitionDelay = `${elementIndex * 100}ms`;
        });
    });
}

// Navigation and scrolling enhancements
function initNavigation() {
    // Sticky navbar effect
    const navbar = document.getElementById('navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('navbar-scrolled');
        } else {
            navbar.classList.remove('navbar-scrolled');
        }
    });
    
    // Mobile menu toggle
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
            // Change icon
            const icon = mobileMenuButton.querySelector('i');
            if (icon) {
                if (mobileMenu.classList.contains('hidden')) {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                } else {
                    icon.classList.remove('fa-bars');
                    icon.classList.add('fa-times');
                }
            }
        });
        
        // Close mobile menu when clicking on links
        const menuLinks = mobileMenu.querySelectorAll('a');
        menuLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
                const icon = mobileMenuButton.querySelector('i');
                if (icon) {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            });
        });
    }
    
    // Smooth scrolling for all navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80, // Offset for navbar
                    behavior: 'smooth'
                });
            }
        });
    });
}
