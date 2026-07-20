// ===============================
// Urban Threads Admin User Details
// ===============================


import { database } from "./Firebase.js";


import {

ref,
get

} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-database.js";





// ===============================
// Get User ID
// ===============================


const params =
new URLSearchParams(window.location.search);



const userId =
params.get("id");





// Elements


const userName =
document.getElementById("userName");


const userEmail =
document.getElementById("userEmail");


const userPhone =
document.getElementById("userPhone");


const userCountry =
document.getElementById("userCountry");


const userIdElement =
document.getElementById("userId");


const ordersTable =
document.getElementById("ordersTable");





// ===============================
// Load User Details
// ===============================


async function loadUser(){


    try{


        const snapshot =
        await get(
            ref(database,`users/${userId}`)
        );



        if(!snapshot.exists()){


            userName.textContent =
            "User Not Found";


            return;


        }



        const user =
        snapshot.val();




        userName.textContent =
        `${user.firstName || ""} ${user.lastName || ""}`;



        userEmail.textContent =
        user.email || "N/A";



        userPhone.textContent =
        user.phone || "N/A";



        userCountry.textContent =
        user.country || "Pakistan";



        userIdElement.textContent =
        userId;



    }



    catch(error){


        console.error(error);


    }



}







// ===============================
// Load User Orders
// ===============================


async function loadOrders(){



    try{


        const snapshot =
        await get(
            ref(database,"orders")
        );



        ordersTable.innerHTML="";



        if(!snapshot.exists()){


            ordersTable.innerHTML = `

            <tr>

            <td colspan="4">

            No Orders Found

            </td>

            </tr>

            `;


            return;


        }






        snapshot.forEach(child=>{


            const order =
            child.val();



            if(order.userId === userId){



                ordersTable.innerHTML += `


                <tr>


                <td>

                ${child.key}

                </td>



                <td>

                ${
                new Date(order.orderDate)
                .toLocaleDateString()
                }

                </td>



                <td>

                ${order.status || "Pending"}

                </td>



                <td>

                $${order.total || 0}

                </td>



                </tr>


                `;



            }



        });




    }



    catch(error){


        console.error(error);


    }


}





loadUser();

loadOrders();