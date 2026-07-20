// ===============================
// Urban Threads Edit Product
// Cloudinary Image Update
// ===============================


import { database } from "./Firebase.js";


import {

ref,
get,
update

} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-database.js";




// ===============================
// Cloudinary Configuration
// ===============================


const CLOUD_NAME = "hu3qebkm";

const UPLOAD_PRESET = "urban_threads";




// ===============================
// Product ID
// ===============================


const params =
new URLSearchParams(window.location.search);


const productId =
params.get("id");




// ===============================
// Elements
// ===============================


const nameInput =
document.getElementById("productName");


const categoryInput =
document.getElementById("productCategory");


const priceInput =
document.getElementById("productPrice");


const stockInput =
document.getElementById("productStock");


const imageInput =
document.getElementById("productImage");


const currentImage =
document.getElementById("currentProductImage");


const descriptionInput =
document.getElementById("productDescription");


const updateBtn =
document.getElementById("updateProductBtn");




// ===============================
// Old Image URL
// ===============================


let oldImageURL = "";





// ===============================
// Upload Image Cloudinary
// ===============================


async function uploadImage(file){


    const formData =
    new FormData();


    formData.append(
        "file",
        file
    );


    formData.append(
        "upload_preset",
        UPLOAD_PRESET
    );



    const response =
    await fetch(

        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,

        {

            method:"POST",

            body:formData

        }

    );



    const data =
    await response.json();



    return data.secure_url;


}







// ===============================
// Load Product
// ===============================


async function loadProduct(){


    try{


        const snapshot =
        await get(

            ref(
                database,
                `products/${productId}`
            )

        );



        if(!snapshot.exists()){


            alert(
                "Product not found ❌"
            );


            return;


        }



        const product =
        snapshot.val();




        nameInput.value =
        product.name;



        categoryInput.value =
        product.category;



        priceInput.value =
        product.price;



        stockInput.value =
        product.stock;




        oldImageURL =
        product.image;



        currentImage.src =
        product.image;



        descriptionInput.value =
        product.description;



    }



    catch(error){


        console.error(error);


    }



}








// ===============================
// Update Product
// ===============================


updateBtn.addEventListener(

"click",

async()=>{


    try{


        let imageURL =
        oldImageURL;



        // New image selected?

        if(imageInput.files.length > 0){


            updateBtn.textContent =
            "Uploading Image...";



            imageURL =
            await uploadImage(

                imageInput.files[0]

            );


        }





        const updatedProduct = {


            name:
            nameInput.value,



            category:
            categoryInput.value,



            price:
            Number(
                priceInput.value
            ),



            stock:
            Number(
                stockInput.value
            ),



            image:
            imageURL,



            description:
            descriptionInput.value,



            updatedAt:
            new Date().toISOString()


        };






        await update(

            ref(
                database,
                `products/${productId}`
            ),


            updatedProduct

        );





        alert(
            "Product Updated Successfully ✅"
        );



        window.location.href =
        "AdminProducts.html";



    }



    catch(error){


        console.error(error);


        alert(
            "Update Failed ❌"
        );


        updateBtn.textContent =
        "Update Product";


    }



});





loadProduct();