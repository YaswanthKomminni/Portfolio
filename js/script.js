document.addEventListener('DOMContentLoaded', () => {

  // ==========================================================================
  // INITIALIZE LUCIDE ICONS
  // ==========================================================================
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  // ==========================================================================
  // MOBILE NAVIGATION DRAWER
  // ==========================================================================
  const mobileToggleBtn = document.querySelector('.mobile-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-item, .mobile-get-in-touch');

  const toggleMenu = () => {
    mobileToggleBtn.classList.toggle('active');
    mobileMenu.classList.toggle('open');
    document.body.classList.toggle('overflow-hidden');
  };

  if (mobileToggleBtn && mobileMenu) {
    mobileToggleBtn.addEventListener('click', toggleMenu);
  }

  mobileNavLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileToggleBtn.classList.remove('active');
      mobileMenu.classList.remove('open');
      document.body.classList.remove('overflow-hidden');
    });
  });

  // ==========================================================================
  // PREVENT CLICK PROPAGATION ON NESTED ROW BUTTONS
  // ==========================================================================
  const rowLinkPills = document.querySelectorAll('.row-link-pill');
  rowLinkPills.forEach(pill => {
    pill.addEventListener('click', (e) => {
      // Prevent triggering row-level click navigation when clicking a specific pill button
      e.stopPropagation();
    });
  });

});
