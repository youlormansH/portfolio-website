(function () {
  'use strict';

  /* Theme toggle */
  var themeToggle = document.getElementById('theme-toggle');
  var root = document.documentElement;

  themeToggle.addEventListener('click', function () {
    var current = root.getAttribute('data-theme');
    var next = current === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  });

  /* Mobile nav toggle */
  var navToggle = document.getElementById('nav-toggle');
  var siteNav = document.getElementById('site-nav');

  navToggle.addEventListener('click', function () {
    var isOpen = siteNav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  siteNav.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      siteNav.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  /* Scrollspy: highlight the nav link for the section in view */
  var navLinks = Array.prototype.slice.call(siteNav.querySelectorAll('a'));
  var sections = navLinks
    .map(function (link) { return document.querySelector(link.getAttribute('href')); })
    .filter(Boolean);

  if ('IntersectionObserver' in window && sections.length) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          var link = siteNav.querySelector('a[href="#' + entry.target.id + '"]');
          if (!link) return;
          if (entry.isIntersecting) {
            navLinks.forEach(function (l) { l.classList.remove('active'); });
            link.classList.add('active');
          }
        });
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
    );
    sections.forEach(function (section) { observer.observe(section); });
  }

  /* Footer year */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* Contact form: opens the user's email client with a pre-filled message */
  var form = document.getElementById('contact-form');
  var status = document.getElementById('form-status');
  var CONTACT_EMAIL = 'youlormans@gmail.com';

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!form.checkValidity()) {
      status.textContent = 'Please fill out all fields with a valid email.';
      return;
    }

    var name = form.elements['name'].value.trim();
    var email = form.elements['email'].value.trim();
    var message = form.elements['message'].value.trim();

    var subject = 'Portfolio contact from ' + name;
    var body = message + '\n\n— ' + name + ' (' + email + ')';
    var mailtoUrl = 'mailto:' + encodeURIComponent(CONTACT_EMAIL) +
      '?subject=' + encodeURIComponent(subject) +
      '&body=' + encodeURIComponent(body);

    window.location.href = mailtoUrl;
    status.textContent = 'Opening your email client to send this to ' + CONTACT_EMAIL + '…';
    form.reset();
  });
})();
