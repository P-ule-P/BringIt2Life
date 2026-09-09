"use strict";

/*
  ================================================================
  EDIT THIS CONFIGURATION BLOCK TO CHANGE YOUR BUSINESS DETAILS.
  ================================================================
*/
const SITE_CONFIG = {
  whatsappNumber: "27729935504", // Country code + number, no + or spaces.
  orderEmail: "info@bringit2life.com",
  queryEmail: "info@bringit2life.co.za",
  currency: "ZAR",
  locale: "en-ZA",
  product: {
    id: "hope-songs-of-hope",
    title: "HOPE: Songs of Hope",
    author: "Siphesihle Thotsho",
    price: 270, // Change this number when the selling price changes.
  },
  orderIntro: "Hello BringIt2Life, I would like to order:",
  socialLinks: {
    facebook: "",
    instagram: "",
    tiktok: "",
    youtube: "",
    twitter: "",
  },
};

/* Storage keys keep the cart, like and profile state after a refresh. */
const STORAGE_KEYS = {
  cart: "bringit2life-cart",
  liked: "bringit2life-liked-hope",
  profile: "bringit2life-profile",
};

const SEARCH_ITEMS = [
  {
    title: "HOPE: Songs of Hope",
    type: "Book",
    target: "#hope",
    terms: "book hope siphesihle poetry order preview",
  },
  {
    title: "Books",
    type: "Category",
    target: "#categories",
    terms: "books reading stories",
  },
  {
    title: "Lifestyle",
    type: "Category",
    target: "#categories",
    terms: "lifestyle intentional living",
  },
  {
    title: "Delicacies",
    type: "Category",
    target: "#categories",
    terms: "food treats delicacies",
  },
  {
    title: "Events",
    type: "Category",
    target: "#categories",
    terms: "events gatherings celebration",
  },
  {
    title: "Customized",
    type: "Category",
    target: "#categories",
    terms: "custom personalised products",
  },
  {
    title: "Quotes",
    type: "Category",
    target: "#categories",
    terms: "quotes words inspiration",
  },
  {
    title: "From the Writing Desk",
    type: "Writing",
    target: "#writings",
    terms: "blog article journal reflection writing",
  },
  {
    title: "Ask a question",
    type: "Contact",
    target: "#query",
    terms: "contact query help email question",
  },
];

const CONTENT = {
  "begin-again": {
    type: "Reflection",
    title: "When the next chapter asks you to begin again",
    body: `<p>Beginnings rarely announce themselves with certainty. Often they arrive quietly, disguised as an ending, a pause or a question we cannot yet answer.</p><p>Starting again does not erase where you have been. It carries the lessons forward while making room for a different possibility.</p><blockquote>What if uncertainty is not a dead end, but an invitation to meet the person you are becoming?</blockquote><p>Take the next honest step. It does not have to be perfect; it only has to be yours.</p>`,
  },
  "showing-up": {
    type: "Journal",
    title: "The quiet courage of showing up",
    body: `<p>Not every act of courage is loud. Sometimes courage is getting out of bed, returning to the work, making the call or trying again after disappointment.</p><p>These ordinary choices may not look dramatic, but they are how a life changes: one faithful return at a time.</p><blockquote>Some victories arrive softly—in the decision to try once more.</blockquote>`,
  },
  "your-rhythm": {
    type: "Inspiration",
    title: "Learning to trust your own rhythm",
    body: `<p>Nature does not apologise for its seasons. It blooms, rests, sheds and begins again without comparing its timing to the forest beside it.</p><p>Your path also has a rhythm. Trust the work happening beneath the surface, even when there is nothing visible to prove it yet.</p><blockquote>Growth does not rush. It deepens its roots before it blooms.</blockquote>`,
  },
  "coming-soon": {
    type: "Coming soon",
    title: "Your next story belongs here",
    body: `<p>This is a prepared publishing space for your next blog, article, poem or reflection.</p><p>When your writing is ready, replace this placeholder in the <strong>CONTENT</strong> section of <strong>script.js</strong>. The tile and reading window will work automatically.</p>`,
  },
  faqs: {
    type: "Customer Care",
    title: "Frequently asked questions",
    body: `<p><strong>How do I order HOPE?</strong><br>Use the WhatsApp or email ordering button in the HOPE section or cart.</p><p><strong>Can I preview the book?</strong><br>Yes. The preview contains the cover, preface, selected pages and back cover.</p><p><strong>Where do you deliver?</strong><br>Delivery details will be confirmed when your order is processed.</p>`,
  },
  shipping: {
    type: "Customer Care",
    title: "Shipping & Delivery",
    body: `<p>Shipping costs and delivery times are confirmed with the customer before an order is completed.</p><p>Update this text when your courier, delivery areas, fees and estimated delivery times have been finalised.</p>`,
  },
  returns: {
    type: "Customer Care",
    title: "Returns & Refunds",
    body: `<p>Please contact BringIt2Life promptly if an order arrives damaged or incorrect.</p><p>Replace this placeholder with your final return period, eligibility rules and refund process before public launch.</p>`,
  },
  terms: {
    type: "Legal",
    title: "Terms & Conditions",
    body: `<p>These terms are currently a placeholder. Add the final conditions governing purchases, delivery, website use and intellectual property before public launch.</p>`,
  },
  privacy: {
    type: "Legal",
    title: "Privacy Policy",
    body: `<p>This website stores cart, like and profile details in the visitor’s own browser.</p><p>Before connecting external services, add a complete policy explaining what information is collected, why it is used and how visitors can request deletion.</p>`,
  },
};

const elements = {
  cartDrawer: document.querySelector(".cart-drawer"),
  cartContent: document.querySelector("[data-cart-content]"),
  cartCount: document.querySelector(".cart-link span"),
  cartLink: document.querySelector(".cart-link"),
  cartTotal: document.querySelector("[data-cart-total]"),
  likeButton: document.querySelector("[data-like-button]"),
  productPrice: document.querySelector("[data-product-price]"),
  bookPreviewModal: document.querySelector("[data-book-preview-modal]"),
  previewPages: [...document.querySelectorAll("[data-preview-page]")],
  previewNavButtons: [...document.querySelectorAll("[data-preview-index]")],
  previewStatus: document.querySelector("[data-preview-status]"),
  toast: document.querySelector("[data-toast]"),
  searchModal: document.querySelector("[data-search-modal]"),
  accountModal: document.querySelector("[data-account-modal]"),
  contentModal: document.querySelector("[data-content-modal]"),
  searchInput: document.querySelector("[data-search-input]"),
  searchResults: document.querySelector("[data-search-results]"),
};

let cart = readJSON(STORAGE_KEYS.cart, []);
let toastTimer;
let previewIndex = 0;

function readJSON(key, fallback) {
  try {
    const storedValue = localStorage.getItem(key);
    return storedValue ? JSON.parse(storedValue) : fallback;
  } catch (error) {
    console.warn(`Could not read ${key} from local storage.`, error);
    return fallback;
  }
}

function saveJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn(`Could not save ${key} to local storage.`, error);
  }
}

function formatMoney(amount) {
  return new Intl.NumberFormat(SITE_CONFIG.locale, {
    style: "currency",
    currency: SITE_CONFIG.currency,
  }).format(amount);
}

function escapeHTML(value) {
  return String(value).replace(
    /[&<>'"]/g,
    (character) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        "'": "&#39;",
        '"': "&quot;",
      })[character],
  );
}

function showToast(message) {
  clearTimeout(toastTimer);
  elements.toast.textContent = message;
  elements.toast.classList.add("show");
  toastTimer = setTimeout(() => elements.toast.classList.remove("show"), 3200);
}

/* Adds HOPE once, then increases its quantity on later clicks. */
function addBookToCart() {
  const existingItem = cart.find((item) => item.id === SITE_CONFIG.product.id);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ ...SITE_CONFIG.product, quantity: 1 });
  }

  updateCart();
  showToast("HOPE was added to your cart.");
}

function changeQuantity(productId, amount) {
  const item = cart.find((cartItem) => cartItem.id === productId);
  if (!item) return;

  item.quantity += amount;
  if (item.quantity <= 0) {
    cart = cart.filter((cartItem) => cartItem.id !== productId);
  }
  updateCart();
}

function updateCart() {
  saveJSON(STORAGE_KEYS.cart, cart);

  const itemCount = cart.reduce((total, item) => total + item.quantity, 0);
  const totalPrice = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  elements.cartCount.textContent = itemCount;
  elements.cartLink.setAttribute(
    "aria-label",
    `Shopping cart, ${itemCount} ${itemCount === 1 ? "item" : "items"}`,
  );
  elements.cartTotal.textContent = formatMoney(totalPrice);

  if (cart.length === 0) {
    elements.cartContent.innerHTML = `
      <div class="empty-cart">
        <span aria-hidden="true">◇</span>
        <h3>Your cart is empty</h3>
        <p>Add HOPE to begin your order.</p>
      </div>`;
    return;
  }

  elements.cartContent.innerHTML = cart
    .map(
      (item) => `
        <article class="cart-item">
          <img src="assets/hope-front-cover.png" alt="${item.title}">
          <div>
            <h3>${item.title}</h3>
            <p>${item.author}</p>
            <strong>${formatMoney(item.price)}</strong>
            <div class="quantity-control" aria-label="Quantity for ${item.title}">
              <button type="button" data-quantity="-1" data-product-id="${item.id}" aria-label="Decrease quantity">−</button>
              <span>${item.quantity}</span>
              <button type="button" data-quantity="1" data-product-id="${item.id}" aria-label="Increase quantity">＋</button>
            </div>
          </div>
        </article>`,
    )
    .join("");
}

function openCart(event) {
  event?.preventDefault();
  document.querySelectorAll(".site-modal.open").forEach(closeModal);
  elements.cartDrawer.classList.add("open");
  elements.cartDrawer.setAttribute("aria-hidden", "false");
  document.body.classList.add("cart-open");
  document.querySelector("[data-close-cart]").focus();
}

function closeCart() {
  elements.cartDrawer.classList.remove("open");
  elements.cartDrawer.setAttribute("aria-hidden", "true");
  if (!document.querySelector(".site-modal.open"))
    document.body.classList.remove("cart-open");
}

function makeOrderMessage() {
  const profile = readJSON(STORAGE_KEYS.profile, {});
  const customerDetails = profile.name
    ? `\n\nCustomer: ${profile.name}${profile.email ? `\nEmail: ${profile.email}` : ""}${profile.phone ? `\nPhone: ${profile.phone}` : ""}`
    : "";

  if (cart.length === 0) {
    return `${SITE_CONFIG.orderIntro}\n\n1 × ${SITE_CONFIG.product.title} — ${formatMoney(SITE_CONFIG.product.price)}${customerDetails}\n\nPlease confirm availability and delivery options.`;
  }

  const orderLines = cart.map(
    (item) =>
      `${item.quantity} × ${item.title} — ${formatMoney(item.price * item.quantity)}`,
  );
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return `${SITE_CONFIG.orderIntro}\n\n${orderLines.join("\n")}\n\nTotal: ${formatMoney(total)}${customerDetails}\n\nPlease confirm availability and delivery options.`;
}

function orderWithWhatsApp() {
  const message = encodeURIComponent(makeOrderMessage());
  window.open(
    `https://wa.me/${SITE_CONFIG.whatsappNumber}?text=${message}`,
    "_blank",
    "noopener,noreferrer",
  );
}

function orderWithEmail() {
  const subject = encodeURIComponent(
    `Book order — ${SITE_CONFIG.product.title}`,
  );
  const body = encodeURIComponent(makeOrderMessage());
  window.location.href = `mailto:${SITE_CONFIG.orderEmail}?subject=${subject}&body=${body}`;
}

/* Saves the like choice locally and restores it after a refresh. */
function setLiked(isLiked) {
  localStorage.setItem(STORAGE_KEYS.liked, String(isLiked));
  elements.likeButton.classList.toggle("liked", isLiked);
  elements.likeButton.setAttribute("aria-pressed", String(isLiked));
  elements.likeButton.querySelector("span").textContent = isLiked ? "♥" : "♡";
  elements.likeButton.lastChild.textContent = isLiked ? " Liked" : " Like";
}

function toggleLike() {
  const isCurrentlyLiked =
    elements.likeButton.getAttribute("aria-pressed") === "true";
  setLiked(!isCurrentlyLiked);
  showToast(
    isCurrentlyLiked
      ? "HOPE was removed from your likes."
      : "HOPE was added to your likes.",
  );
}

/* Opens the compact book preview and switches one page at a time. */
function setupPreview() {
  function showPreviewPage(index) {
    previewIndex =
      (index + elements.previewPages.length) % elements.previewPages.length;

    elements.previewPages.forEach((page, pageIndex) => {
      page.classList.toggle("is-active", pageIndex === previewIndex);
    });
    elements.previewNavButtons.forEach((button, buttonIndex) => {
      const isActive = buttonIndex === previewIndex;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-current", isActive ? "page" : "false");
    });

    const activePage = elements.previewPages[previewIndex];
    elements.previewStatus.textContent = `${activePage.dataset.previewName} · ${previewIndex + 1} of ${elements.previewPages.length}`;
  }

  document
    .querySelector("[data-open-book-preview]")
    .addEventListener("click", () => {
      showPreviewPage(0);
      openModal(
        elements.bookPreviewModal,
        elements.bookPreviewModal.querySelector("[data-close-modal]"),
      );
    });

  document
    .querySelector("[data-preview-previous]")
    .addEventListener("click", () => showPreviewPage(previewIndex - 1));
  document
    .querySelector("[data-preview-next]")
    .addEventListener("click", () => showPreviewPage(previewIndex + 1));
  elements.previewNavButtons.forEach((button) => {
    button.addEventListener("click", () =>
      showPreviewPage(Number(button.dataset.previewIndex)),
    );
  });

  document.addEventListener("keydown", (event) => {
    if (!elements.bookPreviewModal.classList.contains("open")) return;
    if (event.key === "ArrowLeft") showPreviewPage(previewIndex - 1);
    if (event.key === "ArrowRight") showPreviewPage(previewIndex + 1);
  });

  showPreviewPage(0);
}

async function submitQuery(event) {
  event.preventDefault();
  const form = event.currentTarget;
  if (!form.reportValidity()) return;

  const formData = new FormData(form);
  const submitButton = form.querySelector('button[type="submit"]');
  const submitLabel = form.querySelector("[data-submit-label]");
  const status = form.querySelector("[data-query-status]");

  if (formData.get("_honey")) return;

  submitButton.disabled = true;
  submitLabel.textContent = "Sending…";
  status.className = "form-help sending";
  status.textContent = "Sending your query…";

  try {
    const response = await fetch(
      `https://formsubmit.co/ajax/${encodeURIComponent(SITE_CONFIG.queryEmail)}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          subject: formData.get("subject"),
          message: formData.get("message"),
          _subject: `New BringIt2Life query: ${formData.get("subject")}`,
          _template: "table",
        }),
      },
    );

    const result = await response.json();
    if (
      !response.ok ||
      result.success === "false" ||
      result.success === false
    ) {
      throw new Error(
        result.message || "The form service rejected the submission.",
      );
    }

    form.reset();
    status.className = "form-help success";
    status.textContent = "Thank you. Your query has been sent successfully.";
    showToast("Your query was sent successfully.");
  } catch (error) {
    console.error("Query submission failed:", error);
    status.className = "form-help error";
    status.textContent =
      "We could not send your query. Please try again or email info@bringit2life.co.za.";
    showToast("Your query could not be sent. Please try again.");
  } finally {
    submitButton.disabled = false;
    submitLabel.textContent = "Send";
  }
}

function setupActiveNavigation() {
  const navLinks = [...document.querySelectorAll(".main-nav a")];
  const sections = navLinks
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries.find((entry) => entry.isIntersecting);
      if (!visible) return;
      navLinks.forEach((link) =>
        link.classList.toggle(
          "active",
          link.getAttribute("href") === `#${visible.target.id}`,
        ),
      );
    },
    { rootMargin: "-35% 0px -55%", threshold: 0 },
  );

  sections.forEach((section) => observer.observe(section));
}

function openModal(modal, focusTarget) {
  document.querySelectorAll(".site-modal.open").forEach(closeModal);
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("cart-open");
  setTimeout(
    () => (focusTarget || modal.querySelector("button, input"))?.focus(),
    0,
  );
}

function closeModal(modalOrEvent) {
  const modal =
    modalOrEvent instanceof Element
      ? modalOrEvent
      : modalOrEvent.currentTarget.closest(".site-modal");
  if (!modal) return;
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
  if (
    !document.querySelector(".site-modal.open") &&
    !elements.cartDrawer.classList.contains("open")
  ) {
    document.body.classList.remove("cart-open");
  }
}

function performSearch() {
  const query = elements.searchInput.value.trim().toLowerCase();
  if (!query) {
    elements.searchResults.innerHTML =
      "<p>Start typing to search the website.</p>";
    return;
  }

  const matches = SEARCH_ITEMS.filter((item) =>
    `${item.title} ${item.type} ${item.terms}`.toLowerCase().includes(query),
  );

  elements.searchResults.innerHTML = matches.length
    ? matches
        .map(
          (item) =>
            `<button class="search-result" type="button" data-search-target="${item.target}"><span>${item.title}</span><small>${item.type} →</small></button>`,
        )
        .join("")
    : `<p>No results for “${escapeHTML(query)}”. Try hope, writing, events or query.</p>`;
}

function navigateFromSearch(event) {
  const result = event.target.closest("[data-search-target]");
  if (!result) return;
  const target = document.querySelector(result.dataset.searchTarget);
  closeModal(elements.searchModal);
  target?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function loadProfile() {
  const profile = readJSON(STORAGE_KEYS.profile, {});
  const form = document.querySelector("[data-profile-form]");
  form.elements.name.value = profile.name || "";
  form.elements.email.value = profile.email || "";
  form.elements.phone.value = profile.phone || "";
}

function saveProfile(event) {
  event.preventDefault();
  const form = event.currentTarget;
  if (!form.reportValidity()) return;
  const data = Object.fromEntries(new FormData(form));
  saveJSON(STORAGE_KEYS.profile, data);
  closeModal(elements.accountModal);
  showToast("Your profile was saved on this device.");
}

function showContent(contentKey) {
  const content = CONTENT[contentKey];
  if (!content) return;
  document.querySelector("[data-content-type]").textContent = content.type;
  document.querySelector("[data-content-title]").textContent = content.title;
  document.querySelector("[data-content-body]").innerHTML = content.body;
  openModal(
    elements.contentModal,
    elements.contentModal.querySelector("[data-close-modal]"),
  );
}

function openSocialLink(network) {
  if (network === "whatsapp") {
    orderWithWhatsApp();
    return;
  }
  const url = SITE_CONFIG.socialLinks[network];
  if (!url) {
    showToast(
      `${network[0].toUpperCase() + network.slice(1)} has not been configured yet.`,
    );
    return;
  }
  window.open(url, "_blank", "noopener,noreferrer");
}

function initialiseSite() {
  elements.productPrice.textContent = formatMoney(SITE_CONFIG.product.price);
  setLiked(localStorage.getItem(STORAGE_KEYS.liked) === "true");
  updateCart();
  setupPreview();
  setupActiveNavigation();

  document
    .querySelector("[data-open-cart]")
    .addEventListener("click", openCart);
  document.querySelector("[data-open-search]").addEventListener("click", () => {
    elements.searchInput.value = "";
    performSearch();
    openModal(elements.searchModal, elements.searchInput);
  });
  document
    .querySelector("[data-open-account]")
    .addEventListener("click", () => {
      loadProfile();
      openModal(
        elements.accountModal,
        document.querySelector("[data-profile-form] input"),
      );
    });
  document
    .querySelectorAll("[data-close-cart]")
    .forEach((button) => button.addEventListener("click", closeCart));
  document
    .querySelectorAll("[data-close-modal]")
    .forEach((button) => button.addEventListener("click", closeModal));
  document
    .querySelector("[data-add-cart]")
    .addEventListener("click", addBookToCart);
  elements.likeButton.addEventListener("click", toggleLike);
  document
    .querySelector("[data-order-whatsapp]")
    .addEventListener("click", orderWithWhatsApp);
  document
    .querySelector("[data-order-email]")
    .addEventListener("click", orderWithEmail);
  document
    .querySelector("[data-cart-whatsapp]")
    .addEventListener("click", orderWithWhatsApp);
  document
    .querySelector("[data-cart-email]")
    .addEventListener("click", orderWithEmail);
  document
    .querySelector("[data-query-form]")
    .addEventListener("submit", submitQuery);
  document
    .querySelector("[data-profile-form]")
    .addEventListener("submit", saveProfile);
  elements.searchInput.addEventListener("input", performSearch);
  elements.searchResults.addEventListener("click", navigateFromSearch);
  document
    .querySelectorAll("[data-read-article]")
    .forEach((button) =>
      button.addEventListener("click", () =>
        showContent(button.dataset.readArticle),
      ),
    );
  document
    .querySelectorAll("[data-info]")
    .forEach((button) =>
      button.addEventListener("click", () => showContent(button.dataset.info)),
    );
  document
    .querySelectorAll("[data-social]")
    .forEach((button) =>
      button.addEventListener("click", () =>
        openSocialLink(button.dataset.social),
      ),
    );

  document.querySelector("[data-clear-cart]").addEventListener("click", () => {
    cart = [];
    updateCart();
    showToast("Your cart was cleared.");
  });

  elements.cartContent.addEventListener("click", (event) => {
    const quantityButton = event.target.closest("[data-quantity]");
    if (!quantityButton) return;
    changeQuantity(
      quantityButton.dataset.productId,
      Number(quantityButton.dataset.quantity),
    );
  });

  document.addEventListener("keydown", (event) => {
    if (
      event.key === "Escape" &&
      elements.cartDrawer.classList.contains("open")
    )
      closeCart();
    if (event.key === "Escape")
      document.querySelectorAll(".site-modal.open").forEach(closeModal);
  });
}

initialiseSite();
