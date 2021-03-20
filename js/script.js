"use strict";

let openSidebarBtn = document.querySelector(".navbar__sidebar_btn");
let sidebar = document.querySelector(".sidebar");
openSidebarBtn.addEventListener("click", function() {
    let pageMask = document.createElement("div");
    pageMask.classList.add("page__mask");
    setTimeout(() => pageMask.classList.add("page__mask__active"), 100);
    document.body.append(pageMask);
    sidebar.classList.add("sidebar-visible");
});