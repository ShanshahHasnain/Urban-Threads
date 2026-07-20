// ===============================
// Urban Threads Checkout.js
// Part 1
// ===============================

import { auth, database } from "./Firebase.js";

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

const orderSummary =
document.getElementById("orderSummary");

const checkoutTotal =
document.getElementById("checkoutTotal");

const placeOrderBtn =
document.getElementById("placeOrderBtn");

const customerName =
document.getElementById("customerName");

const customerPhone =
document.getElementById("customerPhone");

const customerAddress =
document.getElementById("customerAddress");


// ===============================
// Payment Elements
// ===============================

const paymentMethods =
document.querySelectorAll(
'input[name="paymentMethod"]'
);

const jazzcashSection =
document.getElementById("jazzcashSection");

const paymentReceipt =
document.getElementById("paymentReceipt");


// ===============================
// Get Cart
// ===============================

const cart =
JSON.parse(
localStorage.getItem("cart")
) || [];

let total = 0;


// ===============================
// Payment Toggle
// ===============================

paymentMethods.forEach(method=>{

    method.addEventListener("change",()=>{

        if(method.value==="jazzcash" && method.checked){

            jazzcashSection.style.display="block";

        }

        else{

            jazzcashSection.style.display="none";

        }

    });

});


// ===============================
// Show Order Summary
// ===============================

function showOrderSummary(){

    orderSummary.innerHTML="";

    total = 0;

    if(cart.length===0){

        orderSummary.innerHTML=`
        <p>Your cart is empty</p>
        `;

        checkoutTotal.textContent="0";

        return;

    }

    cart.forEach(product=>{

        const itemTotal =
        product.price * product.quantity;

        total += itemTotal;

        orderSummary.innerHTML += `

        <div class="order-item">

            <span>

            ${product.name}
            × ${product.quantity}

            </span>

            <span>

            PKR ${Number(itemTotal).toLocaleString()}

            </span>

        </div>

        `;

    });

    checkoutTotal.textContent =
    Number(total).toLocaleString();

}

showOrderSummary();


// ===============================
// Upload Receipt To Cloudinary
// ===============================

async function uploadReceipt(file){

    const formData = new FormData();

    formData.append("file",file);

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

    });

    const data =
    await response.json();

    if(!data.secure_url){

        throw new Error(
            "Receipt Upload Failed"
        );

    }

    return data.secure_url;

}

// ===============================
// Place Order
// Part 2
// ===============================

placeOrderBtn.addEventListener(

"click",

async()=>{

    const user =
    auth.currentUser;

    if(!user){

        alert(
        "Please login first"
        );

        window.location.href =
        "Login.html";

        return;

    }

    if(

    customerName.value.trim()==="" ||

    customerPhone.value.trim()==="" ||

    customerAddress.value.trim()===""

    ){

        alert(
        "Please fill all details"
        );

        return;

    }

    // ===============================
    // Payment Method
    // ===============================

    const paymentMethod =

    document.querySelector(

    'input[name="paymentMethod"]:checked'

    ).value;

    let paymentStatus =
    "Cash On Delivery";

    let receiptURL = "";

    // ===============================
    // JazzCash Validation
    // ===============================

    if(paymentMethod==="jazzcash"){

        if(paymentReceipt.files.length===0){

            alert(
            "Please upload payment receipt."
            );

            return;

        }

        try{

            placeOrderBtn.disabled=true;

            placeOrderBtn.textContent=
            "Uploading Receipt...";

            receiptURL =

            await uploadReceipt(

                paymentReceipt.files[0]

            );

            paymentStatus =
            "Pending Verification";

        }

        catch(error){

            console.error(error);

            alert(
            "Receipt upload failed."
            );

            placeOrderBtn.disabled=false;

            placeOrderBtn.textContent=
            "Place Order";

            return;

        }

    }

    // ===============================
    // Create Order
    // ===============================

    const orderRef =

    push(
        ref(database,"orders")
    );

    const orderID =
    orderRef.key;

    const order = {

        orderID:orderID,

        userID:user.uid,

        customerName:
        customerName.value,

        phone:
        customerPhone.value,

        address:
        customerAddress.value,

        products:cart,

        totalAmount:total,

        paymentMethod:
        paymentMethod,

        paymentStatus:
        paymentStatus,

        paymentReceipt:
        receiptURL,

        status:"Pending",

        date:
        new Date().toISOString()

    };

        // ===============================
    // Save Order
    // ===============================

    try{

        await set(

            orderRef,

            order

        );

        alert(
        "Order placed successfully 🎉"
        );

        localStorage.removeItem("cart");

        window.location.href =
        "MyOrders.html";

    }

    catch(error){

        console.error(error);

        alert(
        "Order failed ❌"
        );

        placeOrderBtn.disabled=false;

        placeOrderBtn.textContent=
        "Place Order";

    }

});