"use strict";

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
    applyTheme("dark"); // Dark mode ftw
  } else {
    applyTheme(currentTheme);
  }
});

window.addEventListener("load", function () {
  document.body.style.visibility = "visible"; // Fix FOUC
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

/* Need two flags because:
 if isSidebarOpen is used for opening *and* closing
   if isSidebarOpen is set before animation completes
     if user clicks fast enough twice
       hatch opens and closes immediately

    or if isSidebarOpen is set after the animation completes 
      if user clicks fast enough twice 
        hatch opens twice at the same time and glitches.
*/
let isSidebarOpening = false;
let isSidebarOpen = false;

// The entire hatch is a button because clicking on corners doesn't work
// with the padding when the button is nested within the hatch.
let openSidebarBtn = document.querySelector(".navbar__hatch");

openSidebarBtn.addEventListener("click", function () {
  if (!isSidebarOpening) {
    isSidebarOpening = true;

    let timeline = gsap.timeline({
      onComplete: () => {
        isSidebarOpening = false;
        isSidebarOpen = true;
      },
    });

    if (checkOnMobile()) {
      timeline
        .to(".page__mask", {
          duration: 0.4,
          opacity: 0.4,
          visibility: "visible",
        })
        .fromTo(
          ".sidebar",
          { xPercent: -100, yPercent: 0 }, // Reset yPercent after desktop animation.
          { duration: 0.4, visibility: "visible", xPercent: 0 },
          "<"
        );
    } else {
      timeline
        .to(".navbar__hatch", { duration: 0.7, rotation: 90 })
        .to(".page__mask", {
          duration: 0.5,
          opacity: 0.5,
          visibility: "visible",
        })
        .fromTo(
          ".sidebar",
          { xPercent: 0, yPercent: -120 }, // Reset xPercent after mobile animation.
          { duration: 0.7, visibility: "visible", yPercent: 0 },
          "<"
        );
    }
  }
});

let isSidebarClosing = false;

function closeSidebar() {
  if (isSidebarOpen && !isSidebarClosing) {
    isSidebarClosing = true;

    let timeline = gsap.timeline({
      onComplete: () => {
        isSidebarOpen = false;
        isSidebarClosing = false;
      },
    });

    if (checkOnMobile()) {
      timeline
        .set(".navbar__hatch", { rotation: 0 }) // If left open by desktop mode.
        .to(".sidebar", { duration: 0.4, xPercent: -100 })
        .to(".page__mask", { duration: 0.4, opacity: 0 }, "<")
        .set(".page__mask", { visibility: "hidden" });
    } else {
      timeline
        .to(".sidebar", { duration: 0.7, yPercent: -120 })
        .to(".page__mask", { duration: 0.5, opacity: 0 }, "<")
        .set(".page__mask", { visibility: "hidden" })
        // If not opened on mobile
        .fromTo(
          ".navbar__hatch",
          { rotation: 90 },
          { duration: 0.7, rotation: 0 }
        );
    }
  }
}

let sidebarCloseBtn = document.querySelector(".sidebar__close_btn");
sidebarCloseBtn.addEventListener("click", closeSidebar);

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

themeSwitcherBtn.addEventListener("click", function () {
  let currentTheme = localStorage.getItem("currentTheme");
  if (currentTheme === "dark") {
    resetTheme();
    applyTheme("light");
  } else if (currentTheme === "light") {
    resetTheme();
    applyTheme("dark");
  }
});
