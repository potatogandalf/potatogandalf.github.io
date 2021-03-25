"use strict";

let animationCache = { open: null, closed: [] };

const sidebarAnimation = gsap
  .timeline({ paused: true, defaults: { duration: 0.7 } })
  .to(".navbar__hatch", { rotation: 90 })
  .to(".page__mask", { opacity: 0.5, visibility: "visible" })
  .fromTo(
    ".sidebar",
    { xPercent: 0, yPercent: -120 },
    { visibility: "visible", yPercent: 0 },
    "<"
  );

const sidebarAnimationMobile = gsap
  .timeline({ paused: true, defaults: { duration: 0.5 } })
  .fromTo(
    ".sidebar",
    { xPercent: -100, yPercent: 0 },
    { visibility: "visible", xPercent: 0 },
    "<"
  );

const modalAnimationMobile = gsap
  .timeline({ paused: true, defaults: { duration: 0.5 } })
  .fromTo(
    ".theme_picker__modal",
    { yPercent: -120, visibility: "visible" },
    { yPercent: 0 }
  );

const modalAnimation = gsap
  .timeline({ paused: true })
  .fromTo(
    ".modal",
    { yPercent: -100, opacity: 0, visibility: "visible" },
    { duration: 0.5, yPercent: -50, opacity: 1 }
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

document.addEventListener("DOMContentLoaded", function (e) {
  let currentTheme = localStorage.getItem("currentTheme");
  if (currentTheme === null) {
    applyTheme("lights-out"); // Dark mode ftw
  } else {
    applyTheme(currentTheme);
  }
});

window.addEventListener("load", function () {
  document.body.style.visibility = "visible"; // Fix FOUC
});

window.addEventListener("resize", function () {
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

document.addEventListener("scroll", function () {
  if (window.scrollY > 0) {
    navbar_items.forEach((item) => item.classList.add("navbar-opaque"));
  } else if (window.scrollY === 0) {
    navbar_items.forEach((item) => item.classList.remove("navbar-opaque"));
  }
});

document.addEventListener("keydown", function (e) {
  if (e.code === "Escape" || e.keyCode === 27) {
    // 27 is Escape
    closeSidebar();
    e.preventDefault();
  }
});

document.addEventListener("click", function (e) {
  if (!(e.target.closest(".sidebar") || e.target.closest(".navbar__hatch"))) {
    closeSidebar();
    e.preventDefault();
  }
});

function openOverlay(timeline) {
  timeline.play();
  animationCache.open = timeline;
}

function closeOverlay() {
  animationCache.open.reverse();
}

// The entire hatch is a button because clicking on corners doesn't work
// with the padding when the button is nested within the hatch.
let openSidebarBtn = document.querySelector(".navbar__hatch");

openSidebarBtn.addEventListener("click", function () {
  let animation = checkOnMobile() ? sidebarAnimationMobile : sidebarAnimation;
  console.log(animation);
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

let themes = [
  {
    themeName: "Lights Out",
    bgColorCode: "#000000",
    textColorCode: "#ffffff",
  },
  {
    themeName: "Blinding Lights",
    bgColorCode: "#ffffff",
    textColorCode: "#000000",
  },
];

themeSwitcherBtn.addEventListener("click", function () {
  let themePicker = document.querySelector(".theme_picker__modal");
  themes.forEach((theme) => {
    themePicker.appendChild(createThemePreview(theme));
  });
  document.body.appendChild(themePicker);
  let openTimeline = openOverlay(modalAnimation);
});
