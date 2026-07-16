// ===============================
// Urban Threads Shop.js
// ===============================

const searchBox = document.getElementById("searchBox");

const categoryFilter = document.getElementById("categoryFilter");

const productCards = document.querySelectorAll(".product-card");


// ===============================
// Search Products
// ===============================

searchBox.addEventListener("keyup", () => {
    const value = searchBox.value.toLowerCase();
    productCards.forEach(card => {
        const name = card.dataset.name.toLowerCase();
        if(name.includes(value)){
            card.style.display = "block";
        }else{
            card.style.display = "none";
        }
    });
});


// ===============================
// Category Filter
// ===============================

categoryFilter.addEventListener("change",()=>{
    const value = categoryFilter.value;
    productCards.forEach(card=>{
        if(value==="all"){
            card.style.display="block";
        }
        else if(card.dataset.category===value){
            card.style.display="block";
        }
        else{
            card.style.display="none";
        }
    });
});

// ===============================
// Sort Products
// ===============================

const sortProducts = document.getElementById("sortProducts");
const productContainer = document.querySelector(".products-grid");
sortProducts.addEventListener("change", () => {
    const cards = Array.from(document.querySelectorAll(".product-card"));
    if (sortProducts.value === "low-high") {
        cards.sort((a, b) => {
            return Number(a.dataset.price) - Number(b.dataset.price);
        });
    }
    else if (sortProducts.value === "high-low") {
        cards.sort((a, b) => {
            return Number(b.dataset.price) - Number(a.dataset.price);
        });
    }
    cards.forEach(card => {

        productContainer.appendChild(card);
    });
});

// ===============================
// Add to Cart
// ===============================

const addToCartButtons = document.querySelectorAll(".cart-btn");
addToCartButtons.forEach(button => {
    button.addEventListener("click", () => {
        const card = button.closest(".product-card");
        const product = {
            id: card.dataset.id,
            name: card.dataset.name,
            price: parseFloat(card.dataset.price),
            category: card.dataset.category,
            image: card.dataset.image,
            quantity: 1
        };
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        const existingProduct = cart.find(item => item.id === product.id);
        if (existingProduct) {
            existingProduct.quantity++;
        } else {
            cart.push(product);
        }
        localStorage.setItem("cart", JSON.stringify(cart));
        updateCartCount();
        alert(product.name + " added to cart!");
    });
});


// ===============================
// Cart Counter
// ===============================

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const totalItems = cart.reduce((total, product) => {
        return total + product.quantity;
    }, 0);
    const cartCount = document.getElementById("cartCount");
    if (cartCount) {
        cartCount.textContent = totalItems;
    }
}
updateCartCount();
