
const API_URL = "https://coffee-commerce-fullstack.onrender.com/api";

const menu = document.querySelector(".menu-icon");
const navbar = document.querySelector(".navbar");
const cartCount = document.querySelector(".cart-count");
const cursorGlow = document.querySelector(".cursor-glow");

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
  document.querySelector("header")?.classList.toggle("scrolled", window.scrollY > 80);
});

document.addEventListener("mousemove", (e) => {
  if (!cursorGlow) return;
  cursorGlow.style.left = `${e.clientX}px`;
  cursorGlow.style.top = `${e.clientY}px`;
});

if (typeof ScrollReveal !== "undefined") {
  const sr = ScrollReveal({
    origin: "bottom",
    distance: "60px",
    duration: 1200,
    delay: 120,
    reset: false,
  });

  sr.reveal(".hero-text, .page-hero-content, .heading", { origin: "left" });
  sr.reveal(".hero-3d-wrap, .ad-scene, .booking-3d", { origin: "right" });
  sr.reveal(".quick-card, .product-card, .service-card, .team-card, .glass-card, .split-img, .split-text", {
    interval: 120,
  });
}

document.querySelectorAll(".tilt-card").forEach((card) => {
  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rotateY = ((x / rect.width) - 0.5) * 18;
    const rotateX = ((y / rect.height) - 0.5) * -18;
    card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
  });

  card.addEventListener("mouseleave", () => {
    card.style.transform = "";
  });
});

function getCart() {
  return JSON.parse(localStorage.getItem("coffeeCart")) || [];
}

function saveCart(cart) {
  localStorage.setItem("coffeeCart", JSON.stringify(cart));
  updateCartCount();
}

function updateCartCount() {
  const cart = getCart();
  const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
  if (cartCount) cartCount.textContent = totalQty;
}

function addToCart(product) {
  const cart = getCart();
  const existing = cart.find((item) => item.name === product.name);

  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...product, qty: 1 });
  }

  saveCart(cart);
  showToast(`${product.name} added to cart`);
}

function showToast(message) {
  const oldToast = document.querySelector(".toast");
  if (oldToast) oldToast.remove();

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

  setTimeout(() => toast.remove(), 2200);
}

document.querySelectorAll(".add-cart").forEach((btn) => {
  btn.addEventListener("click", () => {
    const card = btn.closest(".product-card");
    const product = {
      name: card.dataset.name,
      price: Number(card.dataset.price),
      img: card.dataset.img,
    };
    addToCart(product);
  });
});

function renderCart() {
  const cartItems = document.querySelector(".cart-items");
  const cartTotal = document.querySelector(".cart-total");
  if (!cartItems || !cartTotal) return;

  const cart = getCart();

  if (cart.length === 0) {
    cartItems.innerHTML = `<div class="glass-card"><h2>Your cart is empty</h2><p>Add coffee from the menu page.</p></div>`;
    cartTotal.textContent = "$0";
    return;
  }

  let total = 0;

  cartItems.innerHTML = cart.map((item, index) => {
    total += item.price * item.qty;
    return `
      <div class="cart-item">
        <img src="${item.img}" alt="${item.name}">
        <div>
          <h3>${item.name}</h3>
          <p>$${item.price} × ${item.qty}</p>
        </div>
        <button class="remove-item" data-index="${index}">Remove</button>
      </div>
    `;
  }).join("");

  cartTotal.textContent = `$${total}`;

  document.querySelectorAll(".remove-item").forEach((btn) => {
    btn.addEventListener("click", () => {
      const index = Number(btn.dataset.index);
      const cart = getCart();
      cart.splice(index, 1);
      saveCart(cart);
      renderCart();
    });
  });
}

document.querySelector(".checkout-btn")?.addEventListener("click", async () => {
  const cart = getCart();
  if (cart.length === 0) return showToast("Cart is empty");

  try {
    const res = await fetch(`${API_URL}/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: cart }),
    });

    const data = await res.json();

    if (data.success) {
      localStorage.removeItem("coffeeCart");
      updateCartCount();
      renderCart();
      showToast("Order placed successfully");
    }
  } catch (error) {
    showToast("Backend not connected");
  }
});

document.querySelector(".booking-form")?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const form = e.target;
  const message = form.querySelector(".form-message");
  const booking = Object.fromEntries(new FormData(form).entries());

  try {
    const res = await fetch(`${API_URL}/bookings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(booking),
    });

    const data = await res.json();
    message.textContent = data.success ? "Table booked successfully!" : "Booking failed";
    if (data.success) form.reset();
  } catch (error) {
    message.textContent = "Backend not connected. Start backend using npm run dev.";
  }
});

document.querySelector(".contact-form")?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const form = e.target;
  const messageBox = form.querySelector(".form-message");
  const message = Object.fromEntries(new FormData(form).entries());

  try {
    const res = await fetch(`${API_URL}/contacts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(message),
    });

    const data = await res.json();
    messageBox.textContent = data.success ? "Message sent successfully!" : "Message failed";
    if (data.success) form.reset();
  } catch (error) {
    messageBox.textContent = "Backend not connected. Start backend using npm run dev.";
  }
});

document.querySelector(".admin-product-form")?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const form = e.target;
  const message = form.querySelector(".form-message");
  const product = Object.fromEntries(new FormData(form).entries());
  product.price = Number(product.price);

  try {
    const res = await fetch(`${API_URL}/products`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(product),
    });

    const data = await res.json();
    message.textContent = data.success ? "Product added successfully!" : "Product add failed";
    if (data.success) form.reset();
  } catch (error) {
    message.textContent = "Backend not connected.";
  }
});

async function loadAdminBookings() {
  const box = document.querySelector(".admin-bookings");
  if (!box) return;

  try {
    const res = await fetch(`${API_URL}/bookings`);
    const bookings = await res.json();

    if (!bookings.length) {
      box.innerHTML = "<p>No bookings yet.</p>";
      return;
    }

    box.innerHTML = bookings.map((b) => `
      <div class="admin-booking">
        <strong>${b.name}</strong><br>
        Phone: ${b.phone}<br>
        Date: ${b.date} | Time: ${b.time}<br>
        Guests: ${b.guests}<br><br>

        <button class="delete-booking-btn" onclick="deleteBooking('${b._id}')">
          Delete Booking
        </button>
      </div>
    `).join("");
  } catch (error) {
    box.innerHTML = "<p>Backend not connected.</p>";
  }

}

async function deleteBooking(id) {
  const confirmDelete = confirm("Are you sure you want to delete this booking?");

  if (!confirmDelete) return;

  try {
    const res = await fetch(`${API_URL}/bookings/${id}`, {
      method: "DELETE",
    });

    const data = await res.json();

    if (data.success) {
      alert("Booking deleted successfully");
      loadAdminBookings();
    } else {
      alert("Delete failed");
    }
  } catch (error) {
    alert("Backend not connected");
  }
}

document.querySelectorAll(".filter-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".filter-btn").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    const filter = btn.dataset.filter;
    document.querySelectorAll(".product-card").forEach((card) => {
      const category = card.querySelector("p").textContent;
      card.style.display = filter === "all" || category.includes(filter) ? "block" : "none";
    });
  });
});

function runCounters() {
  document.querySelectorAll(".counter").forEach((counter) => {
    const target = Number(counter.dataset.target);
    let count = 0;
    const speed = Math.max(1, Math.floor(target / 100));

    const update = () => {
      count += speed;
      if (count < target) {
        counter.textContent = count;
        requestAnimationFrame(update);
      } else {
        counter.textContent = target;
      }
    };

    update();
  });
}

updateCartCount();
renderCart();
loadAdminBookings();
runCounters();

function togglePromoSound() {
  const video = document.getElementById("promoVideo");
  const button = document.querySelector(".sound-btn");

  if (!video) {
    alert("Video not found");
    return;
  }

  video.muted = !video.muted;

  if (video.muted) {
    button.innerText = "🔇 Sound Off";
  } else {
    button.innerText = "🔊 Sound On";
    video.volume = 1;
    video.play();
  }
}

