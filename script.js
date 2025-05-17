const openMenuBtn = document.querySelector(".menu-open-button");
const closeMenuBtn = document.querySelector(".menu-close-button");
const sidebar = document.getElementById("sidebar");
const overlay = document.querySelector(".overlay");
const shoppingCartBtn = document.querySelector(".shopping-cart-btn");
const userAvatarContainer = document.querySelector(".user-avatar-container");
const cartItemCountSpan = shoppingCartBtn.querySelector(".cart-item-count");

const cartDropdown = document.getElementById("cart-dropdown");
const emptyCartMessage = document.querySelector(".empty-cart-message");
const cartItemExample = document.querySelector(".cart-item");
const checkoutBtn = document.querySelector(".checkout-btn");
const cartItemsContainer = cartDropdown.querySelector(".cart-content");

const mainProductImage = document.getElementById("main-product-image");
const thumbnailImages = document.querySelectorAll(".thumbnail-image");

const lightbox = document.getElementById("lightbox");
const lightboxMainImage = lightbox.querySelector(".lightbox-main-image");
const lightboxThumbnails = lightbox.querySelectorAll(
  ".lightbox-thumbnail-image"
);
const lightboxCloseBtn = lightbox.querySelector(".lightbox-close-btn");
const lightboxPrevBtn = lightbox.querySelector(".lightbox-prev-btn");
const lightboxNextBtn = lightbox.querySelector(".lightbox-next-btn");

const mobilePrevBtn = document.querySelector(".prev-image-btn");
const mobileNextBtn = document.querySelector(".next-image-btn");

const minusItemBtn = document.querySelector(".minus-item-btn");
const addItemBtn = document.querySelector(".add-item-btn");
const itemQuantityDisplay = document.querySelector(".item-quantity");
const addToCartBtn = document.querySelector(".add-to-cart-btn");

let selectedQuantity = 0;
let cart = {}; // Simple object to represent the cart state { productId: quantity }
let currentImageIndex = 0;
let isMobileView = window.innerWidth <= 768;

const product = {
  id: 1,
  name: "Fall Limited Edition Sneakers",
  price: 125.0,
  originalPrice: 250.0,
  discount: "50%",
  thumbnail: "./images/image-product-1-thumbnail.jpg",
};

const images = [
  {
    full: "./images/image-product-1.jpg",
    thumbnail: "./images/image-product-1-thumbnail.jpg",
  },
  {
    full: "./images/image-product-2.jpg",
    thumbnail: "./images/image-product-2-thumbnail.jpg",
  },
  {
    full: "./images/image-product-3.jpg",
    thumbnail: "./images/image-product-3-thumbnail.jpg",
  },
  {
    full: "./images/image-product-4.jpg",
    thumbnail: "./images/image-product-4-thumbnail.jpg",
  },
];

// --- Quantity Selection ---
const updateQuantityDisplay = () => {
  itemQuantityDisplay.textContent = selectedQuantity;
};

const decreaseSelectedQuantity = () => {
  if (selectedQuantity > 0) {
    selectedQuantity--;
    updateQuantityDisplay();
  }
};

const increaseSelectedQuantity = () => {
  selectedQuantity++;
  updateQuantityDisplay();
};

// --- Cart Management ---
const clearCartDOMItems = () => {
  const currentItemElements = cartItemsContainer.querySelectorAll('div.cart-item');
  currentItemElements.forEach(item => item.remove());
};

const updateCartVisibility = (itemCount) => {
  if (itemCount === 0) {
    emptyCartMessage.classList.remove("hidden");
    checkoutBtn.classList.add("hidden");
  } else {
    emptyCartMessage.classList.add("hidden");
    checkoutBtn.classList.remove("hidden");
  }
};

const createCartItemDOM = (itemProduct, quantity, productId) => {
  const itemTotal = (itemProduct.price * quantity).toFixed(2);
  const cartItemElement = document.createElement("div");
  cartItemElement.classList.add("cart-item");
  cartItemElement.dataset.productId = productId;

  cartItemElement.innerHTML = `
      <img src="${itemProduct.thumbnail}" alt="${itemProduct.name} thumbnail" class="cart-item-thumbnail">
      <div class="cart-item-details">
          <p class="cart-item-name">${itemProduct.name}</p>
          <p class="cart-item-price">$${itemProduct.price.toFixed(2)} x <span class="cart-item-quantity">${quantity}</span> <span class="cart-item-total">$${itemTotal}</span></p>
      </div>
      <button class="delete-item-btn" aria-label="Remove item from cart">
           <svg width="14" height="16" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><defs><path d="M0 2.625V1.75C0 1.334.334 1 .75 1h3.5l.294-.584A.741.741 0 0 1 5.213 0h3.571a.75.75 0 0 1 .672.416L9.75 1h3.5c.416 0 .75.334.75.75v.875a.376.376 0 0 1-.375.375H.375A.376.376 0 0 1 0 2.625Zm13 1.75V14.5a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 1 14.5V4.375C1 4.169 1.169 4 1.375 4h11.25c.206 0 .375.169.375.375ZM4.5 6.5c0-.275-.225-.5-.5-.5s-.5.225-.5.5v7c0 .275.225.5.5.5s.5-.225.5-.5v-7Zm3 0c0-.275-.225-.5-.5-.5s-.5.225-.5.5v7c0 .275.225.5.5.5s.5-.225.5-.5v-7Zm3 0c0-.275-.225-.5-.5-.5s-.5.225-.5.5v7c0 .275.225.5.5.5s.5-.225.5-.5v-7Z" id="a"/></defs><use fill="#C3CAD9" fill-rule="nonzero" xlink:href="#a"/></svg>
      </button>
  `;

  cartItemElement.querySelector(".delete-item-btn").addEventListener("click", () => {
    removeProductFromCart(productId);
  });

  return cartItemElement;
};

const renderCartItemsDOM = () => {
  Object.keys(cart).forEach((productId) => {
    const quantity = cart[productId];
    const cartItemElement = createCartItemDOM(product, quantity, productId);
    cartItemsContainer.insertBefore(cartItemElement, checkoutBtn);
  });
};

const updateCartIconBadge = () => {
    const totalItemsInCart = Object.values(cart).reduce((sum, qty) => sum + qty, 0);
    if (cartItemCountSpan) {
        if (totalItemsInCart > 0) {
            cartItemCountSpan.textContent = totalItemsInCart;
            cartItemCountSpan.classList.add("visible");
        } else {
            cartItemCountSpan.textContent = ""; // Clear content when cart is empty
            cartItemCountSpan.classList.remove("visible");
        }
    }
};

const updateCartDisplay = () => {
  clearCartDOMItems();
  const itemCount = Object.keys(cart).length;
  updateCartVisibility(itemCount);

  if (itemCount > 0) {
    renderCartItemsDOM();
  }
  updateCartIconBadge();
};

const addProductToCart = (productId, quantity) => {
  if (quantity > 0) {
    cart[productId] = (cart[productId] || 0) + quantity;
    updateCartDisplay();
  }
};

const removeProductFromCart = (productId) => {
  if (cart[productId]) {
    delete cart[productId];
    updateCartDisplay();
  }
};

const handleAddToCart = () => {
  if (selectedQuantity > 0) {
    addProductToCart(product.id, selectedQuantity);
    selectedQuantity = 0;
    updateQuantityDisplay();
  }
};

// --- Sidebar Navigation ---
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

const handleEscapeKeyForSidebar = (event) => {
  if (event.key === "Escape" && sidebar.classList.contains("open")) {
    closeSidebar();
  }
};

// --- Cart Dropdown ---
const toggleCartDropdown = () => {
  const isVisible = cartDropdown.classList.toggle("visible");
  shoppingCartBtn.setAttribute("aria-expanded", isVisible);
  cartDropdown.setAttribute("aria-hidden", !isVisible);
  userAvatarContainer.classList.toggle("avatar-active-border", isVisible);
};

const closeCartDropdown = () => {
    cartDropdown.classList.remove("visible");
    shoppingCartBtn.setAttribute("aria-expanded", "false");
    cartDropdown.setAttribute("aria-hidden", "true");
    userAvatarContainer.classList.remove("avatar-active-border");
};

const handleDocumentClickForCartDropdown = (event) => {
  const isClickInsideCart = cartDropdown.contains(event.target);
  const isClickOnCartButton = shoppingCartBtn.contains(event.target);

  if (cartDropdown.classList.contains("visible") && !isClickInsideCart && !isClickOnCartButton) {
    closeCartDropdown();
  }
};

const handleEscapeKeyForCartDropdown = (event) => {
  if (event.key === "Escape" && cartDropdown.classList.contains("visible")) {
    closeCartDropdown();
  }
};

// --- Image Gallery & Lightbox ---
const updateMainProductImage = (index) => {
  mainProductImage.src = images[index].full;
  mainProductImage.alt = `Fall Limited Edition Sneakers - image ${index + 1}`;
  currentImageIndex = index;
};

const setActiveThumbnail = (thumbnailsNodeList, index) => {
  thumbnailsNodeList.forEach((thumb, idx) => {
    const isActive = idx === index;
    thumb.classList.toggle("active", isActive);
    thumb.setAttribute("aria-selected", isActive.toString());
    if (thumbnailsNodeList === lightboxThumbnails) {
        thumb.setAttribute("tabindex", isActive ? "0" : "-1");
    }
  });
};

const openLightbox = () => {
  if (window.innerWidth > 768) { // Only open lightbox on desktop sizes
    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
    lightboxMainImage.src = images[currentImageIndex].full; // Use currentImageIndex
    lightboxMainImage.alt = `Fall Limited Edition Sneakers - large view ${currentImageIndex + 1}`;
    setActiveThumbnail(lightboxThumbnails, currentImageIndex);
    document.body.style.overflow = "hidden";
    lightboxNextBtn.focus(); // Focus on a button in lightbox
  }
};

const closeLightbox = () => {
  lightbox.classList.remove("open");
  lightbox.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  mainProductImage.focus();
};

const updateLightboxImage = (index) => {
  if (index >= 0 && index < images.length) {
    lightboxMainImage.src = images[index].full;
    lightboxMainImage.alt = `Fall Limited Edition Sneakers - large view ${index + 1}`;
    currentImageIndex = index;
    setActiveThumbnail(lightboxThumbnails, index);
  }
};

const navigateLightboxPrev = () => {
  const newIndex = (currentImageIndex - 1 + images.length) % images.length;
  updateLightboxImage(newIndex);
};

const navigateLightboxNext = () => {
  const newIndex = (currentImageIndex + 1) % images.length;
  updateLightboxImage(newIndex);
};

const handleLightboxThumbnailClick = (event) => {
  const index = parseInt(event.target.closest('.lightbox-thumbnail-image').dataset.index);
  updateLightboxImage(index);
};

const handleLightboxOverlayClick = (event) => {
  if (event.target === lightbox.querySelector(".lightbox-overlay")) {
    closeLightbox();
  }
};

const handleEscapeKeyForLightbox = (event) => {
  if (event.key === "Escape" && lightbox.classList.contains("open")) {
    closeLightbox();
  }
};

const handleProductThumbnailClick = (event) => {
  const clickedThumbnail = event.target.closest('.thumbnail-image');
  if (!clickedThumbnail) return;
  const index = parseInt(clickedThumbnail.dataset.index);
  updateMainProductImage(index);
  setActiveThumbnail(thumbnailImages, index);
};

// --- Mobile Image Slider ---
const updateMobileImage = (index) => {
  if (index >= 0 && index < images.length) {
    updateMainProductImage(index); // Reuses the main image update logic
  }
};

const navigateMobilePrevImage = () => {
  if (isMobileView) {
    const newIndex = (currentImageIndex - 1 + images.length) % images.length;
    updateMobileImage(newIndex);
  }
};

const navigateMobileNextImage = () => {
  if (isMobileView) {
    const newIndex = (currentImageIndex + 1) % images.length;
    updateMobileImage(newIndex);
  }
};

// --- UI Initialization and Resize Handling ---
const setInitialActiveThumbnails = () => {
  if (thumbnailImages.length > 0) {
    setActiveThumbnail(thumbnailImages, 0);
  }
  if (lightboxThumbnails.length > 0) {
    setActiveThumbnail(lightboxThumbnails, 0); // Ensures lightbox thumbs are also set
  }
};

const updateViewBasedOnScreenSize = () => {
    const currentlyMobile = window.innerWidth <= 768;
    if (isMobileView === currentlyMobile) return; // No change in view type

    isMobileView = currentlyMobile;

    if (!isMobileView) { // Switched to Desktop
        mobilePrevBtn.style.display = "none";
        mobileNextBtn.style.display = "none";
        mainProductImage.style.cursor = "pointer";
    } else { // Switched to Mobile
        mobilePrevBtn.style.display = "flex";
        mobileNextBtn.style.display = "flex";
        mainProductImage.style.cursor = "default";
        if (lightbox.classList.contains("open")) {
            closeLightbox(); // Close lightbox if open when switching to mobile
        }
    }
};


const initializePageUI = () => {
  updateQuantityDisplay();
  updateCartDisplay();
  setInitialActiveThumbnails();
  updateViewBasedOnScreenSize(); // Initial setup for mobile/desktop view
  if (images.length > 0) { // Set initial main product image
      mainProductImage.src = images[0].full;
      mainProductImage.alt = `Fall Limited Edition Sneakers - image 1`;
  }
};

// --- Event Listeners ---
minusItemBtn.addEventListener("click", decreaseSelectedQuantity);
addItemBtn.addEventListener("click", increaseSelectedQuantity);
addToCartBtn.addEventListener("click", handleAddToCart);

openMenuBtn.addEventListener("click", openSidebar);
closeMenuBtn.addEventListener("click", closeSidebar);
if (overlay) {
  overlay.addEventListener("click", closeSidebar); // Assuming overlay click always closes sidebar
}
document.addEventListener("keydown", handleEscapeKeyForSidebar);

shoppingCartBtn.addEventListener("click", toggleCartDropdown);
document.addEventListener("click", handleDocumentClickForCartDropdown);
document.addEventListener("keydown", handleEscapeKeyForCartDropdown);

mainProductImage.addEventListener("click", openLightbox);
lightboxCloseBtn.addEventListener("click", closeLightbox);
lightbox.addEventListener("click", handleLightboxOverlayClick);
document.addEventListener("keydown", handleEscapeKeyForLightbox);
lightboxPrevBtn.addEventListener("click", navigateLightboxPrev);
lightboxNextBtn.addEventListener("click", navigateLightboxNext);
lightboxThumbnails.forEach((thumbnail) => {
  thumbnail.addEventListener("click", handleLightboxThumbnailClick);
});

thumbnailImages.forEach((thumbnail) => {
  thumbnail.addEventListener("click", handleProductThumbnailClick);
});

mobilePrevBtn.addEventListener("click", navigateMobilePrevImage);
mobileNextBtn.addEventListener("click", navigateMobileNextImage);

window.addEventListener("resize", updateViewBasedOnScreenSize);
document.addEventListener("DOMContentLoaded", initializePageUI);
