import { auth, database } from "./Firebase.js";

import {
    ref,
    get
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-database.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";

const ordersList = document.getElementById("ordersList");

onAuthStateChanged(auth, async (user) => {

    if (!user) {
        window.location.href = "Login.html";
        return;
    }

    console.log("Logged In:", user.uid);

    const snapshot = await get(ref(database, "orders"));

    if (!snapshot.exists()) {

        ordersList.innerHTML = `
            <p>No orders found.</p>
        `;

        return;
    }

    const orders = snapshot.val();

    console.log(orders);

    ordersList.innerHTML = "";

    Object.entries(orders).forEach(([orderId, order]) => {

        if (order.userId !== user.uid) return;

        ordersList.innerHTML += `
        <div class="order-card">

            <h3>Order #${orderId.slice(-6)}</h3>

            <p>
    <strong>Status:</strong>
    <span class="status ${order.status.toLowerCase()}">
        ${order.status}
    </span>
</p>

            <p><strong>Total:</strong> $${order.total}</p>

            <p><strong>Date:</strong> ${new Date(order.orderDate).toLocaleDateString()}</p>

            <h4>Customer Details</h4>
            
            <p><strong>Name:</strong> ${order.firstName} ${order.lastName}</p>
            
            <p><strong>Email:</strong> ${order.email}</p>
            
            <p><strong>Phone:</strong> ${order.phone}</p>
            
        <p>
        
        <strong>Address:</strong>
        ${order.address},
        ${order.city},
        ${order.country},
        ${order.postalCode}
        
        </p>

            <h4>Products</h4>
            
            ${order.products.map(product => `
    
                <div class="order-product">
        
                <p>${product.name}</p>
        
                <p>Quantity: ${product.quantity}</p>
        
                <p>$${(product.price * product.quantity).toFixed(2)}</p>
    
            </div>
`).join("")}

        </div>
    `;

    });

});