"use strict";

let openSidebarBtn = document.querySelector(".navbar__sidebar_btn");
let sidebar = document.querySelector(".sidebar");
openSidebarBtn.addEventListener("click", function () {
  let timeline = gsap.timeline();
  timeline
    .to(".navbar__hatch", { duration: 0.7, rotation: 90 })
    .to(".page__mask", { duration: 0.5, opacity: 0.5, visibility: "visible" })
    .fromTo(
      ".sidebar",
      { yPercent: -120 },
      { duration: 0.7, visibility: "visible", yPercent: 0 },
      "<"
    );
});

document.addEventListener("keydown", function (e) {
  if (e.code === "Escape" || e.keyCode == 27) {
    let timeline = gsap.timeline();
    timeline
      .to(".sidebar", { duration: 0.7, yPercent: -120 })
      .to(".page__mask", { duration: 0.5, opacity: 0 }, "<")
      // Use a separate visibilty animator because
      // Animating both opacity and visibility
      // at the same time makes the element disappear immediately.
      // Why not set the elem.style.visibility later on?
      // Well, the page would be inaccessible for 0.7 seconds
      // while the hatch swung.
      .set(".page__mask", { visibility: "hidden" })
      .to(".navbar__hatch", { duration: 0.7, rotation: 0 });

    e.preventDefault();
  }
});
