import { database } from "./Firebase.js";

import {
    ref,
    get
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-database.js";

const featuredContainer =
document.getElementById("featuredProducts");

async function loadFeaturedProducts(){

    try{

        const snapshot =
        await get(ref(database,"products"));

        featuredContainer.innerHTML = "";

        if(!snapshot.exists()){

            featuredContainer.innerHTML =
            "<h3>No Products Found</h3>";

            return;

        }

        snapshot.forEach(product=>{

            const id = product.key;

            const data = product.val();

            // Sirf Featured Products
            if(data.featured !== true) return;

            featuredContainer.innerHTML += `

            <div class="product-card">

                <span class="badge">

                    FEATURED

                </span>

                <img src="${data.image}" alt="${data.name}">

                <div class="product-info">

                    <h2>${data.name}</h2>

                    <p class="price">$${data.price}</p>

                    <button
                    class="add-cart-btn"
                    onclick="location.href='ProductDetails.html?id=${id}'">

                        View Product

                    </button>

                </div>

            </div>

            `;

        });

    }

    catch(error){

        console.error(error);

    }

}

loadFeaturedProducts();