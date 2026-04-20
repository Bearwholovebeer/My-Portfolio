/* navigation, transitions, i18n, shader */

document.addEventListener('DOMContentLoaded', () => {

  /* burger menu */
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

  /* active nav link */
  const currentPage = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  /* simple fade page transition */
  const overlay = document.querySelector('.page-transition');
  if (overlay) {
    document.querySelectorAll('a[href$=".html"]').forEach(link => {
      link.addEventListener('click', e => {
        const href = link.getAttribute('href');
        const linkPage = href.split('/').pop();
        if (linkPage === currentPage) return;
        e.preventDefault();
        overlay.classList.add('active');
        setTimeout(() => { window.location.href = href; }, 300);
      });
    });
  }

  /* scroll reveal */
  const reveals = document.querySelectorAll('.reveal');
  if (reveals.length) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    reveals.forEach(el => observer.observe(el));
  }

  /* dynamic copyright */
  const yearEl = document.getElementById('copyright-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* typewriter - single controlled instance, prevents double-run bug */
  let twTimer = null;
  let twActive = false;

  function runTypewriter(el, text) {
    twActive = false;
    if (twTimer) clearTimeout(twTimer);
    el.textContent = '';
    let i = 0;
    twActive = true;
    function step() {
      if (!twActive || i >= text.length) { twActive = false; return; }
      el.textContent += text[i];
      i++;
      twTimer = setTimeout(step, 40);
    }
    twTimer = setTimeout(step, 400);
  }

  /* language system */
  function applyLang(lang) {
    document.documentElement.setAttribute('data-lang', lang);
    const btn = document.querySelector('.lang-toggle');
    if (btn) btn.textContent = lang === 'fr' ? 'EN' : 'FR';

    document.querySelectorAll('[data-fr]').forEach(el => {
      if (el.classList.contains('hero__typewriter')) return;
      el.textContent = lang === 'fr' ? el.dataset.fr : el.dataset.en;
    });

    const twEl = document.querySelector('.hero__typewriter');
    if (twEl && twEl.dataset.fr) {
      runTypewriter(twEl, lang === 'fr' ? twEl.dataset.fr : twEl.dataset.en);
    }
  }

  /* init language from storage, then bind toggle */
  const saved = localStorage.getItem('lang') || 'fr';
  applyLang(saved);

  const langBtn = document.querySelector('.lang-toggle');
  if (langBtn) {
    langBtn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-lang') || 'fr';
      const next = current === 'fr' ? 'en' : 'fr';
      applyLang(next);
      localStorage.setItem('lang', next);
    });
  }

  /* shader */
  initShader();
});

function initShader() {
  const container = document.getElementById('shader-bg');
  if (!container) return;

  const canvas = document.createElement('canvas');
  container.appendChild(canvas);
  const gl = canvas.getContext('webgl');
  if (!gl) return;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    gl.viewport(0, 0, canvas.width, canvas.height);
  }
  resize();
  window.addEventListener('resize', resize);

  const vs = `
    attribute vec2 a_position;
    void main() { gl_Position = vec4(a_position, 0.0, 1.0); }
  `;

  const fs = `
    precision mediump float;
    uniform float u_time;
    uniform vec2 u_resolution;

    vec3 c1 = vec3(0.15, 0.55, 1.0);
    vec3 c2 = vec3(0.0, 0.85, 1.0);
    vec3 c3 = vec3(0.05, 0.1, 0.18);
    vec3 c4 = vec3(0.08, 0.35, 0.75);

    float hash(vec2 p) {
      return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
    }

    float snoise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      f = f * f * (3.0 - 2.0 * f);
      float a = hash(i);
      float b = hash(i + vec2(1.0, 0.0));
      float c = hash(i + vec2(0.0, 1.0));
      float d = hash(i + vec2(1.0, 1.0));
      return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
    }

    float fbm(vec2 p) {
      float v = 0.0, a = 0.5;
      for (int i = 0; i < 5; i++) {
        v += a * snoise(p);
        p *= 2.0;
        a *= 0.5;
      }
      return v;
    }

    void main() {
      vec2 uv = gl_FragCoord.xy / u_resolution;
      float t = u_time * 0.15;

      vec2 q = vec2(fbm(uv * 3.0 + t * 0.3), fbm(uv * 3.0 + vec2(1.7, 9.2) + t * 0.2));
      vec2 r = vec2(fbm(uv * 4.0 + q + vec2(8.3, 2.8) + t * 0.15), fbm(uv * 4.0 + q + vec2(5.1, 3.3) + t * 0.1));
      float f = fbm(uv * 2.0 + r);

      vec3 col = mix(c3, c4, clamp(f * 2.0, 0.0, 1.0));
      col = mix(col, c1, clamp(length(q) * 0.85, 0.0, 1.0));
      col = mix(col, c2, clamp(r.x * 0.6, 0.0, 1.0));
      col *= 0.85 + 0.3 * f;

      gl_FragColor = vec4(col * 0.75, 1.0);
    }
  `;

  function compile(type, src) {
    const s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    return s;
  }

  const prog = gl.createProgram();
  gl.attachShader(prog, compile(gl.VERTEX_SHADER, vs));
  gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, fs));
  gl.linkProgram(prog);
  gl.useProgram(prog);

  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  const pos = gl.getAttribLocation(prog, 'a_position');
  gl.enableVertexAttribArray(pos);
  gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);

  const uTime = gl.getUniformLocation(prog, 'u_time');
  const uRes = gl.getUniformLocation(prog, 'u_resolution');

  container.classList.add('loaded');

  function draw(t) {
    gl.uniform1f(uTime, t * 0.001);
    gl.uniform2f(uRes, canvas.width, canvas.height);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    requestAnimationFrame(draw);
  }
  requestAnimationFrame(draw);
}
