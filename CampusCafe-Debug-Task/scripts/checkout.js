const checkoutItemsEl = document.getElementById("checkout-items");
const subtotalEl = document.getElementById("subtotal");
const taxEl = document.getElementById("tax");
const discountEl = document.getElementById("discount");
const grandTotalEl = document.getElementById("grand-total");

const promoInput = document.getElementById("promo-input");
const applyPromoBtn = document.getElementById("apply-promo-btn");
const promoMsgEl = document.getElementById("promo-msg");

const orderForm = document.getElementById("order-form");
const studentNameInput = document.getElementById("student-name");
const rollNumberInput = document.getElementById("roll-number");
const orderMsgEl = document.getElementById("order-msg");

let cart = JSON.parse(localStorage.getItem("campus_cart")) || [];
let discountAmount = 0;

function calculateSubtotal() {
  return cart.reduce((sum, item) => sum + Number(item.price) * (item.qty || 1), 0);
}

function renderCheckout() {
  checkoutItemsEl.innerHTML = "";

  if (cart.length === 0) {
    checkoutItemsEl.innerHTML = '<li class="empty-state">No items found in your order.</li>';
  } else {
    cart.forEach((item) => {
      const li = document.createElement("li");
      li.className = "cart-row";
      li.innerHTML = `
        <span>${item.name} × ${item.qty || 1}</span>
        <span>₹${(Number(item.price) * (item.qty || 1)).toFixed(2)}</span>
      `;
      checkoutItemsEl.appendChild(li);
    });
  }

  const subtotal = calculateSubtotal();
  const tax = subtotal * 0.05;
  const grandTotal = Math.max(0, subtotal + tax - discountAmount);

  subtotalEl.textContent = subtotal.toFixed(2);
  taxEl.textContent = tax.toFixed(2);
  discountEl.textContent = discountAmount.toFixed(2);
  grandTotalEl.textContent = grandTotal.toFixed(2);
}

applyPromoBtn.addEventListener("click", () => {
  const code = promoInput.value.trim().toUpperCase();
  const subtotal = calculateSubtotal();

  if (cart.length === 0) {
    discountAmount = 0;
    promoMsgEl.className = "msg-error";
    promoMsgEl.style.color = "";
    promoMsgEl.textContent = "Your cart is empty. Add items before applying a promo code.";
    renderCheckout();
    return;
  }

  if (code === "STUDENT15") {
    if (subtotal >= 150) {
      discountAmount = subtotal * 0.15;
      promoMsgEl.className = "msg-success";
      promoMsgEl.style.color = "#15803d";
      promoMsgEl.textContent = `Promo STUDENT15 applied! You saved ₹${discountAmount.toFixed(2)}.`;
    } else {
      discountAmount = 0;
      promoMsgEl.className = "msg-error";
      promoMsgEl.style.color = "";
      promoMsgEl.textContent = "Promo code STUDENT15 requires a minimum subtotal of ₹150.";
    }
  } else {
    discountAmount = 0;
    promoMsgEl.className = "msg-error";
    promoMsgEl.style.color = "";
    promoMsgEl.textContent = "Invalid promo code. Try STUDENT15.";
  }

  renderCheckout();
});

orderForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const studentName = studentNameInput.value.trim();
  const rollNumber = rollNumberInput.value.trim();

  if (cart.length === 0) {
    orderMsgEl.className = "msg-error";
    orderMsgEl.style.color = "";
    orderMsgEl.textContent = "Cannot confirm an empty order. Please add items to your cart first.";
    return;
  }

  if (!studentName || !rollNumber) {
    orderMsgEl.className = "msg-error";
    orderMsgEl.style.color = "";
    orderMsgEl.textContent = "Please enter both your Full Name and Roll Number.";
    return;
  }

  const orderId = `CC-${Math.floor(100000 + Math.random() * 900000)}`;

  cart = [];
  discountAmount = 0;
  localStorage.removeItem("campus_cart");
  orderForm.reset();
  promoInput.value = "";
  promoMsgEl.textContent = "";
  renderCheckout();

  orderMsgEl.className = "msg-success";
  orderMsgEl.style.color = "#15803d";
  orderMsgEl.textContent = `Order confirmed! Order ID: ${orderId} for ${studentName} (${rollNumber}).`;
});

renderCheckout();