"use strict";

let openSidebarButton = document.querySelector(".nav__bar__sidebar_button");
let sidebar = document.querySelector(".sidebar__wrapper");
openSidebarButton.addEventListener("click", function() {
    let pageMask = document.createElement("div");
    pageMask.classList.add("page__mask");
    setTimeout(() => pageMask.classList.add("page__mask__active"), 100);
    document.body.append(pageMask);
    sidebar.classList.add("sidebar-visible");
});