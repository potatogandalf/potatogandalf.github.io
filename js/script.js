"use strict";

let openSidebarBtn = document.querySelector(".navbar__sidebar_btn");
let sidebar = document.querySelector(".sidebar");
openSidebarBtn.addEventListener("click", function() {
    let pageMask = document.createElement("div");
    document.body.append(pageMask);
    pageMask.classList.add("page__mask");
    // Set it with a delay because transition doesn't seem to work otherwise.
    setTimeout(() => pageMask.classList.add("page__mask__active"), 10);
    sidebar.classList.add("sidebar-visible");
});