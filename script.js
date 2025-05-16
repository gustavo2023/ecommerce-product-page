const openMenuBtn = document.querySelector(".menu-open-button");
const closeMenuBtn = document.querySelector(".menu-close-button");
const sidebar = document.getElementById("sidebar");
const overlay = document.querySelector(".overlay");
const shoppingCartBtn = document.querySelector(".shopping-cart-btn");
const userAvatarContainer = document.querySelector(".user-avatar-container");
const cartDropdown = document.getElementById("cart-dropdown");
const emptyCartMessage = document.querySelector(".empty-cart-message");
const cartItemExample = document.querySelector(".cart-item");
const checkoutBtn = document.querySelector(".checkout-btn");

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
  cartDropdown.classList.toggle("visible");

  const isExpanded = shoppingCartBtn.getAttribute("aria-expanded") === "true";
  shoppingCartBtn.setAttribute("aria-expanded", !isExpanded);
  cartDropdown.setAttribute("aria-hidden", isExpanded);

  userAvatarContainer.classList.toggle("avatar-active-border", !isExpanded);

  if (cartDropdown.classList.contains("visible")) {
    const cartIsEmpty = true; // Assume empty initially

    if (cartIsEmpty) {
      emptyCartMessage.classList.remove("hidden");
      cartItemExample.classList.add("hidden");
      checkoutBtn.classList.add("hidden");
    } else {
      emptyCartMessage.classList.add("hidden");
      cartItemExample.classList.remove("hidden");
      checkoutBtn.classList.remove("hidden");
    }
  }
});

document.addEventListener("click", (event) => {
  const isClickInsideCart = cartDropdown.contains(event.target);
  const isClickOnCartButton = shoppingCartBtn.contains(event.target);

  if (
    cartDropdown.classList.contains("visible") &&
    !isClickInsideCart &&
    !isClickOnCartButton
  ) {
    cartDropdown.classList.remove("visible");
    shoppingCartBtn.setAttribute("aria-expanded", "false");
    cartDropdown.setAttribute("aria-hidden", "true");
    userAvatarContainer.classList.remove("avatar-active-border");
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && cartDropdown.classList.contains("visible")) {
    cartDropdown.classList.remove("visible");
    shoppingCartBtn.setAttribute("aria-expanded", "false");
    cartDropdown.setAttribute("aria-hidden", "true");
    userAvatarContainer.classList.remove("avatar-active-border");
  }
});
