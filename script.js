/* ============================================================
   DATA — Skills & Tech
============================================================ */
const skillBarsData = [
  { name: "Python", pct: 80 },
  { name: "Data Analysis", pct: 75 },
  { name: "HTML & CSS", pct: 90 },
  { name: "JavaScript", pct: 72 },
  { name: "Statistics", pct: 70 },
  { name: "Finance", pct: 78 },
];

const aboutSkillBarsData = [
  { name: "Web Design", pct: 90 },
  { name: "Python", pct: 80 },
  { name: "Data Analysis", pct: 75 },
  { name: "Trading & Finance", pct: 78 },
];

const techPillsData = [
  "Python",
  "Pandas",
  "NumPy",
  "Matplotlib",
  "HTML5",
  "CSS3",
  "JavaScript",
  "SQL",
  "Excel",
  "Statistics",
  "Power BI",
  "Git",
  "Figma",
  "VS Code",
  "Jupyter",
  "Finance",
];

/* ============================================================
   RENDER SKILL BARS (generic)
============================================================ */
function renderSkillBars(containerId, data) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = data
    .map(
      (s) => `
    <div class="skill-item reveal">
      <div class="skill-meta">
        <span class="skill-name">${s.name}</span>
        <span class="skill-pct">${s.pct}%</span>
      </div>
      <div class="skill-track">
        <div class="skill-fill" data-pct="${s.pct}" style="width:0"></div>
      </div>
    </div>
  `
    )
    .join("");
}

/* ============================================================
   RENDER TECH PILLS
============================================================ */
function renderTechPills() {
  const container = document.getElementById("techPills");
  if (!container) return;

  container.innerHTML = techPillsData
    .map((t) => `<div class="tech-pill reveal"><span class="dot"></span>${t}</div>`)
    .join("");
}

/* ============================================================
   ANIMATE SKILL BARS
============================================================ */
function animateSkillBars() {
  document.querySelectorAll(".skill-fill").forEach((bar) => {
    const pct = bar.dataset.pct;
    // Only animate if not already animated
    if (bar.style.width === "0px" || bar.style.width === "0" || bar.style.width === "") {
      // Delay slightly for visual effect
      setTimeout(() => {
        bar.style.width = pct + "%";
      }, 200);
    }
  });
}

/* ============================================================
   SCROLL REVEAL
============================================================ */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");

        // Animate bars when skill blocks appear
        if (entry.target.closest("#skills") || entry.target.closest("#about")) {
          animateSkillBars();
        }
      }
    });
  },
  { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
);

function initScrollReveal() {
  document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));
}

/* ============================================================
   NAVBAR — scroll state + active section highlighting
============================================================ */
const navbar = document.getElementById("navbar");
const navLinks = document.querySelectorAll(".nav-links a");
const sections = document.querySelectorAll("section[id]");

function onScroll() {
  // Sticky style
  if (window.scrollY > 40) navbar?.classList.add("scrolled");
  else navbar?.classList.remove("scrolled");

  // Active link
  let current = "";
  sections.forEach((sec) => {
    if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
  });

  navLinks.forEach((link) => {
    link.classList.toggle("active", link.getAttribute("href") === "#" + current);
  });
}

window.addEventListener("scroll", onScroll, { passive: true });

/* ============================================================
   DARK / LIGHT THEME TOGGLE
============================================================ */
const themeToggle = document.getElementById("themeToggle");

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);
}

function initTheme() {
  const saved = localStorage.getItem("theme") || "dark";
  applyTheme(saved);
}

themeToggle?.addEventListener("click", () => {
  const current = document.documentElement.getAttribute("data-theme") || "dark";
  applyTheme(current === "dark" ? "light" : "dark");
});

/* ============================================================
   MOBILE MENU
============================================================ */
const hamburger = document.getElementById("hamburger");
const mobileMenu = document.getElementById("mobileMenu");

function closeMobileMenu() {
  hamburger?.classList.remove("open");
  mobileMenu?.classList.remove("open");
  document.body.style.overflow = "";
}

hamburger?.addEventListener("click", () => {
  hamburger.classList.toggle("open");
  mobileMenu.classList.toggle("open");
  document.body.style.overflow = mobileMenu.classList.contains("open") ? "hidden" : "";
});

document.querySelectorAll(".mobile-menu-link").forEach((a) => {
  a.addEventListener("click", () => closeMobileMenu());
});

/* ============================================================
   CONTACT FORM HANDLER (Backend API)
============================================================ */
async function handleSubmit(e) {
  e.preventDefault();

  const form = document.getElementById("contactForm");
  const success = document.getElementById("formSuccess");
  const errorBox = document.getElementById("formError");
  const btn = form.querySelector(".form-submit");

  if (!success || !errorBox || !btn) return;

  // Reset UI
  success.style.display = "none";
  errorBox.style.display = "none";
  errorBox.textContent = "";

  const name = document.getElementById("contactName")?.value?.trim() || "";
  const email = document.getElementById("contactEmail")?.value?.trim() || "";
  const subject = document.getElementById("contactSubject")?.value?.trim() || "";
  const message = document.getElementById("contactMessage")?.value?.trim() || "";

  // Build payload expected by backend: { name, email, message }
  const messageWithSubject = subject ? `Subject: ${subject}\n\n${message}` : message;

  btn.textContent = "Sending…";
  btn.style.opacity = "0.7";
  btn.disabled = true;

  try {
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        email,
        message: messageWithSubject,
      }),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok || !data.success) {
      throw new Error(data?.error || "Failed to send message. Please try again.");
    }

    success.textContent = data?.message || "Message sent successfully! I will get back to you soon.";
    success.style.display = "block";
    form.style.display = "none";
  } catch (err) {
    errorBox.textContent = err?.message || "Something went wrong. Please try again.";
    errorBox.style.display = "block";
  } finally {
    btn.textContent = "Send Message →";
    btn.style.opacity = "1";
    btn.disabled = false;
  }
}

/* ============================================================
   SMOOTH SCROLL for all anchor links
============================================================ */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const href = this.getAttribute("href");
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        closeMobileMenu();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });
}

/* ============================================================
   PROFILE IMAGE FALLBACK
============================================================ */
function initProfileImageFallback() {
  const img = document.getElementById("profileImage");
  const placeholder = document.getElementById("profilePlaceholder");
  if (!img || !placeholder) return;

  const revealPlaceholder = () => {
    img.style.display = "none";
    placeholder.style.display = "flex";
  };

  img.addEventListener("load", () => {
    // Image exists and loaded successfully
    placeholder.style.display = "none";
    img.style.display = "block";
  });

  img.addEventListener("error", () => {
    revealPlaceholder();
  });

  // If the browser already tried loading, handle immediate state.
  if (img.complete && img.naturalWidth === 0) revealPlaceholder();
}

/* ============================================================
   INIT — run everything on DOM ready
============================================================ */
document.addEventListener("DOMContentLoaded", () => {
  initTheme();

  // Render dynamic content
  renderSkillBars("skillBars", skillBarsData);
  renderSkillBars("aboutSkillBars", aboutSkillBarsData);
  renderTechPills();

  // Init scroll observers after content is rendered
  requestAnimationFrame(() => {
    initScrollReveal();
    onScroll();
  });

  initSmoothScroll();

  // Scroll indicator
  const scrollIndicator = document.getElementById("scrollIndicator");
  const aboutEl = document.getElementById("about");
  const doScroll = () => aboutEl?.scrollIntoView({ behavior: "smooth", block: "start" });
  scrollIndicator?.addEventListener("click", doScroll);
  scrollIndicator?.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") doScroll();
  });

  // Contact form submit
  const contactForm = document.getElementById("contactForm");
  contactForm?.addEventListener("submit", handleSubmit);

  // Profile image
  initProfileImageFallback();
});

/* ============================================================
   CURSOR — subtle custom cursor glow (desktop only)
============================================================ */
if (window.matchMedia && window.matchMedia("(pointer: fine)").matches) {
  const cursor = document.createElement("div");
  cursor.style.cssText = `
    position:fixed;width:8px;height:8px;
    background:var(--gold);border-radius:50%;
    pointer-events:none;z-index:99999;
    transform:translate(-50%,-50%);
    transition:width 0.2s,height 0.2s,opacity 0.2s;
    box-shadow:0 0 12px var(--gold);
    opacity:0.8;
  `;

  const ring = document.createElement("div");
  ring.style.cssText = `
    position:fixed;width:28px;height:28px;
    border:1px solid var(--gold-dim);border-radius:50%;
    pointer-events:none;z-index:99998;
    transform:translate(-50%,-50%);
    transition:transform 0.12s ease, width 0.25s ease, height 0.25s ease, opacity 0.2s;
    opacity:0.5;
  `;

  document.body.appendChild(cursor);
  document.body.appendChild(ring);

  let mx = 0,
    my = 0,
    rx = 0,
    ry = 0;

  document.addEventListener("mousemove", (e) => {
    mx = e.clientX;
    my = e.clientY;
    cursor.style.left = mx + "px";
    cursor.style.top = my + "px";
  });

  (function loopRing() {
    rx += (mx - rx) * 0.15;
    ry += (my - ry) * 0.15;
    ring.style.left = rx + "px";
    ring.style.top = ry + "px";
    requestAnimationFrame(loopRing);
  })();

  const interactive = document.querySelectorAll("a,button,.project-card,.tech-pill");
  interactive.forEach((el) => {
    el.addEventListener("mouseenter", () => {
      cursor.style.width = "12px";
      cursor.style.height = "12px";
      ring.style.width = "44px";
      ring.style.height = "44px";
      ring.style.opacity = "0.8";
    });
    el.addEventListener("mouseleave", () => {
      cursor.style.width = "8px";
      cursor.style.height = "8px";
      ring.style.width = "28px";
      ring.style.height = "28px";
      ring.style.opacity = "0.5";
    });
  });
}

// Expose for any legacy inline handlers (kept for safety)
window.closeMobileMenu = closeMobileMenu;
window.handleSubmit = handleSubmit;

