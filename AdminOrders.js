// ===============================
// Urban Threads - AdminOrders.js
// ===============================

import { auth, database } from "./Firebase.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";

import {
    ref,
    get,
    update
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-database.js";

const ADMIN_EMAIL = "admin@urbanthreads.com";

// ===============================
// Admin Security
// ===============================

onAuthStateChanged(auth, (user) => {

    if (!user || user.email !== ADMIN_EMAIL) {

        alert("Access Denied!");

        window.location.href = "Home.html";

        return;

    }

    loadOrders();

});

// ===============================
// Load Orders
// ===============================

async function loadOrders() {

    const table = document.getElementById("ordersTable");

    table.innerHTML = "";

    const snapshot = await get(ref(database, "orders"));

    if (!snapshot.exists()) {

        table.innerHTML = `
        <tr>
            <td colspan="6">No Orders Found</td>
        </tr>
        `;

        return;

    }

    const orders = snapshot.val();

    Object.entries(orders).forEach(([orderId, order]) => {

        const row = document.createElement("tr");

        row.innerHTML = `

        <td>${orderId.slice(-6)}</td>

        <td>
            ${order.firstName} ${order.lastName}
            <br>
            <small>${order.email}</small>
        </td>

        <td>${order.products.length} Item(s)</td>

        <td>$${order.total}</td>

        <td>

            <select class="status-select" data-id="${orderId}">

                <option value="Pending" ${order.status == "Pending" ? "selected" : ""}>
                    Pending
                </option>

                <option value="Confirmed" ${order.status == "Confirmed" ? "selected" : ""}>
                    Confirmed
                </option>

                <option value="Shipped" ${order.status == "Shipped" ? "selected" : ""}>
                    Shipped
                </option>

                <option value="Delivered" ${order.status == "Delivered" ? "selected" : ""}>
                    Delivered
                </option>

            </select>

        </td>

        <td>

    <button
        class="view-btn"
        onclick="window.location.href='OrderDetails.html?id=${orderId}'">

        View

    </button>

    <button
        class="update-btn"
        data-id="${orderId}">

        Update

    </button>

</td>

        `;

        table.appendChild(row);

    });

    addUpdateEvents();

}

// ===============================
// Update Status
// ===============================

function addUpdateEvents() {

    const buttons = document.querySelectorAll(".update-btn");

    buttons.forEach(button => {

        button.addEventListener("click", async () => {

            const id = button.dataset.id;

            const status = document.querySelector(
                `.status-select[data-id="${id}"]`
            ).value;

            await update(ref(database, `orders/${id}`), {

                status: status

            });

            alert("Order Updated Successfully ✅");

        });

    });

}