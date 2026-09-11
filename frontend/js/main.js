// =========================================================
// DEVI PORTFOLIO — main.js
// Handles: loader, butterfly field, typing effect, scroll reveal,
// navbar behaviour, theme toggle, custom cursor, contact form.
// =========================================================

const BUTTERFLY_SVG = (hue) => `
  <svg viewBox="0 0 100 90">
    <g class="wing wing-left" style="fill:hsl(${hue},80%,72%)"><path d="M50 45 C 20 5, -10 15, 8 45 C -10 75, 20 85, 50 45 Z"/></g>
    <g class="wing wing-right" style="fill:hsl(${hue + 24},75%,76%)"><path d="M50 45 C 80 5, 110 15, 92 45 C 110 75, 80 85, 50 45 Z"/></g>
    <ellipse class="body" cx="50" cy="45" rx="3" ry="18" fill="#2a1d40"/>
  </svg>`;

/* ---------------- LOADER ---------------- */
window.addEventListener("load", () => {
  const loader = document.getElementById("loader");
  setTimeout(() => loader.classList.add("hide"), 1400);
});

/* ---------------- BUTTERFLY FIELD ---------------- */
const field = document.getElementById("butterfly-field");

function randomCurvePath() {
  const w = window.innerWidth;
  const h = window.innerHeight;
  const startEdge = Math.floor(Math.random() * 4); // 0 top,1 right,2 bottom,3 left
  const pad = 60;
  let sx, sy, ex, ey;

  const rand = (a, b) => a + Math.random() * (b - a);

  switch (startEdge) {
    case 0: sx = rand(0, w); sy = -pad; ex = rand(0, w); ey = h + pad; break;
    case 1: sx = w + pad; sy = rand(0, h); ex = -pad; ey = rand(0, h); break;
    case 2: sx = rand(0, w); sy = h + pad; ex = rand(0, w); ey = -pad; break;
    default: sx = -pad; sy = rand(0, h); ex = w + pad; ey = rand(0, h); break;
  }

  // Two control points for a soft S-curve
  const c1x = sx + (ex - sx) * rand(0.2, 0.4) + rand(-200, 200);
  const c1y = sy + (ey - sy) * rand(0.1, 0.3) + rand(-150, 150);
  const c2x = sx + (ex - sx) * rand(0.6, 0.8) + rand(-200, 200);
  const c2y = sy + (ey - sy) * rand(0.7, 0.9) + rand(-150, 150);

  return `path('M ${sx.toFixed(0)} ${sy.toFixed(0)} C ${c1x.toFixed(0)} ${c1y.toFixed(0)}, ${c2x.toFixed(0)} ${c2y.toFixed(0)}, ${ex.toFixed(0)} ${ey.toFixed(0)}')`;
}

function spawnButterfly() {
  const el = document.createElement("div");
  el.className = "butterfly";
  const size = 22 + Math.random() * 26;
  const duration = 16 + Math.random() * 14;
  const hue = 250 + Math.random() * 80; // violet -> pink range

  el.style.width = `${size}px`;
  el.style.height = `${size * 0.86}px`;
  el.style.offsetPath = randomCurvePath();
  el.style.offsetRotate = "auto";
  el.style.animationDuration = `${duration}s`;
  el.style.setProperty("--bfly-opacity", (0.55 + Math.random() * 0.35).toFixed(2));
  el.innerHTML = BUTTERFLY_SVG(hue);

  field.appendChild(el);
  setTimeout(() => el.remove(), duration * 1000 + 500);
}

function isMobile() { return window.innerWidth < 760; }

function startButterflyLoop() {
  const maxAlive = isMobile() ? 2 : 6;
  const spawnTick = () => {
    if (field.childElementCount < maxAlive) spawnButterfly();
    setTimeout(spawnTick, 1800 + Math.random() * 2200);
  };
  // seed a few immediately
  for (let i = 0; i < (isMobile() ? 1 : 3); i++) {
    setTimeout(spawnButterfly, i * 500);
  }
  spawnTick();
}

// Only run the offset-path field if supported (graceful degrade otherwise)
if (CSS.supports("offset-path", "path('M0 0 L10 10')") || CSS.supports("(offset-path: path('M0 0 L10 10'))")) {
  startButterflyLoop();
}

/* ---------------- TYPING ANIMATION ---------------- */
const roles = ["Aspiring Software Developer", "AI/ML Enthusiast", "Web Developer", "Cybersecurity Enthusiast"];
const typedEl = document.getElementById("typedRole");
let roleIndex = 0, charIndex = 0, deleting = false;

function typeLoop() {
  const current = roles[roleIndex];
  if (!deleting) {
    charIndex++;
    typedEl.textContent = current.slice(0, charIndex);
    if (charIndex === current.length) {
      deleting = true;
      setTimeout(typeLoop, 1500);
      return;
    }
  } else {
    charIndex--;
    typedEl.textContent = current.slice(0, charIndex);
    if (charIndex === 0) {
      deleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
    }
  }
  setTimeout(typeLoop, deleting ? 35 : 65);
}
typeLoop();

/* ---------------- SCROLL REVEAL ---------------- */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add("in-view"), i * 60);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

const timelineEl = document.querySelector(".timeline");
if (timelineEl) {
  const tlObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        timelineEl.classList.add("in-view");
        tlObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });
  tlObserver.observe(timelineEl);
}

/* ---------------- NAVBAR ---------------- */
const navbar = document.getElementById("navbar");
const navLinks = document.querySelectorAll(".nav-link");
const sections = document.querySelectorAll(".section");

window.addEventListener("scroll", () => {
  navbar.classList.toggle("scrolled", window.scrollY > 40);
}, { passive: true });

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      navLinks.forEach((l) => l.classList.toggle("active", l.dataset.section === id));
    }
  });
}, { threshold: 0.4, rootMargin: "-80px 0px -50% 0px" });

sections.forEach((s) => sectionObserver.observe(s));

/* ---------------- MOBILE MENU ---------------- */
const hamburger = document.getElementById("hamburger");
const navLinksWrap = document.getElementById("navLinks");

hamburger.addEventListener("click", () => {
  const open = navLinksWrap.classList.toggle("open");
  hamburger.classList.toggle("open", open);
  hamburger.setAttribute("aria-expanded", open);
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    navLinksWrap.classList.remove("open");
    hamburger.classList.remove("open");
  });
});

/* ---------------- SECTION TRANSITION BUTTERFLY ---------------- */
navLinks.forEach((link) => {
  link.addEventListener("click", (e) => {
    const targetId = link.getAttribute("href");
    if (!targetId || !targetId.startsWith("#")) return;
    const target = document.querySelector(targetId);
    if (!target) return;
    e.preventDefault();

    // launch a flourish butterfly across the screen, then scroll
    const flourish = document.createElement("div");
    flourish.className = "butterfly";
    flourish.style.width = "46px";
    flourish.style.height = "40px";
    flourish.style.offsetPath = `path('M -60 ${window.innerHeight * 0.35} C ${window.innerWidth * 0.3} ${window.innerHeight * 0.1}, ${window.innerWidth * 0.7} ${window.innerHeight * 0.55}, ${window.innerWidth + 60} ${window.innerHeight * 0.3}')`;
    flourish.style.offsetRotate = "auto";
    flourish.style.animationDuration = "1.1s";
    flourish.style.setProperty("--bfly-opacity", "0.95");
    flourish.innerHTML = BUTTERFLY_SVG(300);
    field.appendChild(flourish);
    setTimeout(() => flourish.remove(), 1300);

    setTimeout(() => {
      target.scrollIntoView({ behavior: "smooth" });
    }, 180);
  });
});

/* ---------------- THEME TOGGLE ---------------- */
const themeToggle = document.getElementById("themeToggle");
const themeIcon = themeToggle.querySelector(".theme-icon");
const root = document.documentElement;

function applyTheme(theme) {
  root.setAttribute("data-theme", theme);
  themeIcon.textContent = theme === "dark" ? "🌙" : "☀️";
  try { localStorage.setItem("devi-theme", theme); } catch (_) {}
}

(function initTheme() {
  let saved = null;
  try { saved = localStorage.getItem("devi-theme"); } catch (_) {}
  const prefersLight = window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches;
  applyTheme(saved || (prefersLight ? "light" : "dark"));
})();

themeToggle.addEventListener("click", () => {
  const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
  applyTheme(next);
});

/* ---------------- CUSTOM CURSOR ---------------- */
const cursorDot = document.querySelector(".cursor-dot");
const cursorRing = document.querySelector(".cursor-ring");

if (window.matchMedia("(hover:hover)").matches) {
  let ringX = 0, ringY = 0, targetX = 0, targetY = 0;

  window.addEventListener("mousemove", (e) => {
    targetX = e.clientX; targetY = e.clientY;
    cursorDot.style.left = `${e.clientX}px`;
    cursorDot.style.top = `${e.clientY}px`;
  });

  function animateRing() {
    ringX += (targetX - ringX) * 0.18;
    ringY += (targetY - ringY) * 0.18;
    cursorRing.style.left = `${ringX}px`;
    cursorRing.style.top = `${ringY}px`;
    requestAnimationFrame(animateRing);
  }
  animateRing();

  document.querySelectorAll("a, button, .project-card, .glass-card, input, textarea").forEach((el) => {
    el.addEventListener("mouseenter", () => cursorRing.classList.add("expand"));
    el.addEventListener("mouseleave", () => cursorRing.classList.remove("expand"));
  });
}

/* ---------------- PROJECT CARD TILT ---------------- */
document.querySelectorAll("[data-tilt]").forEach((card) => {
  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `perspective(800px) rotateX(${(-y * 6).toFixed(2)}deg) rotateY(${(x * 8).toFixed(2)}deg) translateY(-6px)`;
  });
  card.addEventListener("mouseleave", () => {
    card.style.transform = "";
  });
});

/* ---------------- CONTACT FORM ---------------- */
const contactForm = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");
const sendBtn = document.getElementById("sendBtn");
const toast = document.getElementById("successToast");
const toastText = document.getElementById("successToastText");

contactForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const message = document.getElementById("message").value.trim();

  formStatus.textContent = "";
  formStatus.className = "form-status";

  if (!name || !email || !message) {
    formStatus.textContent = "Please fill in every field before sending.";
    formStatus.classList.add("err");
    return;
  }

  sendBtn.disabled = true;
  sendBtn.textContent = "Sending...";

  try {
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, message }),
    });
    const data = await res.json();

    if (res.ok && data.success) {
      contactForm.reset();
      toastText.textContent = "Message sent — thank you!";
      toast.classList.add("show");
      setTimeout(() => toast.classList.remove("show"), 3200);
      formStatus.textContent = "";
    } else {
      formStatus.textContent = data.error || "Something went wrong. Please try again.";
      formStatus.classList.add("err");
    }
  } catch (err) {
    formStatus.textContent = "Could not reach the server. Is the backend running?";
    formStatus.classList.add("err");
  } finally {
    sendBtn.disabled = false;
    sendBtn.textContent = "Send Message";
  }
});

/* ---------------- FOOTER BUTTERFLY ---------------- */
(function footerButterfly() {
  const track = document.querySelector(".footer-butterfly-track");
  if (!track) return;
  const el = document.createElement("div");
  el.className = "butterfly";
  el.style.width = "30px";
  el.style.height = "26px";
  el.style.position = "absolute";
  el.style.offsetPath = "path('M -40 30 C 200 -10, 400 60, 700 20')";
  el.style.offsetRotate = "auto";
  el.style.animationDuration = "9s";
  el.style.animationIterationCount = "infinite";
  el.style.setProperty("--bfly-opacity", "0.8");
  el.innerHTML = BUTTERFLY_SVG(280);
  track.appendChild(el);
})();

/* ---------------- RESPONSIVE RE-EVALUATION ---------------- */
window.addEventListener("resize", () => {
  // no-op: new butterflies pick up fresh viewport size on next spawn
});
