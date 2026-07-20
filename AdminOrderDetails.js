// ===============================
// Urban Threads
// Admin Order Details
// Part 1
// ===============================

import { database } from "./Firebase.js";

import {
    ref,
    get,
    update
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-database.js";


// ===============================
// Elements
// ===============================

const container =
document.getElementById("orderDetails");

const params =
new URLSearchParams(window.location.search);

const orderId =
params.get("id");


// ===============================
// Load Order
// ===============================

async function loadOrder(){

    const snapshot =
    await get(
        ref(database,`orders/${orderId}`)
    );

    if(!snapshot.exists()){

        container.innerHTML =
        "Order not found";

        return;

    }

    const order =
    snapshot.val();

    container.innerHTML = `
    
<h2>Customer Information</h2>

<p><strong>Name:</strong> ${order.customerName}</p>

<p><strong>Phone:</strong> ${order.phone}</p>

<p><strong>Address:</strong> ${order.address}</p>

<hr>

<h2>Order Information</h2>

<p><strong>Status:</strong> ${order.status}</p>

<p><strong>Payment Method:</strong> ${order.paymentMethod}</p>

<p><strong>Payment Status:</strong> ${order.paymentStatus}</p>

<p><strong>Total:</strong> PKR ${Number(order.totalAmount).toLocaleString()}</p>

${
order.paymentMethod === "jazzcash"

?

`

<h3>Payment Receipt</h3>

<a
href="${order.paymentReceipt}"
target="_blank"
>

<img
src="${order.paymentReceipt}"
style="
width:250px;
border-radius:10px;
cursor:pointer;
box-shadow:0 0 10px rgba(0,0,0,.15);
">

</a>

`

:

`

<p>

<b>Cash On Delivery Order</b>

</p>

`

}

<hr>

<h2>Products</h2>

${order.products.map(product=>`

<div style="margin-bottom:20px;">

<img
src="${product.image}"
style="
width:90px;
border-radius:8px;
">

<p>

<b>${product.name}</b>

</p>

<p>

Quantity :
${product.quantity}

</p>

<p>

PKR
${Number(product.price).toLocaleString()}

</p>

</div>

`).join("")}

<hr>

<h2>Payment Verification</h2>

<div
style="
display:flex;
gap:15px;
margin-top:20px;
">

<button id="verifyPaymentBtn">

✅ Verify Payment

</button>

<button id="rejectPaymentBtn">

❌ Reject Payment

</button>

</div>

`;

    // ===============================
    // Payment Verification Buttons
    // ===============================

    const verifyBtn =
    document.getElementById("verifyPaymentBtn");

    const rejectBtn =
    document.getElementById("rejectPaymentBtn");

    if(verifyBtn){

        verifyBtn.addEventListener("click", async()=>{

            try{

                await update(

                    ref(database,`orders/${orderId}`),

                    {

                        paymentStatus:"Verified",

                        status:"Confirmed"

                    }

                );

                alert("Payment Verified ✅");

                loadOrder();

            }

            catch(error){

                console.error(error);

                alert("Verification Failed ❌");

            }

        });

    }

    if(rejectBtn){

        rejectBtn.addEventListener("click", async()=>{

            try{

                await update(

                    ref(database,`orders/${orderId}`),

                    {

                        paymentStatus:"Rejected",

                        status:"Payment Failed"

                    }

                );

                alert("Payment Rejected ❌");

                loadOrder();

            }

            catch(error){

                console.error(error);

                alert("Rejection Failed ❌");

            }

        });

    }

}

// ===============================
// Start
// ===============================

loadOrder();