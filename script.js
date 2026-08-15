/* ==========================================================================
   LAWINDI THARUNYA — PERSONAL PORTFOLIO INTERACTIVE SCRIPT
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Reset scroll position to top hero section on page refresh
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }
  if (window.location.hash) {
    window.history.replaceState(null, null, window.location.pathname + window.location.search);
  }
  window.scrollTo(0, 0);

  // Initialize all interactive modules
  initThemeToggle();
  initCanvasAnimation();
  initScrollObserver();
  initStatCounters();
  initNavigation();
  initCopyActions();
  initFormHandler();
  initCvModal();
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
    width = canvas.width = document.documentElement.clientWidth;
    height = canvas.height = document.documentElement.clientHeight;
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
      this.isSecondary = Math.random() <= 0.4;
    }

    draw() {
      const isLight = document.documentElement.getAttribute('data-theme') === 'light';
      const color1 = isLight ? 'rgba(13, 148, 136, 0.35)' : 'rgba(6, 182, 212, 0.4)';
      const color2 = isLight ? 'rgba(219, 39, 119, 0.3)' : 'rgba(244, 114, 182, 0.3)';
      ctx.fillStyle = this.isSecondary ? color2 : color1;
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

  // Smooth Click Scroll to Sections
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || !targetId) return;

      const targetSection = document.querySelector(targetId);
      if (targetSection) {
        e.preventDefault();
        const navHeight = navbar ? navbar.offsetHeight : 80;
        const targetPosition = targetSection.getBoundingClientRect().top + window.pageYOffset - navHeight + 10;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });

        // Close mobile drawer if open
        if (navMenu && navMenu.classList.contains('active')) {
          navMenu.classList.remove('active');
          if (navToggle) navToggle.setAttribute('aria-expanded', 'false');
        }
      }
    });
  });

  // Smooth ScrollSpy & Navbar Glass Transition
  let ticking = false;
  function updateNavOnScroll() {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    let current = '';
    const scrollPos = window.scrollY + 140;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href === `#${current}`) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(updateNavOnScroll);
      ticking = true;
    }
  }, { passive: true });

  // Mobile Drawer Toggle
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      const isOpen = navMenu.classList.contains('active');
      navToggle.setAttribute('aria-expanded', isOpen);
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
   6. CONTACT FORM ASYNC MESSAGE SUBMISSION HANDLER
   -------------------------------------------------------------------------- */
function initFormHandler() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const nameInput = document.getElementById('formName');
  const emailInput = document.getElementById('formEmail');
  const subjectInput = document.getElementById('formSubject');
  const messageInput = document.getElementById('formMessage');
  const submitBtn = document.getElementById('sendMessageSubmitBtn');
  const btnText = submitBtn ? submitBtn.querySelector('.btn-text') : null;
  const statusMsg = document.getElementById('formStatusMessage');

  form.addEventListener('submit', async (e) => {
    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const subject = subjectInput ? subjectInput.value.trim() : '';
    const message = messageInput.value.trim();

    if (!name || !email || !message) {
      e.preventDefault();
      if (window.showToastNotification) {
        window.showToastNotification('⚠️ Please fill in all required fields before sending.');
      }
      return;
    }

    // If running directly from local file:///, allow standard HTML form submission
    // so FormSubmit can send the activation email and process the form without CORS restriction
    if (window.location.protocol === 'file:') {
      if (submitBtn) {
        submitBtn.disabled = true;
        if (btnText) btnText.textContent = 'Submitting...';
      }
      return; // let standard browser form submit proceed
    }

    e.preventDefault();

    // Set loading state on button
    if (submitBtn) {
      submitBtn.disabled = true;
      if (btnText) btnText.textContent = 'Sending Message...';
    }

    if (statusMsg) {
      statusMsg.style.display = 'none';
      statusMsg.textContent = '';
    }

    try {
      const formData = new FormData(form);
      const response = await fetch('https://formsubmit.co/ajax/mpltharunya22@gmail.com', {
        method: 'POST',
        headers: {
          'Accept': 'application/json'
        },
        body: formData
      });

      const data = await response.json();

      if (response.ok && (data.success === 'true' || data.success === true)) {
        form.reset();
        if (statusMsg) {
          statusMsg.style.display = 'block';
          statusMsg.className = 'form-status-alert form-status-success';
          statusMsg.innerHTML = '<strong>Message Sent Successfully!</strong> Thank you for reaching out. Your message has been delivered to my inbox and I will respond promptly.';
        }
        if (window.showToastNotification) {
          window.showToastNotification('Message sent successfully!');
        }
      } else {
        if (data && data.message) {
          if (statusMsg) {
            statusMsg.style.display = 'block';
            statusMsg.className = 'form-status-alert form-status-info';
            statusMsg.innerHTML = `<strong>Notice:</strong> ${data.message}`;
          }
        } else {
          throw new Error('Submission failed');
        }
      }
    } catch (err) {
      // Fallback to standard form submission
      form.submit();
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        if (btnText) btnText.textContent = 'Send Message';
      }
    }
  });
}

/* --------------------------------------------------------------------------
   7. LIGHT / DARK THEME TOGGLE CONTROLLER
   -------------------------------------------------------------------------- */
function initThemeToggle() {
  const themeToggle = document.getElementById('themeToggle');
  if (!themeToggle) return;
  const themeIcon = themeToggle.querySelector('.theme-icon');

  // Check saved theme or system preference
  const savedTheme = localStorage.getItem('theme') || 
    (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');

  applyTheme(savedTheme, false);

  themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';

    // Trigger icon spin animation
    themeToggle.classList.add('animating');
    setTimeout(() => themeToggle.classList.remove('animating'), 500);

    // Exact center of the theme toggle button
    const rect = themeToggle.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;

    // Radius needed to cover the furthest screen corner
    const clientWidth = document.documentElement.clientWidth;
    const clientHeight = document.documentElement.clientHeight;
    const endRadius = Math.hypot(
      Math.max(x, clientWidth - x),
      Math.max(y, clientHeight - y)
    );

    // Native View Transitions API for Circular Wave Screen Reveal
    if (document.startViewTransition && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const transition = document.startViewTransition(() => {
        applyTheme(newTheme, true);
      });

      transition.ready.then(() => {
        const clipPath = [
          `circle(0px at ${x}px ${y}px)`,
          `circle(${endRadius}px at ${x}px ${y}px)`
        ];

        document.documentElement.animate(
          {
            clipPath: clipPath
          },
          {
            duration: 750,
            easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
            pseudoElement: '::view-transition-new(root)'
          }
        );
      });
    } else {
      // Fallback for browsers without View Transitions
      applyTheme(newTheme, true);
    }
  });

  function applyTheme(theme, showToastMsg = false) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);

    if (themeIcon) {
      themeIcon.textContent = theme === 'light' ? '🌙' : '☀️';
    }
    themeToggle.setAttribute('title', theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode');
    themeToggle.setAttribute('aria-label', theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode');

    if (showToastMsg && window.showToastNotification) {
      window.showToastNotification(`Switched to ${theme.toUpperCase()} mode ✨`);
    }
  }
}

/* --------------------------------------------------------------------------
   8. MODERN ATS CV MODAL CONTROLLER & ATS PLAINTEXT EXPORT
   -------------------------------------------------------------------------- */
function initCvModal() {
  const modal = document.getElementById('cvModal');
  if (!modal) return;

  const openButtons = document.querySelectorAll('.btn-open-cv, [data-open-cv]');
  const closeButton = document.getElementById('closeCvModal');
  const copyPlaintextBtn = document.getElementById('copyCvPlaintextBtn');

  const atsPlainText = `LAWINDI THARUNYA
Data Science & Analytics | Machine Learning & Statistical Modeling
Colombo, Sri Lanka | Phone: +94 71 543 5636 | Email: mpltharunya22@gmail.com
LinkedIn: linkedin.com/in/lawindi-tharunya | GitHub: github.com/LavindiTharunya

============================================================
PROFESSIONAL SUMMARY
============================================================
Proactive and analytical undergraduate reading for a BSc (Hons) in Management & Information Technology at the University of Kelaniya, building practical foundations in Data Science, Analytics, and Enterprise Data Systems. Gaining hands-on experience in Python (Pandas, NumPy, Matplotlib), SQL, exploratory data analysis (EDA), and relational database modeling, alongside exposure to machine learning fundamentals. Supported by certified banking operational experience at Bank of Ceylon with structured transaction records, proven leadership as Chief Coordinator for island-wide tech hackathons (hackX Jr. 9.0), and award-winning product ideation (InCo 2026 2nd Runner-up). Seeking a Data Science / Data Analyst Internship to apply analytical problem-solving, learn industry workflows, and contribute to data-backed decisions.

============================================================
EDUCATION
============================================================
BSc (Hons) in Management & Information Technology | 2023 - Present
University of Kelaniya, Sri Lanka
- Specialization Focus: Data Science, Machine Learning, Statistical Analysis, Database Management Systems (DBMS), Operational Research, and Software Systems Architecture.

Diploma in English | 2023
ICBT Campus, Sri Lanka
- Coursework: Executive Business Communication, Technical Documentation, Professional Presentations.

============================================================
TECHNICAL & ANALYTICAL SKILLS
============================================================
- Data Science & Analytics: Exploratory Data Analysis (EDA), Data Preprocessing, Statistical Analysis Basics, Data Visualization (Matplotlib, Seaborn), Machine Learning Fundamentals
- Programming: Python (Pandas, NumPy, Matplotlib), SQL, Java, C++, JavaScript (ES6+), HTML5/CSS3
- Databases & Tools: MySQL, PostgreSQL, JavaDB, Relational Schema Design (ERD), Git, GitHub, Jupyter Notebook, VS Code, Google Colab
- Business & Analytical: Data Storytelling, Quantitative Analysis, Requirement Analysis, Operational Research, Process Improvement
- Languages: English (Professional Working), Sinhala (Native), Tamil (Moderate)

============================================================
KEY PROJECTS & DATA INNOVATION
============================================================
Hydro Habit - Smart Hydration for Family Care (InCo 2026) | 2026
Role: Concept Lead & Data/GTM Strategist | Award: 2nd Runner-up (Marketing Category)
- Architected user behavioral data tracking flow and health metric benchmarks for an IoT smart hydration monitoring product.
- Conducted quantitative market research, user segmentation analysis, and financial feasibility modeling for InCo 2026.

PharmaLink - Prescription Management & Database System | 2024 - 2025
Role: Database Architecture & Backend Logic | Stack: Java, JavaDB, SQL
- Engineered a desktop prescription management application for pharmacies to track inventory flow and patient records.
- Designed normalized relational database schema (ERD), implemented SQL queries, and integrated Java CRUD operations.

Connect 4 Algorithmic State Engine | 2024
Role: Algorithms & UI Architecture | Stack: C++
- Developed an interactive Connect 4 application in C++ utilizing 2D matrix traversal algorithms for dynamic win detection.
- Implemented structured game loop state management and an interactive player configuration dashboard.

============================================================
PROFESSIONAL EXPERIENCE
============================================================
Bank of Ceylon (BOC) | Trainee (Certified)
March 2024 - January 2025 | Sri Lanka
- Managed day-to-day operational banking workflows and reconciled daily transaction datasets in compliance with strict accuracy standards.
- Conducted financial documentation verification, customer profile audits, and structured data handling across core banking database platforms.
- Assisted 50+ clients daily with account documentation, query resolution, and operational guidance.

============================================================
CERTIFICATIONS & AWARDS
============================================================
- 2nd Runner-up (Marketing Category) - InCo 2026 Product Competition (2026)
- Python Essentials for Data Science - Cisco Networking Academy (In Progress)
- Introduction to Data Science - Cisco Networking Academy
- Introduction to Programming & Data Analysis - Kaggle
- Data Fundamentals - IBM
- Workplace Skills Certificate - MAS Holdings x University of Kelaniya

============================================================
LEADERSHIP & EXTRACURRICULAR INVOLVEMENT
============================================================
- Chief Coordinator - hackX Jr. 9.0 (2026): Led central organizing committee for premier island-wide inter-school hackathon.
- Member - AIESEC in University of Kelaniya (2023 - Present)
- Volunteer - IEEE Student Branch, University of Kelaniya
- Member - Industrial Management Science Students' Association (IMSSA)`;

  function openModal() {
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  openButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal();
    });
  });

  if (closeButton) {
    closeButton.addEventListener('click', closeModal);
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });

  if (copyPlaintextBtn) {
    copyPlaintextBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(atsPlainText).then(() => {
        if (window.showToastNotification) {
          window.showToastNotification('📋 Plaintext ATS Resume copied to clipboard!');
        } else {
          alert('Plaintext ATS Resume copied to clipboard!');
        }
      }).catch(() => {
        const tempTextArea = document.createElement('textarea');
        tempTextArea.value = atsPlainText;
        document.body.appendChild(tempTextArea);
        tempTextArea.select();
        document.execCommand('copy');
        document.body.removeChild(tempTextArea);
        if (window.showToastNotification) {
          window.showToastNotification('📋 Plaintext ATS Resume copied to clipboard!');
        }
      });
    });
  }
}

