// ===============================
// Urban Threads - Checkout.js
// ===============================

import { auth, database } from "./Firebase.js";

import {
    ref,
    push
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-database.js";

const checkoutItems = document.getElementById("checkoutItems");
const checkoutSubtotal = document.getElementById("checkoutSubtotal");
const checkoutTotal = document.getElementById("checkoutTotal");
let cart = JSON.parse(localStorage.getItem("cart")) || [];
displayCheckout();
function displayCheckout() {
    checkoutItems.innerHTML = "";
    let total = 0;
    if (cart.length === 0) {
        checkoutItems.innerHTML = `
            <p>Your cart is empty.</p>
        `;
        checkoutSubtotal.textContent = "$0.00";
        checkoutTotal.textContent = "$0.00";
        return;
    }
    cart.forEach(product => {
        total += product.price * product.quantity;
        checkoutItems.innerHTML += `
        <div class="checkout-product">
            <p>
                ${product.name}
                <strong> × ${product.quantity}</strong>
            </p>
            <span>
                $${(product.price * product.quantity).toFixed(2)}
            </span>
        </div>
        `;
    });
    checkoutSubtotal.textContent = "$" + total.toFixed(2);
    checkoutTotal.textContent = "$" + total.toFixed(2);
}

// ===============================
// Place Order
// ===============================

const placeOrderBtn = document.getElementById("placeOrderBtn");
const checkoutForm = document.getElementById("checkoutForm");

placeOrderBtn.addEventListener("click", async (e) => {

    e.preventDefault();

    if (!checkoutForm.checkValidity()) {

        checkoutForm.reportValidity();
        return;

    }

    const total = cart.reduce((sum, product) => {
        return sum + (product.price * product.quantity);
    }, 0);

    const order = {

        userId: auth.currentUser.uid,

        customerName: auth.currentUser.displayName,

        email: auth.currentUser.email,

        firstName: document.querySelector('input[placeholder="First Name"]').value,

        lastName: document.querySelector('input[placeholder="Last Name"]').value,

        phone: document.querySelector('input[placeholder="Phone Number"]').value,

        country: document.querySelector('input[placeholder="Country"]').value,

        city: document.querySelector('input[placeholder="City"]').value,

        postalCode: document.querySelector('input[placeholder="Postal Code"]').value,

        address: document.querySelector('input[placeholder="Street Address"]').value,

        products: cart,

        total: total,

        status: "Pending",

        orderDate: new Date().toISOString()

    };

    console.log(order);

    await push(
        ref(database, "orders"),
        order
    );

    showToast("🎉 Order placed successfully!");

    localStorage.removeItem("cart");

    updateCartCount();

    setTimeout(() => {

        window.location.href = "Home.html";

    }, 2000);

});