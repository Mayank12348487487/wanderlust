const menu_btn = document.querySelector("#mobile-menu-btn");
const menu = document.querySelector("#mobile-menu");
menu_btn.addEventListener("click", () => {
    menu.classList.toggle("hidden");

    if (menu.classList.contains('hidden')) {
        menu.style.maxHeight = "0";
    } else {
        menu.style.maxHeight = menu.scrollHeight + "px";
    }
});
