/* ═══════════════════════════════════════════
   NAV · Cursor · Scroll Reveal
   ═══════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* --- Burger menu --- */
  const burger = document.querySelector('.burger');
  const mobileMenu = document.querySelector('.mobile-menu');

  if (burger && mobileMenu) {
    burger.addEventListener('click', () => {
      burger.classList.toggle('open');
      mobileMenu.classList.toggle('open');
      document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
    });
    mobileMenu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        burger.classList.remove('open');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  /* --- Active nav link --- */
  const currentPage = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  /* --- Custom cursor --- */
  const cursor = document.getElementById('cursor');
  if (cursor && window.matchMedia('(hover: hover)').matches) {
    document.addEventListener('mousemove', e => {
      cursor.style.left = e.clientX + 'px';
      cursor.style.top = e.clientY + 'px';
      if (!cursor.classList.contains('visible')) cursor.classList.add('visible');
    });
    document.querySelectorAll('a, button, .card, .cert-card, .tag').forEach(el => {
      el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
    });
    document.addEventListener('mouseleave', () => cursor.classList.remove('visible'));
  }

  /* --- Scroll reveal (IntersectionObserver) --- */
  const reveals = document.querySelectorAll('.reveal');
  if (reveals.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    reveals.forEach(el => observer.observe(el));
  }

  /* --- Typewriter effect (hero) --- */
  const tw = document.querySelector('.hero__typewriter');
  if (tw) {
    const text = tw.dataset.text || tw.textContent;
    tw.textContent = '';
    let i = 0;
    const type = () => {
      if (i < text.length) {
        tw.textContent += text[i];
        i++;
        setTimeout(type, 45);
      }
    };
    setTimeout(type, 600);
  }

});
