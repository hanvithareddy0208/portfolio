document.addEventListener("DOMContentLoaded", () => {
  const hamburger = document.getElementById("hamburger");
  const navLinks = document.getElementById("nav-links");
  const userInfo = document.getElementById("userInfo");

  // Hamburger toggle for mobile
  hamburger?.addEventListener("click", () => {
    navLinks.classList.toggle("active");
    hamburger.classList.toggle("open");
  });

  // Dropdown hover effect
  const dropdown = document.querySelector(".user-info .dropdown");
  userInfo?.addEventListener("mouseenter", () => {
    dropdown.style.display = "flex";
    dropdown.style.flexDirection = "column";
    dropdown.style.position = "absolute";
    dropdown.style.background = "#111";
    dropdown.style.padding = "10px";
    dropdown.style.borderRadius = "8px";
    dropdown.style.top = "40px";
    dropdown.style.right = "0";
  });
  userInfo?.addEventListener("mouseleave", () => {
    dropdown.style.display = "none";
  });
});




