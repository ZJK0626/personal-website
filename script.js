/* ============================================
   JUNKE ZHAO PORTFOLIO - UNIFIED JAVASCRIPT
   ============================================ */

if ('scrollRestoration' in history) {
    history.scrollRestoration = 'auto';
}

// ============================================
// THEME TOGGLE
// ============================================
const themeToggleDesktop = document.getElementById('themeToggleDesktop');
const themeToggleMobile = document.getElementById('themeToggleMobile');
const html = document.documentElement;

// Initialize theme from localStorage
const currentTheme = localStorage.getItem('theme') || 'dark';
html.setAttribute('data-theme', currentTheme);

function updateThemeIcon() {
    const isDark = html.getAttribute('data-theme') === 'dark';
    const iconClass = isDark ? 'fas fa-sun' : 'fas fa-moon';
    
    if (themeToggleDesktop) {
        const desktopIcon = themeToggleDesktop.querySelector('i');
        if (desktopIcon) desktopIcon.className = iconClass;
    }
    
    if (themeToggleMobile) {
        const mobileIcon = themeToggleMobile.querySelector('i');
        if (mobileIcon) mobileIcon.className = iconClass;
    }
}

function toggleTheme() {
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon();
}

// Initialize icons
updateThemeIcon();

// Event listeners
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
// MOBILE MENU
// ============================================
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const mobileCloseBtn = document.getElementById('mobileCloseBtn');
const sidebar = document.getElementById('sidebar');
const sidebarOverlay = document.getElementById('sidebarOverlay');

function openMobileMenu() {
    if (sidebar) sidebar.classList.add('active');
    if (sidebarOverlay) sidebarOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeMobileMenu() {
    if (sidebar) sidebar.classList.remove('active');
    if (sidebarOverlay) sidebarOverlay.classList.remove('active');
    document.body.style.overflow = '';
}

function resetMobileMenuState() {
    closeMobileMenu();
    if (sidebar) {
        sidebar.style.display = 'none';
        sidebar.offsetHeight; // Trigger reflow
        sidebar.style.display = '';
    }
}

// Event listeners
if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', openMobileMenu);
}

if (mobileCloseBtn) {
    mobileCloseBtn.addEventListener('click', closeMobileMenu);
}

if (sidebarOverlay) {
    sidebarOverlay.addEventListener('click', closeMobileMenu);
}

// Close menu on navigation link click
document.querySelectorAll('.nav-link, .sidebar a').forEach(link => {
    link.addEventListener('click', () => {
        setTimeout(closeMobileMenu, 100);
    });
});

// Close menu on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && sidebar && sidebar.classList.contains('active')) {
        closeMobileMenu();
    }
});

// Close menu on window resize to desktop
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        if (window.innerWidth > 1024 && sidebar && sidebar.classList.contains('active')) {
            closeMobileMenu();
        }
    }, 250);
});

// ============================================
// BACK BUTTON NAVIGATION FIX
// ============================================
window.addEventListener('pageshow', (event) => {
    if (event.persisted) {
        resetMobileMenuState();
        html.setAttribute('data-theme', localStorage.getItem('theme') || 'dark');
        updateThemeIcon();
        // window.scrollTo(0, 0);
    }
});

window.addEventListener('load', resetMobileMenuState);

document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
        resetMobileMenuState();
    }
});

// ============================================
// SMOOTH SCROLL
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
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

// ============================================
// ACTIVE NAVIGATION HIGHLIGHTING
// ============================================
const sections = document.querySelectorAll('.section');
const navLinksArray = Array.from(document.querySelectorAll('.nav-link'));

function highlightNavigation() {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
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

window.addEventListener('scroll', highlightNavigation);
window.addEventListener('load', highlightNavigation);

// ============================================
// SCROLL POSITION SAVE/RESTORE
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    // Save scroll position when clicking "View All" links
    document.querySelectorAll('a[href="all-projects.html"]').forEach(link => {
        link.addEventListener('click', function() {
            sessionStorage.setItem('homepageScrollPosition', window.scrollY);
        });
    });
    
    // Restore scroll position when returning
    const savedPosition = sessionStorage.getItem('homepageScrollPosition');
    if (savedPosition !== null && document.referrer.includes('all-projects.html')) {
        window.scrollTo(0, parseInt(savedPosition));
        sessionStorage.removeItem('homepageScrollPosition');
    }
});

// ============================================
// CONSOLE EASTER EGG
// ============================================
console.log('%c👋 Hi there!', 'font-size: 20px; font-weight: bold; color: #4d9fff;');
console.log('%Welcome to my personal website!', 'font-size: 14px; color: #666;');
console.log('%cPress T to toggle theme!', 'font-size: 12px; color: #4d9fff;');
