// ===============================
// Urban Threads Add Product
// Cloudinary Image Upload
// ===============================


import { database } from "./Firebase.js";


import {

ref,
push,
set

} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-database.js";



// ===============================
// Cloudinary Configuration
// ===============================


const CLOUD_NAME = "hu3qebkm";

const UPLOAD_PRESET = "urban_threads";




// ===============================
// Elements
// ===============================


const saveBtn =
document.getElementById("saveProductBtn");


// ===============================
// Image Preview
// ===============================

const imageInput =
document.getElementById("productImage");

const imagePreview =
document.getElementById("imagePreview");

imageInput.addEventListener("change", () => {

    const file =
    imageInput.files[0];

    if(!file){

        imagePreview.src = "";

        return;

    }

    imagePreview.src =
    URL.createObjectURL(file);

});


// ===============================
// Upload Image To Cloudinary
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



    if(!data.secure_url){

        throw new Error(
            "Image upload failed"
        );

    }



    return data.secure_url;


}




// ===============================
// Save Product
// ===============================


saveBtn.addEventListener(
"click",

async()=>{


    try{


        const imageFile =
        document.getElementById("productImage").files[0];



        if(!imageFile){


            alert(
                "Please select product image ❌"
            );


            return;


        }




        // ===============================
        // Upload Image First
        // ===============================


        saveBtn.textContent =
        "Uploading Image...";



        const imageURL =
        await uploadImage(imageFile);





        // ===============================
        // Product Data
        // ===============================


        const product = {


            name:
            document.getElementById("productName").value,



            category:
            document.getElementById("productCategory").value,



            price:
            Number(
            document.getElementById("productPrice").value
            ),



            stock:
            Number(
            document.getElementById("productStock").value
            ),



            image:
            imageURL,



            description:
            document.getElementById("productDescription").value,



            createdAt:
            new Date().toISOString()


        };





        if(

            !product.name ||

            !product.category ||

            !product.price ||

            !product.stock

        ){


            alert(
            "Please fill all required fields ❌"
            );


            saveBtn.textContent =
            "Save Product";


            return;


        }





        // ===============================
        // Save To Firebase
        // ===============================


        const productRef =
        push(

            ref(
                database,
                "products"
            )

        );



        await set(

            productRef,

            product

        );





        alert(
        "Product Added Successfully ✅"
        );



        window.location.href =
        "AdminProducts.html";



    }



    catch(error){


        console.error(error);



        alert(
        "Product Add Failed ❌"
        );



        saveBtn.textContent =
        "Save Product";


    }



});