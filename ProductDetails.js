// ===============================
// Urban Threads - ProductDetails.js
// ===============================

import { auth, database } from "./Firebase.js";

import {
    ref,
    set,
    remove,
    get,
    push,
    onValue
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-database.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";


let selectedSize = "M";
let selectedColor = "Black";
const addCartBtn = document.getElementById("addCartBtn");

const products = [
    {
        id: "1",
        name: "Oversized T-Shirt",
        price: 29.99,
        image: "images/product1.jpg",
        description: "Premium oversized t-shirt designed for comfort and modern street style."
    },

    {
        id: "2",
        name: "Casual Shirt",
        price: 34.99,
        image: "images/product2.jpg",
        description: "Classic casual shirt perfect for everyday wear."
    },

    {
        id: "3",
        name: "Premium Hoodie",
        price: 49.99,
        image: "images/product3.jpg",
        description: "Warm and stylish premium hoodie with comfortable fabric."
    },

    {
        id: "4",
        name: "Denim Jeans",
        price: 44.99,
        image: "images/product4.jpg",
        description: "High quality denim jeans with a modern fit."
    }
];


// ===============================
// Get Product ID From URL
// ===============================

const urlParams = new URLSearchParams(window.location.search);

const productId = urlParams.get("id");


// ===============================
// Load Product
// ===============================

const product = products.find(item => item.id === productId);


if (product) {

    document.getElementById("productImage").src = product.image;

    document.getElementById("productImage").alt = product.name;

    document.getElementById("productName").textContent = product.name;

    document.getElementById("productPrice").textContent =
        "$" + product.price;

    document.getElementById("productDescription").textContent =
        product.description;

}


// ===============================
// Quantity
// ===============================

let quantity = 1;

const quantityText = document.getElementById("quantity");


document.getElementById("plusBtn").addEventListener("click", () => {

    quantity++;

    quantityText.textContent = quantity;

});


document.getElementById("minusBtn").addEventListener("click", () => {

    if (quantity > 1) {

        quantity--;

        quantityText.textContent = quantity;

    }

});

// ===============================
// Add To Cart
// ===============================

addCartBtn.addEventListener("click", () => {


    let cart = JSON.parse(localStorage.getItem("cart")) || [];


    const cartProduct = {

        id: product.id,

        name: product.name,

        price: product.price,

        image: product.image,

        size: selectedSize,

        color: selectedColor,

        quantity: quantity

    };


    const existingProduct = cart.find(
        item => item.id === cartProduct.id
    );


    if (existingProduct) {

        existingProduct.quantity += quantity;

    }

    else {

        cart.push(cartProduct);

    }


    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );


    updateCartCount();


    showToast(
        product.name + " added to cart 🛒"
    );


});

// ===============================
// Wishlist Button
// ===============================

const wishlistBtn = document.getElementById("wishlistBtn");


let isWishlisted = false;



onAuthStateChanged(auth, async (user) => {


    if (!user) return;


    const snapshot = await get(
        ref(database, `wishlist/${user.uid}/${product.id}`)
    );


    if (snapshot.exists()) {

        isWishlisted = true;

        wishlistBtn.innerHTML = "❤️ Wishlisted";

    }


});




wishlistBtn.addEventListener("click", async () => {


    const user = auth.currentUser;


    if (!user) {

        showToast("Please login first ❤️");

        setTimeout(() => {

            window.location.href = "Login.html";

        }, 1500);


        return;

    }



    const wishlistRef = ref(
        database,
        `wishlist/${user.uid}/${product.id}`
    );



    if (isWishlisted) {


        await remove(wishlistRef);


        isWishlisted = false;


        wishlistBtn.innerHTML = "❤️ Wishlist";


        showToast("Removed from wishlist");


    }

    else {


        await set(wishlistRef, {

            id: product.id,

            name: product.name,

            price: product.price,

            image: product.image

        });


        isWishlisted = true;


        wishlistBtn.innerHTML = "❤️ Wishlisted";


        showToast("Added to wishlist ❤️");


    }


});

// ===============================
// Size Selection
// ===============================

const sizeButtons = document.querySelectorAll(".size-box button");


sizeButtons.forEach(button => {

    button.addEventListener("click", () => {

        sizeButtons.forEach(btn => {
            btn.classList.remove("active");
        });


        button.classList.add("active");


        selectedSize = button.textContent;

    });

});

// ===============================
// Color Selection
// ===============================

const colorButtons = document.querySelectorAll(".color");


colorButtons.forEach(color => {


    color.addEventListener("click", () => {


        colorButtons.forEach(btn => {
            btn.classList.remove("active");
        });


        color.classList.add("active");


        if (color.classList.contains("black")) {
            selectedColor = "Black";
        }

        else if (color.classList.contains("white")) {
            selectedColor = "White";
        }

        else if (color.classList.contains("blue")) {
            selectedColor = "Blue";
        }


    });


});

// ===============================
// Product Gallery
// ===============================

const mainImage = document.getElementById("productImage");

const thumbnails = document.querySelectorAll(".thumb");

thumbnails.forEach(thumbnail => {

    thumbnail.addEventListener("click", () => {

        mainImage.src = thumbnail.src;

        thumbnails.forEach(img => {
            img.classList.remove("active-thumb");
        });

        thumbnail.classList.add("active-thumb");

    });

});

// ===============================
// Review Star Rating
// ===============================

let selectedRating = 0;

const stars = document.querySelectorAll(".star");

stars.forEach((star) => {

    star.addEventListener("click", () => {

        selectedRating = Number(star.dataset.rating);

        stars.forEach((s) => {

            if (Number(s.dataset.rating) <= selectedRating) {

                s.classList.add("active");

            } else {

                s.classList.remove("active");

            }

        });

    });

});

// ===============================
// Submit Review
// ===============================

const submitReviewBtn = document.getElementById("submitReviewBtn");
const reviewText = document.getElementById("reviewText");

submitReviewBtn.addEventListener("click", async () => {

    const user = auth.currentUser;

    if (!user) {

        showToast("Please login first");
        return;

    }

    if (selectedRating === 0) {

        showToast("Please select rating ⭐");
        return;

    }

    if (reviewText.value.trim() === "") {

        showToast("Write your review first");
        return;

    }

    const reviewRef = ref(
        database,
        `reviews/${product.id}/${user.uid}`
    );

    await set(reviewRef, {

        userId: user.uid,

        userName: user.displayName || "Anonymous",

        rating: selectedRating,

        review: reviewText.value,

        date: new Date().toISOString()

    });

    reviewText.value = "";

    selectedRating = 0;

    stars.forEach(star => {

        star.classList.remove("active");

    });

    if (isUpdate) {

        showToast("Review updated successfully ✏️");

    } else {

        showToast("Review submitted successfully ⭐");

    }

});

// ===============================
// Load Reviews
// ===============================

const reviewsContainer = document.getElementById("reviewsContainer");

const averageRating = document.getElementById("averageRating");

const totalReviews = document.getElementById("totalReviews");

onValue(ref(database, `reviews/${product.id}`), (snapshot) => {

    reviewsContainer.innerHTML = "";

    if (!snapshot.exists()) {

        averageRating.textContent = "0.0";

        totalReviews.textContent = "0";

        return;

    }

    const reviews = snapshot.val();

    let totalRating = 0;

    let count = 0;

    Object.values(reviews).forEach((item) => {

        count++;

        totalRating += item.rating;

        reviewsContainer.innerHTML += `

        <div class="review-card">

            <h4>${item.userName}</h4>

            <div class="review-stars">

                ${"⭐".repeat(item.rating)}

            </div>

            <p>${item.review}</p>

            <div class="review-date">

                ${new Date(item.date).toLocaleDateString()}

            </div>

        </div>

        `;

    });

    averageRating.textContent = (totalRating / count).toFixed(1);

    totalReviews.textContent = count;

});