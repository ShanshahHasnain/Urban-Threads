// ===============================
// Urban Threads Admin Orders
// ===============================


import { database } from "./Firebase.js";


import {

    ref,
    get,
    update

} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-database.js";



const ordersTable =
    document.getElementById("ordersTable");



// ===============================
// Load Orders
// ===============================


async function loadOrders() {


    const snapshot =
        await get(
            ref(database, "orders")
        );



    ordersTable.innerHTML = "";



    if (!snapshot.exists()) {


        ordersTable.innerHTML =
            `
<tr>

<td colspan="6">
No Orders Found
</td>

</tr>
`;

        return;


    }



    const orders =
        snapshot.val();



    Object.entries(orders)
        .reverse()
        .forEach(([id, order]) => {


            ordersTable.innerHTML += `


<tr>


<td>
${id}
</td>



<td>
${order.customerName || "Unknown"}
</td>



<td>
${order.products.length} Item(s)
</td>



<td>
PKR ${Number(order.totalAmount || order.total || 0).toLocaleString()}
</td>



<td>

<select id="status-${id}">

<option ${order.status == "Pending" ? "selected" : ""}>
Pending
</option>


<option ${order.status == "Confirmed" ? "selected" : ""}>
Confirmed
</option>


<option ${order.status == "Shipped" ? "selected" : ""}>
Shipped
</option>


<option ${order.status == "Delivered" ? "selected" : ""}>
Delivered
</option>


</select>


</td>




<td>

<button onclick="viewOrder('${id}')">
View
</button>


<button onclick="updateStatus('${id}')">
Update
</button>


</td>



</tr>


`;


        });


}



loadOrders();

// ===============================
// Update Order Status
// ===============================


window.updateStatus = async function (orderId) {


    const status =
        document.getElementById(`status-${orderId}`).value;



    try {


        await update(
            ref(database, `orders/${orderId}`),
            {
                status: status
            }
        );



        alert("Order status updated ✅");


        loadOrders();



    }


    catch (error) {


        console.error(error);


        alert("Status update failed ❌");


    }


}

// ===============================
// View Order Details
// ===============================


window.viewOrder = function(orderId){


    window.location.href =
    `AdminOrderDetails.html?id=${orderId}`;


}