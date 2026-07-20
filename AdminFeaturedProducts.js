// ===============================
// Urban Threads
// Featured Products
// ===============================

import { database } from "./Firebase.js";

import {
    ref,
    get,
    update
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-database.js";

const featuredTable =
document.getElementById("featuredTable");



// ===============================
// Load Products
// ===============================

async function loadProducts(){

    try{

        const snapshot =
        await get(
            ref(database,"products")
        );

        featuredTable.innerHTML="";

        if(!snapshot.exists()){

            featuredTable.innerHTML=`

            <tr>

                <td colspan="5">

                    No Products Found

                </td>

            </tr>

            `;

            return;

        }

        snapshot.forEach(product=>{

            const id=product.key;

            const data=product.val();

            featuredTable.innerHTML+=`
                        <tr>

                <td>

                    <img
                    src="${data.image}"
                    class="product-image">

                </td>

                <td>

                    ${data.name}

                </td>

                <td>

                    ${data.category}

                </td>

                <td>

                   PKR ${Number(data.price).toLocaleString()}

                </td>

                <td>

                    <input

                    type="checkbox"

                    class="featured-toggle"

                    data-id="${id}"

                    ${data.featured ? "checked" : ""}

                    >

                </td>

            </tr>

            `;

        });

    }

    catch(error){

        console.error(error);

    }

}



// ===============================
// Update Featured
// ===============================

featuredTable.addEventListener("change", async (e)=>{

    if(!e.target.classList.contains("featured-toggle")) return;

    const productId = e.target.dataset.id;

    const featured = e.target.checked;

    try{

        await update(

            ref(database,`products/${productId}`),

            {

                featured: featured

            }

        );

        alert("Featured Updated ⭐");

    }

    catch(error){

        console.error(error);

        alert("Update Failed ❌");

    }

});



// ===============================
// Start
// ===============================

loadProducts();