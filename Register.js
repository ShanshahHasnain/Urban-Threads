// ===============================
// Urban Threads - Register.js
// ===============================

import { auth } from "./Firebase.js";

import {
    createUserWithEmailAndPassword,
    updateProfile
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";

const firstName = document.getElementById("firstName");
const email = document.getElementById("email");
const password = document.getElementById("password");
const confirmPassword = document.getElementById("confirmPassword");

const togglePassword = document.getElementById("togglePassword");
const toggleConfirmPassword = document.getElementById("toggleConfirmPassword");

togglePassword.addEventListener("click", () => {

    if (password.type === "password") {
        password.type = "text";
        togglePassword.classList.replace("fa-eye", "fa-eye-slash");
    } else {
        password.type = "password";
        togglePassword.classList.replace("fa-eye-slash", "fa-eye");
    }

});

toggleConfirmPassword.addEventListener("click", () => {

    if (confirmPassword.type === "password") {
        confirmPassword.type = "text";
        toggleConfirmPassword.classList.replace("fa-eye", "fa-eye-slash");
    } else {
        confirmPassword.type = "password";
        toggleConfirmPassword.classList.replace("fa-eye-slash", "fa-eye");
    }

});

const registerForm = document.getElementById("registerForm");

registerForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    if (!registerForm.checkValidity()) {
        registerForm.reportValidity();
        return;
    }

    if (password.value !== confirmPassword.value) {
        showToast("❌ Passwords do not match!");
        return;
    }

    try {

        const userCredential = await createUserWithEmailAndPassword(
            auth,
            email.value,
            password.value
        );

        await updateProfile(userCredential.user, {
            displayName: firstName.value
        });

        window.showToast("Account Created Successfully!");

        setTimeout(() => {
            window.location.href = "Login.html";
        }, 2000);

    } catch (error) {

        window.showToast(error.message);

    }

});