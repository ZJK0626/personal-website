// ============================================
// THEME TOGGLE FUNCTIONALITY
// ============================================

// Get theme elements - both desktop and mobile buttons
const themeToggleDesktop = document.getElementById('themeToggleDesktop');
const themeToggleMobile = document.getElementById('themeToggleMobile');
const html = document.documentElement;

// Check for saved theme preference or default to 'dark'
const currentTheme = localStorage.getItem('theme') || 'dark';
html.setAttribute('data-theme', currentTheme);

// Update icon based on current theme for both buttons
function updateThemeIcon() {
    const isDark = html.getAttribute('data-theme') === 'dark';
    const iconClass = isDark ? 'fas fa-sun' : 'fas fa-moon';
    
    // Update desktop button icon
    if (themeToggleDesktop) {
        const desktopIcon = themeToggleDesktop.querySelector('i');
        if (desktopIcon) desktopIcon.className = iconClass;
    }
    
    // Update mobile button icon
    if (themeToggleMobile) {
        const mobileIcon = themeToggleMobile.querySelector('i');
        if (mobileIcon) mobileIcon.className = iconClass;
    }
}

// Initialize icons
updateThemeIcon();

// Function to toggle theme
function toggleTheme() {
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon();
}

// Add click listeners to both buttons
if (themeToggleDesktop) {
    themeToggleDesktop.addEventListener('click', toggleTheme);
}

if (themeToggleMobile) {
    themeToggleMobile.addEventListener('click', toggleTheme);
}

// Keyboard shortcut: Press 'T' to toggle theme
document.addEventListener('keydown', (e) => {
    if (e.key === 't' || e.key === 'T') {
        if (document.activeElement.tagName !== 'INPUT' && 
            document.activeElement.tagName !== 'TEXTAREA') {
            toggleTheme();
        }
    }
});

// ============================================
// MOBILE MENU FUNCTIONALITY
// ============================================

// Get menu elements
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const mobileCloseBtn = document.getElementById('mobileCloseBtn');
const sidebar = document.getElementById('sidebar');
const sidebarOverlay = document.getElementById('sidebarOverlay');

// Open mobile menu
function openMobileMenu() {
    sidebar.classList.add('active');
    sidebarOverlay.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
}

// Close mobile menu
function closeMobileMenu() {
    sidebar.classList.remove('active');
    sidebarOverlay.classList.remove('active');
    document.body.style.overflow = ''; // Restore scrolling
}

// Reset mobile menu state (fixes back button issues)
function resetMobileMenuState() {
    closeMobileMenu();
    // Force layout recalculation
    if (sidebar) {
        sidebar.style.display = 'none';
        sidebar.offsetHeight; // Trigger reflow
        sidebar.style.display = '';
    }
}

// Toggle menu on hamburger button click
if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', openMobileMenu);
}

// Close menu on close button click
if (mobileCloseBtn) {
    mobileCloseBtn.addEventListener('click', closeMobileMenu);
}

// Close menu when clicking overlay
if (sidebarOverlay) {
    sidebarOverlay.addEventListener('click', closeMobileMenu);
}

// Close menu when clicking navigation links
const navLinks = document.querySelectorAll('.nav-link, .sidebar a');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        // Small delay to allow navigation to happen
        setTimeout(closeMobileMenu, 100);
    });
});

// Close menu on escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && sidebar.classList.contains('active')) {
        closeMobileMenu();
    }
});

// Handle window resize - close menu if window becomes desktop size
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        if (window.innerWidth > 1024 && sidebar.classList.contains('active')) {
            closeMobileMenu();
        }
    }, 250);
});

// ============================================
// FIX: HANDLE BACK BUTTON NAVIGATION
// ============================================

// Reset state when navigating back (fixes broken layout)
window.addEventListener('pageshow', (event) => {
    if (event.persisted) {
        // Page was loaded from cache (back/forward button)
        resetMobileMenuState();
        
        // Force theme refresh
        html.setAttribute('data-theme', localStorage.getItem('theme') || 'dark');
        updateThemeIcon();
        
        // Scroll to top
        window.scrollTo(0, 0);
    }
});

// Additional fix: Reset on page load
window.addEventListener('load', () => {
    resetMobileMenuState();
});

// Additional fix: Reset on visibility change
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
        resetMobileMenuState();
    }
});

// ============================================
// SMOOTH SCROLL & ANIMATIONS
// ============================================

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && href.length > 1) {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all sections for animation
document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });
});

// ============================================
// ACTIVE NAVIGATION HIGHLIGHTING
// ============================================

// Highlight active section in navigation
const sections = document.querySelectorAll('.section');
const navLinksArray = Array.from(document.querySelectorAll('.nav-link'));

function highlightNavigation() {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    navLinksArray.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

// Add active class styling
const style = document.createElement('style');
style.textContent = `
    .nav-link.active {
        background: var(--bg-tertiary);
        color: var(--accent-color);
        padding-left: 20px;
    }
`;
document.head.appendChild(style);

window.addEventListener('scroll', highlightNavigation);
window.addEventListener('load', highlightNavigation);

// ============================================
// CONSOLE EASTER EGG
// ============================================

console.log('%c👋 Hi there!', 'font-size: 20px; font-weight: bold; color: #4d9fff;');
console.log('%cInterested in how this site was built?', 'font-size: 14px; color: #666;');
console.log('%cPress T to toggle theme!', 'font-size: 12px; color: #4d9fff;');