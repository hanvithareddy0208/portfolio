// ================== RESPONSIVE 3D WAVES ==================
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.161.0/build/three.module.js";

const canvas = document.getElementById("bg");
const scene = new THREE.Scene();

// ---------- CAMERA ----------
const camera = new THREE.PerspectiveCamera(65, 1, 0.1, 1000);
camera.position.z = 55;

// ---------- RENDERER ----------
const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
  powerPreference: "high-performance"
});

renderer.setClearColor(0x020617, 1);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));

// ---------- GRADIENT ----------
const GRADIENT_COLORS = [
  new THREE.Color("#22D3EE"),
  new THREE.Color("#A855F7"),
  new THREE.Color("#7C3AED"),
  new THREE.Color("#0EA5E9")
];

let particles, geometry;
let countX = 120, countY = 60, spacing = 2;

// ---------- UTILS ----------
function getGradientColor(t) {
  const n = GRADIENT_COLORS.length - 1;
  const scaled = t * n;
  const i = Math.floor(scaled);
  const frac = scaled - i;
  return new THREE.Color().lerpColors(
    GRADIENT_COLORS[i],
    GRADIENT_COLORS[Math.min(i + 1, n)],
    frac
  );
}

// ---------- RESPONSIVE LOGIC ----------
function calculateGrid() {
  const w = window.innerWidth;
  const h = window.innerHeight;
  const area = w * h;

  if (area > 2_000_000) {
    countX = 180;
    countY = 90;
    spacing = 1.7;
    camera.position.z = 60;
    camera.fov = 65;
  } else if (area > 1_200_000) {
    countX = 140;
    countY = 70;
    spacing = 1.9;
    camera.position.z = 55;
    camera.fov = 68;
  } else {
    countX = 100;
    countY = 50;
    spacing = 2.2;
    camera.position.z = 48;
    camera.fov = 72;
  }

  camera.updateProjectionMatrix();
}

// ---------- CREATE GRID ----------
function createWaveGrid() {
  if (particles) {
    scene.remove(particles);
    geometry.dispose();
  }

  calculateGrid();

  geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(countX * countY * 3);
  const colors = new Float32Array(countX * countY * 3);

  let i3 = 0;
  for (let x = 0; x < countX; x++) {
    const t = x / (countX - 1);
    const col = getGradientColor(t);

    for (let y = 0; y < countY; y++) {
      positions[i3] = (x - countX / 2) * spacing;
      positions[i3 + 1] = -10;
      positions[i3 + 2] = (y - countY / 2) * spacing - 20;

      colors[i3] = col.r;
      colors[i3 + 1] = col.g;
      colors[i3 + 2] = col.b;

      i3 += 3;
    }
  }

  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

  const material = new THREE.PointsMaterial({
    size: 0.35,
    transparent: true,
    opacity: 0.9,
    vertexColors: true,
    depthWrite: false
  });

  particles = new THREE.Points(geometry, material);
  scene.add(particles);
}

// ---------- ANIMATION ----------
const clock = new THREE.Clock();
let isActive = true;

function animate() {
  if (!isActive) return;

  requestAnimationFrame(animate);
  const t = clock.getElapsedTime();
  const pos = geometry.attributes.position.array;

  let i3 = 0;
  for (let i = 0; i < countX; i++) {
    for (let j = 0; j < countY; j++) {
      const wave =
        Math.sin(i * 0.15 + t * 1.1) +
        Math.cos(j * 0.18 + t * 0.9);

      pos[i3 + 1] = wave * 2 - 10;
      i3 += 3;
    }
  }

  geometry.attributes.position.needsUpdate = true;
  renderer.render(scene, camera);
}

// ---------- RESIZE ----------
function resize() {
  const w = window.innerWidth;
  const h = window.innerHeight;

  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  renderer.setSize(w, h);

  createWaveGrid();
}

// ---------- VISIBILITY OPTIMIZATION ----------
document.addEventListener("visibilitychange", () => {
  isActive = !document.hidden;
  if (isActive) animate();
});

// ---------- INIT ----------
resize();
animate();

window.addEventListener("resize", resize);
window.addEventListener("orientationchange", resize);








//hamburger menu
  const hamburger = document.getElementById("hamburger");
  const navLinks = document.getElementById("nav-links");
  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active");
    navLinks.classList.toggle("active");
    const expanded = hamburger.getAttribute("aria-expanded") === "true";
    hamburger.setAttribute("aria-expanded", !expanded);
  });





  const words = [
    "beautiful web apps",
    "scalable full-stack systems",
    "modern UI experiences",
    "high-performance websites"
  ];

  let index = 0;
  let char = 0;
  let isDeleting = false;
  const typingElement = document.querySelector(".typing");

  function typeEffect() {
    const current = words[index];
    typingElement.textContent = current.substring(0, char);

    if (!isDeleting && char < current.length) {
      char++;
    } else if (isDeleting && char > 0) {
      char--;
    } else {
      isDeleting = !isDeleting;
      if (!isDeleting) index = (index + 1) % words.length;
    }

    setTimeout(typeEffect, isDeleting ? 60 : 100);
  }

  typeEffect();


















  const wrapper = document.querySelector(".testimonials-wrapper");
  const track = document.querySelector(".testimonials-track");

  let scrollSpeed = 1.2; // increase for faster scroll
  let isPaused = false;

  // Duplicate content for seamless loop
  track.innerHTML += track.innerHTML;

  function autoScroll() {
    if (!isPaused) {
      wrapper.scrollLeft += scrollSpeed;

      // Reset scroll seamlessly
      if (wrapper.scrollLeft >= track.scrollWidth / 2) {
        wrapper.scrollLeft = 0;
      }
    }
    requestAnimationFrame(autoScroll);
  }

  // Pause if user prefers reduced motion
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    scrollSpeed = 0;
  }

  autoScroll();











document.addEventListener("DOMContentLoaded", () => {
  const projects = document.querySelectorAll(".animate-project");

  // Initially hide all
  projects.forEach(p => p.classList.add("hidden"));

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.remove("hidden");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  projects.forEach(p => observer.observe(p));
});

















  const scrollBtn = document.getElementById("scrollTopBtn");

  // Show button after scrolling down 300px
  window.addEventListener("scroll", () => {
    if (window.scrollY > 300) {
      scrollBtn.classList.add("show");
    } else {
      scrollBtn.classList.remove("show");
    }
  });

  // Smooth scroll to top on click
  scrollBtn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });

