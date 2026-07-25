document.addEventListener('DOMContentLoaded', () => {

  // ==========================================================================
  // INITIALIZE LUCIDE ICONS
  // ==========================================================================
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  // Set current year in footer
  const copyrightYear = document.querySelector('.footer-copyright');
  if (copyrightYear) {
    const currentYear = new Date().getFullYear();
    copyrightYear.textContent = `© ${currentYear} KOMMINNI YASWANTH`;
  }

  // ==========================================================================
  // HERO TEXT CINEMATIC ENTRANCE (CHARACTER SPLITTING)
  // ==========================================================================
  const animateText = (elementId) => {
    const el = document.getElementById(elementId);
    if (!el) return;
    
    const text = el.textContent.trim();
    el.innerHTML = ''; // Clear original text
    
    // Split into characters to wrap them
    [...text].forEach((char, index) => {
      const span = document.createElement('span');
      if (char === ' ') {
        span.innerHTML = '&nbsp;';
      } else {
        span.textContent = char;
      }
      // Apply staggered transition delay
      span.style.transitionDelay = `${index * 35}ms`;
      el.appendChild(span);
    });
    
    // Trigger animation frame layout and add transition class
    requestAnimationFrame(() => {
      el.classList.add('animate');
    });
  };

  animateText('hero-title-first');
  animateText('hero-title-second');

  // ==========================================================================
  // CINEMATIC CUSTOM CURSOR (LERP/PHYSICS FOLLOW)
  // ==========================================================================
  const cursorDot = document.querySelector('.custom-cursor');
  const cursorFollower = document.querySelector('.custom-cursor-follower');
  
  const mouse = { x: 0, y: 0 }; // Mouse coordinates
  const dotPos = { x: 0, y: 0 }; // Dot target coordinates
  const followerPos = { x: 0, y: 0 }; // Follower lag coordinates

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  // Linear Interpolation loop for smooth lagging trailing effect
  const tickCursor = () => {
    // Smooth follow dot
    dotPos.x += (mouse.x - dotPos.x) * 0.3;
    dotPos.y += (mouse.y - dotPos.y) * 0.3;
    if (cursorDot) {
      cursorDot.style.left = `${dotPos.x}px`;
      cursorDot.style.top = `${dotPos.y}px`;
    }

    // Lagging follower ring (lower multiplier = more lag)
    followerPos.x += (mouse.x - followerPos.x) * 0.12;
    followerPos.y += (mouse.y - followerPos.y) * 0.12;
    if (cursorFollower) {
      cursorFollower.style.left = `${followerPos.x}px`;
      cursorFollower.style.top = `${followerPos.y}px`;
    }

    requestAnimationFrame(tickCursor);
  };
  tickCursor();

  // Hover states for cursor expansion
  const hoverTargets = document.querySelectorAll('a, button, .project-row, .email-cta-box, .social-pill, .panel-row-item.linkable, .highlightable-exp');
  hoverTargets.forEach(target => {
    target.addEventListener('mouseenter', () => {
      document.body.classList.add('hovering');
    });
    target.addEventListener('mouseleave', () => {
      document.body.classList.remove('hovering');
    });
  });

  // ==========================================================================
  // HERO PARALLAX MOUSE EFFECT
  // ==========================================================================
  const heroSection = document.getElementById('hero');
  const floatingCircle = document.querySelector('.floating-circle');
  
  if (heroSection && floatingCircle) {
    heroSection.addEventListener('mousemove', (e) => {
      const wWidth = window.innerWidth;
      const wHeight = window.innerHeight;
      
      // Calculate normalized mouse offsets (-0.5 to 0.5)
      const mouseXOffset = (e.clientX / wWidth) - 0.5;
      const mouseYOffset = (e.clientY / wHeight) - 0.5;
      
      // Move circle opposite to mouse direction
      const circleX = mouseXOffset * -50; 
      const circleY = mouseYOffset * -50;
      
      floatingCircle.style.transform = `translate3d(${circleX}px, ${circleY}px, 0)`;
    });

    heroSection.addEventListener('mouseleave', () => {
      floatingCircle.style.transform = 'translate3d(0, 0, 0)';
    });
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
  // PREVENT CLICK PROPAGATION ON NESTED BUTTONS
  // ==========================================================================
  const rowLinkPills = document.querySelectorAll('.row-link-pill');
  rowLinkPills.forEach(pill => {
    pill.addEventListener('click', (e) => {
      e.stopPropagation();
    });
  });

  // ==========================================================================
  // CINEMATIC SCROLL REVEALS
  // ==========================================================================
  const revealElements = document.querySelectorAll('.reveal-cinematic');
  
  // Stagger transition delays in the project rows
  const projectListRows = document.querySelectorAll('.work-section .project-row');
  projectListRows.forEach((row, index) => {
    row.style.transitionDelay = `${(index % 4) * 80}ms`;
  });

  if (window.IntersectionObserver) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: 0.05,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback: activate immediately
    revealElements.forEach(el => el.classList.add('active'));
  }

});
