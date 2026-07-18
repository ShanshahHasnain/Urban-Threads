import { auth, database } from "./Firebase.js";

import {
    ref,
    get,
    remove
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-database.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";

const wishlistProducts = document.getElementById("wishlistProducts");

onAuthStateChanged(auth, async (user) => {

    if (!user) {

        window.location.href = "Login.html";
        return;

    }

    const snapshot = await get(ref(database, `wishlist/${user.uid}`));

    if (!snapshot.exists()) {

        wishlistProducts.innerHTML = `
            <p>Your wishlist is empty ❤️</p>
        `;

        return;

    }

    const wishlist = snapshot.val();

    wishlistProducts.innerHTML = "";

    Object.entries(wishlist).forEach(([key, product]) => {
        wishlistProducts.innerHTML += `

        <div class="wishlist-card"

        data-key="${key}"

        data-id="${product.id}"

        data-name="${product.name}"

        data-price="${product.price}"

        data-image="${product.image}">

    
        <img src="${product.image}" alt="${product.name}">

    
        <h3>${product.name}</h3>

    
        <p>$${product.price}</p>

    
        <button class="move-cart-btn">
            Add to Cart
        </button>

        <button class="remove-btn">
            Remove ❤️
        </button>

        </div>
        
    `;

    });

});

document.addEventListener("click", async (e) => {

    if (!e.target.classList.contains("remove-btn")) return;

    const user = auth.currentUser;

    if (!user) return;

    const card = e.target.closest(".wishlist-card");

    const wishlistKey = card.dataset.key;

    try {

        await remove(
            ref(database, `wishlist/${user.uid}/${wishlistKey}`)
        );

        card.remove();

        showToast("❤️ Removed from wishlist");

        if (wishlistProducts.children.length === 0) {

            wishlistProducts.innerHTML = `
                <p>Your wishlist is empty ❤️</p>
            `;

        }

    } catch (error) {

        console.error(error);

        showToast("❌ Failed to remove item");

    }

});

document.addEventListener("click", (e) => {

    if (!e.target.classList.contains("move-cart-btn")) return;

    const card = e.target.closest(".wishlist-card");

    const product = {

        id: card.dataset.id,

        name: card.dataset.name,

        price: Number(card.dataset.price),

        image: card.dataset.image,

        quantity: 1

    };

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    const existing = cart.find(item => item.id === product.id);

    if (existing) {

        existing.quantity++;

    } else {

        cart.push(product);

    }

    localStorage.setItem("cart", JSON.stringify(cart));

    updateCartCount();

    showToast(product.name + " added to cart 🛒");

});

