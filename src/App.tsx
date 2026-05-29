import { useEffect, useMemo, useRef, useState, type CSSProperties, type FormEvent } from "react";
import * as THREE from "three";
import { footerHtml, pages } from "./pagesContent";

type RouteName = keyof typeof pages;

type PortfolioUser = {
  username: string;
  email: string;
  phone: string;
  linkedIn: string;
  password: string;
  image: string;
};

type ProjectCaseStudy = {
  id: string;
  title: string;
  category: string;
  stack: string[];
  image: string;
  summary: string;
  problem: string;
  solution: string;
  outcome: string;
};

type PortfolioSettings = {
  headline: string;
  availability: string;
  featuredService: string;
};

const defaultSettings: PortfolioSettings = {
  headline: "Full-stack developer focused on polished, practical web experiences.",
  availability: "Available for freelance and student project support",
  featuredService: "Portfolio and business website builds",
};

const projectCaseStudies: ProjectCaseStudy[] = [
  {
    id: "travel-planner",
    title: "Interactive Travel Planner",
    category: "Frontend",
    stack: ["HTML", "CSS", "JavaScript", "Responsive UI"],
    image: "/images/Screenshot (177).png",
    summary: "A visual travel planning interface with destination discovery, itinerary sections, and smooth UI states.",
    problem: "Travel pages often look attractive but make planning feel scattered across too many sections.",
    solution: "I designed grouped destination cards, day-wise planning areas, and clear calls to action for a faster planning flow.",
    outcome: "The result feels more organized, mobile-friendly, and easier to scan for users comparing trip ideas.",
  },
  {
    id: "smart-home",
    title: "Smart Home Dashboard",
    category: "Dashboard",
    stack: ["JavaScript", "Cards", "Controls", "Data UI"],
    image: "/images/OIP.jpg",
    summary: "A dashboard concept for controlling connected devices with tidy cards and status-focused layout.",
    problem: "Device dashboards can become visually noisy when every control competes for attention.",
    solution: "I used compact cards, consistent controls, and grouped device states so users can act quickly.",
    outcome: "The dashboard reads clearly across desktop and mobile, with room for real data integration.",
  },
  {
    id: "resume-builder",
    title: "Resume Builder Interface",
    category: "Web App",
    stack: ["React", "Forms", "Preview", "Print UX"],
    image: "/images/4.png",
    summary: "A structured web-app interface for entering resume data and previewing a formatted result.",
    problem: "Resume tools need to balance many fields without making the user feel lost.",
    solution: "I separated data entry into focused sections and planned a preview-first workflow.",
    outcome: "The concept supports a smoother path from raw details to a presentable resume.",
  },
];

function loadSettings(): PortfolioSettings {
  try {
    const saved = localStorage.getItem("portfolioSettings");
    return saved ? { ...defaultSettings, ...(JSON.parse(saved) as Partial<PortfolioSettings>) } : defaultSettings;
  } catch {
    return defaultSettings;
  }
}

const routes: Array<{ key: RouteName; label: string; href: string }> = [
  { key: "home", label: "Home", href: "#/" },
  { key: "about", label: "About", href: "#/about" },
  { key: "resources", label: "Resources", href: "#/resources" },
  { key: "services", label: "Services", href: "#/services" },
  { key: "contact", label: "Contact", href: "#/contact" },
];

const routeLabels: Record<RouteName, string> = {
  home: "Home",
  about: "About",
  resources: "Resources",
  services: "Services",
  contact: "Contact",
  login: "Login",
};

const loginPageHtml = `<section class="auth-section auth-modern">
  <div class="auth-wrapper">
    <aside class="auth-branding" id="loginInfo" aria-label="Portfolio login overview">
      <div class="auth-brand-content">
        <span class="auth-kicker">Portfolio Access</span>
        <h1 class="auth-brand-title">Welcome back, creator.</h1>
        <p class="auth-brand-subtitle">Sign in to manage your profile, preview account details, and keep your portfolio identity fresh.</p>

        <div class="auth-stats" aria-label="Account highlights">
          <div><strong>01</strong><span>Profile</span></div>
          <div><strong>24/7</strong><span>Preview</span></div>
          <div><strong>Fast</strong><span>Updates</span></div>
        </div>

        <div class="auth-features">
          <div class="auth-feature">
            <i class="fa-solid fa-user-pen"></i>
            <span>Edit your profile details in one focused place.</span>
          </div>
          <div class="auth-feature">
            <i class="fa-solid fa-image"></i>
            <span>Refresh your avatar and navbar identity instantly.</span>
          </div>
          <div class="auth-feature">
            <i class="fa-solid fa-shield-halved"></i>
            <span>Try the complete flow safely with demo login.</span>
          </div>
        </div>
      </div>
    </aside>

    <div class="auth-forms-wrapper">
      <form id="loginForm" class="auth-form auth-form-login active">
        <div class="auth-form-header">
          <span class="auth-form-icon"><i class="fa-solid fa-right-to-bracket"></i></span>
          <div>
            <h2>Sign In</h2>
            <p>Open your portfolio profile dashboard.</p>
          </div>
        </div>

        <div class="form-group">
          <label for="loginIdentifier">Email or Username</label>
          <input type="text" id="loginIdentifier" placeholder="demo@hanvitha.dev" autocomplete="username" required>
        </div>

        <div class="form-group">
          <label for="loginPassword">Password</label>
          <div class="password-field">
            <input type="password" id="loginPassword" placeholder="Enter password" autocomplete="current-password" required>
            <button type="button" class="password-toggle" data-password-target="loginPassword" aria-label="Show password">
              <i class="fa-solid fa-eye"></i>
            </button>
          </div>
        </div>

        <div class="auth-button-row">
          <button type="submit" class="auth-submit-btn">
            <i class="fa-solid fa-arrow-right-to-bracket"></i>
            Sign In
          </button>
          <button type="button" class="auth-demo-btn" id="demoLogin">
            <i class="fa-solid fa-wand-magic-sparkles"></i>
            Demo
          </button>
        </div>

        <div id="loginError" class="auth-error" aria-live="polite"></div>

        <div class="auth-form-footer">
          <p>New here? <span id="goSignup" class="auth-link">Create an account</span></p>
        </div>
      </form>

      <form id="signupForm" class="auth-form auth-form-signup">
        <div class="auth-form-header">
          <span class="auth-form-icon"><i class="fa-solid fa-user-plus"></i></span>
          <div>
            <h2>Create Account</h2>
            <p>Set up the profile shown across your portfolio.</p>
          </div>
        </div>

        <div class="auth-field-grid">
          <div class="form-group">
            <label for="signupUsername">Username</label>
            <input type="text" id="signupUsername" placeholder="Hanvitha" autocomplete="username" required>
          </div>

          <div class="form-group">
            <label for="signupEmail">Email</label>
            <input type="email" id="signupEmail" placeholder="you@example.com" autocomplete="email" required>
          </div>

          <div class="form-group">
            <label for="signupPhone">Phone</label>
            <input type="text" id="signupPhone" placeholder="10 digit number" inputmode="numeric" required>
          </div>

          <div class="form-group">
            <label for="signupLinkedIn">LinkedIn</label>
            <input type="text" id="signupLinkedIn" placeholder="linkedin.com/in/yourname">
          </div>
        </div>

        <div class="auth-field-grid">
          <div class="form-group">
            <label for="signupPassword">Password</label>
            <div class="password-field">
              <input type="password" id="signupPassword" placeholder="Create password" autocomplete="new-password" required>
              <button type="button" class="password-toggle" data-password-target="signupPassword" aria-label="Show password">
                <i class="fa-solid fa-eye"></i>
              </button>
            </div>
          </div>

          <div class="form-group">
            <label for="signupConfirm">Confirm Password</label>
            <div class="password-field">
              <input type="password" id="signupConfirm" placeholder="Repeat password" autocomplete="new-password" required>
              <button type="button" class="password-toggle" data-password-target="signupConfirm" aria-label="Show password">
                <i class="fa-solid fa-eye"></i>
              </button>
            </div>
          </div>
        </div>

        <div class="form-group">
          <label for="signupImage">Profile Image</label>
          <div class="file-input-wrapper">
            <input type="file" id="signupImage" accept="image/*" required>
            <span class="file-label"><i class="fa-solid fa-cloud-arrow-up"></i> Choose profile image</span>
          </div>
        </div>

        <div class="password-strength" aria-live="polite">
          <span id="passwordStrengthBar"></span>
          <small id="passwordStrengthText">Use 8+ characters with letters and numbers.</small>
        </div>

        <button type="submit" class="auth-submit-btn">
          <i class="fa-solid fa-user-check"></i>
          Create Account
        </button>

        <div id="signupError" class="auth-error" aria-live="polite"></div>

        <div class="auth-form-footer">
          <p>Already have an account? <span id="goLogin" class="auth-link">Sign in</span></p>
        </div>
      </form>

      <form id="profileForm" class="auth-form auth-profile-form">
        <div class="auth-form-header">
          <span class="auth-form-icon"><i class="fa-solid fa-id-card"></i></span>
          <div>
            <h2>Your Profile</h2>
            <p>Review and update your account information.</p>
          </div>
        </div>

        <div class="profile-img">
          <img id="profileImgPreview" alt="Profile Image">
          <button type="button" id="editImageBtn"><i class="fa-solid fa-camera"></i> Change Image</button>
          <input type="file" id="profileImage" accept="image/*" style="display:none;">
        </div>

        <div class="form-grid">
          <div>
            <label for="profileUsername">Username</label>
            <input type="text" id="profileUsername" disabled>
          </div>
          <div>
            <label for="profileEmail">Email</label>
            <input type="email" id="profileEmail" disabled>
          </div>
          <div>
            <label for="profilePhone">Phone</label>
            <input type="text" id="profilePhone" disabled>
          </div>
          <div>
            <label for="profileLinkedIn">LinkedIn</label>
            <input type="text" id="profileLinkedIn" disabled>
          </div>
          <div>
            <label for="profilePassword">Password</label>
            <input type="password" id="profilePassword" disabled>
          </div>
        </div>

        <div class="profile-buttons">
          <button type="button" id="editProfileBtn"><i class="fa-solid fa-pen"></i> Edit</button>
          <button type="submit" id="saveProfileBtn" style="display:none;"><i class="fa-solid fa-check"></i> Save</button>
        </div>

        <div id="profileError" class="auth-error" aria-live="polite"></div>
      </form>
    </div>
  </div>
</section>`;

const aboutPageHtml = `<section class="about-pro-hero" id="about">
  <div class="about-pro-copy">
    <span class="section-kicker">About Hanvitha</span>
    <h1>Full-stack developer focused on useful, polished web experiences.</h1>
    <p>I design and build interfaces that feel clear, responsive, and reliable, then connect them to practical backend logic when the product needs real data and workflows.</p>
    <div class="about-pro-actions">
      <a href="#projects" class="btn-primary">View Work</a>
      <a href="#/contact" class="btn-outline">Start a Project</a>
    </div>
  </div>
  <div class="about-pro-panel">
    <div><strong>Frontend</strong><span>React, JavaScript, responsive UI</span></div>
    <div><strong>Backend</strong><span>APIs, auth flows, data handling</span></div>
    <div><strong>Design Sense</strong><span>Layout, motion, accessibility basics</span></div>
  </div>
</section>

<section class="about-story-section">
  <div class="about-story-grid">
    <article>
      <span class="section-kicker">How I Think</span>
      <h2>First I make it understandable. Then I make it beautiful.</h2>
      <p>My process starts with the user's path: what they need to do, what information matters, and where the experience can become simpler. From there I shape the interface, build the logic, test responsiveness, and refine the details until the page feels intentional.</p>
    </article>
    <div class="about-principles">
      <div><i class="fa-solid fa-compass-drafting"></i><strong>Structured Layouts</strong><span>Sections are planned for scanning, hierarchy, and smooth navigation.</span></div>
      <div><i class="fa-solid fa-code-branch"></i><strong>Maintainable Code</strong><span>Reusable patterns, readable naming, and project structure that can grow.</span></div>
      <div><i class="fa-solid fa-wand-magic-sparkles"></i><strong>Polished Details</strong><span>Hover states, spacing, responsive behavior, and small interaction touches.</span></div>
    </div>
  </div>
</section>

<section class="capability-section" id="skills">
  <h2 class="title"><span>Capability Map</span></h2>
  <p class="section-subtitle">A practical view of the work I can take from idea to finished interface.</p>
  <div class="capability-grid">
    <div class="capability-card"><i class="fa-brands fa-react"></i><h3>Frontend Apps</h3><p>Component-based pages, dashboards, forms, filters, animations, and responsive experiences.</p><span>React - JavaScript - CSS</span></div>
    <div class="capability-card"><i class="fa-solid fa-server"></i><h3>API Integration</h3><p>Connect UI screens to backend data, handle loading states, errors, auth, and user flows.</p><span>REST APIs - Auth - JSON</span></div>
    <div class="capability-card"><i class="fa-solid fa-database"></i><h3>Data Workflows</h3><p>Plan fields, forms, validation, profile data, and CRUD-style interactions for apps.</p><span>SQL - Local storage - Forms</span></div>
    <div class="capability-card"><i class="fa-solid fa-gauge-high"></i><h3>UI Quality</h3><p>Improve page structure, fix layout issues, tune spacing, and make pages feel more professional.</p><span>Responsive - Accessible - Fast</span></div>
  </div>
</section>

<section class="timeline-pro-section">
  <h2 class="title"><span>Growth Timeline</span></h2>
  <div class="timeline-pro">
    <div><span>2022</span><strong>Programming Foundation</strong><p>Built problem-solving habits and learned how to break tasks into smaller logic steps.</p></div>
    <div><span>2023</span><strong>Frontend Craft</strong><p>Focused on HTML, CSS, JavaScript, responsive layouts, and interactive UI behavior.</p></div>
    <div><span>2024</span><strong>Full-stack Practice</strong><p>Added APIs, authentication basics, database concepts, and complete web app flows.</p></div>
    <div><span>2025</span><strong>Portfolio Polish</strong><p>Improving real project presentation, UX details, performance, and deployment readiness.</p></div>
  </div>
</section>`;

function getPageHtml(route: RouteName) {
  if (route === "about") return aboutPageHtml;
  if (route === "resources") return resourcesPageHtml;
  if (route === "services") return servicesPageHtml;
  if (route === "login") return loginPageHtml;
  return pages[route];
}

const resourcesPageHtml = `<section class="resources-pro-hero">
  <div>
    <span class="section-kicker">Resources</span>
    <h1>A sharper learning hub for building real web projects.</h1>
    <p>Use these resources to move from tutorials into practical projects: frontend foundations, full-stack workflows, UI references, and career-ready habits.</p>
  </div>
  <div class="resource-focus-card">
    <strong>Recommended Path</strong>
    <span>HTML/CSS -> JavaScript -> React -> APIs -> Deployment</span>
  </div>
</section>

<section class="resource-library-section">
  <div class="resource-toolbar">
    <div class="resource-search">
      <i class="fa-solid fa-magnifying-glass"></i>
      <input type="search" placeholder="Search resources" data-resource-search>
    </div>
    <div class="resource-filters">
      <button class="resource-filter active" data-resource-filter="all">All</button>
      <button class="resource-filter" data-resource-filter="frontend">Frontend</button>
      <button class="resource-filter" data-resource-filter="backend">Backend</button>
      <button class="resource-filter" data-resource-filter="career">Career</button>
    </div>
  </div>

  <div class="resource-pro-grid">
    <a class="resource-pro-card" data-resource-card data-category="frontend" href="https://developer.mozilla.org" target="_blank">
      <i class="fa-brands fa-html5"></i><span>Frontend</span><h3>MDN Web Docs</h3><p>Reliable reference for HTML, CSS, JavaScript, accessibility, and browser behavior.</p>
    </a>
    <a class="resource-pro-card" data-resource-card data-category="frontend" href="https://react.dev" target="_blank">
      <i class="fa-brands fa-react"></i><span>Frontend</span><h3>React Docs</h3><p>Modern React concepts, hooks, component patterns, and app-building guidance.</p>
    </a>
    <a class="resource-pro-card" data-resource-card data-category="backend" href="https://nodejs.org" target="_blank">
      <i class="fa-brands fa-node-js"></i><span>Backend</span><h3>Node.js</h3><p>Runtime fundamentals for APIs, tooling, scripts, and server-side JavaScript.</p>
    </a>
    <a class="resource-pro-card" data-resource-card data-category="backend" href="https://www.postman.com" target="_blank">
      <i class="fa-solid fa-plug"></i><span>Backend</span><h3>Postman</h3><p>Test APIs, inspect responses, organize requests, and debug integrations.</p>
    </a>
    <a class="resource-pro-card" data-resource-card data-category="career" href="https://github.com" target="_blank">
      <i class="fa-brands fa-github"></i><span>Career</span><h3>GitHub</h3><p>Host projects, show commit history, document work, and collaborate professionally.</p>
    </a>
    <a class="resource-pro-card" data-resource-card data-category="career" href="https://www.freecodecamp.org" target="_blank">
      <i class="fa-solid fa-graduation-cap"></i><span>Career</span><h3>freeCodeCamp</h3><p>Practice-based lessons for frontend, backend, certificates, and project building.</p>
    </a>
  </div>
</section>

<section class="resource-playbook-section">
  <h2 class="title"><span>Project Playbook</span></h2>
  <div class="playbook-grid">
    <div><span>01</span><strong>Pick a small problem</strong><p>Choose one clear user goal instead of building a huge vague app.</p></div>
    <div><span>02</span><strong>Sketch the flow</strong><p>List screens, states, form fields, and data before writing code.</p></div>
    <div><span>03</span><strong>Build in slices</strong><p>Finish layout, then interactions, then data, then polish.</p></div>
    <div><span>04</span><strong>Document the result</strong><p>Add screenshots, setup steps, features, and what you learned.</p></div>
  </div>
</section>

<section class="learning-path-section">
  <h2 class="title"><span>Skill Checklist</span></h2>
  <div class="learning-path">
    <label class="path-item"><input type="checkbox" data-path-item="layout"><span>Build one fully responsive landing page.</span></label>
    <label class="path-item"><input type="checkbox" data-path-item="forms"><span>Create a form with validation and user feedback.</span></label>
    <label class="path-item"><input type="checkbox" data-path-item="api"><span>Connect a React screen to API-style data.</span></label>
    <label class="path-item"><input type="checkbox" data-path-item="deploy"><span>Deploy a project and write a strong README.</span></label>
  </div>
</section>`;

const servicesPageHtml = `<section class="services-pro-hero">
  <div>
    <span class="section-kicker">Services</span>
    <h1>Clean websites, smarter interfaces, and practical full-stack support.</h1>
    <p>Choose a focused service track or combine them for a complete build. Each option is shaped around clarity, responsive design, and maintainable delivery.</p>
    <a href="#/contact" class="btn-primary">Request a Quote</a>
  </div>
  <div class="service-scoreboard">
    <div><strong>24h</strong><span>first response</span></div>
    <div><strong>3</strong><span>review stages</span></div>
    <div><strong>100%</strong><span>responsive focus</span></div>
  </div>
</section>

<section class="services-section">
  <h2 class="title"><span>Service Tracks</span></h2>
  <div class="services-pro-grid">
    <article class="service-pro-card featured"><i class="fa-solid fa-laptop-code"></i><h3>Portfolio or Business Website</h3><p>Modern multi-section website with polished layout, responsive design, contact flow, and deployment-ready structure.</p><ul><li>Homepage and inner pages</li><li>Mobile-first layout</li><li>Contact and CTA sections</li></ul><strong>Best for personal brands</strong></article>
    <article class="service-pro-card"><i class="fa-solid fa-layer-group"></i><h3>UI Redesign Pass</h3><p>Improve an existing page that feels messy, outdated, or inconsistent.</p><ul><li>Spacing and visual hierarchy</li><li>Color and component cleanup</li><li>Responsive fixes</li></ul><strong>Best for quick upgrades</strong></article>
    <article class="service-pro-card"><i class="fa-solid fa-plug-circle-bolt"></i><h3>Frontend + API Flow</h3><p>Build screens that connect to real or mock data with clear loading, empty, and error states.</p><ul><li>API integration</li><li>Forms and validation</li><li>Data rendering</li></ul><strong>Best for web apps</strong></article>
    <article class="service-pro-card"><i class="fa-solid fa-user-graduate"></i><h3>Student Project Support</h3><p>Guidance for project structure, debugging, UI polish, and explaining the code confidently.</p><ul><li>Code review</li><li>Bug fixing</li><li>Presentation support</li></ul><strong>Best for learning</strong></article>
  </div>
</section>

<section class="service-estimator-section">
  <h2 class="title"><span>Project Estimator</span></h2>
  <p class="section-subtitle">Adjust the basics below to get a quick planning estimate before sending a project request.</p>
  <div class="estimator-panel">
    <div class="estimator-controls">
      <label>Service type<select id="estimateType"><option value="12000">Portfolio website</option><option value="18000">Full-stack integration</option><option value="8000">UI redesign pass</option><option value="5000">Code support</option></select></label>
      <label>Pages or screens<input id="estimatePages" type="number" min="1" max="20" value="4"></label>
      <label>Timeline<select id="estimateTimeline"><option value="1">Flexible</option><option value="1.15">Standard</option><option value="1.3">Urgent</option></select></label>
      <label class="estimator-check"><input id="estimateSupport" type="checkbox">Include 30-day support</label>
    </div>
    <div class="estimator-result">
      <span>Estimated range</span>
      <strong id="estimateOutput">Rs. 18,000 - Rs. 24,000</strong>
      <p>Final pricing depends on content, integrations, revisions, and technical complexity.</p>
      <a href="#/contact" class="btn-primary">Request quote</a>
    </div>
  </div>
</section>

<section class="service-process-pro">
  <h2 class="title"><span>How Delivery Works</span></h2>
  <div class="delivery-steps">
    <div><span>01</span><strong>Discovery</strong><p>We define goals, pages, content, references, timeline, and must-have features.</p></div>
    <div><span>02</span><strong>Design Direction</strong><p>I create the structure, visual system, and key sections before expanding the build.</p></div>
    <div><span>03</span><strong>Build and Review</strong><p>The project is implemented in focused checkpoints so feedback stays easy.</p></div>
    <div><span>04</span><strong>Handoff</strong><p>You receive source files, setup notes, and final responsive checks.</p></div>
  </div>
</section>`;

function getRouteFromHash(): RouteName {
  const route = window.location.hash.replace(/^#\/?/, "").split("#")[0];
  if (route === "about" || route === "resources" || route === "services" || route === "contact" || route === "login") {
    return route;
  }
  return "home";
}

function loadUser(): PortfolioUser | null {
  try {
    const stored = localStorage.getItem("portfolioUser");
    return stored ? (JSON.parse(stored) as PortfolioUser) : null;
  } catch {
    return null;
  }
}

function Navbar({
  user,
  theme,
  onThemeToggle,
  onLogout,
}: {
  user: PortfolioUser | null;
  theme: "dark" | "light";
  onThemeToggle: () => void;
  onLogout: () => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="nav--bar">
      <nav className="navbar" role="navigation" aria-label="Main Navigation">
        <div className="nav-left">
          <div className="logo" role="img" aria-label="Hanvitha logo" />
        </div>
        <button
          className={`hamburger${open ? " active" : ""}`}
          aria-expanded={open}
          aria-label="Toggle menu"
          onClick={() => setOpen((value) => !value)}
        >
          <span />
          <span />
          <span />
        </button>
        <div className={`nav-links${open ? " active" : ""}`}>
          {routes.map((route) => (
            <a key={route.key} href={route.href} className="nav-link" onClick={() => setOpen(false)}>
              {route.label}
            </a>
          ))}
          {!user ? (
            <a href="#/login" className="nav-link" id="loginNav" onClick={() => setOpen(false)}>
              Login
            </a>
          ) : (
            <div className="user-info" id="userInfo" style={{ display: "flex" }}>
              <img id="navUserImg" alt="User" src={user.image} />
              <span id="navUsername">{user.username}</span>
              <div className="dropdown">
                <a href="#/login#profileForm" onClick={() => setOpen(false)}>
                  Profile
                </a>
                <a
                  href="#/"
                  onClick={(event) => {
                    event.preventDefault();
                    onLogout();
                    setOpen(false);
                  }}
                >
                  Logout
                </a>
              </div>
            </div>
          )}
          <button className="theme-toggle" type="button" onClick={onThemeToggle} aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}>
            <i className={`fa-solid ${theme === "dark" ? "fa-sun" : "fa-moon"}`} />
          </button>
        </div>
      </nav>
    </div>
  );
}

function PageMarkup({ html }: { html: string }) {
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}

function Footer() {
  return <div dangerouslySetInnerHTML={{ __html: footerHtml }} />;
}

function App() {
  const [route, setRoute] = useState<RouteName>(() => getRouteFromHash());
  const [locationHash, setLocationHash] = useState(() => window.location.hash || "#/");
  const [user, setUser] = useState<PortfolioUser | null>(() => loadUser());
  const [theme, setTheme] = useState<"dark" | "light">(() => (localStorage.getItem("portfolioTheme") === "light" ? "light" : "dark"));
  const [scrollProgress, setScrollProgress] = useState(0);
  const [quickNavOpen, setQuickNavOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const [settings, setSettings] = useState<PortfolioSettings>(() => loadSettings());
  const [toast, setToast] = useState<{ type: "success" | "info" | "error"; message: string } | null>(null);
  const pageRef = useRef<HTMLDivElement>(null);
  const pageHtml = useMemo(() => getPageHtml(route), [route]);
  const notify = (message: string, type: "success" | "info" | "error" = "info") => setToast({ message, type });

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("portfolioTheme", theme);
  }, [theme]);

  useEffect(() => {
    const descriptions: Record<RouteName, string> = {
      home: "Hanvitha Pesarikayala portfolio with projects, full-stack skills, services, and contact options.",
      about: "About Hanvitha, her full-stack development skills, process, and growth timeline.",
      resources: "Curated web development resources, learning path, tools, and project checklist.",
      services: "Portfolio website, UI redesign, frontend API, and student project support services.",
      contact: "Contact Hanvitha for freelance projects, portfolio websites, UI improvements, and full-stack support.",
      login: "Portfolio profile login demo with editable local profile information.",
    };
    document.title = `${routeLabels[route]} | Hanvitha Portfolio`;
    document.querySelector('meta[name="description"]')?.setAttribute("content", descriptions[route]);
    document.querySelector('meta[property="og:title"]')?.setAttribute("content", `${routeLabels[route]} | Hanvitha Portfolio`);
    document.querySelector('meta[property="og:description"]')?.setAttribute("content", descriptions[route]);
  }, [route]);

  useEffect(() => {
    const onHashChange = () => {
      setLocationHash(window.location.hash || "#/");
      setRoute(getRouteFromHash());
    };
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  useEffect(() => {
    const id = window.location.hash.split("#")[2];
    if (id) {
      window.setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }), 0);
    } else {
      window.scrollTo({ top: 0 });
    }
  }, [locationHash]);

  useEffect(() => {
    const cleanups = [
      setupTyping(route),
      setupProjectReveal(),
      setupProjectFilters(),
      setupSectionReveals(),
      setupSkillsAndCounters(),
      setupResourceFilters(),
      setupLearningPath(),
      setupEstimator(),
      setupContactForm(),
      setupFaq(),
      setupAuth(setUser, notify, locationHash),
    ];

    return () => cleanups.forEach((cleanup) => cleanup?.());
  }, [route, locationHash]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 3200);
    return () => window.clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(max > 0 ? Math.min(100, (window.scrollY / max) * 100) : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [route]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setQuickNavOpen((open) => !open);
      }
      if (event.key === "Escape") setQuickNavOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <>
      <PointerGlow />
      <div className="scroll-progress" style={{ width: `${scrollProgress}%` }} />
      <Navbar
        user={user}
        theme={theme}
        onThemeToggle={() => setTheme((value) => (value === "dark" ? "light" : "dark"))}
        onLogout={() => {
          localStorage.removeItem("portfolioUser");
          setUser(null);
          window.location.hash = "#/";
        }}
      />
      <StatusStrip user={user} route={route} settings={settings} />
      <main ref={pageRef} className={`route-shell route-${route}`} key={route}>
        <RouteScene route={route} />
        <PageMarkup html={pageHtml} />
      </main>
      <FloatingActions onQuickNav={() => setQuickNavOpen(true)} onChat={() => setChatOpen(true)} onAdmin={() => setAdminOpen(true)} />
      <QuickNav open={quickNavOpen} route={route} onClose={() => setQuickNavOpen(false)} />
      <AiChatbot open={chatOpen} onClose={() => setChatOpen(false)} />
      <AdminStudio
        open={adminOpen}
        settings={settings}
        onSave={(next) => {
          localStorage.setItem("portfolioSettings", JSON.stringify(next));
          setSettings(next);
          notify("Admin changes saved locally.", "success");
        }}
        onClose={() => setAdminOpen(false)}
      />
      <Toast toast={toast} onClose={() => setToast(null)} />
      <Footer />
    </>
  );
}

function RouteScene({ route }: { route: RouteName }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || route !== "home") return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 58;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.7));
    renderer.setSize(window.innerWidth, window.innerHeight);

    const group = new THREE.Group();
    scene.add(group);

    const primary = new THREE.Color("#22D3EE");
    const accent = new THREE.Color("#A855F7");
    const warm = new THREE.Color("#F59E0B");
    const green = new THREE.Color("#22C55E");

    const makePoints = (count: number, size: number) => {
      const geometry = new THREE.BufferGeometry();
      const positions = new Float32Array(count * 3);
      const colors = new Float32Array(count * 3);

      for (let i = 0; i < count; i += 1) {
        const i3 = i * 3;
        const t = i / count;
        const color = new THREE.Color().lerpColors(primary, accent, t);
        positions[i3] = (Math.random() - 0.5) * 115;
        positions[i3 + 1] = (Math.random() - 0.5) * 70;
        positions[i3 + 2] = (Math.random() - 0.5) * 85;
        colors[i3] = color.r;
        colors[i3 + 1] = color.g;
        colors[i3 + 2] = color.b;
      }

      geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
      const material = new THREE.PointsMaterial({ size, transparent: true, opacity: 0.82, vertexColors: true, depthWrite: false });
      const points = new THREE.Points(geometry, material);
      group.add(points);
      return points;
    };

    const makeLineLoop = (radius: number, color: THREE.Color, segments = 128) => {
      const points: THREE.Vector3[] = [];
      for (let i = 0; i <= segments; i += 1) {
        const angle = (i / segments) * Math.PI * 2;
        points.push(new THREE.Vector3(Math.cos(angle) * radius, Math.sin(angle) * radius, 0));
      }
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const material = new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.32 });
      const line = new THREE.Line(geometry, material);
      group.add(line);
      return line;
    };

    const disposables: Array<{ dispose: () => void }> = [];
    let points: THREE.Points | null = null;

    points = makePoints(5200, 0.28);
    points.scale.set(1.25, 0.72, 1);

    if (points) {
      disposables.push(points.geometry, points.material as THREE.Material);
    }

    const clock = new THREE.Clock();
    let frame = 0;

    const animate = () => {
      const elapsed = clock.getElapsedTime();
      frame = window.requestAnimationFrame(animate);

      group.rotation.y = elapsed * 0.07;
      group.rotation.x = Math.sin(elapsed * 0.23) * 0.08;

      if (points) {
        const attr = points.geometry.getAttribute("position") as THREE.BufferAttribute;
        const array = attr.array as Float32Array;
        for (let i = 0; i < array.length; i += 3) {
          array[i + 1] += Math.sin(elapsed + array[i] * 0.035) * 0.002;
        }
        attr.needsUpdate = true;
      }

      renderer.render(scene, camera);
    };

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", onResize);
    animate();

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", onResize);
      disposables.forEach((item) => item.dispose());
      renderer.dispose();
    };
  }, [route]);

  return <canvas className={`route-scene route-scene-${route}`} ref={canvasRef} aria-hidden="true" />;
}

function RouteEnhancements({ route }: { route: RouteName }) {
  if (route === "about") {
    return (
      <section className="page-enhancement about-lab">
        <h2 className="title"><span>Developer Operating System</span></h2>
        <div className="enhancement-grid">
          <div>
            <strong>Product Thinking</strong>
            <p>I map user goals into clear flows before polishing the interface.</p>
          </div>
          <div>
            <strong>Frontend Craft</strong>
            <p>Reusable components, responsive layouts, and interaction states.</p>
          </div>
          <div>
            <strong>Backend Logic</strong>
            <p>Authentication, APIs, database structure, and maintainable data flows.</p>
          </div>
        </div>
      </section>
    );
  }

  if (route === "resources") {
    return (
      <section className="page-enhancement resource-lab">
        <h2 className="title"><span>Resource Stack</span></h2>
        <div className="enhancement-grid metric-grid">
          <div><strong>18+</strong><p>Curated references</p></div>
          <div><strong>5</strong><p>Learning milestones</p></div>
          <div><strong>4</strong><p>Career-ready themes</p></div>
        </div>
      </section>
    );
  }

  if (route === "services") {
    return (
      <section className="page-enhancement service-lab">
        <h2 className="title"><span>Engagement Modes</span></h2>
        <div className="enhancement-grid">
          <div><strong>Launch Sprint</strong><p>Fast landing page, portfolio, or product UI build.</p></div>
          <div><strong>Refinement Pass</strong><p>Improve responsiveness, accessibility, and visual consistency.</p></div>
          <div><strong>Build Partner</strong><p>Iterative full-stack work with checkpoints and handoff notes.</p></div>
        </div>
      </section>
    );
  }

  if (route === "contact") {
    return (
      <section className="page-enhancement contact-lab">
        <h2 className="title"><span>Before You Send</span></h2>
        <div className="enhancement-grid">
          <div><strong>Goal</strong><p>What should the project help users do?</p></div>
          <div><strong>Scope</strong><p>Pages, features, integrations, and timeline.</p></div>
          <div><strong>Success</strong><p>How we will know the delivery worked.</p></div>
        </div>
      </section>
    );
  }

  if (route === "login") {
    return (
      <section className="page-enhancement login-lab">
        <h2 className="title"><span>Account Features</span></h2>
        <div className="enhancement-grid">
          <div><strong>Local Profile</strong><p>Stored securely in your browser for this portfolio demo.</p></div>
          <div><strong>Editable Data</strong><p>Update name, contact details, profile image, and password.</p></div>
          <div><strong>Instant Preview</strong><p>The navbar updates as soon as login or profile changes happen.</p></div>
        </div>
      </section>
    );
  }

  return (
    <section className="page-enhancement home-lab">
      <h2 className="title"><span>Build Dashboard</span></h2>
      <div className="enhancement-grid metric-grid">
        <div><strong>React</strong><p>Converted from static HTML into typed components.</p></div>
        <div><strong>3D</strong><p>Route-specific animated scenes with Three.js.</p></div>
        <div><strong>UX</strong><p>Theme, quick nav, filters, motion, and profile flows.</p></div>
      </div>
    </section>
  );
}

function AdvancedSections({ route, settings }: { route: RouteName; settings: PortfolioSettings }) {
  if (route === "home") {
    return (
      <>
        <ProjectCaseStudies />
        <TestimonialsLab />
      </>
    );
  }

  if (route === "about") {
    return <ResumeSection settings={settings} />;
  }

  if (route === "resources") {
    return <ArticlesSection />;
  }

  if (route === "services") {
    return <ServiceAdvancements />;
  }

  return null;
}

function ProjectCaseStudies() {
  const [selected, setSelected] = useState<ProjectCaseStudy | null>(null);
  const [filter, setFilter] = useState("All");
  const [query, setQuery] = useState("");
  const categories = ["All", ...Array.from(new Set(projectCaseStudies.map((project) => project.category)))];
  const visibleProjects = projectCaseStudies.filter((project) => {
    const text = `${project.title} ${project.category} ${project.stack.join(" ")} ${project.summary}`.toLowerCase();
    return (filter === "All" || project.category === filter) && text.includes(query.toLowerCase());
  });

  return (
    <section className="case-study-section" id="case-studies">
      <div className="advanced-section-head">
        <span className="section-kicker">Case Studies</span>
        <h2 className="title"><span>Project Detail Pages</span></h2>
        <p>Open each project to see the problem, solution, stack, and outcome like a recruiter-friendly case study.</p>
      </div>

      <div className="case-study-tools">
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by project or tech" />
        <div>
          {categories.map((category) => (
            <button type="button" className={filter === category ? "active" : ""} onClick={() => setFilter(category)} key={category}>
              {category}
            </button>
          ))}
        </div>
      </div>

      <div className="case-study-grid">
        {visibleProjects.map((project) => (
          <button type="button" className="case-study-card" onClick={() => setSelected(project)} key={project.id}>
            <img src={project.image} alt={`${project.title} preview`} />
            <span>{project.category}</span>
            <h3>{project.title}</h3>
            <p>{project.summary}</p>
            <small>{project.stack.join(" / ")}</small>
          </button>
        ))}
      </div>

      {selected ? (
        <div className="case-study-modal-backdrop" role="presentation" onMouseDown={() => setSelected(null)}>
          <article className="case-study-modal" role="dialog" aria-modal="true" aria-label={selected.title} onMouseDown={(event) => event.stopPropagation()}>
            <button type="button" className="modal-close" onClick={() => setSelected(null)} aria-label="Close case study">
              <i className="fa-solid fa-xmark" />
            </button>
            <img src={selected.image} alt={`${selected.title} large preview`} />
            <span className="section-kicker">{selected.category}</span>
            <h2>{selected.title}</h2>
            <p>{selected.summary}</p>
            <div className="case-study-modal-grid">
              <div><strong>Problem</strong><p>{selected.problem}</p></div>
              <div><strong>Solution</strong><p>{selected.solution}</p></div>
              <div><strong>Outcome</strong><p>{selected.outcome}</p></div>
            </div>
            <div className="case-study-stack">{selected.stack.map((item) => <span key={item}>{item}</span>)}</div>
            <div className="case-study-links">
              <a href="https://github.com/hanvithareddy0208" target="_blank" rel="noreferrer">
                <i className="fa-brands fa-github" /> GitHub
              </a>
              <a href="#/contact">
                <i className="fa-solid fa-paper-plane" /> Discuss Similar Work
              </a>
            </div>
          </article>
        </div>
      ) : null}
    </section>
  );
}

function ResumeSection({ settings }: { settings: PortfolioSettings }) {
  const printResume = () => window.print();

  return (
    <section className="resume-section" id="resume">
      <div className="advanced-section-head">
        <span className="section-kicker">Resume</span>
        <h2 className="title"><span>Resume Preview</span></h2>
      </div>
      <div className="resume-preview">
        <aside>
          <h3>Hanvitha Pesarikayala</h3>
          <p>{settings.headline}</p>
          <button type="button" onClick={printResume}><i className="fa-solid fa-file-pdf" /> Save PDF</button>
        </aside>
        <div>
          <strong>Core Skills</strong>
          <p>React, JavaScript, HTML, CSS, responsive design, API integration, forms, GitHub, SQL basics.</p>
          <strong>Project Strength</strong>
          <p>Clear UI structure, practical full-stack thinking, polished presentation, and recruiter-friendly documentation.</p>
          <strong>Current Focus</strong>
          <p>{settings.featuredService}</p>
        </div>
      </div>
    </section>
  );
}

function ArticlesSection() {
  const articles = [
    ["How I Build a Portfolio Page", "Planning structure, sections, calls to action, and project proof before styling."],
    ["React Forms Without Confusion", "A simple way to think about inputs, validation, feedback, and saved state."],
    ["Making UI Look Professional", "Spacing, hierarchy, contrast, card rhythm, and responsive polish."],
  ];

  return (
    <section className="articles-section" id="articles">
      <div className="advanced-section-head">
        <span className="section-kicker">Articles</span>
        <h2 className="title"><span>Technical Notes</span></h2>
        <p>Short article cards that make the portfolio feel active and show how Hanvitha thinks through web work.</p>
      </div>
      <div className="article-grid">
        {articles.map(([title, text], index) => (
          <article key={title}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <h3>{title}</h3>
            <p>{text}</p>
            <a href="#/resources">Read outline</a>
          </article>
        ))}
      </div>
    </section>
  );
}

function TestimonialsLab() {
  const [items, setItems] = useState<Array<{ name: string; text: string }>>(() => {
    try {
      return JSON.parse(localStorage.getItem("portfolioTestimonials") ?? "[]") as Array<{ name: string; text: string }>;
    } catch {
      return [];
    }
  });
  const [name, setName] = useState("");
  const [text, setText] = useState("");

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!name.trim() || !text.trim()) return;
    const next = [{ name: name.trim(), text: text.trim() }, ...items].slice(0, 6);
    localStorage.setItem("portfolioTestimonials", JSON.stringify(next));
    setItems(next);
    setName("");
    setText("");
  };

  return (
    <section className="testimonial-lab-section">
      <div className="advanced-section-head">
        <span className="section-kicker">Testimonials</span>
        <h2 className="title"><span>Visitor Reviews</span></h2>
      </div>
      <form className="testimonial-form" onSubmit={submit}>
        <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Your name" />
        <input value={text} onChange={(event) => setText(event.target.value)} placeholder="Write a short review" />
        <button type="submit">Add Review</button>
      </form>
      <div className="testimonial-mini-grid">
        {(items.length ? items : [{ name: "Sample Client", text: "Clean design, clear communication, and a polished result." }]).map((item, index) => (
          <blockquote key={`${item.name}-${index}`}><p>{item.text}</p><cite>{item.name}</cite></blockquote>
        ))}
      </div>
    </section>
  );
}

function ServiceAdvancements() {
  return (
    <section className="service-advancement-section">
      <div className="advanced-section-head">
        <span className="section-kicker">Advanced Delivery</span>
        <h2 className="title"><span>Backend-Ready Upgrades</span></h2>
      </div>
      <div className="advancement-grid">
        <div><i className="fa-solid fa-envelope-circle-check" /><strong>Contact Backend Ready</strong><p>The contact form saves submissions locally and prepares an email handoff. It can connect to Formspree, EmailJS, Firebase, or a custom API.</p></div>
        <div><i className="fa-solid fa-brain" /><strong>AI Endpoint Ready</strong><p>The chatbot can call `VITE_AI_CHAT_ENDPOINT` when provided, with a smart local fallback when no backend is configured.</p></div>
        <div><i className="fa-solid fa-chart-line" /><strong>Conversion Focus</strong><p>Services now include clear tracks, estimator logic, delivery process, and stronger quote paths.</p></div>
      </div>
    </section>
  );
}

function PointerGlow() {
  const [position, setPosition] = useState({ x: 50, y: 18 });

  useEffect(() => {
    const onPointerMove = (event: PointerEvent) => {
      setPosition({
        x: (event.clientX / window.innerWidth) * 100,
        y: (event.clientY / window.innerHeight) * 100,
      });
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    return () => window.removeEventListener("pointermove", onPointerMove);
  }, []);

  return <div className="pointer-glow" style={{ "--glow-x": `${position.x}%`, "--glow-y": `${position.y}%` } as CSSProperties} />;
}

function StatusStrip({ user, route, settings }: { user: PortfolioUser | null; route: RouteName; settings: PortfolioSettings }) {
  const routeLabel = routeLabels[route];

  return (
    <aside className="status-strip" aria-label="Portfolio status">
      <span>
        <i className="fa-solid fa-circle" />
        {settings.availability}
      </span>
      <span>
        <i className="fa-solid fa-bolt" />
        24h response
      </span>
      <span>
        <i className="fa-solid fa-location-dot" />
        Hyderabad / Remote
      </span>
      <a href={user ? "#/login#profileForm" : "#/contact"}>
        {user ? `Profile: ${user.username}` : `${routeLabel}: ${settings.featuredService}`}
      </a>
    </aside>
  );
}

function Toast({
  toast,
  onClose,
}: {
  toast: { type: "success" | "info" | "error"; message: string } | null;
  onClose: () => void;
}) {
  if (!toast) return null;
  const icon = toast.type === "success" ? "fa-circle-check" : toast.type === "error" ? "fa-circle-exclamation" : "fa-circle-info";

  return (
    <div className={`app-toast ${toast.type}`} role="status" aria-live="polite">
      <i className={`fa-solid ${icon}`} />
      <span>{toast.message}</span>
      <button type="button" onClick={onClose} aria-label="Dismiss notification">
        <i className="fa-solid fa-xmark" />
      </button>
    </div>
  );
}

function FloatingActions({ onQuickNav, onChat, onAdmin }: { onQuickNav: () => void; onChat: () => void; onAdmin: () => void }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 420);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="floating-actions">
      <button type="button" onClick={onChat} aria-label="Open AI chatbot">
        <i className="fa-solid fa-robot" />
      </button>
      <button type="button" onClick={onAdmin} aria-label="Open admin edit mode">
        <i className="fa-solid fa-pen-to-square" />
      </button>
      <button type="button" onClick={onQuickNav} aria-label="Open quick navigation">
        <i className="fa-solid fa-magnifying-glass" />
      </button>
      <button
        type="button"
        className={visible ? "is-visible" : ""}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Back to top"
      >
        <i className="fa-solid fa-arrow-up" />
      </button>
    </div>
  );
}

function AdminStudio({
  open,
  settings,
  onSave,
  onClose,
}: {
  open: boolean;
  settings: PortfolioSettings;
  onSave: (settings: PortfolioSettings) => void;
  onClose: () => void;
}) {
  const [draft, setDraft] = useState(settings);

  useEffect(() => {
    setDraft(settings);
  }, [settings, open]);

  if (!open) return null;

  return (
    <div className="admin-backdrop" role="presentation" onMouseDown={onClose}>
      <form
        className="admin-studio"
        role="dialog"
        aria-modal="true"
        aria-label="Admin edit mode"
        onMouseDown={(event) => event.stopPropagation()}
        onSubmit={(event) => {
          event.preventDefault();
          onSave(draft);
          onClose();
        }}
      >
        <div className="admin-head">
          <div>
            <span className="section-kicker">Admin Mode</span>
            <h2>Edit Portfolio Highlights</h2>
          </div>
          <button type="button" onClick={onClose} aria-label="Close admin mode">
            <i className="fa-solid fa-xmark" />
          </button>
        </div>
        <label>
          Headline
          <textarea value={draft.headline} onChange={(event) => setDraft({ ...draft, headline: event.target.value })} />
        </label>
        <label>
          Availability
          <input value={draft.availability} onChange={(event) => setDraft({ ...draft, availability: event.target.value })} />
        </label>
        <label>
          Featured service
          <input value={draft.featuredService} onChange={(event) => setDraft({ ...draft, featuredService: event.target.value })} />
        </label>
        <div className="admin-actions">
          <button type="button" onClick={() => setDraft(defaultSettings)}>Reset</button>
          <button type="submit">Save Changes</button>
        </div>
      </form>
    </div>
  );
}

function AiChatbot({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [messages, setMessages] = useState<Array<{ from: "bot" | "user"; text: string }>>([
    { from: "bot", text: "Hi, I am Hanvitha's portfolio assistant. Ask about skills, services, resources, projects, or contact details." },
  ]);
  const [draft, setDraft] = useState("");
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open]);

  const answer = (text: string) => {
    const query = text.toLowerCase();
    if (query.includes("service") || query.includes("price") || query.includes("cost")) {
      return "Hanvitha offers portfolio/business websites, UI redesigns, frontend + API flows, and student project support. Open Services for the estimator, or Contact to request an exact quote.";
    }
    if (query.includes("skill") || query.includes("tech") || query.includes("stack")) {
      return "Her main stack includes HTML, CSS, JavaScript, React, responsive UI, REST API integration, auth basics, SQL concepts, GitHub, and clean project structure.";
    }
    if (query.includes("resource") || query.includes("learn")) {
      return "The Resources page now has a practical learning path: frontend basics, React, APIs, GitHub, deployment, and a checklist for project readiness.";
    }
    if (query.includes("project") || query.includes("work")) {
      return "You can view featured projects from the Home page. The strongest direction is polished frontend interfaces with practical full-stack workflows.";
    }
    if (query.includes("contact") || query.includes("email") || query.includes("hire")) {
      return "Use the Contact page to send a project message. You can also reach Hanvitha through the email and social links listed there.";
    }
    if (query.includes("about") || query.includes("hanvitha")) {
      return "Hanvitha is a full-stack developer focused on clear UI, responsive layouts, practical backend connections, and polished user experiences.";
    }
    return "I can help with details about Hanvitha's skills, services, resources, projects, or contact options. Try asking: What services do you offer?";
  };

  const sendMessage = (event?: FormEvent) => {
    event?.preventDefault();
    const text = draft.trim();
    if (!text) return;
    setMessages((current) => [...current, { from: "user", text }, { from: "bot", text: answer(text) }]);
    setDraft("");
  };

  if (!open) return null;

  return (
    <section className="ai-chatbot" role="dialog" aria-modal="false" aria-label="AI chatbot">
      <div className="ai-chatbot-header">
        <div>
          <span><i className="fa-solid fa-sparkles" /> AI Assistant</span>
          <small>Portfolio guide</small>
        </div>
        <button type="button" onClick={onClose} aria-label="Close AI chatbot">
          <i className="fa-solid fa-xmark" />
        </button>
      </div>
      <div className="ai-chatbot-body" ref={bodyRef}>
        {messages.map((message, index) => (
          <div className={`ai-message ${message.from}`} key={`${message.from}-${index}`}>
            {message.text}
          </div>
        ))}
      </div>
      <div className="ai-chatbot-prompts">
        {["Services", "Skills", "Resources"].map((prompt) => (
          <button
            key={prompt}
            type="button"
            onClick={() => {
              setDraft(prompt);
              setMessages((current) => [...current, { from: "user", text: prompt }, { from: "bot", text: answer(prompt) }]);
              setDraft("");
            }}
          >
            {prompt}
          </button>
        ))}
      </div>
      <form className="ai-chatbot-form" onSubmit={sendMessage}>
        <input value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="Ask about this portfolio" />
        <button type="submit" aria-label="Send message">
          <i className="fa-solid fa-paper-plane" />
        </button>
      </form>
    </section>
  );
}

function QuickNav({ open, route, onClose }: { open: boolean; route: RouteName; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const items = [
    { label: "Home", hint: "Hero, technologies, projects", href: "#/" },
    { label: "About", hint: "Journey, skills, achievements", href: "#/about" },
    { label: "Resources", hint: "Learning links, blogs, FAQ", href: "#/resources" },
    { label: "Services", hint: "Pricing, estimator, process", href: "#/services" },
    { label: "Contact", hint: "Message form and social links", href: "#/contact" },
    { label: "Projects", hint: "Jump to featured work", href: "#/#projects" },
  ];
  const matches = items.filter((item) => `${item.label} ${item.hint}`.toLowerCase().includes(query.toLowerCase()));

  useEffect(() => {
    if (!open) return;
    setQuery("");
    window.setTimeout(() => inputRef.current?.focus(), 0);
  }, [open]);

  if (!open) return null;

  return (
    <div className="quick-nav-backdrop" role="presentation" onMouseDown={onClose}>
      <div className="quick-nav" role="dialog" aria-modal="true" aria-label="Quick navigation" onMouseDown={(event) => event.stopPropagation()}>
        <div className="quick-nav-search">
          <i className="fa-solid fa-magnifying-glass" />
          <input ref={inputRef} value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search pages and sections" />
          <kbd>Esc</kbd>
        </div>
        <div className="quick-nav-list">
          {matches.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={item.href === `#/${route === "home" ? "" : route}` ? "active" : ""}
              onClick={onClose}
            >
              <span>{item.label}</span>
              <small>{item.hint}</small>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

function setupTyping(route: RouteName) {
  if (route !== "home") return;
  const element = document.querySelector<HTMLElement>(".typing");
  if (!element) return;

  const words = ["beautiful web apps", "scalable full-stack systems", "modern UI experiences", "high-performance websites"];
  let index = 0;
  let char = 0;
  let isDeleting = false;
  let timeout = 0;
  let active = true;

  const typeEffect = () => {
    if (!active) return;
    const current = words[index];
    element.textContent = current.substring(0, char);

    if (!isDeleting && char < current.length) char += 1;
    else if (isDeleting && char > 0) char -= 1;
    else {
      isDeleting = !isDeleting;
      if (!isDeleting) index = (index + 1) % words.length;
    }

    timeout = window.setTimeout(typeEffect, isDeleting ? 60 : 100);
  };

  typeEffect();
  return () => {
    active = false;
    window.clearTimeout(timeout);
  };
}

function setupHomeCanvas(route: RouteName) {
  if (route !== "home") return;
  const canvas = document.getElementById("bg") as HTMLCanvasElement | null;
  if (!canvas) return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(65, 1, 0.1, 1000);
  camera.position.z = 55;
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: "high-performance" });
  renderer.setClearColor(0x020617, 1);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));

  const colors = [new THREE.Color("#22D3EE"), new THREE.Color("#A855F7"), new THREE.Color("#7C3AED"), new THREE.Color("#0EA5E9")];
  const getColor = (t: number) => {
    const n = colors.length - 1;
    const scaled = t * n;
    const i = Math.floor(scaled);
    return new THREE.Color().lerpColors(colors[i], colors[Math.min(i + 1, n)], scaled - i);
  };

  let countX = 120;
  let countY = 60;
  let spacing = 2;
  let geometry: THREE.BufferGeometry | null = null;
  let particles: THREE.Points | null = null;
  let frame = 0;
  const clock = new THREE.Clock();

  const calculateGrid = () => {
    const area = window.innerWidth * window.innerHeight;
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
  };

  const createGrid = () => {
    if (particles && geometry) {
      scene.remove(particles);
      geometry.dispose();
    }
    calculateGrid();
    geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(countX * countY * 3);
    const vertexColors = new Float32Array(countX * countY * 3);
    let i3 = 0;

    for (let x = 0; x < countX; x += 1) {
      const color = getColor(x / (countX - 1));
      for (let y = 0; y < countY; y += 1) {
        positions[i3] = (x - countX / 2) * spacing;
        positions[i3 + 1] = -10;
        positions[i3 + 2] = (y - countY / 2) * spacing - 20;
        vertexColors[i3] = color.r;
        vertexColors[i3 + 1] = color.g;
        vertexColors[i3 + 2] = color.b;
        i3 += 3;
      }
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(vertexColors, 3));
    particles = new THREE.Points(
      geometry,
      new THREE.PointsMaterial({ size: 0.35, transparent: true, opacity: 0.9, vertexColors: true, depthWrite: false }),
    );
    scene.add(particles);
  };

  const resize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    createGrid();
  };

  const animate = () => {
    if (!geometry) return;
    frame = window.requestAnimationFrame(animate);
    const t = clock.getElapsedTime();
    const position = geometry.attributes.position.array as Float32Array;
    let i3 = 0;
    for (let i = 0; i < countX; i += 1) {
      for (let j = 0; j < countY; j += 1) {
        position[i3 + 1] = (Math.sin(i * 0.15 + t * 1.1) + Math.cos(j * 0.18 + t * 0.9)) * 2 - 10;
        i3 += 3;
      }
    }
    geometry.attributes.position.needsUpdate = true;
    renderer.render(scene, camera);
  };

  resize();
  animate();
  window.addEventListener("resize", resize);
  window.addEventListener("orientationchange", resize);

  return () => {
    window.cancelAnimationFrame(frame);
    window.removeEventListener("resize", resize);
    window.removeEventListener("orientationchange", resize);
    geometry?.dispose();
    renderer.dispose();
  };
}

function setupProjectReveal() {
  const projects = document.querySelectorAll<HTMLElement>(".animate-project");
  if (!projects.length) return;
  projects.forEach((project) => project.classList.add("hidden"));
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.remove("hidden");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 },
  );
  projects.forEach((project) => observer.observe(project));
  return () => observer.disconnect();
}

function setupProjectFilters() {
  const section = document.querySelector<HTMLElement>(".index-projects");
  const rows = Array.from(document.querySelectorAll<HTMLElement>(".index-projects .project-row"));
  if (!section || !rows.length || section.querySelector(".project-filter-bar")) return;

  const tags = Array.from(
    new Set(
      rows.map((row) => row.querySelector<HTMLElement>(".project-tag")?.textContent?.trim()).filter((tag): tag is string => Boolean(tag)),
    ),
  );
  const bar = document.createElement("div");
  bar.className = "project-filter-bar";
  bar.innerHTML = [
    `<button type="button" class="active" data-project-filter="all">All</button>`,
    ...tags.map((tag) => `<button type="button" data-project-filter="${tag}">${tag}</button>`),
  ].join("");

  const title = section.querySelector(".title");
  title?.insertAdjacentElement("afterend", bar);

  const buttons = Array.from(bar.querySelectorAll<HTMLButtonElement>("button"));
  const onClick = (event: Event) => {
    const button = event.currentTarget as HTMLButtonElement;
    const filter = button.dataset.projectFilter ?? "all";
    buttons.forEach((item) => item.classList.toggle("active", item === button));
    rows.forEach((row) => {
      const tag = row.querySelector<HTMLElement>(".project-tag")?.textContent?.trim();
      row.classList.toggle("is-hidden", filter !== "all" && tag !== filter);
    });
  };
  buttons.forEach((button) => button.addEventListener("click", onClick));

  return () => {
    buttons.forEach((button) => button.removeEventListener("click", onClick));
    bar.remove();
    rows.forEach((row) => row.classList.remove("is-hidden"));
  };
}

function setupSectionReveals() {
  const selectors = [
    "section",
    ".hero-card",
    ".tech-card",
    ".service-card",
    ".resource-card",
    ".tool-card",
    ".blog-item",
    ".deliverable-item",
    ".process-step",
    ".approach-card",
    ".skills-category",
    ".contact-info-box",
    ".contact-form",
  ];
  const elements = Array.from(document.querySelectorAll<HTMLElement>(selectors.join(","))).filter((element) => !element.classList.contains("reveal-ready"));
  if (!elements.length) return;

  elements.forEach((element, index) => {
    element.classList.add("reveal-ready");
    element.style.setProperty("--reveal-delay", `${Math.min(index % 8, 7) * 45}ms`);
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("reveal-in");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
  );
  elements.forEach((element) => observer.observe(element));

  return () => observer.disconnect();
}

function setupSkillsAndCounters() {
  const skills = document.querySelector("#skills");
  const fills = document.querySelectorAll<HTMLElement>(".fill");
  const percents = document.querySelectorAll<HTMLElement>(".percent");
  const counters = document.querySelectorAll<HTMLElement>(".count");
  const timers: number[] = [];
  const observers: IntersectionObserver[] = [];

  if (skills && fills.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return;
        fills.forEach((fill) => {
          fill.style.width = fill.dataset.level ?? "0";
        });
        percents.forEach((percent) => {
          const target = Number(percent.dataset.percent ?? 0);
          let count = 0;
          const timer = window.setInterval(() => {
            count += 1;
            percent.textContent = `${count}%`;
            if (count >= target) window.clearInterval(timer);
          }, 18);
          timers.push(timer);
        });
        observer.disconnect();
      },
      { threshold: 0.35 },
    );
    observer.observe(skills);
    observers.push(observer);
  }

  counters.forEach((counter) => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return;
        const target = Number(counter.dataset.target ?? 0);
        let count = 0;
        const updateCount = () => {
          const increment = Math.max(target / 200, 1);
          if (count < target) {
            count = Math.min(Math.ceil(count + increment), target);
            counter.textContent = String(count);
            timers.push(window.setTimeout(updateCount, 20));
          } else {
            counter.textContent = String(target);
          }
        };
        updateCount();
        observer.unobserve(counter);
      },
      { threshold: 0.5 },
    );
    observer.observe(counter);
    observers.push(observer);
  });

  return () => {
    timers.forEach((timer) => window.clearTimeout(timer));
    observers.forEach((observer) => observer.disconnect());
  };
}

function setupResourceFilters() {
  const search = document.querySelector<HTMLInputElement>("[data-resource-search], #resourceSearch");
  const filters = document.querySelectorAll<HTMLButtonElement>(".resource-filter");
  const cards = document.querySelectorAll<HTMLElement>(".resource-card[data-category], .resource-pro-card[data-category]");
  if (!cards.length) return;
  let activeFilter = "all";

  const updateCards = () => {
    const query = (search?.value ?? "").trim().toLowerCase();
    cards.forEach((card) => {
      const text = card.textContent?.toLowerCase() ?? "";
      const categories = card.dataset.category ?? "";
      card.classList.toggle("is-hidden", !((!query || text.includes(query)) && (activeFilter === "all" || categories.includes(activeFilter))));
    });
  };

  const handlers: Array<[Element, string, EventListener]> = [];
  if (search) {
    search.addEventListener("input", updateCards);
    handlers.push([search, "input", updateCards]);
  }
  filters.forEach((button) => {
    const onClick = () => {
      filters.forEach((item) => item.classList.remove("active"));
      button.classList.add("active");
      activeFilter = button.dataset.resourceFilter ?? button.dataset.filter ?? "all";
      updateCards();
    };
    button.addEventListener("click", onClick);
    handlers.push([button, "click", onClick]);
  });

  return () => handlers.forEach(([element, event, handler]) => element.removeEventListener(event, handler));
}

function setupLearningPath() {
  const items = document.querySelectorAll<HTMLInputElement>("[data-path-item]");
  if (!items.length) return;
  const handlers: Array<[HTMLInputElement, EventListener]> = [];

  items.forEach((item) => {
    const key = `learning-path:${item.dataset.pathItem}`;
    item.checked = localStorage.getItem(key) === "done";
    const onChange = () => {
      if (item.checked) localStorage.setItem(key, "done");
      else localStorage.removeItem(key);
    };
    item.addEventListener("change", onChange);
    handlers.push([item, onChange]);
  });

  return () => handlers.forEach(([item, handler]) => item.removeEventListener("change", handler));
}

function setupEstimator() {
  const type = document.getElementById("estimateType") as HTMLSelectElement | null;
  const pagesInput = document.getElementById("estimatePages") as HTMLInputElement | null;
  const timeline = document.getElementById("estimateTimeline") as HTMLSelectElement | null;
  const support = document.getElementById("estimateSupport") as HTMLInputElement | null;
  const output = document.getElementById("estimateOutput");
  if (!type || !pagesInput || !timeline || !support || !output) return;

  const formatRupees = (value: number) => `Rs. ${Math.round(value).toLocaleString("en-IN")}`;
  const updateEstimate = () => {
    const low = (Number(type.value) + Math.max(1, Number(pagesInput.value) || 1) * 1500 + (support.checked ? 4000 : 0)) * Number(timeline.value);
    output.textContent = `${formatRupees(low)} - ${formatRupees(low * 1.28)}`;
  };

  [type, pagesInput, timeline, support].forEach((control) => {
    control.addEventListener("input", updateEstimate);
    control.addEventListener("change", updateEstimate);
  });
  updateEstimate();

  return () =>
    [type, pagesInput, timeline, support].forEach((control) => {
      control.removeEventListener("input", updateEstimate);
      control.removeEventListener("change", updateEstimate);
    });
}

function setupContactForm() {
  const form = document.querySelector<HTMLFormElement>(".contact-form");
  if (!form) return;
  const fields = form.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>("input, select, textarea");
  const subject = form.querySelectorAll<HTMLInputElement>('input[type="text"]')[1];
  const topicButtons = form.querySelectorAll<HTMLButtonElement>("[data-contact-topic]");
  const message = form.querySelector<HTMLTextAreaElement>("textarea");
  const count = document.getElementById("messageCount");
  const status = document.getElementById("contactFormStatus");
  const handlers: Array<[Element, string, EventListener]> = [];

  topicButtons.forEach((button) => {
    const onClick = () => {
      topicButtons.forEach((item) => item.classList.remove("active"));
      button.classList.add("active");
      if (subject) subject.value = button.dataset.contactTopic ?? "";
      subject?.focus();
    };
    button.addEventListener("click", onClick);
    handlers.push([button, "click", onClick]);
  });

  if (message) {
    const onInput = () => {
      if (count) count.textContent = `${message.value.length} / ${message.maxLength}`;
    };
    message.addEventListener("input", onInput);
    handlers.push([message, "input", onInput]);
  }

  const onSubmit = (event: Event) => {
    event.preventDefault();
    const [name, email, selectedSubject, budget, timeline, body] = Array.from(fields).map((field) => field.value.trim());
    const submission = { name, email, subject: selectedSubject, budget, timeline, message: body, createdAt: new Date().toISOString() };
    const saved = JSON.parse(localStorage.getItem("portfolioContactSubmissions") ?? "[]") as typeof submission[];
    localStorage.setItem("portfolioContactSubmissions", JSON.stringify([submission, ...saved].slice(0, 20)));
    const mailBody = [`Name: ${name}`, `Email: ${email}`, `Budget: ${budget}`, `Timeline: ${timeline}`, "", body].join("\n");
    const mailto = `mailto:hanvithareddy0208@gmail.com?subject=${encodeURIComponent(selectedSubject || "Portfolio enquiry")}&body=${encodeURIComponent(mailBody)}`;
    if (status) status.textContent = "Message saved locally and opened in your email app.";
    window.location.href = mailto;
  };
  form.addEventListener("submit", onSubmit);
  handlers.push([form, "submit", onSubmit]);

  return () => handlers.forEach(([element, event, handler]) => element.removeEventListener(event, handler));
}

function setupFaq() {
  const items = document.querySelectorAll<HTMLElement>(".faq-item");
  if (!items.length) return;
  const handlers: Array<[Element, EventListener]> = [];

  items.forEach((item) => {
    const question = item.querySelector<HTMLButtonElement>(".faq-question");
    const answer = item.querySelector<HTMLElement>(".faq-answer");
    const icon = question?.querySelector<HTMLElement>("i");
    if (!question || !answer || !icon) return;
    const onClick = () => {
      const isOpen = Boolean(answer.style.maxHeight);
      items.forEach((other) => {
        const otherAnswer = other.querySelector<HTMLElement>(".faq-answer");
        const otherIcon = other.querySelector<HTMLElement>(".faq-question i");
        if (otherAnswer) otherAnswer.style.maxHeight = "";
        if (otherIcon) otherIcon.style.transform = "rotate(0deg)";
      });
      if (!isOpen) {
        answer.style.maxHeight = `${answer.scrollHeight}px`;
        icon.style.transform = "rotate(180deg)";
      }
    };
    question.addEventListener("click", onClick);
    handlers.push([question, onClick]);
  });

  return () => handlers.forEach(([element, handler]) => element.removeEventListener("click", handler));
}

function setupAuth(
  setUser: (user: PortfolioUser | null) => void,
  notify: (message: string, type?: "success" | "info" | "error") => void,
  locationHash: string,
) {
  const loginForm = document.getElementById("loginForm") as HTMLFormElement | null;
  const signupForm = document.getElementById("signupForm") as HTMLFormElement | null;
  const profileForm = document.getElementById("profileForm") as HTMLFormElement | null;
  if (!loginForm && !signupForm && !profileForm) return;

  const loginInfo = document.getElementById("loginInfo");
  const handlers: Array<[Element, string, EventListener]> = [];
  const showForm = (form: "login" | "signup" | "profile") => {
    loginForm?.classList.toggle("active", form === "login");
    signupForm?.classList.toggle("active", form === "signup");
    profileForm?.classList.toggle("active", form === "profile");
    if (loginInfo) loginInfo.style.display = form === "login" ? "flex" : "none";
  };
  const setStatus = (id: string, message: string, kind: "success" | "error" | "info" = "info") => {
    const element = document.getElementById(id);
    if (!element) return;
    element.textContent = message;
    element.classList.remove("success", "error", "info");
    element.classList.add(kind);
  };
  const fillProfile = (user: PortfolioUser) => {
    setValue("profileUsername", user.username);
    setValue("profileEmail", user.email);
    setValue("profilePhone", user.phone);
    setValue("profileLinkedIn", user.linkedIn);
    setValue("profilePassword", user.password);
    const preview = document.getElementById("profileImgPreview") as HTMLImageElement | null;
    if (preview) preview.src = user.image;
    setStatus("profileError", `Profile loaded for ${user.username}.`, "success");
  };

  const existing = loadUser();
  if (existing && locationHash.includes("profileForm")) {
    showForm("profile");
    fillProfile(existing);
  } else if (!existing && locationHash.includes("profileForm")) {
    showForm("login");
    setStatus("loginError", "Please login first to open your profile.", "info");
  }

  addHandler("goSignup", "click", () => {
    showForm("signup");
    setStatus("signupError", "", "info");
  }, handlers);
  addHandler("goLogin", "click", () => {
    showForm("login");
    setStatus("loginError", "", "info");
  }, handlers);
  setupPasswordEnhancements(handlers);

  if (signupForm) {
    const onSignup = (event: Event) => {
      event.preventDefault();
      const error = document.getElementById("signupError");
      if (error) error.textContent = "";
      const imageInput = document.getElementById("signupImage") as HTMLInputElement | null;
      const file = imageInput?.files?.[0];
      const userBase = {
        username: inputValue("signupUsername").trim(),
        email: inputValue("signupEmail").trim(),
        phone: inputValue("signupPhone").trim(),
        linkedIn: inputValue("signupLinkedIn").trim(),
        password: inputValue("signupPassword"),
      };
      const confirm = inputValue("signupConfirm");
      if (!userBase.username || !userBase.email || !userBase.phone || !userBase.password || !confirm || !file) {
        setStatus("signupError", "Please fill in all fields and select an image.", "error");
        return;
      }
      if (userBase.password.length < 6) {
        setStatus("signupError", "Password must be at least 6 characters.", "error");
        return;
      }
      if (userBase.password !== confirm) {
        setStatus("signupError", "Passwords do not match.", "error");
        return;
      }
      if (!/^\d{10}$/.test(userBase.phone)) {
        setStatus("signupError", "Phone number must be 10 digits.", "error");
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        const user = { ...userBase, image: String(reader.result) };
        localStorage.setItem("portfolioUser", JSON.stringify(user));
        signupForm.reset();
        showForm("login");
        setStatus("loginError", "Account created successfully. Login to open your profile.", "success");
        notify("Account created. Login to continue.", "success");
      };
      reader.readAsDataURL(file);
    };
    signupForm.addEventListener("submit", onSignup);
    handlers.push([signupForm, "submit", onSignup]);
  }

  if (loginForm) {
    const demoButton = loginForm.querySelector<HTMLButtonElement>("#demoLogin, .demo-login-btn") ?? document.createElement("button");
    if (!demoButton.isConnected) {
      demoButton.type = "button";
      demoButton.className = "auth-demo-btn demo-login-btn";
      demoButton.innerHTML = `<i class="fa-solid fa-wand-magic-sparkles"></i> Demo`;
      loginForm.insertBefore(demoButton, document.getElementById("loginError"));
    }

    const onDemoLogin = () => {
      const demoUser: PortfolioUser = {
        username: "Hanvitha Demo",
        email: "demo@hanvitha.dev",
        phone: "9876543210",
        linkedIn: "https://www.linkedin.com/in/hanvithapesarikayala",
        password: "Demo@123",
        image: "/images/logo.jpg",
      };
      localStorage.setItem("portfolioUser", JSON.stringify(demoUser));
      setUser(demoUser);
      fillProfile(demoUser);
      showForm("profile");
      window.history.replaceState(null, "", "#/login#profileForm");
      notify("Demo profile loaded. Login data opens correctly.", "success");
    };

    demoButton.addEventListener("click", onDemoLogin);
    handlers.push([demoButton, "click", onDemoLogin]);

    const onLogin = (event: Event) => {
      event.preventDefault();
      const error = document.getElementById("loginError");
      if (error) error.textContent = "";
      const user = loadUser();
      if (!user) {
        setStatus("loginError", "No account found. Please sign up.", "error");
        return;
      }
      const identifier = inputValue("loginIdentifier").trim();
      if ((identifier !== user.email && identifier !== user.username) || inputValue("loginPassword") !== user.password) {
        setStatus("loginError", "Invalid username/email or password.", "error");
        return;
      }
      setUser(user);
      fillProfile(user);
      showForm("profile");
      window.history.replaceState(null, "", "#/login#profileForm");
      notify(`Welcome back, ${user.username}. Profile opened.`, "success");
    };
    loginForm.addEventListener("submit", onLogin);
    handlers.push([loginForm, "submit", onLogin]);
  }

  if (profileForm) {
    const inputs = profileForm.querySelectorAll<HTMLInputElement>("input");
    const editButton = document.getElementById("editProfileBtn") as HTMLButtonElement | null;
    const saveButton = document.getElementById("saveProfileBtn") as HTMLButtonElement | null;
    const onEdit = () => {
      inputs.forEach((input) => {
        input.disabled = false;
      });
      if (saveButton) saveButton.style.display = "inline-block";
      if (editButton) editButton.style.display = "none";
    };
    editButton?.addEventListener("click", onEdit);
    if (editButton) handlers.push([editButton, "click", onEdit]);

    const onSave = (event: Event) => {
      event.preventDefault();
      const user = loadUser();
      if (!user) return;
      const updated = {
        ...user,
        username: inputValue("profileUsername").trim(),
        email: inputValue("profileEmail").trim(),
        phone: inputValue("profilePhone").trim(),
        linkedIn: inputValue("profileLinkedIn").trim(),
        password: inputValue("profilePassword"),
      };
      localStorage.setItem("portfolioUser", JSON.stringify(updated));
      setUser(updated);
      inputs.forEach((input) => {
        input.disabled = true;
      });
      if (saveButton) saveButton.style.display = "none";
      if (editButton) editButton.style.display = "inline-block";
      setStatus("profileError", "Profile updated successfully.", "success");
      notify("Profile updated successfully.", "success");
    };
    profileForm.addEventListener("submit", onSave);
    handlers.push([profileForm, "submit", onSave]);

    const imageButton = document.getElementById("editImageBtn");
    const imageInput = document.getElementById("profileImage") as HTMLInputElement | null;
    const onImageClick = () => imageInput?.click();
    imageButton?.addEventListener("click", onImageClick);
    if (imageButton) handlers.push([imageButton, "click", onImageClick]);
    if (imageInput) {
      const onImageChange = () => {
        const file = imageInput.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
          const user = loadUser();
          if (!user) return;
          const updated = { ...user, image: String(reader.result) };
          localStorage.setItem("portfolioUser", JSON.stringify(updated));
          setUser(updated);
          fillProfile(updated);
          notify("Profile image updated.", "success");
        };
        reader.readAsDataURL(file);
      };
      imageInput.addEventListener("change", onImageChange);
      handlers.push([imageInput, "change", onImageChange]);
    }
  }

  return () => handlers.forEach(([element, event, handler]) => element.removeEventListener(event, handler));
}

function setupPasswordEnhancements(handlers: Array<[Element, string, EventListener]>) {
  document.querySelectorAll<HTMLButtonElement>("[data-password-target]").forEach((button) => {
    const onClick = () => {
      const input = document.getElementById(button.dataset.passwordTarget ?? "") as HTMLInputElement | null;
      if (!input) return;
      const isPassword = input.type === "password";
      input.type = isPassword ? "text" : "password";
      button.setAttribute("aria-label", isPassword ? "Hide password" : "Show password");
      button.innerHTML = `<i class="fa-solid ${isPassword ? "fa-eye-slash" : "fa-eye"}"></i>`;
    };
    button.addEventListener("click", onClick);
    handlers.push([button, "click", onClick]);
  });

  const password = document.getElementById("signupPassword") as HTMLInputElement | null;
  const bar = document.getElementById("passwordStrengthBar");
  const text = document.getElementById("passwordStrengthText");
  if (!password || !bar || !text) return;

  const onInput = () => {
    const value = password.value;
    let score = 0;
    if (value.length >= 8) score += 1;
    if (/[A-Z]/.test(value) && /[a-z]/.test(value)) score += 1;
    if (/\d/.test(value)) score += 1;
    if (/[^A-Za-z0-9]/.test(value)) score += 1;
    const states = [
      { width: "15%", color: "#ef4444", label: "Use 8+ characters with letters and numbers." },
      { width: "35%", color: "#f97316", label: "Weak password. Add more variety." },
      { width: "60%", color: "#eab308", label: "Good start. Add a symbol for extra strength." },
      { width: "82%", color: "#22c55e", label: "Strong password." },
      { width: "100%", color: "#22D3EE", label: "Excellent password." },
    ];
    const state = states[score];
    bar.style.width = value ? state.width : "0";
    bar.style.background = state.color;
    text.textContent = value ? state.label : states[0].label;
  };

  password.addEventListener("input", onInput);
  handlers.push([password, "input", onInput]);
}

function addHandler(id: string, event: string, handler: EventListener, handlers: Array<[Element, string, EventListener]>) {
  const element = document.getElementById(id);
  if (!element) return;
  element.addEventListener(event, handler);
  handlers.push([element, event, handler]);
}

function inputValue(id: string) {
  return (document.getElementById(id) as HTMLInputElement | null)?.value ?? "";
}

function setValue(id: string, value: string) {
  const input = document.getElementById(id) as HTMLInputElement | null;
  if (input) input.value = value;
}

export default App;
