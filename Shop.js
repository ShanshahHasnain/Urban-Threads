// ===============================
// Urban Threads Shop.js
// Firebase Dynamic Shop
// Part 1
// ===============================

import { auth, database } from "./Firebase.js";

import {
    ref,
    get,
    set
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-database.js";

// ===============================
// Elements
// ===============================

const productsGrid = document.getElementById("productsGrid");

const searchBox = document.getElementById("searchBox");

const categoryFilter = document.getElementById("categoryFilter");

const sortProducts = document.getElementById("sortProducts");

// ===============================
// Global Products Array
// ===============================

let allProducts = [];

// ===============================
// Load Products
// ===============================

async function loadProducts() {

    try {

        const snapshot = await get(ref(database, "products"));

        allProducts = [];

        if (!snapshot.exists()) {

            productsGrid.innerHTML = `
                <h2 style="text-align:center;">
                    No Products Found
                </h2>
            `;

            return;

        }

        snapshot.forEach(child => {

            const product = child.val();

            product.id = child.key;

            allProducts.push(product);

        });

        applyFilters();

    }

    catch (error) {

        console.error(error);

        productsGrid.innerHTML = `
            <h2 style="text-align:center;color:red;">
                Failed to Load Products
            </h2>
        `;

    }

}

// ===============================
// Render Products
// ===============================

function renderProducts(products) {

    productsGrid.innerHTML = "";

    if (products.length === 0) {

        productsGrid.innerHTML = `
            <h2 style="text-align:center;">
                No Matching Products
            </h2>
        `;

        return;

    }

    products.forEach(product => {

        productsGrid.innerHTML += `
        
        <div class="product-card"

            data-id="${product.id}"

            data-name="${product.name}"

            data-category="${product.category}"

            data-price="${product.price}"

            data-image="${product.image}">

            <button class="wishlist-btn">
                <i class="fa-regular fa-heart"></i>
            </button>

            <img src="${product.image}" alt="${product.name}">

            <div class="product-content">

                <h3>${product.name}</h3>

                <div class="rating">
                    ★★★★★
                </div>

                <div class="price">

                    <span class="new-price">
                        PKR ${Number(product.price).toLocaleString()}
                    </span>

                </div>

                <div class="product-buttons">

                    <button class="cart-btn">
                        Add to Cart
                    </button>

                    <button class="view-btn">
                        Quick View
                    </button>

                </div>

            </div>

        </div>

        `;

    });

}

// ===============================
// Search + Filter + Sort
// ===============================

function applyFilters() {

    let filteredProducts = [...allProducts];

    // ===============================
    // Search
    // ===============================

    const searchValue = searchBox.value
        .toLowerCase()
        .trim();

    if (searchValue !== "") {

        filteredProducts = filteredProducts.filter(product => {

            return product.name
                .toLowerCase()
                .includes(searchValue);

        });

    }

    // ===============================
    // Category
    // ===============================

    const selectedCategory = categoryFilter.value;

    if (selectedCategory !== "all") {

        filteredProducts = filteredProducts.filter(product => {

            return product.category === selectedCategory;

        });

    }

    // ===============================
    // Sort
    // ===============================

    const sortValue = sortProducts.value;

    if (sortValue === "low-high") {

        filteredProducts.sort((a, b) => {

            return Number(a.price) - Number(b.price);

        });

    }

    else if (sortValue === "high-low") {

        filteredProducts.sort((a, b) => {

            return Number(b.price) - Number(a.price);

        });

    }

    renderProducts(filteredProducts);

}

// ===============================
// Events
// ===============================

searchBox.addEventListener("keyup", () => {

    applyFilters();

});

categoryFilter.addEventListener("change", () => {

    applyFilters();

});

sortProducts.addEventListener("change", () => {

    applyFilters();

});

// ===============================
// Initial Load
// ===============================

loadProducts();

// ===============================
// Product Actions
// Add To Cart
// Wishlist
// Quick View
// ===============================


productsGrid.addEventListener("click", async (e) => {


    const card = e.target.closest(".product-card");


    if (!card) return;



    const product = {

        id: card.dataset.id,

        name: card.dataset.name,

        price: Number(card.dataset.price),

        category: card.dataset.category,

        image: card.dataset.image,

        quantity: 1

    };



    // ===============================
    // Add To Cart
    // ===============================


    if (e.target.closest(".cart-btn")) {


        let cart = JSON.parse(localStorage.getItem("cart")) || [];



        const existingProduct = cart.find(item => 
            item.id === product.id
        );



        if (existingProduct) {


            existingProduct.quantity++;


        } 
        
        else {


            cart.push(product);


        }



        localStorage.setItem(
            "cart",
            JSON.stringify(cart)
        );



        updateCartCount();


        showToast(
            product.name + " added to cart 🛒"
        );


    }




    // ===============================
    // Quick View
    // ===============================


    if (e.target.closest(".view-btn")) {


        window.location.href =
        `ProductDetails.html?id=${product.id}`;


    }





    // ===============================
    // Wishlist
    // ===============================


    if (e.target.closest(".wishlist-btn")) {



        const user = auth.currentUser;



        if (!user) {


            showToast(
                "Please login first ❤️"
            );


            setTimeout(()=>{


                window.location.href =
                "Login.html";


            },1500);



            return;


        }




        try {



            await set(

                ref(
                    database,
                    `wishlist/${user.uid}/${product.id}`
                ),

                product

            );



            card.querySelector(
                ".wishlist-btn"
            ).innerHTML = `

                <i class="fa-solid fa-heart"></i>

            `;



            showToast(
                product.name + 
                " added to wishlist ❤️"
            );



        }


        catch(error){


            console.error(error);



            showToast(
                "Wishlist failed ❌"
            );


        }



    }



});

// ===============================
// Load User Wishlist Status
// ===============================

async function loadWishlistStatus() {


    const user = auth.currentUser;


    if (!user) return;



    try {


        const snapshot = await get(

            ref(
                database,
                `wishlist/${user.uid}`
            )

        );



        if (!snapshot.exists()) return;



        const wishlist = snapshot.val();



        document
        .querySelectorAll(".product-card")
        .forEach(card => {



            const productId = card.dataset.id;



            if (wishlist[productId]) {



                const heartButton =
                card.querySelector(".wishlist-btn");



                if (heartButton) {


                    heartButton.innerHTML = `

                    <i class="fa-solid fa-heart"></i>

                    `;


                }


            }



        });



    }


    catch(error){


        console.error(
            "Wishlist Load Error:",
            error
        );


    }


}




// ===============================
// Authentication Change
// ===============================

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";



onAuthStateChanged(
    auth,
    () => {


        loadWishlistStatus();


    }
);

// ===============================
// Cart Count Update
// ===============================

function updateCartCount() {


    const cart = JSON.parse(
        localStorage.getItem("cart")
    ) || [];



    let total = 0;



    cart.forEach(item => {

        total += Number(item.quantity);

    });



    const cartCount =
    document.getElementById("cartCount");



    if(cartCount){

        cartCount.textContent = total;

    }


}



// ===============================
// Toast Notification
// ===============================

function showToast(message){


    const toast =
    document.getElementById("toast");



    if(!toast){

        alert(message);

        return;

    }



    toast.textContent = message;



    toast.classList.add("show");



    setTimeout(()=>{


        toast.classList.remove("show");


    },3000);



}



// ===============================
// Initial Page Setup
// ===============================


document.addEventListener(
"DOMContentLoaded",
()=>{


    updateCartCount();



});



// ===============================
// Export Functions
// Common.js ke liye
// ===============================


window.updateCartCount =
updateCartCount;


window.showToast =
showToast;