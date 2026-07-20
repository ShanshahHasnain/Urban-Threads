// ===============================
// Urban Threads ProductDetails.js
// ===============================

import { auth, database } from "./Firebase.js";

import {
    ref,
    get,
    set,
    push
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-database.js";


// ===============================
// Product ID
// ===============================

const urlParams =
    new URLSearchParams(window.location.search);

const productId =
    urlParams.get("id");


// ===============================
// Product Elements
// ===============================

const productImage =
    document.getElementById("productImage");

const productName =
    document.getElementById("productName");

const productPrice =
    document.getElementById("productPrice");

const productDescription =
    document.getElementById("productDescription");

const productStock =
    document.getElementById("productStock");


// Buttons

const addCartBtn =
    document.getElementById("addCartBtn");

const wishlistBtn =
    document.getElementById("wishlistBtn");


// ===============================
// Reviews Elements
// ===============================

const reviewText =
    document.getElementById("reviewText");

const submitReviewBtn =
    document.getElementById("submitReviewBtn");

const stars =
    document.querySelectorAll(".star");

const reviewsContainer =
    document.getElementById("reviewsContainer");

const averageRating =
    document.getElementById("averageRating");

const totalReviews =
    document.getElementById("totalReviews");


// ===============================
// Current Product
// ===============================

let currentProduct = null;

let selectedRating = 0;


// ===============================
// Load Product
// ===============================

async function loadProduct() {


    const snapshot =
        await get(
            ref(
                database,
                `products/${productId}`
            )
        );


    if (!snapshot.exists()) {

        productName.textContent =
            "Product Not Found";

        return;

    }


    const product =
        snapshot.val();


    currentProduct = {

        id: productId,

        name: product.name,

        price: product.price,

        image: product.image,

        category: product.category,

        description: product.description,

        stock: product.stock

    };


    productImage.src =
        product.image;


    productName.textContent =
        product.name;


    productPrice.textContent =
        "PKR " + Number(product.price).toLocaleString();


    productDescription.textContent =
        product.description;


    productStock.textContent =
        product.stock;


}


loadProduct();

// ===============================
// Add To Cart
// ===============================


if (addCartBtn) {


    addCartBtn.addEventListener(
        "click",
        () => {


            if (!currentProduct) {

                showToast("Product loading...");

                return;

            }



            let cart =
                JSON.parse(
                    localStorage.getItem("cart")
                ) || [];



            const existingProduct =
                cart.find(
                    item =>
                        item.id === currentProduct.id
                );



            if (existingProduct) {


                existingProduct.quantity++;


            }

            else {


                cart.push({

                    id: currentProduct.id,

                    name: currentProduct.name,

                    price: currentProduct.price,

                    image: currentProduct.image,

                    category: currentProduct.category,

                    quantity: 1

                });


            }



            localStorage.setItem(
                "cart",
                JSON.stringify(cart)
            );



            if (window.updateCartCount) {

                updateCartCount();

            }



            showToast(
                currentProduct.name +
                " added to cart 🛒"
            );



        });


}




// ===============================
// Wishlist
// ===============================


if (wishlistBtn) {


    wishlistBtn.addEventListener(
        "click",
        async () => {


            const user =
                auth.currentUser;



            if (!user) {


                showToast(
                    "Please login first ❤️"
                );


                setTimeout(() => {


                    window.location.href =
                        "Login.html";


                }, 1500);


                return;


            }



            if (!currentProduct) {

                return;

            }



            try {


                await set(

                    ref(

                        database,

                        `wishlist/${user.uid}/${currentProduct.id}`

                    ),


                    currentProduct


                );



                wishlistBtn.innerHTML =
                    "❤️ Added";



                showToast(
                    "Added to wishlist ❤️"
                );


            }



            catch (error) {


                console.log(error);


                showToast(
                    "Wishlist Failed"
                );


            }



        });


}




// ===============================
// Star Rating
// ===============================


stars.forEach(star => {


    star.addEventListener(
        "click",
        () => {


            selectedRating =
                Number(
                    star.dataset.rating
                );



            stars.forEach(s => {


                if (
                    Number(s.dataset.rating)
                    <= selectedRating
                ) {

                    s.style.color =
                        "gold";


                }

                else {


                    s.style.color =
                        "gray";


                }


            });


        });


});

// ===============================
// Submit Review
// ===============================


if (submitReviewBtn) {


    submitReviewBtn.addEventListener(
        "click",
        async () => {


            const user =
                auth.currentUser;



            if (!user) {


                showToast(
                    "Please login first ❤️"
                );


                return;


            }



            if (selectedRating === 0) {


                showToast(
                    "Please select rating ⭐"
                );


                return;


            }



            if (reviewText.value.trim() === "") {


                showToast(
                    "Please write review"
                );


                return;


            }



            const review = {

                userName:
                    user.displayName || "Customer",

                userId:
                    user.uid,

                productId:
                    productId,

                rating:
                    selectedRating,

                review:
                    reviewText.value.trim(),

                date:
                    new Date().toISOString(),

                featured:false

            };



            try {


                await set(

                    push(

                        ref(

                            database,

                            `reviews/${productId}`

                        )

                    ),


                    review


                );



                showToast(
                    "Review submitted successfully"
                );



                reviewText.value = "";

                selectedRating = 0;



                stars.forEach(star => {

                    star.style.color =
                        "gray";

                });



                loadReviews();



            }



            catch (error) {


                console.log(error);


                showToast(
                    "Review failed"
                );


            }



        });


}





// ===============================
// Load Reviews
// ===============================

async function loadReviews() {

    const snapshot = await get(

        ref(

            database,

            `reviews/${productId}`

        )

    );

    reviewsContainer.innerHTML = "";

    if (!snapshot.exists()) {

        averageRating.textContent = "0.0";

        totalReviews.textContent = "0";

        return;

    }

    let totalRating = 0;

    let count = 0;

    snapshot.forEach(child => {

        const review = child.val();

        totalRating += Number(review.rating);

        count++;

        reviewsContainer.innerHTML += `

        <div class="single-review">

            <h4>

                ${review.userName || review.name || "Customer"}

            </h4>

            <p>

                ${"⭐".repeat(review.rating)}

            </p>

            <p>

                ${review.review || review.comment}

            </p>

            <small>

                ${new Date(review.date).toLocaleDateString()}

            </small>

        </div>

        `;

    });

    if (count === 0) {

        averageRating.textContent = "0.0";

        totalReviews.textContent = "0";

        reviewsContainer.innerHTML = `

        <p class="no-reviews">

            No reviews yet.

        </p>

        `;

        return;

    }

    const average = totalRating / count;

    averageRating.textContent = average.toFixed(1);

    totalReviews.textContent = count;

}



// ===============================
// Start Reviews
// ===============================

loadReviews();