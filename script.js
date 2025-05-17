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

let currentImageIndex = 0;

// --- Lightbox Functionality (Desktop) ---

const openLightbox = () => {
  // Only open lightbox on desktop sizes
  if (window.innerWidth > 1024) {
    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
    lightboxMainImage.src = mainProductImage.src;
    const currentThumbnail = document.querySelector(`.thumbnail-image.active`);
    if (currentThumbnail) {
      const index = parseInt(currentThumbnail.dataset.index);
      updateLightboxThumbnails(index);
      currentImageIndex = index;
    }

    document.body.style.overflow = "hidden";
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
    lightboxMainImage.alt = `Fall Limited Edition Sneakers - large view ${
      index + 1
    }`;
    currentImageIndex = index;
    updateLightboxThumbnails(index);
  }
};

const updateLightboxThumbnails = (activeIndex) => {
  lightboxThumbnails.forEach((thumb, index) => {
    if (index === activeIndex) {
      thumb.classList.add("active");
      thumb.setAttribute("aria-selected", "true");
      thumb.removeAttribute("tabindex");
    } else {
      thumb.classList.remove("active");
      thumb.setAttribute("aria-selected", "false");
      thumb.setAttribute("tabindex", "-1");
    }
  });
};

mainProductImage.addEventListener("click", openLightbox);

lightboxCloseBtn.addEventListener("click", closeLightbox);

// Close lightbox when the overlay is clicked
lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox.querySelector(".lightbox-overlay")) {
    closeLightbox();
  }
});

// Close lightbox when the Escape key is pressed
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && lightbox.classList.contains("open")) {
    closeLightbox();
  }
});

lightboxPrevBtn.addEventListener("click", () => {
  const newIndex = (currentImageIndex - 1 + images.length) % images.length;
  updateLightboxImage(newIndex);
});

lightboxNextBtn.addEventListener("click", () => {
  const newIndex = (currentImageIndex + 1) % images.length;
  updateLightboxImage(newIndex);
});

// Navigate images in the lightbox using thumbnail clicks
lightboxThumbnails.forEach((thumbnail) => {
  thumbnail.addEventListener("click", (event) => {
    const index = parseInt(event.target.dataset.index);
    updateLightboxImage(index);
  });
});

// --- Product Page Thumbnail Interaction ---

thumbnailImages.forEach((thumbnail) => {
  thumbnail.addEventListener("click", (event) => {
    const clickedThumbnail = event.target;
    const index = parseInt(clickedThumbnail.dataset.index);

    lightboxMainImage.src = images[index].full;
    mainProductImage.src = images[index].full;
    mainProductImage.alt = `Fall Limited Edition Sneakers - image ${index + 1}`;

    thumbnailImages.forEach((thumb) => {
      thumb.classList.remove("active");
      thumb.setAttribute("aria-selected", "false");
    });
    clickedThumbnail.classList.add("active");
    clickedThumbnail.setAttribute("aria-selected", "true");

    currentImageIndex = index;
  });
});

// --- Mobile Slider Functionality ---

const updateMobileImage = (index) => {
  if (index >= 0 && index < images.length) {
    mainProductImage.src = images[index].full;
    mainProductImage.alt = `Fall Limited Edition Sneakers - image ${index + 1}`;
    currentImageIndex = index;
  }
};

mobilePrevBtn.addEventListener("click", () => {
  if (window.innerWidth < 1024) {
    const newIndex = (currentImageIndex - 1 + images.length) % images.length;
    updateMobileImage(newIndex);
  }
});

mobileNextBtn.addEventListener("click", () => {
  if (window.innerWidth <= 1024) {
    const newIndex = (currentImageIndex + 1) % images.length;
    updateMobileImage(newIndex);
  }
});

document.addEventListener("DOMContentLoaded", () => {
  if (thumbnailImages.length > 0) {
    thumbnailImages[0].classList.add("active");
    thumbnailImages[0].setAttribute("aria-selected", "true");
  }
  if (lightboxThumbnails.length > 0) {
    updateLightboxThumbnails(0);
  }
});

// Optional: Handle window resizing to switch between behaviors
let isMobileView = window.innerWidth <= 560;

window.addEventListener("resize", () => {
  const wasMobileView = isMobileView;
  isMobileView = window.innerWidth <= 560;

  if (wasMobileView !== isMobileView) {
    // If switching between mobile and desktop views, ensure correct elements are visible/hidden
    if (!isMobileView) {
      // Switched to Desktop - hide mobile buttons, ensure main image click works
      mobilePrevBtn.style.display = "none";
      mobileNextBtn.style.display = "none";
      mainProductImage.style.cursor = "pointer"; // Add pointer cursor for desktop click
    } else {
      // Switched to Mobile - show mobile buttons, disable main image click for lightbox
      mobilePrevBtn.style.display = "flex"; // Or 'block' depending on your CSS
      mobileNextBtn.style.display = "flex"; // Or 'block' depending on your CSS
      mainProductImage.style.cursor = "default"; // Remove pointer cursor
      closeLightbox(); // Close lightbox if open on mobile
    }
    // Re-evaluate event listeners if needed, though current implementation handles this
  }
});

// Initial check on load
document.addEventListener("DOMContentLoaded", () => {
  if (!isMobileView) {
    // Desktop view
    mobilePrevBtn.style.display = "none";
    mobileNextBtn.style.display = "none";
    mainProductImage.style.cursor = "pointer";
  } else {
    // Mobile view
    mainProductImage.style.cursor = "default";
  }
});
