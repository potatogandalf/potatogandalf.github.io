"use strict";

// The entire hatch is a button because clicking on corners doesn't work
// with the padding when the button is nested within the hatch.
let openSidebarBtn = document.querySelector(".navbar__hatch");
let sidebar = document.querySelector(".sidebar");

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
    timeline
      .to(".navbar__hatch", { duration: 0.7, rotation: 90 })
      .to(".page__mask", { duration: 0.5, opacity: 0.5, visibility: "visible" })
      .fromTo(
        ".sidebar",
        { yPercent: -120 },
        { duration: 0.7, visibility: "visible", yPercent: 0 },
        "<"
      );
  }
});

function closeSidebar() {
  if (isSidebarOpen) {
    let timeline = gsap.timeline({
      onComplete: () => {
        isSidebarOpen = false;
      },
    });
    timeline
      .to(".sidebar", { duration: 0.7, yPercent: -120 })
      .to(".page__mask", { duration: 0.5, opacity: 0 }, "<")
      .set(".page__mask", { visibility: "hidden" })
      .to(".navbar__hatch", { duration: 0.7, rotation: 0 });
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
