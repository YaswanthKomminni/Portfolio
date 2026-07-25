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
  // PROJECT HOVER IMAGE PREVIEW (CURSOR ATTACHED)
  // ==========================================================================
  const projectRows = document.querySelectorAll('.project-row');
  const hoverPreview = document.getElementById('project-hover-preview');
  const previewImg = document.getElementById('hover-preview-img');
  const previewFallback = document.getElementById('hover-preview-fallback');
  
  let previewPos = { x: 0, y: 0 };
  let currentPreviewPos = { x: 0, y: 0 };
  let velocityX = 0;
  let lastMouseX = 0;
  
  window.addEventListener('mousemove', (e) => {
    previewPos.x = e.clientX;
    previewPos.y = e.clientY;
    
    // Calculate rotation based on horizontal velocity
    const speed = e.clientX - lastMouseX;
    velocityX += (speed - velocityX) * 0.15;
    lastMouseX = e.clientX;
  });

  // Interpolation loop to smooth out hover image following
  const tickPreviewFollow = () => {
    currentPreviewPos.x += (previewPos.x - currentPreviewPos.x) * 0.12;
    currentPreviewPos.y += (previewPos.y - currentPreviewPos.y) * 0.12;
    
    // Calculate tilt angle based on velocity (cap at 12deg)
    let tilt = velocityX * 0.15;
    tilt = Math.max(-12, Math.min(12, tilt));
    
    if (hoverPreview && hoverPreview.classList.contains('active')) {
      // Offsets: position preview box 40px above and 20px right of cursor
      const posX = currentPreviewPos.x + 180;
      const posY = currentPreviewPos.y - 100;
      
      hoverPreview.style.left = `${posX}px`;
      hoverPreview.style.top = `${posY}px`;
      hoverPreview.style.transform = `translate3d(-50%, -50%, 0) scale(1) rotate(${tilt}px) rotate(${tilt}deg)`;
    }
    
    requestAnimationFrame(tickPreviewFollow);
  };
  tickPreviewFollow();

  projectRows.forEach(row => {
    row.addEventListener('mouseenter', () => {
      const imgPath = row.getAttribute('data-image');
      const fallbackIconName = row.getAttribute('data-fallback');
      const fallbackGradient = row.getAttribute('data-gradient');
      
      if (imgPath) {
        previewImg.src = imgPath;
        previewImg.classList.remove('hidden');
        previewFallback.classList.add('hidden');
      } else {
        // Render fallback container with gradient and icon
        previewImg.classList.add('hidden');
        previewFallback.className = `hover-preview-fallback ${fallbackGradient || 'purple-gradient'}`;
        previewFallback.innerHTML = `<i data-lucide="${fallbackIconName || 'cpu'}" class="fallback-icon-svg"></i>`;
        if (typeof lucide !== 'undefined') {
          lucide.createIcons({ parent: previewFallback });
        }
        previewFallback.classList.remove('hidden');
      }
      
      hoverPreview.classList.add('active');
    });

    row.addEventListener('mouseleave', () => {
      hoverPreview.classList.remove('active');
    });
  });

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
