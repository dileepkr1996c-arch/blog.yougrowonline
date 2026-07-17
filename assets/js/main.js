/* ==========================================
   You Grow Online - Main JavaScript
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ----- Day/Night Theme Toggle ----- */
  const themeToggle = document.querySelector('.theme-toggle');
  const storedTheme = localStorage.getItem('ygo_theme') || 'light';

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('ygo_theme', theme);
  }

  applyTheme(storedTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      applyTheme(next);
    });
  }

  /* ----- Preloader ----- */
  const preloader = document.querySelector('.preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      preloader.classList.add('loaded');
    });
    setTimeout(() => {
      preloader.classList.add('loaded');
    }, 1500);
  }

  /* ----- Header Scroll Effect ----- */
  const header = document.querySelector('.header');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    if (currentScroll > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    lastScroll = currentScroll;
  });

  /* ----- Mobile Hamburger Menu ----- */
  var hamburger = document.querySelector('.hamburger');
  var navMenu = document.querySelector('.nav-menu');

  function closeMobileMenu() {
    if (hamburger) hamburger.classList.remove('active');
    if (navMenu) navMenu.classList.remove('open');
    document.body.style.overflow = '';
  }

  function toggleMobileMenu() {
    if (!hamburger || !navMenu) return;
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('open');
    document.body.style.overflow = navMenu.classList.contains('open') ? 'hidden' : '';
  }

  if (hamburger) {
    hamburger.addEventListener('click', toggleMobileMenu);
  }

  /* Close menu on link click */
  document.querySelectorAll('.nav-link, .nav-cta, .sub-nav-item a').forEach(function(link) {
    link.addEventListener('click', closeMobileMenu);
  });

  /* Close menu on Escape key */
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') closeMobileMenu();
  });

  /* ----- Active Nav Link on Scroll ----- */
  const sections = document.querySelectorAll('section[id], .page-header[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  function setActiveLink() {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 150;
      const sectionHeight = section.offsetHeight;
      if (pageYOffset >= sectionTop && pageYOffset < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href').includes(current)) {
        link.classList.add('active');
      }
    });
  }

  if (sections.length > 0) {
    window.addEventListener('scroll', setActiveLink);
  }

  /* ----- Scroll Animations (Intersection Observer) ----- */
  const animateElements = document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right, .fade-in-up');

  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  animateElements.forEach(el => observer.observe(el));

  /* ----- Smooth Scroll for Anchor Links ----- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ----- Portfolio Filter ----- */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const portfolioItems = document.querySelectorAll('.portfolio-item');

  if (filterBtns.length > 0) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.filter;
        portfolioItems.forEach(item => {
          if (filter === 'all' || item.dataset.category === filter) {
            item.style.display = 'block';
            item.style.opacity = '0';
            setTimeout(() => { item.style.opacity = '1'; }, 50);
          } else {
            item.style.display = 'none';
          }
        });
      });
    });
  }

  /* ----- Contact Form -> Google Sheets ----- */
  const SHEETS_URL = 'https://script.google.com/macros/s/AKfycby7lOtY1D6ew-xXiw4ZYfcexKihbP6VkhONZLJgi1DTZuaTIyiribAhzL0ej2IEPLl9/exec';
  const contactForms = document.querySelectorAll('.contact-form-form');

  contactForms.forEach(form => {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      const submitBtn = this.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = 'Sending...';
      submitBtn.disabled = true;

      const data = {
        name: this.querySelector('[name="name"]')?.value || '',
        email: this.querySelector('[name="email"]')?.value || '',
        phone: this.querySelector('[name="phone"]')?.value || '',
        service: this.querySelector('[name="service"]')?.value || '',
        budget: this.querySelector('[name="budget"]')?.value || '',
        message: this.querySelector('[name="message"]')?.value || '',
        source: this.dataset.source || ''
      };

      fetch(SHEETS_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      .then(() => {
        submitBtn.innerHTML = 'Message Sent ✓';
        submitBtn.style.background = 'linear-gradient(135deg, #3fb950, #2ea043)';
        this.reset();
        setTimeout(() => {
          submitBtn.innerHTML = originalText;
          submitBtn.style.background = '';
          submitBtn.disabled = false;
        }, 3000);
      })
      .catch(() => {
        submitBtn.innerHTML = 'Message Sent ✓';
        submitBtn.style.background = 'linear-gradient(135deg, #3fb950, #2ea043)';
        this.reset();
        setTimeout(() => {
          submitBtn.innerHTML = originalText;
          submitBtn.style.background = '';
          submitBtn.disabled = false;
        }, 3000);
      });
    });
  });

  /* ----- Newsletter Form ----- */
  const newsletterForm = document.querySelector('.footer-newsletter form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const input = this.querySelector('input');
      const btn = this.querySelector('button');
      const originalText = btn.textContent;
      btn.textContent = 'Subscribed ✓';
      btn.style.background = 'linear-gradient(135deg, #3fb950, #2ea043)';
      setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = '';
        input.value = '';
      }, 2500);
    });
  }

  /* ----- Counter Animation ----- */
  function animateCounter(el) {
    const target = parseInt(el.dataset.target);
    const duration = 2000;
    const totalSteps = Math.max(Math.floor(duration / 16), 1);
    const step = Math.max(Math.ceil(target / totalSteps), 1);
    let current = 0;

    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      el.textContent = current + (el.dataset.suffix || '');
    }, 16);
  }

  const counters = document.querySelectorAll('.counter');
  if (counters.length > 0) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(c => counterObserver.observe(c));
  }

});
