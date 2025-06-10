// ===== MOBILE NAVIGATION TOGGLE =====
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    // Toggle mobile menu
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
    
    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
});

// ===== SMOOTH SCROLLING FOR NAVIGATION LINKS =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ===== NAVBAR BACKGROUND ON SCROLL =====
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(10, 10, 10, 0.98)';
    } else {
        navbar.style.background = 'rgba(10, 10, 10, 0.95)';
    }
});

// ===== INTERSECTION OBSERVER FOR CARD ANIMATIONS =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Add animation class to service cards
            if (entry.target.classList.contains('service-card')) {
                entry.target.classList.add('animate');
            }
        }
    });
}, observerOptions);

// Observe all service cards
document.querySelectorAll('.service-card').forEach(card => {
    observer.observe(card);
});

// ===== PORTFOLIO SLIDER FUNCTIONALITY =====
let currentSlide = 0;
const portfolioTrack = document.getElementById('portfolioTrack');
const portfolioItems = document.querySelectorAll('.portfolio-item');
const totalSlides = portfolioItems.length;

// Calculate how many items to show based on screen size
function getItemsToShow() {
    if (window.innerWidth <= 480) return 1;
    if (window.innerWidth <= 768) return 2;
    return 3;
}

function updateSlider() {
    const itemsToShow = getItemsToShow();
    const itemWidth = portfolioItems[0].offsetWidth + 32; // 32px for gap
    const maxSlide = Math.max(0, totalSlides - itemsToShow);
    
    // Ensure currentSlide doesn't exceed maxSlide
    currentSlide = Math.min(currentSlide, maxSlide);
    
    const translateX = -currentSlide * itemWidth;
    portfolioTrack.style.transform = `translateX(${translateX}px)`;
    
    // Update button states
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    prevBtn.style.opacity = currentSlide === 0 ? '0.5' : '1';
    nextBtn.style.opacity = currentSlide >= maxSlide ? '0.5' : '1';
}

// Portfolio navigation
document.getElementById('prevBtn').addEventListener('click', function() {
    if (currentSlide > 0) {
        currentSlide--;
        updateSlider();
    }
});

document.getElementById('nextBtn').addEventListener('click', function() {
    const itemsToShow = getItemsToShow();
    const maxSlide = Math.max(0, totalSlides - itemsToShow);
    
    if (currentSlide < maxSlide) {
        currentSlide++;
        updateSlider();
    }
});

// Update slider on window resize
window.addEventListener('resize', function() {
    updateSlider();
});

// Initialize slider
updateSlider();

// ===== AUTO-PLAY PORTFOLIO SLIDER (Optional) =====
let autoPlayInterval;

function startAutoPlay() {
    autoPlayInterval = setInterval(function() {
        const itemsToShow = getItemsToShow();
        const maxSlide = Math.max(0, totalSlides - itemsToShow);
        
        if (currentSlide < maxSlide) {
            currentSlide++;
        } else {
            currentSlide = 0;
        }
        updateSlider();
    }, 4000); // Change slide every 4 seconds
}

function stopAutoPlay() {
    clearInterval(autoPlayInterval);
}

// Start auto-play
startAutoPlay();

// Pause auto-play on hover
const portfolioSlider = document.querySelector('.portfolio-slider');
portfolioSlider.addEventListener('mouseenter', stopAutoPlay);
portfolioSlider.addEventListener('mouseleave', startAutoPlay);

// ===== CONTACT FORM HANDLING =====
const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(contactForm);
    const name = formData.get('name');
    const email = formData.get('email');
    const subject = formData.get('subject');
    const message = formData.get('message');
    
    // Simple validation
    if (!name || !email || !subject || !message) {
        showNotification('Please fill in all fields', 'error');
        return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showNotification('Please enter a valid email address', 'error');
        return;
    }
    
    // Simulate form submission
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
    
    // Simulate API call
    setTimeout(function() {
        showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
        contactForm.reset();
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }, 2000);
});

// ===== NOTIFICATION SYSTEM =====
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 300px;
        font-weight: 500;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 5000);
}

// ===== PARALLAX EFFECT FOR FLOATING ELEMENTS =====
window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.floating-element');
    
    parallaxElements.forEach((element, index) => {
        const speed = 0.5 + (index * 0.2); // Different speeds for each element
        const yPos = -(scrolled * speed);
        element.style.transform = `translateY(${yPos}px)`;
    });
});

// ===== BUTTON CLICK ANIMATIONS =====
document.querySelectorAll('.btn-primary, .btn-secondary').forEach(button => {
    button.addEventListener('click', function(e) {
        // Create ripple effect
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.3);
            transform: scale(0);
            animation: ripple 0.6s linear;
            pointer-events: none;
        `;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        
        this.style.position = 'relative';
        this.style.overflow = 'hidden';
        this.appendChild(ripple);
        
        // Remove ripple after animation
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
});

// Add ripple animation CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ===== SCROLL REVEAL ANIMATION =====
function revealOnScroll() {
    const reveals = document.querySelectorAll('.service-card, .portfolio-item, .contact-card');
    
    reveals.forEach(reveal => {
        const windowHeight = window.innerHeight;
        const elementTop = reveal.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < windowHeight - elementVisible) {
            reveal.classList.add('animate');
        }
    });
}

window.addEventListener('scroll', revealOnScroll);

// ===== PERFORMANCE OPTIMIZATION =====
// Throttle scroll events for better performance
function throttle(func, wait) {
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

// Apply throttling to scroll events
const throttledScroll = throttle(function() {
    revealOnScroll();
}, 100);

window.addEventListener('scroll', throttledScroll);

// ===== ACCESSIBILITY IMPROVEMENTS =====
// Add keyboard navigation support
document.addEventListener('keydown', function(e) {
    // ESC key closes mobile menu
    if (e.key === 'Escape') {
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');
        
        if (navMenu.classList.contains('active')) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    }
    
    // Arrow keys for portfolio navigation
    if (e.key === 'ArrowLeft') {
        document.getElementById('prevBtn').click();
    } else if (e.key === 'ArrowRight') {
        document.getElementById('nextBtn').click();
    }
});

// ===== PRELOADER (optional) =====
window.addEventListener('load', function() {
    // Hide preloader if you add one
    const preloader = document.querySelector('.preloader');
    if (preloader) {
        preloader.style.opacity = '0';
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 500);
    }
    
    // Initialize animations
    revealOnScroll();
});

// ===== CONSOLE WELCOME MESSAGE =====
console.log(`
🚀 Welcome to DevCraft Portfolio
Built with modern web technologies
Contact: hello@devcraft.com

Portfolio Instructions:
- Replace placeholder images in portfolio section with your work
- Update project titles, descriptions, and links
- Add your profile image in the about section
- Customize contact information
`);