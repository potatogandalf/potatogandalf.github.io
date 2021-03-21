"use strict";

/* Is it good practice to write down feelings in source code?

I've been worrying a lot about the efficiency of the code below.
All the DOM manipulation, global variables and all.
I just tested it now. It's beautiful and there's something in my eye.
*/

// The entire hatch is a button because clicking on corners doesn't work
// with the padding when the button is nested within the hatch.
let openSidebarBtn = document.querySelector(".navbar__hatch");
let sidebar = document.querySelector(".sidebar");

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

function closeSidebar() {
  if (isSidebarOpen) {
    let timeline = gsap.timeline({
      onComplete: () => {
        isSidebarOpen = false;
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

document.addEventListener("keydown", function (e) {
  if (e.code === "Escape" || e.keyCode === 27) {
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
