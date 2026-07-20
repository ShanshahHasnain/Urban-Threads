// ===============================
// Urban Threads Admin Reviews
// ===============================

import { database } from "./Firebase.js";

import {
    ref,
    get,
    remove,
    update
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-database.js";

const reviewsTable =
    document.getElementById("reviewsTable");



// ===============================
// Load Reviews
// ===============================

async function loadReviews() {

    try {

        const snapshot =
            await get(
                ref(database, "reviews")
            );

        reviewsTable.innerHTML = "";

        if (!snapshot.exists()) {

            reviewsTable.innerHTML = `

            <tr>

                <td colspan="6">

                    No Reviews Found

                </td>

            </tr>

            `;

            return;

        }

        snapshot.forEach(product => {

            const productId = product.key;

            product.forEach(review => {

                const reviewId = review.key;

                const data = review.val();

                reviewsTable.innerHTML += `

                <tr>

                    <td>

                        ${data.productName || productId}

                    </td>

                    <td>

                        ${data.userName || data.name || "Customer"}

                    </td>

                    <td>

                        ${"⭐".repeat(data.rating || 0)}

                    </td>

                    <td>

                        ${data.review || data.comment || ""}

                    </td>

                    <td>

                        ${data.featured ? "⭐ Featured" : "—"}

                    </td>

                    <td>

                                            ${!data.featured
                        ?

                        `<button

                            class="feature-review-btn"

                            onclick="featureReview('${productId}','${reviewId}')">

                            ⭐ Feature

                            </button>`

                        :

                        `<button

                            class="remove-feature-btn"

                            onclick="removeFeature('${productId}','${reviewId}')">

                            Remove

                            </button>`

                    }

                        <button

                        class="delete-review-btn"

                        onclick="deleteReview('${productId}','${reviewId}')">

                        Delete

                        </button>

                    </td>

                </tr>

                `;

            });

        });

    }

    catch (error) {

        console.error(error);

    }

}



// ===============================
// Feature Review
// ===============================

window.featureReview = async function (productId, reviewId) {

    try {

        await update(

            ref(database, `reviews/${productId}/${reviewId}`),

            {

                featured: true

            }

        );

        alert("Review Featured ⭐");

        loadReviews();

    }

    catch (error) {

        console.error(error);

    }

};

// ===============================
// Remove Feature
// ===============================

window.removeFeature = async function(productId, reviewId){

    try{

        await update(

            ref(database,`reviews/${productId}/${reviewId}`),

            {

                featured:false

            }

        );

        alert("Removed From Home");

        loadReviews();

    }

    catch(error){

        console.error(error);

    }

};



// ===============================
// Delete Review
// ===============================

window.deleteReview = async function(productId, reviewId){

    const confirmDelete =
    confirm("Delete this review?");

    if(!confirmDelete) return;

    try{

        await remove(

            ref(

                database,

                `reviews/${productId}/${reviewId}`

            )

        );

        alert("Review Deleted ✅");

        loadReviews();

    }

    catch(error){

        console.error(error);

        alert("Delete Failed ❌");

    }

};



// ===============================
// Start
// ===============================

loadReviews();