// ===============================
// Urban Threads Shop.js
// ===============================

import { auth, database } from "./Firebase.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";

import {
    ref,
    set,
    get
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-database.js";

const searchBox = document.getElementById("searchBox");

const categoryFilter = document.getElementById("categoryFilter");

const productCards = document.querySelectorAll(".product-card");


// ===============================
// Search Products
// ===============================

searchBox.addEventListener("keyup", () => {
    const value = searchBox.value.toLowerCase();
    productCards.forEach(card => {
        const name = card.dataset.name.toLowerCase();
        if(name.includes(value)){
            card.style.display = "block";
        }else{
            card.style.display = "none";
        }
    });
});


// ===============================
// Category Filter
// ===============================

categoryFilter.addEventListener("change",()=>{
    const value = categoryFilter.value;
    productCards.forEach(card=>{
        if(value==="all"){
            card.style.display="block";
        }
        else if(card.dataset.category===value){
            card.style.display="block";
        }
        else{
            card.style.display="none";
        }
    });
});

// ===============================
// Sort Products
// ===============================

const sortProducts = document.getElementById("sortProducts");
const productContainer = document.querySelector(".products-grid");
sortProducts.addEventListener("change", () => {
    const cards = Array.from(document.querySelectorAll(".product-card"));
    if (sortProducts.value === "low-high") {
        cards.sort((a, b) => {
            return Number(a.dataset.price) - Number(b.dataset.price);
        });
    }
    else if (sortProducts.value === "high-low") {
        cards.sort((a, b) => {
            return Number(b.dataset.price) - Number(a.dataset.price);
        });
    }
    cards.forEach(card => {

        productContainer.appendChild(card);
    });
});

// ===============================
// Add to Cart
// ===============================

const addToCartButtons = document.querySelectorAll(".cart-btn");
addToCartButtons.forEach(button => {
    button.addEventListener("click", () => {
        const card = button.closest(".product-card");
        const product = {
            id: card.dataset.id,
            name: card.dataset.name,
            price: parseFloat(card.dataset.price),
            category: card.dataset.category,
            image: card.dataset.image,
            quantity: 1
        };
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        const existingProduct = cart.find(item => item.id === product.id);
        if (existingProduct) {
            existingProduct.quantity++;
        } else {
            cart.push(product);
        }
        localStorage.setItem("cart", JSON.stringify(cart));
        updateCartCount();
        showToast(product.name + " added to cart");
    });
});



updateCartCount();

// ===============================
// Load Wishlist Status
// ===============================

onAuthStateChanged(auth, async (user) => {

    if (!user) return;

    const snapshot = await get(ref(database, `wishlist/${user.uid}`));

    if (!snapshot.exists()) return;

    const wishlist = snapshot.val();

    document.querySelectorAll(".product-card").forEach(card => {

        const productId = card.dataset.id;

        if (wishlist[productId]) {

            card.querySelector(".wishlist-btn").innerHTML =
                `<i class="fa-solid fa-heart"></i>`;

        }

    });

});


// ===============================
// Add To Wishlist
// ===============================

const wishlistButtons = document.querySelectorAll(".wishlist-btn");

console.log("Wishlist Buttons:", wishlistButtons.length);

wishlistButtons.forEach(button => {

    button.addEventListener("click", async () => {

        const user = auth.currentUser;

        if (!user) {

            showToast("Please login first ❤️");

            setTimeout(() => {
                window.location.href = "Login.html";
            }, 1500);

            return;

        }


        const card = button.closest(".product-card");


        const product = {

            id: card.dataset.id,
            name: card.dataset.name,
            price: Number(card.dataset.price),
            category: card.dataset.category,
            image: card.dataset.image

        };


        try {

            await set(
                ref(database, 
                `wishlist/${user.uid}/${product.id}`),
                product
            );


            button.innerHTML = `
            <i class="fa-solid fa-heart"></i>
            `;


            showToast(product.name + " added to wishlist ❤️");


        } catch(error) {

            console.error(error);

            showToast("❌ Wishlist failed!");

        }


    });

});

// ===============================
// Product Details
// ===============================

const viewButtons = document.querySelectorAll(".view-btn");

viewButtons.forEach(button => {

    button.addEventListener("click", () => {

        const card = button.closest(".product-card");

        const productId = card.dataset.id;

        window.location.href = `ProductDetails.html?id=${productId}`;

    });

});