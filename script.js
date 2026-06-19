  /* ══════════════════════════════════════════
     HERO IMAGE FALLBACK
  ══════════════════════════════════════════ */
  var heroSrcs = [
    'https://drive.google.com/thumbnail?id=1LVkKDpNza5NdkDLQii3Eya9LMO8MO2JC&sz=w1600',
    'https://lh3.googleusercontent.com/d/1LVkKDpNza5NdkDLQii3Eya9LMO8MO2JC',
    'https://drive.google.com/uc?export=view&id=1LVkKDpNza5NdkDLQii3Eya9LMO8MO2JC'
  ];
  var heroIdx = 0;

  function tryHeroFallback(img) {
    heroIdx++;
    if (heroIdx < heroSrcs.length) {
      img.onerror = function () { tryHeroFallback(img); };
      img.src = heroSrcs[heroIdx];
    } else {
      var p = document.getElementById('parallaxPhoto');
      p.style.background = 'linear-gradient(160deg,#1a2e1c 0%,#2d5a30 40%,#3d4a30 70%,#1a1a14 100%)';
      img.style.display = 'none';
    }
  }

  /* ══════════════════════════════════════════
     PROJECT & AWARD IMAGE FALLBACK
  ══════════════════════════════════════════ */
  var imgTryIdx = {};

  function tryImgFallback(img, fileId, wrapperId) {
    if (!imgTryIdx[fileId]) imgTryIdx[fileId] = 0;
    imgTryIdx[fileId]++;

    var srcs = [
      'https://drive.google.com/thumbnail?id=' + fileId + '&sz=w800',
      'https://lh3.googleusercontent.com/d/' + fileId,
      'https://drive.google.com/uc?export=view&id=' + fileId
    ];

    if (imgTryIdx[fileId] < srcs.length) {
      img.onerror = function () { tryImgFallback(img, fileId, wrapperId); };
      img.src = srcs[imgTryIdx[fileId]];
    } else {
      img.style.display = 'none';
    }
  }

  /* ══════════════════════════════════════════
     SMOOTH SCROLL
  ══════════════════════════════════════════ */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var id = this.getAttribute('href');
      if (id === '#') return;
      var target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        window.scrollTo({
          top: target.getBoundingClientRect().top + window.scrollY - 70,
          behavior: 'smooth'
        });
      }
    });
  });

  /* ══════════════════════════════════════════
     PARALLAX + NAVBAR + SKILL BARS
  ══════════════════════════════════════════ */
  var photo        = document.getElementById('parallaxPhoto');
  var navbar       = document.getElementById('navbar');
  var skillBars    = document.querySelectorAll('.skill-bar[data-width]');
  var skillsAnimated = false;

  function onScroll() {
    var scrollY = window.scrollY;
    var heroH   = document.getElementById('hero').offsetHeight;

    /* Parallax foto hero */
    if (scrollY <= heroH + 200) {
      photo.style.transform = 'translateY(' + (scrollY * 0.38) + 'px)';
    }

    /* Navbar frosted glass saat scroll */
    navbar.classList.toggle('scrolled', scrollY > 60);

    /* Animasi skill bar — trigger sekali saat section terlihat */
    if (!skillsAnimated) {
      var skillsSection = document.getElementById('skills');
      if (skillsSection && skillsSection.getBoundingClientRect().top < window.innerHeight * 0.85) {
        skillBars.forEach(function (bar) {
          bar.style.transition = 'width 1.6s cubic-bezier(.4,0,.2,1)';
          bar.style.width = bar.dataset.width + '%';
        });
        skillsAnimated = true;
      }
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });

  /* ══════════════════════════════════════════
     INTERSECTION OBSERVER — FADE IN CARDS
  ══════════════════════════════════════════ */
  var fadeTargets = document.querySelectorAll(
    '.glass-card, .project-card, .award-card, .contact-card, .timeline-item'
  );

  fadeTargets.forEach(function (el) {
    el.style.opacity  = '0';
    el.style.transform = el.style.transform || 'translateY(24px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  });

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.style.opacity  = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  fadeTargets.forEach(function (el) {
    observer.observe(el);
  });

  /* ══════════════════════════════════════════
     STAGGERED DELAY UNTUK GRID CARDS
  ══════════════════════════════════════════ */
  var grids = [
    '.skills-grid .glass-card',
    '.projects-grid .project-card',
    '.awards-grid .award-card',
    '.contact-links-grid .contact-card',
    '.timeline .timeline-item'
  ];

  grids.forEach(function (selector) {
    document.querySelectorAll(selector).forEach(function (el, i) {
      el.style.transitionDelay = (i * 0.08) + 's';
    });
  });

  /* ══════════════════════════════════════════
     ACTIVE NAV LINK HIGHLIGHT (SCROLLSPY)
  ══════════════════════════════════════════ */
  var sections  = document.querySelectorAll('section[id]');
  var navAnchors = document.querySelectorAll('.nav-links a');

  function updateActiveNav() {
    var scrollY = window.scrollY + 100;
    sections.forEach(function (sec) {
      var top    = sec.offsetTop;
      var height = sec.offsetHeight;
      var id     = sec.getAttribute('id');
      if (scrollY >= top && scrollY < top + height) {
        navAnchors.forEach(function (a) {
          a.classList.remove('active');
          if (a.getAttribute('href') === '#' + id) {
            a.classList.add('active');
          }
        });
      }
    });
  }

  /* Style untuk active nav link */
  var navStyle = document.createElement('style');
  navStyle.textContent = '.nav-links a.active { color: var(--text-primary); }';
  document.head.appendChild(navStyle);

  window.addEventListener('scroll', updateActiveNav, { passive: true });

  /* ══════════════════════════════════════════
     INIT — jalankan semua saat halaman siap
  ══════════════════════════════════════════ */
  document.addEventListener('DOMContentLoaded', function () {
    onScroll();
    updateActiveNav();
  });