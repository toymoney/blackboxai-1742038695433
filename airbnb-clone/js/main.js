// Main JavaScript functionality

document.addEventListener('DOMContentLoaded', function() {
    // Initialize components
    initializeSearch();
    initializeFilters();
    initializeFavorites();
    initializeImageLoading();
    initializeResponsiveMenu();
    
    // Show toast notification
    showToast('Welcome to our platform!');
});

// Search functionality
function initializeSearch() {
    const searchBar = document.querySelector('.search-bar');
    if (searchBar) {
        searchBar.addEventListener('click', function() {
            // Expand search bar on mobile
            if (window.innerWidth < 768) {
                this.classList.add('expanded');
            }
        });
    }
}

// Category filters
function initializeFilters() {
    const filterButtons = document.querySelectorAll('.flex.space-x-8 button');
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('text-black'));
            // Add active class to clicked button
            this.classList.add('text-black');
            // Filter properties based on category (to be implemented)
            filterProperties(this.textContent.trim());
        });
    });
}

// Favorite functionality
function initializeFavorites() {
    const heartButtons = document.querySelectorAll('.fa-heart');
    heartButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            this.classList.toggle('fas');
            this.classList.toggle('far');
            
            // Show feedback
            const action = this.classList.contains('fas') ? 'added to' : 'removed from';
            showToast(`Property ${action} favorites`);
        });
    });
}

// Lazy loading images
function initializeImageLoading() {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
}

// Mobile menu
function initializeResponsiveMenu() {
    const menuButton = document.querySelector('.fa-bars').parentElement;
    const mobileMenu = document.createElement('div');
    mobileMenu.className = 'mobile-menu fixed top-0 left-0 w-full bg-white shadow-lg transform -translate-y-full transition-transform duration-300 ease-in-out z-50';
    
    menuButton.addEventListener('click', function() {
        if (mobileMenu.classList.contains('-translate-y-full')) {
            mobileMenu.classList.remove('-translate-y-full');
        } else {
            mobileMenu.classList.add('-translate-y-full');
        }
    });
}

// Property filtering
function filterProperties(category) {
    const properties = document.querySelectorAll('.group.cursor-pointer');
    properties.forEach(property => {
        // Add filtering logic based on category
        if (category === 'All') {
            property.style.display = 'block';
        } else {
            // Example: Check if property has category in its dataset
            const hasCategory = property.dataset.categories?.includes(category);
            property.style.display = hasCategory ? 'block' : 'none';
        }
    });
}

// Toast notification
function showToast(message, duration = 3000) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    // Trigger reflow to enable animation
    toast.offsetHeight;
    
    // Show toast
    toast.classList.add('show');
    
    // Hide and remove toast after duration
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 300);
    }, duration);
}

// Debounce function for search input
function debounce(func, wait) {
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

// Handle scroll events
window.addEventListener('scroll', debounce(() => {
    const nav = document.querySelector('nav');
    if (window.scrollY > 50) {
        nav.classList.add('shadow-md');
    } else {
        nav.classList.remove('shadow-md');
    }
}, 100));

// Handle window resize
window.addEventListener('resize', debounce(() => {
    // Update UI elements based on window size
    const searchBar = document.querySelector('.search-bar');
    if (window.innerWidth >= 768) {
        searchBar?.classList.remove('expanded');
    }
}, 250));

// Make functions available globally
window.showToast = showToast;
window.filterProperties = filterProperties;
window.debounce = debounce;
