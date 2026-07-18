// ===============================
// Urban Threads - Common.js
// Common Functions for All Pages
// ===============================

// ===============================
// Update Cart Counter
// ===============================

import { auth } from "./Firebase.js";

import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";

const dropdownMenu = document.getElementById("dropdownMenu");
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

function showToast(message) {
    const toast = document.getElementById("toast");
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("show");
    setTimeout(() => {
        toast.classList.remove("show");
    }, 3000);
}

// ===============================
// Authentication State
// ===============================

onAuthStateChanged(auth, (user) => {

    const loginBtn = document.getElementById("loginBtn");

    if (!loginBtn) return;

    if (user) {
        loginBtn.textContent = user.displayName || "Profile";
        dropdownMenu.style.display = "none";
    } else {
        loginBtn.innerHTML = `<i class="fa-solid fa-user"></i> Login`;
        dropdownMenu.style.display = "none";
    }

});

const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {

    logoutBtn.addEventListener("click", async () => {

        try {

            await signOut(auth);

            showToast("👋 Logged out successfully!");

            setTimeout(() => {

                window.location.href = "Login.html";

            }, 1500);

        } catch (error) {

            showToast("❌ Logout failed!");

            console.error(error);

        }

    });

}

window.showToast = showToast;
window.updateCartCount = updateCartCount;

const loginBtn = document.getElementById("loginBtn");

if (loginBtn) {

    loginBtn.addEventListener("click", () => {

        if (auth.currentUser) {

            const dropdownMenu = document.getElementById("dropdownMenu");

            if (dropdownMenu.style.display === "block") {
                dropdownMenu.style.display = "none";
            } else {
                dropdownMenu.style.display = "block";
            }

        } else {

            window.location.href = "Login.html";

        }

    });

}