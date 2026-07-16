// ===============================
// Urban Threads - Checkout.js
// ===============================

const checkoutItems = document.getElementById("checkoutItems");
const checkoutSubtotal = document.getElementById("checkoutSubtotal");
const checkoutTotal = document.getElementById("checkoutTotal");
let cart = JSON.parse(localStorage.getItem("cart")) || [];
displayCheckout();
function displayCheckout() {
    checkoutItems.innerHTML = "";
    let total = 0;
    if(cart.length === 0){
        checkoutItems.innerHTML = `
            <p>Your cart is empty.</p>
        `;
        checkoutSubtotal.textContent = "$0.00";
        checkoutTotal.textContent = "$0.00";
        return;
    }
    cart.forEach(product=>{
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

placeOrderBtn.addEventListener("click", (e) => {

    e.preventDefault();

    if (!checkoutForm.checkValidity()) {

        checkoutForm.reportValidity();
        return;

    }

    showToast("🎉 Order placed successfully!");

    localStorage.removeItem("cart");

    updateCartCount();

    setTimeout(() => {

        window.location.href = "Home.html";

    }, 2000);

});