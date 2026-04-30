/**
 * Responsive Hamburger Menu Navigation
 * Handles toggling, sliding, and closing of sidebar navigation on mobile/tablet screens
 */

// ============================================================================
// DOM Elements
// ============================================================================
const menuToggle = document.getElementById('menuToggle');
const sidebar = document.getElementById('sidebar');
const closeBtn = document.getElementById('closeBtn');
const menuOverlay = document.getElementById('menuOverlay');
const navLinks = document.querySelectorAll('.sidebar__nav a');
const smoothScrollLinks = document.querySelectorAll('.smooth-scroll');
const topNav = document.getElementById('topNav');
const scrollProgress = document.getElementById('scrollProgress');
const sections = document.querySelectorAll('section[id]');
const animatedElements = document.querySelectorAll('.fade-in, .slide-up');

// ============================================================================
// Functions
// ============================================================================

/**
 * Smooth scroll to section
 * Handles smooth scrolling for anchor links
 */
function smoothScrollToSection(targetId) {
  const targetElement = document.getElementById(targetId);
  if (targetElement) {
    const navHeight = document.querySelector('.top-nav')?.offsetHeight || 0;
    const targetPosition = targetElement.offsetTop - navHeight - 20; // 20px extra padding
    
    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth'
    });
  }
}

/**
 * Handle scroll events for dynamic effects
 * Updates navigation bar, progress bar, and animations
 */
function handleScroll() {
  // Navigation bar scroll effect
  if (window.scrollY > 50) {
    topNav?.classList.add('scrolled');
  } else {
    topNav?.classList.remove('scrolled');
  }

  // Update scroll progress bar
  const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
  const scrollProgress = (window.scrollY / scrollHeight) * 100;
  if (scrollProgress) {
    document.getElementById('scrollProgress').style.width = scrollProgress + '%';
  }

  // Update active navigation link
  updateActiveNavLink();

  // Trigger animations
  triggerAnimations();

  // Parallax effect for hero section
  updateParallax();
}

/**
 * Update active navigation link based on scroll position
 */
function updateActiveNavLink() {
  const scrollPosition = window.scrollY + 100;

  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    const sectionId = section.getAttribute('id');

    if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
      // Remove active class from all nav links
      document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active-section');
      });

      // Add active class to current section nav link
      const activeNavLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
      if (activeNavLink) {
        activeNavLink.classList.add('active-section');
      }
    }
  });
}

/**
 * Trigger scroll animations
 */
function triggerAnimations() {
  animatedElements.forEach(element => {
    const elementTop = element.getBoundingClientRect().top;
    const elementBottom = element.getBoundingClientRect().bottom;

    if (elementTop < window.innerHeight && elementBottom > 0) {
      element.classList.add('visible');
    }
  });
}

/**
 * Update parallax effect for hero section
 */
function updateParallax() {
  const hero = document.querySelector('.hero');
  if (hero) {
    const scrolled = window.scrollY;
    const heroBefore = hero.querySelector('::before');
    if (heroBefore) {
      hero.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
  }
}

/**
 * Toggle the sidebar menu open/close
 * Handles the hamburger button animation and sidebar visibility
 */
function toggleMenu() {
  // Toggle active class on hamburger button (for X animation)
  menuToggle.classList.toggle('active');
  
  // Toggle active class on sidebar (for slide-in animation)
  sidebar.classList.toggle('active');
  
  // Toggle active class on overlay (for opacity transition)
  menuOverlay.classList.toggle('active');
  
  // Update aria-expanded for accessibility
  const isExpanded = menuToggle.classList.contains('active');
  menuToggle.setAttribute('aria-expanded', isExpanded);
}

/**
 * Close the sidebar menu
 * Called when user clicks close button, overlay, or a navigation link
 */
function closeMenu() {
  // Remove active classes
  menuToggle.classList.remove('active');
  sidebar.classList.remove('active');
  menuOverlay.classList.remove('active');
  
  // Update aria-expanded for accessibility
  menuToggle.setAttribute('aria-expanded', 'false');
}

// ============================================================================
// Event Listeners
// ============================================================================

/**
 * Hamburger button click - toggle menu
 */
menuToggle.addEventListener('click', toggleMenu);

/**
 * Close button click - close menu
 */
closeBtn.addEventListener('click', closeMenu);

/**
 * Menu overlay click - close menu
 * Allows closing by clicking outside the sidebar
 */
menuOverlay.addEventListener('click', closeMenu);

/**
 * Smooth scroll links click
 * Handles smooth scrolling for navigation links with .smooth-scroll class
 */
smoothScrollLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const targetId = link.getAttribute('href').substring(1); // Remove # from href
    smoothScrollToSection(targetId);
  });
});

// ============================================================================
// Scroll Event Listener and Initialization
// ============================================================================

/**
 * Add scroll event listener for dynamic effects
 */
window.addEventListener('scroll', handleScroll);

/**
 * Initialize animations on page load
 */
function initializeAnimations() {
  // Trigger initial animations for elements already in view
  triggerAnimations();
  
  // Set initial scroll progress
  const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
  const initialProgress = (window.scrollY / scrollHeight) * 100;
  if (document.getElementById('scrollProgress')) {
    document.getElementById('scrollProgress').style.width = initialProgress + '%';
  }
}

// Initialize animations when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeAnimations);

// Re-trigger animations on window resize
window.addEventListener('resize', () => {
  setTimeout(triggerAnimations, 100);
});

/**
 * Navigation links click - close menu
 * User expects menu to close after selecting a navigation item
 */
navLinks.forEach(link => {
  link.addEventListener('click', () => {
    // Only close if the link is a page navigation link (has href starting with .html or #)
    // This allows the sidebar to stay open for non-navigation elements
    if (link.getAttribute('href').includes('html') || link.getAttribute('href').startsWith('#')) {
      closeMenu();
    }
  });
});

/**
 * Keyboard support - ESC key closes menu
 * Improves accessibility and user experience
 */
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && sidebar.classList.contains('active')) {
    closeMenu();
  }
});

// ============================================================================
// Window Resize Handler
// ============================================================================

/**
 * Close menu when window is resized past mobile breakpoint
 * Prevents sidebar from being stuck open when resizing from mobile to desktop
 */
window.addEventListener('resize', () => {
  // If window is wider than mobile breakpoint, close the menu
  if (window.innerWidth > 768 && sidebar.classList.contains('active')) {
    closeMenu();
  }
});

// ============================================================================
// Body scrolling prevention
// ============================================================================

/**
 * Prevent body scroll when sidebar is open on mobile
 * Improves mobile UX by preventing awkward scrolling behind the sidebar
 */
function preventBodyScroll(prevent) {
  if (prevent) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
}

// Update scroll prevention when menu toggles
menuToggle.addEventListener('click', () => {
  const isOpen = sidebar.classList.contains('active');
  preventBodyScroll(!isOpen); // Prevent if about to be open
});

closeBtn.addEventListener('click', () => {
  preventBodyScroll(false); // Allow scroll when closing
});

menuOverlay.addEventListener('click', () => {
  preventBodyScroll(false); // Allow scroll when closing via overlay
});

