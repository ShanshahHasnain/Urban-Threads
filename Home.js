// ==============================
// Urban Threads - Home.js
// ==============================

// Sticky Navbar

const header = document.querySelector(".header-position");
window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
        header.style.padding = "14px 60px";
        header.style.boxShadow = "0 10px 30px rgba(0,0,0,.20)";
    } else {
        header.style.padding = "18px 60px";
        header.style.boxShadow = "0 5px 20px rgba(0,0,0,.15)";
    }
});


// ==============================
// Active Navigation Link
// ==============================

const navLinks = document.querySelectorAll(".navbar a");
navLinks.forEach(link => {
    link.addEventListener("click", function () {
        navLinks.forEach(item => item.classList.remove("active"));
        this.classList.add("active");
    });
});


// ==============================
// Smooth Scroll
// ==============================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute("href"));
        if(target){
            target.scrollIntoView({
                behavior: "smooth"
            });
        }
    });
});


// ==============================
// Reveal Animation
// ==============================

const reveals = document.querySelectorAll(".reveal");
window.addEventListener("scroll", revealSection);
function revealSection(){
    reveals.forEach(section=>{
        const windowHeight = window.innerHeight;
        const revealTop = section.getBoundingClientRect().top;
        const revealPoint = 120;
        if(revealTop < windowHeight - revealPoint){
            section.classList.add("active");
        }
    });
}


// ==============================
// Scroll To Top Button
// ==============================

const scrollBtn = document.createElement("button");
scrollBtn.innerHTML = "↑";
scrollBtn.classList.add("scroll-top");
document.body.appendChild(scrollBtn);
window.addEventListener("scroll",()=>{
    if(window.scrollY > 400){
        scrollBtn.classList.add("show");
    }else{
        scrollBtn.classList.remove("show");
    }
});


scrollBtn.addEventListener("click",()=>{
    window.scrollTo({
        top:0,
        behavior:"smooth"
    });
});