const openMenuBtn = document.querySelector(".menu-open-button");
const closeMenuBtn = document.querySelector(".menu-close-button");
const sidebar = document.getElementById("sidebar");
const overlay = document.querySelector(".overlay");
const shoppingCartBtn = document.querySelector(".shopping-cart-btn");
const userAvatarContainer = document.querySelector(".user-avatar-container");

const openSidebar = () => {
  sidebar.classList.add("open");
  sidebar.setAttribute("aria-hidden", "false");
  openMenuBtn.setAttribute("aria-expanded", "true");

  if (overlay) {
    overlay.classList.add("visible");
    overlay.setAttribute("aria-hidden", "false");
  }

  closeMenuBtn.focus();
};

const closeSidebar = () => {
  sidebar.classList.remove("open");
  sidebar.setAttribute("aria-hidden", "true");
  openMenuBtn.setAttribute("aria-expanded", "false");

  if (overlay) {
    overlay.classList.remove("visible");
    overlay.setAttribute("aria-hidden", "true");
  }

  openMenuBtn.focus();
};

openMenuBtn.addEventListener("click", openSidebar);
closeMenuBtn.addEventListener("click", closeSidebar);

if (overlay) {
  overlay.addEventListener("click", closeSidebar);
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && sidebar.classList.contains("open")) {
    closeSidebar();
  }
});

shoppingCartBtn.addEventListener("click", () => {
  userAvatarContainer.classList.toggle("avatar-active-border");
});
