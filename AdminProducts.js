// ===============================
// Urban Threads Admin Products
// ===============================


import { database } from "./Firebase.js";


import {

ref,
get,
remove

} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-database.js";



const productsTable =
document.getElementById("productsTable");




// ===============================
// Load Products
// ===============================


async function loadProducts(){


    try{


        const snapshot =
        await get(
            ref(database,"products")
        );



        productsTable.innerHTML="";



        if(!snapshot.exists()){


            productsTable.innerHTML = `

            <tr>

            <td colspan="6">

            No Products Found

            </td>

            </tr>

            `;


            return;


        }



        snapshot.forEach(child=>{


            const product =
            child.val();



            const id =
            child.key;



            productsTable.innerHTML += `


            <tr>


            <td>

            <img src="${product.image}">

            </td>



            <td>

            ${product.name}

            </td>



            <td>

            ${product.category}

            </td>



            <td>

            PKR ${Number(product.price).toLocaleString()}

            </td>



            <td>

            ${product.stock}

            </td>



            <td>


            <button 
            class="action-btn edit-btn"
            onclick="editProduct('${id}')">

            Edit

            </button>



            <button 
            class="action-btn delete-btn"
            onclick="deleteProduct('${id}')">

            Delete

            </button>



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
// Delete Product
// ===============================


window.deleteProduct = async function(id){



    const confirmDelete =
    confirm(
        "Delete this product?"
    );



    if(!confirmDelete)
    return;



    try{


        await remove(
            ref(database,`products/${id}`)
        );



        alert(
            "Product Deleted ✅"
        );



        loadProducts();



    }


    catch(error){


        console.error(error);


        alert(
            "Delete Failed ❌"
        );


    }



}




// ===============================
// Edit Product
// ===============================


window.editProduct = function(id){


    window.location.href =
    `EditProduct.html?id=${id}`;


}




loadProducts();

window.addProductPage = function(){

    window.location.href="AddProduct.html";

}