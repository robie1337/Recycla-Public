import './style.css';

// ============================================================
//  Recycla — Shared site logic (nav, reveal, smooth scroll)
// ============================================================

export function initShared() {
  initNav();
  initReveal();
  initSmoothScroll();
}

// --- Navbar scroll effect ---
function initNav() {
  const nav = document.getElementById('nav');
  if (!nav) return;

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });

  // Mobile toggle
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  if (!navToggle || !navLinks) return;

  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    const spans = navToggle.querySelectorAll('span');
    if (navLinks.classList.contains('open')) {
      spans[0].style.transform = 'translateY(4px) rotate(45deg)';
      spans[1].style.transform = 'translateY(-4px) rotate(-45deg)';
    } else {
      spans[0].style.transform = '';
      spans[1].style.transform = '';
    }
  });

  // Close mobile menu on link click
  navLinks.querySelectorAll('a:not(.nav__dropdown-trigger)').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      const spans = navToggle.querySelectorAll('span');
      spans[0].style.transform = '';
      spans[1].style.transform = '';
    });
  });

  // Mark current page in nav
  const currentPath = window.location.pathname;
  navLinks.querySelectorAll('a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '/' && href === '/') ||
        (currentPath.includes(href) && href !== '/')) {
      link.classList.add('nav--active');
    }
  });
}

// --- Scroll reveal ---
function initReveal() {
  const elements = document.querySelectorAll('.reveal');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const parent = entry.target.parentElement;
        const siblings = Array.from(parent.children).filter(c => c.classList.contains('reveal'));
        const index = siblings.indexOf(entry.target);

        setTimeout(() => {
          entry.target.classList.add('visible');
        }, index * 80);

        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.08,
    rootMargin: '0px 0px -30px 0px'
  });

  elements.forEach(el => observer.observe(el));
}

// --- Smooth scroll for same-page anchors ---
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

// --- Animated stat counters ---
export function initCounters() {
  const counters = document.querySelectorAll('[data-target]');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-target'));
        const duration = 1400;
        const start = performance.now();

        function update(now) {
          const elapsed = now - start;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.round(eased * target);
          if (progress < 1) requestAnimationFrame(update);
        }

        requestAnimationFrame(update);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
}

// --- Team tab system ---
export function initTeamTabs() {
  const tabs = document.querySelectorAll('.team-tab');
  const panels = document.querySelectorAll('.team-panel');
  if (!tabs.length) return;

  function switchTab(tabId) {
    tabs.forEach(t => t.classList.remove('active'));
    const activeTab = document.querySelector(`.team-tab[data-tab="${tabId}"]`);
    if (activeTab) activeTab.classList.add('active');

    panels.forEach(p => p.classList.remove('active'));
    const activePanel = document.getElementById(`panel-${tabId}`);
    if (activePanel) {
      activePanel.classList.add('active');
      activePanel.style.animation = 'none';
      activePanel.offsetHeight;
      activePanel.style.animation = '';
    }
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => switchTab(tab.dataset.tab));
  });

  // Check URL hash for pre-selected tab
  const hash = window.location.hash.replace('#', '');
  if (hash && document.getElementById(`panel-${hash}`)) {
    switchTab(hash);
  }
}
