// ===============================
// Urban Threads - MyProfile.js
// ===============================

import { auth, database } from "./Firebase.js";

import {
    onAuthStateChanged,
    updateProfile,
    updatePassword
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";

import {
    ref,
    get,
    set
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-database.js";


// ===============================
// HTML Elements
// ===============================

const profileName = document.getElementById("profileName");
const profileEmail = document.getElementById("profileEmail");

const firstName = document.getElementById("firstName");
const lastName = document.getElementById("lastName");
const phone = document.getElementById("phone");
const country = document.getElementById("country");
const city = document.getElementById("city");
const address = document.getElementById("address");
const postalCode = document.getElementById("postalCode");

const editProfileBtn = document.getElementById("editProfileBtn");
const saveProfileBtn = document.getElementById("saveProfileBtn");
const changePasswordBtn = document.getElementById("changePasswordBtn");

// ===============================
// Disable Inputs Initially
// ===============================

const inputs = [
    firstName,
    lastName,
    phone,
    country,
    city,
    address,
    postalCode
];

inputs.forEach(input => {
    input.disabled = true;
});

saveProfileBtn.style.display = "none";

// ===============================
// Authentication & Load Profile
// ===============================

onAuthStateChanged(auth, async (user) => {

    if (!user) {

        window.location.href = "Login.html";
        return;

    }

    profileName.textContent = user.displayName || "No Name";
    profileEmail.textContent = user.email;

    try {

        const snapshot = await get(
            ref(database, `users/${user.uid}`)
        );

        if (snapshot.exists()) {

            const data = snapshot.val();

            firstName.value = data.firstName || "";
            lastName.value = data.lastName || "";
            phone.value = data.phone || "";
            country.value = data.country || "";
            city.value = data.city || "";
            address.value = data.address || "";
            postalCode.value = data.postalCode || "";

        }

    } catch (error) {

        console.error(error);

        showToast("❌ Failed to load profile");

    }

});

// ===============================
// Edit Profile
// ===============================

editProfileBtn.addEventListener("click", () => {

    inputs.forEach(input => {
        input.disabled = false;
    });

    editProfileBtn.style.display = "none";

    saveProfileBtn.style.display = "inline-block";

});

// ===============================
// Save Profile
// ===============================

saveProfileBtn.addEventListener("click", async () => {

    const user = auth.currentUser;

    if (!user) return;

    try {

        await set(
            ref(database, `users/${user.uid}`),
            {
                firstName: firstName.value,
                lastName: lastName.value,
                phone: phone.value,
                country: country.value,
                city: city.value,
                address: address.value,
                postalCode: postalCode.value
            }
        );

        await updateProfile(user, {
            displayName: `${firstName.value} ${lastName.value}`
        });

        profileName.textContent = `${firstName.value} ${lastName.value}`;

        const loginBtn = document.getElementById("loginBtn");

        if (loginBtn) {
            loginBtn.textContent = `${firstName.value} ${lastName.value}`;
        }

        inputs.forEach(input => {
            input.disabled = true;
        });

        editProfileBtn.style.display = "inline-block";
        saveProfileBtn.style.display = "none";

        showToast("✅ Profile updated successfully!");

    } catch (error) {

        console.error(error);

        showToast("❌ Failed to update profile");

    }

});

