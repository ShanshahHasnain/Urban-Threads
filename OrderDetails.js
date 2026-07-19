// ===============================
// Urban Threads - OrderDetails.js
// ===============================

import { auth, database } from "./Firebase.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";

import {
    ref,
    get
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-database.js";

const ADMIN_EMAIL = "admin@urbanthreads.com";

const orderInfo = document.getElementById("orderInfo");

// ===============================
// Get Order ID
// ===============================

const params = new URLSearchParams(window.location.search);

const orderId = params.get("id");

// ===============================
// Security
// ===============================

onAuthStateChanged(auth, async(user)=>{

    if(!user || user.email !== ADMIN_EMAIL){

        window.location.href="Home.html";

        return;

    }

    loadOrder();

});

// ===============================
// Load Order
// ===============================

async function loadOrder(){

    const snapshot = await get(
        ref(database,`orders/${orderId}`)
    );

    if(!snapshot.exists()){

        orderInfo.innerHTML="<h2>Order Not Found</h2>";

        return;

    }

    const order = snapshot.val();

    let productsHTML="";

    order.products.forEach(product=>{

        productsHTML += `

        <div class="product-item">

            <h4>${product.name}</h4>

            <p><strong>Price:</strong> $${product.price}</p>

            <p><strong>Quantity:</strong> ${product.quantity}</p>

            <p><strong>Size:</strong> ${product.size}</p>

            <p><strong>Color:</strong> ${product.color}</p>

        </div>

        `;

    });

    orderInfo.innerHTML = `

    <div class="section">

        <h3>Customer Information</h3>

        <p class="info">
            <strong>Name:</strong>
            ${order.firstName} ${order.lastName}
        </p>

        <p class="info">
            <strong>Email:</strong>
            ${order.email}
        </p>

        <p class="info">
            <strong>Phone:</strong>
            ${order.phone}
        </p>

    </div>

    <div class="section">

        <h3>Shipping Address</h3>

        <p class="info">
            ${order.address}
        </p>

        <p class="info">
            ${order.city}
        </p>

        <p class="info">
            ${order.country}
        </p>

        <p class="info">
            ${order.postalCode}
        </p>

    </div>

    <div class="section">

        <h3>Products</h3>

        ${productsHTML}

    </div>

    <div class="section">

        <h3>Status</h3>

        <span class="status ${order.status}">
            ${order.status}
        </span>

    </div>

    <div class="total-box">

        <h2>Total : $${order.total}</h2>

    </div>

    `;

}