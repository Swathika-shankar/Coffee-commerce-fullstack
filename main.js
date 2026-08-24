const API_URL = "https://coffee-commerce-fullstack.onrender.com/api";

const menu = document.querySelector(".menu-icon");
const navbar = document.querySelector(".navbar");
const cartCount = document.querySelector(".cart-count");
const cursorGlow = document.querySelector(".cursor-glow");

// ================================
// NAVIGATION
// ================================

if (menu && navbar) {
  menu.addEventListener("click", () => {
    menu.classList.toggle("move");
    navbar.classList.toggle("open-menu");
  });

  document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", () => {
      menu.classList.remove("move");
      navbar.classList.remove("open-menu");
    });
  });
}

window.addEventListener("scroll", () => {
  document
    .querySelector("header")
    ?.classList.toggle("scrolled", window.scrollY > 80);
});

// ================================
// CURSOR GLOW
// ================================

document.addEventListener("mousemove", (e) => {
  if (!cursorGlow) return;

  cursorGlow.style.left = `${e.clientX}px`;
  cursorGlow.style.top = `${e.clientY}px`;
});

// ================================
// SCROLL REVEAL
// ================================

if (typeof ScrollReveal !== "undefined") {
  const sr = ScrollReveal({
    origin: "bottom",
    distance: "60px",
    duration: 1200,
    delay: 120,
    reset: false,
  });

  sr.reveal(".hero-text, .page-hero-content, .heading", {
    origin: "left",
  });

  sr.reveal(".hero-3d-wrap, .ad-scene, .booking-3d", {
    origin: "right",
  });

  sr.reveal(
    ".quick-card, .product-card, .service-card, .team-card, .glass-card:not(.checkout-card), .split-img, .split-text",
    {
      interval: 120,
    }
  );
}

// ================================
// TILT CARDS
// ================================

document.querySelectorAll(".tilt-card").forEach((card) => {
  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const rotateY = ((x / rect.width) - 0.5) * 18;
    const rotateX = ((y / rect.height) - 0.5) * -18;

    card.style.transform =
      `perspective(900px) ` +
      `rotateX(${rotateX}deg) ` +
      `rotateY(${rotateY}deg) ` +
      `translateY(-8px)`;
  });

  card.addEventListener("mouseleave", () => {
    card.style.transform = "";
  });
});

// ================================
// CART STORAGE
// ================================

function getCart() {
  try {
    return JSON.parse(localStorage.getItem("coffeeCart")) || [];
  } catch (error) {
    console.error("Unable to read cart:", error);
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem("coffeeCart", JSON.stringify(cart));
  updateCartCount();
}

function updateCartCount() {
  const cart = getCart();

  const totalQty = cart.reduce(
    (sum, item) => sum + Number(item.qty || 0),
    0
  );

  document.querySelectorAll(".cart-count").forEach((element) => {
    element.textContent = totalQty;
  });
}

// ================================
// ADD TO CART
// ================================

function addToCart(product) {
  const cart = getCart();

  const existing = cart.find(
    (item) => item.name === product.name
  );

  if (existing) {
    existing.qty = Number(existing.qty || 0) + 1;
  } else {
    cart.push({
      ...product,
      qty: 1,
    });
  }

  saveCart(cart);
  renderCart();

  showToast(`${product.name} added to cart`);
}

// ================================
// TOAST MESSAGE
// ================================

function showToast(message) {
  const oldToast = document.querySelector(".toast");

  if (oldToast) {
    oldToast.remove();
  }

  const toast = document.createElement("div");

  toast.className = "toast";
  toast.textContent = message;

  toast.style.cssText = `
    position: fixed;
    right: 24px;
    bottom: 24px;
    background: #54372a;
    color: white;
    padding: 14px 18px;
    border-radius: 999px;
    z-index: 9999;
    font-family: Poppins, sans-serif;
    box-shadow: 0 18px 40px rgba(0,0,0,.2);
  `;

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 2200);
}

// ================================
// PRODUCT ADD-TO-CART BUTTONS
// ================================

document.querySelectorAll(".add-cart").forEach((btn) => {
  btn.addEventListener("click", () => {
    const card = btn.closest(".product-card");

    if (!card) {
      return;
    }

    const product = {
      name: card.dataset.name,
      price: Number(card.dataset.price),
      img: card.dataset.img,
    };

    addToCart(product);
  });
});

// ================================
// RENDER CART
// ================================

function renderCart() {
  const cartItems = document.querySelector(".cart-items");
  const cartTotal = document.querySelector(".cart-total");

  // We are not on cart.html
  if (!cartItems || !cartTotal) {
    return;
  }

  const cart = getCart();

  if (cart.length === 0) {
    cartItems.innerHTML = `
      <div class="glass-card">
        <h2>Your cart is empty</h2>
        <p>Add coffee from the menu page.</p>
      </div>
    `;

    cartTotal.textContent = "$0.00";

    return;
  }

  let total = 0;

  cartItems.innerHTML = cart
    .map((item, index) => {
      const price = Number(item.price || 0);
      const qty = Number(item.qty || 1);
      const itemTotal = price * qty;

      total += itemTotal;

      return `
        <div class="cart-item">

          <img
            src="${item.img}"
            alt="${item.name}"
          >

          <div class="cart-item-info">
            <h3>${item.name}</h3>

            <p>
              $${price.toFixed(2)} × ${qty}
            </p>

            <strong>
              $${itemTotal.toFixed(2)}
            </strong>
          </div>

          <button
            type="button"
            class="remove-item"
            data-index="${index}"
          >
            Remove
          </button>

        </div>
      `;
    })
    .join("");

  cartTotal.textContent = `$${total.toFixed(2)}`;

  // Remove buttons
  document.querySelectorAll(".remove-item").forEach((btn) => {
    btn.addEventListener("click", () => {
      const index = Number(btn.dataset.index);

      const updatedCart = getCart();

      updatedCart.splice(index, 1);

      saveCart(updatedCart);

      renderCart();
    });
  });
}

// ================================
// OPEN CHECKOUT
// ================================

document
  .querySelector(".checkout-btn")
  ?.addEventListener("click", () => {
    const cart = getCart();

    if (cart.length === 0) {
      showToast("Cart is empty");
      return;
    }

    const checkoutSection =
      document.querySelector(".checkout-section");

    const checkoutItems =
      document.querySelector(".checkout-items");

    const checkoutTotal =
      document.querySelector(".checkout-total");

    if (
      !checkoutSection ||
      !checkoutItems ||
      !checkoutTotal
    ) {
      console.error("Checkout HTML elements not found.");
      showToast("Checkout section unavailable");
      return;
    }

    let total = 0;

    checkoutItems.innerHTML = cart
      .map((item) => {
        const price = Number(item.price || 0);
        const qty = Number(item.qty || 1);

        const itemTotal = price * qty;

        total += itemTotal;

        return `
          <div class="checkout-item">

            <div>
              <strong>${item.name}</strong>

              <p>
                ${qty} × $${price.toFixed(2)}
              </p>
            </div>

            <strong>
              $${itemTotal.toFixed(2)}
            </strong>

          </div>
        `;
      })
      .join("");

    checkoutTotal.textContent =
      `$${total.toFixed(2)}`;

    checkoutSection.style.display = "block";

    checkoutSection.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  });

// ================================
// PLACE CUSTOMER ORDER
// ================================

document
  .querySelector(".checkout-form")
  ?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const form = e.target;

    const message =
      document.querySelector(".checkout-message") ||
      form.querySelector(".form-message");

    const submitButton =
      form.querySelector('button[type="submit"]');

    const cart = getCart();

    if (cart.length === 0) {
      showToast("Cart is empty");
      return;
    }

    const formData = new FormData(form);

    const customer = {
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      address: formData.get("address"),
    };

    const paymentMethod =
      formData.get("paymentMethod");

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent =
        "Placing Order...";
    }

    if (message) {
      message.textContent = "";
    }

    try {
      const res = await fetch(
        `${API_URL}/orders`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            customer,
            items: cart,
            paymentMethod,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(
          data.message ||
            "Order failed"
        );
      }

      // Clear cart only after successful API save
      localStorage.removeItem(
        "coffeeCart"
      );

      updateCartCount();
      renderCart();

      form.reset();

      const checkoutItems =
        document.querySelector(
          ".checkout-items"
        );

      const checkoutTotal =
        document.querySelector(
          ".checkout-total"
        );

      if (checkoutItems) {
        checkoutItems.innerHTML = "";
      }

      if (checkoutTotal) {
        checkoutTotal.textContent =
          "$0.00";
      }

      if (message) {
        message.innerHTML = `
          <strong>
            Order placed successfully! ☕
          </strong>
          <br>
          Thank you, ${customer.name}.
          <br>
          Order ID: ${data.order._id}
        `;
      }

      showToast(
        "Order placed successfully"
      );
    } catch (error) {
      console.error(
        "Checkout error:",
        error
      );

      if (message) {
        message.textContent =
          error.message ||
          "Unable to place order. Please try again.";
      }

      showToast("Order failed");
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent =
          "Place Order";
      }
    }
  });

// ================================
// TABLE BOOKING
// ================================

document
  .querySelector(".booking-form")
  ?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const form = e.target;

    const message =
      form.querySelector(
        ".form-message"
      );

    const booking =
      Object.fromEntries(
        new FormData(form).entries()
      );

    try {
      const res = await fetch(
        `${API_URL}/bookings`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify(
            booking
          ),
        }
      );

      const data =
        await res.json();

      if (!res.ok || !data.success) {
        throw new Error(
          data.message ||
            "Booking failed"
        );
      }

      if (message) {
        message.textContent =
          "Table booked successfully!";
      }

      form.reset();

      showToast(
        "Table booked successfully"
      );
    } catch (error) {
      console.error(
        "Booking error:",
        error
      );

      if (message) {
        message.textContent =
          error.message ||
          "Unable to book table.";
      }

      showToast("Booking failed");
    }
  });

// ================================
// ADMIN - ADD PRODUCT
// ================================

document
  .querySelector(".admin-product-form")
  ?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const form = e.target;

    const message =
      form.querySelector(
        ".form-message"
      );

    const product =
      Object.fromEntries(
        new FormData(form).entries()
      );

    product.price =
      Number(product.price);

    try {
      const res = await fetch(
        `${API_URL}/products`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify(
            product
          ),
        }
      );

      const data =
        await res.json();

      if (!res.ok || !data.success) {
        throw new Error(
          data.message ||
            "Product add failed"
        );
      }

      if (message) {
        message.textContent =
          "Product added successfully!";
      }

      form.reset();

      showToast(
        "Product added successfully"
      );
    } catch (error) {
      console.error(
        "Product error:",
        error
      );

      if (message) {
        message.textContent =
          error.message ||
          "Backend not connected.";
      }
    }
  });

// ================================
// ADMIN - LOAD BOOKINGS
// ================================

async function loadAdminBookings() {
  const box =
    document.querySelector(
      ".admin-bookings"
    );

  // Not admin page
  if (!box) {
    return;
  }

  box.innerHTML =
    "<p>Loading bookings...</p>";

  try {
    const res = await fetch(
      `${API_URL}/bookings`
    );

    if (!res.ok) {
      throw new Error(
        `HTTP ${res.status}`
      );
    }

    const bookings =
      await res.json();

    if (
      !Array.isArray(bookings) ||
      bookings.length === 0
    ) {
      box.innerHTML =
        "<p>No bookings yet.</p>";

      return;
    }

    box.innerHTML = bookings
      .map((b) => {
        return `
          <div class="admin-booking">

            <strong>
              ${b.name || "Unknown customer"}
            </strong>

            <br>

            Phone:
            ${b.phone || "N/A"}

            <br>

            Date:
            ${b.date || "N/A"}

            |

            Time:
            ${b.time || "N/A"}

            <br>

            Guests:
            ${b.guests || "N/A"}

            <br><br>

            <button
              type="button"
              class="delete-booking-btn"
              onclick="deleteBooking('${b._id}')"
            >
              Delete Booking
            </button>

          </div>
        `;
      })
      .join("");
  } catch (error) {
    console.error(
      "Admin bookings error:",
      error
    );

    box.innerHTML =
      "<p>Unable to load bookings.</p>";
  }
}

// ================================
// ADMIN - LOAD CUSTOMER ORDERS
// ================================

async function loadAdminOrders() {
  const box =
    document.querySelector(
      ".admin-orders"
    );

  // Not admin page
  if (!box) {
    return;
  }

  box.innerHTML =
    "<p>Loading customer orders...</p>";

  try {
    const res = await fetch(
      `${API_URL}/orders`
    );

    if (!res.ok) {
      throw new Error(
        `HTTP ${res.status}`
      );
    }

    const orders =
      await res.json();

    if (
      !Array.isArray(orders) ||
      orders.length === 0
    ) {
      box.innerHTML =
        "<p>No orders yet.</p>";

      return;
    }

    box.innerHTML = orders
      .map((order) => {
        const orderItems =
          Array.isArray(order.items)
            ? order.items
            : [];

        const items =
          orderItems
            .map((item) => {
              const price =
                Number(
                  item.price || 0
                );

              const qty =
                Number(
                  item.qty || 1
                );

              return `
                <div class="admin-order-item">

                  <span>
                    ${item.name || "Product"}
                    ×
                    ${qty}
                  </span>

                  <strong>
                    $${(
                      price * qty
                    ).toFixed(2)}
                  </strong>

                </div>
              `;
            })
            .join("");

        const orderId =
          order._id
            ? order._id
                .slice(-6)
                .toUpperCase()
            : "N/A";

        const orderDate =
          order.createdAt
            ? new Date(
                order.createdAt
              ).toLocaleString()
            : "N/A";

        return `
          <div class="admin-order">

            <div class="admin-order-header">

              <div>

                <strong>
                  Order #${orderId}
                </strong>

                <p>
                  ${orderDate}
                </p>

              </div>

              <span class="order-status">
                ${order.status || "pending"}
              </span>

            </div>

            <div class="admin-customer-details">

              <p>
                <strong>Customer:</strong>
                ${order.customer?.name || "N/A"}
              </p>

              <p>
                <strong>Email:</strong>
                ${order.customer?.email || "N/A"}
              </p>

              <p>
                <strong>Phone:</strong>
                ${order.customer?.phone || "N/A"}
              </p>

              <p>
                <strong>Address:</strong>
                ${order.customer?.address || "N/A"}
              </p>

              <p>
                <strong>Payment:</strong>
                ${order.paymentMethod || "N/A"}
              </p>

            </div>

            <div class="admin-order-items">
              ${items}
            </div>

            <div class="admin-order-total">

              Total:

              <strong>
                $${Number(
                  order.total || 0
                ).toFixed(2)}
              </strong>

            </div>

          </div>
        `;
      })
      .join("");
  } catch (error) {
    console.error(
      "Admin orders error:",
      error
    );

    box.innerHTML =
      "<p>Unable to load orders.</p>";
  }
}

// ================================
// ADMIN - DELETE BOOKING
// ================================

async function deleteBooking(id) {
  const confirmDelete =
    confirm(
      "Are you sure you want to delete this booking?"
    );

  if (!confirmDelete) {
    return;
  }

  try {
    const res = await fetch(
      `${API_URL}/bookings/${id}`,
      {
        method: "DELETE",
      }
    );

    const data =
      await res.json();

    if (!res.ok || !data.success) {
      throw new Error(
        data.message ||
          "Delete failed"
      );
    }

    alert(
      "Booking deleted successfully"
    );

    loadAdminBookings();
  } catch (error) {
    console.error(
      "Delete booking error:",
      error
    );

    alert(
      "Unable to delete booking"
    );
  }
}

// Make function available to onclick=""
window.deleteBooking =
  deleteBooking;

// ================================
// PRODUCT FILTERS
// ================================

document
  .querySelectorAll(".filter-btn")
  .forEach((btn) => {
    btn.addEventListener(
      "click",
      () => {
        document
          .querySelectorAll(
            ".filter-btn"
          )
          .forEach((b) =>
            b.classList.remove(
              "active"
            )
          );

        btn.classList.add(
          "active"
        );

        const filter =
          btn.dataset.filter;

        document
          .querySelectorAll(
            ".product-card"
          )
          .forEach((card) => {
            const categoryElement =
              card.querySelector("p");

            const category =
              categoryElement
                ? categoryElement.textContent
                : "";

            card.style.display =
              filter === "all" ||
              category.includes(filter)
                ? "block"
                : "none";
          });
      }
    );
  });

// ================================
// COUNTERS
// ================================

function runCounters() {
  document
    .querySelectorAll(".counter")
    .forEach((counter) => {
      const target =
        Number(
          counter.dataset.target
        );

      let count = 0;

      const speed =
        Math.max(
          1,
          Math.floor(
            target / 100
          )
        );

      const update = () => {
        count += speed;

        if (count < target) {
          counter.textContent =
            count;

          requestAnimationFrame(
            update
          );
        } else {
          counter.textContent =
            target;
        }
      };

      update();
    });
}

// ================================
// INITIALIZE PAGE
// ================================

function initializePage() {
  updateCartCount();

  renderCart();

  loadAdminBookings();

  loadAdminOrders();

  runCounters();
}

if (
  document.readyState ===
  "loading"
) {
  document.addEventListener(
    "DOMContentLoaded",
    initializePage
  );
} else {
  initializePage();
}

// Refresh cart if browser restores page
window.addEventListener(
  "pageshow",
  () => {
    updateCartCount();
    renderCart();
  }
);

// Keep cart synchronized between tabs
window.addEventListener(
  "storage",
  (event) => {
    if (
      event.key ===
      "coffeeCart"
    ) {
      updateCartCount();
      renderCart();
    }
  }
);

// ================================
// PROMO VIDEO SOUND
// ================================

function togglePromoSound() {
  const video =
    document.getElementById(
      "promoVideo"
    );

  const button =
    document.querySelector(
      ".sound-btn"
    );

  if (!video) {
    alert("Video not found");
    return;
  }

  video.muted =
    !video.muted;

  if (video.muted) {
    if (button) {
      button.innerText =
        "🔇 Sound Off";
    }
  } else {
    if (button) {
      button.innerText =
        "🔊 Sound On";
    }

    video.volume = 1;

    video
      .play()
      .catch((error) => {
        console.error(
          "Video play error:",
          error
        );
      });
  }
}

window.togglePromoSound =
  togglePromoSound;