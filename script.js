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

// ============================================================================
// Functions
// ============================================================================

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
