// ===============================
// Urban Threads - AdminDashboard.js
// ===============================


import { auth, database } from "./Firebase.js";

import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";


import {
    ref,
    get
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-database.js";



// ===============================
// Admin Email
// ===============================

const ADMIN_EMAIL = "admin@urbanthreads.com";




// ===============================
// Security Check
// ===============================


onAuthStateChanged(auth, async (user) => {


    if (!user || user.email !== ADMIN_EMAIL) {


        alert("Access Denied ❌");


        window.location.href = "Home.html";


        return;


    }



    loadDashboard();


});




// ===============================
// Load Dashboard Data
// ===============================


async function loadDashboard() {


    try {


        // Users

        const usersSnapshot = await get(
            ref(database, "users")
        );


        let totalUsers = 0;


        if (usersSnapshot.exists()) {

            totalUsers =
                Object.keys(usersSnapshot.val()).length;

        }



        document.getElementById("totalUsers")
            .textContent = totalUsers;






        // Orders


        const ordersSnapshot = await get(
            ref(database, "orders")
        );


        let totalOrders = 0;

        let pendingOrders = 0;

        let revenue = 0;



        if (ordersSnapshot.exists()) {


            const orders =
                ordersSnapshot.val();

            const recentOrders =
                document.getElementById("recentOrders");


            recentOrders.innerHTML = "";



            Object.entries(orders)
                .slice(-5)
                .reverse()
                .forEach(([id, order]) => {


                    recentOrders.innerHTML += `

<tr>

<td>
${id}
</td>


<td>
${order.customerName || "Unknown"}
</td>


<td>
${order.status}
</td>


<td>
PKR ${Number(order.totalAmount || order.total || 0).toLocaleString()}
</td>


</tr>

`;


                });



            Object.values(orders).forEach(order => {


                totalOrders++;



                if (order.status === "Pending") {

                    pendingOrders++;

                }



                revenue += Number(
                    order.total || order.totalAmount || 0
                );



            });



        }




        document.getElementById("totalOrders")
            .textContent = totalOrders;



        document.getElementById("pendingOrders")
            .textContent = pendingOrders;



        document.getElementById("totalRevenue")
            .textContent =
            "PKR " + Number(revenue).toLocaleString();


    }


    catch (error) {


        console.error(error);


    }



}




// ===============================
// Logout
// ===============================


const logoutBtn =
    document.getElementById("logoutAdminBtn");



if (logoutBtn) {


    logoutBtn.addEventListener("click", async () => {


        await signOut(auth);


        window.location.href = "Login.html";


    });


}