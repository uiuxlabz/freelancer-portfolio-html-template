/**
 * DevFolio Freelancer Portfolio — Main Script
 * Vanilla JS, no dependencies
 */
(function () {
  'use strict';

  /* ---------- DOM Ready ---------- */
  document.addEventListener('DOMContentLoaded', init);

  function init() {
    preloader();
    navbar();
    mobileNav();
    scrollSpy();
    revealOnScroll();
    skillBars();
    projectFilter();
    testimonialCarousel();
    contactForm();
    backToTop();
    currentYear();
  }

  /* ---------- Preloader ---------- */
  function preloader() {
    var el = document.querySelector('.preloader');
    if (!el) return;
    window.addEventListener('load', function () {
      el.classList.add('hidden');
      setTimeout(function () { el.remove(); }, 500);
    });
    // Fallback: hide after 3s even if load is slow
    setTimeout(function () {
      if (el && !el.classList.contains('hidden')) {
        el.classList.add('hidden');
        setTimeout(function () { el.remove(); }, 500);
      }
    }, 3000);
  }

  /* ---------- Navbar Scroll Effect ---------- */
  function navbar() {
    var navbar = document.querySelector('.navbar');
    if (!navbar) return;
    var scrolled = false;
    function onScroll() {
      if (window.scrollY > 60 && !scrolled) {
        navbar.classList.add('scrolled');
        scrolled = true;
      } else if (window.scrollY <= 60 && scrolled) {
        navbar.classList.remove('scrolled');
        scrolled = false;
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------- Mobile Navigation ---------- */
  function mobileNav() {
    var burger = document.querySelector('.navbar__burger');
    var mobileNav = document.querySelector('.mobile-nav');
    if (!burger || !mobileNav) return;

    burger.addEventListener('click', function () {
      burger.classList.toggle('open');
      mobileNav.classList.toggle('open');
      document.body.style.overflow = mobileNav.classList.contains('open') ? 'hidden' : '';
    });

    // Close on link click
    mobileNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        burger.classList.remove('open');
        mobileNav.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  /* ---------- Scroll Spy ---------- */
  function scrollSpy() {
    var links = document.querySelectorAll('.navbar__links a');
    if (!links.length) return;

    var sections = [];
    links.forEach(function (link) {
      var href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        var target = document.querySelector(href);
        if (target) sections.push({ el: target, link: link });
      }
    });

    function onScroll() {
      var scrollPos = window.scrollY + 120;
      var current = null;
      sections.forEach(function (s) {
        if (s.el.offsetTop <= scrollPos) current = s;
      });
      links.forEach(function (l) { l.classList.remove('active'); });
      if (current) current.link.classList.add('active');
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------- Reveal on Scroll (Intersection Observer) ---------- */
  function revealOnScroll() {
    var items = document.querySelectorAll('.reveal, .project-card, .service-card, .team-card, .blog-card');
    if (!items.length) return;

    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

      items.forEach(function (item) { observer.observe(item); });
    } else {
      // Fallback: show all
      items.forEach(function (item) { item.classList.add('revealed'); });
    }
  }

  /* ---------- Skill Bars Animation ---------- */
  function skillBars() {
    var bars = document.querySelectorAll('.skill__fill');
    if (!bars.length) return;

    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var bar = entry.target;
            var target = bar.getAttribute('data-width') || bar.style.width || '0';
            bar.style.width = target;
            observer.unobserve(bar);
          }
        });
      }, { threshold: 0.3 });

      bars.forEach(function (bar) {
        bar.style.width = '0';
        observer.observe(bar);
      });
    } else {
      bars.forEach(function (bar) {
        bar.style.width = bar.getAttribute('data-width') || '80%';
      });
    }
  }

  /* ---------- Project Filter ---------- */
  function projectFilter() {
    var filterBtns = document.querySelectorAll('.projects__filter button');
    var cards = document.querySelectorAll('.project-card');
    if (!filterBtns.length || !cards.length) return;

    filterBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        // Update active state
        filterBtns.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');

        var filter = btn.getAttribute('data-filter');

        cards.forEach(function (card, i) {
          var tags = card.getAttribute('data-tags') || '';
          var show = filter === 'all' || tags.indexOf(filter) !== -1;

          // Stagger animation
          setTimeout(function () {
            card.style.transition = 'opacity .4s ease, transform .4s ease';
            if (show) {
              card.style.display = '';
              requestAnimationFrame(function () {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
              });
            } else {
              card.style.opacity = '0';
              card.style.transform = 'translateY(20px)';
              setTimeout(function () {
                card.style.display = 'none';
              }, 400);
            }
          }, i * 60);
        });
      });
    });
  }

  /* ---------- Testimonial Carousel ---------- */
  function testimonialCarousel() {
    var track = document.querySelector('.testimonial-track');
    var dots = document.querySelectorAll('.testimonial-nav button');
    if (!track || !dots.length) return;

    var slides = track.children;
    var total = slides.length;
    var current = 0;
    var autoInterval;

    function goTo(index) {
      current = ((index % total) + total) % total;
      track.style.transform = 'translateX(-' + (current * 100) + '%)';
      dots.forEach(function (d, i) {
        d.classList.toggle('active', i === current);
      });
    }

    // Dot navigation
    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () {
        goTo(i);
        resetAuto();
      });
    });

    // Auto-scroll
    function startAuto() {
      autoInterval = setInterval(function () {
        goTo(current + 1);
      }, 5000);
    }
    function resetAuto() {
      clearInterval(autoInterval);
      startAuto();
    }

    goTo(0);
    startAuto();
  }

  /* ---------- Contact Form ---------- */
  function contactForm() {
    var form = document.querySelector('.contact__form form');
    if (!form) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var btn = form.querySelector('button[type="submit"]');
      var originalText = btn.textContent;
      btn.textContent = 'Sending...';
      btn.disabled = true;

      // Simulate sending
      setTimeout(function () {
        btn.textContent = 'Message Sent!';
        btn.style.background = '#059669';
        form.reset();

        setTimeout(function () {
          btn.textContent = originalText;
          btn.style.background = '';
          btn.disabled = false;
        }, 3000);
      }, 1500);
    });
  }

  /* ---------- Back to Top ---------- */
  function backToTop() {
    var btn = document.querySelector('.back-to-top');
    if (!btn) return;

    window.addEventListener('scroll', function () {
      btn.classList.toggle('visible', window.scrollY > 400);
    }, { passive: true });

    btn.addEventListener('click', function (e) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---------- Current Year ---------- */
  function currentYear() {
    var el = document.querySelector('.year');
    if (el) el.textContent = new Date().getFullYear();
  }

})();
