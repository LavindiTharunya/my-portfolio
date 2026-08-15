/* ==========================================================================
   LAWINDI THARUNYA — PERSONAL PORTFOLIO INTERACTIVE SCRIPT
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize all interactive modules
  initCanvasAnimation();
  initScrollObserver();
  initStatCounters();
  initNavigation();
  initCopyActions();
  initFormHandler();
});

/* --------------------------------------------------------------------------
   1. LIQUID RIPPLE & DOT GRID CANVAS ANIMATION (Data x Hydration Signature)
   -------------------------------------------------------------------------- */
function initCanvasAnimation() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width, height;
  let mouse = { x: null, y: null, radius: 150 };
  let particles = [];
  let ripples = [];

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    createParticles();
  }

  window.addEventListener('resize', resize);

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('click', (e) => {
    ripples.push({
      x: e.clientX,
      y: e.clientY,
      radius: 0,
      maxRadius: 180,
      alpha: 0.8
    });
  });

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.size = Math.random() * 2 + 1;
      this.baseX = this.x;
      this.baseY = this.y;
      this.density = (Math.random() * 20) + 1;
      this.color = Math.random() > 0.4 ? 'rgba(6, 182, 212, 0.4)' : 'rgba(244, 114, 182, 0.3)';
    }

    draw() {
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.closePath();
      ctx.fill();
    }

    update() {
      // Mouse magnetic effect
      if (mouse.x && mouse.y) {
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < mouse.radius) {
          let forceDirectionX = dx / distance;
          let forceDirectionY = dy / distance;
          let maxDistance = mouse.radius;
          let force = (maxDistance - distance) / maxDistance;
          let directionX = forceDirectionX * force * this.density;
          let directionY = forceDirectionY * force * this.density;
          this.x -= directionX;
          this.y -= directionY;
        } else {
          if (this.x !== this.baseX) {
            let dx = this.x - this.baseX;
            this.x -= dx / 10;
          }
          if (this.y !== this.baseY) {
            let dy = this.y - this.baseY;
            this.y -= dy / 10;
          }
        }
      }
    }
  }

  function createParticles() {
    particles = [];
    const numberOfParticles = Math.floor((width * height) / 14000);
    for (let i = 0; i < numberOfParticles; i++) {
      particles.push(new Particle());
    }
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    // Render & Update Ripples
    for (let i = 0; i < ripples.length; i++) {
      let r = ripples[i];
      ctx.save();
      ctx.beginPath();
      ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(6, 182, 212, ${r.alpha})`;
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.restore();

      r.radius += 3;
      r.alpha -= 0.015;

      if (r.alpha <= 0 || r.radius >= r.maxRadius) {
        ripples.splice(i, 1);
        i--;
      }
    }

    // Render & Update Particles
    for (let i = 0; i < particles.length; i++) {
      particles[i].draw();
      particles[i].update();
    }

    requestAnimationFrame(animate);
  }

  resize();
  animate();
}

/* --------------------------------------------------------------------------
   2. SCROLL REVEAL OBSERVER
   -------------------------------------------------------------------------- */
function initScrollObserver() {
  const revealElements = document.querySelectorAll(
    '.about-card, .skill-card, .project-card, .timeline-item, .cert-card, .leadership-featured, .extra-card, .contact-info-card, .contact-form-card'
  );

  const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        obs.unobserve(entry.target);
      }
    });
  }, observerOptions);

  revealElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });
}

/* --------------------------------------------------------------------------
   3. ANIMATED STAT COUNTERS
   -------------------------------------------------------------------------- */
function initStatCounters() {
  const statNumbers = document.querySelectorAll('.stat-number');
  let animated = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        animated = true;
        statNumbers.forEach(stat => {
          const target = parseInt(stat.getAttribute('data-target') || '0', 10);
          const suffix = stat.getAttribute('data-suffix') || '';
          let current = 0;
          const step = Math.max(1, Math.floor(target / 20));
          const timer = setInterval(() => {
            current += step;
            if (current >= target) {
              current = target;
              clearInterval(timer);
            }
            stat.textContent = current + suffix;
          }, 60);
        });
      }
    });
  }, { threshold: 0.5 });

  const statsStrip = document.querySelector('.stats-strip');
  if (statsStrip) observer.observe(statsStrip);
}

/* --------------------------------------------------------------------------
   4. NAVIGATION & ACTIVE LINK HIGHLIGHTING
   -------------------------------------------------------------------------- */
function initNavigation() {
  const navbar = document.querySelector('.navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-links');

  // Sticky Navbar Glass Shadow on Scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Active Section ScrollSpy
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });

  // Mobile Drawer Toggle
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      const isOpen = navMenu.classList.contains('active');
      navToggle.setAttribute('aria-expanded', isOpen);
    });

    // Close menu when clicking link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
      });
    });
  }
}

/* --------------------------------------------------------------------------
   5. COPY TO CLIPBOARD & TOAST NOTIFICATION
   -------------------------------------------------------------------------- */
function initCopyActions() {
  const copyableItems = document.querySelectorAll('[data-copy]');
  const toast = document.getElementById('toast');

  copyableItems.forEach(item => {
    item.addEventListener('click', () => {
      const textToCopy = item.getAttribute('data-copy');
      if (!textToCopy) return;

      navigator.clipboard.writeText(textToCopy).then(() => {
        showToast(`Copied "${textToCopy}" to clipboard!`);
      }).catch(err => {
        showToast(`Contact: ${textToCopy}`);
      });
    });
  });

  function showToast(message) {
    if (!toast) return;
    toast.querySelector('.toast-msg').textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3000);
  }

  window.showToastNotification = showToast;
}

/* --------------------------------------------------------------------------
   6. CONTACT FORM DEMO SUBMISSION HANDLER
   -------------------------------------------------------------------------- */
function initFormHandler() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const nameInput = document.getElementById('formName');
    const emailInput = document.getElementById('formEmail');
    
    if (window.showToastNotification) {
      window.showToastNotification(`Thank you ${nameInput.value || 'there'}! Message sent successfully.`);
    }

    form.reset();
  });
}
