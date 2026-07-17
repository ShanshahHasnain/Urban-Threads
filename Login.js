// ===============================
// Urban Threads - Login.js
// ===============================

// Show / Hide Password

import { auth } from "./Firebase.js";

import {
    signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";

const email = document.getElementById("email");
const password = document.getElementById("password");
const togglePassword = document.getElementById("togglePassword");

togglePassword.addEventListener("click", () => {

    if (password.type === "password") {

        password.type = "text";

        togglePassword.classList.remove("fa-eye");
        togglePassword.classList.add("fa-eye-slash");

    } else {

        password.type = "password";

        togglePassword.classList.remove("fa-eye-slash");
        togglePassword.classList.add("fa-eye");

    }

});

// ===============================
// Login Form
// ===============================

const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    if (!loginForm.checkValidity()) {

        loginForm.reportValidity();
        return;

    }

    try {

        await signInWithEmailAndPassword(

            auth,
            email.value,
            password.value

        );

        window.showToast("Login Successful!");

        setTimeout(() => {

            window.location.href = "Home.html";

        }, 2000);

    } catch (error) {

    let message = "";

    switch (error.code) {

        case "auth/invalid-credential":
            message = "❌ Invalid email or password!";
            break;

        case "auth/user-not-found":
            message = "❌ Account not found!";
            break;

        case "auth/wrong-password":
            message = "❌ Incorrect password!";
            break;

        case "auth/invalid-email":
            message = "❌ Invalid email format!";
            break;

        case "auth/too-many-requests":
            message = "⏳ Too many attempts. Try again later.";
            break;

        default:
            message = "❌ " + error.message;
    }

    window.showToast(message);

    console.error(error);

}

});

