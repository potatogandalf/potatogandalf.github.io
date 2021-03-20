"use strict";

let openSidebarButton = document.querySelector(".nav__bar__sidebar_button");
let sidebar = document.querySelector(".sidebar__wrapper");
openSidebarButton.addEventListener("click", function() {
    sidebar.classList.add("sidebar-visible");
});