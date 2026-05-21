document.addEventListener("DOMContentLoaded", () => {
  setupResourceFilters();
  setupLearningPath();
  setupEstimator();
  setupContactFormEnhancements();
  setupAuthEnhancements();
});

function setupResourceFilters() {
  const search = document.getElementById("resourceSearch");
  const filters = document.querySelectorAll(".resource-filter");
  const cards = document.querySelectorAll(".resource-card[data-category]");

  if (!cards.length) return;

  let activeFilter = "all";

  function updateCards() {
    const query = (search?.value || "").trim().toLowerCase();

    cards.forEach((card) => {
      const text = card.textContent.toLowerCase();
      const categories = card.dataset.category || "";
      const matchesSearch = !query || text.includes(query);
      const matchesFilter = activeFilter === "all" || categories.includes(activeFilter);

      card.classList.toggle("is-hidden", !(matchesSearch && matchesFilter));
    });
  }

  search?.addEventListener("input", updateCards);

  filters.forEach((button) => {
    button.addEventListener("click", () => {
      filters.forEach((item) => item.classList.remove("active"));
      button.classList.add("active");
      activeFilter = button.dataset.filter || "all";
      updateCards();
    });
  });
}

function setupLearningPath() {
  const items = document.querySelectorAll("[data-path-item]");
  if (!items.length) return;

  items.forEach((item) => {
    const key = `learning-path:${item.dataset.pathItem}`;
    item.checked = localStorage.getItem(key) === "done";

    item.addEventListener("change", () => {
      if (item.checked) {
        localStorage.setItem(key, "done");
      } else {
        localStorage.removeItem(key);
      }
    });
  });
}

function setupEstimator() {
  const type = document.getElementById("estimateType");
  const pages = document.getElementById("estimatePages");
  const timeline = document.getElementById("estimateTimeline");
  const support = document.getElementById("estimateSupport");
  const output = document.getElementById("estimateOutput");

  if (!type || !pages || !timeline || !support || !output) return;

  function formatRupees(value) {
    return `Rs. ${Math.round(value).toLocaleString("en-IN")}`;
  }

  function updateEstimate() {
    const base = Number(type.value);
    const screenCount = Math.max(1, Number(pages.value) || 1);
    const urgency = Number(timeline.value);
    const supportCost = support.checked ? 4000 : 0;
    const low = (base + screenCount * 1500 + supportCost) * urgency;
    const high = low * 1.28;

    output.textContent = `${formatRupees(low)} - ${formatRupees(high)}`;
  }

  [type, pages, timeline, support].forEach((control) => {
    control.addEventListener("input", updateEstimate);
    control.addEventListener("change", updateEstimate);
  });

  updateEstimate();
}

function setupContactFormEnhancements() {
  const form = document.querySelector(".contact-form");
  if (!form) return;

  const textInputs = form.querySelectorAll('input[type="text"]');
  const subject = textInputs[1];
  const topicButtons = form.querySelectorAll("[data-contact-topic]");
  const message = form.querySelector("textarea");
  const count = document.getElementById("messageCount");
  const status = document.getElementById("contactFormStatus");

  topicButtons.forEach((button) => {
    button.addEventListener("click", () => {
      topicButtons.forEach((item) => item.classList.remove("active"));
      button.classList.add("active");
      if (subject) subject.value = button.dataset.contactTopic || "";
      subject?.focus();
    });
  });

  message?.addEventListener("input", () => {
    if (count) count.textContent = `${message.value.length} / ${message.maxLength}`;
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (status) {
      status.textContent = "Thanks! Your message is ready. Please connect this form to your email service to send it live.";
    }
  });
}

function setupAuthEnhancements() {
  const toggles = document.querySelectorAll("[data-password-target]");
  const password = document.getElementById("signupPassword");
  const bar = document.getElementById("passwordStrengthBar");
  const text = document.getElementById("passwordStrengthText");

  toggles.forEach((button) => {
    button.addEventListener("click", () => {
      const input = document.getElementById(button.dataset.passwordTarget);
      if (!input) return;

      const isPassword = input.type === "password";
      input.type = isPassword ? "text" : "password";
      button.setAttribute("aria-label", isPassword ? "Hide password" : "Show password");
      button.innerHTML = `<i class="fa-solid ${isPassword ? "fa-eye-slash" : "fa-eye"}"></i>`;
    });
  });

  if (!password || !bar || !text) return;

  password.addEventListener("input", () => {
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
      { width: "100%", color: "#22D3EE", label: "Excellent password." }
    ];

    const state = states[score];
    bar.style.width = value ? state.width : "0";
    bar.style.background = state.color;
    text.textContent = value ? state.label : states[0].label;
  });
}
