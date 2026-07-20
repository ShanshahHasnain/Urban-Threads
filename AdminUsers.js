// ===============================
// Urban Threads Admin Users
// ===============================


import { database } from "./Firebase.js";


import {

ref,
get

} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-database.js";



const usersTable =
document.getElementById("usersTable");





// ===============================
// Load Users
// ===============================


async function loadUsers(){


    try{


        const snapshot =
        await get(
            ref(database,"users")
        );



        usersTable.innerHTML="";



        if(!snapshot.exists()){


            usersTable.innerHTML = `

            <tr>

            <td colspan="6">

            No Users Found

            </td>

            </tr>

            `;


            return;


        }





        snapshot.forEach(child=>{


            const user =
            child.val();



            const userId =
            child.key;




            usersTable.innerHTML += `


            <tr>


            <td>

            ${userId}

            </td>



            <td>

            ${user.firstName || ""} 
            ${user.lastName || ""}

            </td>



            <td>

            ${user.email || "N/A"}

            </td>




            <td>

            ${user.phone || "N/A"}

            </td>




            <td>

            ${user.country || "Pakistan"}

            </td>




            <td>


            <button 
            class="view-user-btn"
            onclick="viewUser('${userId}')">


            View


            </button>



            </td>




            </tr>


            `;



        });



    }



    catch(error){


        console.error(error);


    }



}






// ===============================
// View User
// ===============================


window.viewUser = function(id){



    window.location.href =
    `AdminUserDetails.html?id=${id}`;



}





loadUsers();