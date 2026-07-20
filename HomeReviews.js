// ===============================
// Urban Threads Home Reviews
// ===============================

import { database } from "./Firebase.js";

import {

    ref,

    get

} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-database.js";

const reviewsContainer =
    document.getElementById("homeReviews");



// ===============================
// Load Featured Reviews
// ===============================

async function loadHomeReviews() {

    try {

        const snapshot =
            await get(

                ref(database, "reviews")

            );

        reviewsContainer.innerHTML = "";

        if (!snapshot.exists()) {

            reviewsContainer.innerHTML = `

            <p>

                No Reviews Yet

            </p>

            `;

            return;

        }

        snapshot.forEach(product => {

            product.forEach(review => {

                const data = review.val();

                if (data.featured) {

                    reviewsContainer.innerHTML += `

<div class="review-card">

    <h2>
        ${data.userName || data.name || "Customer"}
    </h2>

    <div class="stars">
        ${'<i class="fa-solid fa-star"></i>'.repeat(data.rating)}
    </div>

    <p>
        ${data.review || data.comment || ""}
    </p>

</div>

`;

                }

            });

        });

        if (reviewsContainer.innerHTML === "") {

            reviewsContainer.innerHTML = `

            <p class="no-reviews">

                No Featured Reviews Yet.

            </p>

            `;

        }

    }

    catch (error) {

        console.error(error);

    }

}



// ===============================
// Start
// ===============================

loadHomeReviews();