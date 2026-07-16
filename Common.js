// ===============================
// Urban Threads - Common.js
// Common Functions for All Pages
// ===============================

// ===============================
// Update Cart Counter
// ===============================

function updateCartCount() {

    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    const totalItems = cart.reduce((total, product) => {
        return total + product.quantity;
    }, 0);

    const cartCount = document.getElementById("cartCount");

    if (cartCount) {
        cartCount.textContent = totalItems;
    }
}

// ===============================
// Page Load
// ===============================

document.addEventListener("DOMContentLoaded", () => {
    updateCartCount();
});

// ===============================
// Toast Notification
// ===============================

function showToast(message){
    const toast = document.getElementById("toast");
    if(!toast) return;
    toast.textContent = message;
    toast.classList.add("show");
    setTimeout(()=>{
        toast.classList.remove("show");
    },3000);
}