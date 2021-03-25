Modal = {
  CSSClasses: ["modal", "theme_picker__modal"],
  childCSSClasses: ["theme_picker__preview"],
  finalPosition: { xPercent: -50, yPercent: -50 },
  display: function () {
    gsap
      .timeline()
      .fromTo(
        ".overlay",
        { yPercent: -100, opacity: 0, visibility: "visible" },
        { duration: 0.5, yPercent: -50, opacity: 1 }
      )
      .to(
        ".page__mask",
        { duration: 0.5, opacity: 0.5, visibility: "visible" },
        "<"
      );
  },
};

function createOverlay(overlayType) {
  let overlay = document.createElement("div");
  overlay.classList.add(...overlayType.CSSClasses);
  overlay.childCSSClasses = overlayType.childCSSClasses;
  overlay.display = overlayType.display;
  return overlay;
}

function addOverlayChild(overlay, child) {
  child.classList.add(...overlay.childCSSClasses);
  overlay.appendChild(child);
}

function switchOverlay(overlay, overlayType) {
  overlay.className = overlayType.CSSClasses.join(" ");
  overlay.children.forEach((child) => {
    child.className = overlayType.childCSSClasses.join(" ");
  });
  overlay.display = overlayType.display;
  gsap.to(".overlay", overlayType.finalPosition);
}
