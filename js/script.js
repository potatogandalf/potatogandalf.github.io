"use strict";

// Used to close any open overlay without specifying timeline.
let animationCache = { open: null, closed: [] };
// Use separate state because gsap tween.isActive() is always false, even right after playing it.
let isAnimationRunning = false;
let isOverlayOpen = false;

let sidebarAnimation = () =>
  gsap
    .timeline({
      paused: true,
      defaults: { duration: 0.7 },
    })
    .to(".navbar__hatch", { rotation: 90 })
    .to(".page__mask", { opacity: 0.5, visibility: "visible" })
    .fromTo(
      ".sidebar",
      { xPercent: 0, yPercent: -120, display: "block" },
      { yPercent: 0 },
      "<"
    );

let sidebarAnimationMobile = () =>
  gsap
    .timeline({
      paused: true,
      defaults: { duration: 0.5 },
    })
    .to(".page__mask", { opacity: 0.5, visibility: "visible" })
    .fromTo(
      ".sidebar",
      { xPercent: -100, yPercent: 0, display: "block" },
      { xPercent: 0 },
      "<"
    );

let modalAnimationMobile = () =>
  gsap
    .timeline({
      paused: true,
      defaults: { duration: 0.5 },
    })
    .to(".page__mask", { opacity: 0.5, visibility: "visible" })
    .fromTo(
      ".modal",
      { xPercent: 0, yPercent: -120, opacity: 0, display: "block" },
      { yPercent: 0, opacity: 1 },
      "<"
    );

let modalAnimation = () =>
  gsap
    .timeline({
      paused: true,
      defaults: { duration: 0.5 },
    })
    .to(".page__mask", { opacity: 0.5, visibility: "visible" })
    // Go from -100y (outside the page, or near the top border)
    // to translateY(-50) which is center of the page.
    // top: 50% in CSS sets its topleft corner to the middle, so use
    // translateY(-50) to position it correctly.
    .fromTo(
      ".modal",
      { yPercent: -100, opacity: 0, display: "block" },
      { yPercent: -50, opacity: 1 },
      "<"
    );

let responsiveDetector = document.getElementById("js-responsive-detector");

// You will see this function used too many times in this code.
// Why? To ensure nothing breaks on window resize. Say, someone starts
// the sidebar animation while on >650px window size.
// Then they switch to <650px. What happens when they close the sidebar?
// The desktop sized sidebar smashes through the roof when it should be
// elegantly sliding left instead. Some performance tradeoff is necessary
// for a truly bug-free experience.
//
//
// Or it might be because I don't know anything about JS.
function checkOnMobile() {
  return getComputedStyle(responsiveDetector).getPropertyValue("--on-mobile");
}

let navbar_items = document.querySelectorAll(".navbar__item");

document.addEventListener("DOMContentLoaded", (e) => {
  let currentTheme = localStorage.getItem("currentTheme");
  if (currentTheme === null) {
    applyTheme("lights-out"); // Dark mode ftw
  } else {
    applyTheme(currentTheme);
  }
});

window.addEventListener(
  "load",
  () => (document.body.style.visibility = "visible")
); // Fix FOUC

window.addEventListener("resize", () => {
  // TODO: Remove this line by setting lastWidth in DOMContentLoaded
  window.lastWidth = window.lastWidth ? window.lastWidth : window.innerWidth;
  // TODO: Replace this with checkOnMobile if that's faster/more efficient.
  if (window.lastWidth >= 650 && window.innerWidth < 650) {
    gsap.set(".modal", { xPercent: 0, yPercent: 0 });
  } else if (window.lastWidth <= 650 && window.innerWidth > 650) {
    gsap.set(".modal", { xPercent: -50, yPercent: -50 });
  }
  window.lastWidth = window.innerWidth;
});

// GSAP is not used here because it would not be
// possible to retrieve theme colors from CSS.
// And I don't like the idea of storing them here
// as constants.

document.addEventListener("scroll", () => {
  if (window.scrollY > 0) {
    navbar_items.forEach((item) => item.classList.add("navbar-opaque"));
  } else if (window.scrollY === 0) {
    navbar_items.forEach((item) => item.classList.remove("navbar-opaque"));
  }
});

document.addEventListener("keydown", (e) => {
  if (e.code === "Escape" || e.keyCode === 27) {
    // 27 is Escape
    closeOverlay();
    e.preventDefault();
  }
});

document.addEventListener("click", (e) => {
  if (!isAnimationRunning && isOverlayOpen && !e.target.closest(".overlay")) {
    closeOverlay();
  }
});

// here be unicorn magic
function openOverlay(timeline) {
  isAnimationRunning = true;
  let cachedTimelineObj = animationCache.closed.find(
    (i) => i.caller === timeline.name
  );
  if (cachedTimelineObj) {
    cachedTimelineObj.cached.play().then(() => {
      isAnimationRunning = false;
      isOverlayOpen = true;
    });
    animationCache.open = cachedTimelineObj;
  } else {
    let cachedTimeline = timeline();
    cachedTimeline.play().then(() => {
      isAnimationRunning = false;
      isOverlayOpen = true;
    });
    animationCache.open = { caller: timeline.name, cached: cachedTimeline };
  }
}

function closeOverlay() {
  if (animationCache.open) {
    animationCache.open.cached.reverse();
    animationCache.closed.push(animationCache.open);
    animationCache.open = null;
    isOverlayOpen = false;
  }
}

// The entire hatch is a button because clicking on corners doesn't work
// with the padding when the button is nested within the hatch.
let openSidebarBtn = document.querySelector(".navbar__hatch");

openSidebarBtn.addEventListener("click", function () {
  let animation = checkOnMobile() ? sidebarAnimationMobile : sidebarAnimation;
  openOverlay(animation);
});

let sidebarCloseBtn = document.querySelector(".sidebar__close_btn");
sidebarCloseBtn.addEventListener("click", closeOverlay);

let themeSwitcherBtn = document.querySelector(".theme_picker_btn");

function applyTheme(newTheme) {
  document
    .querySelector(`link[title="${newTheme}"]`)
    .removeAttribute("disabled");
  document.body.classList.add(newTheme);
  hljs.highlightBlock(document.querySelector(".code__editor"));

  localStorage.setItem("currentTheme", newTheme);
}

function resetTheme() {
  let currentTheme = localStorage.getItem("currentTheme");
  document.body.classList.remove(currentTheme);
  document
    .querySelector(`link[title="${currentTheme}"]`)
    .setAttribute("disabled", "disabled");
}

function createThemePreview(theme) {
  let preview = document.createElement("div");
  preview.classList.add("theme_picker__preview");
  preview.textContent = theme.themeName;
  preview.style.backgroundColor = theme.bgColorCode;
  preview.style.color = theme.textColorCode;
  return preview;
}

themeSwitcherBtn.addEventListener("click", function () {
  let animation = checkOnMobile() ? modalAnimationMobile : modalAnimation;
  openOverlay(animation);
});
