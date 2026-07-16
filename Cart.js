// ===============================
// Load Cart Products
// ===============================

const cartItems = document.getElementById("cartItems");
const subtotal = document.getElementById("subtotal");
const grandTotal = document.getElementById("grandTotal");

let cart = JSON.parse(localStorage.getItem("cart")) || [];
displayCart();

function displayCart() {
    cartItems.innerHTML = "";
    let total = 0;

    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart">
                <h2>Your Cart is Empty</h2>
                <p>Start shopping to add products.</p>
            </div>
        `;
        subtotal.textContent = "$0.00";
        grandTotal.textContent = "$0.00";
        return;
    }

    cart.forEach(product => {
    total += product.price * product.quantity;
    cartItems.innerHTML += `
    <div class="cart-item">
        <img src="${product.image}" alt="${product.name}">
        <div class="cart-info">
            <h3>${product.name}</h3>
            <p class="product-price">$${product.price.toFixed(2)}</p>
            <div class="quantity-box">
                <button class="minus-btn" data-id="${product.id}">-</button>
                <span>${product.quantity}</span>
                <button class="plus-btn" data-id="${product.id}">+</button>
            </div>
            <button class="remove-btn" data-id="${product.id}">
                Remove
            </button>
        </div>
    </div>
    `;
});
    subtotal.textContent = "$" + total.toFixed(2);
    grandTotal.textContent = "$" + total.toFixed(2);
}

// ===============================
// Cart Button Functions
// ===============================

cartItems.addEventListener("click", (e) => {
    const id = e.target.dataset.id;
    // Plus Button
    if (e.target.classList.contains("plus-btn")) {
        const product = cart.find(item => item.id === id);
        product.quantity++;
    }

    // Minus Button
    if (e.target.classList.contains("minus-btn")) {
        const product = cart.find(item => item.id === id);
        if (product.quantity > 1) {
            product.quantity--;
        }
    }

    // Remove Button
    if (e.target.classList.contains("remove-btn")) {
        cart = cart.filter(item => item.id !== id);
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    displayCart();
});