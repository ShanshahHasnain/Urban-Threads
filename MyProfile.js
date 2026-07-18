// ===============================
// Urban Threads - MyProfile.js
// ===============================

import { auth } from "./Firebase.js";
import {
    onAuthStateChanged,
    updateProfile
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";

const profileName = document.getElementById("profileName");
const profileEmail = document.getElementById("profileEmail");
const profileUid = document.getElementById("profileUid");
const editProfileBtn = document.getElementById("editProfileBtn");
const saveProfileBtn = document.getElementById("saveProfileBtn");
const nameInput = document.getElementById("nameInput");

onAuthStateChanged(auth, (user) => {

    if (!user) {
        window.location.href = "Login.html";
        return;
    }

    profileName.textContent = user.displayName || "No Name";

    profileEmail.textContent = user.email;

    profileUid.textContent = user.uid;

    nameInput.value = user.displayName || "";

});

editProfileBtn.addEventListener("click", () => {

    nameInput.style.display = "block";
    saveProfileBtn.style.display = "inline-block";
    editProfileBtn.style.display = "none";

});

saveProfileBtn.addEventListener("click", async () => {

    if (nameInput.value.trim() === "") {
        showToast("❌ Name cannot be empty!");
        return;
    }

    await updateProfile(auth.currentUser, {
        displayName: nameInput.value
    });

    profileName.textContent = nameInput.value;

    showToast("✅ Profile updated successfully!");

    nameInput.style.display = "none";
    saveProfileBtn.style.display = "none";
    editProfileBtn.style.display = "inline-block";

    // Navbar name update
    const loginBtn = document.getElementById("loginBtn");
    if (loginBtn) {
        loginBtn.textContent = nameInput.value;
    }

});